const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

// ============ CREATE ORDER ============
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shippingCost = 0, total, paymentInfo } = req.body;

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      paymentInfo: paymentInfo || { method: 'razorpay', status: 'paid' },
      status: 'Processing'
    });

    await order.save();

    // Clear the cart after order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    // ✅ CREATE NOTIFICATION FOR ADMIN
    await Notification.create({
      type: 'new_order',
      title: '🛒 New Order Placed',
      message: `${req.user.name} placed a new order worth ₹${total.toLocaleString('en-IN')}`,
      recipient: 'admin',
      sender: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      relatedOrder: order._id,
      priority: 'high'
    });

    // ✅ CREATE NOTIFICATIONS FOR DEALERS (if order contains dealer products)
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).populate('addedBy');
    
    const dealerIds = new Set();
    products.forEach(product => {
      if (product.addedByRole === 'dealer' && product.addedBy) {
        dealerIds.add(product.addedBy._id.toString());
      }
    });

    // Create notification for each dealer
    for (const dealerId of dealerIds) {
      await Notification.create({
        type: 'new_order',
        title: '🛒 New Order for Your Products',
        message: `${req.user.name} ordered your products worth ₹${total.toLocaleString('en-IN')}`,
        recipient: 'dealer',
        recipientId: dealerId,
        sender: req.user._id,
        senderName: req.user.name,
        senderEmail: req.user.email,
        relatedOrder: order._id,
        priority: 'high'
      });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET USER ORDERS ============
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name image category price',
        // ✅ Don't fail if product is deleted — just return null
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });

    // Clean up items where product was deleted
    const cleanedOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.map(item => ({
        ...item,
        product: item.product || { 
          name: item.name || 'Product Unavailable', 
          image: 'https://via.placeholder.com/60x60?text=N/A',
          category: 'unknown'
        }
      }));
      return orderObj;
    });

    res.json({ success: true, orders: cleanedOrders });
  } catch (error) {
    console.error('getUserOrders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ CANCEL ORDER ============
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: `Order already ${order.status}` });
    }

    order.status = 'Cancelled';
    await order.save();

    // Restore stock for each item
    for (const item of order.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    res.json({ success: true, order, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('cancelOrder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, cancelOrder };