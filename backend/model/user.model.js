import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  universityMail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
