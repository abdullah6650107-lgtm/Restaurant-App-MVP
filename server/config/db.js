const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantapp";

  try {
    if (process.env.USE_MEMORY_DB === "true" || !process.env.MONGO_URI) {
      memoryServer = await MongoMemoryServer.create({
        binary: { version: "7.0.14" },
      });
      const memoryUri = memoryServer.getUri();
      console.log(`Using embedded MongoDB memory server at ${memoryUri}`);
      await mongoose.connect(memoryUri);
    } else {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
      });
    }

    console.log(`MongoDB connected successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed.", error.message);
    throw error;
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectDB, disconnectDB };
