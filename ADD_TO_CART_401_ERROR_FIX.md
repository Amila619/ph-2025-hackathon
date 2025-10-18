# Add to Cart 401 Unauthorized Error - Fix & Troubleshooting

## Error Report
**Date:** October 18, 2025
**Error:** `POST http://localhost:5000/api/cart/add 401 (Unauthorized)`
**User Status:** Logged in (`isLoggedIn: true`)
**User Data:** Present in state

---

## Problem Analysis

### The Issue
The user appears logged in on the frontend (`isLoggedIn: true`), but the backend returns **401 Unauthorized** when trying to add items to cart.

### Root Cause
One of the following is happening:
1. ✅ **Token not in localStorage** - Token was never saved or was cleared
2. ✅ **Token expired** - JWT token has exceeded its expiration time
3. ✅ **Token format incorrect** - Token not being sent with "Bearer " prefix
4. ✅ **Token verification failed** - Backend cannot verify the token signature
5. ✅ **Auth context out of sync** - Frontend thinks user is logged in, but token is missing

---

## The Fix

### 1. Enhanced Token Validation in FeaturedListings.jsx

**Location:** `frontend/src/components/FeaturedListings.jsx`

**BEFORE:**
```javascript
const handleAddToCart = async (item, event) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (!isLoggedIn) {
    message.warning('Please login to add items to cart');
    navigate('/login');
    return;
  }

  // Directly makes API call without checking token
  try {
    const response = await AxiosInstance.post('/cart/add', {
      kind: 'Product',
      refId: item.id,
      qty: 1
    });
    // ...
  } catch (error) {
    // Generic error handling
  }
};
```

**AFTER:**
```javascript
const handleAddToCart = async (item, event) => {
  event.preventDefault();
  event.stopPropagation();
  
  console.log('=== ADD TO CART CLICKED ===');
  console.log('Item:', item);
  console.log('isLoggedIn:', isLoggedIn);
  console.log('User:', user);
  
  if (!isLoggedIn) {
    message.warning('Please login to add items to cart');
    navigate('/login');
    return;
  }

  // ✅ VALIDATE JWT TOKEN EXISTS
  const token = localStorage.getItem('accessToken');
  console.log('Token exists:', !!token);
  if (!token) {
    console.error('No access token found in localStorage');
    message.error('Your session has expired. Please login again.');
    navigate('/login');
    return;
  }

  if (item.itemType !== 'product') {
    message.info('Only products can be added to cart');
    return;
  }

  try {
    console.log('Sending cart request:', { kind: 'Product', refId: item.id, qty: 1 });
    const response = await AxiosInstance.post('/cart/add', {
      kind: 'Product',
      refId: item.id,
      qty: 1
    });
    console.log('Cart response:', response);
    message.success(`${item.title || 'Product'} added to cart successfully! 🛒`);
  } catch (error) {
    console.error('Error adding to cart:', error);
    // ✅ SPECIFIC HANDLING FOR 401 ERRORS
    if (error.response?.status === 401) {
      message.error('Your session has expired. Please login again.');
      localStorage.removeItem('accessToken');
      navigate('/login');
    } else {
      message.error(error.response?.data?.message || 'Failed to add to cart. Please try again.');
    }
  }
};
```

### 2. Enhanced Axios Interceptor Logging

**Location:** `frontend/src/services/Axios.service.js`

**BEFORE:**
```javascript
AxiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // ... rest of code
  return config;
});
```

**AFTER:**
```javascript
AxiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('accessToken');
  console.log('[Axios] Token exists:', !!token);
  console.log('[Axios] Request URL:', config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Axios] Authorization header set');
  } else {
    console.warn('[Axios] No token found in localStorage');
  }
  // ... rest of code
  return config;
});
```

---

## Troubleshooting Steps

### Step 1: Check if Token Exists
Open browser console (F12) and run:
```javascript
console.log('Access Token:', localStorage.getItem('accessToken'));
```

**Expected Output:**
```
Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGYzMWIzZmU4NzI0NTMzM2QwMTgzMTkiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNDU0MzIwMCwiZXhwIjoxNzM0NjI5NjAwfQ.abcd1234...
```

**If null or undefined:**
- ❌ Token was never saved or was cleared
- 🔧 **Solution:** Logout and login again

### Step 2: Verify Token Format
Check the backend logs when the request is made. The token should be received with "Bearer " prefix.

**Backend Middleware Expectation:**
```javascript
const authHeader = req.headers["authorization"];
// Should be: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Step 3: Check Token Expiration
JWT tokens have an expiration time. Check if your token is expired.

**Decode Token (in browser console):**
```javascript
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token expires at:', new Date(payload.exp * 1000));
  console.log('Current time:', new Date());
  console.log('Token expired:', payload.exp * 1000 < Date.now());
}
```

**If expired:**
- ❌ Token is no longer valid
- 🔧 **Solution:** Logout and login again

### Step 4: Verify User Data
Check if user data is properly loaded in the Auth context.

**In browser console:**
```javascript
// Check localStorage
console.log('Token in localStorage:', !!localStorage.getItem('accessToken'));

// Check AuthContext (if using React DevTools)
// Find AuthContext.Provider in React DevTools and check values
```

### Step 5: Check Backend Logs
Look at the terminal where the backend is running. You should see the request hitting the cart endpoint.

**Expected Backend Log:**
```
POST /api/cart/add 200 OK
```

**If 401:**
```
POST /api/cart/add 401 Unauthorized
```

This means:
- Token is missing from request headers
- Token format is incorrect (missing "Bearer ")
- Token signature cannot be verified
- Token is expired

---

## Complete Testing Procedure

### Test 1: Fresh Login and Add to Cart
1. ✅ Logout completely (clear all data)
2. ✅ Login with valid credentials
3. ✅ Complete OTP verification
4. ✅ Open browser console (F12)
5. ✅ Verify token exists: `localStorage.getItem('accessToken')`
6. ✅ Navigate to home page
7. ✅ Click "Add to Cart" on a product
8. ✅ Check console logs for:
   - `=== ADD TO CART CLICKED ===`
   - `Token exists: true`
   - `[Axios] Token exists: true`
   - `[Axios] Authorization header set`
9. ✅ Should see success message: "[Product Name] added to cart successfully! 🛒"

### Test 2: Token Missing Scenario
1. ✅ Open browser console
2. ✅ Run: `localStorage.removeItem('accessToken')`
3. ✅ Click "Add to Cart"
4. ✅ Should see: "Your session has expired. Please login again."
5. ✅ Should redirect to login page

### Test 3: Token Expired Scenario
1. ✅ Login and get a token
2. ✅ Wait for token to expire (or manually set expired token)
3. ✅ Click "Add to Cart"
4. ✅ Should see: "Your session has expired. Please login again."
5. ✅ Token should be removed from localStorage
6. ✅ Should redirect to login page

---

## Console Logs Reference

### Successful Add to Cart Flow
```
=== ADD TO CART CLICKED ===
Item: {id: '68f31b3fe87245333d01831e', sellerId: '68f31b3fe87245333d01831a', title: 'Fresh Vegetables Bundle', ...}
isLoggedIn: true
User: {_id: '68f31b3fe87245333d018319', universityMail: 'farmer1@university.lk', ...}
Token exists: true
Sending cart request: {kind: 'Product', refId: '68f31b3fe87245333d01831e', qty: 1}
[Axios] Token exists: true
[Axios] Request URL: /cart/add
[Axios] Authorization header set
Cart response: {data: {...}, status: 200, statusText: 'OK', ...}
✅ SUCCESS: "Fresh Vegetables Bundle added to cart successfully! 🛒"
```

### Failed Add to Cart - No Token
```
=== ADD TO CART CLICKED ===
Item: {...}
isLoggedIn: true
User: {...}
Token exists: false
❌ ERROR: "Your session has expired. Please login again."
→ Redirecting to /login
```

### Failed Add to Cart - 401 Error
```
=== ADD TO CART CLICKED ===
Item: {...}
isLoggedIn: true
User: {...}
Token exists: true
Sending cart request: {...}
[Axios] Token exists: true
[Axios] Request URL: /cart/add
[Axios] Authorization header set
POST http://localhost:5000/api/cart/add 401 (Unauthorized)
Error adding to cart: AxiosError {...}
❌ ERROR: "Your session has expired. Please login again."
→ Token removed from localStorage
→ Redirecting to /login
```

---

## Common Scenarios & Solutions

### Scenario 1: "I'm logged in but still getting 401"
**Possible Causes:**
1. ✅ Token not saved during login
2. ✅ Token expired after login
3. ✅ Token format incorrect
4. ✅ Browser storage cleared

**Solution:**
1. Open browser console
2. Check: `localStorage.getItem('accessToken')`
3. If null: Logout and login again
4. If exists: Check token expiration (see Step 3 above)

### Scenario 2: "After login, first cart add works, then fails"
**Possible Cause:**
- Token expired during session

**Solution:**
- Implement token refresh mechanism
- Or increase token expiration time in backend

### Scenario 3: "Console shows 'Token exists: true' but still 401"
**Possible Causes:**
1. ✅ Token expired
2. ✅ Token signature invalid
3. ✅ Backend JWT secret changed
4. ✅ Token format corrupted

**Solution:**
1. Decode token (see Step 3)
2. Check expiration
3. Verify backend is using same JWT secret
4. Logout and login again to get fresh token

### Scenario 4: "Token exists but Axios doesn't send it"
**Possible Cause:**
- Axios interceptor not executing

**Solution:**
- Check console for `[Axios] Token exists: true/false` log
- If missing: Axios interceptor might not be set up
- Verify `AxiosInstance` is being used (not plain `axios`)

---

## Backend Token Verification

### JWT Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9    ← Header
.eyJzdWIiOiI2OGYzMWIzZmU4NzI0NTMzM2QwMTgzMTkiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNDU0MzIwMCwiZXhwIjoxNzM0NjI5NjAwfQ    ← Payload
.abcd1234...    ← Signature
```

### Payload Example
```json
{
  "sub": "68f31b3fe87245333d018319",    // User ID
  "role": "user",                        // User role
  "iat": 1734543200,                     // Issued at (timestamp)
  "exp": 1734629600                      // Expires at (timestamp)
}
```

### Backend Authentication Middleware
**Location:** `backend/middleware/auth.middleware.js`

```javascript
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    
    // Check if header exists and has "Bearer " prefix
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring("Bearer ".length);
    
    // Verify token signature and decode payload
    const payload = verifyAccessToken(token);
    
    // Attach user data to request
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};
```

### Common Backend 401 Reasons:
1. ✅ `authHeader` is undefined or null
2. ✅ `authHeader` doesn't start with "Bearer "
3. ✅ `verifyAccessToken` throws error (invalid signature, expired)
4. ✅ Token payload is malformed

---

## Quick Fix Checklist

If Add to Cart is giving 401 error:

- [ ] 1. Open browser console (F12)
- [ ] 2. Run: `console.log(localStorage.getItem('accessToken'))`
- [ ] 3. If null → Logout and login again
- [ ] 4. If exists → Check if token expired:
  ```javascript
  const token = localStorage.getItem('accessToken');
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Expired:', payload.exp * 1000 < Date.now());
  ```
- [ ] 5. If expired → Logout and login again
- [ ] 6. If not expired → Check console for `[Axios]` logs
- [ ] 7. Click "Add to Cart" and watch console
- [ ] 8. Should see `[Axios] Authorization header set`
- [ ] 9. If still 401 → Check backend terminal for errors
- [ ] 10. Verify backend JWT secret hasn't changed

---

## Prevention Strategies

### 1. Token Refresh Mechanism
Implement automatic token refresh before expiration:

```javascript
// Check token expiration before API calls
const isTokenExpired = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Refresh token if expired
if (isTokenExpired()) {
  await refreshToken(); // Implement this function
}
```

### 2. Axios Response Interceptor
Auto-logout on 401:

```javascript
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Auth Context Sync
Keep auth state in sync with localStorage:

```javascript
useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token && isLoggedIn) {
    setIsLoggedIn(false);
    setUser(null);
  }
}, []);
```

---

## Summary

### Changes Made:
1. ✅ Enhanced `handleAddToCart` with token validation
2. ✅ Added explicit 401 error handling
3. ✅ Enhanced Axios interceptor logging
4. ✅ Added comprehensive console logs

### What This Fixes:
1. ✅ Detects missing token before API call
2. ✅ Shows clear error message to user
3. ✅ Automatically clears invalid token
4. ✅ Redirects to login page
5. ✅ Provides detailed debug information

### Next Steps:
1. ✅ Refresh browser (Ctrl+Shift+R)
2. ✅ Logout completely
3. ✅ Login again
4. ✅ Open browser console (F12)
5. ✅ Try adding to cart
6. ✅ Watch console logs

**If still getting 401:**
- Share console logs
- Share backend terminal logs
- Check token expiration time in backend config

---

**Last Updated:** October 18, 2025
**Status:** ✅ Fix implemented, awaiting testing
**Files Modified:**
- `frontend/src/components/FeaturedListings.jsx`
- `frontend/src/services/Axios.service.js`
