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
    enum: {
      values: ["active", "inactive"],
      message: "Status must be either 'active' or 'inactive'. '{VALUE}' is not a valid status."
    },
    default: "active"
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


