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

// ============ SEED PRODUCTS (ONE-TIME USE) ============
exports.seedProducts = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const BASE_URL = process.env.NODE_ENV === 'production' 
      ? 'https://fitzone-backend-x2r9.onrender.com' 
      : 'http://localhost:5000';

    const products = [
      {
        name: 'Whey Protein',
        description: 'Advanced whey protein formula with 25g protein per serving. Build lean muscle with zero sugar and 5.5g BCAAs.',
        price: 3299,
        originalPrice: 4199,
        category: 'protein',
        image: `${BASE_URL}/images/whey-protein.png`,
        rating: 4.8,
        reviews: 2847,
        badge: 'BESTSELLER',
        stock: 50,
        flavors: ['Chocolate', 'Vanilla', 'Strawberry', 'Unflavored'],
        nutrition: { calories: '130kcal', protein: '25g', carbs: '3g', fat: '2g', sugar: '0g', bcaa: '5.5g' }
      },
      {
        name: 'Creatine Monohydrate',
        description: '100% pure creatine monohydrate. 5000mg per serving for lean muscle, increased strength and improved performance.',
        price: 1499,
        originalPrice: 1999,
        category: 'creatine',
        image: `${BASE_URL}/images/creatine.png`,
        rating: 4.9,
        reviews: 3124,
        badge: 'HOT',
        stock: 75,
        flavors: ['Unflavored', 'Fruit Punch', 'Watermelon'],
        nutrition: { calories: '0kcal', creatine: '5000mg', carbs: '0g', fat: '0g', sugar: '0g' }
      },
      {
        name: 'Pre-Workout Explosion',
        description: 'Maximum energy, intense focus and amplified strength. 250mg caffeine, 3g citrulline — no crash formula.',
        price: 2199,
        originalPrice: 2799,
        category: 'preworkout',
        image: `${BASE_URL}/images/pre-workout.png`,
        rating: 4.7,
        reviews: 1923,
        badge: 'HOT',
        stock: 40,
        flavors: ['Blue Raspberry', 'Fruit Punch', 'Watermelon', 'Green Apple'],
        nutrition: { calories: '10kcal', caffeine: '250mg', citrulline: '3g', betaAlanine: '2g', carbs: '2g' }
      },
      {
        name: 'Protein Shaker Bottle',
        description: 'Premium stainless steel protein shaker with leak-proof lid and mixing ball. 700ml capacity.',
        price: 699,
        originalPrice: 999,
        category: 'accessories',
        image: `${BASE_URL}/images/shaker.png`,
        rating: 4.6,
        reviews: 4521,
        badge: 'SALE',
        stock: 120,
        colors: ['Black', 'Silver', 'Red'],
        nutrition: null
      },
      {
        name: 'BCAA 2:1:1',
        description: 'Muscle recovery and endurance with 5000mg BCAAs per serving. 2g Leucine, 1g Isoleucine, 1g Valine.',
        price: 1799,
        originalPrice: 2299,
        category: 'amino',
        image: `${BASE_URL}/images/bcaa.png`,
        rating: 4.5,
        reviews: 1456,
        badge: 'BESTSELLER',
        stock: 60,
        flavors: ['Watermelon', 'Mango', 'Green Apple', 'Unflavored'],
        nutrition: { calories: '5kcal', bcaa: '5000mg', leucine: '2g', isoleucine: '1g', valine: '1g' }
      },
      {
        name: 'Resistance Bands Set',
        description: 'Complete 6-band resistance set from 10lb to 50lb. Includes carry bag, handles, and door anchor.',
        price: 1299,
        originalPrice: 1799,
        category: 'equipment',
        image: `${BASE_URL}/images/resistance-bands.png`,
        rating: 4.7,
        reviews: 2341,
        badge: 'SALE',
        stock: 85,
        sizes: ['Light (10-20lb)', 'Medium (20-40lb)', 'Heavy (40-60lb)', 'Full Set'],
        nutrition: null
      },
      {
        name: 'Weight Lifting Gloves',
        description: 'Premium leather weightlifting gloves with wrist support. Anti-slip grip for maximum performance.',
        price: 899,
        originalPrice: 1299,
        category: 'accessories',
        image: `${BASE_URL}/images/gloves.png`,
        rating: 4.6,
        reviews: 3217,
        badge: 'BESTSELLER',
        stock: 95,
        sizes: ['S', 'M', 'L', 'XL'],
        nutrition: null
      },
      {
        name: 'Casein Protein',
        description: 'Slow-digesting nighttime protein with 25g protein and 0g sugar. Advanced sustained-release formula for overnight recovery.',
        price: 3499,
        originalPrice: 4299,
        category: 'protein',
        image: `${BASE_URL}/images/casein.png`,
        rating: 4.7,
        reviews: 1678,
        badge: 'BESTSELLER',
        stock: 45,
        flavors: ['Chocolate', 'Vanilla', 'Cookies & Cream'],
        nutrition: { calories: '120kcal', protein: '25g', carbs: '4g', fat: '1g', sugar: '0g', casein: '25g' }
      }
    ];

    // Clear existing products
    await Product.deleteMany({});
    
    // Add required fields
    const productsWithDefaults = products.map(p => ({
      ...p,
      addedBy: req.user._id,
      addedByRole: 'admin',
      isApproved: true
    }));
    
    const inserted = await Product.insertMany(productsWithDefaults);
    
    res.json({
      success: true,
      message: `${inserted.length} products seeded successfully`,
      products: inserted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ CREATE ADMIN (ONE-TIME USE) ============
exports.createAdminAccount = async (req, res) => {
  try {
    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@fitzone.com' });
    if (existing) {
      return res.json({
        success: true,
        message: 'Admin already exists',
        credentials: {
          email: 'admin@fitzone.com',
          password: 'Admin@123'
        }
      });
    }

    const admin = await User.create({
      name: 'FIT ZONE Admin',
      email: 'admin@fitzone.com',
      password: 'Admin@123',
      phoneNumber: '9999999999',
      role: 'admin'
    });

    res.json({
      success: true,
      message: 'Admin created successfully',
      credentials: {
        email: 'admin@fitzone.com',
        password: 'Admin@123'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
