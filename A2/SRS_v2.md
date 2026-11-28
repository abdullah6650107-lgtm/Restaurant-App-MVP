# Restaurant App - Software Requirements Specification v2

## 1. Purpose and scope
The app supports customers browsing a restaurant menu, placing and tracking orders, booking tables, and submitting reviews. Managers administer menu items, orders, reservations, accounts, and dashboard summaries.

## 2. Actors
Customer: registers or signs in, browses the menu, creates orders and reservations, submits reviews, and views their profile and reservations.
Manager: signs in, manages menu items, order status, reservations, customer accounts, and dashboard information.

## 3. Functional requirements
FR-01 Users can register and authenticate with email and password; passwords are hashed.
FR-02 Users can browse menu items; managers can create, edit, and delete them.
FR-03 Authenticated users can place orders. Server totals are calculated from current stored menu prices.
FR-04 Managers can update order status among pending, preparing, ready, served, and cancelled. Only pending orders can be cancelled.
FR-05 Customers can create reservations and view their own; managers can list and accept or decline reservations.
FR-06 Customers may cancel their own pending reservations.
FR-07 Signed-in customers can submit a 1-5 rating with optional text.
FR-08 Managers can view dashboard summaries and manage customer accounts.
FR-09 Protected APIs authenticate with bearer tokens and enforce role/ownership permissions.

## 4. Non-functional requirements
NFR-01 The mobile client communicates with the backend using JSON over HTTP or HTTPS.
NFR-02 Database connection strings and JWT secrets stay in server-side environment variables.
NFR-03 Errors use meaningful HTTP status codes and JSON error messages.
NFR-04 Mobile connectivity supports simulator, emulator, and LAN device base URLs.
NFR-05 Backend code separates routes, controllers, models, config, and middleware.

## 5. Data
Users have name, unique email, password hash, and role. Menu items have name, category, price, description, image, and availability. Orders keep customer, item snapshots, totals, status, and notes. Reservations reference a customer and table with time, party size, and status. Reviews reference a customer with a rating and text.

## 6. Interfaces
REST endpoint table is in the repository README. A Postman collection is included in this folder. Architecture and data model diagrams are in diagrams/.

## 7. Constraints and assumptions
MongoDB is required for persistent storage. Seed accounts and menu data are for demonstration. Set EXPO_PUBLIC_API_URL to a host reachable from the target device. Reviews require authentication.
