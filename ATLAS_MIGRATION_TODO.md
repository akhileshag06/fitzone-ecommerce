# MongoDB Atlas Migration - TODO

## ⚠️ Current Status
Your app is working with **localhost MongoDB** because of a DNS/network issue preventing connection to MongoDB Atlas.

## 🔧 To Fix and Migrate to Atlas

### Option 1: Fix DNS (Recommended - 2 minutes)

1. **Change DNS to Google DNS**
   - Open Network Settings (Win + R → `ncpa.cpl`)
   - Right-click your network → Properties
   - Select IPv4 → Properties
   - Use these DNS servers:
     - Preferred: `8.8.8.8`
     - Alternate: `8.8.4.4`
   - Click OK

2. **Flush DNS**
   ```cmd
   ipconfig /flushdns
   ```

3. **Test Connection**
   ```bash
   cd Backend
   node test-atlas-connection.js
   ```

4. **If successful, update .env**
   - Uncomment Atlas URI
   - Comment localhost URI
   - Restart server

---

### Option 2: Use Mobile Hotspot (1 minute)

1. Enable mobile hotspot on your phone
2. Connect your PC to it
3. Run migration:
   ```bash
   cd Backend
   node migrate-data.js
   ```

---

### Option 3: Use MongoDB Compass (5 minutes)

1. Download: https://www.mongodb.com/try/download/compass
2. Connect to localhost: `mongodb://localhost:27017`
3. Export each collection as JSON
4. Connect to Atlas (use connection string from Atlas dashboard)
5. Import each JSON file

---

## 🎯 Your Atlas Details

**Connection String:**
```
mongodb+srv://akhileshagsmg_db_user:Akhilesh%402003@cluster0.rto06lr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Username:** akhileshagsmg_db_user  
**Password:** Akhilesh@2003  
**Cluster:** cluster0.rto06lr.mongodb.net

---

## ✅ After Migration

1. Update `Backend/.env`:
   ```env
   # Comment this:
   # MONGODB_URI=mongodb://localhost:27017/fitzone
   
   # Uncomment this:
   MONGODB_URI=mongodb+srv://akhileshagsmg_db_user:Akhilesh%402003@cluster0.rto06lr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

2. Restart backend server

3. Your app will use cloud database!

---

## 📝 Why This Happened

Your network/ISP is blocking DNS resolution for MongoDB Atlas domains. This is common with:
- Corporate networks
- Some ISPs
- Firewall settings
- Antivirus software

**Solution:** Change DNS to 8.8.8.8 or use mobile hotspot.

---

## 🚀 For Now

Your app works perfectly with localhost MongoDB. All features are functional:
- ✅ Admin panel
- ✅ User registration/login
- ✅ Products, orders, cart
- ✅ Dealer panel
- ✅ Notifications
- ✅ Live chat

You can migrate to Atlas anytime by fixing the DNS issue!
