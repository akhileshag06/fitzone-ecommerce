const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();   

// Route files
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SERVE STATIC FILES (product images from public/images/)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ CORS - Allow all origins for development
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,      
    message: 'Server is running!',
    time: new Date().toISOString()
  });
});

// Setup route - Create admin and seed products
app.get('/api/setup', async (req, res) => {
  try {
    const User = require('./models/User');
    const Product = require('./models/Product');
    const mongoose = require('mongoose');
    
    // Create admin if doesn't exist
    let admin = await User.findOne({ email: 'admin@fitzone.com' });
    if (!admin) {
      admin = await User.create({
        name: 'FIT ZONE Admin',
        email: 'admin@fitzone.com',
        password: 'Admin@123',
        phoneNumber: '9999999999',
        role: 'admin'
      });
    }
    
    // Check if force parameter is provided to re-seed
    const force = req.query.force === 'true';
    
    // Seed products if none exist OR if force=true
    const productCount = await Product.countDocuments();
    let productsCreated = 0;
    
    if (productCount === 0 || force) {
      // Clear existing products if force
      if (force) {
        await Product.deleteMany({});
      }
      
      const BASE_URL = 'https://fitzone-backend-x2r9.onrender.com';
      const products = [
        { name: 'Whey Protein', description: 'Advanced whey protein formula with 25g protein per serving.', price: 3299, originalPrice: 4199, category: 'protein', image: `${BASE_URL}/images/whey-protein.png`, rating: 4.8, reviews: 2847, badge: 'BESTSELLER', stock: 50, flavors: ['Chocolate', 'Vanilla', 'Strawberry', 'Unflavored'] },
        { name: 'Creatine Monohydrate', description: '100% pure creatine monohydrate. 5000mg per serving.', price: 1499, originalPrice: 1999, category: 'creatine', image: `${BASE_URL}/images/creatine.png`, rating: 4.9, reviews: 3124, badge: 'HOT', stock: 75, flavors: ['Unflavored', 'Fruit Punch', 'Watermelon'] },
        { name: 'Pre-Workout Explosion', description: 'Maximum energy, intense focus and amplified strength.', price: 2199, originalPrice: 2799, category: 'preworkout', image: `${BASE_URL}/images/pre-workout.png`, rating: 4.7, reviews: 1923, badge: 'HOT', stock: 40, flavors: ['Blue Raspberry', 'Fruit Punch', 'Watermelon', 'Green Apple'] },
        { name: 'Protein Shaker Bottle', description: 'Premium stainless steel protein shaker with leak-proof lid.', price: 699, originalPrice: 999, category: 'accessories', image: `${BASE_URL}/images/shaker.png`, rating: 4.6, reviews: 4521, badge: 'SALE', stock: 120 },
        { name: 'BCAA 2:1:1', description: 'Muscle recovery and endurance with 5000mg BCAAs per serving.', price: 1799, originalPrice: 2299, category: 'amino', image: `${BASE_URL}/images/bcaa.png`, rating: 4.5, reviews: 1456, badge: 'BESTSELLER', stock: 60, flavors: ['Watermelon', 'Mango', 'Green Apple', 'Unflavored'] },
        { name: 'Resistance Bands Set', description: 'Complete 6-band resistance set from 10lb to 50lb.', price: 1299, originalPrice: 1799, category: 'equipment', image: `${BASE_URL}/images/resistance-bands.png`, rating: 4.7, reviews: 2341, badge: 'SALE', stock: 85 },
        { name: 'Weight Lifting Gloves', description: 'Premium leather weightlifting gloves with wrist support.', price: 899, originalPrice: 1299, category: 'accessories', image: `${BASE_URL}/images/gloves.png`, rating: 4.6, reviews: 3217, badge: 'BESTSELLER', stock: 95 },
        { name: 'Casein Protein', description: 'Slow-digesting nighttime protein with 25g protein.', price: 3499, originalPrice: 4299, category: 'protein', image: `${BASE_URL}/images/casein.png`, rating: 4.7, reviews: 1678, badge: 'BESTSELLER', stock: 45, flavors: ['Chocolate', 'Vanilla', 'Cookies & Cream'] }
      ];
      
      const productsWithDefaults = products.map(p => ({
        ...p,
        addedBy: admin._id,
        addedByRole: 'admin',
        isApproved: true
      }));
      
      await Product.insertMany(productsWithDefaults);
      productsCreated = products.length;
    }
    
    res.json({
      success: true,
      message: 'Setup completed successfully!',
      admin: { email: 'admin@fitzone.com', password: 'Admin@123' },
      productsCreated,
      existingProducts: productCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>🏋️ FIT ZONE API</h1>
    <p>Server is running successfully!</p>
    <ul>
      <li><a href="/api/test">Test API</a></li>
      <li><a href="/api/products">Products API</a></li>
    </ul>
  `);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🖼️  Images served at http://localhost:${PORT}/images/`);
  console.log(`✅ CORS enabled for all origins`);
});

process.on('unhandledRejection', (err) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});