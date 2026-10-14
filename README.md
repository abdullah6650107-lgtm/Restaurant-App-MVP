# Restaurant App

A restaurant ordering app built with React Native and Expo Router, with an Express API and MongoDB backend. The mobile client and backend are in this repository: app code is under `src/`, and backend code is under `server/`.

## Project work

- **A1:** Mobile app prototype and its original SRS/UML documents are in `A1/`.
- **A2:** MongoDB-backed REST API, JWT authentication, connected mobile client, updated SRS, diagrams, and Postman collection are in `server/`, `src/api/`, and `A2/`.

Project documents:

- [A1 SRS](A1/SRS.pdf) and [A1 UML diagram](A1/UML%20Diagram.pdf)
- [A2 SRS v2](A2/SRS_v2.pdf)
- [System architecture diagram](A2/diagrams/system-architecture.mmd) and [data model diagram](A2/diagrams/data-model.mmd)
- [Postman collection](A2/RestaurantApp.postman_collection.json)

## Features

### Customer

- Register and sign in; the session is retained on the device.
- Browse and search menu items and view item details.
- Add items to a cart and place an order using cash on delivery.
- View order status and personal order history.
- Book a table, view bookings, and cancel an eligible booking.
- Submit a rating and optional review text; manage profile and theme settings.

### Manager

- View orders and advance their status.
- Add, edit, and remove menu items, including price and availability.
- View reservations and accept or decline them.
- View the dashboard and manage customer accounts.

## Technology

- **Mobile:** React Native, Expo, Expo Router, JavaScript, React Hooks, Context API, AsyncStorage.
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, and CORS.

## Run locally

Requirements: Node.js and npm, Expo Go for a physical phone, and MongoDB for persistent data (local MongoDB or MongoDB Atlas). Keep the phone and computer on the same Wi-Fi when testing on a physical device.

### 1. Configure and start the backend

In a terminal at the project root:

```powershell
Set-Location server
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Edit `server/.env`. Set `MONGO_URI` to your local MongoDB or Atlas connection string, provide a private `JWT_SECRET`, and leave `USE_MEMORY_DB=false` for persistent storage. Never commit `.env` or a real database connection string; commit only `.env.example`.

Then start with seeded demo data:

```powershell
npm run seed
npm run dev
```

The seed script fills collections that are empty; it does not clear existing data. The API listens on port `5000`. Check the server at <http://localhost:5000/api/health>.

For a temporary in-memory database, set `USE_MEMORY_DB=true` in `server/.env`. The server seeds demo data when it starts in this mode. Memory data is discarded when the server stops, so use MongoDB with `USE_MEMORY_DB=false` when data needs to persist.

To run the API smoke check against an isolated temporary database, open another terminal in `server/` and run `npm run smoke`. It checks the main client/server flows without changing the configured application database.

### 2. Configure and start the mobile app

Open another terminal at the project root:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` in the root `.env` to an address reachable by the app, then reload Expo after changing it:

| Where the app runs | Example API URL |
| --- | --- |
| Web or iOS simulator | `http://localhost:5000` |
| Android emulator | `http://10.0.2.2:5000` |
| Physical phone | `http://<computer-LAN-IP>:5000` |

For a physical phone, use the computer's current Wi-Fi/LAN IP address, and make sure the backend is running and the phone can reach port `5000`. The API base URL is read from `EXPO_PUBLIC_API_URL`; the fallback in `src/api/index.js` is `http://localhost:5000`. The address must not include `/api` at the end.

Scan the Expo QR code with Expo Go. Do not put the MongoDB URI or database password in the root `.env`; those belong only in `server/.env`.

## Seeded demo accounts

These accounts are inserted when the users collection is empty:

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@example.com` | `Customer123` |
| Manager | `manager@example.com` | `Manager123` |

Use these for local demonstration only.

## API endpoints

Base URL: `http://localhost:5000`. Protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Check server status |
| POST | `/api/auth/register` | Public | Register a customer |
| POST | `/api/auth/login` | Public | Sign in and receive a token |
| POST | `/api/auth/logout` | Signed in | Log out |
| GET | `/api/profile` | Signed in | Get the current user's profile |
| GET | `/api/auth/profile` or `/api/auth/me` | Signed in | Get the current user's profile |
| GET | `/api/menu?category=<category>&search=<term>` | Public | Browse and search menu items |
| GET | `/api/menu/:id` | Public | Get a menu item |
| POST | `/api/menu` | Manager | Add a menu item |
| PATCH | `/api/menu/:id` | Manager | Edit a menu item |
| DELETE | `/api/menu/:id` | Manager | Delete a menu item |
| GET | `/api/orders` | Signed in | Get own orders; managers see all orders |
| POST | `/api/orders` | Signed in | Place an order |
| PATCH | `/api/orders/:id/status` | Manager | Update order status |
| GET | `/api/reservations/my` | Signed in | Get own reservations |
| GET | `/api/reservations` | Signed in | Get own reservations; managers see all reservations |
| POST | `/api/reservations` | Signed in | Create a reservation; a suitable table is assigned |
| PATCH | `/api/reservations/:id` | Manager | Accept or decline a reservation |
| DELETE | `/api/reservations/:id` | Owner or manager | Cancel an eligible reservation |
| POST | `/api/reviews` | Signed in | Submit a 1-5 rating and optional text |
| GET | `/api/admin/accounts` | Manager | List accounts |
| DELETE | `/api/admin/accounts/:id` | Manager | Delete a customer account |
| GET | `/api/admin/dashboard` | Manager | Get dashboard summary |

The Postman collection is [`A2/RestaurantApp.postman_collection.json`](A2/RestaurantApp.postman_collection.json). Import it into Postman and sign in to obtain a bearer token before calling protected endpoints.

## Database and project files

MongoDB stores users, menu items, tables, reservations, orders, and reviews. The seed data includes demo users, menu items, and tables. See [`A2/SRS_v2.pdf`](A2/SRS_v2.pdf) for the requirements and data model details.

```text
RestaurantApp/
|-- A1/                         # A1 SRS and UML
|-- A2/
|   |-- diagrams/               # Architecture and data model diagrams
|   |-- screenshots/            # Add captured app screenshots here
|   |-- SRS_v2.pdf
|   `-- RestaurantApp.postman_collection.json
|-- server/
|   |-- config/                 # Database configuration
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- seed.js
|   `-- server.js
|-- src/
|   |-- api/                    # Backend client
|   |-- app/                    # Expo Router routes
|   |-- components/
|   |-- context/
|   |-- hooks/
|   |-- reducers/
|   `-- screens/
|-- .env.example
`-- README.md
```

## Screenshots and demo video

App screenshots are included in [`A2/screenshots/Screen Shots.pdf`](A2/screenshots/Screen%20Shots.pdf).

**Demo video:** [Watch the Restaurant App demo](https://youtu.be/GvPe9FIbIhk?si=r_W3dfkEyPKHz2Ma).

## Known limitations

- Payments are not processed online; checkout uses cash on delivery.
- Order and dashboard updates use polling rather than push notifications.
- The backend is available to phones only while the development computer and server are running on a reachable network.
- In-memory database mode is temporary and loses data when the server stops.
