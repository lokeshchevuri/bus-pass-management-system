const mongoose = require("mongoose");
const connectDB = require("../config/db");

const checkDbConnection = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection unavailable. Please verify MONGO_URI in your Vercel Environment Variables."
    });
  }
  next();
};

module.exports = checkDbConnection;
