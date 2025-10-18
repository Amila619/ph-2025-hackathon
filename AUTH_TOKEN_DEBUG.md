# Authentication Token Debugging Guide

## Issue
Getting 401 Unauthorized error when trying to create/access chat

## Root Causes Identified

### 1. WebSocket URL Fixed ✅
- **Before**: `ws://localhost:3000/socket.io/` 
- **After**: `ws://localhost:5000/socket.io/`
- **Fix**: Changed from `VITE_API_URL` to `VITE_BACKEND_URL` in Contact.jsx

### 2. Missing Authentication Token ⚠️
- Error: `POST http://localhost:5000/api/chats/create 401 (Unauthorized)`
- Cause: Access token not in localStorage when making request

## How to Verify Token

### Check Token in Browser Console
```javascript
localStorage.getItem('accessToken')
```

**Expected**: A JWT token string (e.g., "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
**If null**: User is not properly logged in

### Check Request Headers (Network Tab)
1. Open DevTools (F12)
2. Go to Network tab
3. Click on the failed request (`/chats/create`)
4. Check Request Headers section
5. Look for: `Authorization: Bearer <token>`

**If missing**: Token not being sent by AxiosInstance

## Solutions Applied

### 1. Token Validation Before API Call
```javascript
const token = localStorage.getItem('accessToken');
if (!token) {
  antMessage.error('Please log in to use chat');
  navigate('/login');
  return;
}
```

### 2. Enhanced Error Handling
```javascript
if (error.response?.status === 401) {
  localStorage.removeItem('accessToken');
  navigate('/login');
}
```

### 3. Detailed Logging
- Logs token presence before API call
- Shows first 20 characters of token
- Logs full error response from backend

## Testing Steps

### 1. Clear Previous Session
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

### 2. Login Fresh
1. Go to login page
2. Enter credentials
3. Verify OTP
4. Check console for: `Access token present: true`

### 3. Test Chat Access
1. Click "Contact Seller" on any product/service
2. Check console logs:
   - Should see: `Access token present: true`
   - Should see: `Token value (first 20 chars): eyJhbGc...`
   - Should NOT see: 401 error

## Expected Console Output (Success)

```
=== CONTACT SELLER CLICKED ===
Navigating to /contact with state: {...}
Contact page loaded with state: {...}
Socket connected: <socket-id>
Socket and user available, initializing chat
=== INITIALIZING CHAT ===
Access token present: true
Token value (first 20 chars): eyJhbGciOiJIUzI1NiIs...
Creating/fetching chat...
Request payload: {...}
Chat response: {...}
Chat ID set to: <chat-id>
Messages loaded: 0
Joining chat room: <chat-id>
Chat initialization complete
```

## Expected Console Output (Token Missing)

```
=== INITIALIZING CHAT ===
Access token present: false
Token value (first 20 chars): none
No access token found in localStorage
(Redirects to login)
```

## Backend Verification

### Check Backend Logs
The backend should show:
```
New client connected: <socket-id>
User <socket-id> joined chat <chat-id>
```

If you see connection errors, check:
1. Backend is running on port 5000
2. Socket.io CORS allows localhost:5173

### Test Backend Auth Endpoint
```bash
# Without token (should fail with 401)
curl http://localhost:5000/api/chats/

# With token (should succeed)
curl -H "Authorization: Bearer <your-token>" http://localhost:5000/api/chats/
```

## Common Issues

### Issue: Token exists but still 401
**Cause**: Token expired or invalid
**Solution**: 
1. Clear localStorage
2. Login again
3. Backend may need to refresh JWT secret

### Issue: Token missing after login
**Cause**: VerifyOtp.page.jsx not saving token
**Solution**: Check VerifyOtp.page.jsx line 27:
```javascript
localStorage.setItem("accessToken", response.data.accessToken);
```

### Issue: WebSocket not connecting
**Cause**: Wrong port in socket connection
**Solution**: Ensure Contact.jsx uses:
```javascript
io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')
```

## Environment Variables

Ensure `.env` files are correct:

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key
```

## Next Steps

If the issue persists after these fixes:

1. **Check if user is actually logged in**:
   ```javascript
   console.log(useAuth()) // Should show isLoggedIn: true, user: {...}
   ```

2. **Verify token format**:
   ```javascript
   const token = localStorage.getItem('accessToken')
   const parts = token.split('.')
   console.log(parts.length) // Should be 3 for JWT
   ```

3. **Test backend auth directly**:
   - Use Postman/Thunder Client
   - Make POST to `/api/chats/create`
   - Include `Authorization: Bearer <token>` header

4. **Check backend JWT verification**:
   - Add logs in `backend/middleware/auth.middleware.js`
   - Verify token is being decoded correctly
