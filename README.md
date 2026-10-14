# Restaurant App

Expo/React Native restaurant ordering app with a Node.js, Express, and MongoDB API.

## Run the backend

Requirements: Node.js LTS and MongoDB (local or Atlas).

    cd server
    npm install
    Copy-Item .env.example .env
    # Edit .env: set MONGO_URI and a private JWT_SECRET
    npm run seed
    npm run dev

The API listens on port 5000. Health check: http://localhost:5000/api/health. For MongoDB Atlas set MONGO_URI in server/.env and USE_MEMORY_DB=false. Never commit server/.env, a database password, or a real connection string. Commit only server/.env.example.

To verify the client/server API contract using an isolated temporary MongoDB instance, run `npm run smoke` from the server folder. This does not use or modify the configured application database.

## Run the mobile app

At project root:

    Copy-Item .env.example .env
    npm install
    npx expo start

Change the backend address in root .env under EXPO_PUBLIC_API_URL (default in src/api/index.js). Use http://localhost:5000 for web/iOS simulator, http://10.0.2.2:5000 for Android emulator, and http://<computer-LAN-IP>:5000 for a physical device on the same network. Reload Expo after changing it.

## Seeded logins

- Customer: customer@example.com / Customer123
- Manager: manager@example.com / Manager123

Demo credentials; change before a public deployment.

## API endpoint table

Base URL: http://localhost:5000. Protected requests need Authorization: Bearer <token>.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | /api/health | Public | Health check |
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Sign in |
| POST | /api/auth/logout | Signed in | Sign out |
| GET | /api/profile | Signed in | Current profile |
| GET | /api/menu | Public | List menu |
| GET | /api/menu/:id | Public | Menu item details |
| POST | /api/menu | Manager | Add menu item |
| PATCH | /api/menu/:id | Manager | Edit menu item |
| DELETE | /api/menu/:id | Manager | Delete menu item |
| GET | /api/orders | Signed in | Customer orders / all manager orders |
| POST | /api/orders | Signed in | Place order |
| PATCH | /api/orders/:id/status | Manager | Change order status |
| GET | /api/reservations/my | Signed in | Customer reservations |
| GET | /api/reservations | Signed in | List own reservations or all for manager |
| POST | /api/reservations | Signed in | Create reservation |
| PATCH | /api/reservations/:id | Manager | Accept/decline reservation |
| DELETE | /api/reservations/:id | Owner/manager | Cancel reservation |
| POST | /api/reviews | Signed in | Submit review |
| GET | /api/admin/accounts | Manager | List accounts |
| DELETE | /api/admin/accounts/:id | Manager | Delete customer |
| GET | /api/admin/dashboard | Manager | Dashboard summary |

Postman collection: A2/RestaurantApp.postman_collection.json.

## A2 submission

- SRS: A2/SRS_v2.pdf
- Diagrams: A2/diagrams
- Screenshots: A2/screenshots (add genuine screenshots before submission; none were available when preparing this folder)
- Demo video: TODO: add the video URL

## Viva

Start MongoDB, run npm run seed, then keep npm run dev running in server. See the API URL setting and endpoint table above.
