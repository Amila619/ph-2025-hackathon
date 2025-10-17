import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  universityMail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
