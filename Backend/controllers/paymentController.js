const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    console.log('📝 Creating Razorpay order with amount (in paise):', amount);
    
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    
    console.log('✅ Razorpay order created:', order.id, 'Amount:', order.amount);
    
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('🔥 Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    console.log('📝 Verifying payment:', razorpay_payment_id);

    // Generate signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    if (expectedSignature === razorpay_signature) {
      // Payment verified - create order in database
      console.log('✅ Payment verified successfully');

      // Prepare items for order
      const preparedItems = orderData.items.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedFlavor: item.selectedFlavor,
      }));

      // Create order in your database
      const newOrder = await Order.create({
        user: req.user.id,
        orderId: razorpay_order_id,
        items: preparedItems,
        shippingAddress: orderData.shippingAddress,
        paymentInfo: {
          method: 'razorpay',
          status: 'paid',
          transactionId: razorpay_payment_id,
        },
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost || 0,
        total: orderData.total,
        status: 'Processing',
      });

      console.log('✅ Order created in database:', newOrder._id);

      // Update stock
      for (const item of orderData.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        );
      }

      // Clear cart
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { $set: { items: [] } }
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified and order created',
        order: newOrder,
      });
    } else {
      console.log('❌ Payment verification failed - invalid signature');
      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error('🔥 Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payments/get-key
// @access  Private
exports.getRazorpayKey = (req, res) => {
  console.log('📝 Sending Razorpay key to client');
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
};
// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    console.log('📝 Creating Razorpay order with amount (in paise):', amount);
    console.log('💰 This equals rupees:', amount / 100);
    
    const options = {
      amount: amount, // Should already be in paise from frontend
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    
    console.log('✅ Razorpay order created:', order.id);
    console.log('💰 Order amount in paise:', order.amount);
    console.log('💰 Order amount in rupees:', order.amount / 100);
    
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('🔥 Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};