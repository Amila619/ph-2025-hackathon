# Database Seeding Instructions

This guide explains how to populate your database with sample data.

## What Gets Added

The seed script will add:

### Users (4 users)
- **Admin User**: `admin@university.lk` (role: admin)
- **User 1**: `farmer1@university.lk` (role: user)
- **User 2**: `seller1@university.lk` (role: user)
- **User 3**: `business1@university.lk` (role: user)

### Products (8 products)
- Organic Rice - White (5kg)
- Fresh Vegetables Bundle
- Industrial LED Lighting (Bulk)
- Office Furniture Set
- Steel Sheets (Grade 304)
- Organic Cotton Fabric
- Coconut Oil - Pure (1L)
- Plastic Containers (Bulk)

### Services (8 services)
- Web Development
- Graphic Design
- Digital Marketing
- Translation
- Legal Services
- Writing & Content
- Agricultural Consulting
- Machinery Repair

## How to Run the Seed Script

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Make Sure MongoDB is Running
Ensure your MongoDB instance is running and the connection string in `.env` is correct.

### Step 3: Run the Seed Script
```bash
npm run seed
```

### Step 4: Verify Data Was Added
You should see output like:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Added 4 users
✅ Added 8 products
✅ Added 8 services

📊 Database seeded successfully!

👤 Sample Users:
Admin: admin@university.lk
User 1: farmer1@university.lk
User 2: seller1@university.lk
User 3: business1@university.lk

(Note: All users need to go through OTP verification to login)
```

## Important Notes

1. **⚠️ Warning**: Running the seed script will **DELETE ALL EXISTING DATA** in the following collections:
   - Users
   - Products
   - Services

2. **Login**: To login with any of the sample users, you'll need to:
   - Go to the login page
   - Enter the email (e.g., `admin@university.lk`)
   - Check the email for OTP (make sure email service is configured)
   - Enter the OTP to complete login

3. **Environment Variables**: Make sure your `.env` file has:
   - `MONGODB_URI` - MongoDB connection string
   - Email service configuration for OTP delivery

## Viewing the Data on Frontend

After seeding:
1. Visit the homepage
2. The **"Explore Our Marketplace"** section will show category counts based on real data
3. The **"Featured Listings"** section will display actual products and services from the database
4. If no data is available, fallback sample data will be shown

## Re-seeding

You can run the seed script multiple times. Each run will:
1. Clear all existing users, products, and services
2. Add fresh sample data

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- Verify network connectivity

### No Data Showing on Frontend
- Check browser console for API errors
- Ensure backend server is running
- Verify CORS settings allow frontend requests
- Check `VITE_BACKEND_URL` in frontend `.env` file

### Email/OTP Not Working
- Verify email service configuration in backend `.env`
- Check email credentials are correct
- Ensure Redis is running for OTP storage
