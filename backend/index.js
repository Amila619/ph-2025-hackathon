import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { sanitizeMongoInput } from "express-v5-mongo-sanitize";
import {xss} from "express-xss-sanitizer";
import { connectDB } from "./config/db.js";
import { RedisClient } from "./service/redis.service.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import welfareRoutes from "./routes/welfare.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import payhereRoutes from "./routes/payhere.js";
import messagingRoutes from "./routes/chat.routes.js";
import { blockBlacklistedForNonAdmins } from "./middleware/auth.middleware.js";
import { verifyAccessToken } from "./util/JWTtoken.util.js";
import chatRoutes from "./routes/chatbot.routes.js";
import Chat from "./model/chat.model.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(sanitizeMongoInput);
app.use(xss());

// Attach user if token present so blacklist can read role
app.use((req, _res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            const token = authHeader.substring("Bearer ".length);
            req.user = verifyAccessToken(token);
        } catch (_) {}
    }
    next();
});

// Block admin-only URLs for non-admin users
app.use(blockBlacklistedForNonAdmins);

connectDB();
RedisClient.connect().catch(err => {
  console.warn("Redis connection failed:", err.message);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/welfare", welfareRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payhere", payhereRoutes);
app.use("/api/chats", messagingRoutes);
app.use("/api/", chatRoutes);

// WebSocket for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Send message
  socket.on('send_message', async (data) => {
    console.log('=== SEND_MESSAGE EVENT RECEIVED ===');
    console.log('Socket ID:', socket.id);
    console.log('Data received:', data);
    
    try {
      const { chat_id, sender_id, message } = data;
      
      if (!chat_id || !sender_id || !message) {
        console.error('Missing required fields:', { chat_id, sender_id, message });
        return;
      }
      
      console.log('Finding chat with ID:', chat_id);
      
      // Save message to database
      const chat = await Chat.findById(chat_id);
      
      if (!chat) {
        console.error('Chat not found:', chat_id);
        return;
      }
      
      console.log('Chat found, saving message');
      
      const newMessage = {
        sender_id,
        message,
        timestamp: new Date(),
        read: false
      };
      
      chat.messages.push(newMessage);
      chat.last_message = message;
      chat.last_message_at = new Date();
      await chat.save();
      
      console.log('Message saved to database');

      // Broadcast to all users in the chat room
      const broadcastData = {
        chat_id,
        message: newMessage,
        sender_id
      };
      
      console.log('Broadcasting to room:', chat_id);
      console.log('Broadcast data:', broadcastData);
      
      io.to(chat_id).emit('receive_message', broadcastData);
      
      console.log('Message broadcast complete');
    } catch (error) {
      console.error('WebSocket message error:', error);
      console.error('Error stack:', error.stack);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.chat_id).emit('user_typing', {
      chat_id: data.chat_id,
      user_id: data.user_id
    });
  });

  // Leave chat room
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));