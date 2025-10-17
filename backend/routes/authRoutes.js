import express from "express";
import { handleAuth, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();
authRouter.get('/status', handleAuth);
authRouter.get('/login', loginUser);

export default authRouter;