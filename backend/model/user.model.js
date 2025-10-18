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
  },
  uid: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  isWelfareReciever: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  listed_products: [{ type: String }],
  listed_services: [{ type: String }],
  purchased_products: [{ type: String }],
  purchased_services: [{ type: String }],
  welfare_id: {
    type: String,
    default: null
  },
  name: {
    fname: { type: String },
    mname: { type: String },
    lname: { type: String }
  },
  address: {
    street: { type: String },
    city: { type: String },
    country: { type: String },
    postalcode: { type: Number }
  },
  contact: {
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String }
  },
  gender: {
    type: String,
    enum: ["m", "f"]
  },
  password_hash: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
