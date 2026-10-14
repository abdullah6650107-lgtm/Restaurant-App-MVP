require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("./config/db");
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Table = require("./models/Table");

const menuSeed = [
  { name: "Classic Burger", category: "Burgers", price: 12.5, description: "Beef patty, lettuce, tomato, cheddar.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
  { name: "Chicken Burger", category: "Burgers", price: 11.0, description: "Crispy chicken fillet with slaw.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349" },
  { name: "Margherita Pizza", category: "Pizza", price: 14.5, description: "Classic tomato, basil, mozzarella.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
  { name: "Pepperoni Pizza", category: "Pizza", price: 15.75, description: "Pepperoni, mozzarella, tomato sauce.", image: "https://images.unsplash.com/photo-1548365328-9f547fb9587c" },
  { name: "Caesar Salad", category: "Salads", price: 9.25, description: "Romaine, parmesan, crispy croutons.", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1" },
  { name: "Grilled Chicken Bowl", category: "Bowls", price: 13.5, description: "Lean chicken, quinoa, veggies.", image: "https://images.unsplash.com/photo-1547592180-85f173990554" },
  { name: "Pasta Alfredo", category: "Pasta", price: 16.0, description: "Creamy parmesan pasta.", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb" },
  { name: "Spaghetti Bolognese", category: "Pasta", price: 15.5, description: "Slow-cooked beef ragù.", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141" },
  { name: "Fish Tacos", category: "Tacos", price: 12.75, description: "Citrus fish tacos with slaw.", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85" },
  { name: "Loaded Fries", category: "Sides", price: 7.0, description: "Crispy fries with cheese and herbs.", image: "https://images.unsplash.com/photo-1576106678136-3a5ef6d7a9b3" },
  { name: "Onion Rings", category: "Sides", price: 6.5, description: "Golden crunchy rings.", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d" },
  { name: "Chocolate Cake", category: "Desserts", price: 6.75, description: "Rich and decadent chocolate cake.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" },
  { name: "Cheesecake", category: "Desserts", price: 6.25, description: "Creamy vanilla cheesecake.", image: "https://images.unsplash.com/photo-1533134242443-d6ddd4d7db4d" },
  { name: "Lemonade", category: "Drinks", price: 3.5, description: "Fresh lemon cooler.", image: "https://images.unsplash.com/photo-1546173159-315724a31696" },
  { name: "Iced Tea", category: "Drinks", price: 3.0, description: "Refreshing iced green tea.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd" }
];

const tableSeed = [
  { tableNumber: 1, capacity: 2, location: "indoor" },
  { tableNumber: 2, capacity: 2, location: "indoor" },
  { tableNumber: 3, capacity: 4, location: "indoor" },
  { tableNumber: 4, capacity: 4, location: "outdoor" },
  { tableNumber: 5, capacity: 6, location: "indoor" },
  { tableNumber: 6, capacity: 8, location: "outdoor" }
];

async function seedDatabase() {
  await connectDB();

  const existingUsers = await User.countDocuments();
  const existingMenu = await MenuItem.countDocuments();
  const existingTables = await Table.countDocuments();

  if (existingUsers === 0) {
    await User.create([
      {
        name: "Customer Demo",
        email: "customer@example.com",
        password: "Customer123",
        role: "customer",
      },
      {
        name: "Manager Demo",
        email: "manager@example.com",
        password: "Manager123",
        role: "manager",
      },
    ]);
  }

  if (existingMenu === 0) {
    await MenuItem.insertMany(menuSeed);
  }

  if (existingTables === 0) {
    await Table.insertMany(tableSeed);
  }

  const userCount = await User.countDocuments();
  const menuCount = await MenuItem.countDocuments();
  const tableCount = await Table.countDocuments();

  console.log(`Seed complete. Users: ${userCount}, MenuItems: ${menuCount}, Tables: ${tableCount}`);
  await disconnectDB();
}

seedDatabase().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
