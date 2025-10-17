import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  kind: { type: String, enum: ["product", "service"], required: true },
  refId: { type: String, required: true },
  qty: { type: Number, default: 1, min: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);


