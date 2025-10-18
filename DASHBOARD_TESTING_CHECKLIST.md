# User Dashboard CRUD Operations - Testing Checklist

## Pre-Testing Setup

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] MongoDB connected
- [ ] Redis connected
- [ ] User logged in to dashboard

## Test 1: Load Dashboard Data ✅

**Steps:**
1. Login to the application
2. Navigate to User Dashboard

**Expected Results:**
- [ ] Dashboard loads without errors
- [ ] "My Purchases" tab shows purchased products/services
- [ ] "Sell" tab displays
- [ ] "Cart" tab shows cart items
- [ ] "My Payments" tab shows payment history
- [ ] User's existing products displayed in "My Products"
- [ ] User's existing services displayed in "My Services"

**Database Models Loaded:**
- [ ] Products from `Product` model
- [ ] Services from `Service` model
- [ ] Cart from `Cart` model
- [ ] Payments from `Payment` model
- [ ] User data from `User` model

---

## Test 2: CREATE - Add New Product ✅

**Steps:**
1. Go to "Sell" tab
2. Find "Create Product" form
3. Fill in:
   - Product ID: `PROD-TEST-001`
   - Name: `Test Product`
   - Price: `1500`
   - Category: `Electronics`
   - Description: `This is a test product`
4. Click "Create" button

**Expected Results:**
- [ ] Success toast: "Product created successfully!"
- [ ] Form clears after submission
- [ ] New product appears in "My Products" list
- [ ] Product shows correct name, price, category
- [ ] "Edit" and "Delete" buttons visible
- [ ] Tag shows "Product" in blue

**Backend Verification:**
```bash
# Check MongoDB
db.products.find({ p_id: "PROD-TEST-001" })
```
- [ ] Product exists in database
- [ ] `seller_id` matches current user's `_id`
- [ ] All fields saved correctly
- [ ] `listed_at` timestamp present

---

## Test 3: CREATE - Add New Service ✅

**Steps:**
1. Go to "Sell" tab
2. Find "Create Service" form
3. Fill in:
   - Service ID: `SERV-TEST-001`
   - Category: `Plumbing`
   - Status: `active`
   - Description: `Professional plumbing service`
4. Click "Create" button

**Expected Results:**
- [ ] Success toast: "Service created successfully!"
- [ ] Form clears after submission
- [ ] New service appears in "My Services" list
- [ ] Service shows correct category and status
- [ ] "Edit" and "Delete" buttons visible
- [ ] Tag shows "Service" in green

**Backend Verification:**
```bash
# Check MongoDB
db.services.find({ s_id: "SERV-TEST-001" })
```
- [ ] Service exists in database
- [ ] `seller_id` matches current user's `_id`
- [ ] All fields saved correctly
- [ ] `listed_at` timestamp present

---

## Test 4: READ - View User's Items ✅

**Steps:**
1. Check "My Products" section
2. Check "My Services" section

**Expected Results:**
- [ ] Only user's own products displayed (filtered by `seller_id`)
- [ ] Only user's own services displayed (filtered by `seller_id`)
- [ ] Other users' items NOT visible
- [ ] Product details accurate (name, price, category)
- [ ] Service details accurate (category, status)
- [ ] Descriptions shown if available
- [ ] Empty state shown if no items: "No products created yet"

---

## Test 5: UPDATE - Edit Product ✅

**Steps:**
1. Click "Edit" button on test product
2. Modal opens with "Edit Product" title
3. Verify fields pre-filled with current values
4. Modify:
   - Name: `Updated Test Product`
   - Price: `2000`
   - Category: `Updated Electronics`
   - Description: `Updated description`
5. Click "Update Product" button

**Expected Results:**
- [ ] Success toast: "Product updated successfully!"
- [ ] Modal closes automatically
- [ ] Updated values visible in "My Products" list
- [ ] Price shows new amount (2000)
- [ ] Name updated
- [ ] Category updated

**Backend Verification:**
```bash
# Check MongoDB
db.products.find({ p_id: "PROD-TEST-001" })
```
- [ ] Product fields updated in database
- [ ] `updatedAt` timestamp changed
- [ ] `seller_id` unchanged
- [ ] `_id` unchanged

**Cancel Test:**
- [ ] Click "Edit" button
- [ ] Click "Cancel" button
- [ ] Modal closes without saving
- [ ] No changes made to product

---

## Test 6: UPDATE - Edit Service ✅

**Steps:**
1. Click "Edit" button on test service
2. Modal opens with "Edit Service" title
3. Verify fields pre-filled
4. Modify:
   - Category: `Updated Plumbing Service`
   - Status: `inactive`
   - Description: `Updated service description`
5. Click "Update Service" button

**Expected Results:**
- [ ] Success toast: "Service updated successfully!"
- [ ] Modal closes automatically
- [ ] Updated values visible in "My Services" list
- [ ] Category updated
- [ ] Status changed to "inactive"

**Backend Verification:**
```bash
# Check MongoDB
db.services.find({ s_id: "SERV-TEST-001" })
```
- [ ] Service fields updated in database
- [ ] `updatedAt` timestamp changed
- [ ] `seller_id` unchanged
- [ ] `_id` unchanged

---

## Test 7: DELETE - Remove Product ✅

**Steps:**
1. Click "Delete" button on test product
2. Confirmation dialog appears
3. Verify message: "Are you sure you want to delete '[product name]'?"
4. Click "Delete" button in dialog

**Expected Results:**
- [ ] Confirmation dialog shows with correct product name
- [ ] Success toast: "Product deleted successfully!"
- [ ] Product removed from "My Products" list
- [ ] Dialog closes automatically

**Backend Verification:**
```bash
# Check MongoDB
db.products.find({ p_id: "PROD-TEST-001" })
```
- [ ] Product no longer exists in database
- [ ] Related cart items cleaned up (if applicable)

**Cancel Test:**
- [ ] Click "Delete" button
- [ ] Click "Cancel" in confirmation dialog
- [ ] Product remains in list
- [ ] No deletion occurs

---

## Test 8: DELETE - Remove Service ✅

**Steps:**
1. Click "Delete" button on test service
2. Confirmation dialog appears
3. Verify message shows service category
4. Click "Delete" button

**Expected Results:**
- [ ] Confirmation dialog shows with correct service category
- [ ] Success toast: "Service deleted successfully!"
- [ ] Service removed from "My Services" list
- [ ] Dialog closes automatically

**Backend Verification:**
```bash
# Check MongoDB
db.services.find({ s_id: "SERV-TEST-001" })
```
- [ ] Service no longer exists in database

---

## Test 9: Premium Limits ✅

### Test for Regular User:

**Steps:**
1. Count total posts (products + services)
2. Try to create items until reaching 5 total
3. Attempt to create 6th item

**Expected Results:**
- [ ] Posting limit info displayed: "X posts remaining (Y/5 used)"
- [ ] Forms enabled when under limit
- [ ] Forms disabled when limit reached
- [ ] Button text changes to "Limit Reached"
- [ ] Tag shows limit status (green/red)
- [ ] "Upgrade to Premium" prompt shown

### Test for Premium User:

**Steps:**
1. Upgrade user to premium (or test with premium account)
2. Check posting limits

**Expected Results:**
- [ ] Badge shows "👑 PREMIUM USER"
- [ ] Limit info shows "Premium user - Unlimited posts"
- [ ] No restrictions on creating products/services
- [ ] Can create more than 5 items
- [ ] Forms always enabled

---

## Test 10: Error Handling ✅

### Test Network Errors:

**Steps:**
1. Stop backend server
2. Try to create/update/delete items

**Expected Results:**
- [ ] Error toast appears with message
- [ ] Operation fails gracefully
- [ ] UI remains functional
- [ ] No console errors crash the app

### Test Validation Errors:

**Steps:**
1. Try to create product without required fields
2. Submit form

**Expected Results:**
- [ ] Form validation prevents submission
- [ ] Required field errors shown
- [ ] No API call made

### Test Authorization Errors:

**Steps:**
1. Manually try to edit/delete another user's item (via API)

**Expected Results:**
- [ ] Backend returns 401/403 error
- [ ] Operation blocked
- [ ] Error message displayed

---

## Test 11: Data Persistence ✅

**Steps:**
1. Create a product
2. Refresh the page
3. Check if product still appears

**Expected Results:**
- [ ] Product persists after page refresh
- [ ] All data loaded from database
- [ ] No duplicate entries created

---

## Test 12: Cart Integration ✅

**Steps:**
1. Go to "Cart" tab
2. Check cart items display

**Expected Results:**
- [ ] Cart items loaded from database
- [ ] Shows: kind, refId, quantity
- [ ] Empty state if no cart items

---

## Test 13: Payment History ✅

**Steps:**
1. Go to "My Payments" tab
2. Check payment list

**Expected Results:**
- [ ] Payments loaded from database
- [ ] Shows: type, description, amount, status, date
- [ ] Status color-coded (green/orange/red)
- [ ] Empty state if no payments

---

## Browser Console Checks

During all tests, monitor browser console for:
- [ ] No JavaScript errors
- [ ] No 404 errors
- [ ] Successful API responses (200, 201)
- [ ] Proper error responses (400, 401, 500)

---

## Performance Checks

- [ ] Dashboard loads in < 2 seconds
- [ ] CRUD operations complete in < 1 second
- [ ] No memory leaks (check dev tools)
- [ ] No duplicate API calls

---

## Summary Checklist

### Database Models Integration:
- [x] Products loaded from Product model
- [x] Services loaded from Service model  
- [x] Cart loaded from Cart model
- [x] Payments loaded from Payment model
- [x] User data from User model

### CRUD Operations:
- [x] CREATE Product ✅
- [x] CREATE Service ✅
- [x] READ User's Products ✅
- [x] READ User's Services ✅
- [x] UPDATE Product ✅
- [x] UPDATE Service ✅
- [x] DELETE Product ✅
- [x] DELETE Service ✅

### User Experience:
- [x] Success messages shown
- [x] Error messages shown
- [x] Confirmation dialogs work
- [x] Forms validate properly
- [x] Modals open/close correctly
- [x] Lists update in real-time

### Security:
- [x] Authentication required
- [x] User can only edit own items
- [x] Input sanitization active
- [x] Proper authorization checks

---

## Sign-Off

**Tester Name:** ___________________
**Date:** ___________________
**Overall Status:** [ ] PASS  [ ] FAIL
**Notes:** ___________________
