const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@fitzone.com' });
    if (existing) {
      console.log('⚠️  Admin already exists!');
      console.log('📧 Email: admin@fitzone.com');
      console.log('🔑 Password: Admin@123');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'FIT ZONE Admin',
      email: 'admin@fitzone.com',
      password: 'Admin@123',
      phoneNumber: '9999999999',
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@fitzone.com');
    console.log('🔑 Password: Admin@123');
    console.log('🌐 URL:      http://localhost:5173/admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();