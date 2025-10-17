import express from "express";
import { register, login, verifyOtp, refresh, logout } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);

// Example protected routes
authRoutes.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

authRoutes.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

export default authRoutes;