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

const manageDealers = async () => {
  try {
    await connectDB();

    const action = process.argv[2]; // 'list', 'approve', 'reject'
    const dealerEmail = process.argv[3];

    if (action === 'list') {
      // List all pending dealers
      const pendingDealers = await User.find({ 
        role: 'dealer',
        'dealerInfo.isApproved': false 
      });

      if (pendingDealers.length === 0) {
        console.log('📭 No pending dealer requests');
      } else {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 PENDING DEALER REQUESTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        pendingDealers.forEach((dealer, index) => {
          console.log(`\n${index + 1}. ${dealer.name}`);
          console.log(`   📧 Email: ${dealer.email}`);
          console.log(`   🆔 Dealer ID: ${dealer.dealerInfo.dealerId}`);
          console.log(`   🏢 Company: ${dealer.dealerInfo.companyName}`);
          console.log(`   📍 Territory: ${dealer.dealerInfo.territory}`);
          console.log(`   📞 Phone: ${dealer.phoneNumber}`);
          console.log(`   📅 Registered: ${new Date(dealer.dealerInfo.registrationDate).toLocaleDateString()}`);
        });
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\nTo approve: node scripts/manageDealers.js approve <email>');
        console.log('To reject: node scripts/manageDealers.js reject <email>');
      }
    } else if (action === 'approve' && dealerEmail) {
      // Approve dealer
      const admin = await User.findOne({ role: 'admin' });
      
      const dealer = await User.findOneAndUpdate(
        { email: dealerEmail, role: 'dealer' },
        {
          'dealerInfo.isApproved': true,
          'dealerInfo.approvedBy': admin._id,
          'dealerInfo.approvedAt': new Date(),
          'dealerInfo.commission': 5 // Default 5%
        },
        { new: true }
      );

      if (!dealer) {
        console.log('❌ Dealer not found with email:', dealerEmail);
      } else {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ DEALER APPROVED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👤 Name: ${dealer.name}`);
        console.log(`📧 Email: ${dealer.email}`);
        console.log(`🆔 Dealer ID: ${dealer.dealerInfo.dealerId}`);
        console.log(`💰 Commission: ${dealer.dealerInfo.commission}%`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Dealer can now login at: http://localhost:5173/dealer');
      }
    } else if (action === 'reject' && dealerEmail) {
      // Reject dealer
      const dealer = await User.findOneAndDelete({ 
        email: dealerEmail, 
        role: 'dealer' 
      });

      if (!dealer) {
        console.log('❌ Dealer not found with email:', dealerEmail);
      } else {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🗑️  DEALER REJECTED & DELETED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👤 Name: ${dealer.name}`);
        console.log(`📧 Email: ${dealer.email}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
    } else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 DEALER MANAGEMENT TOOL');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\nUsage:');
      console.log('  node scripts/manageDealers.js list');
      console.log('  node scripts/manageDealers.js approve <email>');
      console.log('  node scripts/manageDealers.js reject <email>');
      console.log('\nExamples:');
      console.log('  node scripts/manageDealers.js list');
      console.log('  node scripts/manageDealers.js approve dealer@example.com');
      console.log('  node scripts/manageDealers.js reject dealer@example.com');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

manageDealers();
