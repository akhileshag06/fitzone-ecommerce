const mongoose = require('mongoose');

// Connection strings
const LOCAL_URI = 'mongodb://localhost:27017/fitzone';
const ATLAS_URI = 'mongodb+srv://akhileshagsmg_db_user:Akhilesh@2003@cluster0.rto06lr.mongodb.net/fitzone?retryWrites=true&w=majority';

async function migrateData() {
  try {
    console.log('🚀 Starting migration...\n');
    
    // Connect to local MongoDB
    console.log('📡 Connecting to localhost MongoDB...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to localhost\n');
    
    // Connect to Atlas
    console.log('📡 Connecting to MongoDB Atlas...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to Atlas\n');
    
    // Get all collections from local
    const collections = await localConn.db.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections to migrate:\n`);
    
    // Migrate each collection
    for (const collInfo of collections) {
      const collName = collInfo.name;
      console.log(`   Migrating: ${collName}...`);
      
      // Get data from local
      const localColl = localConn.db.collection(collName);
      const docs = await localColl.find({}).toArray();
      
      if (docs.length > 0) {
        // Insert into Atlas
        const atlasColl = atlasConn.db.collection(collName);
        await atlasColl.deleteMany({}); // Clear existing
        await atlasColl.insertMany(docs);
        console.log(`   ✅ ${collName}: ${docs.length} documents migrated`);
      } else {
        console.log(`   ⚠️  ${collName}: No documents found`);
      }
    }

    console.log('\n========================================');
    console.log('✅ Migration completed successfully!');
    console.log('========================================\n');
    console.log('Next steps:');
    console.log('1. Backend/.env is already updated');
    console.log('2. Restart backend: cd Backend && node server.js');
    console.log('3. Test your application\n');
    
    await localConn.close();
    await atlasConn.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Ensure MongoDB is running on localhost:27017');
    console.error('- Check internet connection for Atlas');
    console.error('- Verify Atlas credentials are correct');
    process.exit(1);
  }
}

migrateData();
