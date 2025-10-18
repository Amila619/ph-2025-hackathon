# User Dashboard - Messages/Chat Feature

## Overview
Added a comprehensive Messages tab to the User Dashboard where users can view all their conversations and reply to messages in real-time.

## Features Implemented

### 1. **Messages Tab** ✅
- New tab in User Dashboard: "Messages"
- Badge showing unread message count
- Auto-refreshes on mount
- Two-panel layout: Chat list + Message view

### 2. **Chat List (Left Panel)** ✅
- Shows all user's conversations
- Displays:
  - Other participant's name
  - Item type (Product/Service) with icons
  - Last message preview
  - Timestamp of last message
  - Unread message count badge
- Click to select and view conversation
- Refresh button to reload chats
- Selected chat highlighted
- Sorted by most recent first

### 3. **Message View (Right Panel)** ✅
- Shows messages for selected conversation
- Features:
  - Scrollable message area
  - Messages styled as chat bubbles
  - Current user's messages: Blue, right-aligned
  - Other user's messages: White, left-aligned
  - Timestamps on each message
  - Auto-scroll to latest messages
  - Empty state when no messages

### 4. **Message Input** ✅
- Text area for typing messages
- Auto-expanding (1-3 rows)
- Send button with emoji icon
- Press Enter to send (Shift+Enter for new line)
- Disabled when no message typed
- Loading state while sending

### 5. **Real-time Updates** ✅
- Marks messages as read when viewing
- Updates unread count in real-time
- Refreshes chat list after sending message
- Shows success notification on send

## UI Components

### Messages Tab Structure
```jsx
<Tabs>
  <Tab key="messages" label="Messages 🔔2">
    <div className="flex gap-4" style="height: 600px">
      <!-- Left Panel: Chat List -->
      <Card title="Conversations" width="350px">
        <List>
          {chats.map(chat => (
            <ListItem onClick={selectChat}>
              - User Name
              - Item Type Icon
              - Last Message Preview
              - Unread Badge
              - Timestamp
            </ListItem>
          ))}
        </List>
      </Card>

      <!-- Right Panel: Messages -->
      <Card title="Chat with User">
        <!-- Messages Area -->
        <div className="messages-area">
          {messages.map(msg => (
            <MessageBubble>
              - Message Text
              - Timestamp
            </MessageBubble>
          ))}
        </div>

        <!-- Input Area -->
        <div className="message-input">
          <TextArea placeholder="Type a message..." />
          <Button>Send 📤</Button>
        </div>
      </Card>
    </div>
  </Tab>
</Tabs>
```

## State Management

### Added States
```javascript
const [chats, setChats] = useState([]);                    // All user's chats
const [selectedChat, setSelectedChat] = useState(null);     // Currently selected chat
const [chatMessages, setChatMessages] = useState([]);       // Messages in selected chat
const [newMessage, setNewMessage] = useState('');          // Input field value
const [loadingChats, setLoadingChats] = useState(false);   // Loading state
const [sendingMessage, setSendingMessage] = useState(false); // Sending state
```

## Functions Implemented

### 1. `loadChats()`
Fetches all user's conversations from backend
```javascript
GET /chats
Response: { data: [chat1, chat2, ...] }
```

### 2. `selectChat(chat)`
- Sets selected chat
- Fetches messages for that chat
- Marks messages as read
- Refreshes chat list

```javascript
GET /chats/:chat_id
PUT /chats/:chat_id/read
```

### 3. `sendChatMessage()`
- Sends message to backend
- Updates message list
- Clears input field
- Refreshes chat list
- Shows success notification

```javascript
POST /chats/message
Body: { chat_id, message }
```

### 4. `getOtherParticipant(chat)`
Returns the other user in the conversation (not current user)

### 5. `getUnreadCount(chat)`
Counts unread messages from other participants

## API Integration

### Backend Endpoints Used

#### **GET /chats**
- Fetches all user's conversations
- Returns: Array of chat objects with participants populated
- Sorted by last_message_at (descending)

#### **GET /chats/:chat_id**
- Fetches messages for specific chat
- Validates user is participant
- Returns: Chat object with messages array

#### **POST /chats/message**
- Sends a new message
- Body: `{ chat_id, message }`
- Validates user is participant
- Returns: Updated chat with new message

#### **PUT /chats/:chat_id/read**
- Marks all messages as read
- Only marks messages from other users
- Returns: Count of marked messages

## Data Models

### Chat Object
```javascript
{
  _id: ObjectId,
  participants: [
    {
      _id: ObjectId,
      name: { fname, lname },
      universityMail: String,
      contact: { email, phone }
    }
  ],
  product_id: String,
  service_id: String,
  item_type: 'product' | 'service',
  messages: [Message],
  last_message: String,
  last_message_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Object
```javascript
{
  sender_id: ObjectId,
  message: String,
  timestamp: Date,
  read: Boolean
}
```

## Visual Design

### Chat List Item
```
┌──────────────────────────────────────┐
│  👤 John Doe                    🔔 2 │
│  📦 Product                          │
│  Hey, is this still available?       │
│  2 hours ago                         │
└──────────────────────────────────────┘
```

### Message Bubbles

**Other User's Message (Left, White)**
```
┌──────────────────────────┐
│  Hello! Yes, it's        │
│  available.              │
│                 10:30 AM │
└──────────────────────────┘
```

**Current User's Message (Right, Blue)**
```
                ┌──────────────────────────┐
                │  Great! How much?        │
                │                 10:32 AM │
                └──────────────────────────┘
```

### Input Area
```
┌────────────────────────────────────────┬──────────┐
│  Type a message...                     │  Send 📤 │
│                                        │          │
└────────────────────────────────────────┴──────────┘
```

## User Flow

### 1. Viewing Chats
```
User clicks "Messages" tab
    ↓
Dashboard loads all chats (GET /chats)
    ↓
Chat list displayed with unread counts
    ↓
Badge shows total unread messages
```

### 2. Selecting a Chat
```
User clicks on a chat in list
    ↓
selectChat() called
    ↓
Fetch messages (GET /chats/:id)
    ↓
Mark as read (PUT /chats/:id/read)
    ↓
Display messages in right panel
    ↓
Refresh chat list (updates unread count)
```

### 3. Sending a Message
```
User types message
    ↓
Press Enter or click Send button
    ↓
POST /chats/message
    ↓
Backend saves message
    ↓
Update messages display
    ↓
Clear input field
    ↓
Refresh chat list
    ↓
Show success notification
```

## Features & UX

### ✅ **Unread Message Tracking**
- Badge on Messages tab shows total unread count
- Badge on each chat shows unread count for that chat
- Messages marked as read when viewing chat
- Real-time update of unread counts

### ✅ **Visual Indicators**
- 📦 Icon for product-related chats
- 🛠️ Icon for service-related chats
- 🔔 Badge for unread messages
- Highlighted background for selected chat
- Hover effect on chat items

### ✅ **Smart Input**
- Auto-expanding textarea (1-3 rows)
- Enter key sends message
- Shift+Enter adds new line
- Send button disabled when empty
- Loading state while sending

### ✅ **Empty States**
- "No conversations yet" when no chats
- "Select a conversation" when none selected
- "No messages yet" when chat is empty

### ✅ **Timestamps**
- Full date/time on chat list
- Short time format on messages (10:30 AM)
- Helps track conversation timeline

### ✅ **Responsive Layout**
- Fixed 600px height for chat area
- Scrollable message list
- Fixed input at bottom
- Two-column layout

## Styling

### Colors
- **Selected Chat**: `#f0f2f5` (light gray background)
- **Current User Messages**: `#1890ff` (blue background, white text)
- **Other User Messages**: `#fff` (white background, black text)
- **Message Area Background**: `#f9f9f9` (light gray)
- **Unread Badge**: Ant Design default (red)

### Dimensions
- **Chat List Panel**: 350px width
- **Message Area**: Flex 1 (remaining width)
- **Total Height**: 600px
- **Message Bubble**: Max 70% width
- **Border Radius**: 8-12px for rounded corners

## Integration with Existing Chat System

The Messages tab integrates with the existing chat infrastructure:

### **Backend** ✅
- Uses existing Chat model
- Uses existing chat controller functions
- Uses existing chat routes
- No backend changes needed

### **WebSocket Support** (Optional)
Current implementation uses REST API. For real-time updates, can be enhanced with Socket.IO:
```javascript
socket.on('receive_message', (data) => {
  // Update messages in real-time
  // Update chat list
  // Show notification
});
```

## Testing Checklist

### Basic Functionality
- [ ] Messages tab appears in dashboard
- [ ] Unread count shows on tab badge
- [ ] Chat list loads on tab open
- [ ] Click chat to select it
- [ ] Messages display for selected chat
- [ ] Can type and send messages
- [ ] Messages appear in chat bubble format
- [ ] Unread messages marked as read when viewing

### Edge Cases
- [ ] Empty state when no chats
- [ ] Empty state when no messages in chat
- [ ] Handle long messages (text wrapping)
- [ ] Handle many messages (scrolling)
- [ ] Send button disabled when input empty
- [ ] Loading states show properly
- [ ] Error handling for failed API calls

### Visual
- [ ] Chat list items styled correctly
- [ ] Selected chat highlighted
- [ ] Message bubbles aligned correctly (left/right)
- [ ] Colors correct (blue for sent, white for received)
- [ ] Timestamps visible
- [ ] Icons show (product/service)
- [ ] Badges show unread counts
- [ ] Hover effects work

## Future Enhancements

### Phase 2 (Optional)
- [ ] Real-time updates with WebSocket
- [ ] Typing indicators
- [ ] Message delivery/read receipts
- [ ] Image/file attachments
- [ ] Emoji picker
- [ ] Message search
- [ ] Delete messages
- [ ] Archive conversations
- [ ] Notifications for new messages
- [ ] Sound alerts
- [ ] Message reactions
- [ ] Group chats

### Phase 3 (Optional)
- [ ] Voice messages
- [ ] Video calls
- [ ] Message encryption
- [ ] Auto-translate messages
- [ ] Message templates
- [ ] Chat export

## Code Location

### Frontend
- **File**: `frontend/src/pages/UserDashboard.page.jsx`
- **Lines**: Added states, functions, and Messages tab
- **Components**: Uses Ant Design components (Card, List, Input, Button, Badge)

### Backend
- **Model**: `backend/model/chat.model.js`
- **Controller**: `backend/controllers/chat.controller.js`
- **Routes**: `backend/routes/chat.routes.js`
- **API Prefix**: `/api/chats`

## Summary

✅ **Messages tab added to User Dashboard**
✅ **View all conversations with unread counts**
✅ **Select and view messages**
✅ **Send replies with real-time updates**
✅ **Mark messages as read automatically**
✅ **Clean, intuitive chat interface**
✅ **Fully integrated with existing backend**

The chat feature is now fully functional and ready for testing! 🎉💬
