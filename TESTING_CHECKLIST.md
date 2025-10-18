# Testing Checklist for Contact Seller & Add to Cart Features

## Prerequisites
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 5173
- ✅ MongoDB connected
- ✅ User accounts seeded (check backend/seed.js)

## Test Scenarios

### 1. Contact Seller Feature (Not Logged In)
**Steps:**
1. Open homepage (http://localhost:5173)
2. Scroll to "Featured Listings" section
3. Click "Contact Seller" button on any product/service card
4. **Expected:** Redirected to login page with warning message

### 2. Contact Seller Feature (Logged In)
**Steps:**
1. Login with a user account
2. Navigate to homepage
3. Click "Contact Seller" button on any product/service card
4. **Expected:** 
   - Redirected to `/contact` page
   - Chat interface loads
   - Shows seller name and item name in header
   - Chat messages area visible (empty or with existing messages)
   - Message input box at bottom

### 3. Real-Time Chat
**Steps:**
1. Follow "Contact Seller (Logged In)" steps above
2. Type a message in the input box
3. Click "Send" or press Enter
4. **Expected:**
   - Message appears immediately in chat
   - Message aligned to the right (your message)
   - Timestamp displayed
   - Message saved to database

**Multi-User Test:**
1. Open second browser (or incognito window)
2. Login as a different user
3. Both users contact each other about same item
4. Send messages from both sides
5. **Expected:** Messages appear in real-time on both screens

### 4. Add to Cart Feature (Not Logged In)
**Steps:**
1. Logout (if logged in)
2. Navigate to homepage
3. Click "Add to Cart" button on a product card
4. **Expected:** Redirected to login page with warning message

### 5. Add to Cart Feature (Logged In - Product)
**Steps:**
1. Login with a user account
2. Navigate to homepage
3. Click "Add to Cart" button on a **Product** card
4. **Expected:**
   - Success toast notification appears
   - Item added to cart in database
   - Console shows cart response

### 6. Add to Cart Feature (Service - Should Not Show)
**Steps:**
1. Navigate to "Services" tab in Featured Listings
2. **Expected:** 
   - "Add to Cart" button should NOT be visible on service cards
   - Only "Contact Seller" button visible

## Debug Console Logs

When testing, check browser console for these logs:

### Contact Seller Click:
```
Contact seller clicked { item: {...}, isLoggedIn: true/false }
Navigating to contact with state: { sellerId, itemId, itemType, itemName }
```

### Add to Cart Click:
```
Add to cart clicked { item: {...}, isLoggedIn: true/false }
Sending cart request: { kind: 'Product', refId: '...', qty: 1 }
Cart response: { ... }
```

### Socket Connection:
```
Socket connected: <socket_id>
```

## Common Issues & Solutions

### Issue: "Contact Seller" redirects to login even when logged in
**Solution:** 
- Check if `isLoggedIn` is true in Auth context
- Verify localStorage has 'accessToken'
- Check browser console for auth errors

### Issue: "Add to Cart" shows error
**Solution:**
- Check backend console for errors
- Verify cart API endpoint is working: `POST /api/cart/add`
- Check request payload: should be `{ kind: 'Product', refId: '<id>', qty: 1 }`
- Verify user is authenticated (check Authorization header)

### Issue: Chat page shows "Invalid chat parameters"
**Solution:**
- Verify item has `sellerId`, `itemId`, `itemType`, `itemName` properties
- Check browser console for navigation state
- Ensure sample data has these properties

### Issue: Messages not appearing in real-time
**Solution:**
- Check Socket.io connection in console
- Verify WebSocket port (should be same as backend: 5000)
- Check backend logs for socket events
- Ensure both users are in same chat room

### Issue: "The requested module does not provide an export named 'default'"
**Solution:**
- Use `import { AxiosInstance }` not `import axiosInstance`
- Check all imports in Contact.jsx and FeaturedListings.jsx

## API Endpoints Used

### Cart
- `POST /api/cart/add` - Add item to cart
  - Body: `{ kind: 'Product', refId: '<product_id>', qty: 1 }`

### Chat
- `POST /api/chats/create` - Create or get chat
  - Body: `{ other_user_id, product_id?, service_id? }`
- `GET /api/chats/:chat_id` - Get chat messages
- `POST /api/chats/message` - Send message (HTTP)

### WebSocket Events
- `join_chat` - Join chat room
- `send_message` - Send message in real-time
- `receive_message` - Receive message from other user
- `typing` - Typing indicator

## Test Users (from seed.js)
Check `backend/seed.js` for available test users:
- User 1: Check email/password in seed file
- User 2: Check email/password in seed file
- Seller accounts with products/services

## Success Criteria
✅ Not logged in users redirected to login for both features  
✅ Logged in users can contact sellers  
✅ Chat interface loads successfully  
✅ Messages send and receive in real-time  
✅ Products can be added to cart  
✅ Services do NOT show "Add to Cart" button  
✅ Cart API properly saves items  
✅ No console errors  
✅ Toast notifications appear for success/error  

## Performance Checks
- Chat loads within 2 seconds
- Messages appear instantly (<500ms)
- Cart addition responds within 1 second
- No memory leaks (check after 5+ minutes of use)
- Socket reconnects automatically on connection loss
