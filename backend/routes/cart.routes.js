import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getMyCart, addToCart, updateCartItem, clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get('/', authenticate, getMyCart);
router.post('/add', authenticate, addToCart);
router.post('/update', authenticate, updateCartItem);
router.post('/clear', authenticate, clearCart);

export default router;


