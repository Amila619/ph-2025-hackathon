# 🔧 PayHere HTML Form Integration - Setup Guide

## ✅ Implementation Complete!

I've updated the PayHere integration to use the HTML form approach as requested. Here's what has been implemented:

### **🔧 Backend Changes:**

#### **1. New PayHere Routes** (`backend/routes/payhere.js`)
- ✅ **`/api/payhere/config`** - Returns PayHere configuration
- ✅ **`/api/payhere/generate-hash`** - Generates hash for frontend
- ✅ **`/api/payhere/notify`** - Handles PayHere webhooks

#### **2. HTML Form Approach**
- ✅ **Frontend generates form** with all required fields
- ✅ **Backend generates hash** securely
- ✅ **Form submits directly** to PayHere checkout

### **🔧 Frontend Changes:**

#### **1. Updated UserDashboard** (`frontend/src/pages/UserDashboard.page.jsx`)
- ✅ **Gets PayHere config** from backend
- ✅ **Generates hash** via backend API
- ✅ **Creates HTML form** with all required fields
- ✅ **Submits form** directly to PayHere

### **🚀 How It Works:**

1. **User clicks "Pay with PayHere"**
2. **Frontend gets config** → `GET /api/payhere/config`
3. **Frontend generates hash** → `POST /api/payhere/generate-hash`
4. **Frontend creates form** → HTML form with all fields
5. **Form submits to PayHere** → Direct POST to PayHere checkout
6. **PayHere processes payment** → User completes payment
7. **PayHere sends webhook** → Backend receives notification

### **📝 CRITICAL: Update Your Credentials**

**The current error is because your PayHere credentials are not set!**

#### **Step 1: Get Your PayHere Credentials**
1. Go to https://www.payhere.lk
2. Login to your merchant account
3. Get your **Merchant ID** and **Merchant Secret**

#### **Step 2: Update Backend Environment**
**File**: `backend/.env`

```env
# Replace these with your ACTUAL PayHere credentials
PAYHERE_MERCHANT_ID=your-actual-merchant-id
PAYHERE_SECRET=your-actual-merchant-secret
```

**Example**:
```env
PAYHERE_MERCHANT_ID=1220001
PAYHERE_SECRET=abc123def456ghi789
```

#### **Step 3: Restart Backend Server**
```bash
cd backend
npm run dev
```

### **🧪 Test Your Setup:**

#### **Test 1: Check Configuration**
```bash
curl http://localhost:5000/api/payhere/config
```
**Expected**: Should return your actual merchant ID

#### **Test 2: Test Hash Generation**
```bash
curl -X POST http://localhost:5000/api/payhere/generate-hash \
  -H "Content-Type: application/json" \
  -d '{"merchant_id":"YOUR_MERCHANT_ID","order_id":"test123","amount":"5000.00","currency":"LKR"}'
```
**Expected**: Should return a hash like `{"hash":"XXXXXXXXXXXX"}`

#### **Test 3: Test Frontend Integration**
1. Go to User Dashboard
2. Click "Upgrade to Premium"
3. Click "Pay with PayHere"
4. Should redirect to PayHere checkout

### **🔍 Form Fields Sent to PayHere:**

The implementation sends these exact fields to PayHere:

```html
<form method="post" action="https://sandbox.payhere.lk/pay/checkout">
    <input type="hidden" name="merchant_id" value="YOUR_MERCHANT_ID">
    <input type="hidden" name="return_url" value="http://localhost:5173/dashboard/user">
    <input type="hidden" name="cancel_url" value="http://localhost:5173/dashboard/user">
    <input type="hidden" name="notify_url" value="http://localhost:5000/api/payhere/notify">
    <input type="hidden" name="order_id" value="PREMIUM_userId_timestamp">
    <input type="hidden" name="items" value="Premium User Upgrade">
    <input type="hidden" name="currency" value="LKR">
    <input type="hidden" name="amount" value="5000.00">
    <input type="hidden" name="first_name" value="User First Name">
    <input type="hidden" name="last_name" value="User Last Name">
    <input type="hidden" name="email" value="user@email.com">
    <input type="hidden" name="phone" value="User Phone">
    <input type="hidden" name="address" value="User Address">
    <input type="hidden" name="city" value="User City">
    <input type="hidden" name="country" value="Sri Lanka">
    <input type="hidden" name="hash" value="GENERATED_HASH">
</form>
```

### **🚨 Current Issue:**

The "Unauthorized payment request" error is happening because:
- ❌ **Merchant ID is placeholder**: `your-actual-merchant-id-here`
- ❌ **Merchant Secret is placeholder**: `your-actual-merchant-secret-here`
- ❌ **PayHere rejects invalid credentials**

### **✅ Solution:**

1. **Update your `.env` file** with real PayHere credentials
2. **Restart your backend server**
3. **Test the integration**

---

**Next Step**: Update your PayHere credentials in `backend/.env` and restart the backend server!
