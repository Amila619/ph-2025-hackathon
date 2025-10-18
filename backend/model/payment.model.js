import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  buyer_uid: {
    type: String,
    required: true
  },
  seller_uid: {
    type: String,
    required: true
  },
  p_id: {   // Product ID
    type: String,
    required: true
  },
  payment_amount: {
    type: Number,  // use Number for double/decimal values
    default: 0,
    required: true
  },
  payment_type: {
    type: String,
    enum: ['product_purchase', 'service_purchase', 'premium_upgrade'],
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  payment_gateway: {
    type: String,
    enum: ['payhere', 'manual'],
    default: 'payhere'
  },
  gateway_transaction_id: {
    type: String
  },
  order_id: {
    type: String,
    unique: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

export default mongoose.model("Payment", paymentSchema);
