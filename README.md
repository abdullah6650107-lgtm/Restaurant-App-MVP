# Restaurant-App

## Mobile app

The app uses Expo Router with JavaScript routes in src/app/. Native session tokens are stored with Expo SecureStore; the web app uses browser storage. The cart, favorites, and appearance preference are saved locally between launches.

Run npx expo lint to check the JavaScript app.

## Feature hooks

Reusable feature state and behavior lives in `src/hooks/`, grouped by feature (`useAuth`, `useCartItems`, `useFavorites`, `useMenu`, `useOrders`, `useReservations`, `useCheckout`, `useReview`, and `useTheme`). Screens use these hooks for feature-specific logic, while `src/context/CartContext.js` composes shared app state for screens that consume `useCart()`.

## Backend and MongoDB setup

The app sends API requests to the Node.js backend. The backend connects to MongoDB and stores users, menu items, orders, reservations, and reviews in separate collections. The mobile app must never connect directly to MongoDB; keep the database connection string on the backend only.

1. Copy `Backend/.env.example` to `Backend/.env` and set `MONGODB_URI` to the MongoDB Atlas connection string. The database name defaults to `restaurantapp`.
2. In Atlas, make sure the cluster is running and your current public IP is allowed under **Network Access**.
3. Copy `.env.example` to the project-root `.env`. Set `EXPO_PUBLIC_API_URL` to the machine running the backend:
   - Web: `http://localhost:3000`
   - Android emulator: `http://10.0.2.2:3000`
   - iOS simulator: `http://localhost:3000`
   - Physical device: `http://<computer-LAN-IP>:3000` (both devices must be on the same network, and the firewall must allow port 3000).
   - Production: use the HTTPS URL of the deployed backend.
4. In one terminal, run `npm run backend`. The server connects to MongoDB before it begins listening; startup fails with an error if MongoDB is unreachable. You can confirm it is running by opening `http://localhost:3000/health` in a browser.
5. In another terminal, run `npm start` and reload the app after changing `.env`.

Only `EXPO_PUBLIC_API_URL` belongs in the app's public environment. **Never** put `MONGODB_URI`, a database password, or another secret in a root `.env` variable prefixed with `EXPO_PUBLIC_`.

The first startup seeds the demo menu and accounts only when all application collections in the database are empty. If `Backend/data/db.json` exists, its legacy records are imported into MongoDB on that first empty-database startup. Afterward MongoDB is the source of truth; edits made in the app are saved there.

- Customer: `customer@example.com` / `Customer123`
- Manager: `manager@example.com` / `Manager123`

For MongoDB TLS errors such as `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`, do not disable certificate validation. Check Atlas network access, VPN/proxy/firewall interference, and run the backend on a supported Node.js LTS version.
