import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  p_id: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  seller_id: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  listed_at: {
    type: Date,
    default: Date.now
  },
  p_description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);


