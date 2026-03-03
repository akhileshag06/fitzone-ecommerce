# 🚀 Install New Features - Quick Guide

## ⚡ Quick Installation (2 Minutes)

### Step 1: Install Dependencies

```bash
cd Backend
npm install multer
```

✅ This installs the image upload library

### Step 2: Restart Backend

```bash
# Make sure you're in Backend folder
node server.js
```

✅ Should see: "Server running on port 8080"

### Step 3: Restart Frontend

```bash
# Open new terminal
cd E-com
npm run dev
```

✅ Should see: "Local: http://localhost:5173"

---

## ✅ Verify Installation

### Test 1: Image Upload (30 seconds)

1. Go to: `http://localhost:5173/admin`
2. Login: `admin@fitzone.com` / `admin123`
3. Click "📦 Products" → "➕ Add Product"
4. Click "📷 Select Image"
5. ✅ Should see 3 tabs: URL, Upload New, Gallery

**Try Upload:**
- Click "📤 Upload New"
- Choose any image from your computer
- ✅ Should upload and show preview

### Test 2: Pro Chatbot (30 seconds)

1. Go to: `http://localhost:5173/`
2. Login as user
3. Click 🤖 button (bottom-right)
4. ✅ Should see welcome message

**Try Commands:**
- Type: "I want a refund"
- ✅ Should show your orders
- Type: "Contact admin"
- ✅ Should create support ticket

---

## 🎯 What's New

### 1. Image Upload System
- **Location**: Admin & Dealer product forms
- **Features**: Upload, Gallery, URL
- **Storage**: `Backend/public/images/`

### 2. Pro AI Chatbot
- **Location**: User dashboard (bottom-right)
- **Features**: 10+ intelligent actions
- **Capabilities**: Refunds, Support, Tracking, etc.

---

## 📁 New Files

### Backend (3 files):
```
Backend/
  controllers/
    uploadController.js  ← Image upload logic
  middleware/
    upload.js           ← Multer config
  routes/
    uploadRoutes.js     ← Upload endpoints
```

### Frontend (2 files):
```
E-com/
  src/
    components/
      ImagePicker.jsx   ← Image picker UI
      ProChatbot.jsx    ← AI chatbot
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'multer'"
**Solution:**
```bash
cd Backend
npm install multer
node server.js
```

### Issue: "Upload not working"
**Solution:**
1. Check `Backend/public/images/` folder exists
2. Restart backend server
3. Check browser console for errors

### Issue: "Chatbot not showing"
**Solution:**
1. Clear browser cache
2. Restart frontend: `npm run dev`
3. Check if user is logged in

### Issue: "Images not loading"
**Solution:**
1. Check image URL format: `http://localhost:8080/images/filename.png`
2. Verify file exists in `Backend/public/images/`
3. Check backend console for errors

---

## 🎉 Success Checklist

- [ ] Multer installed
- [ ] Backend restarted
- [ ] Frontend restarted
- [ ] Image upload works
- [ ] Gallery shows images
- [ ] Chatbot opens
- [ ] Chatbot responds
- [ ] All features working

---

## 📞 Quick Test Commands

### Test Image Upload:
```bash
# Check if upload endpoint works
curl -X GET http://localhost:8080/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Chatbot:
1. Open browser console (F12)
2. Type in chatbot: "help"
3. Check for errors in console

---

## 🚀 You're All Set!

**New Features Active:**
✅ Smart Image Upload  
✅ Pro AI Chatbot  
✅ Gallery Management  
✅ Intelligent Actions  

**Ready to use! 🎉**

---

## 📖 Full Documentation

For detailed feature guide, see: `NEW_FEATURES_GUIDE.md`

For testing guide, see: `QUICK_TEST_GUIDE.md`
