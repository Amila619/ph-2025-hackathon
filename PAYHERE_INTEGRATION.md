# PayHere Payment Gateway Integration

This project includes a complete PayHere payment gateway integration using the official PayHere JavaScript API.

## 🚀 Quick Start

### 1. Backend Setup

Create a `.env` file in the `backend` folder with the following variables:

```env
# PayHere Configuration
PAYHERE_MERCHANT_ID=121XXXX
PAYHERE_MERCHANT_SECRET=your-merchant-secret-here
PAYHERE_NOTIFY_URL=http://localhost:5000/api/payhere/notify
PAYHERE_RETURN_URL=http://localhost:5173/dashboard/user
PAYHERE_CANCEL_URL=http://localhost:5173/dashboard/user
PAYHERE_SANDBOX_URL=https://sandbox.payhere.lk/pay/checkout
NODE_ENV=development
```

**Important:** 
- Replace `121XXXX` with your actual PayHere Merchant ID
- Replace `your-merchant-secret-here` with your actual PayHere Merchant Secret
- For production, use production URLs and set `NODE_ENV=production`

### 2. Frontend Setup

Create a `.env` file in the `frontend` folder:

```env
VITE_PAYHERE_MERCHANT_ID=121XXXX
VITE_NODE_ENV=development
```

### 3. PayHere Script

The PayHere script is already included in `frontend/index.html`:

```html
<script type="text/javascript" src="https://sandbox.payhere.lk/lib/payhere.js"></script>
```

For production, change to:
```html
<script type="text/javascript" src="https://www.payhere.lk/lib/payhere.js"></script>
```

## 📦 Available Components

### PayHereButton Component

Reusable button component for PayHere payments.

**Usage:**

```jsx
import PayHereButton from '../components/PayHereButton.component';

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
    buttonText="Pay Now"
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orderId | string | ✅ | - | Unique order identifier |
| items | string | ✅ | - | Description of items |
| amount | string | ✅ | - | Payment amount (e.g., "1000.00") |
| currency | string | ❌ | "LKR" | Currency code |
| firstName | string | ❌ | "User" | Customer first name |
| lastName | string | ❌ | "Name" | Customer last name |
| email | string | ❌ | "user@example.com" | Customer email |
| phone | string | ❌ | "0771234567" | Customer phone |
| address | string | ❌ | "No. 1, Main Street" | Customer address |
| city | string | ❌ | "Colombo" | Customer city |
| country | string | ❌ | "Sri Lanka" | Customer country |
| deliveryAddress | string | ❌ | Same as address | Delivery address |
| deliveryCity | string | ❌ | Same as city | Delivery city |
| deliveryCountry | string | ❌ | "Sri Lanka" | Delivery country |
| custom1 | string | ❌ | "" | Custom field 1 |
| custom2 | string | ❌ | "" | Custom field 2 |
| onCompleted | function | ❌ | - | Callback when payment completes |
| onDismissed | function | ❌ | - | Callback when payment is cancelled |
| onError | function | ❌ | - | Callback when error occurs |
| buttonText | string | ❌ | "Pay with PayHere" | Button text |
| buttonType | string | ❌ | "primary" | Ant Design button type |
| disabled | boolean | ❌ | false | Disable button |
| loading | boolean | ❌ | false | Show loading state |

## 🔧 Utility Functions

### initializePayHerePayment

Initialize PayHere payment with callbacks.

```javascript
import { initializePayHerePayment } from '../utils/payhere.util';

const payment = {
    "sandbox": true,
    "merchant_id": "121XXXX",
    "return_url": undefined,
    "cancel_url": undefined,
    "notify_url": "http://localhost:5000/api/payhere/notify",
    "order_id": "ORDER123",
    "items": "Product Name",
    "amount": "1000.00",
    "currency": "LKR",
    "hash": "GENERATED_HASH",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0771234567",
    "address": "No.1, Main Street",
    "city": "Colombo",
    "country": "Sri Lanka"
};

await initializePayHerePayment(payment, {
    onCompleted: (orderId) => {
        console.log("Payment completed:", orderId);
    },
    onDismissed: () => {
        console.log("Payment dismissed");
    },
    onError: (error) => {
        console.log("Payment error:", error);
    }
});
```

### loadPayHereScript

Load the PayHere script dynamically.

```javascript
import { loadPayHereScript } from '../utils/payhere.util';

await loadPayHereScript();
console.log('PayHere loaded');
```

## 🔐 Security Best Practices

### 1. Hash Generation (Backend Only)

**❌ NEVER generate the hash on the frontend!**

The hash is generated on the backend to prevent tampering:

```javascript
// Backend: /api/payhere/generate-hash
const hash = crypto
    .createHash('md5')
    .update(merchantId + orderId + amount + currency + md5(merchantSecret))
    .digest('hex')
    .toUpperCase();
```

### 2. Payment Verification

Always verify payments on the backend via the notify URL webhook:

```javascript
// Backend: /api/payhere/notify
router.post("/notify", async (req, res) => {
    const { order_id, payment_id, status, amount, hash } = req.body;
    
    // Verify hash
    const expectedHash = crypto
        .createHash('md5')
        .update(merchantId + order_id + amount + "LKR" + md5(merchantSecret))
        .digest('hex')
        .toUpperCase();
    
    if (hash !== expectedHash) {
        return res.status(400).json({ message: "Invalid hash" });
    }
    
    // Process payment based on status
    if (status === "2") { // Success
        // Update database, grant access, etc.
    }
});
```

## 📋 Payment Flow

1. **User clicks payment button**
2. **Frontend creates payment record** (optional, for tracking)
3. **Frontend requests hash from backend** (`/api/payhere/generate-hash`)
4. **Frontend calls `initializePayHerePayment`** with payment data and hash
5. **PayHere popup opens** with payment form
6. **User completes payment**
7. **PayHere calls callback** (`onCompleted`, `onDismissed`, or `onError`)
8. **PayHere sends notification to backend** (`/api/payhere/notify` webhook)
9. **Backend validates and processes payment**
10. **Frontend updates UI** based on callback

## 🧪 Testing

### Test Mode (Sandbox)

Use the following test credentials in sandbox mode:

**Test Card:**
- Card Number: `5222 4000 0122 5174`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

### Example Page

Visit `/payhere-example` to see working examples of the integration.

## 📝 Backend API Endpoints

### Generate Hash

```
POST /api/payhere/generate-hash
Content-Type: application/json

{
    "merchant_id": "121XXXX",
    "order_id": "ORDER123",
    "amount": "1000.00",
    "currency": "LKR"
}

Response:
{
    "hash": "45D3CBA93E9F2189BD630ADFE19AA6DC"
}
```

### Get Configuration

```
GET /api/payhere/config

Response:
{
    "merchant_id": "121XXXX",
    "return_url": "http://localhost:5173/dashboard/user",
    "cancel_url": "http://localhost:5173/dashboard/user",
    "notify_url": "http://localhost:5000/api/payhere/notify",
    "payhere_url": "https://sandbox.payhere.lk/pay/checkout"
}
```

### Webhook Notification

```
POST /api/payhere/notify
Content-Type: application/x-www-form-urlencoded

merchant_id=121XXXX
order_id=ORDER123
payment_id=320012345
payhere_amount=1000.00
payhere_currency=LKR
status_code=2
md5sig=HASH
```

## 🚨 Important Notes

1. **return_url and cancel_url must be `undefined`** when using the JavaScript API
2. **Order IDs must be unique** for each transaction
3. **Always validate payments** on the backend via the notify URL
4. **Use sandbox mode** for testing (`"sandbox": true`)
5. **Switch to production** URLs when deploying to production

## 📚 Resources

- [PayHere Documentation](https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout)
- [PayHere Sandbox](https://sandbox.payhere.lk)
- [PayHere Dashboard](https://www.payhere.lk/merchant)

## 🤝 Support

For issues or questions:
1. Check PayHere documentation
2. Review the example page (`/payhere-example`)
3. Check browser console for errors
4. Verify backend logs for hash generation issues
5. Ensure environment variables are set correctly

## 📄 License

This integration follows PayHere's terms of service and API guidelines.
