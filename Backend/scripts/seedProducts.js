const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const Product = require('../models/Product');

// Load .env from Backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

// ✅ Images are served from your backend's public/images folder
// Make sure you copy the images folder into: backend/public/images/
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
    nutrition: {
      calories: '130kcal',
      protein: '25g',
      carbs: '3g',
      fat: '2g',
      sugar: '0g',
      bcaa: '5.5g'
    }
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
    nutrition: {
      calories: '0kcal',
      creatine: '5000mg',
      carbs: '0g',
      fat: '0g',
      sugar: '0g'
    }
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
    nutrition: {
      calories: '10kcal',
      caffeine: '250mg',
      citrulline: '3g',
      betaAlanine: '2g',
      carbs: '2g'
    }
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
    nutrition: {
      calories: '5kcal',
      bcaa: '5000mg',
      leucine: '2g',
      isoleucine: '1g',
      valine: '1g'
    }
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
    nutrition: {
      calories: '120kcal',
      protein: '25g',
      carbs: '4g',
      fat: '1g',
      sugar: '0g',
      casein: '25g'
    }
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    console.log('🌱 Seeding new products with custom images...');
    
    // Add required fields to each product
    const productsWithDefaults = products.map(p => ({
      ...p,
      addedBy: new mongoose.Types.ObjectId(), // Dummy admin ID
      addedByRole: 'admin',
      isApproved: true
    }));
    
    const inserted = await Product.insertMany(productsWithDefaults);
    console.log(`✅ ${inserted.length} products seeded successfully!`);
    inserted.forEach(p => console.log(`  → ${p.name}: ${p.image}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();