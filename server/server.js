require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { protect, managerOnly } = require("./middleware/auth");
const User = require("./models/User");
const Order = require("./models/Order");
const Review = require("./models/Review");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

app.get("/api/profile", protect, async (req, res) => {
  return res.json({ user: { id: req.user._id.toString(), name: req.user.name, email: req.user.email, role: req.user.role } });
});

app.get("/api/admin/accounts", protect, managerOnly, async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json({ accounts: users.map((user) => ({ id: user._id.toString(), name: user.name, email: user.email, role: user.role })) });
});

app.delete("/api/admin/accounts/:id", protect, managerOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "Account not found." });
  if (user.role === "manager") return res.status(400).json({ error: "Managers cannot be deleted." });
  await User.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
});

app.get("/api/admin/dashboard", protect, managerOnly, async (req, res) => {
  const orders = await Order.find();
  const revenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const pendingOrders = orders.filter((order) => ["pending", "preparing", "ready"].includes(order.status)).length;
  const rating = await Review.aggregate([{ $group: { _id: null, average: { $avg: "$rating" } } }]);
  const averageRating = rating.length ? Number(rating[0].average.toFixed(1)) : null;

  return res.json({ revenue, pendingOrders, averageRating });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((error, req, res, next) => {
  const status = error.statusCode || error.status || 500;
  const message = error.message || "Internal server error.";
  res.status(status).json({ error: message });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, process.env.HOST || "0.0.0.0", () => {
      console.log(`Restaurant API listening on http://${process.env.HOST || "0.0.0.0"}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
