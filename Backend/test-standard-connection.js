const mongoose = require('mongoose');

// Try standard connection format (not SRV)
const ATLAS_STANDARD = 'mongodb://cluster0-shard-00-00.rto06lr.mongodb.net:27017,cluster0-shard-00-01.rto06lr.mongodb.net:27017,cluster0-shard-00-02.rto06lr.mongodb.net:27017/fitzone?ssl=true&replicaSet=atlas-14wvqy-shard-0&authSource=admin&retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas with standard connection...\n');
    console.log('Connecting...\n');
    
    await mongoose.connect(ATLAS_STANDARD, {
      auth: {
        username: 'akhileshagsmg_db_user',
        password: 'Akhilesh@2003'
      },
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Cluster:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    
    await mongoose.connection.close();
    console.log('\n✅ Standard connection works!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    // Try SRV one more time
    console.log('\n🔄 Trying SRV connection...');
    try {
      await mongoose.connect('mongodb+srv://akhileshagsmg_db_user:Akhilesh%402003@cluster0.rto06lr.mongodb.net/?appName=Cluster0', {
        serverSelectionTimeoutMS: 10000
      });
      console.log('✅ SRV connection works!');
      await mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ SRV also failed:', err.message);
      console.log('\n📝 Your network is blocking MongoDB Atlas connections.');
      console.log('Solutions:');
      console.log('1. Use mobile hotspot');
      console.log('2. Use VPN');
      console.log('3. Deploy to cloud (will work there)');
      process.exit(1);
    }
  }
}

testConnection();
