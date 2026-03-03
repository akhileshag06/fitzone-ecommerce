# 🔐 DEALER REGISTRATION & APPROVAL SYSTEM

## ✅ WHAT'S IMPLEMENTED:

### 1. **Dealer Self-Registration** 📝
Dealers can now register themselves with a special registration key.

### 2. **Registration Key Protection** 🔑
Only users with the correct key can register as dealers.

### 3. **Admin Approval System** ✅
Admin must approve dealers before they can access the dashboard.

### 4. **Approval Workflow** 🔄
Complete workflow from registration to approval to access.

---

## 🔑 REGISTRATION KEY:

**Key**: `akhi@8310`

This key is required for dealer registration. Share this key only with authorized dealers.

---

## 🚀 HOW IT WORKS:

### For Dealers:

#### Step 1: Register
```
1. Visit: http://localhost:5173/dealer/register
2. Fill the registration form:
   - Registration Key: akhi@8310
   - Full Name
   - Email
   - Password
   - Phone Number
   - Company Name
   - Territory/Region
3. Click "Register as Dealer"
4. Success message appears
5. Wait for admin approval
```

#### Step 2: Wait for Approval
- Dealer account is created but not active
- Cannot login until admin approves
- If trying to login: "Your dealer account is pending admin approval"

#### Step 3: Login After Approval
```
1. Visit: http://localhost:5173/dealer
2. Login with your credentials
3. Access full dealer dashboard
```

---

### For Admin:

#### Step 1: View Pending Dealers
```
API: GET /api/admin/dealers/pending
Headers: Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "dealers": [
    {
      "_id": "...",
      "name": "John Dealer",
      "email": "john@example.com",
      "dealerInfo": {
        "dealerId": "DLR0002",
        "companyName": "ABC Distributors",
        "territory": "South India",
        "isApproved": false
      }
    }
  ]
}
```

#### Step 2: Approve Dealer
```
API: PUT /api/admin/dealers/:id/approve
Headers: Authorization: Bearer <admin_token>
Body: {
  "commission": 5  // Optional, defaults to 5%
}

Response:
{
  "success": true,
  "message": "Dealer approved successfully",
  "dealer": { ... }
}
```

#### Step 3: Reject Dealer (Optional)
```
API: DELETE /api/admin/dealers/:id/reject
Headers: Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Dealer registration rejected and deleted"
}
```

---

## 🔐 SECURITY FEATURES:

### 1. Registration Key Validation
- Key must match exactly: `akhi@8310`
- Invalid key = Registration blocked
- Error message: "Invalid registration key"

### 2. Approval Required
- New dealers cannot login until approved
- Approval status checked on every login
- Unapproved dealers see: "Pending admin approval"

### 3. Admin Control
- Only admin can approve/reject dealers
- Admin can set commission rate during approval
- Admin can delete rejected applications

---

## 📊 DATABASE SCHEMA:

### User Model (Dealer Fields):
```javascript
{
  role: 'dealer',
  dealerInfo: {
    dealerId: 'DLR0001',
    companyName: 'ABC Distributors',
    territory: 'North India',
    commission: 5,
    isApproved: false,           // NEW: Approval status
    approvedBy: ObjectId,         // NEW: Admin who approved
    approvedAt: Date,             // NEW: Approval timestamp
    registrationDate: Date,       // NEW: Registration date
    assignedCustomers: []
  }
}
```

---

## 🎯 API ENDPOINTS:

### Public Endpoints:
```
POST /api/dealer/register        - Dealer self-registration (requires key)
POST /api/dealer/login           - Dealer login (checks approval)
```

### Admin Endpoints:
```
GET    /api/admin/dealers/pending      - Get pending dealers
PUT    /api/admin/dealers/:id/approve  - Approve dealer
DELETE /api/admin/dealers/:id/reject   - Reject dealer
```

---

## 🧪 TESTING GUIDE:

### Test 1: Register New Dealer

**With Correct Key:**
```
1. Visit: http://localhost:5173/dealer/register
2. Enter key: akhi@8310
3. Fill all fields
4. Submit
5. ✅ Success message appears
```

**With Wrong Key:**
```
1. Visit: http://localhost:5173/dealer/register
2. Enter key: wrongkey
3. Fill all fields
4. Submit
5. ❌ Error: "Invalid registration key"
```

### Test 2: Try Login Before Approval
```
1. Register new dealer
2. Try to login immediately
3. ❌ Error: "Your dealer account is pending admin approval"
```

### Test 3: Admin Approves Dealer
```
Using Postman or similar:

PUT http://localhost:8080/api/admin/dealers/<dealer_id>/approve
Headers: Authorization: Bearer <admin_token>
Body: { "commission": 5 }

✅ Dealer approved
```

### Test 4: Login After Approval
```
1. Visit: http://localhost:5173/dealer
2. Login with dealer credentials
3. ✅ Access granted to dashboard
```

---

## 📝 WORKFLOW DIAGRAM:

```
┌─────────────────────────────────────────────────────────┐
│  DEALER REGISTRATION & APPROVAL WORKFLOW                │
└─────────────────────────────────────────────────────────┘

1. DEALER VISITS REGISTRATION PAGE
   ↓
2. ENTERS REGISTRATION KEY: akhi@8310
   ↓
3. FILLS REGISTRATION FORM
   ↓
4. SUBMITS FORM
   ↓
5. BACKEND VALIDATES KEY
   ├─ Invalid Key → ❌ Registration Blocked
   └─ Valid Key → ✅ Continue
   ↓
6. DEALER ACCOUNT CREATED
   Status: isApproved = false
   ↓
7. DEALER TRIES TO LOGIN
   ↓
8. BACKEND CHECKS APPROVAL STATUS
   ├─ Not Approved → ❌ "Pending approval" message
   └─ Approved → ✅ Login successful
   ↓
9. ADMIN REVIEWS PENDING DEALERS
   ↓
10. ADMIN APPROVES/REJECTS
    ├─ Approve → isApproved = true, commission set
    └─ Reject → Account deleted
    ↓
11. DEALER CAN NOW LOGIN
    ↓
12. FULL DASHBOARD ACCESS GRANTED
```

---

## 🎨 UI FEATURES:

### Registration Page:
- 🔑 Registration key field (highlighted)
- 📝 All dealer information fields
- ✅ Success screen after registration
- 🔗 Link to login page

### Login Page:
- 🔐 Standard login form
- 🔗 "New dealer? Register here" link
- ⚠️ Approval pending message if not approved

### Success Screen:
- ✅ Confirmation message
- 📧 "Wait for admin approval" notice
- 🔗 "Go to Login" button

---

## 🔧 ADMIN PANEL INTEGRATION:

### Pending Dealers Tab (To be added):
- List of all pending dealer registrations
- Dealer information display
- Approve/Reject buttons
- Commission input field
- Approval history

---

## 📋 FILES MODIFIED/CREATED:

### Backend:
1. ✅ `Backend/models/user.js` - Added approval fields
2. ✅ `Backend/controllers/dealerController.js` - Added registration & key validation
3. ✅ `Backend/controllers/adminController.js` - Added approval endpoints
4. ✅ `Backend/routes/dealerRoutes.js` - Added registration route
5. ✅ `Backend/routes/adminRoutes.js` - Added approval routes
6. ✅ `Backend/scripts/approveDealers.js` - Script to approve existing dealers

### Frontend:
1. ✅ `E-com/src/DealerRegister.jsx` - Registration page
2. ✅ `E-com/src/DealerPanel.jsx` - Added registration link
3. ✅ `E-com/src/App.jsx` - Added registration route

---

## 🎯 CURRENT STATUS:

### ✅ Completed:
- Dealer self-registration with key
- Registration key validation (akhi@8310)
- Approval status checking on login
- Admin approval/rejection APIs
- Registration UI
- Success/error messages
- Existing dealers approved

### ⏳ Pending:
- Admin panel UI for dealer approval
- Email notifications (optional)
- Dealer approval history (optional)

---

## 🔑 IMPORTANT NOTES:

1. **Registration Key**: `akhi@8310` - Keep this secure!
2. **Existing Dealers**: Already approved (ran approval script)
3. **New Dealers**: Must register with key and wait for approval
4. **Admin Control**: Full control over dealer approvals
5. **Security**: Key validation + approval = double protection

---

## 🎉 SUMMARY:

✅ **Dealer Registration**: Self-service with key protection  
✅ **Admin Approval**: Required before access  
✅ **Security**: Two-layer protection (key + approval)  
✅ **User Experience**: Clear messages and workflow  
✅ **Backend**: Complete API implementation  
✅ **Frontend**: Registration page ready  

**The system is fully functional and secure!** 🚀

---

## 🆘 TROUBLESHOOTING:

**Problem**: "Invalid registration key"  
**Solution**: Use exact key: `akhi@8310`

**Problem**: "Pending admin approval"  
**Solution**: Wait for admin to approve, or use approval API

**Problem**: Existing dealer can't login  
**Solution**: Run `node Backend/scripts/approveDealers.js`

**Problem**: Registration page not found  
**Solution**: Check route: `/dealer/register`

---

**Registration Key**: `akhi@8310`  
**Test it now at**: `http://localhost:5173/dealer/register`
