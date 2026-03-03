const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ============ GET CART ============
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name price image category stock flavors'
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out items where product no longer exists
    const validItems = cart.items.filter(item => item.product !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ADD TO CART ============
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedFlavor } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      item => item.product && item.product.toString() === productId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      if (selectedFlavor) cart.items[existingIndex].selectedFlavor = selectedFlavor;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedFlavor: selectedFlavor || '',
        price: product.price
      });
    }

    await cart.save();

    // Return populated cart
    cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price image category stock flavors'
    });

    res.json({ success: true, cart });
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ UPDATE CART ITEM ============
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product && item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price image category stock flavors'
    });

    res.json({ success: true, cart });
  } catch (error) {
    console.error('updateCartItem error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ REMOVE FROM CART ============
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product && item.product.toString() !== productId
    );

    await cart.save();

    cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price image category stock flavors'
    });

    res.json({ success: true, cart });
  } catch (error) {
    console.error('removeFromCart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ CLEAR CART ============
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, cart: { items: [] } });
  } catch (error) {
    console.error('clearCart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };