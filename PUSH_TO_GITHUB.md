# 📤 Push Code to GitHub

## Option 1: Install Git and Push (Recommended)

### Step 1: Install Git
1. Download: https://git-scm.com/download/win
2. Install with default settings
3. Restart your terminal

### Step 2: Push Code
Open terminal in `C:\Users\akhil\Desktop\E com` and run:

```bash
git init
git add .
git commit -m "FIT ZONE E-commerce Platform"
git branch -M main
git remote add origin https://github.com/akhileshag06/fitzone-ecommerce.git
git push -u origin main
```

---

## Option 2: Upload via GitHub Website (Easier)

### Step 1: Create ZIP file
1. Go to `C:\Users\akhil\Desktop\E com`
2. Select all files and folders
3. Right-click → Send to → Compressed (zipped) folder
4. Name it `fitzone.zip`

### Step 2: Upload to GitHub
1. Go to: https://github.com/akhileshag06/fitzone-ecommerce
2. Click "uploading an existing file"
3. Drag and drop your ZIP file
4. Click "Commit changes"

---

## Option 3: Use GitHub Desktop (Easiest)

### Step 1: Install GitHub Desktop
1. Download: https://desktop.github.com/
2. Install and sign in with your GitHub account

### Step 2: Add Repository
1. File → Add Local Repository
2. Choose: `C:\Users\akhil\Desktop\E com`
3. Click "Publish repository"
4. Repository name: `fitzone-ecommerce`
5. Uncheck "Keep this code private"
6. Click "Publish repository"

---

## ✅ After Code is Pushed

Once your code is on GitHub, go to:
**https://render.com/**

1. Sign up with GitHub
2. New + → Web Service
3. Connect: `fitzone-ecommerce`
4. Settings:
   - Name: `fitzone-backend`
   - Root Directory: `Backend`
   - Build: `npm install`
   - Start: `node server.js`
5. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://akhileshagsmg_db_user:Akhilesh%401234@front.xjj8ivm.mongodb.net/fitzone?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789
   JWT_EXPIRE=7d
   NODE_ENV=production
   PORT=5000
   ```
6. Create Web Service

**Your app will be live in 10 minutes!** 🚀

---

**Choose the easiest option for you and let me know when code is pushed!**
