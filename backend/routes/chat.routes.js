import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { 
  getOrCreateChat, 
  getUserChats, 
  getChatMessages, 
  sendMessage,
  markAsRead 
} from "../controllers/chat.controller.js";

const router = express.Router();

// All routes require authentication
router.post("/create", authenticate, getOrCreateChat);
router.get("/", authenticate, getUserChats);
router.get("/:chat_id", authenticate, getChatMessages);
router.post("/message", authenticate, sendMessage);
router.put("/:chat_id/read", authenticate, markAsRead);

export default router;
