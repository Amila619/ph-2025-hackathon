# Navigation Debugging Guide

## Issue: Contact Seller button not navigating to chat page

### Step 1: Open Browser Console
1. Open your browser (Chrome/Edge/Firefox)
2. Press F12 or right-click → Inspect
3. Go to Console tab
4. Clear console (click 🚫 icon)

### Step 2: Click Contact Seller
When you click the "Contact Seller" button, you should see these logs:

```
=== CONTACT SELLER CLICKED ===
Item: { id: "...", sellerId: "...", title: "...", itemType: "..." }
isLoggedIn: true/false
User: { ... }
```

### Step 3: Check What Happens

#### Scenario A: Not Logged In
**Console shows:**
```
User not logged in, redirecting to login
```
**Expected:** Redirected to /login page
**If not working:** Check Auth context

#### Scenario B: Logged In
**Console shows:**
```
Navigating to /contact with state: { sellerId: "...", itemId: "...", itemType: "...", itemName: "..." }
Navigation called successfully
```
**Expected:** Redirected to /contact page
**If not working:** See troubleshooting below

### Step 4: Manual Route Test

Try accessing the route directly:
1. Make sure you're logged in
2. Type in browser: `http://localhost:5173/contact`
3. Add this to localStorage first if needed:
   - Open Console
   - Type: `localStorage.getItem('accessToken')`
   - If null, you need to login first

### Troubleshooting

#### Issue: Console shows "User not logged in" but you ARE logged in
**Solution:**
1. Check `localStorage.getItem('accessToken')` - should have a token
2. Check Auth context in React DevTools
3. Verify login actually succeeded
4. Try logging out and back in

#### Issue: Console shows navigation logs but page doesn't change
**Possible causes:**
1. **ProtectedRoute blocking:** Check if ProtectedRoute sees you as logged in
2. **Router issue:** Verify route is configured in App.jsx
3. **Browser history:** Try adding `replace: true` option

**Test ProtectedRoute:**
```javascript
// In browser console
import { useAuth } from './context/Auth.context';
const { isLoggedIn } = useAuth();
console.log(isLoggedIn);
```

#### Issue: Button click does nothing (no console logs)
**Possible causes:**
1. **Event not firing:** Check if button has onClick handler
2. **Parent element blocking:** Check if card div is intercepting clicks
3. **JavaScript error:** Check console for errors before clicking

**Verify button handler:**
- Inspect the button element
- Check Event Listeners tab in DevTools
- Should see `click` event

#### Issue: Navigation error in console
**Check:**
1. Error message details
2. Network tab for failed requests
3. React Router version compatibility

### Quick Fixes

#### Fix 1: Force Navigation with Link
Replace button with Link component:
```jsx
import { Link } from 'react-router-dom';

<Link 
  to="/contact"
  state={{
    sellerId: item.sellerId,
    itemId: item.id,
    itemType: item.itemType,
    itemName: item.title
  }}
  className="px-6 py-2 bg-red-800 text-white rounded-lg font-medium hover:bg-red-700 transition-colors inline-block"
>
  Contact Seller
</Link>
```

#### Fix 2: Use window.location (Last Resort)
```javascript
const handleContactSeller = (item, event) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (!isLoggedIn) {
    window.location.href = '/login';
    return;
  }
  
  // Store state in sessionStorage
  sessionStorage.setItem('contactState', JSON.stringify({
    sellerId: item.sellerId,
    itemId: item.id,
    itemType: item.itemType,
    itemName: item.title
  }));
  
  window.location.href = '/contact';
};
```

Then in Contact.jsx:
```javascript
// Get state from sessionStorage if not in location.state
const stateFromStorage = sessionStorage.getItem('contactState');
const { sellerId, itemId, itemType, itemName } = location.state || 
  (stateFromStorage ? JSON.parse(stateFromStorage) : {});

// Clear after reading
if (stateFromStorage) {
  sessionStorage.removeItem('contactState');
}
```

### Verification Checklist

- [ ] Console shows "CONTACT SELLER CLICKED" when button clicked
- [ ] isLoggedIn shows true in console
- [ ] Navigation state shows all required fields
- [ ] "Navigation called successfully" appears
- [ ] URL changes to /contact
- [ ] Contact page loads
- [ ] No errors in console
- [ ] Auth token exists in localStorage

### Expected Flow
1. Click "Contact Seller" button
2. Console logs appear
3. URL changes to `/contact`
4. Page transitions to Contact component
5. Chat interface loads
6. Socket connects
7. Chat initializes with seller

If any step fails, note which one and check the corresponding section above.
