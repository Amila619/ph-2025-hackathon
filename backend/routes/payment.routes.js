import express from "express";
import { handlePayHereNotification, verifyPaymentStatus, createPayment, getUserPayments, getAllPayments, generatePayHereHash } from "../controllers/payment.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// PayHere webhook endpoint (no auth required)
router.post('/notify', handlePayHereNotification);

// Verify payment status (no auth required)
router.get('/verify/:order_id', verifyPaymentStatus);

// Create payment record (authenticated)
router.post('/create', authenticate, createPayment);

// Get user's payments (authenticated)
router.get('/user', authenticate, getUserPayments);

// Get all payments (admin only)
router.get('/all', authenticate, authorize(['admin']), getAllPayments);

// Generate PayHere hash (no auth required for hash generation)
router.post('/generate-hash', generatePayHereHash);

export default router;
