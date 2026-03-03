const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add category'],
    enum: ['protein', 'creatine', 'preworkout', 'accessories', 'equipment', 'amino']
  },
  price: {
    type: Number,
    required: [true, 'Please add price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add image URL']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    enum: ['BESTSELLER', 'HOT', 'SALE', 'TRENDING', 'NEW', 'BUNDLE', 'NIGHT TIME']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  flavors: [String],
  colors: [String],
  sizes: [String],
  nutrition: {
    type: Map,
    of: String
  },
  // Dealer tracking
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedByRole: {
    type: String,
    enum: ['admin', 'dealer'],
    required: true
  },
  dealerInfo: {
    dealerId: String,
    companyName: String
  },
  isApproved: {
    type: Boolean,
    default: true // Admin products auto-approved, dealer products need approval
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);