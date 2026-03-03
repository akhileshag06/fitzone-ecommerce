require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
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

const updateProducts = async () => {
  try {
    await connectDB();

    // Find an admin user to set as addedBy
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('⚠️  No admin found. Creating default admin...');
      admin = await User.create({
        name: 'Admin',
        email: 'admin@fitzone.com',
        password: 'admin123',
        phoneNumber: '1234567890',
        role: 'admin'
      });
      console.log('✅ Admin created');
    }

    // Update all existing products
    const result = await Product.updateMany(
      { 
        $or: [
          { isApproved: { $exists: false } },
          { addedBy: { $exists: false } }
        ]
      },
      {
        $set: {
          isApproved: true,
          addedBy: admin._id,
          addedByRole: 'admin',
          approvedBy: admin._id
        }
      }
    );

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Products updated successfully!');
    console.log('📦 Products updated:', result.modifiedCount);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 All existing products are now approved and visible!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating products:', error.message);
    process.exit(1);
  }
};

updateProducts();
