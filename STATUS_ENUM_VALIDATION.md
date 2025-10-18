# Status Enum Validation Implementation

## Overview
Implemented strict enum validation for product and service status fields to ensure only valid values ("active" or "inactive") are accepted. Invalid values like "pending" will now trigger validation errors.

---

## Backend Changes

### 1. Product Model (`backend/model/product.model.js`)

**Added Status Field with Enum Validation:**

```javascript
status: {
  type: String,
  enum: {
    values: ["active", "inactive"],
    message: "Status must be either 'active' or 'inactive'. '{VALUE}' is not a valid status."
  },
  default: "active"
}
```

**Key Features:**
- ✅ **Enum Values**: Only `"active"` or `"inactive"` are allowed
- ✅ **Custom Error Message**: Clear message showing what value was rejected
- ✅ **Default Value**: Products default to `"active"` status
- ❌ **Rejected Values**: "pending", "sold", "draft", or any other value

**Example Error Response:**
```json
{
  "message": "Status must be either 'active' or 'inactive'. 'pending' is not a valid status."
}
```

---

### 2. Service Model (`backend/model/service.model.js`)

**Updated Status Field with Enhanced Error Message:**

**Before:**
```javascript
status: {
  type: String,
  enum: ["active", "inactive"],
  default: "inactive"
}
```

**After:**
```javascript
status: {
  type: String,
  enum: {
    values: ["active", "inactive"],
    message: "Status must be either 'active' or 'inactive'. '{VALUE}' is not a valid status."
  },
  default: "active"
}
```

**Changes:**
- ✅ Added custom error message with rejected value placeholder `{VALUE}`
- ✅ Changed default from `"inactive"` to `"active"` (consistent with products)
- ✅ Same strict validation as products

---

## Frontend Changes

### 1. Status Options State (`frontend/src/pages/UserDashboard.page.jsx`)

**Before:**
```javascript
const [serviceStatuses] = useState(['active', 'inactive', 'pending']);
```

**After:**
```javascript
const [statusOptions] = useState(['active', 'inactive']);
```

**Changes:**
- ✅ Removed `"pending"` from valid status options
- ✅ Renamed from `serviceStatuses` to `statusOptions` (used for both products and services)
- ✅ Consistent with backend enum validation

---

### 2. Create Product Form - Added Status Field

**New Status Field:**
```jsx
<Form.Item 
    name="status" 
    label="Status"
    initialValue="active"
>
    <Select 
        placeholder="Select status" 
        disabled={!canPostMore()}
    >
        {statusOptions.map(status => (
            <Select.Option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Select.Option>
        ))}
    </Select>
</Form.Item>
```

**Features:**
- ✅ Dropdown with "Active" and "Inactive" options
- ✅ Defaults to "active"
- ✅ Capitalized display names
- ✅ Disabled when posting limit reached

**Description Field Updated:**
- Changed to span full width: `style={{ gridColumn: '1 / -1' }}`
- Increased rows from 1 to 2 for better UX

---

### 3. Create Service Form - Updated Status Field

**Updated to use `statusOptions`:**
```jsx
<Form.Item 
    name="status" 
    label="Status"
    initialValue="active"
>
    <Select 
        placeholder="Select status" 
        disabled={!canPostMore()}
    >
        {statusOptions.map(status => (
            <Select.Option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Select.Option>
        ))}
    </Select>
</Form.Item>
```

**Changes:**
- ✅ Removed reference to `serviceStatuses`
- ✅ Now uses `statusOptions` (same as products)
- ✅ Consistent capitalization across both forms

---

### 4. Edit Product Modal - Added Status Field

**New Status Field:**
```jsx
<Form.Item 
    name="status" 
    label="Status"
>
    <Select placeholder="Select Status">
        {statusOptions.map(status => (
            <Select.Option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Select.Option>
        ))}
    </Select>
</Form.Item>
```

**Updated `handleEditProduct` Function:**
```javascript
const handleEditProduct = (product) => {
    setEditProductModal({ visible: true, product });
    productForm.setFieldsValue({
        name: product.name,
        price: product.price,
        category: product.category,
        status: product.status || 'active',  // NEW: includes status
        p_description: product.p_description
    });
};
```

**Features:**
- ✅ Pre-fills current status when editing
- ✅ Falls back to "active" if status is missing (backward compatibility)
- ✅ Same dropdown as create form

---

### 5. Edit Service Modal - Updated Status Field

**Updated to use `statusOptions` with capitalization:**
```jsx
<Form.Item 
    name="status" 
    label="Status"
>
    <Select placeholder="Select Status">
        {statusOptions.map(status => (
            <Select.Option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Select.Option>
        ))}
    </Select>
</Form.Item>
```

**Changes:**
- ✅ Replaced `serviceStatuses` with `statusOptions`
- ✅ Added proper capitalization (was missing before)
- ✅ Consistent with product edit modal

---

## Validation Behavior

### Valid Requests

**Creating a Product:**
```json
{
  "name": "Calculus Textbook",
  "price": 1500,
  "category": "Books",
  "status": "active",
  "p_description": "Mint condition"
}
```
✅ **Result**: Product created successfully

**Creating a Service:**
```json
{
  "s_category": "Tutoring",
  "status": "inactive",
  "s_description": "Math tutoring"
}
```
✅ **Result**: Service created successfully

---

### Invalid Requests

**Creating a Product with Invalid Status:**
```json
{
  "name": "Calculus Textbook",
  "price": 1500,
  "category": "Books",
  "status": "pending",  // ❌ INVALID
  "p_description": "Mint condition"
}
```
❌ **Error Response (400)**:
```json
{
  "message": "Status must be either 'active' or 'inactive'. 'pending' is not a valid status."
}
```

**Creating a Service with Invalid Status:**
```json
{
  "s_category": "Tutoring",
  "status": "sold",  // ❌ INVALID
  "s_description": "Math tutoring"
}
```
❌ **Error Response (400)**:
```json
{
  "message": "Status must be either 'active' or 'inactive'. 'sold' is not a valid status."
}
```

**Updating with Invalid Status:**
```json
{
  "status": "draft"  // ❌ INVALID
}
```
❌ **Error Response (400)**:
```json
{
  "message": "Status must be either 'active' or 'inactive'. 'draft' is not a valid status."
}
```

---

## Status Options

### Valid Values (Only 2)

| Value | Display | Default For | Description |
|-------|---------|-------------|-------------|
| `active` | Active | Products & Services | Item is available and visible to buyers |
| `inactive` | Inactive | - | Item is hidden from marketplace |

### Removed Values

| Value | Reason for Removal |
|-------|-------------------|
| `pending` | Not needed - items are either active or inactive |
| `sold` | Should be tracked differently (e.g., purchase records) |
| `draft` | Not in schema - create locally or save inactive |
| Any other | Not supported by backend enum validation |

---

## User Experience Flow

### Creating a Product with Status

1. **User opens Create Product form**
   - Status dropdown shows: "Active" (selected) and "Inactive"
   - Default is "Active"

2. **User fills form and clicks "Create Product"**
   - Frontend sends status value: `"active"` or `"inactive"`
   - Backend validates against enum
   - If valid: Product created ✅
   - If invalid: Error toast shown ❌

3. **Product appears in "My Products" list**
   - Shows with the selected status

### Editing a Product Status

1. **User clicks "Edit" on a product**
   - Modal opens with current status pre-selected
   - Can change between "Active" and "Inactive"

2. **User changes status and clicks "Update"**
   - Backend validates new status
   - If valid: Product updated ✅
   - If invalid: Error toast shown ❌

### Service Status (Same Flow)

- Same validation and UX as products
- Both use the same `statusOptions` array
- Consistent behavior across the application

---

## Error Handling

### Frontend Validation

**Before Submission:**
- ✅ Dropdown only shows valid options
- ✅ User cannot type invalid values
- ✅ Default values are always valid

### Backend Validation

**On Submission:**
```javascript
// If invalid status is somehow sent (e.g., via API directly)
try {
  await Product.create({ status: "pending", ... });
} catch (error) {
  // error.message: "Status must be either 'active' or 'inactive'. 'pending' is not a valid status."
  res.status(400).json({ message: error.message });
}
```

**Display in UI:**
```javascript
toast.error('Failed to create product: Status must be either \'active\' or \'inactive\'. \'pending\' is not a valid status.', {
    position: 'top-right',
    autoClose: 5000
});
```

---

## Testing Checklist

### Product Status Validation

**Create Product:**
- [ ] Create product with status "active" (should succeed)
- [ ] Create product with status "inactive" (should succeed)
- [ ] Try creating product with status "pending" via form (should not be in dropdown)
- [ ] Try creating product with status "pending" via API/Postman (should return 400 error)
- [ ] Create product without status (should default to "active")

**Edit Product:**
- [ ] Edit product and change status to "inactive" (should succeed)
- [ ] Edit product and change status to "active" (should succeed)
- [ ] Try editing product with invalid status via API (should return 400 error)
- [ ] Edit product without changing status (should keep current status)

**Display Product:**
- [ ] Product with "active" status shows correctly
- [ ] Product with "inactive" status shows correctly
- [ ] Legacy products without status field (backward compatibility)

### Service Status Validation

**Create Service:**
- [ ] Create service with status "active" (should succeed)
- [ ] Create service with status "inactive" (should succeed)
- [ ] Try creating service with status "pending" via form (should not be in dropdown)
- [ ] Try creating service with status "sold" via API (should return 400 error)
- [ ] Create service without status (should default to "active")

**Edit Service:**
- [ ] Edit service and change status to "inactive" (should succeed)
- [ ] Edit service and change status to "active" (should succeed)
- [ ] Edit service status shows capitalized ("Active", "Inactive")

**Display Service:**
- [ ] Service with "active" status shows correctly
- [ ] Service with "inactive" status shows correctly

### Error Messages

- [ ] Invalid status shows clear error message
- [ ] Error message includes the rejected value
- [ ] Error toast displays for 5 seconds
- [ ] Error toast is red/error colored
- [ ] User can read and understand the error

---

## API Testing Examples

### Using cURL

**Create Product with Valid Status:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "price": 100,
    "category": "Electronics",
    "status": "active"
  }'
```
✅ **Expected**: 201 Created

**Create Product with Invalid Status:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "price": 100,
    "category": "Electronics",
    "status": "pending"
  }'
```
❌ **Expected**: 400 Bad Request
```json
{
  "message": "Status must be either 'active' or 'inactive'. 'pending' is not a valid status."
}
```

**Update Service with Invalid Status:**
```bash
curl -X PUT http://localhost:5000/api/services/SERVICE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "sold"
  }'
```
❌ **Expected**: 400 Bad Request
```json
{
  "message": "Status must be either 'active' or 'inactive'. 'sold' is not a valid status."
}
```

---

## Database Schema Comparison

### Before vs After

**Product Schema - Before:**
```javascript
{
  p_id: String,
  name: String,
  seller_id: String,
  price: Number,
  category: String,
  // NO STATUS FIELD
  listed_at: Date,
  p_description: String
}
```

**Product Schema - After:**
```javascript
{
  p_id: String,
  name: String,
  seller_id: String,
  price: Number,
  category: String,
  status: String (enum: ["active", "inactive"], default: "active"),  // NEW
  listed_at: Date,
  p_description: String
}
```

**Service Schema - Before:**
```javascript
{
  s_id: String,
  seller_id: String,
  s_category: String,
  status: String (enum: ["active", "inactive"], default: "inactive"),  // Simple enum
  s_description: String,
  listed_at: Date
}
```

**Service Schema - After:**
```javascript
{
  s_id: String,
  seller_id: String,
  s_category: String,
  status: String (enum: {values: ["active", "inactive"], message: "..."}, default: "active"),  // Enhanced with custom error
  s_description: String,
  listed_at: Date
}
```

---

## Benefits

### 1. Data Integrity
- ✅ Database only contains valid status values
- ✅ No orphaned or invalid statuses
- ✅ Consistent status values across all records

### 2. Clear Error Messages
- ✅ Users know exactly what went wrong
- ✅ Error includes the rejected value
- ✅ Clear instructions on valid values

### 3. Frontend-Backend Consistency
- ✅ Frontend dropdown matches backend enum
- ✅ No possibility of mismatch
- ✅ Automatic validation at both layers

### 4. Backward Compatibility
- ✅ Existing products without status get default "active"
- ✅ Edit forms handle missing status fields
- ✅ No breaking changes for existing data

### 5. Developer Experience
- ✅ Clear validation rules in schema
- ✅ Self-documenting code
- ✅ Easy to add new valid statuses in future

---

## Future Enhancements

1. **More Status Options**: Add "sold", "reserved" if needed
2. **Status History**: Track when status changes occurred
3. **Conditional Logic**: Different behavior based on status
4. **Bulk Status Update**: Change status for multiple items
5. **Status Filters**: Filter marketplace by active/inactive
6. **Automated Status**: Auto-inactive after X days

---

## Related Files

**Backend:**
- `backend/model/product.model.js` - Product schema with status enum
- `backend/model/service.model.js` - Service schema with status enum
- `backend/controllers/product.controller.js` - Product CRUD with validation
- `backend/controllers/service.controller.js` - Service CRUD with validation

**Frontend:**
- `frontend/src/pages/UserDashboard.page.jsx` - All create/edit forms with status dropdowns

---

## Summary

✅ **Products**: Now have status field with enum validation ("active" or "inactive")  
✅ **Services**: Updated enum with custom error messages  
✅ **Frontend**: Removed "pending", added status to product forms, consistent UI  
✅ **Validation**: Both frontend and backend enforce valid status values  
✅ **Errors**: Clear, helpful error messages when invalid status is used  
✅ **Defaults**: Both products and services default to "active"  
❌ **Invalid**: "pending", "sold", "draft", or any other value will be rejected  

The system now enforces strict status validation at both the database and UI levels! 🎉
