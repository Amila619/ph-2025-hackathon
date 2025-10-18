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
  status: {
    type: String,
    enum: {
      values: ["active", "inactive"],
      message: "Status must be either 'active' or 'inactive'. '{VALUE}' is not a valid status."
    },
    default: "active"
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


