const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  cancelOrder
} = require('../controllers/orderController');
const { generateInvoice } = require('../controllers/invoiceController');

// All order routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.put('/:id/cancel', cancelOrder);

// ✅ Invoice route added
router.get('/:id/invoice', generateInvoice);

module.exports = router;