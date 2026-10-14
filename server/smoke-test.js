process.env.USE_MEMORY_DB = "true";
process.env.JWT_SECRET = "connection-smoke-secret";
process.env.PORT = "5011";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const mongoose = require("mongoose");
const vm = require("node:vm");
const { app, startServer } = require("./server");
const { disconnectDB } = require("./config/db");
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Table = require("./models/Table");

(async () => {
  let httpServer;
  try {
    httpServer = await startServer();
    await User.create([
      { name: "Smoke Customer", email: "smoke-customer@example.com", password: "Customer123", role: "customer" },
      { name: "Smoke Manager", email: "smoke-manager@example.com", password: "Manager123", role: "manager" },
    ]);
    const menuItem = await MenuItem.create({ name: "Smoke Burger", category: "Burgers", price: 12.5 });
    await Table.create({ tableNumber: 9001, capacity: 4, location: "indoor" });

    const base = "http://127.0.0.1:5011";
    process.env.EXPO_PUBLIC_API_URL = base;
    const clientSource = fs.readFileSync("../src/api/index.js", "utf8").replace("export const api =", "globalThis.__smokeApi =");
    vm.runInThisContext(clientSource, { filename: "src/api/index.js" });
    const api = globalThis.__smokeApi;
    const call = async (path, { method = "GET", token, body } = {}) => {
      const response = await fetch(base + path, {
        method,
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      assert.ok(response.ok, `${method} ${path}: ${response.status} ${JSON.stringify(data)}`);
      return data;
    };

    assert.equal((await call("/api/health")).status, "ok");
    const customer = await api.login("smoke-customer@example.com", "Customer123");
    const manager = await api.login("smoke-manager@example.com", "Manager123");
    const menu = await api.getMenu();
    assert.equal(menu.items[0].name, "Smoke Burger");
    assert.equal(menu.items[0].id, String(menuItem._id));
    const profile = await api.profile(customer.token);
    assert.equal(profile.user.email, "smoke-customer@example.com");
    const order = await api.createOrder({
      customerName: "Smoke Customer", address: "1 Test Street", paymentMethod: "Cash on Delivery",
      items: [{ id: String(menuItem._id), name: "Smoke Burger", price: 999, quantity: 2 }],
    }, customer.token);
    assert.equal(order.order.subtotal, 25);
    assert.equal(order.order.total, 145);
    assert.equal(order.order.address, "1 Test Street");
    assert.equal(order.order.items[0].name, "Smoke Burger");
    const status = await api.updateOrderStatus(order.order.id, "Preparing", manager.token);
    assert.equal(status.order.status, "Preparing");
    const reservation = await api.createReservation({
      name: "Smoke Customer", date: "2026-12-10", time: "7:30 PM", guests: 2,
    }, customer.token);
    assert.equal(reservation.reservation.time, "7:30 PM");
    const myReservations = await api.getReservations(customer.token, "customer");
    assert.equal(myReservations.reservations.length, 1);
    assert.equal(myReservations.reservations[0].customerName, "Smoke Customer");
    await api.cancelReservation(reservation.reservation.id, customer.token);
    await api.createReview({ rating: 5, text: "Connected" }, customer.token);
    const dashboard = await api.getDashboard(manager.token);
    assert.equal(dashboard.averageRating, 5);
    assert.equal((await api.getReservations(manager.token, "manager")).reservations.length, 0);
    console.log("Frontend/backend API smoke check passed: health, auth, menu, orders, manager status, reservations, reviews, dashboard.");
  } finally {
    if (httpServer) await new Promise((resolve) => httpServer.close(resolve));
    await disconnectDB();
    await mongoose.disconnect();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
