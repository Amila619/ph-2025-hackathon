# Send Message Debugging Guide

## Overview
This guide helps troubleshoot the "Send" button functionality in the Contact/Chat page.

## Expected Flow

1. User types message in input box
2. User clicks "Send" button (or presses Enter)
3. Frontend sends message via Socket.io
4. Backend receives message and saves to database
5. Backend broadcasts message to all users in chat room
6. Frontend receives broadcast and displays message
7. Message appears in chat interface

## Console Output to Check

### Frontend Console (Browser)

#### When Page Loads:
```javascript
Contact page loaded with state: { sellerId: "...", itemId: "...", itemType: "...", itemName: "..." }
Socket connected: <socket_id>
=== INITIALIZING CHAT ===
sellerId: "..."
itemId: "..."
itemType: "..."
user: { _id: "...", ... }
Creating/fetching chat...
Chat response: { ... }
Chat ID set to: "..."
Other user ID: "..."
Other user loaded: { ... }
Messages loaded: 0 (or number of existing messages)
Joining chat room: "..."
Socket connected in chat page
Chat initialization complete
```

#### When Clicking Send:
```javascript
=== SEND MESSAGE CLICKED ===
newMessage: "Hello, I'm interested in this product"
chatId: "67123abc..."
socket: Socket { connected: true, ... }
user: { _id: "...", name: "...", ... }
Sending message via socket: { chat_id: "...", sender_id: "...", message: "..." }
Message sent successfully
```

#### When Receiving Message:
```javascript
=== MESSAGE RECEIVED VIA SOCKET ===
Received data: { chat_id: "...", message: { sender_id: "...", message: "...", timestamp: "..." }, sender_id: "..." }
Current chatId: "..."
Message is for this chat, adding to messages
Updated messages: [ ... ]
```

### Backend Console (Terminal)

#### When Client Connects:
```
User connected: <socket_id>
```

#### When Client Joins Chat Room:
```
User <socket_id> joined chat 67123abc...
```

#### When Message Sent:
```
=== SEND_MESSAGE EVENT RECEIVED ===
Socket ID: <socket_id>
Data received: { chat_id: "...", sender_id: "...", message: "..." }
Finding chat with ID: 67123abc...
Chat found, saving message
Message saved to database
Broadcasting to room: 67123abc...
Broadcast data: { chat_id: "...", message: { ... }, sender_id: "..." }
Message broadcast complete
```

## Troubleshooting

### Issue 1: Send button does nothing

**Check:**
1. Open browser console
2. Click Send button
3. Do you see `=== SEND MESSAGE CLICKED ===`?

**If NO:**
- Button onClick handler not working
- JavaScript error preventing execution
- Check console for errors

**If YES:**
- Check what logs appear after
- See which validation fails

### Issue 2: "Message is empty" in console

**Cause:** Input field value not being captured

**Solutions:**
1. Check if you're typing in the correct input field
2. Verify `newMessage` state is being updated
3. Check `onChange` handler on TextArea

### Issue 3: "No chatId available"

**Cause:** Chat not initialized properly

**Solutions:**
1. Check initialization logs
2. Verify `/chats/create` endpoint succeeded
3. Check if `setChatId` was called
4. Restart the chat (go back and click Contact Seller again)

### Issue 4: "Socket not connected"

**Cause:** Socket.io connection failed

**Solutions:**
1. Check if backend is running on port 5000
2. Verify Socket.io is running (check backend startup logs)
3. Check browser Network tab → WS (WebSocket)
4. Verify `VITE_API_URL` environment variable
5. Check CORS configuration in backend

**Check WebSocket Connection:**
- Open browser DevTools → Network tab
- Filter by WS (WebSocket)
- Should see active WebSocket connection
- Status should be "101 Switching Protocols"

### Issue 5: "User information not available"

**Cause:** User object not loaded from Auth context

**Solutions:**
1. Check if you're logged in
2. Verify `/users/me` endpoint is working
3. Check Auth context logs
4. Try logging out and back in
5. Check `localStorage.getItem('accessToken')`

### Issue 6: Message sent but not appearing

**Check Frontend:**
```javascript
// Should see in console:
Message sent successfully
=== MESSAGE RECEIVED VIA SOCKET ===
Message is for this chat, adding to messages
```

**Check Backend:**
```javascript
// Should see in backend console:
=== SEND_MESSAGE EVENT RECEIVED ===
Chat found, saving message
Message saved to database
Broadcasting to room: ...
Message broadcast complete
```

**If backend logs appear but frontend doesn't receive:**
1. Check if socket is in correct room
2. Verify chatId matches
3. Check if `receive_message` event listener is set up
4. Try refreshing the page

**If backend logs don't appear:**
1. Socket event not reaching backend
2. Check WebSocket connection
3. Verify event name is `send_message`
4. Check backend console for errors

### Issue 7: "Chat not found" in backend

**Cause:** Invalid chat ID or chat doesn't exist in database

**Solutions:**
1. Check if chatId is valid MongoDB ObjectId
2. Verify chat was created successfully
3. Check MongoDB for the chat document
4. Try creating a new chat (go back and click Contact Seller again)

### Issue 8: Message appears multiple times

**Cause:** Multiple socket event listeners

**Solutions:**
1. Check if you have multiple tabs open with same chat
2. Verify socket event listeners are properly cleaned up
3. Check the `useEffect` cleanup function
4. Refresh the page

## Manual Testing Steps

### Test 1: Basic Message Send
1. Navigate to contact page
2. Type "Test message 1" in input box
3. Click Send button
4. **Expected:** Message appears in chat immediately
5. **Check:** Both frontend and backend console logs

### Test 2: Enter Key Send
1. Type "Test message 2" in input box
2. Press Enter key (not Shift+Enter)
3. **Expected:** Message appears in chat immediately
4. **Check:** Console logs confirm send

### Test 3: Multi-User Chat
1. Open two browser windows (or use incognito)
2. Login as different users in each
3. Both users contact each other about same item
4. Send message from User 1
5. **Expected:** Message appears in User 2's chat immediately
6. Send message from User 2
7. **Expected:** Message appears in User 1's chat immediately

### Test 4: Empty Message
1. Leave input box empty
2. Click Send button
3. **Expected:** Nothing happens, console shows "Message is empty"

### Test 5: Long Message
1. Type a very long message (500+ characters)
2. Click Send
3. **Expected:** Message appears, wraps correctly in chat bubble

## Common Errors and Solutions

### Error: "TypeError: Cannot read property '_id' of null"

**Cause:** User object is null

**Solution:**
```javascript
// Check user object exists
console.log('User object:', user);

// If null, check Auth context
// Verify /users/me is being called
// Check if logged in properly
```

### Error: "Socket.io connection failed"

**Cause:** Backend not accessible or CORS issue

**Solution:**
1. Verify backend is running: `http://localhost:5000`
2. Check backend console for Socket.io startup message
3. Check CORS configuration includes WebSocket
4. Verify firewall not blocking port 5000

### Error: "Chat initialization failed"

**Cause:** API endpoint error

**Solution:**
1. Check Network tab for failed requests
2. Verify `/chats/create` endpoint returns 200 OK
3. Check backend console for errors
4. Verify sellerId exists in database

## Verification Checklist

Before testing, ensure:
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] MongoDB connected
- [ ] User logged in (check localStorage token)
- [ ] WebSocket connection active (check Network → WS tab)
- [ ] Browser console open and visible
- [ ] Backend console/terminal visible

During testing, verify:
- [ ] Chat page loads without errors
- [ ] Socket connects successfully
- [ ] Chat initializes and loads messages
- [ ] Input box accepts text
- [ ] Send button is enabled
- [ ] Clicking Send shows console logs
- [ ] Message saved to database (backend log)
- [ ] Message broadcast (backend log)
- [ ] Message received (frontend log)
- [ ] Message displays in UI
- [ ] Input box clears after send

## Quick Diagnostic Commands

Run in browser console:
```javascript
// Check if user is loaded
console.log('User:', user);

// Check if socket is connected
console.log('Socket connected:', socket?.connected);

// Check chat ID
console.log('Chat ID:', chatId);

// Check messages
console.log('Messages:', messages);

// Check auth token
console.log('Token:', localStorage.getItem('accessToken'));
```

Run in backend with MongoDB shell:
```javascript
// Check if chat exists
db.chats.find({ _id: ObjectId("your_chat_id") })

// Check messages in chat
db.chats.findOne({ _id: ObjectId("your_chat_id") }).messages

// List all chats
db.chats.find()
```

## Success Indicators

✅ Console shows all expected logs in order  
✅ No errors in frontend or backend console  
✅ WebSocket connection stable  
✅ Message appears immediately after send  
✅ Input box clears after send  
✅ Message persists after page refresh  
✅ Other user receives message in real-time  
✅ Timestamp displays correctly  
✅ Message alignment correct (sent vs received)  

If all indicators pass, the send message feature is working correctly! 🎉
