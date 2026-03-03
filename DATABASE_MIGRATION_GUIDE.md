# Database Migration Guide - Local to Production

## 🎯 Goal
Migrate all data from localhost MongoDB to production MongoDB (MongoDB Atlas)

---

## 📋 Prerequisites

1. **MongoDB Atlas Account** (or other cloud MongoDB provider)
   - Sign up at: https://www.mongodb.com/cloud/atlas
   - Create a free cluster (M0 Sandbox - Free forever)

2. **MongoDB Tools Installed**
   - `mongodump` - Export data
   - `mongorestore` - Import data
   - Download from: https://www.mongodb.com/try/download/database-tools

---

## 🚀 Step-by-Step Migration

### Step 1: Export Data from Localhost

Open terminal and run:

```bash
# Export all databases
mongodump --uri="mongodb://localhost:27017/fitzone" --out="./backup"

# This creates a folder called 'backup' with all your data
```

**What this does:**
- Exports all collections (users, products, orders, etc.)
- Creates BSON files (MongoDB's binary format)
- Saves to `./backup/fitzone/` folder

---

### Step 2: Setup MongoDB Atlas (Production Database)

1. **Create Account & Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up / Login
   - Click "Build a Database"
   - Choose "FREE" (M0 Sandbox)
   - Select region closest to you
   - Click "Create Cluster"

2. **Setup Database Access**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `fitzone_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

3. **Setup Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
   - ⚠️ For production, restrict to specific IPs

4. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

### Step 3: Import Data to MongoDB Atlas

Replace `<password>` with your actual password and run:

```bash
# Import to MongoDB Atlas
mongorestore --uri="mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/fitzone" ./backup/fitzone

# Example:
# mongorestore --uri="mongodb+srv://fitzone_admin:MySecurePass123@cluster0.abc123.mongodb.net/fitzone" ./backup/fitzone
```

**What this does:**
- Uploads all your data to MongoDB Atlas
- Creates the same collections
- Preserves all documents and relationships

---

### Step 4: Update Backend Configuration

Update your `Backend/.env` file:

```env
# OLD (localhost)
# MONGO_URI=mongodb://localhost:27017/fitzone

# NEW (MongoDB Atlas)
MONGO_URI=mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/fitzone?retryWrites=true&w=majority

# Other settings
PORT=8080
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

**Important:**
- Replace `<password>` with your actual database password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Keep JWT_SECRET secure and different from development

---

### Step 5: Test Connection

1. **Restart Backend Server**
   ```bash
   cd Backend
   node server.js
   ```

2. **Check Console Output**
   - Should see: "✅ MongoDB Connected: cluster0.xxxxx.mongodb.net"
   - If error, check connection string and password

3. **Test API**
   - Open browser: http://localhost:8080/api/test
   - Should return success message

4. **Test Frontend**
   - Login to admin panel
   - Check if products, orders, users are visible
   - Try creating a test order

---

## 🔒 Security Best Practices

### 1. Environment Variables
Never commit `.env` file to Git!

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

### 2. Separate Databases
Use different databases for development and production:

**Development (.env.development):**
```env
MONGO_URI=mongodb://localhost:27017/fitzone_dev
```

**Production (.env.production):**
```env
MONGO_URI=mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/fitzone_prod
```

### 3. Strong Passwords
- Use MongoDB Atlas password generator
- Minimum 16 characters
- Mix of letters, numbers, symbols

### 4. IP Whitelist
For production, restrict IP access:
- Go to Network Access in Atlas
- Remove "0.0.0.0/0"
- Add only your server's IP address

---

## 📊 Verify Migration

### Check Data in MongoDB Atlas

1. **Using Atlas UI**
   - Go to "Database" → "Browse Collections"
   - Click on your cluster
   - Verify all collections exist:
     - users
     - products
     - orders
     - carts
     - notifications
     - chatsessions
     - chatmessages

2. **Count Documents**
   ```bash
   # Connect to Atlas using mongosh
   mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/fitzone" --username fitzone_admin
   
   # Count documents in each collection
   db.users.countDocuments()
   db.products.countDocuments()
   db.orders.countDocuments()
   ```

3. **Compare Counts**
   - Localhost counts should match Atlas counts
   - If different, re-run mongorestore

---

## 🔄 Alternative: Manual Export/Import

If MongoDB tools don't work, use this method:

### Export from Localhost
```javascript
// Run in MongoDB Compass or mongosh
mongoexport --uri="mongodb://localhost:27017/fitzone" --collection=users --out=users.json
mongoexport --uri="mongodb://localhost:27017/fitzone" --collection=products --out=products.json
mongoexport --uri="mongodb://localhost:27017/fitzone" --collection=orders --out=orders.json
// Repeat for all collections
```

### Import to Atlas
```javascript
mongoimport --uri="mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/fitzone" --collection=users --file=users.json
mongoimport --uri="mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/fitzone" --collection=products --file=products.json
mongoimport --uri="mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/fitzone" --collection=orders --file=orders.json
// Repeat for all collections
```

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
- Check username and password
- Ensure user has correct permissions
- Password might contain special characters - URL encode them

### Error: "Connection timeout"
- Check Network Access in Atlas
- Ensure IP is whitelisted
- Check firewall settings

### Error: "Database not found"
- Database name in connection string must match
- Case sensitive: `fitzone` ≠ `FitZone`

### Data Missing After Import
- Check collection names match exactly
- Re-run mongorestore with `--drop` flag to overwrite:
  ```bash
  mongorestore --drop --uri="mongodb+srv://..." ./backup/fitzone
  ```

---

## 📝 Quick Commands Reference

```bash
# Export from localhost
mongodump --uri="mongodb://localhost:27017/fitzone" --out="./backup"

# Import to Atlas
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/fitzone" ./backup/fitzone

# Export single collection
mongoexport --uri="mongodb://localhost:27017/fitzone" --collection=products --out=products.json

# Import single collection
mongoimport --uri="mongodb+srv://user:pass@cluster.mongodb.net/fitzone" --collection=products --file=products.json

# Connect with mongosh
mongosh "mongodb+srv://cluster.mongodb.net/fitzone" --username user

# Count documents
db.collectionName.countDocuments()

# List all collections
show collections
```

---

## ✅ Post-Migration Checklist

- [ ] All collections migrated
- [ ] Document counts match
- [ ] Backend connects successfully
- [ ] Admin can login
- [ ] Products display correctly
- [ ] Orders are visible
- [ ] Users can register/login
- [ ] Dealers can access their panel
- [ ] Notifications working
- [ ] Live chat functional
- [ ] Images loading (if stored in DB)
- [ ] .env file updated
- [ ] .env added to .gitignore
- [ ] Connection string secured
- [ ] IP whitelist configured (production)

---

## 🚀 Ready for Production!

Once migration is complete and tested:
1. Update frontend API URL to production backend
2. Deploy backend to hosting service (Heroku, Railway, Render, etc.)
3. Deploy frontend to hosting service (Vercel, Netlify, etc.)
4. Update CORS settings in backend
5. Enable SSL/HTTPS
6. Monitor database usage in Atlas

---

## 📞 Need Help?

Common issues:
- MongoDB Atlas free tier: 512MB storage limit
- Connection string format must be exact
- Special characters in password need URL encoding
- Network access must allow your IP

For more help: https://www.mongodb.com/docs/atlas/
