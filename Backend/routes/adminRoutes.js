const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const admin = require('../controllers/adminController');

// Public routes (no authentication required)
router.post('/login', admin.adminLogin);
router.route('/create-admin').get(admin.createAdminAccount).post(admin.createAdminAccount);

// All routes below require login + admin role
router.use(protect, adminOnly);

// Stats
router.get('/stats', admin.getStats);

// Product Approvals (for dealer products) - MUST BE BEFORE general product routes
router.get('/products/pending', admin.getPendingProducts);
router.put('/products/:id/approve', admin.approveProduct);
router.delete('/products/:id/reject', admin.rejectProduct);

// Products
router.get('/products', admin.getAllProducts);
router.post('/products', admin.createProductAsAdmin);
router.put('/products/:id', admin.updateProduct);
router.delete('/products/:id', admin.deleteProduct);

// Orders
router.get('/orders', admin.getAllOrders);
router.put('/orders/:id/status', admin.updateOrderStatus);

// Users
router.get('/users', admin.getAllUsers);
router.delete('/users/:id', admin.deleteUser);

// Dealers
router.get('/dealers', admin.getAllDealers);
router.post('/dealers', admin.createDealer);
router.put('/dealers/:id', admin.updateDealer);
router.delete('/dealers/:id', admin.deleteDealer);
router.post('/dealers/assign-customer', admin.assignCustomerToDealer);
router.post('/dealers/remove-customer', admin.removeCustomerFromDealer);

// Dealer Approvals
router.get('/dealers/pending', admin.getPendingDealers);
router.put('/dealers/:id/approve', admin.approveDealer);
router.delete('/dealers/:id/reject', admin.rejectDealer);

// Seed Products (one-time use)
router.post('/seed-products', admin.seedProducts);

module.exports = router;