import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/user.model.js';
import Product from './model/product.model.js';
import Service from './model/service.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL;

// Sample Users
const users = [
  {
    universityMail: 'admin@university.lk',
    role: 'admin',
    name: {
      fname: 'Admin',
      lname: 'User'
    },
    contact: {
      email: 'admin@university.lk',
      phone: '+94771234567'
    }
  },
  {
    universityMail: 'farmer1@university.lk',
    role: 'user',
    name: {
      fname: 'Nimal',
      lname: 'Perera'
    },
    contact: {
      email: 'farmer1@university.lk',
      phone: '+94771234568'
    },
    address: {
      city: 'Colombo',
      country: 'Sri Lanka'
    }
  },
  {
    universityMail: 'seller1@university.lk',
    role: 'user',
    name: {
      fname: 'Kamal',
      lname: 'Silva'
    },
    contact: {
      email: 'seller1@university.lk',
      phone: '+94771234569'
    },
    address: {
      city: 'Kandy',
      country: 'Sri Lanka'
    }
  },
  {
    universityMail: 'business1@university.lk',
    role: 'user',
    name: {
      fname: 'Sunil',
      lname: 'Fernando'
    },
    contact: {
      email: 'business1@university.lk',
      phone: '+94771234570'
    },
    address: {
      city: 'Galle',
      country: 'Sri Lanka'
    }
  }
];

// Sample Products
const sampleProducts = [
  {
    p_id: 'PROD001',
    name: 'Organic Rice - White (5kg)',
    category: 'Food Products',
    price: 850,
    p_description: 'Premium quality organic white rice, grown without pesticides. Perfect for daily consumption.',
    listed_at: new Date('2025-01-10')
  },
  {
    p_id: 'PROD002',
    name: 'Fresh Vegetables Bundle',
    category: 'Food Products',
    price: 450,
    p_description: 'Daily fresh vegetables including tomatoes, carrots, beans, and cabbage.',
    listed_at: new Date('2025-01-12')
  },
  {
    p_id: 'PROD003',
    name: 'Industrial LED Lighting (Bulk)',
    category: 'Electronics',
    price: 250000,
    p_description: 'Energy-efficient LED lighting solution for warehouses and factories. 100 units per order.',
    listed_at: new Date('2025-01-08')
  },
  {
    p_id: 'PROD004',
    name: 'Office Furniture Set',
    category: 'Furniture',
    price: 500000,
    p_description: 'Complete office furniture set including desks, chairs, and cabinets. Modern design.',
    listed_at: new Date('2025-01-05')
  },
  {
    p_id: 'PROD005',
    name: 'Steel Sheets (Grade 304)',
    category: 'Metals & Alloys',
    price: 85000,
    p_description: 'High-quality stainless steel sheets. 1 ton per order. Ideal for construction.',
    listed_at: new Date('2025-01-15')
  },
  {
    p_id: 'PROD006',
    name: 'Organic Cotton Fabric',
    category: 'Textiles & Fabrics',
    price: 1200,
    p_description: 'Eco-friendly organic cotton fabric. Price per meter. Perfect for clothing manufacturers.',
    listed_at: new Date('2025-01-11')
  },
  {
    p_id: 'PROD007',
    name: 'Coconut Oil - Pure (1L)',
    category: 'Food Products',
    price: 550,
    p_description: 'Cold-pressed pure coconut oil. No additives or preservatives.',
    listed_at: new Date('2025-01-14')
  },
  {
    p_id: 'PROD008',
    name: 'Plastic Containers (Bulk)',
    category: 'Packaging',
    price: 15000,
    p_description: 'Food-grade plastic containers for storage. 500 pieces per order.',
    listed_at: new Date('2025-01-09')
  }
];

// Sample Services
const sampleServices = [
  {
    s_id: 'SRV001',
    s_category: 'Web Development',
    status: 'active',
    s_description: 'Full stack web development services. Building responsive and modern websites using React, Node.js, and MongoDB.',
    listed_at: new Date('2025-01-05')
  },
  {
    s_id: 'SRV002',
    s_category: 'Graphic Design',
    status: 'active',
    s_description: 'Professional logo design, branding, and marketing materials. Custom designs for your business.',
    listed_at: new Date('2025-01-07')
  },
  {
    s_id: 'SRV003',
    s_category: 'Digital Marketing',
    status: 'active',
    s_description: 'SEO optimization, social media marketing, and content strategy. Grow your online presence.',
    listed_at: new Date('2025-01-10')
  },
  {
    s_id: 'SRV004',
    s_category: 'Translation',
    status: 'active',
    s_description: 'Professional translation services for Sinhala, Tamil, and English. Documents, websites, and more.',
    listed_at: new Date('2025-01-12')
  },
  {
    s_id: 'SRV005',
    s_category: 'Legal Services',
    status: 'active',
    s_description: 'Business legal consultation, contract drafting, and compliance services.',
    listed_at: new Date('2025-01-08')
  },
  {
    s_id: 'SRV006',
    s_category: 'Writing & Content',
    status: 'active',
    s_description: 'Content writing, blog posts, and copywriting services. SEO-optimized content for your business.',
    listed_at: new Date('2025-01-11')
  },
  {
    s_id: 'SRV007',
    s_category: 'Agricultural Consulting',
    status: 'active',
    s_description: 'Expert advice on crop management, soil health, and sustainable farming practices.',
    listed_at: new Date('2025-01-09')
  },
  {
    s_id: 'SRV008',
    s_category: 'Machinery Repair',
    status: 'active',
    s_description: 'Industrial machinery maintenance and repair services. Quick response time.',
    listed_at: new Date('2025-01-13')
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Added ${createdUsers.length} users`);

    // Assign seller_id to products and services
    const userIds = createdUsers.map(u => u._id.toString());
    
    const productsWithSellers = sampleProducts.map((product, index) => ({
      ...product,
      seller_id: userIds[1 + (index % 3)] // Distribute among users 1, 2, 3
    }));

    const servicesWithSellers = sampleServices.map((service, index) => ({
      ...service,
      seller_id: userIds[1 + (index % 3)] // Distribute among users 1, 2, 3
    }));

    // Insert products
    const createdProducts = await Product.insertMany(productsWithSellers);
    console.log(`✅ Added ${createdProducts.length} products`);

    // Insert services
    const createdServices = await Service.insertMany(servicesWithSellers);
    console.log(`✅ Added ${createdServices.length} services`);

    console.log('\n📊 Database seeded successfully!');
    console.log('\n👤 Sample Users:');
    console.log('Admin: admin@university.lk');
    console.log('User 1: farmer1@university.lk');
    console.log('User 2: seller1@university.lk');
    console.log('User 3: business1@university.lk');
    console.log('\n(Note: All users need to go through OTP verification to login)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

seedDatabase();
