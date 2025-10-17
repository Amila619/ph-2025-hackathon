import { HTTP_STATUS } from "../const/http-status.const.js";
import User from "../model/user.model.js";
import Payment from "../model/payment.model.js";
import { getPayHereMerchantSecret } from "../config/payhere.config.js";
import crypto from "crypto";

export const handlePayHereNotification = async (req, res) => {
  try {
    const { order_id, payment_id, status, amount, hash } = req.body;
    
    // Verify PayHere signature for security
    const merchantSecret = getPayHereMerchantSecret();
    const expectedHash = crypto
      .createHash('md5')
      .update(merchantSecret + order_id + payment_id + status + amount)
      .digest('hex')
      .toUpperCase();
    
    if (hash !== expectedHash) {
      console.error('PayHere signature verification failed');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid signature" });
    }
    
    // Find the payment record
    const payment = await Payment.findOne({ order_id });
    if (!payment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Payment record not found" });
    }
    
    if (status === '2') { // PayHere status 2 = Success
      // Update payment status
      payment.payment_status = 'completed';
      payment.gateway_transaction_id = payment_id;
      await payment.save();
      
      // Handle different payment types
      if (payment.payment_type === 'premium_upgrade') {
        // Update user to premium
        await User.findByIdAndUpdate(payment.buyer_uid, { isPremium: true });
        console.log(`User ${payment.buyer_uid} upgraded to premium via PayHere payment ${payment_id}`);
      }
      
      return res.status(HTTP_STATUS.OK).json({ message: "Payment processed successfully" });
    } else {
      // Update payment status to failed
      payment.payment_status = 'failed';
      payment.gateway_transaction_id = payment_id;
      await payment.save();
      
      console.log(`PayHere payment ${payment_id} failed with status ${status}`);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Payment failed" });
    }
  } catch (err) {
    console.error("PayHere notification error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const verifyPaymentStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    
    const payment = await Payment.findOne({ order_id });
    if (!payment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Payment not found" });
    }
    
    const user = await User.findById(payment.buyer_uid);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    }
    
    return res.status(HTTP_STATUS.OK).json({ 
      isPremium: user.isPremium,
      payment_status: payment.payment_status,
      order_id: order_id 
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { buyer_uid, seller_uid, p_id, payment_amount, payment_type, description } = req.body;
    
    const order_id = `${payment_type.toUpperCase()}_${buyer_uid}_${Date.now()}`;
    
    const payment = new Payment({
      buyer_uid,
      seller_uid,
      p_id,
      payment_amount,
      payment_type,
      description,
      order_id
    });
    
    await payment.save();
    
    res.status(HTTP_STATUS.CREATED).json(payment);
  } catch (err) {
    console.error("Create payment error:", err);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    
    const payments = await Payment.find({
      $or: [
        { buyer_uid: userId },
        { seller_uid: userId }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(HTTP_STATUS.OK).json(payments);
  } catch (err) {
    console.error("Get user payments error:", err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json(payments);
  } catch (err) {
    console.error("Get all payments error:", err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const generatePayHereHash = async (req, res) => {
  try {
    const { merchantId, orderId, amount, currency } = req.body;
    
    if (!merchantId || !orderId || !amount || !currency) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required fields" });
    }
    
  const merchantSecret = String(getPayHereMerchantSecret()).trim();
  // PayHere expects: MD5( merchant_id + order_id + amount + currency + MD5(merchant_secret) )
  const innerSecretHash = crypto.createHash('md5').update(merchantSecret).digest('hex');
  const dataToHash = String(merchantId).trim() + String(orderId).trim() + String(amount).trim() + String(currency).trim() + innerSecretHash;

    // Generate MD5 hash
    const hash = crypto
      .createHash('md5')
      .update(dataToHash)
      .digest('hex')
      .toUpperCase();
    
    res.status(HTTP_STATUS.OK).json({ hash });
  } catch (err) {
    console.error("Generate hash error:", err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};
