# 🧪 Testing Guide - Notification System & Fixes

## ✅ Prerequisites
- Backend server running on `http://localhost:8080`
- Frontend running on `http://localhost:5173` (or your Vite dev server)
- MongoDB connected
- At least one admin account created
- At least one dealer account created and approved

---

## 🔔 Test 1: Notification Bell Icon

### Admin Panel
1. Login to admin panel at `/admin`
2. ✅ Check: Notification bell icon (🔔) appears in header
3. ✅ Check: Bell has orange/yellow color (#ffb74d)
4. ✅ Check: If unread notifications exist, red badge shows count
5. Click the bell icon
6. ✅ Check: Dropdown opens with notification list
7. ✅ Check: Dropdown has "Mark all read" button if unread exist

### Dealer Panel
1. Login to dealer panel at `/dealer`
2. ✅ Check: Notification bell icon (🔔) appears in header
3. ✅ Check: Bell has blue color (#4dd0ff)
4. ✅ Check: If unread notifications exist, red badge shows count
5. Click the bell icon
6. ✅ Check: Dropdown opens with notification list

---

## 👋 Test 2: Welcome Popup (Admin Only)

1. Clear browser session storage: `sessionStorage.clear()` in console
2. Logout from admin panel
3. Login again to admin panel
4. ✅ Check: Welcome popup appears after 1 second
5. ✅ Check: Popup shows "Welcome back, [Admin Name]!"
6. ✅ Check: Popup shows unread notification count
7. ✅ Check: Popup shows pending approvals count
8. ✅ Check: If unread notifications exist, they are listed
9. ✅ Check: If no unread notifications, shows "All caught up!" message
10. Click "Let's Go!" button
11. ✅ Check: Popup closes
12. Refresh page
13. ✅ Check: Popup does NOT appear again (session storage prevents it)

---

## 🛒 Test 3: Order Placement Notifications

### Setup
1. Login as regular user in Dashboard
2. Add products to cart (mix of admin and dealer products if possible)

### Test Flow
1. Place an order (complete checkout)
2. ✅ Check: Order confirmation appears
3. Switch to Admin Panel (or refresh if already open)
4. ✅ Check: Notification bell badge increases by 1
5. Click notification bell
6. ✅ Check: New notification appears: "🛒 New Order Placed"
7. ✅ Check: Notification shows customer name and order total
8. ✅ Check: Notification has orange/yellow highlight (unread)
9. Click the notification
10. ✅ Check: Orange highlight disappears (marked as read)
11. ✅ Check: Badge count decreases by 1

### Dealer Notification (if order contains dealer products)
1. Switch to Dealer Panel
2. ✅ Check: Notification bell badge shows new notification
3. Click notification bell
4. ✅ Check: Notification appears: "🛒 New Order for Your Products"
5. ✅ Check: Notification shows customer name and order total
6. ✅ Check: Order appears in dealer's "Orders" tab

---

## 💬 Test 4: Chatbot Contact Notifications

### Contact Admin
1. Login as regular user in Dashboard
2. Open chatbot (click chat icon bottom-right)
3. Type: "contact admin" or "I need to contact admin"
4. ✅ Check: Chatbot shows "Contact Admin" button
5. Click "Contact Admin" button
6. ✅ Check: Success message appears
7. Switch to Admin Panel
8. Wait up to 30 seconds (or refresh page)
9. ✅ Check: Notification bell badge increases
10. Click notification bell
11. ✅ Check: New notification appears with user's contact request
12. ✅ Check: Notification shows user name and message

### Contact Dealer
1. In Dashboard chatbot, type: "contact dealer"
2. ✅ Check: Chatbot shows "Contact Dealer" button
3. Click "Contact Dealer" button
4. ✅ Check: Success message appears
5. Switch to Dealer Panel
6. Wait up to 30 seconds (or refresh page)
7. ✅ Check: Notification bell badge increases
8. Click notification bell
9. ✅ Check: New notification appears with user's contact request

---

## 📷 Test 5: Image Upload Fix

### Admin Panel - Add Product
1. Login to admin panel
2. Go to "Products" tab
3. Click "➕ Add Product" button
4. Scroll to "Product Image" section
5. ✅ Check: Current image preview shows (if any)
6. Click "📷 Select Image" button
7. ✅ Check: Modal opens with 3 tabs: Image URL, Upload New, Gallery

### Test URL Method
1. Click "🔗 Image URL" tab
2. Enter image URL: `http://localhost:8080/images/whey-protein.png`
3. Click "✅ Use This URL" button
4. ✅ Check: Modal closes
5. ✅ Check: Image preview updates

### Test Upload Method
1. Click "📷 Select Image" again
2. Click "📤 Upload New" tab
3. ✅ Check: Upload area appears with "Choose File" button
4. Click "📁 Choose File" button
5. ✅ Check: File picker opens (native OS dialog)
6. Select an image file (PNG, JPG, GIF, or WEBP)
7. ✅ Check: Upload progress shows "⏳ Uploading..."
8. ✅ Check: Success alert appears: "✅ Image uploaded successfully!"
9. ✅ Check: Modal closes after 500ms
10. ✅ Check: Image preview updates with uploaded image
11. ✅ Check: Image URL starts with `http://localhost:8080/images/`

### Test Gallery Method
1. Click "📷 Select Image" again
2. Click "🖼️ Gallery" tab
3. ✅ Check: Previously uploaded images appear in grid
4. ✅ Check: Existing product images appear (whey-protein.png, etc.)
5. Click on an image
6. ✅ Check: Image gets blue border (selected)
7. ✅ Check: Checkmark appears on selected image
8. ✅ Check: Modal closes
9. ✅ Check: Image preview updates

### Test Validation
1. Click "📷 Select Image" → "📤 Upload New"
2. Try uploading a non-image file (e.g., .txt, .pdf)
3. ✅ Check: Error alert: "Please select an image file"
4. Try uploading a large file (>5MB)
5. ✅ Check: Error alert: "Image size should be less than 5MB"

### Dealer Panel - Same Tests
Repeat all image upload tests in Dealer Panel when adding products.

---

## 🔄 Test 6: Real-time Notification Updates

1. Open Admin Panel in one browser tab
2. Open Dashboard (user) in another tab
3. In Dashboard, place an order
4. Switch to Admin Panel tab
5. ✅ Check: Within 30 seconds, notification badge updates automatically
6. ✅ Check: No page refresh needed

---

## 📋 Test 7: Notification Management

### Mark as Read
1. Click notification bell (with unread notifications)
2. Click on an unread notification (orange background)
3. ✅ Check: Orange background disappears
4. ✅ Check: Badge count decreases
5. ✅ Check: Blue/orange dot disappears from notification

### Mark All as Read
1. Have multiple unread notifications
2. Click notification bell
3. Click "Mark all read" button
4. ✅ Check: All orange backgrounds disappear
5. ✅ Check: Badge count becomes 0
6. ✅ Check: Success message appears

### Delete Notification
1. Click notification bell
2. Hover over a notification
3. Click the "✕" button on the right
4. ✅ Check: Notification disappears from list
5. ✅ Check: Success message appears
6. ✅ Check: Badge count updates if it was unread

---

## 🐛 Test 8: Edge Cases

### No Notifications
1. Delete all notifications
2. ✅ Check: Bell icon shows no badge
3. Click bell icon
4. ✅ Check: Dropdown shows "📭 No notifications" message

### Many Notifications
1. Create 10+ notifications (place multiple orders)
2. ✅ Check: Badge shows "9+" for counts over 9
3. Click bell icon
4. ✅ Check: Dropdown is scrollable
5. ✅ Check: All notifications are accessible

### Long Notification Messages
1. Create notification with very long message
2. ✅ Check: Message wraps properly in dropdown
3. ✅ Check: No text overflow or layout breaking

### Notification Timestamps
1. Check notification timestamps
2. ✅ Check: Shows date and time in local format
3. ✅ Check: Recent notifications show correctly

---

## ✅ Success Criteria

All tests should pass with ✅ checkmarks. If any test fails:

1. Check browser console for errors
2. Check backend terminal for errors
3. Verify MongoDB is connected
4. Verify all routes are registered in server.js
5. Clear browser cache and try again
6. Check network tab for failed API calls

---

## 🚀 Quick Test Commands

### Backend
```bash
cd Backend
node server.js
```

### Frontend
```bash
cd E-com
npm run dev
```

### Check Backend Health
```bash
curl http://localhost:8080/api/test
```

### Check Notifications Endpoint
```bash
# Replace TOKEN with actual admin/dealer token
curl -H "Authorization: Bearer TOKEN" http://localhost:8080/api/notifications
```

---

## 📝 Test Results Template

Copy and fill this out:

```
NOTIFICATION SYSTEM TEST RESULTS
Date: ___________
Tester: ___________

✅ Test 1: Notification Bell Icon - PASS / FAIL
✅ Test 2: Welcome Popup - PASS / FAIL
✅ Test 3: Order Notifications - PASS / FAIL
✅ Test 4: Chatbot Notifications - PASS / FAIL
✅ Test 5: Image Upload - PASS / FAIL
✅ Test 6: Real-time Updates - PASS / FAIL
✅ Test 7: Notification Management - PASS / FAIL
✅ Test 8: Edge Cases - PASS / FAIL

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## 🎉 All Tests Passed?

Congratulations! The notification system is working perfectly. Your FIT ZONE application now has:

- ✅ Professional notification system
- ✅ Real-time order tracking
- ✅ Chatbot integration
- ✅ Image upload functionality
- ✅ Admin and dealer panels fully functional

Ready for production! 🚀
