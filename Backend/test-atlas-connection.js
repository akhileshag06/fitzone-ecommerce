const mongoose = require('mongoose');

// New cluster connection string
const ATLAS_URI = 'mongodb+srv://akhileshagsmg_db_user:Akhilesh%401234@front.xjj8ivm.mongodb.net/?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔍 Testing NEW MongoDB Atlas cluster...\n');
    console.log('Connecting...\n');
    
    await mongoose.connect(ATLAS_URI, {
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Cluster:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name || 'test');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\nCollections found: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach(c => console.log(`  - ${c.name}`));
    } else {
      console.log('  (No collections yet - database is empty)');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test successful!');
    console.log('\nYou can now run: node migrate-data.js');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\nError details:', error.code || error.name);
    process.exit(1);
  }
}

testConnection();
