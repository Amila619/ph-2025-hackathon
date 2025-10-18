// PayHere configuration and utilities
export const payHereConfig = {
  merchantId: import.meta.env.VITE_PAYHERE_MERCHANT_ID || "1220001", // Default sandbox ID
  merchantSecret: import.meta.env.VITE_PAYHERE_MERCHANT_SECRET || "your-secret-here",
  sandboxUrl: import.meta.env.VITE_PAYHERE_SANDBOX_URL || "https://sandbox.payhere.lk/pay/checkout",
  liveUrl: import.meta.env.VITE_PAYHERE_LIVE_URL || "https://www.payhere.lk/pay/checkout",
  notifyUrl: import.meta.env.VITE_PAYHERE_NOTIFY_URL || "http://localhost:5000/api/payhere/notify",
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

// PayHere JavaScript API utility functions
export const waitForPayHere = () => {
    return new Promise((resolve, reject) => {
        const maxAttempts = 30; // 30 seconds max
        let attempts = 0;
        
        const checkPayHere = () => {
            attempts++;
            
            if (typeof window.payhere !== 'undefined') {
                console.log('PayHere library loaded successfully');
                resolve(window.payhere);
            } else if (attempts >= maxAttempts) {
                console.error('PayHere library failed to load after 30 seconds');
                reject(new Error('PayHere library failed to load'));
            } else {
                console.log(`Waiting for PayHere library... (${attempts}/${maxAttempts})`);
                setTimeout(checkPayHere, 1000);
            }
        };
        
        checkPayHere();
    });
};

export const loadPayHereScript = () => {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (typeof window.payhere !== 'undefined') {
            resolve(window.payhere);
            return;
        }
        
        // Check if script tag already exists
        const existingScript = document.querySelector('script[src*="payhere.js"]');
        if (existingScript) {
            // Script exists but not loaded yet, wait for it
            waitForPayHere().then(resolve).catch(reject);
            return;
        }
        
        // Create and load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://sandbox.payhere.lk/lib/payhere.js';
        script.onload = () => {
            console.log('PayHere script loaded');
            waitForPayHere().then(resolve).catch(reject);
        };
        script.onerror = () => {
            console.error('Failed to load PayHere script');
            reject(new Error('Failed to load PayHere script'));
        };
        
        document.head.appendChild(script);
    });
};

/**
 * Initialize PayHere with callbacks and start payment using JavaScript API
 * This follows the PayHere JavaScript API pattern
 * @param {Object} paymentData - Payment data object
 * @param {Object} callbacks - Callbacks object with onCompleted, onDismissed, onError
 * @returns {Promise} - Resolves when payment is initiated
 */
export const initializePayHerePayment = async (paymentData, callbacks = {}) => {
    try {
        // Wait for PayHere library to be available
        const payhere = await waitForPayHere();
        
        // Set up payment callbacks
        payhere.onCompleted = function onCompleted(orderId) {
            console.log("Payment completed. OrderID:" + orderId);
            if (callbacks.onCompleted) {
                callbacks.onCompleted(orderId);
            }
        };

        payhere.onDismissed = function onDismissed() {
            console.log("Payment dismissed");
            if (callbacks.onDismissed) {
                callbacks.onDismissed();
            }
        };

        payhere.onError = function onError(error) {
            console.log("Error:" + error);
            if (callbacks.onError) {
                callbacks.onError(error);
            }
        };

        // Start the payment
        console.log('[PayHere] Starting payment with data:', paymentData);
        payhere.startPayment(paymentData);
        
        return true;
    } catch (error) {
        console.error('[PayHere] Failed to initialize payment:', error);
        throw error;
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
