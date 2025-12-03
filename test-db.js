// test-db.js
const mongoose = require("mongoose");
require("dotenv").config();

(async () => {
  const uri = process.env.MONGO_DB_URI;
  const dbName = process.env.MONGO_DB_NAME;

  if (!uri) {
    console.error("❌ MONGO_DB_URI is missing from .env file");
    process.exit(1);
  }

  console.log("🔍 Testing MongoDB connection...");
  console.log("URI:", uri);
  console.log("Database:", dbName);

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000, // wait 10 seconds max
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB Connection Failed!");
    console.error("Error message:", err.message);
    process.exit(1);
  }
})();
