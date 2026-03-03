import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "./Register.css";
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ThemeToggle from './components/ThemeToggle';
import CouponInput from './components/CouponInput';
import OrderTracking from './components/OrderTracking';
import ProductReviews from './components/ProductReviews';
import ProductComparison from './components/ProductComparison';
import ProChatbot from './components/ProChatbot';
import { API_URL } from './config';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [greeting, setGreeting] = useState('');
  
  // Cart State - Stored in DB
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  
  // Orders State - Stored in DB
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  
  // Products State - From DB
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('featured');
  
  // Wishlist State
  const [wishlist, setWishlist] = useState([]);
  
  // New Enhancement Features State
  const [compareProducts, setCompareProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  
  // UI State
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Stats State
  const [stats, setStats] = useState({
    totalSpent: 0,
    ordersCount: 0,
    itemsBought: 0,
    memberSince: ''
  });

  // Checkout Form State
  const [checkoutInfo, setCheckoutInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  // Refs for animations
  const productRefs = useRef([]);
  const styleRef = useRef(null);

  // ============ DASHBOARD STYLES (Embedded CSS) ============
  const dashboardStyles = `
    /* ===== E-COMMERCE DASHBOARD STYLES ===== */
    .ecommerce-dashboard {
      min-height: 100vh;
      width: 100%;
      background: radial-gradient(circle at 50% 50%, #1a1e2a, #0c0f14);
      position: relative;
      overflow-x: hidden;
      padding: 20px;
      font-family: 'Inter', sans-serif;
    }

    /* Background Animations */
    .dashboard-bg-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .gradient-sphere {
      position: absolute;
      width: 60vw;
      height: 60vw;
      background: radial-gradient(circle, rgba(255, 183, 77, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      top: -20vh;
      right: -20vw;
      animation: sphereFloat 20s infinite;
    }

    .gradient-sphere-2 {
      position: absolute;
      width: 50vw;
      height: 50vw;
      background: radial-gradient(circle, rgba(77, 208, 255, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      bottom: -20vh;
      left: -20vw;
      animation: sphereFloat 25s infinite reverse;
    }

    @keyframes sphereFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(5%, 5%) scale(1.1); }
      66% { transform: translate(-5%, -5%) scale(0.9); }
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      font-size: 24px;
      color: rgba(255, 255, 255, 0.1);
      animation: floatShape 20s infinite;
    }

    @keyframes floatShape {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(100px, -50px) rotate(10deg); }
      50% { transform: translate(-50px, 100px) rotate(-10deg); }
      75% { transform: translate(50px, -100px) rotate(5deg); }
    }

    /* Notification Toast */
    .notification-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      padding: 15px 25px;
      border-radius: 50px;
      box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
      font-weight: 600;
    }

    .notification-toast.error {
      background: linear-gradient(135deg, #ff6b6b, #ff5252);
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    /* Dashboard Glass */
    .dashboard-glass {
      position: relative;
      z-index: 10;
      background: rgba(18, 22, 30, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 183, 77, 0.2);
      border-radius: 40px;
      padding: 30px;
      max-width: 1400px;
      margin: 0 auto;
      animation: glassReveal 0.8s ease;
    }

    @keyframes glassReveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .header-greeting {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .greeting-emoji {
      font-size: 48px;
      animation: wave 2s infinite;
      transform-origin: 70% 70%;
    }

    @keyframes wave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(20deg); }
      75% { transform: rotate(-10deg); }
    }

    .header-greeting h1 {
      color: white;
      font-size: 32px;
      margin-bottom: 5px;
    }

    .user-highlight {
      color: #ffb74d;
      font-weight: 700;
    }

    .header-subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }

    .header-stats-mini {
      display: flex;
      gap: 15px;
    }

    .mini-stat {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.03);
      padding: 10px 15px;
      border-radius: 30px;
      border: 1px solid rgba(255, 183, 77, 0.2);
    }

    .mini-icon {
      font-size: 24px;
    }

    .mini-stat div {
      display: flex;
      flex-direction: column;
    }

    .mini-value {
      color: white;
      font-size: 18px;
      font-weight: 700;
    }

    .mini-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 11px;
    }

    /* Tabs */
    .dashboard-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      background: rgba(255, 255, 255, 0.02);
      padding: 10px;
      border-radius: 60px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .tab-btn {
      flex: 1;
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 15px;
      background: transparent;
      border: none;
      border-radius: 40px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .tab-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 183, 77, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .tab-btn:hover::before {
      width: 200px;
      height: 200px;
    }

    .tab-btn.active {
      background: rgba(255, 183, 77, 0.15);
      color: #ffb74d;
      box-shadow: 0 0 30px rgba(255, 183, 77, 0.2);
    }

    .tab-icon {
      font-size: 18px;
      position: relative;
      z-index: 1;
    }

    .tab-badge {
      background: #ff6b6b;
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 20px;
      margin-left: 5px;
    }

    /* Stats Grid */
    .stats-grid-large {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card-large {
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 30px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .stat-card-large:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 183, 77, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .stat-icon-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      display: block;
      margin-bottom: 5px;
    }

    .stat-value {
      color: white;
      font-size: 28px;
      font-weight: 700;
      display: block;
      margin-bottom: 5px;
    }

    .stat-trend {
      color: #4dd0ff;
      font-size: 12px;
    }

    /* Recent Orders */
    .recent-orders-section {
      margin-bottom: 30px;
    }

    .recent-orders-section h3 {
      color: white;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .recent-orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .recent-order-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .recent-order-card:hover {
      border-color: rgba(255, 183, 77, 0.3);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .order-id {
      color: #ffb74d;
      font-size: 12px;
      font-weight: 600;
      font-family: monospace;
    }

    .order-status {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }

    .order-status.processing {
      background: rgba(255, 183, 77, 0.15);
      color: #ffb74d;
    }

    .order-status.delivered {
      background: rgba(76, 175, 80, 0.15);
      color: #4CAF50;
    }

    .order-status.shipped {
      background: rgba(77, 208, 255, 0.15);
      color: #4dd0ff;
    }

    .order-status.cancelled {
      background: rgba(255, 107, 107, 0.15);
      color: #ff6b6b;
    }

    .order-items-preview {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .order-item-preview {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .order-item-preview img {
      width: 30px;
      height: 30px;
      object-fit: cover;
      border-radius: 10px;
    }

    .order-item-preview span {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
    }

    .more-items {
      color: rgba(255, 255, 255, 0.4);
      font-size: 11px;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .order-total {
      color: white;
      font-weight: 700;
    }

    .order-date {
      color: rgba(255, 255, 255, 0.4);
      font-size: 11px;
    }

    /* Cancel Order Button */
    .cancel-order-btn {
      padding: 4px 12px;
      border: 1px solid #ff6b6b;
      border-radius: 20px;
      background: transparent;
      color: #ff6b6b;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-order-btn:hover {
      background: #ff6b6b;
      color: white;
    }

    .cancel-order-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Clear History Button */
    .clear-history-btn {
      padding: 12px 25px;
      border: 1px solid #ff6b6b;
      border-radius: 30px;
      background: transparent;
      color: #ff6b6b;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .clear-history-btn:hover {
      background: #ff6b6b;
      color: white;
    }

    .clear-history-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Cancel Order Modal */
    .cancel-modal, .clear-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }

    .cancel-content, .clear-content {
      background: rgba(18, 22, 30, 0.98);
      border: 1px solid rgba(255, 107, 107, 0.3);
      border-radius: 40px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      position: relative;
      animation: slideUp 0.5s ease;
    }

    .cancel-content h2, .clear-content h2 {
      color: white;
      margin-bottom: 20px;
      font-size: 28px;
    }

    .cancel-content h2 span, .clear-content h2 span {
      color: #ff6b6b;
    }

    .cancel-content p, .clear-content p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 30px;
      line-height: 1.6;
    }

    .cancel-actions, .clear-actions {
      display: flex;
      gap: 15px;
    }

    .cancel-confirm-btn, .clear-confirm-btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 30px;
      background: linear-gradient(135deg, #ff6b6b, #ff5252);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-confirm-btn:hover, .clear-confirm-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
    }

    .cancel-close-btn, .clear-close-btn {
      flex: 1;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      background: transparent;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-close-btn:hover, .clear-close-btn:hover {
      border-color: #ffb74d;
      color: #ffb74d;
    }

    /* Quick Actions */
    .quick-actions {
      margin-bottom: 20px;
    }

    .quick-actions h3 {
      color: white;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 30px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: rgba(255, 183, 77, 0.1);
      border-color: #ffb74d;
      transform: translateY(-3px);
    }

    .action-icon {
      font-size: 20px;
    }

    /* Shop Section */
    .shop-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .shop-header h2 {
      color: white;
      font-size: 36px;
      margin-bottom: 10px;
    }

    .shop-header h2 span {
      color: #ffb74d;
    }

    .shop-header p {
      color: rgba(255, 255, 255, 0.6);
    }

    .shop-filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 200px;
    }

    .search-input {
      width: 100%;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      color: white;
      font-size: 14px;
    }

    .search-input:focus {
      outline: none;
      border-color: #ffb74d;
    }

    .filter-group select {
      width: 100%;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      color: white;
      font-size: 14px;
      cursor: pointer;
    }

    .filter-group select option {
      background: #1a1e2a;
    }

    /* Products Grid */
    .products-grid-large {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }

    .product-card-large {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 30px;
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }

    .product-card-large:hover {
      transform: translateY(-10px);
      border-color: rgba(255, 183, 77, 0.3);
      box-shadow: 0 30px 50px rgba(0, 0, 0, 0.4);
    }

    .product-badges {
      position: absolute;
      top: 15px;
      left: 15px;
      z-index: 2;
      display: flex;
      gap: 8px;
    }

    .product-badge {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .product-badge.bestseller {
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      color: #0a0c10;
    }

    .product-badge.hot {
      background: linear-gradient(135deg, #ff6b6b, #ff5252);
      color: white;
    }

    .product-badge.sale {
      background: linear-gradient(135deg, #4dd0ff, #00b0ff);
      color: white;
    }

    .product-badge.discount {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(5px);
      color: #ffb74d;
    }

    .product-image-wrapper {
      position: relative;
      height: 250px;
      overflow: hidden;
      background: linear-gradient(145deg, #2d3342, #1f232e);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .product-image-wrapper img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.5s ease;
      display: block;
    }

    .product-card-large:hover .product-image-wrapper img {
      transform: scale(1.1);
    }

    .product-actions {
      position: absolute;
      bottom: -50px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 15px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      transition: bottom 0.3s ease;
    }

    .product-card-large:hover .product-actions {
      bottom: 0;
    }

    .quick-view-btn, .wishlist-btn {
      padding: 8px 15px;
      border: none;
      border-radius: 25px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quick-view-btn {
      background: #ffb74d;
      color: #0a0c10;
      flex: 1;
    }

    .quick-view-btn:hover {
      background: #ff8a5c;
      transform: scale(1.05);
    }

    .wishlist-btn {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      color: white;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .wishlist-btn:hover {
      background: #ff6b6b;
      transform: scale(1.1);
    }

    .product-info-large {
      padding: 20px;
    }

    .product-category {
      color: #ffb74d;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
      display: block;
    }

    .product-info-large h3 {
      color: white;
      font-size: 16px;
      margin-bottom: 10px;
      line-height: 1.4;
      min-height: 44px;
    }

    .product-rating-large {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star-filled {
      color: #ffb74d;
    }

    .stars span:not(.star-filled) {
      color: rgba(255, 255, 255, 0.2);
    }

    .reviews {
      color: rgba(255, 255, 255, 0.5);
      font-size: 11px;
    }

    .product-price-large {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .current {
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .original {
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
      text-decoration: line-through;
    }

    .product-stock {
      margin-bottom: 15px;
      font-size: 12px;
    }

    .in-stock {
      color: #4CAF50;
    }

    .low-stock {
      color: #ffb74d;
    }

    .out-stock {
      color: #ff6b6b;
    }

    .add-to-cart-large {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 30px;
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      color: #0a0c10;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-to-cart-large:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(255, 183, 77, 0.4);
    }

    /* Product Details Modal */
    .product-details-modal {
      position: relative;
      background: rgba(18, 22, 30, 0.98);
      border-radius: 40px;
      padding: 40px;
      animation: modalFadeIn 0.5s ease;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    .close-details {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
    }

    .close-details:hover {
      background: rgba(255, 107, 107, 0.2);
      border-color: #ff6b6b;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .details-image {
      background: linear-gradient(145deg, #2d3342, #1f232e);
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px;
      min-height: 400px;
    }

    .details-image img {
      max-width: 100%;
      max-height: 350px;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 20px;
    }

    .details-info h2 {
      color: white;
      font-size: 28px;
      margin-bottom: 15px;
    }

    .details-category {
      color: #ffb74d;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      display: block;
    }

    .details-rating {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }

    .stars-large {
      display: flex;
      gap: 3px;
      font-size: 18px;
    }

    .reviews-count {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
    }

    .details-price {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .details-current {
      color: white;
      font-size: 32px;
      font-weight: 700;
    }

    .details-original {
      color: rgba(255, 255, 255, 0.4);
      font-size: 20px;
      text-decoration: line-through;
    }

    .details-description {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .nutrition-facts {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .nutrition-facts h4 {
      color: white;
      margin-bottom: 15px;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 15px;
    }

    .nutrition-item {
      display: flex;
      flex-direction: column;
    }

    .nutrition-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 11px;
      margin-bottom: 5px;
    }

    .nutrition-value {
      color: white;
      font-size: 16px;
      font-weight: 600;
    }

    .flavor-selection, .quantity-selection {
      margin-bottom: 30px;
    }

    .flavor-selection h4, .quantity-selection h4 {
      color: white;
      margin-bottom: 15px;
    }

    .flavor-options {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .flavor-btn {
      padding: 8px 15px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 25px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .flavor-btn:hover {
      border-color: #ffb74d;
      color: #ffb74d;
    }

    .flavor-btn.active {
      background: #ffb74d;
      border-color: #ffb74d;
      color: #0a0c10;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .quantity-controls button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quantity-controls button:hover {
      background: #ffb74d;
      border-color: #ffb74d;
      color: #0a0c10;
    }

    .quantity-controls span {
      color: white;
      font-size: 18px;
      font-weight: 600;
      min-width: 30px;
      text-align: center;
    }

    .details-actions {
      display: flex;
      gap: 15px;
    }

    .add-to-cart-details {
      flex: 2;
      padding: 15px;
      border: none;
      border-radius: 40px;
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      color: #0a0c10;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .wishlist-details {
      flex: 1;
      padding: 15px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      background: transparent;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .wishlist-details:hover {
      border-color: #ff6b6b;
      color: #ff6b6b;
    }

    /* Cart Section */
    .cart-section {
      min-height: 400px;
    }

    .cart-section h2 {
      color: white;
      margin-bottom: 30px;
      font-size: 28px;
    }

    .empty-cart {
      text-align: center;
      padding: 60px;
    }

    .empty-cart-icon {
      font-size: 80px;
      display: block;
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .empty-cart h3 {
      color: white;
      margin-bottom: 10px;
    }

    .empty-cart p {
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 30px;
    }

    .shop-now-btn {
      padding: 12px 30px;
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      border: none;
      border-radius: 30px;
      color: #0a0c10;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .shop-now-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(255, 183, 77, 0.3);
    }

    .cart-items {
      margin-bottom: 30px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 80px 2fr 1fr 120px 100px 40px;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 20px;
      margin-bottom: 10px;
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 183, 77, 0.3);
    }

    .cart-item-image {
      width: 80px;
      height: 80px;
      object-fit: contain;
      border-radius: 15px;
      background: linear-gradient(145deg, #2d3342, #1f232e);
    }

    .cart-item-info h4 {
      color: white;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .cart-item-category {
      color: rgba(255, 255, 255, 0.4);
      font-size: 11px;
      margin-bottom: 3px;
    }

    .cart-item-flavor {
      color: #ffb74d;
      font-size: 11px;
    }

    .cart-item-price {
      color: white;
      font-weight: 600;
    }

    .cart-item-quantity {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cart-item-quantity button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cart-item-quantity button:hover {
      background: #ffb74d;
      border-color: #ffb74d;
      color: #0a0c10;
    }

    .cart-item-quantity span {
      color: white;
      font-weight: 600;
      min-width: 30px;
      text-align: center;
    }

    .cart-item-total {
      color: white;
      font-weight: 700;
    }

    .cart-item-remove {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cart-item-remove:hover {
      background: #ff6b6b;
      color: white;
    }

    .cart-summary {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 30px;
      padding: 30px;
      max-width: 400px;
      margin-left: auto;
    }

    .summary-details {
      margin-bottom: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      color: rgba(255, 255, 255, 0.7);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .summary-row.total {
      color: white;
      font-size: 18px;
      font-weight: 700;
      border-bottom: none;
    }

    .checkout-btn {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 40px;
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      color: #0a0c10;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .checkout-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(255, 183, 77, 0.3);
    }

    /* Checkout Modal */
    .checkout-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }

    .checkout-content {
      background: rgba(18, 22, 30, 0.98);
      border: 1px solid rgba(255, 183, 77, 0.3);
      border-radius: 40px;
      padding: 40px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideUp 0.5s ease;
    }

    .close-checkout {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .close-checkout:hover {
      background: rgba(255, 107, 107, 0.2);
      border-color: #ff6b6b;
    }

    .checkout-steps {
      display: flex;
      justify-content: space-between;
      margin: 30px 0;
      position: relative;
    }

    .checkout-steps::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }

    .step {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .step-number {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: #ffb74d;
      border-color: #ffb74d;
      color: #0a0c10;
    }

    .step-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }

    .step.active .step-label {
      color: #ffb74d;
    }

    /* Payment Method Styles */
    .payment-method-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 20px;
      transition: all 0.3s ease;
    }

    .payment-method-card.selected {
      border-color: #ffb74d;
      background: rgba(255, 183, 77, 0.05);
      box-shadow: 0 0 20px rgba(255, 183, 77, 0.2);
    }

    .payment-method-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .payment-method-header input[type="radio"] {
      width: 20px;
      height: 20px;
      accent-color: #ffb74d;
      cursor: pointer;
    }

    .payment-method-name {
      color: white;
      font-weight: 600;
      font-size: 16px;
      flex: 1;
    }

    .payment-method-badge {
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      color: #0a0c10;
      padding: 4px 12px;
      border-radius: 30px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .payment-method-icons {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .payment-icon {
      font-size: 28px;
      opacity: 0.8;
      background: rgba(255, 255, 255, 0.05);
      padding: 5px;
      border-radius: 8px;
    }

    .payment-method-description {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      margin-bottom: 15px;
      line-height: 1.5;
    }

    .payment-partners {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .payment-partners span {
      color: #ffb74d;
      font-size: 12px;
      background: rgba(255, 183, 77, 0.1);
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255, 183, 77, 0.2);
    }

    .secure-payment-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 20px 0;
      padding: 12px;
      background: rgba(76, 175, 80, 0.1);
      border: 1px solid rgba(76, 175, 80, 0.3);
      border-radius: 40px;
      color: #4CAF50;
      font-size: 13px;
      font-weight: 600;
    }

    .secure-icon {
      font-size: 16px;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .checkout-form h3 {
      color: white;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      margin-bottom: 5px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      color: white;
      font-size: 14px;
    }

    .form-group input:focus {
      outline: none;
      border-color: #ffb74d;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .payment-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .back-step-btn {
      flex: 1;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      background: transparent;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-step-btn:hover {
      border-color: #ffb74d;
      color: #ffb74d;
    }

    .next-step-btn {
      flex: 2;
      padding: 12px;
      border: none;
      border-radius: 30px;
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      color: #0a0c10;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .next-step-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 183, 77, 0.3);
    }

    .place-order-btn {
      flex: 2;
      padding: 12px;
      border: none;
      border-radius: 30px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .place-order-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
    }

    .place-order-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .place-order-btn:disabled:hover {
      transform: none;
      box-shadow: none;
    }

    /* Review Order */
    .review-items {
      margin: 20px 0;
      max-height: 300px;
      overflow-y: auto;
    }

    .review-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .review-item img {
      width: 50px;
      height: 50px;
      object-fit: contain;
      border-radius: 10px;
      background: linear-gradient(145deg, #2d3342, #1f232e);
    }

    .review-item-info {
      flex: 1;
    }

    .review-item-info h4 {
      color: white;
      font-size: 14px;
      margin-bottom: 3px;
    }

    .review-item-info p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 11px;
    }

    .review-item-price {
      color: #ffb74d;
      font-weight: 600;
    }

    .review-total {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 20px;
      padding: 20px;
      margin: 20px 0;
    }

    .review-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      color: rgba(255, 255, 255, 0.7);
    }

    .review-row.total {
      color: white;
      font-size: 18px;
      font-weight: 700;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 10px;
      padding-top: 15px;
    }

    /* Orders Section */
    .orders-section {
      padding: 20px 0;
    }

    .orders-section h2 {
      color: white;
      margin-bottom: 30px;
      font-size: 28px;
    }

    .no-orders {
      text-align: center;
      padding: 60px;
    }

    .no-orders-icon {
      font-size: 80px;
      display: block;
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .no-orders h3 {
      color: white;
      margin-bottom: 10px;
    }

    .no-orders p {
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 30px;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .order-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 30px;
      padding: 25px;
      transition: all 0.3s ease;
    }

    .order-card:hover {
      border-color: rgba(255, 183, 77, 0.3);
    }

    .order-header-large {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      flex-wrap: wrap;
      gap: 10px;
    }

    .order-info {
      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    .order-tracking {
      color: #ffb74d;
      font-size: 14px;
      font-weight: 600;
      font-family: monospace;
    }

    .order-date-large {
      color: rgba(255, 255, 255, 0.4);
      font-size: 12px;
    }

    .order-status-large {
      padding: 6px 15px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }

    .order-status-large.processing {
      background: rgba(255, 183, 77, 0.15);
      color: #ffb74d;
    }

    .order-status-large.delivered {
      background: rgba(76, 175, 80, 0.15);
      color: #4CAF50;
    }

    .order-status-large.shipped {
      background: rgba(77, 208, 255, 0.15);
      color: #4dd0ff;
    }

    .order-status-large.cancelled {
      background: rgba(255, 107, 107, 0.15);
      color: #ff6b6b;
    }

    .order-items {
      margin-bottom: 20px;
    }

    .order-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.02);
    }

    .order-item img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      border-radius: 15px;
      background: linear-gradient(145deg, #2d3342, #1f232e);
    }

    .order-item-details {
      flex: 1;
    }

    .order-item-details h4 {
      color: white;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .order-item-details p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }

    .order-item-total {
      color: #ffb74d;
      font-weight: 600;
    }

    .order-footer-large {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      flex-wrap: wrap;
      gap: 15px;
    }

    .order-total-large {
      color: white;
      font-size: 18px;
      font-weight: 700;
    }

    .order-actions {
      display: flex;
      gap: 10px;
    }

    .track-order-btn {
      padding: 8px 20px;
      border: 1px solid rgba(255, 183, 77, 0.3);
      border-radius: 30px;
      background: transparent;
      color: #ffb74d;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .track-order-btn:hover {
      background: rgba(255, 183, 77, 0.1);
      border-color: #ffb74d;
    }

    .cancel-order-large-btn {
      padding: 8px 20px;
      border: 1px solid #ff6b6b;
      border-radius: 30px;
      background: transparent;
      color: #ff6b6b;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-order-large-btn:hover {
      background: #ff6b6b;
      color: white;
    }

    .cancel-order-large-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Invoice Button */
    .invoice-btn {
      padding: 8px 20px;
      border: 1px solid #4CAF50;
      border-radius: 30px;
      background: transparent;
      color: #4CAF50;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .invoice-btn:hover {
      background: #4CAF50;
      color: white;
    }

    /* Wishlist Section */
    .wishlist-section h2 {
      color: white;
      margin-bottom: 30px;
      font-size: 28px;
    }

    .empty-wishlist {
      text-align: center;
      padding: 60px;
    }

    .empty-wishlist-icon {
      font-size: 80px;
      display: block;
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .empty-wishlist h3 {
      color: white;
      margin-bottom: 10px;
    }

    .empty-wishlist p {
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 30px;
    }

    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .wishlist-card {
      position: relative;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .wishlist-card:hover {
      transform: translateY(-5px);
      border-color: #ffb74d;
    }

    .wishlist-card img {
      width: 100%;
      height: 150px;
      object-fit: contain;
      background: linear-gradient(145deg, #2d3342, #1f232e);
    }

    .remove-wishlist {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .remove-wishlist:hover {
      background: #ff6b6b;
      transform: scale(1.1);
    }

    .wishlist-info {
      padding: 15px;
    }

    .wishlist-info h4 {
      color: white;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .wishlist-price {
      color: #ffb74d;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .add-to-cart-wishlist {
      width: 100%;
      padding: 8px;
      border: 1px solid #ffb74d;
      border-radius: 20px;
      background: transparent;
      color: #ffb74d;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-to-cart-wishlist:hover {
      background: #ffb74d;
      color: #0a0c10;
    }

    /* Profile Section */
    .profile-section h2 {
      color: white;
      margin-bottom: 30px;
      font-size: 28px;
    }

    .profile-card-large {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 40px;
      padding: 40px;
      text-align: center;
      max-width: 500px;
      margin: 0 auto;
    }

    .profile-avatar-large {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      background: linear-gradient(135deg, #ffb74d, #ff8a5c);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 48px;
      animation: pulse 2s infinite;
    }

    .profile-details h3 {
      color: white;
      font-size: 24px;
      margin-bottom: 5px;
    }

    .profile-email {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 5px;
    }

    .profile-phone {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 5px;
    }

    .profile-member {
      color: rgba(255, 255, 255, 0.4);
      font-size: 12px;
      margin-bottom: 30px;
    }

    .profile-stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 30px;
    }

    .profile-stat {
      text-align: center;
    }

    .profile-stat-value {
      display: block;
      color: white;
      font-size: 28px;
      font-weight: 700;
    }

    .profile-stat-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }

    .logout-btn-profile {
      padding: 12px 40px;
      border: 1px solid #ff6b6b;
      border-radius: 30px;
      background: transparent;
      color: #ff6b6b;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logout-btn-profile:hover {
      background: #ff6b6b;
      color: white;
    }

    /* Compare Button */
    .compare-btn {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      border: 1px solid rgba(77, 208, 255, 0.3);
      border-radius: 30px;
      background: rgba(77, 208, 255, 0.1);
      color: #4dd0ff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .compare-btn:hover {
      background: #4dd0ff;
      color: #0a0c10;
      transform: translateY(-2px);
    }

    .compare-btn.active {
      background: #4dd0ff;
      color: #0a0c10;
      border-color: #4dd0ff;
    }

    /* Floating Compare View Button */
    .floating-compare-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 15px 25px;
      background: linear-gradient(135deg, #4dd0ff, #00b0ff);
      border: none;
      border-radius: 50px;
      color: white;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 40px rgba(77, 208, 255, 0.4);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: bounceIn 0.5s ease, pulse 2s infinite;
      transition: all 0.3s ease;
    }

    .floating-compare-btn:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 15px 50px rgba(77, 208, 255, 0.6);
    }

    .compare-count {
      background: white;
      color: #4dd0ff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
    }

    @keyframes bounceIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-glass { padding: 20px; }
      .dashboard-header { flex-direction: column; text-align: center; }
      .header-greeting { flex-direction: column; }
      .dashboard-tabs { flex-direction: column; }
      .details-grid { grid-template-columns: 1fr; }
      .cart-item {
        grid-template-columns: 60px 1fr;
        grid-template-areas: 
          "image info"
          "image price"
          "quantity total"
          "remove remove";
        gap: 10px;
      }
      .cart-item-image { grid-area: image; }
      .cart-item-info { grid-area: info; }
      .cart-item-price { grid-area: price; }
      .cart-item-quantity { grid-area: quantity; }
      .cart-item-total { grid-area: total; }
      .cart-item-remove { grid-area: remove; width: 100%; border-radius: 20px; }
      .form-row { grid-template-columns: 1fr; }
      .payment-actions { flex-direction: column; }
      .payment-method-header { flex-direction: column; align-items: flex-start; gap: 10px; }
      .profile-stats { flex-direction: column; gap: 15px; }
      .order-header-large { flex-direction: column; align-items: flex-start; gap: 10px; }
      .order-footer-large { flex-direction: column; align-items: flex-start; }
      .order-actions { width: 100%; justify-content: space-between; }
    }
  `;

  // ============ INJECT STYLES ============
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = dashboardStyles;
    document.head.appendChild(styleElement);
    styleRef.current = styleElement;
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  // ============ SET GREETING ============
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // ============ FETCH PRODUCTS FROM DATABASE ============
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotificationMessage('Failed to load products', 'error');
    }
  };

  // ============ FETCH CART FROM DATABASE ============
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCart(response.data.cart.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // ============ FETCH ORDERS FROM DATABASE ============
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
        setOrderHistory(response.data.orders);
        const totalSpent = response.data.orders.reduce((sum, order) => sum + order.total, 0);
        const itemsBought = response.data.orders.reduce((sum, order) => sum + order.items.length, 0);
        setStats({
          totalSpent,
          ordersCount: response.data.orders.length,
          itemsBought,
          memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // ============ FETCH ALL DATA ============
  const fetchAllData = async () => {
    setLoading(true);
    await fetchProducts();
    const token = localStorage.getItem('token');
    if (token) {
      await fetchCart();
      await fetchOrders();
    }
    setLoading(false);
  };

  // ============ CHECK USER LOGIN & FETCH DATA ============
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');
    if (!token || !currentUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(currentUser);
      setUser(userData);
      fetchAllData();
    }
  }, [navigate]);

  // ============ UPDATE CART COUNT AND TOTAL ============
  useEffect(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartCount(count);
    setCartTotal(total);
  }, [cart]);

  // ============ LOAD WISHLIST FROM LOCALSTORAGE ============
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // ============ SAVE WISHLIST TO LOCALSTORAGE ============
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ============ FILTER PRODUCTS ============
  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, priceRange, sortBy, products]);

  // ============ SHOW NOTIFICATION ============
  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // ============ ADD TO CART WITH API ============
  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    
    // Check if user is logged in
    if (!token) {
      showNotificationMessage('Please login to add items to cart', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    // If product has flavors and no flavor is selected, use the first flavor as default
    let flavorToUse = selectedFlavor;
    if (product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      flavorToUse = product.flavors[0];
    }
    
    try {
      const response = await axios.post(`${API_URL}/cart/add`, {
        productId: product._id,
        quantity: quantity,
        selectedFlavor: flavorToUse
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCart(response.data.cart.items);
        showNotificationMessage(`✅ ${product.name} added to cart!`);
        setProductDetails(false);
        setQuantity(1);
        setSelectedFlavor(''); // Reset flavor selection
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Handle token expiration
      if (error.response?.status === 401) {
        showNotificationMessage('Session expired. Please login again', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showNotificationMessage(error.response?.data?.message || 'Failed to add to cart', 'error');
      }
    }
  };

  // ============ REMOVE FROM CART WITH API ============
  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCart(response.data.cart.items);
        showNotificationMessage('🗑️ Item removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showNotificationMessage('Failed to remove item', 'error');
    }
  };

  // ============ UPDATE CART QUANTITY WITH API ============
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/cart/update/${productId}`, {
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCart(response.data.cart.items);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotificationMessage(error.response?.data?.message || 'Failed to update quantity', 'error');
    }
  };

  // ============ ADD TO WISHLIST ============
  const addToWishlist = (product) => {
    if (!wishlist.find(item => item._id === product._id)) {
      setWishlist([...wishlist, product]);
      showNotificationMessage(`❤️ ${product.name} added to wishlist!`);
    }
  };

  // ============ REMOVE FROM WISHLIST ============
  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item._id !== productId));
    showNotificationMessage('❤️ Removed from wishlist');
  };

  // ============ LOAD RAZORPAY SCRIPT ============
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ============ DOWNLOAD INVOICE ============
  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showNotificationMessage('✅ Invoice downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      showNotificationMessage('Failed to download invoice', 'error');
    }
  };

  // ============ HANDLE RAZORPAY PAYMENT ============
  const handleRazorpayPayment = async () => {
    try {
      setPaymentLoading(true);
      setError('');

      if (!checkoutInfo.address || !checkoutInfo.city || !checkoutInfo.zipCode) {
        setError('Please fill in all shipping details');
        setPaymentLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in');
        setPaymentLoading(false);
        return;
      }

      // Get Razorpay key
      const keyResponse = await axios.get(`${API_URL}/payments/get-key`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!keyResponse.data.success) {
        throw new Error('Failed to get payment key');
      }

      // ✅ FIX: Convert rupees to paise (multiply by 100)
      // cartTotal is in rupees (e.g. 3299), Razorpay needs paise (e.g. 329900)
      const amountInPaise = cartTotal * 100;

      // Create order on backend — backend receives paise, passes directly to Razorpay
      const orderResponse = await axios.post(`${API_URL}/payments/create-order`, {
        amount: amountInPaise,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setPaymentLoading(false);
        return;
      }

      // Prepare order data for verification
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          selectedFlavor: item.selectedFlavor || '',
        })),
        shippingAddress: {
          fullName: checkoutInfo.fullName || user?.name,
          address: checkoutInfo.address,
          city: checkoutInfo.city,
          zipCode: checkoutInfo.zipCode,
          phone: checkoutInfo.phone || user?.phoneNumber,
        },
        subtotal: cartTotal,
        shippingCost: 0,
        total: cartTotal,
      };

      // Razorpay options
      const options = {
        key: keyResponse.data.key,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency || 'INR',
        name: 'FIT ZONE',
        description: 'Fitness Products Purchase',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&h=150&fit=crop',
        order_id: orderResponse.data.orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(`${API_URL}/payments/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderData,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyResponse.data.success) {
              await fetchOrders();
              setCart([]);
              setShowCheckout(false);
              setCheckoutStep(1);
              setActiveTab('orders');
              showNotificationMessage('🎉 Payment successful! Order placed.', 'success');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showNotificationMessage('Payment verification failed', 'error');
          }
          setPaymentLoading(false);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phoneNumber,
        },
        theme: {
          color: '#ffb74d',
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      showNotificationMessage(error.response?.data?.message || 'Payment failed: ' + error.message, 'error');
      setPaymentLoading(false);
    }
  };

  // ============ CANCEL ORDER WITH API ============
  const cancelOrder = async () => {
    if (!selectedOrder) return;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/orders/${selectedOrder._id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        await fetchOrders();
        setShowCancelModal(false);
        setSelectedOrder(null);
        showNotificationMessage('✅ Order cancelled successfully! Refund initiated.', 'success');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showNotificationMessage(error.response?.data?.message || 'Failed to cancel order', 'error');
    }
  };

  // ============ CLEAR ORDER HISTORY ============
  const clearOrderHistory = () => {
    setOrders([]);
    setOrderHistory([]);
    setShowClearHistoryModal(false);
    showNotificationMessage('🗑️ Order history cleared!', 'success');
  };

  // ============ HANDLE CHECKOUT CHANGE ============
  const handleCheckoutChange = (e) => {
    setCheckoutInfo({ ...checkoutInfo, [e.target.name]: e.target.value });
  };

  // ============ FORMAT INR PRICE ============
  const formatINR = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // ============ CATEGORIES ============
  const categories = [
    { value: 'all', label: 'All Products', icon: '🛍️' },
    { value: 'protein', label: 'Protein', icon: '💪' },
    { value: 'creatine', label: 'Creatine', icon: '⚡' },
    { value: 'preworkout', label: 'Pre-Workout', icon: '🔥' },
    { value: 'accessories', label: 'Accessories', icon: '🧤' },
    { value: 'equipment', label: 'Equipment', icon: '🏋️' },
    { value: 'amino', label: 'BCAA', icon: '💧' }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your fitness store...</p>
      </div>
    );
  }

  return (
    <div className="ecommerce-dashboard">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Pro AI Chatbot */}
      <ProChatbot user={user} />
      
      {/* Animated Background */}
      <div className="dashboard-bg-animation">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="floating-shapes">
          {['💪', '🏋️', '🔥', '⚡', '💧', '🥗'].map((icon, i) => (
            <div key={i} className="shape" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatShape ${15 + i * 2}s infinite ${i * 0.5}s`
            }}>{icon}</div>
          ))}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className={`notification-toast ${notificationType === 'error' ? 'error' : ''}`}>
          {notificationMessage}
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="cancel-modal">
          <div className="cancel-content">
            <h2>Cancel <span>Order</span></h2>
            <p>Are you sure you want to cancel order <strong>{selectedOrder.orderId}</strong>?</p>
            <p>This action cannot be undone and a refund will be initiated.</p>
            <div className="cancel-actions">
              <button className="cancel-close-btn" onClick={() => {
                setShowCancelModal(false);
                setSelectedOrder(null);
              }}>No, Keep Order</button>
              <button className="cancel-confirm-btn" onClick={cancelOrder}>Yes, Cancel Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear History Modal */}
      {showClearHistoryModal && (
        <div className="clear-modal">
          <div className="clear-content">
            <h2>Clear <span>History</span></h2>
            <p>Are you sure you want to clear your entire order history?</p>
            <p>This action cannot be undone and all order records will be permanently deleted.</p>
            <div className="clear-actions">
              <button className="clear-close-btn" onClick={() => setShowClearHistoryModal(false)}>No, Keep History</button>
              <button className="clear-confirm-btn" onClick={clearOrderHistory}>Yes, Clear History</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <div className="dashboard-glass">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <div className="header-greeting">
              <span className="greeting-emoji">👋</span>
              <div>
                <h1>{greeting}, <span className="user-highlight">{user?.name || 'Guest'}</span>!</h1>
                <p className="header-subtitle">Your fitness store & dashboard</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <ThemeToggle />
            <div className="header-stats-mini">
              <div className="mini-stat">
                <span className="mini-icon">🛒</span>
                <div>
                  <span className="mini-value">{cartCount}</span>
                  <span className="mini-label">Cart</span>
                </div>
              </div>
              <div className="mini-stat">
                <span className="mini-icon">📦</span>
                <div>
                  <span className="mini-value">{stats.ordersCount}</span>
                  <span className="mini-label">Orders</span>
                </div>
              </div>
              <div className="mini-stat">
                <span className="mini-icon">💰</span>
                <div>
                  <span className="mini-value">{formatINR(stats.totalSpent)}</span>
                  <span className="mini-label">Spent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          {[
            { key: 'dashboard', icon: '📊', label: 'Dashboard' },
            { key: 'shop', icon: '🛍️', label: 'Shop' },
            { key: 'cart', icon: '🛒', label: 'Cart', badge: cartCount },
            { key: 'orders', icon: '📦', label: 'Orders' },
            { key: 'wishlist', icon: '❤️', label: 'Wishlist' },
            { key: 'profile', icon: '👤', label: 'Profile' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-overview">
              <div className="stats-grid-large">
                <div className="stat-card-large">
                  <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ffb74d20, #ff8a5c20)' }}>
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Spent</span>
                    <span className="stat-value">{formatINR(stats.totalSpent)}</span>
                    <span className="stat-trend">+{stats.ordersCount} orders</span>
                  </div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #4dd0ff20, #00b0ff20)' }}>
                    <span className="stat-icon">📦</span>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Items Bought</span>
                    <span className="stat-value">{stats.itemsBought}</span>
                    <span className="stat-trend">{stats.ordersCount} orders</span>
                  </div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #b473ff20, #9c4dff20)' }}>
                    <span className="stat-icon">🔥</span>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Current Streak</span>
                    <span className="stat-value">{Math.floor(Math.random() * 10) + 5} days</span>
                    <span className="stat-trend">Keep going!</span>
                  </div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ff6b6b20, #ff525220)' }}>
                    <span className="stat-icon">⭐</span>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">{stats.memberSince}</span>
                    <span className="stat-trend">FIT CREW</span>
                  </div>
                </div>
              </div>

              <div className="recent-orders-section">
                <h3>Recent Orders</h3>
                <div className="recent-orders-grid">
                  {orders.slice(0, 3).map(order => (
                    <div key={order._id} className="recent-order-card">
                      <div className="order-header">
                        <span className="order-id">{order.orderId}</span>
                        <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                      </div>
                      <div className="order-items-preview">
                        {order.items.slice(0, 2).map(item => (
                          <div key={item._id} className="order-item-preview">
                            <img src={item.product?.image || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=30&h=30&fit=crop'} alt={item.name} />
                            <span>{item.name.substring(0, 15)}...</span>
                          </div>
                        ))}
                        {order.items.length > 2 && <span className="more-items">+{order.items.length - 2} more</span>}
                      </div>
                      <div className="order-footer">
                        <span className="order-total">{formatINR(order.total)}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => setActiveTab('shop')}><span className="action-icon">🛍️</span>Continue Shopping</button>
                  <button className="action-btn" onClick={() => setActiveTab('cart')}><span className="action-icon">🛒</span>View Cart ({cartCount})</button>
                  <button className="action-btn" onClick={() => setActiveTab('wishlist')}><span className="action-icon">❤️</span>Wishlist ({wishlist.length})</button>
                  <button className="action-btn" onClick={() => setActiveTab('orders')}><span className="action-icon">📦</span>All Orders</button>
                </div>
              </div>
            </div>
          )}

          {/* SHOP TAB */}
          {activeTab === 'shop' && !productDetails && (
            <div className="shop-section">
              <div className="shop-header">
                <h2>GYM <span>SUPPLEMENTS</span> & <span>GEAR</span></h2>
                <p>Premium products for your fitness journey</p>
              </div>
              <div className="shop-filters">
                <div className="filter-group">
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                </div>
                <div className="filter-group">
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.filter(c => c.value !== 'all').map(c => (
                      <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
              <div className="products-grid-large">
                {filteredProducts.length === 0 ? (
                  <div className="no-products"><p>No products found</p></div>
                ) : (
                  filteredProducts.map((product, index) => (
                    <div key={product._id} className="product-card-large" ref={el => productRefs.current[index] = el}>
                      <div className="product-badges">
                        {product.badge && <span className={`product-badge ${product.badge.toLowerCase()}`}>{product.badge}</span>}
                        {product.originalPrice && <span className="product-badge discount">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>}
                      </div>
                      <div className="product-image-wrapper">
                        <img src={product.image} alt={product.name} />
                        <div className="product-actions">
                          <button className="quick-view-btn" onClick={() => { setSelectedProduct(product); setProductDetails(true); }}>👁️ Quick View</button>
                          <button className="wishlist-btn" onClick={() => addToWishlist(product)}>❤️</button>
                        </div>
                      </div>
                      <div className="product-info-large">
                        <span className="product-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <div className="product-rating-large">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(product.rating) ? 'star-filled' : ''}>★</span>
                            ))}
                          </div>
                          <span className="reviews">({product.reviews})</span>
                        </div>
                        <div className="product-price-large">
                          <span className="current">{formatINR(product.price)}</span>
                          {product.originalPrice && <span className="original">{formatINR(product.originalPrice)}</span>}
                        </div>
                        <div className="product-stock">
                          {product.stock > 20 ? <span className="in-stock">✓ In Stock ({product.stock})</span>
                            : product.stock > 0 ? <span className="low-stock">⚠️ Only {product.stock} left</span>
                            : <span className="out-stock">❌ Out of Stock</span>}
                        </div>
                        <button 
                          className="add-to-cart-large" 
                          onClick={() => { 
                            setSelectedProduct(product); 
                            setQuantity(1); 
                            addToCart(product); 
                          }}
                          disabled={product.stock === 0}
                          style={product.stock === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button 
                          className={`compare-btn ${compareProducts.find(p => p._id === product._id) ? 'active' : ''}`}
                          onClick={() => {
                            if (compareProducts.find(p => p._id === product._id)) {
                              setCompareProducts(compareProducts.filter(p => p._id !== product._id));
                              showNotificationMessage('Removed from comparison', 'success');
                            } else if (compareProducts.length >= 4) {
                              showNotificationMessage('Maximum 4 products can be compared', 'error');
                            } else {
                              setCompareProducts([...compareProducts, product]);
                              showNotificationMessage('Added to comparison', 'success');
                            }
                          }}
                        >
                          {compareProducts.find(p => p._id === product._id) ? '✓ In Comparison' : '🔄 Compare'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PRODUCT DETAILS MODAL */}
          {activeTab === 'shop' && productDetails && selectedProduct && (
            <div className="product-details-modal">
              <button className="close-details" onClick={() => setProductDetails(false)}>✕</button>
              <div className="details-grid">
                <div className="details-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="details-info">
                  <span className="details-category">{selectedProduct.category}</span>
                  <h2>{selectedProduct.name}</h2>
                  <div className="details-rating">
                    <div className="stars-large">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(selectedProduct.rating) ? 'star-filled' : ''}>★</span>
                      ))}
                    </div>
                    <span className="reviews-count">{selectedProduct.reviews} reviews</span>
                  </div>
                  <div className="details-price">
                    <span className="details-current">{formatINR(selectedProduct.price)}</span>
                    {selectedProduct.originalPrice && <span className="details-original">{formatINR(selectedProduct.originalPrice)}</span>}
                  </div>
                  <p className="details-description">{selectedProduct.description}</p>
                  {selectedProduct.nutrition && (
                    <div className="nutrition-facts">
                      <h4>Nutrition Facts</h4>
                      <div className="nutrition-grid">
                        {Object.entries(selectedProduct.nutrition).map(([key, value]) => (
                          <div key={key} className="nutrition-item">
                            <span className="nutrition-label">{key}:</span>
                            <span className="nutrition-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProduct.flavors && (
                    <div className="flavor-selection">
                      <h4>Select Flavor</h4>
                      <div className="flavor-options">
                        {selectedProduct.flavors.map(flavor => (
                          <button key={flavor} className={`flavor-btn ${selectedFlavor === flavor ? 'active' : ''}`} onClick={() => setSelectedFlavor(flavor)}>{flavor}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="quantity-selection">
                    <h4>Quantity</h4>
                    <div className="quantity-controls">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="details-actions">
                    <button className="add-to-cart-details" onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
                    <button className="wishlist-details" onClick={() => addToWishlist(selectedProduct)}>❤️ Wishlist</button>
                  </div>
                  
                  {/* Product Reviews Section */}
                  <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <ProductReviews 
                      productId={selectedProduct._id}
                      reviews={selectedProduct.reviews || []}
                      onAddReview={(review) => {
                        console.log('Review submitted:', review);
                        showNotificationMessage('Thank you for your review!', 'success');
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CART TAB */}
          {activeTab === 'cart' && (
            <div className="cart-section">
              <h2>Your Shopping Cart</h2>
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span className="empty-cart-icon">🛒</span>
                  <h3>Your cart is empty</h3>
                  <p>Start adding some fitness gear!</p>
                  <button className="shop-now-btn" onClick={() => setActiveTab('shop')}>Shop Now</button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item._id} className="cart-item">
                        <img src={item.product?.image} alt={item.product?.name} className="cart-item-image" />
                        <div className="cart-item-info">
                          <h4>{item.product?.name}</h4>
                          <p className="cart-item-category">{item.product?.category}</p>
                          {item.selectedFlavor && <p className="cart-item-flavor">Flavor: {item.selectedFlavor}</p>}
                        </div>
                        <div className="cart-item-price">{formatINR(item.price)}</div>
                        <div className="cart-item-quantity">
                          <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                        </div>
                        <div className="cart-item-total">{formatINR(item.price * item.quantity)}</div>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.product._id)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-summary">
                    {/* Coupon Input */}
                    <CouponInput 
                      total={cartTotal}
                      onApplyCoupon={(discount, code) => {
                        setCouponDiscount(discount);
                        setAppliedCoupon(code);
                        showNotificationMessage(`Coupon "${code}" applied! You saved ₹${discount}`, 'success');
                      }}
                    />
                    
                    <div className="summary-details">
                      <div className="summary-row"><span>Subtotal ({cartCount} items)</span><span>{formatINR(cartTotal)}</span></div>
                      {couponDiscount > 0 && (
                        <div className="summary-row discount"><span>Discount ({appliedCoupon})</span><span>-{formatINR(couponDiscount)}</span></div>
                      )}
                      <div className="summary-row"><span>Shipping</span><span>FREE</span></div>
                      <div className="summary-row total"><span>Total</span><span>{formatINR(cartTotal - couponDiscount)}</span></div>
                    </div>
                    <button className="checkout-btn" onClick={() => setShowCheckout(true)} disabled={cart.length === 0}>
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CHECKOUT MODAL */}
          {showCheckout && (
            <div className="checkout-modal">
              <div className="checkout-content">
                <button className="close-checkout" onClick={() => setShowCheckout(false)}>✕</button>
                <h2>Checkout</h2>
                <div className="checkout-steps">
                  {['Shipping', 'Payment', 'Review'].map((label, i) => (
                    <div key={label} className={`step ${checkoutStep >= i + 1 ? 'active' : ''}`}>
                      <span className="step-number">{i + 1}</span>
                      <span className="step-label">{label}</span>
                    </div>
                  ))}
                </div>

                {checkoutStep === 1 && (
                  <div className="checkout-form">
                    <h3>Shipping Information</h3>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="fullName" value={checkoutInfo.fullName || user?.name || ''} onChange={handleCheckoutChange} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={checkoutInfo.email || user?.email || ''} onChange={handleCheckoutChange} placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" value={checkoutInfo.phone || user?.phoneNumber || ''} onChange={handleCheckoutChange} placeholder="9876543210" />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input type="text" name="address" value={checkoutInfo.address} onChange={handleCheckoutChange} placeholder="123 Fitness St" required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input type="text" name="city" value={checkoutInfo.city} onChange={handleCheckoutChange} placeholder="New York" required />
                      </div>
                      <div className="form-group">
                        <label>ZIP Code</label>
                        <input type="text" name="zipCode" value={checkoutInfo.zipCode} onChange={handleCheckoutChange} placeholder="10001" required />
                      </div>
                    </div>
                    <button className="next-step-btn" onClick={() => setCheckoutStep(2)}>Continue to Payment</button>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="checkout-form">
                    <h3>Payment Method</h3>
                    <div className="payment-method-card selected">
                      <div className="payment-method-header">
                        <input type="radio" name="paymentMethod" checked={true} readOnly />
                        <span className="payment-method-name">Razorpay</span>
                        <span className="payment-method-badge">SECURE & FAST</span>
                      </div>
                      <div className="payment-method-icons">
                        <span className="payment-icon">💳</span>
                        <span className="payment-icon">📱</span>
                        <span className="payment-icon">🏦</span>
                        <span className="payment-icon">📲</span>
                      </div>
                      <p className="payment-method-description">Pay via UPI, Credit/Debit Card, NetBanking, Wallet, EMI, or QR Code</p>
                      <div className="payment-partners">
                        <span>✅ Google Pay</span>
                        <span>✅ PhonePe</span>
                        <span>✅ Paytm</span>
                        <span>✅ BHIM</span>
                      </div>
                    </div>
                    <div className="payment-actions">
                      <button className="back-step-btn" onClick={() => setCheckoutStep(1)}>Back</button>
                      <button className="next-step-btn" onClick={() => setCheckoutStep(3)}>Review Order</button>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="review-order">
                    <h3>Review Your Order</h3>
                    <div className="review-items">
                      {cart.map(item => (
                        <div key={item._id} className="review-item">
                          <img src={item.product?.image} alt={item.product?.name} />
                          <div className="review-item-info">
                            <h4>{item.product?.name}</h4>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <span className="review-item-price">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="review-total">
                      <div className="review-row"><span>Subtotal ({cartCount} items)</span><span>{formatINR(cartTotal)}</span></div>
                      <div className="review-row"><span>Shipping</span><span>FREE</span></div>
                      <div className="review-row total"><span>Total</span><span>{formatINR(cartTotal)}</span></div>
                    </div>
                    <div className="secure-payment-note">
                      <span className="secure-icon">🔒</span>
                      <span>Your payment is secure and encrypted with Razorpay</span>
                    </div>
                    <div className="payment-actions">
                      <button className="back-step-btn" onClick={() => setCheckoutStep(2)}>Back</button>
                      <button className="place-order-btn" onClick={handleRazorpayPayment} disabled={paymentLoading}>
                        {paymentLoading ? <><span className="spinner"></span>PROCESSING...</> : `PAY ${formatINR(cartTotal)}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="orders-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Your Orders</h2>
                {orders.length > 0 && (
                  <button className="clear-history-btn" onClick={() => setShowClearHistoryModal(true)}>🗑️ Clear History</button>
                )}
              </div>
              {orders.length === 0 ? (
                <div className="no-orders">
                  <span className="no-orders-icon">📦</span>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here!</p>
                  <button className="shop-now-btn" onClick={() => setActiveTab('shop')}>Shop Now</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header-large">
                        <div className="order-info">
                          <span className="order-tracking">{order.orderId}</span>
                          <span className="order-date-large">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`order-status-large ${order.status.toLowerCase()}`}>{order.status}</span>
                      </div>
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item._id} className="order-item">
                            <img src={item.product?.image || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=60&h=60&fit=crop'} alt={item.name} />
                            <div className="order-item-details">
                              <h4>{item.name}</h4>
                              <p>Qty: {item.quantity} × {formatINR(item.price)}</p>
                            </div>
                            <span className="order-item-total">{formatINR(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer-large">
                        <span className="order-total-large">Total: {formatINR(order.total)}</span>
                        <div className="order-actions">
                          <button className="invoice-btn" onClick={() => downloadInvoice(order._id)}>📄 Invoice</button>
                          <button className="track-order-btn" onClick={() => {
                            setTrackingOrder(order);
                            setShowOrderTracking(true);
                          }}>Track Order</button>
                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <button className="cancel-order-large-btn" onClick={() => { setSelectedOrder(order); setShowCancelModal(true); }}>
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <h2>Your Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                  <span className="empty-wishlist-icon">❤️</span>
                  <h3>Your wishlist is empty</h3>
                  <p>Save items you love here!</p>
                  <button className="shop-now-btn" onClick={() => setActiveTab('shop')}>Browse Products</button>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlist.map(product => (
                    <div key={product._id} className="wishlist-card">
                      <img src={product.image} alt={product.name} />
                      <button className="remove-wishlist" onClick={() => removeFromWishlist(product._id)}>✕</button>
                      <div className="wishlist-info">
                        <h4>{product.name}</h4>
                        <p className="wishlist-price">{formatINR(product.price)}</p>
                        <button className="add-to-cart-wishlist" onClick={() => { setSelectedProduct(product); addToCart(product); }}>Add to Cart</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Your Profile</h2>
              <div className="profile-card-large">
                <div className="profile-avatar-large">
                  <span className="avatar-emoji">💪</span>
                </div>
                <div className="profile-details">
                  <h3>{user?.name || 'Guest'}</h3>
                  <p className="profile-email">{user?.email || 'guest@example.com'}</p>
                  <p className="profile-phone">{user?.phoneNumber || 'Not provided'}</p>
                  <p className="profile-member">Member since: {stats.memberSince}</p>
                </div>
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="profile-stat-value">{stats.ordersCount}</span>
                    <span className="profile-stat-label">Orders</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{stats.itemsBought}</span>
                    <span className="profile-stat-label">Items</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{formatINR(stats.totalSpent)}</span>
                    <span className="profile-stat-label">Spent</span>
                  </div>
                </div>
                <button className="logout-btn-profile" onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('currentUser');
                  localStorage.removeItem('wishlist');
                  navigate('/login');
                }}>Logout</button>
              </div>
            </div>
          )}

        </div>
        
        {/* Order Tracking Modal */}
        {showOrderTracking && trackingOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }} onClick={() => setShowOrderTracking(false)}>
            <div style={{
              background: 'rgba(18, 22, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 183, 77, 0.2)',
              borderRadius: '30px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowOrderTracking(false)} style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 107, 107, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#ff6b6b',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>✕</button>
              <OrderTracking order={trackingOrder} />
            </div>
          </div>
        )}
        
        {/* Floating Compare View Button */}
        {compareProducts.length > 0 && !showCompareModal && (
          <button 
            className="floating-compare-btn"
            onClick={() => setShowCompareModal(true)}
          >
            <span>🔍</span>
            View Comparison
            <span className="compare-count">{compareProducts.length}</span>
          </button>
        )}
        
        {/* Product Comparison Modal */}
        {showCompareModal && compareProducts.length > 0 && (
          <ProductComparison 
            products={compareProducts}
            onClose={() => {
              setShowCompareModal(false);
              setCompareProducts([]);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;