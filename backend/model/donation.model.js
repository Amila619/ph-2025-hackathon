import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  d_uid: {
    type: String,
    trim: true
  },
  donatedAt: {
    type: Date,
    default: Date.now
  },
  donated_amount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Donation", donationSchema);


