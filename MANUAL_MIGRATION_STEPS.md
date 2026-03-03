# Manual Migration Steps

## ⚠️ Important: Complete MongoDB Atlas Setup First

Before migrating, you need to:

### 1. Click "Create Database User" button in MongoDB Atlas
   - This creates the user with credentials
   - Wait for confirmation message

### 2. Wait for Cluster to be Ready
   - Go to Database → Clusters
   - Wait until status shows "Active" (not "Creating")
   - This can take 1-3 minutes

---

## 🚀 Then Run Migration

### Option 1: Using MongoDB Compass (Easiest)

1. **Download MongoDB Compass** (if not installed)
   - https://www.mongodb.com/try/download/compass
   - Install and open it

2. **Connect to Localhost**
   - Click "New Connection"
   - URI: `mongodb://localhost:27017`
   - Click "Connect"

3. **Export Each Collection**
   - Select `fitzone` database
   - For each collection (users, products, orders, etc.):
     - Click on collection name
     - Click "Export Collection"
     - Choose "Export Full Collection"
     - Format: JSON
     - Save to a folder (e.g., `backup/`)

4. **Connect to MongoDB Atlas**
   - Click "New Connection"
   - URI: `mongodb+srv://akhileshagsmg_db_user:Akhilesh%402003@cluster0.rto06lr.mongodb.net/`
   - Click "Connect"

5. **Import Each Collection**
   - Select `fitzone` database (create if doesn't exist)
   - Click "Create Collection" for each one
   - Click on collection name
   - Click "Add Data" → "Import JSON or CSV file"
   - Select the exported JSON file
   - Click "Import"

---

### Option 2: Using Node.js Script (After Atlas is Ready)

1. **Ensure MongoDB Atlas cluster is Active**
   - Check in Atlas dashboard
   - Status should be green "Active"

2. **Run migration script**
   ```bash
   cd Backend
   node migrate-data.js
   ```

3. **If it works, you'll see:**
   ```
   ✅ Connected to localhost
   ✅ Connected to Atlas
   ✅ users: X documents migrated
   ✅ products: X documents migrated
   ✅ orders: X documents migrated
   ...
   ```

---

### Option 3: Manual Copy-Paste (Small Data)

If you have small amount of data:

1. **Open MongoDB Compass**
2. **Connect to localhost**
3. **For each collection:**
   - Click collection
   - Click "Documents" tab
   - Select all documents (Ctrl+A)
   - Copy (Ctrl+C)
4. **Connect to Atlas**
5. **For each collection:**
   - Create collection
   - Click "Insert Document"
   - Paste JSON
   - Click "Insert"

---

## ✅ After Migration

1. **Verify Data in Atlas**
   - Go to MongoDB Atlas Dashboard
   - Database → Browse Collections
   - Check all collections have data

2. **Update .env** (Already done ✅)
   ```env
   MONGODB_URI=mongodb+srv://akhileshagsmg_db_user:Akhilesh%402003@cluster0.rto06lr.mongodb.net/fitzone
   ```

3. **Restart Backend**
   ```bash
   cd Backend
   node server.js
   ```

4. **Test Application**
   - Login to admin panel
   - Check if products, orders, users are visible
   - Try creating a test order

---

## 🐛 Troubleshooting

### "querySrv ECONNREFUSED" Error
**Cause**: MongoDB Atlas cluster is not ready yet
**Solution**: 
- Wait 1-3 minutes for cluster to be created
- Check cluster status in Atlas dashboard
- Ensure "Create Database User" button was clicked

### "Authentication failed" Error
**Cause**: User not created or wrong password
**Solution**:
- Click "Create Database User" in Atlas
- Copy the exact password shown
- Update connection string

### "Network timeout" Error
**Cause**: Firewall or network issue
**Solution**:
- Check internet connection
- Verify IP is whitelisted (103.5.134.34 ✅)
- Try from different network

---

## 📞 Current Status

Based on your screenshot, you need to:
1. ✅ IP Address added (103.5.134.34)
2. ⏳ Click "Create Database User" button
3. ⏳ Wait for cluster to be ready
4. ⏳ Then run migration

**Next Step**: Click the "Create Database User" button in your MongoDB Atlas window!
