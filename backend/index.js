import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
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
import { blockBlacklistedForNonAdmins } from "./middleware/auth.middleware.js";
import { verifyAccessToken } from "./util/JWTtoken.util.js";
import chatRoutes from "./routes/chatbot.routes.js";

dotenv.config();

const app = express();
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
app.use("/api/", chatRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));