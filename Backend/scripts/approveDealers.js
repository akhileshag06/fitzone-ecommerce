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

const approveDealers = async () => {
  try {
    await connectDB();

    // Find admin to set as approver
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('⚠️  No admin found');
      process.exit(1);
    }

    // Approve all existing dealers
    const result = await User.updateMany(
      { 
        role: 'dealer',
        $or: [
          { 'dealerInfo.isApproved': { $exists: false } },
          { 'dealerInfo.isApproved': false }
        ]
      },
      {
        $set: {
          'dealerInfo.isApproved': true,
          'dealerInfo.approvedBy': admin._id,
          'dealerInfo.approvedAt': new Date(),
          'dealerInfo.commission': 5
        }
      }
    );

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Dealers approved successfully!');
    console.log('👥 Dealers approved:', result.modifiedCount);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error approving dealers:', error.message);
    process.exit(1);
  }
};

approveDealers();
