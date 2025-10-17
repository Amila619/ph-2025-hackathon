import express from "express";
import { register, login, verifyOtp, refresh, logout } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);

export default authRoutes;