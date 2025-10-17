import express from "express";
import { handleAuth } from "../controllers/authController.js";

const authRouter = express.Router();
authRouter.get('/', handleAuth);

export default authRouter;