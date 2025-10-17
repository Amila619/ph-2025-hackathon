import express, { response } from "express";
import cors from "cors";
// import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
// import {RedisClient} from "./src/services/redis.service.js";
import { sanitizeMongoInput } from "express-v5-mongo-sanitize";
import {xss} from "express-xss-sanitizer";
import { connectDB } from "./config/db.js";
import { RedisClient } from "./service/redis.service.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));
app.use(sanitizeMongoInput);
app.use(xss());

connectDB();
RedisClient.connect();

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));