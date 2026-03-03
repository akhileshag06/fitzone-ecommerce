const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ============ DEALER REGISTRATION (Public) ============
exports.dealerRegister = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, companyName, territory, registrationKey } = req.body;

    // Validate registration key
    const DEALER_REGISTRATION_KEY = 'akhi@8310';
    if (registrationKey !== DEALER_REGISTRATION_KEY) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid registration key. Please contact admin for the correct key.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Generate dealer ID
    const dealerCount = await User.countDocuments({ role: 'dealer' });
    const dealerId = `DLR${String(dealerCount + 1).padStart(4, '0')}`;

    // Create dealer (not approved by default)
    const dealer = await User.create({
      name,
      email,
      password,
      phoneNumber,
      role: 'dealer',
      dealerInfo: {
        dealerId,
        companyName,
        territory,
        commission: 0, // Admin will set this
        isApproved: false, // Needs admin approval
        assignedCustomers: [],
        registrationDate: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please wait for admin approval.',
      dealer: {
        _id: dealer._id,
        name: dealer.name,
        email: dealer.email,
        dealerInfo: dealer.dealerInfo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ DEALER LOGIN ============
exports.dealerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { generateToken } = require('../middleware/auth');

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role !== 'dealer') {
      return res.status(403).json({ success: false, message: 'Access denied - Not a dealer account' });
    }

    // Check if dealer is approved
    if (!user.dealerInfo?.isApproved) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your dealer account is pending admin approval. Please wait for approval.' 
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        dealerInfo: user.dealerInfo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ DEALER DASHBOARD STATS ============
exports.getDealerStats = async (req, res) => {
  try {
    const dealerId = req.user._id;
    
    // Get dealer's products
    const dealerProducts = await Product.countDocuments({ addedBy: dealerId });
    const approvedProducts = await Product.countDocuments({ addedBy: dealerId, isApproved: true });
    const pendingProducts = await Product.countDocuments({ addedBy: dealerId, isApproved: false });
    
    // Get dealer's assigned customers
    const dealer = await User.findById(dealerId);
    const assignedCustomers = dealer.dealerInfo?.assignedCustomers || [];
    
    // Get dealer's product IDs
    const dealerProductsList = await Product.find({ addedBy: dealerId }).select('_id');
    const dealerProductIds = dealerProductsList.map(p => p._id);
    
    // Get orders that contain dealer's products
    const ordersWithDealerProducts = await Order.find({
      'items.product': { $in: dealerProductIds }
    }).populate('user', 'name email').populate('items.product', 'addedBy');
    
    // Calculate revenue from dealer's products only
    let totalRevenue = 0;
    let totalOrders = 0;
    
    ordersWithDealerProducts.forEach(order => {
      const dealerItems = order.items.filter(item => 
        item.product && dealerProductIds.some(id => id.toString() === item.product._id.toString())
      );
      
      if (dealerItems.length > 0) {
        totalOrders++;
        const orderRevenue = dealerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalRevenue += orderRevenue;
      }
    });
    
    // Get recent orders with dealer products
    const recentOrders = ordersWithDealerProducts
      .slice(0, 5)
      .map(order => {
        const dealerItems = order.items.filter(item => 
          item.product && dealerProductIds.some(id => id.toString() === item.product._id.toString())
        );
        return {
          ...order.toObject(),
          items: dealerItems
        };
      });

    res.json({
      success: true,
      stats: {
        totalProducts: dealerProducts,
        approvedProducts,
        pendingProducts,
        totalCustomers: assignedCustomers.length,
        totalOrders,
        totalRevenue,
        commission: (totalRevenue * (dealer.dealerInfo?.commission || 0)) / 100
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ DEALER PRODUCTS ============
exports.getDealerProducts = async (req, res) => {
  try {
    const products = await Product.find({ addedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDealerProduct = async (req, res) => {
  try {
    const dealer = await User.findById(req.user._id);
    
    const productData = {
      ...req.body,
      addedBy: req.user._id,
      addedByRole: 'dealer',
      dealerInfo: {
        dealerId: dealer.dealerInfo?.dealerId,
        companyName: dealer.dealerInfo?.companyName
      },
      isApproved: false // Dealer products need admin approval
    };
    
    const product = await Product.create(productData);
    res.status(201).json({ 
      success: true, 
      product,
      message: 'Product submitted for admin approval'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDealerProduct = async (req, res) => {
  try {
    // Dealers can only update their own products
    const product = await Product.findOne({ 
      _id: req.params.id, 
      addedBy: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to edit it' 
      });
    }
    
    // If product was approved, set back to pending after edit
    const updateData = {
      ...req.body,
      isApproved: false
    };
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.json({ 
      success: true, 
      product: updatedProduct,
      message: 'Product updated and submitted for re-approval'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDealerProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      addedBy: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to delete it' 
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ DEALER CUSTOMERS ============
exports.getDealerCustomers = async (req, res) => {
  try {
    const dealer = await User.findById(req.user._id);
    const assignedCustomers = dealer.dealerInfo?.assignedCustomers || [];
    
    // Get dealer's product IDs
    const dealerProducts = await Product.find({ addedBy: req.user._id }).select('_id');
    const dealerProductIds = dealerProducts.map(p => p._id);
    
    // Find all orders with dealer's products
    const ordersWithDealerProducts = await Order.find({
      'items.product': { $in: dealerProductIds }
    }).populate('user', 'name email phoneNumber');
    
    // Get unique customer IDs who bought dealer products
    const customerIds = [...new Set(ordersWithDealerProducts.map(o => o.user._id.toString()))];
    
    // Combine assigned customers with customers who bought products
    const allCustomerIds = [...new Set([...assignedCustomers.map(id => id.toString()), ...customerIds])];
    
    const customers = await User.find({ 
      _id: { $in: allCustomerIds },
      role: 'user'
    }).select('-password');
    
    // Get order count and total spent for each customer (only for dealer's products)
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const customerOrders = await Order.find({ 
          user: customer._id,
          'items.product': { $in: dealerProductIds }
        }).populate('items.product', 'addedBy');
        
        let orderCount = 0;
        let totalSpent = 0;
        
        customerOrders.forEach(order => {
          const dealerItems = order.items.filter(item => 
            item.product && dealerProductIds.some(id => id.toString() === item.product._id.toString())
          );
          
          if (dealerItems.length > 0) {
            orderCount++;
            totalSpent += dealerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          }
        });
        
        return {
          ...customer.toObject(),
          orderCount,
          totalSpent
        };
      })
    );
    
    res.json({ success: true, customers: customersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ DEALER ORDERS ============
exports.getDealerOrders = async (req, res) => {
  try {
    const dealer = await User.findById(req.user._id);
    const assignedCustomers = dealer.dealerInfo?.assignedCustomers || [];
    
    // Get dealer's products
    const dealerProducts = await Product.find({ addedBy: req.user._id }).select('_id');
    const dealerProductIds = dealerProducts.map(p => p._id.toString());
    
    // Find orders that contain dealer's products OR are from assigned customers
    const orders = await Order.find({
      $or: [
        { user: { $in: assignedCustomers } },
        { 'items.product': { $in: dealerProductIds } }
      ]
    })
      .populate('user', 'name email phoneNumber')
      .populate('items.product', 'name image addedBy')
      .sort({ createdAt: -1 });
    
    // Filter to only show orders with dealer's products
    const filteredOrders = orders.map(order => {
      const dealerItems = order.items.filter(item => 
        item.product && dealerProductIds.includes(item.product._id.toString())
      );
      
      if (dealerItems.length > 0) {
        return {
          ...order.toObject(),
          items: dealerItems,
          total: dealerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      }
      return null;
    }).filter(order => order !== null);
      
    res.json({ success: true, orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ UPDATE ORDER STATUS (Dealer can update their customer orders) ============
exports.updateDealerOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const dealer = await User.findById(req.user._id);
    const assignedCustomers = dealer.dealerInfo?.assignedCustomers || [];
    
    const order = await Order.findOne({
      _id: req.params.id,
      user: { $in: assignedCustomers }
    }).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }
    
    order.status = status;
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
