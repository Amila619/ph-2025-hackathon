# User Dashboard - Visual Guide

## 🖥️ Dashboard Overview

```
┌─────────────────────────────────────────────────────────────┐
│  User Dashboard                    👑 PREMIUM USER  [Logout] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [ My Purchases ] [ Sell ] [ Cart ] [ Apply Welfare ] [...] │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Sell Tab - Product Management

### Create Product Form
```
┌─────────────────────────────────────────────────┐
│  Create Product                                 │
├─────────────────────────────────────────────────┤
│  [Product ID] [Name] [Price] [Category] [Desc] │
│  [        Create        ]                       │
└─────────────────────────────────────────────────┘
```

### My Products List
```
┌─────────────────────────────────────────────────┐
│  My Products                                    │
├─────────────────────────────────────────────────┤
│  📦 Fresh Vegetables Bundle                     │
│     Electronics - LKR 1500.00                   │
│     High quality fresh vegetables               │
│                           [Edit] [Delete] 🔵    │
├─────────────────────────────────────────────────┤
│  📦 Organic Rice - 5kg Pack                     │
│     Food - LKR 2500.00                         │
│     Premium organic rice from local farmers     │
│                           [Edit] [Delete] 🔵    │
└─────────────────────────────────────────────────┘
```

## 🛠️ Sell Tab - Service Management

### Create Service Form
```
┌─────────────────────────────────────────────────┐
│  Create Service                                 │
├─────────────────────────────────────────────────┤
│  [Service ID] [Category] [Status] [Description]│
│  [        Create        ]                       │
└─────────────────────────────────────────────────┘
```

### My Services List
```
┌─────────────────────────────────────────────────┐
│  My Services                                    │
├─────────────────────────────────────────────────┤
│  🔧 Plumbing Services                           │
│     active                                      │
│     Professional plumbing and repair services   │
│                           [Edit] [Delete] 🟢    │
├─────────────────────────────────────────────────┤
│  🌾 Agricultural Consulting                     │
│     active                                      │
│     Expert advice on farming techniques         │
│                           [Edit] [Delete] 🟢    │
└─────────────────────────────────────────────────┘
```

## ✏️ Edit Product Modal

```
┌──────────────────────────────────────────┐
│  Edit Product                      [X]   │
├──────────────────────────────────────────┤
│                                          │
│  Product Name:                           │
│  ┌──────────────────────────────────┐   │
│  │ Fresh Vegetables Bundle          │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Price:                                  │
│  ┌──────────────────────────────────┐   │
│  │ 1500                             │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Category:                               │
│  ┌──────────────────────────────────┐   │
│  │ Electronics                      │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Description:                            │
│  ┌──────────────────────────────────┐   │
│  │ High quality fresh vegetables    │   │
│  │ from local farmers               │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Update Product]  [Cancel]             │
└──────────────────────────────────────────┘
```

## 🗑️ Delete Confirmation

```
┌──────────────────────────────────────────┐
│  Delete Product                    [X]   │
├──────────────────────────────────────────┤
│                                          │
│  ⚠️  Are you sure you want to delete    │
│      "Fresh Vegetables Bundle"?          │
│                                          │
│  This action cannot be undone.           │
│                                          │
│                [Cancel]  [Delete]        │
│                            ↑ Red         │
└──────────────────────────────────────────┘
```

## 💳 Cart Tab

```
┌─────────────────────────────────────────────────┐
│  My Cart                                        │
├─────────────────────────────────────────────────┤
│  product - 507f1f77bcf86cd799439011 x 1        │
│  product - 507f191e810c19729de860ea x 2        │
│  service - 507f1f77bcf86cd799439012 x 1        │
└─────────────────────────────────────────────────┘
```

## 💰 Payment History Tab

```
┌─────────────────────────────────────────────────────────────┐
│  Payment History                                            │
├─────────────────────────────────────────────────────────────┤
│  👑 Premium Upgrade                         LKR 5,000.00   │
│     Premium User Upgrade - Lifetime Access                  │
│     Order: ORD-1234567890                   ✅ COMPLETED    │
│                                             Jan 15, 2025    │
├─────────────────────────────────────────────────────────────┤
│  🛍️ Product Purchase                        LKR 1,500.00   │
│     Fresh Vegetables Bundle                                 │
│     Order: ORD-0987654321                   ⏳ PENDING     │
│                                             Jan 14, 2025    │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Posting Limits Display

### Regular User (Limited)
```
┌─────────────────────────────────────────────────┐
│  Posting Limits                                 │
├─────────────────────────────────────────────────┤
│  Your Posts: 2 Products + 1 Services = 3 Total │
│                                  🟢 2 remaining │
│                                      (3/5 used) │
│                                                 │
│  Regular users can post up to 5 items.         │
│  Upgrade to Premium for unlimited posts! 👑    │
└─────────────────────────────────────────────────┘
```

### Premium User (Unlimited)
```
┌─────────────────────────────────────────────────┐
│  Posting Limits                                 │
├─────────────────────────────────────────────────┤
│  Your Posts: 10 Products + 8 Services = 18 Total│
│                      🟢 Premium user - Unlimited │
└─────────────────────────────────────────────────┘
```

## 🎨 Status Indicators

### Tags
- 🔵 **Blue** - Product
- 🟢 **Green** - Service

### Payment Status
- ✅ **Green** - Completed
- ⏳ **Orange** - Pending
- ❌ **Red** - Failed

### Buttons
- **[Edit]** - Link style, blue
- **[Delete]** - Link style, red (danger)
- **[Create]** - Primary button
- **[Update]** - Primary button
- **[Cancel]** - Default button

## 📱 Responsive Design

### Desktop View
```
┌────────────────────────────────────────┐
│  Create Product Form (Inline)         │
│  [ID] [Name] [Price] [Category] [Desc]│
│                         [Create]       │
└────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────┐
│  Create Product  │
├──────────────────┤
│  [Product ID]    │
│  [Name]          │
│  [Price]         │
│  [Category]      │
│  [Description]   │
│  [Create]        │
└──────────────────┘
```

## 🔄 Data Flow Visualization

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│  Browser │ ───> │  Backend │ ───> │ MongoDB  │
│   React  │      │  Express │      │ Database │
└──────────┘      └──────────┘      └──────────┘
     ↑                  │                  │
     │                  ↓                  │
     └───────── Response ←─────────────────┘
```

### Create Flow
```
User fills form
    ↓
Validates input
    ↓
POST /products
    ↓
Authenticate JWT
    ↓
Save to MongoDB
    ↓
Return product
    ↓
Update UI state
    ↓
Show success toast
```

### Update Flow
```
User clicks Edit
    ↓
Open modal with current values
    ↓
User modifies fields
    ↓
PUT /products/:id
    ↓
Authenticate & authorize
    ↓
Update in MongoDB
    ↓
Return updated product
    ↓
Update UI state
    ↓
Close modal & show success
```

### Delete Flow
```
User clicks Delete
    ↓
Show confirmation dialog
    ↓
User confirms
    ↓
DELETE /products/:id
    ↓
Authenticate & authorize
    ↓
Remove from MongoDB
    ↓
Return success
    ↓
Remove from UI state
    ↓
Show success toast
```

## 🎭 User Experience Flow

1. **Login** → Dashboard
2. **Navigate** to "Sell" tab
3. **View** existing products/services
4. **Create** new items using forms
5. **Edit** items by clicking Edit button
6. **Delete** items with confirmation
7. **Monitor** posting limits (if regular user)
8. **Upgrade** to premium for unlimited posts

## 🔔 Toast Notifications

### Success Messages
```
┌───────────────────────────────────┐
│ ✅ Product created successfully!  │
└───────────────────────────────────┘
```

### Error Messages
```
┌────────────────────────────────────────┐
│ ❌ Failed to create product: [reason]  │
└────────────────────────────────────────┘
```

### Warning Messages
```
┌──────────────────────────────────────┐
│ ⚠️  Posting limit reached!           │
└──────────────────────────────────────┘
```

## 📊 Empty States

### No Products
```
┌─────────────────────────────────┐
│  My Products                    │
├─────────────────────────────────┤
│                                 │
│         📦                      │
│  No products created yet        │
│                                 │
└─────────────────────────────────┘
```

### No Services
```
┌─────────────────────────────────┐
│  My Services                    │
├─────────────────────────────────┤
│                                 │
│         🛠️                      │
│  No services created yet        │
│                                 │
└─────────────────────────────────┘
```

## 🎯 Action Buttons Layout

```
┌────────────────────────────────────────────────────────┐
│  Product Name - Details                                │
│                                      [Edit]  [Delete]  │
└────────────────────────────────────────────────────────┘
```

## 🏷️ Premium Badge

```
┌─────────────────────────────────────────┐
│  User Dashboard  👑 PREMIUM USER        │
│                         [Logout]        │
└─────────────────────────────────────────┘
```

This visual guide helps understand the layout and flow of the User Dashboard CRUD operations!
