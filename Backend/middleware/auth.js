const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized - no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized - user no longer exists. Please login again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized - invalid or expired token.' });
  }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied - Admin only' });
  }
};

// Admin and Dealer middleware
exports.adminOrDealer = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'dealer')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied - Admin or Dealer only' });
  }
};

// Dealer only middleware
exports.dealerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'dealer') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied - Dealer only' });
  }
};

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};