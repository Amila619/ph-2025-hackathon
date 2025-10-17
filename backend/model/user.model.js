import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  universityMail: { 
    type: String, required: true, unique: true 
  }
});

export default mongoose.model("User", userSchema);
