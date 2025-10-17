import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  seller_id: {
    type: String,
    trim: true
  },
  s_id: {
    type: String,
    trim: true
  },
  s_category: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive"
  },
  s_description: {
    type: String,
    trim: true
  },
  listed_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);


