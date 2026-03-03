require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const createDealer = async () => {
  try {
    await connectDB();

    // Check if dealer already exists
    const existingDealer = await User.findOne({ email: 'dealer@fitzone.com' });
    if (existingDealer) {
      console.log('⚠️  Dealer already exists!');
      console.log('Email:', existingDealer.email);
      console.log('Dealer ID:', existingDealer.dealerInfo?.dealerId);
      process.exit(0);
    }

    // Create dealer
    const dealer = await User.create({
      name: 'John Dealer',
      email: 'dealer@fitzone.com',
      password: 'dealer123',
      phoneNumber: '9876543210',
      role: 'dealer',
      dealerInfo: {
        dealerId: 'DLR0001',
        companyName: 'Fitness Pro Distributors',
        territory: 'North India',
        commission: 5,
        assignedCustomers: []
      }
    });

    console.log('✅ Dealer created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', dealer.email);
    console.log('🔑 Password: dealer123');
    console.log('🆔 Dealer ID:', dealer.dealerInfo.dealerId);
    console.log('🏢 Company:', dealer.dealerInfo.companyName);
    console.log('📍 Territory:', dealer.dealerInfo.territory);
    console.log('💰 Commission:', dealer.dealerInfo.commission + '%');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Login at: http://localhost:5173/dealer');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating dealer:', error.message);
    process.exit(1);
  }
};

createDealer();
