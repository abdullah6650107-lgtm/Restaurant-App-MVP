const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");
const path = require("node:path");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

const BACKEND_DIRECTORY = path.dirname(require.resolve("./server.js"));
dotenv.config({ path: path.join(BACKEND_DIRECTORY, ".env") });

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const DELIVERY_FEE = Number(process.env.DELIVERY_FEE) || 120;
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 1024 * 1024;
const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1544025162-d76694265947";
const ORDER_STATUSES = ["Confirmed", "Preparing", "On the Way", "Delivered", "Cancelled"];
const PAYMENT_METHODS = ["Cash on Delivery", "Card", "Easypaisa"];

const DEFAULT_MENU = [
	{
		id: "1",
		name: "Chicken Burger",
		category: "Burgers",
		price: 450,
		image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
	},
	{
		id: "2",
		name: "Chicken Pizza",
		category: "Pizza",
		price: 900,
		image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
	},
	{
		id: "3",
		name: "French Fries",
		category: "Sides",
		price: 250,
		image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
	},
	{
		id: "4",
		name: "Chocolate Cake",
		category: "Desserts",
		price: 350,
		image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
	},
	{
		id: "5",
		name: "Cold Drink",
		category: "Drinks",
		price: 150,
		image: "https://images.unsplash.com/photo-1544145945-f90425340c7e",
	},
];

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${hash}`;
}

function passwordMatches(password, storedHash) {
	if (typeof storedHash !== "string") return false;
	const [salt, expectedHex] = storedHash.split(":");
	if (!salt || !expectedHex) return false;

	const actual = crypto.scryptSync(password, salt, 64);
	const expected = Buffer.from(expectedHex, "hex");
	return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function isValidMenuItem(item) {
	return Boolean(
		item &&
		typeof item.id === "string" &&
		typeof item.name === "string" &&
		item.name.trim() &&
		typeof item.category === "string" &&
		item.category.trim() &&
		Number.isFinite(Number(item.price)) &&
		Number(item.price) > 0
	);
}
function makeDefaultStore() {
	const now = new Date().toISOString();
	return {
		users: [
			{
				id: "1",
				name: "Abdullah",
				email: "customer@example.com",
				passwordHash: hashPassword("Customer123"),
				role: "customer",
				createdAt: now,
			},
			{
				id: "2",
				name: "Restaurant Manager",
				email: "manager@example.com",
				passwordHash: hashPassword("Manager123"),
				role: "manager",
				createdAt: now,
			},
		],
		menu: DEFAULT_MENU.map((item) => ({ ...item })),
		orders: [],
		reservations: [],
		reviews: [],
	};
}

function publicUser(user) {
	const { passwordHash, ...safeUser } = user;
	return safeUser;
}

function httpError(status, message) {
	const error = new Error(message);
	error.status = status;
	return error;
}

function sendJson(response, status, data) {
	response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
	response.end(JSON.stringify(data));
}

function setCorsHeaders(response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

async function readJsonBody(request) {
	const chunks = [];
	let size = 0;

	for await (const chunk of request) {
		size += chunk.length;
		if (size > MAX_BODY_BYTES) throw httpError(413, "Request body is too large.");
		chunks.push(chunk);
	}

	if (!size) return {};

	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw httpError(400, "Request body must be valid JSON.");
	}
}

function requireText(value, label, maxLength = 200) {
	if (typeof value !== "string" || !value.trim()) {
		throw httpError(400, `${label} is required.`);
	}
	if (value.trim().length > maxLength) {
		throw httpError(400, `${label} must be ${maxLength} characters or fewer.`);
	}
	return value.trim();
}

function requirePrice(value) {
	const price = Number(value);
	if (!Number.isFinite(price) || price <= 0 || price > 1000000) {
		throw httpError(400, "Price must be a positive number up to 1,000,000.");
	}
	return Math.round(price * 100) / 100;
}

function requireImageUrl(value) {
	const image = requireText(value, "Image URL", 2048);
	let parsedUrl;
	try {
		parsedUrl = new URL(image);
	} catch {
		throw httpError(400, "Image URL must be a valid HTTP or HTTPS URL.");
	}
	if (!["http:", "https:"].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
		throw httpError(400, "Image URL must be a valid HTTP or HTTPS URL.");
	}
	return image;
}

function validDate(date) {
	if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
	const parsed = new Date(`${date}T00:00:00.000Z`);
	return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function createApp(options = {}) {
	const mongoUri = options.mongoUri || process.env.MONGODB_URI;
	const databaseName = options.databaseName || process.env.MONGODB_DATABASE || "restaurantapp";
	const legacyDataFile = options.legacyDataFile || path.join(BACKEND_DIRECTORY, "data", "db.json");
	const tokens = new Map();
	const collectionNames = ["users", "menu", "orders", "reservations", "reviews"];
	let mongoClient = options.mongoClient || null;
	let database = options.database || null;
	let store;
	let writeQueue = Promise.resolve();

	async function persistStore() {
		const snapshot = Object.fromEntries(collectionNames.map((name) => [name, store[name].map((record) => ({ ...record }))]));
		writeQueue = writeQueue.catch(() => undefined).then(async () => {
			for (const name of collectionNames) {
				const collection = database.collection(name);
				const documents = snapshot[name].map(({ id, ...fields }) => ({ _id: String(id), ...fields }));
				if (documents.length) {
					await collection.bulkWrite(documents.map(({ _id, ...fields }) => ({
						updateOne: {
							filter: { _id },
							update: { $set: fields },
							upsert: true,
						},
					})), { ordered: false });
					await collection.deleteMany({ _id: { $nin: documents.map((document) => document._id) } });
				} else {
					await collection.deleteMany({});
				}
			}
		});
		return writeQueue;
	}

	async function loadStore() {
		if (!database) {
			if (!mongoUri) throw new Error("MONGODB_URI is missing. Set it in Backend/.env or the environment.");
			mongoClient = mongoClient || new MongoClient(mongoUri, {
				serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 15000,
			});
			await mongoClient.connect();
			database = mongoClient.db(databaseName);
		}

		const collections = await Promise.all(collectionNames.map(async (name) => {
			const collection = database.collection(name);
			const documents = await collection.find({}).toArray();
			return [name, documents.map(({ _id, ...fields }) => ({ ...fields, id: String(_id) }))];
		}));
		const saved = Object.fromEntries(collections);
		const isDatabaseEmpty = collectionNames.every((name) => saved[name].length === 0);

		if (isDatabaseEmpty) {
			try {
				const legacyStore = JSON.parse(await fs.readFile(legacyDataFile, "utf8"));
				store = {
					...makeDefaultStore(),
					...legacyStore,
					users: Array.isArray(legacyStore.users) ? legacyStore.users : [],
					menu: Array.isArray(legacyStore.menu) ? legacyStore.menu : [],
					orders: Array.isArray(legacyStore.orders) ? legacyStore.orders : [],
					reservations: Array.isArray(legacyStore.reservations) ? legacyStore.reservations : [],
					reviews: Array.isArray(legacyStore.reviews) ? legacyStore.reviews : [],
				};
			} catch (error) {
				if (error.code !== "ENOENT") throw error;
				store = makeDefaultStore();
			}
			store.users = store.users.map((user) => {
				if (user.passwordHash) return user;
				const { password, ...safeUser } = user;
				return typeof password === "string"
					? { ...safeUser, passwordHash: hashPassword(password) }
					: safeUser;
			});
			await persistStore();
		} else {
			store = saved;
		}

		await database.collection("users").createIndex({ email: 1 }, { unique: true });
	}

	function getAuthenticatedUser(request) {
		const authorization = request.headers.authorization || "";
		const match = authorization.match(/^Bearer\s+(.+)$/i);
		if (!match) throw httpError(401, "Authentication is required.");

		const session = tokens.get(match[1]);
		if (!session || session.expiresAt <= Date.now()) {
			tokens.delete(match[1]);
			throw httpError(401, "Your session is invalid or expired. Please log in again.");
		}

		const user = store.users.find((entry) => entry.id === session.userId);
		if (!user) throw httpError(401, "The account for this session no longer exists.");
		return user;
	}

	function requireManager(user) {
		if (user.role !== "manager") throw httpError(403, "Manager access is required.");
	}

	function createSession(user) {
		const token = crypto.randomBytes(32).toString("hex");
		const expiresAt = Date.now() + TOKEN_TTL_MS;
		tokens.set(token, { userId: user.id, expiresAt });
		return { token, expiresAt: new Date(expiresAt).toISOString() };
	}

	async function handleRequest(request, response) {
		setCorsHeaders(response);
		if (request.method === "OPTIONS") {
			response.writeHead(204);
			response.end();
			return;
		}

		const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
		const segments = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
		const method = request.method;
		const body = ["POST", "PATCH", "PUT"].includes(method) ? await readJsonBody(request) : {};

		if (method === "GET" && url.pathname === "/health") {
			sendJson(response, 200, { status: "ok", service: "bite-and-bliss-api" });
			return;
		}

		if (segments[0] !== "api") throw httpError(404, "Route not found.");

		if (segments[1] === "auth" && segments[2] === "register" && method === "POST") {
			const name = requireText(body.name, "Name");
			const email = requireText(body.email, "Email", 254).toLowerCase();
			const password = body.password;
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw httpError(400, "Enter a valid email address.");
			if (typeof password !== "string" || password.length < 8 || !/\d/.test(password)) {
				throw httpError(400, "Password must be at least 8 characters and contain a digit.");
			}
			if (body.role && body.role !== "customer") {
				throw httpError(403, "New accounts can only be registered as customers.");
			}
			if (store.users.some((user) => user.email === email)) throw httpError(409, "An account with this email already exists.");

			const user = {
				id: crypto.randomUUID(),
				name,
				email,
				passwordHash: hashPassword(password),
				role: "customer",
				createdAt: new Date().toISOString(),
			};
			store.users.push(user);
			await persistStore();
			const session = createSession(user);
			sendJson(response, 201, { user: publicUser(user), ...session });
			return;
		}

		if (segments[1] === "auth" && segments[2] === "login" && method === "POST") {
			const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
			const password = typeof body.password === "string" ? body.password : "";
			const user = store.users.find((entry) => entry.email === email && passwordMatches(password, entry.passwordHash));
			if (!user) throw httpError(401, "Invalid email or password.");
			const session = createSession(user);
			sendJson(response, 200, { user: publicUser(user), ...session });
			return;
		}

		if (segments[1] === "auth" && segments[2] === "logout" && method === "POST") {
			const authorization = request.headers.authorization || "";
			const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
			if (token) tokens.delete(token);
			sendJson(response, 200, { message: "Logged out." });
			return;
		}

		if (segments[1] === "menu" && method === "GET") {
			if (segments.length === 2) {
				const query = (url.searchParams.get("q") || "").trim().toLowerCase();
				const category = url.searchParams.get("category");
				const items = store.menu.filter((item) =>
					isValidMenuItem(item) &&
					(!category || category === "All" || item.category === category) &&
					(!query || item.name.toLowerCase().includes(query))
				);
				sendJson(response, 200, { items });
				return;
			}
			if (segments[2] === "categories" && segments.length === 3) {
				const categories = [...new Set(store.menu.filter(isValidMenuItem).map((item) => item.category))];
				sendJson(response, 200, { categories });
				return;
			}
		}

		if (segments[1] === "menu" && segments.length === 2 && method === "POST") {
			const user = getAuthenticatedUser(request);
			requireManager(user);
			const product = {
				id: crypto.randomUUID(),
				name: requireText(body.name, "Product name"),
				category: requireText(body.category, "Category", 80),
				price: requirePrice(body.price),
				image: typeof body.image === "string" && body.image.trim()
					? requireImageUrl(body.image)
					: DEFAULT_PRODUCT_IMAGE,
			};
			store.menu.unshift(product);
			await persistStore();
			sendJson(response, 201, { item: product });
			return;
		}

		if (segments[1] === "menu" && segments.length === 3 && ["PATCH", "DELETE"].includes(method)) {
			const user = getAuthenticatedUser(request);
			requireManager(user);
			const index = store.menu.findIndex((item) => item.id === segments[2]);
			if (index < 0) throw httpError(404, "Menu item not found.");

			if (method === "DELETE") {
				const [item] = store.menu.splice(index, 1);
				await persistStore();
				sendJson(response, 200, { item });
				return;
			}

			const item = store.menu[index];
			if (body.name !== undefined) item.name = requireText(body.name, "Product name");
			if (body.category !== undefined) item.category = requireText(body.category, "Category", 80);
			if (body.price !== undefined) item.price = requirePrice(body.price);
			if (body.image !== undefined) item.image = requireImageUrl(body.image);
			await persistStore();
			sendJson(response, 200, { item });
			return;
		}

		if (segments[1] === "profile" && method === "GET") {
			const user = getAuthenticatedUser(request);
			sendJson(response, 200, { user: publicUser(user) });
			return;
		}

		if (segments[1] === "profile" && method === "PATCH") {
			const user = getAuthenticatedUser(request);
			if (body.name !== undefined) user.name = requireText(body.name, "Name");
			if (body.email !== undefined) {
				const email = requireText(body.email, "Email", 254).toLowerCase();
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw httpError(400, "Enter a valid email address.");
				if (store.users.some((entry) => entry.id !== user.id && entry.email === email)) {
					throw httpError(409, "An account with this email already exists.");
				}
				user.email = email;
			}
			await persistStore();
			sendJson(response, 200, { user: publicUser(user) });
			return;
		}

		if (segments[1] === "orders" && segments.length === 2 && method === "GET") {
			const user = getAuthenticatedUser(request);
			const orders = user.role === "manager"
				? store.orders
				: store.orders.filter((order) => order.userId === user.id);
			sendJson(response, 200, { orders: [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt)) });
			return;
		}

		if (segments[1] === "orders" && segments.length === 2 && method === "POST") {
			const user = getAuthenticatedUser(request);
			if (!Array.isArray(body.items) || body.items.length === 0) throw httpError(400, "Add at least one item to the order.");
			const quantities = new Map();
			for (const entry of body.items) {
				const itemId = String(entry?.id || "");
				const quantity = Number(entry?.quantity);
				if (!itemId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
					throw httpError(400, "Each order item needs a valid id and quantity from 1 to 99.");
				}
				quantities.set(itemId, (quantities.get(itemId) || 0) + quantity);
			}

			const items = [...quantities.entries()].map(([id, quantity]) => {
				const product = store.menu.find((item) => item.id === id);
				if (!product) throw httpError(400, `Menu item ${id} is unavailable.`);
				return { ...product, quantity };
			});
			const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
			const paymentMethod = requireText(body.paymentMethod, "Payment method", 50);
			if (!PAYMENT_METHODS.includes(paymentMethod)) throw httpError(400, "Select a supported payment method.");
			const order = {
				id: crypto.randomUUID(),
				userId: user.id,
				customerName: requireText(body.customerName, "Customer name"),
				address: requireText(body.address, "Delivery address", 500),
				paymentMethod,
				items,
				subtotal,
				deliveryFee: DELIVERY_FEE,
				total: subtotal + DELIVERY_FEE,
				status: "Confirmed",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			store.orders.unshift(order);
			await persistStore();
			sendJson(response, 201, { order });
			return;
		}

		if (segments[1] === "orders" && segments.length === 4 && segments[3] === "status" && method === "PATCH") {
			const user = getAuthenticatedUser(request);
			requireManager(user);
			if (!ORDER_STATUSES.includes(body.status)) throw httpError(400, "Select a valid order status.");
			const order = store.orders.find((entry) => entry.id === segments[2]);
			if (!order) throw httpError(404, "Order not found.");
			order.status = body.status;
			order.updatedAt = new Date().toISOString();
			await persistStore();
			sendJson(response, 200, { order });
			return;
		}

		if (segments[1] === "reservations" && segments.length === 2 && method === "GET") {
			const user = getAuthenticatedUser(request);
			const reservations = user.role === "manager"
				? store.reservations
				: store.reservations.filter((reservation) => reservation.userId === user.id);
			sendJson(response, 200, { reservations: [...reservations].sort((left, right) => right.createdAt.localeCompare(left.createdAt)) });
			return;
		}

		if (segments[1] === "reservations" && segments.length === 2 && method === "POST") {
			const user = getAuthenticatedUser(request);
			const name = requireText(body.name, "Name");
			if (!validDate(body.date)) throw httpError(400, "Date must be a valid date in YYYY-MM-DD format.");
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (new Date(`${body.date}T00:00:00`) < today) throw httpError(400, "Reservations cannot be made for a past date.");
			const guests = Number(body.guests);
			if (!Number.isInteger(guests) || guests < 1 || guests > 12) throw httpError(400, "Guest count must be from 1 to 12.");
			const reservation = {
				id: crypto.randomUUID(),
				userId: user.id,
				name,
				date: body.date,
				time: requireText(body.time, "Time", 40),
				guests,
				status: "Confirmed",
				createdAt: new Date().toISOString(),
			};
			store.reservations.unshift(reservation);
			await persistStore();
			sendJson(response, 201, { reservation });
			return;
		}

		if (segments[1] === "reservations" && segments.length === 3 && method === "DELETE") {
			const user = getAuthenticatedUser(request);
			const index = store.reservations.findIndex((entry) => entry.id === segments[2]);
			if (index < 0) throw httpError(404, "Reservation not found.");
			if (user.role !== "manager" && store.reservations[index].userId !== user.id) {
				throw httpError(403, "You can only cancel your own reservations.");
			}
			const [reservation] = store.reservations.splice(index, 1);
			await persistStore();
			sendJson(response, 200, { reservation });
			return;
		}

		if (segments[1] === "reviews" && segments.length === 2 && method === "GET") {
			const productId = url.searchParams.get("productId");
			const reviews = productId
				? store.reviews.filter((review) => review.productId === productId)
				: store.reviews;
			sendJson(response, 200, { reviews: [...reviews].sort((left, right) => right.createdAt.localeCompare(left.createdAt)) });
			return;
		}

		if (segments[1] === "reviews" && segments.length === 2 && method === "POST") {
			const user = getAuthenticatedUser(request);
			const rating = Number(body.rating);
			if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw httpError(400, "Rating must be a whole number from 1 to 5.");
			const review = {
				id: crypto.randomUUID(),
				userId: user.id,
				name: user.name,
				rating,
				text: requireText(body.text, "Review", 500),
				productId: body.productId ? String(body.productId) : null,
				createdAt: new Date().toISOString(),
			};
			store.reviews.unshift(review);
			await persistStore();
			sendJson(response, 201, { review });
			return;
		}

		if (segments[1] === "admin" && segments[2] === "accounts" && method === "GET") {
			const user = getAuthenticatedUser(request);
			requireManager(user);
			sendJson(response, 200, { accounts: store.users.map(publicUser) });
			return;
		}

		if (segments[1] === "admin" && segments[2] === "accounts" && segments[3] && method === "DELETE") {
			const user = getAuthenticatedUser(request);
			requireManager(user);
			const target = store.users.find((entry) => entry.id === segments[3]);
			if (!target) throw httpError(404, "Account not found.");
			if (target.id === user.id) throw httpError(400, "You cannot delete your own account.");
			if (target.role === "manager") throw httpError(403, "Manager accounts cannot be deleted here.");
			store.users = store.users.filter((entry) => entry.id !== target.id);
			await persistStore();
			sendJson(response, 200, { account: publicUser(target) });
			return;
		}

		if (segments[1] === "admin" && segments[2] === "dashboard" && method === "GET") {
			const user = getAuthenticatedUser(request);
			requireManager(user);
			const revenue = store.orders
				.filter((order) => order.status !== "Cancelled")
				.reduce((sum, order) => sum + order.total, 0);
			sendJson(response, 200, {
				orderCount: store.orders.length,
				pendingOrders: store.orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length,
				revenue,
				accountCount: store.users.length,
				averageRating: store.reviews.length
					? Math.round((store.reviews.reduce((sum, review) => sum + review.rating, 0) / store.reviews.length) * 10) / 10
					: null,
			});
			return;
		}

		throw httpError(404, "Route not found.");
	}

	const ready = loadStore();
	const server = http.createServer((request, response) => {
		ready
			.then(() => handleRequest(request, response))
			.catch((error) => {
				if (response.headersSent) {
					response.destroy(error);
					return;
				}
				sendJson(response, error.status || 500, {
					error: error.status ? error.message : "Internal server error.",
				});
				if (!error.status) console.error(error);
			});
	});

	return {
		server,
		ready,
		close: async () => {
			if (mongoClient) await mongoClient.close();
		},
	};
}

async function startServer() {
	const { server, ready, close } = createApp();
	await ready;
	console.log(`Connection successful to the MongoDB database "${process.env.MONGODB_DATABASE || "restaurantapp"}".`);
	server.on("close", () => void close());
	server.listen(PORT, HOST, () => {
		console.log(`Bite & Bliss API listening on http://${HOST}:${PORT}`);
		console.log("Demo customer: customer@example.com / Customer123");
		console.log("Demo manager: manager@example.com / Manager123");
	});
	return server;
}

if (require.main === module) {
	startServer().catch((error) => {
		console.error("Failed to start API server:", error);
		process.exitCode = 1;
	});
}

module.exports = { createApp, startServer };
