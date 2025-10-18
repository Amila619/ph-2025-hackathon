import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  product_id: {
    type: String,
    trim: true
  },
  service_id: {
    type: String,
    trim: true
  },
  item_type: {
    type: String,
    enum: ['product', 'service'],
    required: true
  },
  messages: [messageSchema],
  last_message: {
    type: String,
    trim: true
  },
  last_message_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
chatSchema.index({ participants: 1 });
chatSchema.index({ last_message_at: -1 });

export default mongoose.model("Chat", chatSchema);
