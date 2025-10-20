// Quick PayHere test
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

console.log('=== PayHere Integration Test ===\n');

const merchant_id = process.env.PAYHERE_MERCHANT_ID;
const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

console.log('Environment Check:');
console.log('Merchant ID:', merchant_id);
console.log('Merchant Secret:', merchant_secret ? 'SET' : 'NOT SET');
console.log('');

if (!merchant_id || !merchant_secret) {
    console.error('❌ Missing PayHere credentials!');
    process.exit(1);
}

// Test hash generation
const order_id = 'TEST_' + Date.now();
const amount = '100.00';
const currency = 'LKR';

const merchantSecretTrim = String(merchant_secret).trim();
const innerSecretHash = crypto.createHash('md5').update(merchantSecretTrim).digest('hex');
const dataToHash = String(merchant_id).trim() + String(order_id).trim() + String(amount).trim() + String(currency).trim() + innerSecretHash;
const hash = crypto.createHash('md5').update(dataToHash).digest('hex').toUpperCase();

console.log('Hash Generation Test:');
console.log('Order ID:', order_id);
console.log('Amount:', amount);
console.log('Currency:', currency);
console.log('Data to Hash:', dataToHash);
console.log('Generated Hash:', hash);
console.log('');

// Test form data
const formData = {
    merchant_id: merchant_id,
    order_id: order_id,
    items: 'Test Payment',
    currency: currency,
    amount: amount,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    phone: '0771234567',
    address: 'No. 1, Test Street',
    city: 'Colombo',
    country: 'Sri Lanka',
    hash: hash,
    sandbox: true,
    return_url: 'http://localhost:5173/dashboard/user',
    cancel_url: 'http://localhost:5173/dashboard/user',
    notify_url: 'http://localhost:5000/api/payhere/notify'
};

console.log('Form Data:');
console.log(JSON.stringify(formData, null, 2));
console.log('');

console.log('✅ PayHere integration test completed!');
console.log('📋 Next steps:');
console.log('1. Test this hash with PayHere sandbox');
console.log('2. Check if frontend is calling the correct endpoints');
console.log('3. Verify PayHere JavaScript library is loading');
