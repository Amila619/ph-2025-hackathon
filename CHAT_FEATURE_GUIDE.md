# Real-Time Chat Feature Implementation Guide

## Overview
This guide documents the implementation of a real-time chat system for buyer-seller communication with WebSocket support using Socket.io.

## Features Implemented

### 1. Backend Components

#### Chat Model (`backend/model/chat.model.js`)
- **Schema Structure:**
  - `participants`: Array of user IDs (buyer and seller)
  - `product_id`: Reference to product (optional)
  - `service_id`: Reference to service (optional)
  - `messages`: Array of message subdocuments
    - `sender_id`: User ID of sender
    - `message`: Text content
    - `timestamp`: Message timestamp
    - `read`: Boolean read status
  - `last_message`: Last message preview
  - `last_message_at`: Timestamp of last message

#### Chat Controller (`backend/controllers/chat.controller.js`)
- **Endpoints:**
  - `getOrCreateChat`: Find existing chat or create new one between two users for a specific item
  - `getUserChats`: Get all chats for the logged-in user
  - `getChatMessages`: Get all messages for a specific chat
  - `sendMessage`: Send a new message (also works via WebSocket)
  - `markAsRead`: Mark messages as read

#### Chat Routes (`backend/routes/chat.routes.js`)
- `POST /api/chats/create` - Get or create chat
- `GET /api/chats/` - Get user's chats
- `GET /api/chats/:chat_id` - Get chat messages
- `POST /api/chats/message` - Send message via HTTP
- `PUT /api/chats/:chat_id/read` - Mark as read

All routes require authentication.

#### WebSocket Integration (`backend/index.js`)
- **Socket.io Events:**
  - `connection` - Client connects
  - `join_chat` - User joins a chat room
  - `send_message` - Send message in real-time
    - Saves to database
    - Broadcasts to all users in room
  - `typing` - Typing indicator
  - `leave_chat` - Leave chat room
  - `disconnect` - Client disconnects

### 2. Frontend Components

#### Contact Page (`frontend/src/pages/Contact.jsx`)
- **Features:**
  - Real-time message display
  - Socket.io client connection
  - Send messages via WebSocket
  - Auto-scroll to bottom on new messages
  - Typing indicator support
  - User authentication check
  - Loading states
  - Time formatting (Today, Yesterday, Date)
  - Back navigation

- **Props via Router State:**
  - `sellerId`: ID of the seller to chat with
  - `itemId`: Product/Service ID
  - `itemType`: 'product' or 'service'
  - `itemName`: Display name of item

#### FeaturedListings Component Updates
- **New Buttons:**
  - "Add to Cart" - Only for products, requires authentication
  - "Contact Seller" - For all items, requires authentication

- **Authentication Flow:**
  - Checks if user is logged in before allowing actions
  - Redirects to login if not authenticated
  - Shows appropriate messages

## Installation

### Backend Dependencies
```bash
cd backend
npm install socket.io
```

### Frontend Dependencies
```bash
cd frontend
npm install socket.io-client
```

## Environment Variables

### Backend (`.env`)
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

## Usage Flow

### 1. User Browses Products/Services
- Views featured listings on homepage
- Sees "Add to Cart" and "Contact Seller" buttons

### 2. Contact Seller
- User clicks "Contact Seller" button
- System checks authentication
- If not logged in → redirects to login
- If logged in → navigates to `/contact` with item details

### 3. Chat Initialization
- Frontend creates Socket.io connection
- Gets or creates chat via API
- Loads existing messages
- Joins WebSocket room for real-time updates

### 4. Real-Time Messaging
- User types message
- Frontend emits `send_message` event
- Backend saves to database
- Backend broadcasts to all participants
- All clients receive message instantly
- Messages display with sender distinction

### 5. Add to Cart (Products Only)
- User clicks "Add to Cart"
- System checks authentication
- Sends POST request to `/api/cart/add`
- Shows success/error message

## WebSocket Event Structure

### Client → Server

#### join_chat
```javascript
socket.emit('join_chat', chatId);
```

#### send_message
```javascript
socket.emit('send_message', {
  chat_id: 'chat_id_here',
  sender_id: 'user_id_here',
  message: 'message text'
});
```

#### typing
```javascript
socket.emit('typing', {
  chat_id: 'chat_id_here',
  user_id: 'user_id_here'
});
```

### Server → Client

#### receive_message
```javascript
socket.on('receive_message', (data) => {
  // data = { chat_id, message, sender_id }
});
```

#### user_typing
```javascript
socket.on('user_typing', (data) => {
  // data = { chat_id, user_id }
});
```

## Routes Added

### Frontend Routes
- `/contact` - Protected route for chat interface

### Backend Routes
- All chat routes mounted at `/api/chats`

## Database Collections

### chats
```javascript
{
  _id: ObjectId,
  participants: [userId1, userId2],
  product_id: ObjectId (optional),
  service_id: ObjectId (optional),
  messages: [{
    sender_id: ObjectId,
    message: String,
    timestamp: Date,
    read: Boolean
  }],
  last_message: String,
  last_message_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Register/Login as two different users (use different browsers)
2. Browse products/services
3. Click "Contact Seller" on an item
4. Send messages between users
5. Verify real-time delivery
6. Test "Add to Cart" for products

## Security Features
- All chat routes require JWT authentication
- WebSocket connections authenticated
- User can only access their own chats
- Messages validated before saving

## Future Enhancements
- File/image sharing in chat
- Read receipts UI
- Online/offline status indicators
- Message notifications
- Chat search functionality
- Message pagination for large conversations
- Delete messages
- Block users

## Troubleshooting

### Socket Connection Issues
- Verify `VITE_API_URL` matches backend URL
- Check CORS configuration in backend
- Ensure backend server is running

### Messages Not Appearing
- Check browser console for errors
- Verify user is authenticated
- Confirm WebSocket connection established
- Check backend logs

### Cart Not Working
- Verify product_id is being sent correctly
- Check authentication token
- Ensure cart routes are mounted
- Check cart controller implementation

## API Endpoints Summary

### Chat Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/chats/create | Get or create chat | Yes |
| GET | /api/chats/ | Get user's chats | Yes |
| GET | /api/chats/:chat_id | Get chat messages | Yes |
| POST | /api/chats/message | Send message | Yes |
| PUT | /api/chats/:chat_id/read | Mark as read | Yes |

### Cart Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/cart/ | Get my cart | Yes |
| POST | /api/cart/add | Add to cart | Yes |
| POST | /api/cart/update | Update cart item | Yes |
| POST | /api/cart/clear | Clear cart | Yes |

## Notes
- WebSocket runs on same port as Express server (3000)
- Chat rooms use MongoDB chat IDs as room identifiers
- Messages are persisted to database before broadcasting
- Frontend auto-reconnects on connection loss
