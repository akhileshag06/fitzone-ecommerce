# Fix MongoDB Atlas Connection Issue

## 🔍 Problem
DNS lookup for MongoDB Atlas cluster is failing. This prevents connection to the cloud database.

## 🛠️ Solutions (Try in Order)

### Solution 1: Change DNS Settings (Recommended)

1. **Open Network Settings**
   - Press `Win + R`
   - Type `ncpa.cpl` and press Enter

2. **Configure DNS**
   - Right-click your active network connection
   - Select "Properties"
   - Select "Internet Protocol Version 4 (TCP/IPv4)"
   - Click "Properties"
   - Select "Use the following DNS server addresses"
   - Preferred DNS: `8.8.8.8` (Google DNS)
   - Alternate DNS: `8.8.4.4`
   - Click "OK"

3. **Flush DNS Cache**
   ```cmd
   ipconfig /flushdns
   ```

4. **Test Connection Again**
   ```bash
   cd Backend
   node test-atlas-connection.js
   ```

---

### Solution 2: Use VPN or Different Network

If DNS change doesn't work:
- Try connecting via mobile hotspot
- Use a VPN service
- Try from a different network

---

### Solution 3: Get Connection String from Atlas

1. **In MongoDB Atlas Dashboard**
   - Click "Connect" button on Cluster0
   - Choose "Connect your application"
   - Copy the EXACT connection string shown
   - Replace `<password>` with `Akhilesh@2003`

2. **Update Backend/.env**
   - Replace MONGODB_URI with the new string
   - Ensure password special characters are URL encoded:
     - `@` becomes `%40`
     - So: `Akhilesh@2003` becomes `Akhilesh%402003`

---

### Solution 4: Use MongoDB Compass (Manual Migration)

If connection still fails from Node.js, use MongoDB Compass:

1. **Download MongoDB Compass**
   - https://www.mongodb.com/try/download/compass

2. **Connect to Localhost**
   - URI: `mongodb://localhost:27017`
   - Click "Connect"

3. **Export Data**
   - Select `fitzone` database
   - For each collection:
     - Click collection name
     - Click "Export Collection"
     - Save as JSON

4. **Connect to Atlas via Compass**
   - Click "New Connection"
   - Paste your Atlas connection string
   - Click "Connect"

5. **Import Data**
   - Create `fitzone` database
   - For each collection:
     - Create collection
     - Click "Add Data" → "Import JSON"
     - Select exported file

---

## ✅ Quick Test

After trying any solution, test with:

```bash
cd Backend
node test-atlas-connection.js
```

If you see:
```
✅ Successfully connected to MongoDB Atlas!
```

Then run migration:
```bash
node migrate-data.js
```

---

## 🚀 Alternative: Start Backend with Atlas

If migration is too complex, you can:

1. **Start backend with Atlas** (empty database)
   ```bash
   cd Backend
   node server.js
   ```

2. **Recreate data through the app**:
   - Create admin account
   - Add products via admin panel
   - Register users
   - Create test orders

This is actually cleaner for production!

---

## 📞 Current Issue

Your network/firewall is blocking DNS resolution for MongoDB Atlas.

**Most likely cause**: Corporate/ISP firewall or DNS settings

**Quickest fix**: 
1. Change DNS to 8.8.8.8
2. Or use mobile hotspot
3. Or use MongoDB Compass for manual migration

Let me know which solution works for you!
