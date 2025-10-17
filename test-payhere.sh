#!/bin/bash

echo "🧪 PayHere Integration Test Script"
echo "=================================="
echo ""

# Test 1: Check if backend is running
echo "1. Testing backend health..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running. Please start it with: cd backend && npm run dev"
    exit 1
fi

# Test 2: Check PayHere configuration
echo ""
echo "2. Testing PayHere configuration..."
config_response=$(curl -s http://localhost:5000/api/payhere/config)
if echo "$config_response" | grep -q "merchant_id"; then
    merchant_id=$(echo "$config_response" | grep -o '"merchant_id":"[^"]*"' | cut -d'"' -f4)
    if [ "$merchant_id" = "your-actual-merchant-id-here" ]; then
        echo "❌ PayHere credentials not set! Please update backend/.env with your actual credentials"
        echo "   Current merchant_id: $merchant_id"
    else
        echo "✅ PayHere configuration loaded"
        echo "   Merchant ID: $merchant_id"
    fi
else
    echo "❌ Failed to get PayHere configuration"
fi

# Test 3: Test hash generation
echo ""
echo "3. Testing hash generation..."
hash_response=$(curl -s -X POST http://localhost:5000/api/payhere/generate-hash \
  -H "Content-Type: application/json" \
  -d '{"merchant_id":"test","order_id":"test123","amount":"5000.00","currency":"LKR"}')

if echo "$hash_response" | grep -q "hash"; then
    echo "✅ Hash generation working"
    hash_value=$(echo "$hash_response" | grep -o '"hash":"[^"]*"' | cut -d'"' -f4)
    echo "   Generated hash: $hash_value"
else
    echo "❌ Hash generation failed"
    echo "   Response: $hash_response"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Update your PayHere credentials in backend/.env"
echo "2. Restart your backend server"
echo "3. Run this test again"
echo "4. Test the frontend integration"
