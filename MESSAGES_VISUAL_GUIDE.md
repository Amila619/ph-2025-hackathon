# Messages Tab - Visual Guide

## 📱 Tab Layout

```
┌────────────────────────────────────────────────────────────────┐
│  User Dashboard                                    👑 [Logout] │
├────────────────────────────────────────────────────────────────┤
│  [My Purchases] [Sell] [Cart] [Messages 🔔2] [Payments] [...]│
│                                    ↑                            │
│                         Badge shows unread count               │
└────────────────────────────────────────────────────────────────┘
```

## 💬 Messages Tab - Two Panel Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Messages                                  │
├────────────────────────┬────────────────────────────────────────────┤
│  Conversations  [🔄]   │  Chat with John Doe                        │
│                        │  📦 Product Chat                           │
├────────────────────────┼────────────────────────────────────────────┤
│                        │                                            │
│  👤 John Doe      🔔 2 │  ┌──────────────────────┐                 │
│  📦 Product            │  │ Hi! Is this still    │                 │
│  Is this available?    │  │ available?           │                 │
│  2 hours ago           │  │            10:25 AM  │                 │
│  ─────────────────────│  └──────────────────────┘                 │
│                        │                                            │
│  👤 Jane Smith         │                  ┌──────────────────────┐ │
│  🛠️ Service            │                  │ Yes, it is!          │ │
│  What's the price?     │                  │          10:30 AM    │ │
│  Yesterday             │                  └──────────────────────┘ │
│  ─────────────────────│                                            │
│                        │  ┌──────────────────────┐                 │
│  👤 Mike Johnson       │  │ How much does it     │                 │
│  📦 Product            │  │ cost?                │                 │
│  No messages yet       │  │            10:35 AM  │                 │
│  3 days ago            │  └──────────────────────┘                 │
│                        │                                            │
│                        │                  ┌──────────────────────┐ │
│                        │                  │ It's LKR 1500        │ │
│                        │                  │          10:36 AM    │ │
│                        │                  └──────────────────────┘ │
│                        │                                            │
│                        ├────────────────────────────────────────────┤
│                        │  ┌──────────────────────────┬──────────┐  │
│                        │  │ Type a message...        │ Send 📤  │  │
│                        │  └──────────────────────────┴──────────┘  │
└────────────────────────┴────────────────────────────────────────────┘
   350px width              Flexible width (remaining space)
```

## 📋 Chat List Item - Detailed View

### With Unread Messages
```
┌──────────────────────────────────────────┐
│  👤 John Doe                       🔔 2  │ ← Unread badge
│  📦 Product                               │ ← Item type icon
│  ───────────────────────────────────────│
│  Is this still available?                │ ← Last message preview
│  ───────────────────────────────────────│
│  Jan 15, 2025, 2:30 PM                   │ ← Timestamp
└──────────────────────────────────────────┘
```

### Without Unread Messages
```
┌──────────────────────────────────────────┐
│  👤 Jane Smith                            │
│  🛠️ Service                               │
│  ───────────────────────────────────────│
│  That sounds good, thanks!               │
│  ───────────────────────────────────────│
│  Jan 14, 2025, 10:15 AM                  │
└──────────────────────────────────────────┘
```

### Selected Chat (Highlighted)
```
┌──────────────────────────────────────────┐
│  👤 John Doe                       🔔 2  │
│  📦 Product                               │  ← Gray background
│  ───────────────────────────────────────│     when selected
│  Is this still available?                │
│  ───────────────────────────────────────│
│  Jan 15, 2025, 2:30 PM                   │
└──────────────────────────────────────────┘
   Background: #f0f2f5 (light gray)
```

## 💭 Message Bubbles

### Other User's Message (Left Side)
```
┌────────────────────────────────────────┐
│                                        │
│  ┌──────────────────────┐              │
│  │ Hello! Is this       │              │
│  │ product still        │  ← White     │
│  │ available?           │     bubble   │
│  │            10:25 AM  │              │
│  └──────────────────────┘              │
│                                        │
└────────────────────────────────────────┘
```

### Current User's Message (Right Side)
```
┌────────────────────────────────────────┐
│                                        │
│              ┌──────────────────────┐  │
│              │ Yes, it's available! │  │ ← Blue
│              │                      │  │   bubble
│              │          10:30 AM    │  │
│              └──────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

### Long Message (Wrapped Text)
```
┌────────────────────────────────────────┐
│                                        │
│  ┌──────────────────────┐              │
│  │ This is a much       │              │
│  │ longer message that  │              │
│  │ will wrap to         │              │
│  │ multiple lines when  │              │
│  │ displayed in the     │              │
│  │ chat bubble          │              │
│  │            10:35 AM  │              │
│  └──────────────────────┘              │
│                                        │
└────────────────────────────────────────┘
Max width: 70% of container
```

## ⌨️ Message Input Area

### Normal State
```
┌─────────────────────────────────────────────┬──────────────┐
│  Type a message...                          │   Send 📤    │
│                                             │   (Active)   │
└─────────────────────────────────────────────┴──────────────┘
```

### With Text Typed
```
┌─────────────────────────────────────────────┬──────────────┐
│  Hello! I'm interested in this product.     │   Send 📤    │
│                                             │   (Blue)     │
└─────────────────────────────────────────────┴──────────────┘
```

### Multi-line Text (Auto-expanding)
```
┌─────────────────────────────────────────────┬──────────────┐
│  Hello! I'm interested in this product.     │              │
│  Can you tell me more about it?             │   Send 📤    │
│  What's the condition?                      │              │
└─────────────────────────────────────────────┴──────────────┘
Auto-expands: 1-3 rows
```

### Sending State
```
┌─────────────────────────────────────────────┬──────────────┐
│                                             │   ⏳ Send    │
│                                             │  (Loading)   │
└─────────────────────────────────────────────┴──────────────┘
```

## 📊 Empty States

### No Conversations
```
┌────────────────────────────────────────┐
│  Conversations              [🔄]       │
├────────────────────────────────────────┤
│                                        │
│            💬                          │
│                                        │
│      No conversations yet              │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

### No Chat Selected
```
┌────────────────────────────────────────┐
│  Select a conversation                 │
├────────────────────────────────────────┤
│                                        │
│                                        │
│            💬                          │
│                                        │
│  Select a conversation to view         │
│  messages                              │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

### No Messages in Chat
```
┌────────────────────────────────────────┐
│  Chat with John Doe                    │
│  📦 Product Chat                       │
├────────────────────────────────────────┤
│                                        │
│            💭                          │
│                                        │
│  No messages yet.                      │
│  Start the conversation!               │
│                                        │
├────────────────────────────────────────┤
│  ┌──────────────────┬──────────────┐  │
│  │ Type a message...│   Send 📤    │  │
│  └──────────────────┴──────────────┘  │
└────────────────────────────────────────┘
```

## 🎨 Color Scheme

### Message Bubbles
- **Current User**: 
  - Background: `#1890ff` (Blue)
  - Text: `#ffffff` (White)
  - Alignment: Right

- **Other User**:
  - Background: `#ffffff` (White)
  - Text: `#000000` (Black)
  - Alignment: Left
  - Shadow: `0 1px 2px rgba(0,0,0,0.1)`

### Chat List
- **Normal**: Transparent background
- **Hover**: `#f5f5f5` (light gray)
- **Selected**: `#f0f2f5` (darker gray)

### Badges
- **Unread Count**: Red badge with white text
- **Item Type Icons**: 
  - 📦 Blue for products
  - 🛠️ Green for services

## 🔔 Badge System

### Tab Badge (Total Unread)
```
Messages 🔔5
         ↑
    Total unread across
    all conversations
```

### Chat Item Badge (Per Chat)
```
John Doe    🔔2
            ↑
       Unread in this
       conversation
```

### Badge Calculation
```javascript
// Total unread for tab
chats.reduce((sum, chat) => sum + getUnreadCount(chat), 0)

// Per chat unread
chat.messages.filter(msg => 
  msg.sender_id !== user._id && !msg.read
).length
```

## 📱 Responsive Behavior

### Desktop (Large Screens)
```
┌──────────┬───────────────────┐
│   List   │   Messages        │
│  350px   │   Flexible        │
└──────────┴───────────────────┘
```

### Tablet (Medium Screens)
```
┌─────────┬──────────────┐
│  List   │  Messages    │
│  300px  │  Flexible    │
└─────────┴──────────────┘
```

### Mobile (Recommended Future)
```
┌──────────────┐     ┌──────────────┐
│   List       │  →  │   Messages   │
│   Full       │     │   Full       │
│   Width      │     │   Width      │
└──────────────┘     └──────────────┘
  Show one at a time, toggle between
```

## ⌨️ Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Escape**: Close modal (if any)

## 🎯 Interactive Elements

### Clickable Areas
```
┌──────────────────────────────────────┐
│  [Click entire area to select chat]  │ ← Cursor: pointer
│                                      │
│  John Doe                      🔔 2  │
│  📦 Product                          │
│  Is this available?                  │
│  2 hours ago                         │
└──────────────────────────────────────┘
```

### Hover Effect
```
Normal:      Background: transparent
Hover:       Background: #f5f5f5
Selected:    Background: #f0f2f5
```

## 🔄 Loading States

### Loading Chats
```
┌────────────────────────────────────────┐
│  Conversations        [⏳ Loading...]  │
├────────────────────────────────────────┤
│                                        │
│  Loading conversations...              │
│                                        │
└────────────────────────────────────────┘
```

### Sending Message
```
┌─────────────────────────────────────────────┐
│  Type a message...          [⏳ Sending...] │
└─────────────────────────────────────────────┘
```

## 📏 Dimensions

| Element | Dimension |
|---------|-----------|
| Total Height | 600px (fixed) |
| Chat List Width | 350px (fixed) |
| Message Area | Flex 1 (remaining) |
| Message Bubble | Max 70% width |
| Border Radius | 8-12px |
| Padding | 12-16px |
| Gap Between Panels | 16px |
| Message Margin | 12px bottom |

## 🎭 Message Alignment

```
Left (Other User):
┌────────────────────────────────────────┐
│ [Bubble]                               │
│                                        │
└────────────────────────────────────────┘

Right (Current User):
┌────────────────────────────────────────┐
│                        [Bubble]        │
│                                        │
└────────────────────────────────────────┘
```

This visual guide helps understand the layout, styling, and interactions of the Messages feature! 💬✨
