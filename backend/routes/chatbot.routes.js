import express from "express";
import { handleChatBot } from "../controllers/chatbot.controller.js";

const chatRoutes = express.Router();
chatRoutes.post('/chat', handleChatBot);

export default chatRoutes;