# OTP-Based Registration Process Fix

## Problem
The registration process was not working because of a mismatch between frontend and backend expectations:

### Frontend (Signup.page.jsx)
- Was sending: `{ name, email, password }`

### Backend (auth.controller.js & auth.service.js)
- Was expecting: `{ universityMail }` only
- Not handling name or additional registration data

## Solution - OTP-Based Authentication

The application uses **OTP (One-Time Password) based authentication** for both registration and login, eliminating the need for password management.

### Backend Changes

#### 1. **auth.controller.js** - Updated `register` function
- Now accepts `email` and `name` from request body (NO PASSWORD)
- Added validation for required fields
- Generates OTP using `Crypto.randomBytes(4).toString('hex')`
- Stores OTP in Redis with 5-minute expiration
- Sends OTP to user's email via `sendEmail` service
- Returns user object and success message

#### 2. **auth.service.js** - Updated `registerUser` function
- Now accepts two parameters: `email` and `name` (NO PASSWORD)
- Removed bcrypt import and password hashing
- Checks for existing users by both `universityMail` and `contact.email`
- Stores user with:
  - `universityMail`: normalized email
  - `contact.email`: normalized email
  - `name.fname`: first part of name
  - `name.lname`: rest of name
- No password_hash field (OTP-based auth only)
- Returns complete user object

### Frontend Changes

#### 3. **Signup.page.jsx** - Updated for OTP flow
- **Removed**: All password-related fields (password, confirm password)
- **Removed**: `LockOutlined` icon import
- Added informational message: "📧 We'll send a verification code to your email"
- Updated to send only `{ name, email }` to backend
- Stores user data in localStorage as 'pendingUser' after registration
- Redirects to `/verify-otp` page with success message
- Uses toast notifications for user feedback

#### 4. **VerifyOtp.page.jsx** - Enhanced for registration flow
- Now checks for user from both:
  - Navigation state (login flow)
  - localStorage 'pendingUser' (registration flow)
- Clears 'pendingUser' from localStorage after successful verification
- Handles OTP verification for both registration and login

## Registration & Login Flow

### Registration Flow:
```
1. User enters: Name, Email
   ↓
2. Frontend sends { name, email } to /api/auth/register
   ↓
3. Backend validates fields
   ↓
4. Check if user already exists
   ↓
5. Create new user (no password)
   ↓
6. Generate 8-character hex OTP
   ↓
7. Store OTP in Redis (5-minute expiry)
   ↓
8. Send OTP to user's email
   ↓
9. Return user object
   ↓
10. Frontend stores user in localStorage
    ↓
11. Redirect to /verify-otp page
    ↓
12. User enters OTP from email
    ↓
13. Backend verifies OTP from Redis
    ↓
14. Generate JWT access & refresh tokens
    ↓
15. Clear OTP from Redis
    ↓
16. Return tokens and user data
    ↓
17. Frontend saves token and redirects to dashboard
```

### Login Flow:
```
1. User enters: Email only
   ↓
2. Backend finds user by email
   ↓
3. Generate OTP and store in Redis
   ↓
4. Send OTP to user's email
   ↓
5. User enters OTP
   ↓
6. Backend verifies and issues JWT tokens
   ↓
7. User logged in and redirected to dashboard
```

## Database Schema
User is stored with:
```javascript
{
  universityMail: "user@example.com",
  contact: {
    email: "user@example.com"
  },
  name: {
    fname: "John",
    lname: "Doe"
  },
  role: "user", // default
  isPremium: false, // default
  isWelfareReciever: false, // default
  // NO password_hash field - OTP auth only
}
```

## Dependencies
- **crypto**: Node.js built-in (for OTP generation)
- **redis**: For temporary OTP storage (v5.8.3)
- **nodemailer**: For sending OTP emails (v7.0.9)
- **react-toastify**: For frontend notifications (v11.0.5)

## Security Features
- ✅ No passwords to manage or compromise
- ✅ OTP expires after 5 minutes
- ✅ OTP stored in Redis (memory, auto-expires)
- ✅ OTP deleted immediately after successful verification
- ✅ Email normalized and deduplicated
- ✅ JWT tokens for session management
- ✅ Refresh token in HTTP-only cookie

## Testing
1. Fill out registration form with name and email (no password!)
2. Click "Sign Up"
3. Should see success toast: "Registration successful! Please check your email for OTP"
4. Check email for 8-character OTP code
5. Enter OTP on verification page
6. Should be logged in and redirected to dashboard
