const express = require('express');
const router = express.Router();
const { protect, dealerOnly } = require('../middleware/auth');
const {
  dealerRegister,
  dealerLogin,
  getDealerStats,
  getDealerProducts,
  createDealerProduct,
  updateDealerProduct,
  deleteDealerProduct,
  getDealerCustomers,
  getDealerOrders,
  updateDealerOrderStatus
} = require('../controllers/dealerController');

// Public routes
router.post('/register', dealerRegister);
router.post('/login', dealerLogin);

// Protected dealer routes
router.use(protect);
router.use(dealerOnly);

// Dashboard
router.get('/stats', getDealerStats);

// Products
router.get('/products', getDealerProducts);
router.post('/products', createDealerProduct);
router.put('/products/:id', updateDealerProduct);
router.delete('/products/:id', deleteDealerProduct);

// Customers
router.get('/customers', getDealerCustomers);

// Orders
router.get('/orders', getDealerOrders);
router.put('/orders/:id/status', updateDealerOrderStatus);

module.exports = router;
