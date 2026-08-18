const mongoose = require("mongoose");
const dns=require('dns');
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    dns.setServers(["8.8.8.8","1.1.1.1"]);
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn("⚠️ MONGO_URI is not defined in environment variables.");
    }

    const conn = await mongoose.connect(mongoUri || "mongodb://127.0.0.1:27017/buspass_db", {
      serverSelectionTimeoutMS: 5000
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
