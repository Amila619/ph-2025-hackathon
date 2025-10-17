// PayHere configuration and utilities
export const payHereConfig = {
  merchantId: import.meta.env.VITE_PAYHERE_MERCHANT_ID || "1220001", // Default sandbox ID
  merchantSecret: import.meta.env.VITE_PAYHERE_MERCHANT_SECRET || "your-secret-here",
  sandboxUrl: import.meta.env.VITE_PAYHERE_SANDBOX_URL || "https://sandbox.payhere.lk/pay/checkout",
  liveUrl: import.meta.env.VITE_PAYHERE_LIVE_URL || "https://www.payhere.lk/pay/checkout",
  notifyUrl: import.meta.env.VITE_PAYHERE_NOTIFY_URL || "http://localhost:5000/api/payment/notify",
  returnUrl: import.meta.env.VITE_PAYHERE_RETURN_URL || "http://localhost:5173/dashboard/user",
  cancelUrl: import.meta.env.VITE_PAYHERE_CANCEL_URL || "http://localhost:5173/dashboard/user",
  isSandbox: import.meta.env.VITE_NODE_ENV !== 'production'
};

export const getPayHereUrl = () => {
  return payHereConfig.isSandbox ? payHereConfig.sandboxUrl : payHereConfig.liveUrl;
};

// Generate PayHere hash - this should be done on the backend for security
export const generatePayHereHash = async (merchantId, orderId, amount, currency) => {
  try {
    // Import Axios service dynamically to avoid circular imports
    const { AxiosInstance } = await import('../services/Axios.service.js');
    
    // NOTE: backend exposes /api/payhere/generate-hash which accepts merchant_id, order_id, amount, currency
    const response = await AxiosInstance.post('/api/payhere/generate-hash', {
      merchant_id: merchantId,
      order_id: orderId,
      amount,
      currency
    });
    
    return response.data.hash;
  } catch (error) {
    console.error('Failed to generate PayHere hash:', error);
    return null;
  }
};

export const createPayHereForm = (paymentData) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = getPayHereUrl();
  form.style.display = 'none';

  Object.keys(paymentData).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = paymentData[key];
    form.appendChild(input);
  });

  return form;
};

export const submitPayHerePayment = (paymentData) => {
  const form = createPayHereForm(paymentData);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
