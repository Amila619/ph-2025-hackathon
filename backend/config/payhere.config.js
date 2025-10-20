import dotenv from 'dotenv';

dotenv.config();

export const payHereConfig = {
  merchantId: process.env.PAYHERE_MERCHANT_ID , // Default sandbox ID
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET,
  sandboxUrl: process.env.PAYHERE_SANDBOX_URL || "https://sandbox.payhere.lk/pay/checkout",
  liveUrl: process.env.PAYHERE_LIVE_URL || "https://www.payhere.lk/pay/checkout",
  notifyUrl: process.env.PAYHERE_NOTIFY_URL || "http://localhost:5000/api/payment/notify",
  returnUrl: process.env.PAYHERE_RETURN_URL || "http://localhost:5173/dashboard/user",
  cancelUrl: process.env.PAYHERE_CANCEL_URL || "http://localhost:5173/dashboard/user",
  isSandbox: process.env.NODE_ENV !== 'production'
};

export const getPayHereUrl = () => {
  return payHereConfig.isSandbox ? payHereConfig.sandboxUrl : payHereConfig.liveUrl;
};

export const getPayHereMerchantId = () => {
  return payHereConfig.merchantId;
};

export const getPayHereMerchantSecret = () => {
  return payHereConfig.merchantSecret;
};
