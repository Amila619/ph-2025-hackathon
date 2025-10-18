import mongoose, { MongooseError } from "mongoose";

export const connectDB = async () => {
  try {
    // Use MongoDB Atlas cloud database for development
    const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://ph-hackathon:ph-hackathon@cluster0.mongodb.net/ph-hackathon?retryWrites=true&w=majority";
    console.log("Attempting to connect to MongoDB...");
    
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB Connected");

  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.log("⚠️  Please check your MongoDB connection string");
  }
};
