const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ============ ADMIN LOGIN ============
exports.adminLogin = async (req, res) => {
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

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied - Not an admin account' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ DASHBOARD STATS ============
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    const ordersByStatus = {
      Processing: await Order.countDocuments({ status: 'Processing' }),
      Confirmed: await Order.countDocuments({ status: 'Confirmed' }),
      Shipped: await Order.countDocuments({ status: 'Shipped' }),
      Delivered: await Order.countDocuments({ status: 'Delivered' }),
      Cancelled: await Order.countDocuments({ status: 'Cancelled' }),
    };

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalOrders, totalRevenue, ordersByStatus },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ PRODUCTS ============
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Note: createProduct moved to createProductAsAdmin at the end of file

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ORDERS ============
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phoneNumber')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ USERS ============
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============ DEALER MANAGEMENT ============
exports.getAllDealers = async (req, res) => {
  try {
    const dealers = await User.find({ role: 'dealer' })
      .populate('dealerInfo.assignedCustomers', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, dealers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDealer = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, companyName, territory, commission } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Generate dealer ID
    const dealerCount = await User.countDocuments({ role: 'dealer' });
    const dealerId = `DLR${String(dealerCount + 1).padStart(4, '0')}`;
    
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
        commission: commission || 0,
        assignedCustomers: []
      }
    });
    
    res.status(201).json({ 
      success: true, 
      dealer: {
        _id: dealer._id,
        name: dealer.name,
        email: dealer.email,
        role: dealer.role,
        dealerInfo: dealer.dealerInfo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDealer = async (req, res) => {
  try {
    const dealer = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!dealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }
    
    res.json({ success: true, dealer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDealer = async (req, res) => {
  try {
    const dealer = await User.findByIdAndDelete(req.params.id);
    if (!dealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }
    res.json({ success: true, message: 'Dealer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignCustomerToDealer = async (req, res) => {
  try {
    const { dealerId, customerId } = req.body;
    
    const dealer = await User.findById(dealerId);
    if (!dealer || dealer.role !== 'dealer') {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }
    
    const customer = await User.findById(customerId);
    if (!customer || customer.role !== 'user') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    // Add customer to dealer's assigned customers if not already assigned
    if (!dealer.dealerInfo.assignedCustomers.includes(customerId)) {
      dealer.dealerInfo.assignedCustomers.push(customerId);
      await dealer.save();
    }
    
    res.json({ success: true, message: 'Customer assigned to dealer', dealer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeCustomerFromDealer = async (req, res) => {
  try {
    const { dealerId, customerId } = req.body;
    
    const dealer = await User.findById(dealerId);
    if (!dealer || dealer.role !== 'dealer') {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }
    
    dealer.dealerInfo.assignedCustomers = dealer.dealerInfo.assignedCustomers.filter(
      id => id.toString() !== customerId
    );
    await dealer.save();
    
    res.json({ success: true, message: 'Customer removed from dealer', dealer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ PRODUCT APPROVAL (Admin approves dealer products) ============
exports.getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ isApproved: false })
      .populate('addedBy', 'name email dealerInfo')
      .sort({ createdAt: -1 });
    res.json({ success: true, products: pendingProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        isApproved: true,
        approvedBy: req.user._id
      },
      { new: true }
    ).populate('addedBy', 'name email');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product, message: 'Product approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product rejected and deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ UPDATE ADMIN PRODUCT CREATION ============
exports.createProductAsAdmin = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      addedBy: req.user._id,
      addedByRole: 'admin',
      isApproved: true, // Admin products are auto-approved
      approvedBy: req.user._id
    };
    
    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============ DEALER APPROVAL ============
exports.getPendingDealers = async (req, res) => {
  try {
    const pendingDealers = await User.find({ 
      role: 'dealer',
      'dealerInfo.isApproved': false 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, dealers: pendingDealers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveDealer = async (req, res) => {
  try {
    const { commission } = req.body; // Admin can set commission during approval
    
    const dealer = await User.findByIdAndUpdate(
      req.params.id,
      { 
        'dealerInfo.isApproved': true,
        'dealerInfo.approvedBy': req.user._id,
        'dealerInfo.approvedAt': new Date(),
        'dealerInfo.commission': commission || 5 // Default 5% if not specified
      },
      { new: true }
    );
    
    if (!dealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }
    
    res.json({ 
      success: true, 
      dealer,
      message: 'Dealer approved successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectDealer = async (req, res) => {
  try {
    const dealer = await User.findByIdAndDelete(req.params.id);
    
    if (!dealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Dealer registration rejected and deleted' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
