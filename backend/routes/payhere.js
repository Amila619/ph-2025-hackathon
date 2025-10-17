// backend/routes/payhere.js
import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Generate hash for frontend
router.post("/generate-hash", async (req, res) => {
  try {
    const { merchant_id, order_id, amount, currency } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Validate server config
    if (!merchantSecret) {
      console.error("PAYHERE_SECRET is not configured in environment variables");
      return res.status(500).json({ message: "Server misconfiguration: PAYHERE_SECRET missing" });
    }

    // Validate request fields
    if (typeof merchant_id === "undefined" || typeof order_id === "undefined" || typeof amount === "undefined" || typeof currency === "undefined") {
      console.error("Missing required fields for hash generation", { merchant_id, order_id, amount, currency });
      return res.status(400).json({ message: "Missing required fields: merchant_id, order_id, amount, currency" });
    }

  // Generate hash (security) - PayHere format
  // Trim values to avoid accidental whitespace/newline mismatches
  const merchantSecretTrim = String(merchantSecret).trim();
  const innerSecretHash = crypto.createHash("md5").update(merchantSecretTrim).digest("hex");
  const dataToHash = String(merchant_id).trim() + String(order_id).trim() + String(amount).trim() + String(currency).trim() + innerSecretHash;
    const hash = crypto.createHash("md5").update(dataToHash).digest("hex").toUpperCase();

    // Development debug logs to help diagnose 'Not authorized' issues.
    // These are only printed when NODE_ENV !== 'production' to avoid exposing secrets in production logs.
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[PayHere] generate-hash debug:', {
        merchant_id: String(merchant_id),
        order_id: String(order_id),
        amount: String(amount),
        currency: String(currency),
        innerSecretHash, // hash of the merchant secret (safe to log in dev)
        dataToHash,
        hash
      });
    }

    // For debugging: also compute an alternative hash where the inner secret hash is UPPERCASE
    // Some integrations are sensitive to the case of the inner MD5; include altHash only in non-production
    let altHash = null;
    if (process.env.NODE_ENV !== 'production') {
  const innerUpper = innerSecretHash.toUpperCase();
  const altDataToHash = String(merchant_id).trim() + String(order_id).trim() + String(amount).trim() + String(currency).trim() + innerUpper;
      altHash = crypto.createHash('md5').update(altDataToHash).digest('hex').toUpperCase();
    }

    const responsePayload = { hash };
    if (altHash) responsePayload.altHash = altHash;

    res.json(responsePayload);
  } catch (error) {
    console.error("Hash generation error:", error);
    res.status(500).json({ message: "Hash generation failed" });
  }
});

// Get PayHere configuration for frontend
router.get("/config", (req, res) => {
  res.json({
    merchant_id: process.env.PAYHERE_MERCHANT_ID,
    return_url: process.env.PAYHERE_RETURN_URL || "http://localhost:5173/dashboard/user",
    cancel_url: process.env.PAYHERE_CANCEL_URL || "http://localhost:5173/dashboard/user",
    notify_url: process.env.PAYHERE_NOTIFY_URL || "http://localhost:5000/api/payhere/notify",
    payhere_url: process.env.PAYHERE_SANDBOX_URL || "https://sandbox.payhere.lk/pay/checkout"
  });
});

// PayHere webhook handler
router.post("/notify", async (req, res) => {
  try {
    const { order_id, payment_id, status, amount, hash } = req.body;

    console.log("PayHere webhook received:", { order_id, payment_id, status, amount, hash });

    // Validate env
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantId || !merchantSecret) {
      console.error("PAYHERE_MERCHANT_ID or PAYHERE_SECRET missing in env", { merchantIdExists: !!merchantId, merchantSecretExists: !!merchantSecret });
      return res.status(500).json({ message: "Server misconfiguration: PayHere credentials missing" });
    }

    // Validate request fields
    if (typeof order_id === "undefined" || typeof amount === "undefined" || typeof hash === "undefined") {
      console.error("Missing required webhook fields", { order_id, amount, hash });
      return res.status(400).json({ message: "Missing required webhook fields: order_id, amount, hash" });
    }

    // Build expected hash safely (coerce to string)
    const innerSecretHash = crypto.createHash("md5").update(String(merchantSecret)).digest("hex");
    const dataToHash = String(merchantId) + String(order_id) + String(amount) + "LKR" + innerSecretHash;
    const expectedHash = crypto.createHash("md5").update(dataToHash).digest("hex").toUpperCase();
    
    if (hash !== expectedHash) {
      console.error("PayHere hash verification failed");
      return res.status(400).json({ message: "Invalid hash" });
    }
    
    // Handle payment status
    if (status === "2") { // Success
      console.log(`Payment successful for order ${order_id}`);
      // Update user to premium if it's a premium upgrade
      if (order_id.startsWith("PREMIUM_")) {
        const userId = order_id.split("_")[1];
        // You can add logic here to update user premium status
        console.log(`User ${userId} upgraded to premium`);
      }
    } else {
      console.log(`Payment failed for order ${order_id} with status ${status}`);
    }
    
    res.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("PayHere webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

export default router;
