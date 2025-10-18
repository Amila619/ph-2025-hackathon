import mongoose from "mongoose";

const welfareApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  documents: [{ type: String }],
  note: { type: String }
}, { timestamps: true });

export default mongoose.model("WelfareApplication", welfareApplicationSchema);


