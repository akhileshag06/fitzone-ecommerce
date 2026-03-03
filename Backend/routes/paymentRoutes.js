const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// All payment routes are protected
router.use(protect);

// Define routes
router.get('/get-key', paymentController.getRazorpayKey);
router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;