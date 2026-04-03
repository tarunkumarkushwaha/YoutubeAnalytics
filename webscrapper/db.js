import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
  try {
    mongoose.set('sanitizeFilter', true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

export default connectDB;
