import { Card, Typography, Space, message } from 'antd';
import PayHereButton from '../components/PayHereButton.component';

/**
 * PayHere Integration Example Page
 * This demonstrates the correct implementation of PayHere payment gateway
 * following the official PayHere JavaScript API pattern
 */
const PayHereExample = () => {
    const handlePaymentCompleted = (orderId) => {
        console.log("Payment completed. OrderID:" + orderId);
        message.success(`Payment completed! Order ID: ${orderId}`);
        // Note: validate the payment and show success or failure page to the customer
    };

    const handlePaymentDismissed = () => {
        console.log("Payment dismissed");
        message.info('Payment was cancelled by user');
        // Note: Prompt user to pay again or show an error page
    };

    const handlePaymentError = (error) => {
        console.log("Error:" + error);
        message.error(`Payment error: ${error}`);
        // Note: show an error page
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography.Title level={2}>PayHere Integration Examples</Typography.Title>
            <Typography.Paragraph>
                This page demonstrates the correct implementation of PayHere payment gateway using the JavaScript API.
            </Typography.Paragraph>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Example 1: Simple Product Payment */}
                <Card title="Example 1: Simple Product Payment" bordered>
                    <Typography.Paragraph>
                        <strong>Product:</strong> Wireless Door Bell<br />
                        <strong>Price:</strong> LKR 1,000.00
                    </Typography.Paragraph>
                    <PayHereButton
                        orderId={`ORDER_${Date.now()}`}
                        items="Wireless Door Bell"
                        amount="1000.00"
                        firstName="Saman"
                        lastName="Perera"
                        email="samanp@gmail.com"
                        phone="0771234567"
                        address="No.1, Galle Road"
                        city="Colombo"
                        deliveryAddress="No. 46, Galle road, Kalutara South"
                        deliveryCity="Kalutara"
                        onCompleted={handlePaymentCompleted}
                        onDismissed={handlePaymentDismissed}
                        onError={handlePaymentError}
                        buttonText="Pay LKR 1,000.00"
                    />
                </Card>

                {/* Example 2: Service Payment */}
                <Card title="Example 2: Service Payment" bordered>
                    <Typography.Paragraph>
                        <strong>Service:</strong> Web Design Consultation<br />
                        <strong>Price:</strong> LKR 5,000.00
                    </Typography.Paragraph>
                    <PayHereButton
                        orderId={`SERVICE_${Date.now()}`}
                        items="Web Design Consultation - 1 Hour"
                        amount="5000.00"
                        firstName="Nimal"
                        lastName="Silva"
                        email="nimal@example.com"
                        phone="0771234568"
                        address="No.25, Kandy Road"
                        city="Kandy"
                        onCompleted={handlePaymentCompleted}
                        onDismissed={handlePaymentDismissed}
                        onError={handlePaymentError}
                        buttonText="Pay LKR 5,000.00"
                    />
                </Card>

                {/* Example 3: Premium Subscription */}
                <Card title="Example 3: Premium Subscription" bordered>
                    <Typography.Paragraph>
                        <strong>Subscription:</strong> Premium Membership - Monthly<br />
                        <strong>Price:</strong> LKR 2,500.00
                    </Typography.Paragraph>
                    <PayHereButton
                        orderId={`PREMIUM_${Date.now()}`}
                        items="Premium Membership - Monthly Subscription"
                        amount="2500.00"
                        firstName="Kasun"
                        lastName="Perera"
                        email="kasun@example.com"
                        phone="0771234569"
                        address="No.10, Galle Face"
                        city="Colombo"
                        onCompleted={handlePaymentCompleted}
                        onDismissed={handlePaymentDismissed}
                        onError={handlePaymentError}
                        buttonText="Subscribe for LKR 2,500.00"
                        buttonType="default"
                    />
                </Card>

                {/* Implementation Guide */}
                <Card title="📚 Implementation Guide" bordered>
                    <Typography.Title level={4}>How to Use PayHere Integration:</Typography.Title>
                    
                    <Typography.Title level={5}>1. Include PayHere Script</Typography.Title>
                    <Typography.Paragraph>
                        The PayHere script is already included in <code>index.html</code>:
                    </Typography.Paragraph>
                    <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
{`<script type="text/javascript" src="https://sandbox.payhere.lk/lib/payhere.js"></script>`}
                    </pre>

                    <Typography.Title level={5}>2. Use the PayHereButton Component</Typography.Title>
                    <Typography.Paragraph>
                        Import and use the PayHereButton component:
                    </Typography.Paragraph>
                    <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
{`import PayHereButton from '../components/PayHereButton.component';

<PayHereButton
    orderId="ORDER123"
    items="Product Name"
    amount="1000.00"
    firstName="John"
    lastName="Doe"
    email="john@example.com"
    phone="0771234567"
    address="No.1, Main Street"
    city="Colombo"
    onCompleted={(orderId) => console.log('Payment completed', orderId)}
    onDismissed={() => console.log('Payment cancelled')}
    onError={(error) => console.log('Payment error', error)}
/>`}
                    </pre>

                    <Typography.Title level={5}>3. Backend Configuration</Typography.Title>
                    <Typography.Paragraph>
                        Make sure your backend has the following environment variables set:
                    </Typography.Paragraph>
                    <ul>
                        <li><code>PAYHERE_MERCHANT_ID</code> - Your PayHere Merchant ID</li>
                        <li><code>PAYHERE_MERCHANT_SECRET</code> - Your PayHere Merchant Secret</li>
                        <li><code>PAYHERE_NOTIFY_URL</code> - URL for payment notifications</li>
                    </ul>

                    <Typography.Title level={5}>4. Payment Flow</Typography.Title>
                    <ol>
                        <li>User clicks the payment button</li>
                        <li>Frontend requests hash from backend (security)</li>
                        <li>PayHere popup opens with payment form</li>
                        <li>User completes payment</li>
                        <li>PayHere calls your <code>onCompleted</code>, <code>onDismissed</code>, or <code>onError</code> callback</li>
                        <li>PayHere sends notification to your backend (webhook)</li>
                        <li>Backend validates and processes the payment</li>
                    </ol>

                    <Typography.Title level={5}>5. Important Notes</Typography.Title>
                    <ul>
                        <li>✅ <code>return_url</code> and <code>cancel_url</code> must be set to <code>undefined</code> for JavaScript API</li>
                        <li>✅ Hash generation must be done on the backend for security</li>
                        <li>✅ Use sandbox mode for testing (<code>"sandbox": true</code>)</li>
                        <li>✅ Always validate payments on the backend via the notify URL</li>
                        <li>✅ Order IDs must be unique for each transaction</li>
                    </ul>
                </Card>
            </Space>
        </div>
    );
};

export default PayHereExample;
