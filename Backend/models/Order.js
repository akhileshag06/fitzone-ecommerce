const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  selectedFlavor: String,
  selectedColor: String,
  selectedSize: String
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'cod', 'razorpay'],
      default: 'razorpay'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    transactionId: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  trackingNumber: String
}, {
  timestamps: true
});

// Generate unique order ID before saving
orderSchema.pre('save', function(next) {
  try {
    if (!this.orderId) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.orderId = `ORD-${year}${month}${day}-${random}`;
    }
    next();
  } catch (error) {
    console.error('Error generating orderId:', error);
    next(error);
  }
});

module.exports = mongoose.model('Order', orderSchema);