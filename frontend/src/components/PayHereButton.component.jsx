import { Button } from 'antd';
import { useState, useEffect } from 'react';
import { initializePayHerePayment, loadPayHereScript } from '../utils/payhere.util';
import { AxiosInstance } from '../services/Axios.service';

/**
 * PayHere Payment Button Component
 * This component follows the PayHere JavaScript API pattern
 * Usage:
 * <PayHereButton
 *   orderId="Order12345"
 *   items="Product Name"
 *   amount="1000.00"
 *   firstName="Saman"
 *   lastName="Perera"
 *   email="samanp@gmail.com"
 *   phone="0771234567"
 *   address="No.1, Galle Road"
 *   city="Colombo"
 *   onCompleted={(orderId) => console.log('Payment completed', orderId)}
 *   onDismissed={() => console.log('Payment dismissed')}
 *   onError={(error) => console.log('Payment error', error)}
 * />
 */
const PayHereButton = ({
    orderId,
    items,
    amount,
    currency = "LKR",
    firstName = "User",
    lastName = "Name",
    email = "user@example.com",
    phone = "0771234567",
    address = "No. 1, Main Street",
    city = "Colombo",
    country = "Sri Lanka",
    deliveryAddress,
    deliveryCity,
    deliveryCountry = "Sri Lanka",
    custom1 = "",
    custom2 = "",
    onCompleted,
    onDismissed,
    onError,
    buttonText = "Pay with PayHere",
    buttonType = "primary",
    disabled = false,
    loading = false
}) => {
    const [isPayHereLoaded, setIsPayHereLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Load PayHere script on component mount
        const initPayHere = async () => {
            try {
                await loadPayHereScript();
                setIsPayHereLoaded(true);
                console.log('PayHere library loaded successfully');
            } catch (error) {
                console.error('Failed to load PayHere library:', error);
                setIsPayHereLoaded(false);
            }
        };

        initPayHere();
    }, []);

    const handlePayment = async () => {
        if (!isPayHereLoaded) {
            console.error('PayHere library not loaded');
            if (onError) {
                onError('PayHere library not loaded');
            }
            return;
        }

        setIsProcessing(true);

        try {
            // Get PayHere configuration from backend
            const configResponse = await AxiosInstance.get('/api/payhere/config');
            const config = configResponse.data;

            // Generate hash using backend API (security best practice)
            const hashResponse = await AxiosInstance.post('/api/payhere/generate-hash', {
                merchant_id: config.merchant_id,
                order_id: orderId,
                amount: amount,
                currency: currency
            });

            const hash = hashResponse.data.hash;

            // Put the payment variables here (following PayHere sample pattern)
            const payment = {
                "sandbox": true,
                "merchant_id": config.merchant_id,    // Replace your Merchant ID
                "return_url": undefined,     // Important
                "cancel_url": undefined,     // Important
                "notify_url": config.notify_url,
                "order_id": orderId,
                "items": items,
                "amount": amount,
                "currency": currency,
                "hash": hash, // Generated hash retrieved from backend
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "phone": phone,
                "address": address,
                "city": city,
                "country": country,
                "delivery_address": deliveryAddress || address,
                "delivery_city": deliveryCity || city,
                "delivery_country": deliveryCountry,
                "custom_1": custom1,
                "custom_2": custom2
            };

            // Show the payhere.js popup
            await initializePayHerePayment(payment, {
                // Payment completed. It can be a successful failure.
                onCompleted: (orderId) => {
                    console.log("Payment completed. OrderID:" + orderId);
                    setIsProcessing(false);
                    if (onCompleted) {
                        onCompleted(orderId);
                    }
                    // Note: validate the payment and show success or failure page to the customer
                },

                // Payment window closed
                onDismissed: () => {
                    console.log("Payment dismissed");
                    setIsProcessing(false);
                    if (onDismissed) {
                        onDismissed();
                    }
                    // Note: Prompt user to pay again or show an error page
                },

                // Error occurred
                onError: (error) => {
                    console.log("Error:" + error);
                    setIsProcessing(false);
                    if (onError) {
                        onError(error);
                    }
                    // Note: show an error page
                }
            });

        } catch (error) {
            console.error('Payment initialization error:', error);
            setIsProcessing(false);
            if (onError) {
                onError(error.message || 'Payment initialization failed');
            }
        }
    };

    return (
        <Button
            type={buttonType}
            onClick={handlePayment}
            disabled={disabled || !isPayHereLoaded || isProcessing}
            loading={loading || isProcessing || !isPayHereLoaded}
        >
            {isProcessing ? 'Processing...' : !isPayHereLoaded ? 'Loading PayHere...' : buttonText}
        </Button>
    );
};

export default PayHereButton;
