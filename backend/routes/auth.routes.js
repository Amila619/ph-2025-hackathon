import express from "express";
import { register, login, verifyOtp } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/verify-otp", verifyOtp);

export default authRoutes;