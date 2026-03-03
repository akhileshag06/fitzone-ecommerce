import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImagePicker from './components/ImagePicker';
import LiveChatPanel from './components/LiveChatPanel';

const API_URL = 'http://localhost:5000/api';

// ============ ADMIN LOGIN PAGE ============
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        onLogin(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, #1a1e2a, #0c0f14)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Animated background orbs */}
      <div style={{ position: 'fixed', top: '-20vh', right: '-20vw', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(255,183,77,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'sphereFloat 20s infinite' }} />
      <div style={{ position: 'fixed', bottom: '-20vh', left: '-20vw', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(77,208,255,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'sphereFloat 25s infinite reverse' }} />

      <style>{`
        @keyframes sphereFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(5%,5%) scale(1.1)} 66%{transform:translate(-5%,-5%) scale(0.9)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{
        background: 'rgba(18,22,30,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,183,77,0.4)',
        borderRadius: '40px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 30px 70px rgba(0,0,0,0.9)',
        animation: 'slideUp 0.6s ease',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Shield icon */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '56px' }}>🛡️</span>
        </div>

        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '32px', fontWeight: 800, letterSpacing: '3px', marginBottom: '5px' }}>
          FIT <span style={{ color: '#ffb74d' }}>ZONE</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', letterSpacing: '4px', fontSize: '12px', marginBottom: '35px', textTransform: 'uppercase' }}>
          Admin Portal
        </p>

        {error && (
          <div style={{ background: 'rgba(255,107,107,0.2)', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '12px 20px', borderRadius: '50px', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', zIndex: 2 }}>📧</span>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '18px 20px 18px 52px', background: 'rgba(10,12,18,0.8)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#ffb74d'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', zIndex: 2 }}>🔒</span>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '18px 20px 18px 52px', background: 'rgba(10,12,18,0.8)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#ffb74d'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ff8a5c, #ffb74d)', border: 'none', borderRadius: '50px', color: 'white', fontSize: '16px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 8px 0 #b2451e', transition: 'all 0.3s' }}
            onMouseOver={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.letterSpacing = '4px'; }}
            onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.letterSpacing = '3px'; }}
          >
            {loading ? '⏳ Logging in...' : '🔐 Enter Admin Panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '25px' }}>
          Restricted access — Authorized personnel only
        </p>
      </div>
    </div>
  );
}

// ============ MAIN ADMIN DASHBOARD ============
function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // Notification system state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Product form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'protein',
    image: '', rating: '4.5', reviews: '100', badge: 'BESTSELLER', stock: '50',
    flavors: ''
  });

  const styleRef = useRef(null);

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  // Inject styles
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#0a0c10; }
    @keyframes sphereFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(5%,5%) scale(1.1)} 66%{transform:translate(-5%,-5%) scale(0.9)} }
    @keyframes glassReveal { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes fadeOut { from{opacity:1} to{opacity:0} }
    @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.1);opacity:1} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes modalIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
    @keyframes wave { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(20deg)} 75%{transform:rotate(-10deg)} }

    .admin-wrap { min-height:100vh; background:radial-gradient(circle at 50%,#1a1e2a,#0c0f14); padding:20px; position:relative; overflow-x:hidden; }
    .orb1 { position:fixed; top:-20vh; right:-20vw; width:60vw; height:60vw; background:radial-gradient(circle,rgba(255,183,77,0.15) 0%,transparent 70%); border-radius:50%; pointer-events:none; animation:sphereFloat 20s infinite; z-index:0; }
    .orb2 { position:fixed; bottom:-20vh; left:-20vw; width:50vw; height:50vw; background:radial-gradient(circle,rgba(77,208,255,0.1) 0%,transparent 70%); border-radius:50%; pointer-events:none; animation:sphereFloat 25s infinite reverse; z-index:0; }

    .admin-glass { position:relative; z-index:10; background:rgba(18,22,30,0.85); backdrop-filter:blur(20px); border:1px solid rgba(255,183,77,0.2); border-radius:40px; padding:30px; max-width:1400px; margin:0 auto; animation:glassReveal 0.8s ease; }

    .admin-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; flex-wrap:wrap; gap:15px; }
    .admin-header h1 { color:white; font-size:28px; font-weight:800; }
    .admin-header h1 span { color:#ffb74d; }
    .admin-badge { background:linear-gradient(135deg,#ff6b6b,#ff5252); color:white; padding:4px 14px; border-radius:30px; font-size:11px; font-weight:700; letter-spacing:1px; }
    .logout-btn { padding:10px 20px; background:transparent; border:1px solid rgba(255,107,107,0.5); border-radius:30px; color:#ff6b6b; cursor:pointer; font-size:13px; font-weight:600; transition:all 0.3s; }
    .logout-btn:hover { background:#ff6b6b; color:white; }

    .admin-tabs { display:flex; gap:10px; margin-bottom:30px; flex-wrap:wrap; background:rgba(255,255,255,0.02); padding:10px; border-radius:60px; border:1px solid rgba(255,255,255,0.05); }
    .atab { flex:1; min-width:110px; display:flex; align-items:center; justify-content:center; gap:8px; padding:12px 15px; background:transparent; border:none; border-radius:40px; color:rgba(255,255,255,0.6); font-size:14px; font-weight:600; cursor:pointer; transition:all 0.3s; }
    .atab.active { background:rgba(255,183,77,0.15); color:#ffb74d; box-shadow:0 0 30px rgba(255,183,77,0.2); }
    .atab:hover:not(.active) { background:rgba(255,255,255,0.05); color:white; }

    .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; margin-bottom:30px; }
    .stat-card { display:flex; align-items:center; gap:15px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:30px; padding:20px; transition:all 0.3s; }
    .stat-card:hover { transform:translateY(-5px); border-color:rgba(255,183,77,0.3); box-shadow:0 20px 40px rgba(0,0,0,0.3); }
    .stat-icon { width:55px; height:55px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; animation:pulse 2s infinite; }
    .stat-info span:first-child { color:rgba(255,255,255,0.5); font-size:12px; display:block; margin-bottom:4px; }
    .stat-value { color:white; font-size:26px; font-weight:700; display:block; }
    .stat-sub { color:#4dd0ff; font-size:11px; }

    .section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px; }
    .section-header h2 { color:white; font-size:22px; font-weight:700; }
    .add-btn { padding:10px 20px; background:linear-gradient(135deg,#ffb74d,#ff8a5c); border:none; border-radius:30px; color:#0a0c10; font-weight:700; cursor:pointer; transition:all 0.3s; font-size:14px; }
    .add-btn:hover { transform:translateY(-2px); box-shadow:0 10px 25px rgba(255,183,77,0.3); }

    .table-wrap { background:rgba(255,255,255,0.02); border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.05); overflow-x:auto; }
    table { width:100%; border-collapse:collapse; min-width:600px; }
    thead tr { background:rgba(255,183,77,0.1); }
    th { padding:14px 16px; color:#ffb74d; font-size:12px; font-weight:700; text-align:left; letter-spacing:1px; text-transform:uppercase; white-space:nowrap; }
    td { padding:14px 16px; color:rgba(255,255,255,0.8); font-size:14px; border-bottom:1px solid rgba(255,255,255,0.03); }
    tr:hover td { background:rgba(255,255,255,0.02); }
    tr:last-child td { border-bottom:none; }

    .product-img { width:45px; height:45px; object-fit:contain; border-radius:10px; background:rgba(255,255,255,0.05); }
    .badge-pill { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
    .status-processing { background:rgba(255,183,77,0.15); color:#ffb74d; }
    .status-delivered { background:rgba(76,175,80,0.15); color:#4CAF50; }
    .status-shipped { background:rgba(77,208,255,0.15); color:#4dd0ff; }
    .status-cancelled { background:rgba(255,107,107,0.15); color:#ff6b6b; }
    .status-confirmed { background:rgba(180,115,255,0.15); color:#b473ff; }

    .edit-btn { padding:6px 14px; background:rgba(255,183,77,0.1); border:1px solid rgba(255,183,77,0.3); border-radius:20px; color:#ffb74d; cursor:pointer; font-size:12px; font-weight:600; transition:all 0.3s; margin-right:6px; }
    .edit-btn:hover { background:#ffb74d; color:#0a0c10; }
    .del-btn { padding:6px 14px; background:rgba(255,107,107,0.1); border:1px solid rgba(255,107,107,0.3); border-radius:20px; color:#ff6b6b; cursor:pointer; font-size:12px; font-weight:600; transition:all 0.3s; }
    .del-btn:hover { background:#ff6b6b; color:white; }

    .status-select { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:20px; color:white; padding:6px 12px; font-size:12px; cursor:pointer; outline:none; }
    .status-select option { background:#1a1e2a; }

    /* Modal */
    .modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; z-index:99999; }
    .modal-box { background:rgba(18,22,30,0.99); border:1px solid rgba(255,183,77,0.3); border-radius:35px; padding:35px; width:90%; max-width:560px; max-height:90vh; overflow-y:auto; animation:modalIn 0.4s ease; position:relative; }
    .modal-title { color:white; font-size:22px; font-weight:700; margin-bottom:25px; }
    .modal-title span { color:#ffb74d; }
    .modal-close { position:absolute; top:20px; right:20px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; cursor:pointer; font-size:18px; transition:all 0.3s; }
    .modal-close:hover { background:rgba(255,107,107,0.2); border-color:#ff6b6b; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:15px; }
    .form-group { margin-bottom:16px; }
    .form-group label { display:block; color:rgba(255,255,255,0.6); font-size:12px; margin-bottom:6px; text-transform:uppercase; letter-spacing:1px; }
    .form-group input, .form-group select, .form-group textarea { width:100%; padding:12px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:25px; color:white; font-size:14px; outline:none; transition:border-color 0.2s; box-sizing:border-box; font-family:'Inter',sans-serif; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color:#ffb74d; }
    .form-group select option { background:#1a1e2a; }
    .form-group textarea { border-radius:16px; resize:vertical; min-height:80px; }
    .submit-btn { width:100%; padding:14px; background:linear-gradient(135deg,#ffb74d,#ff8a5c); border:none; border-radius:40px; color:#0a0c10; font-weight:700; font-size:15px; cursor:pointer; transition:all 0.3s; margin-top:10px; }
    .submit-btn:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(255,183,77,0.4); }

    .notification { position:fixed; top:20px; right:20px; padding:14px 24px; border-radius:50px; font-weight:600; font-size:14px; z-index:999999; animation:slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s; box-shadow:0 10px 30px rgba(0,0,0,0.4); }
    .notif-success { background:linear-gradient(135deg,#4CAF50,#45a049); color:white; }
    .notif-error { background:linear-gradient(135deg,#ff6b6b,#ff5252); color:white; }

    .user-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#ffb74d,#ff8a5c); display:inline-flex; align-items:center; justify-content:center; font-size:16px; margin-right:10px; }
    .greeting-wave { animation:wave 2s infinite; display:inline-block; transform-origin:70% 70%; }

    .recent-orders-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:15px; }
    .recent-order-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:20px; padding:18px; transition:all 0.3s; }
    .recent-order-card:hover { border-color:rgba(255,183,77,0.3); }

    @media (max-width:768px) {
      .admin-glass { padding:20px; border-radius:25px; }
      .admin-tabs { flex-direction:column; border-radius:20px; }
      .form-row { grid-template-columns:1fr; }
      .admin-header { flex-direction:column; align-items:flex-start; }
    }
  `;

  useEffect(() => {
    const el = document.createElement('style');
    el.innerHTML = css;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => { if (styleRef.current) document.head.removeChild(styleRef.current); };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) setAdmin(JSON.parse(stored));
    fetchAll();
    fetchNotifications();
    
    // Show welcome popup with unread notifications on login
    const hasSeenWelcome = sessionStorage.getItem('adminWelcomeShown');
    if (!hasSeenWelcome) {
      setTimeout(() => {
        setShowWelcomePopup(true);
        sessionStorage.setItem('adminWelcomeShown', 'true');
      }, 1000);
    }
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, usersRes, dealersRes, pendingProductsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers }),
        axios.get(`${API_URL}/admin/products`, { headers }),
        axios.get(`${API_URL}/admin/orders`, { headers }),
        axios.get(`${API_URL}/admin/users`, { headers }),
        axios.get(`${API_URL}/admin/dealers/pending`, { headers }),
        axios.get(`${API_URL}/admin/products/pending`, { headers }),
      ]);
      if (statsRes.data.success) { setStats(statsRes.data.stats); setRecentOrders(statsRes.data.recentOrders); }
      if (productsRes.data.success) setProducts(productsRes.data.products);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (dealersRes.data.success) setDealers(dealersRes.data.dealers);
      if (pendingProductsRes.data.success) setPendingProducts(pendingProductsRes.data.products);
    } catch (err) {
      showNotif('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`, { headers });
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/notifications/${id}/read`, {}, { headers });
      if (res.data.success) {
        fetchNotifications();
      } else {
        showNotif('Failed to mark as read', 'error');
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
      showNotif('Failed to mark as read', 'error');
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const url = `${API_URL}/notifications/read-all`;
      console.log('Calling URL:', url);
      console.log('Headers:', headers);
      
      const res = await axios.put(url, {}, { headers });
      console.log('Response:', res.data);
      
      if (res.data.success) {
        fetchNotifications();
        showNotif('✅ All notifications marked as read');
      } else {
        console.error('Mark all as read failed:', res.data);
        showNotif('Failed to mark all as read', 'error');
      }
    } catch (err) {
      console.error('Mark all as read error:', err.response?.data || err.message);
      console.error('Full error:', err);
      showNotif(`Failed to mark all as read: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`, { headers });
      fetchNotifications();
      showNotif('🗑️ Notification deleted');
    } catch (err) {
      showNotif('Failed to delete notification', 'error');
    }
  };

  const showNotif = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(n => ({ ...n, show: false })), 3000);
  };

  const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', originalPrice: '', category: 'protein', image: `http://localhost:5000/images/whey-protein.png`, rating: '4.5', reviews: '100', badge: 'BESTSELLER', stock: '50', flavors: '' });
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '',
      category: p.category, image: p.image, rating: p.rating, reviews: p.reviews,
      badge: p.badge || '', stock: p.stock, flavors: p.flavors?.join(', ') || ''
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || undefined,
        rating: Number(productForm.rating),
        reviews: Number(productForm.reviews),
        stock: Number(productForm.stock),
        flavors: productForm.flavors ? productForm.flavors.split(',').map(f => f.trim()).filter(Boolean) : []
      };
      if (editingProduct) {
        await axios.put(`${API_URL}/admin/products/${editingProduct._id}`, data, { headers });
        showNotif('✅ Product updated!');
      } else {
        await axios.post(`${API_URL}/admin/products`, data, { headers });
        showNotif('✅ Product added!');
      }
      setShowProductModal(false);
      fetchAll();
    } catch (err) {
      showNotif(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/admin/products/${id}`, { headers });
      showNotif('🗑️ Product deleted!');
      fetchAll();
    } catch { showNotif('Failed to delete', 'error'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/orders/${id}/status`, { status }, { headers });
      showNotif(`✅ Order status → ${status}`);
      fetchAll();
    } catch { showNotif('Failed to update status', 'error'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${id}`, { headers });
      showNotif('🗑️ User deleted!');
      fetchAll();
    } catch { showNotif('Failed to delete user', 'error'); }
  };

  const approveDealer = async (id, commission) => {
    try {
      await axios.put(`${API_URL}/admin/dealers/${id}/approve`, { commission: commission || 5 }, { headers });
      showNotif('✅ Dealer approved!');
      fetchAll();
    } catch { showNotif('Failed to approve dealer', 'error'); }
  };

  const rejectDealer = async (id) => {
    if (!window.confirm('Reject and delete this dealer registration?')) return;
    try {
      await axios.delete(`${API_URL}/admin/dealers/${id}/reject`, { headers });
      showNotif('❌ Dealer rejected!');
      fetchAll();
    } catch { showNotif('Failed to reject dealer', 'error'); }
  };

  const approveProduct = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/products/${id}/approve`, {}, { headers });
      showNotif('✅ Product approved!');
      fetchAll();
    } catch { showNotif('Failed to approve product', 'error'); }
  };

  const rejectProduct = async (id) => {
    if (!window.confirm('Reject and delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/admin/products/${id}/reject`, { headers });
      showNotif('❌ Product rejected!');
      fetchAll();
    } catch { showNotif('Failed to reject product', 'error'); }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.reload();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle,#1a1e2a,#0c0f14)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ width: '60px', height: '60px', border: '4px solid rgba(255,183,77,0.3)', borderTopColor: '#ffb74d', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
      <p>Loading Admin Panel...</p>
    </div>
  );

  return (
    <div className="admin-wrap">
      <div className="orb1" /><div className="orb2" />

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type === 'error' ? 'notif-error' : 'notif-success'}`}>
          {notification.message}
        </div>
      )}

      {/* Welcome Popup with Notifications */}
      {showWelcomePopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          animation: 'modalIn 0.4s ease'
        }}>
          <div style={{
            background: 'rgba(18,22,30,0.98)',
            border: '1px solid rgba(255,183,77,0.3)',
            borderRadius: '35px',
            padding: '40px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowWelcomePopup(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '64px', marginBottom: '15px' }}>👋</div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>
                Welcome back, <span style={{ color: '#ffb74d' }}>{admin?.name}!</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                Here's what needs your attention
              </p>
            </div>

            {/* Notification Summary */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: 'rgba(255,183,77,0.1)',
                  border: '1px solid rgba(255,183,77,0.3)',
                  borderRadius: '20px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffb74d', marginBottom: '5px' }}>
                    {unreadCount}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    Unread Notifications
                  </div>
                </div>
                <div style={{
                  background: 'rgba(77,208,255,0.1)',
                  border: '1px solid rgba(77,208,255,0.3)',
                  borderRadius: '20px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#4dd0ff', marginBottom: '5px' }}>
                    {pendingProducts.length + dealers.length}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    Pending Approvals
                  </div>
                </div>
              </div>

              {/* Recent Unread Notifications */}
              {unreadCount > 0 && (
                <div>
                  <h3 style={{ color: 'white', fontSize: '16px', marginBottom: '15px', fontWeight: 600 }}>
                    🔔 Recent Notifications
                  </h3>
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {notifications.filter(n => !n.isRead).slice(0, 5).map(notif => (
                      <div
                        key={notif._id}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '15px',
                          padding: '15px',
                          marginBottom: '10px'
                        }}
                      >
                        <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '5px' }}>
                          {notif.title}
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px' }}>
                          {notif.message}
                        </p>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unreadCount === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                    All caught up! No new notifications.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowWelcomePopup(false)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg,#ffb74d,#ff8a5c)',
                border: 'none',
                borderRadius: '40px',
                color: '#0a0c10',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🚀 Let's Go!
            </button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowProductModal(false)}>✕</button>
            <h2 className="modal-title">
              {editingProduct ? '✏️ Edit' : '➕ Add'} <span>Product</span>
            </h2>
            <form onSubmit={handleProductSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required placeholder="Whey Protein" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                    {['protein', 'creatine', 'preworkout', 'accessories', 'equipment', 'amino'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required placeholder="Product description..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required placeholder="2999" />
                </div>
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input type="number" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} placeholder="3999" />
                </div>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <ImagePicker 
                  currentImage={productForm.image}
                  onSelect={(imageUrl) => setProductForm({ ...productForm, image: imageUrl })}
                  token={token}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Badge</label>
                  <select value={productForm.badge} onChange={e => setProductForm({ ...productForm, badge: e.target.value })}>
                    <option value="">None</option>
                    {['BESTSELLER', 'HOT', 'SALE', 'TRENDING', 'NEW'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={productForm.rating} onChange={e => setProductForm({ ...productForm, rating: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Reviews Count</label>
                  <input type="number" value={productForm.reviews} onChange={e => setProductForm({ ...productForm, reviews: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Flavors (comma separated)</label>
                <input value={productForm.flavors} onChange={e => setProductForm({ ...productForm, flavors: e.target.value })} placeholder="Chocolate, Vanilla, Strawberry" />
              </div>
              <button type="submit" className="submit-btn">
                {editingProduct ? '💾 Save Changes' : '➕ Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-glass">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>FIT <span>ZONE</span> &nbsp;<span className="admin-badge">ADMIN</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '5px' }}>
              <span className="greeting-wave">👋</span> Welcome back, <strong style={{ color: '#ffb74d' }}>{admin?.name || 'Admin'}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'rgba(255,183,77,0.1)',
                  border: '1px solid rgba(255,183,77,0.3)',
                  color: '#ffb74d',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(255,183,77,0.2)'}
                onMouseOut={e => e.target.style.background = 'rgba(255,183,77,0.1)'}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'linear-gradient(135deg, #ff6b6b, #ff5252)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '2px solid #0a0c10',
                    animation: 'pulse 2s infinite'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotificationDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  width: '380px',
                  maxHeight: '500px',
                  background: 'rgba(18,22,30,0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,183,77,0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  zIndex: 9999,
                  animation: 'slideUp 0.3s ease',
                  overflow: 'hidden'
                }}>
                  {/* Dropdown Header */}
                  <div style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700, margin: 0 }}>
                      🔔 Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4dd0ff',
                          fontSize: '12px',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>No notifications</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          style={{
                            padding: '15px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            background: notif.isRead ? 'transparent' : 'rgba(255,183,77,0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseOut={e => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(255,183,77,0.05)'}
                          onClick={() => !notif.isRead && markNotificationAsRead(notif._id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: 0, flex: 1 }}>
                              {notif.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif._id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,107,107,0.6)',
                                fontSize: '16px',
                                cursor: 'pointer',
                                padding: '0 5px'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                            {notif.message}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                            {!notif.isRead && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#ffb74d'
                              }} />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="logout-btn" onClick={logout}>🚪 Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {[
            { key: 'dashboard', icon: '📊', label: 'Dashboard' },
            { key: 'products', icon: '📦', label: 'Products' },
            { key: 'approvals', icon: '✅', label: 'Approvals' },
            { key: 'orders', icon: '🛒', label: 'Orders' },
            { key: 'users', icon: '👥', label: 'Users' },
            { key: 'dealers', icon: '🤝', label: 'Dealers' },
            { key: 'livechat', icon: '💬', label: 'Live Chat' },
          ].map(t => (
            <button key={t.key} className={`atab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className="stats-grid">
              {[
                { icon: '💰', label: 'Total Revenue', value: formatINR(stats.totalRevenue), sub: `${stats.totalOrders} orders`, bg: 'rgba(255,183,77,0.15)' },
                { icon: '📦', label: 'Total Orders', value: stats.totalOrders, sub: `${stats.ordersByStatus?.Processing || 0} processing`, bg: 'rgba(77,208,255,0.15)' },
                { icon: '🛍️', label: 'Total Products', value: stats.totalProducts, sub: 'In catalog', bg: 'rgba(180,115,255,0.15)' },
                { icon: '👥', label: 'Total Users', value: stats.totalUsers, sub: 'Registered', bg: 'rgba(76,175,80,0.15)' },
              ].map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="stat-info">
                    <span>{s.label}</span>
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-sub">{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Status Summary */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '25px', padding: '25px', marginBottom: '25px' }}>
              <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>📋 Order Status Overview</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
                  <div key={status} style={{ flex: 1, minWidth: '100px', textAlign: 'center', padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffb74d' }}>{count}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>{status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>🕐 Recent Orders</h3>
            <div className="recent-orders-grid">
              {recentOrders.slice(0, 4).map(order => (
                <div className="recent-order-card" key={order._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#ffb74d', fontSize: '12px', fontFamily: 'monospace', fontWeight: 600 }}>{order.orderId}</span>
                    <span className={`badge-pill status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '8px' }}>👤 {order.user?.name || 'User'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span style={{ color: 'white', fontWeight: 700 }}>{formatINR(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="section-header">
              <h2>📦 Products <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>({products.length})</span></h2>
              <button className="add-btn" onClick={openAddProduct}>➕ Add Product</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Badge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td><img src={p.image} alt={p.name} className="product-img" onError={e => e.target.src = 'https://via.placeholder.com/45?text=IMG'} /></td>
                      <td style={{ fontWeight: 600, color: 'white' }}>{p.name}</td>
                      <td><span style={{ color: '#ffb74d', textTransform: 'uppercase', fontSize: '11px' }}>{p.category}</span></td>
                      <td style={{ color: '#4dd0ff' }}>{formatINR(p.price)}</td>
                      <td>
                        <span style={{ color: p.stock > 20 ? '#4CAF50' : p.stock > 0 ? '#ffb74d' : '#ff6b6b' }}>
                          {p.stock > 0 ? `✓ ${p.stock}` : '✗ Out'}
                        </span>
                      </td>
                      <td>{p.badge && <span className={`badge-pill status-${p.badge === 'HOT' ? 'cancelled' : p.badge === 'SALE' ? 'shipped' : 'processing'}`}>{p.badge}</span>}</td>
                      <td>
                        <button className="edit-btn" onClick={() => openEditProduct(p)}>✏️ Edit</button>
                        <button className="del-btn" onClick={() => deleteProduct(p._id)}>🗑️ Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
          <div>
            <div className="section-header">
              <h2>✅ Product Approvals <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>({pendingProducts.length} pending)</span></h2>
            </div>
            
            {pendingProducts.length === 0 ? (
              <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '20px', 
                padding: '60px 20px', 
                textAlign: 'center' 
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '10px' }}>No Pending Products</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>All dealer products have been reviewed</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {pendingProducts.map(product => (
                  <div key={product._id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,183,77,0.2)',
                    borderRadius: '20px',
                    padding: '25px',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '25px',
                    alignItems: 'center'
                  }}>
                    {/* Product Image */}
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '15px',
                      background: 'linear-gradient(145deg, #2d3342, #1f232e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px'
                    }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={e => e.target.src = 'https://via.placeholder.com/120?text=IMG'}
                      />
                    </div>

                    {/* Product Info */}
                    <div>
                      <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                        {product.name}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px', lineHeight: '1.5' }}>
                        {product.description}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>PRICE</span>
                          <span style={{ color: '#4dd0ff', fontSize: '18px', fontWeight: 700 }}>
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(product.price)}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>STOCK</span>
                          <span style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>{product.stock}</span>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>CATEGORY</span>
                          <span style={{ color: '#ffb74d', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
                            {product.category}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>ADDED BY</span>
                          <span style={{ color: 'white', fontSize: '14px' }}>
                            {product.addedBy?.name || 'Unknown'} ({product.addedByRole})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '150px' }}>
                      <button
                        onClick={() => approveProduct(product._id)}
                        style={{
                          padding: '12px 20px',
                          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                          border: 'none',
                          borderRadius: '25px',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                      >
                        <span>✅</span> Approve
                      </button>

                      <button
                        onClick={() => rejectProduct(product._id)}
                        style={{
                          padding: '12px 20px',
                          background: 'rgba(255,107,107,0.1)',
                          border: '1px solid rgba(255,107,107,0.3)',
                          borderRadius: '25px',
                          color: '#ff6b6b',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseOver={e => { e.target.style.background = '#ff6b6b'; e.target.style.color = 'white'; }}
                        onMouseOut={e => { e.target.style.background = 'rgba(255,107,107,0.1)'; e.target.style.color = '#ff6b6b'; }}
                      >
                        <span>❌</span> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <div className="section-header">
              <h2>🛒 All Orders <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>({orders.length})</span></h2>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontFamily: 'monospace', color: '#ffb74d', fontSize: '12px' }}>{o.orderId}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'white' }}>{o.user?.name || 'Unknown'}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{o.user?.email}</div>
                      </td>
                      <td style={{ color: 'rgba(255,255,255,0.6)' }}>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                      <td style={{ color: '#4dd0ff', fontWeight: 700 }}>{formatINR(o.total)}</td>
                      <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="status-select"
                          value={o.status}
                          onChange={e => updateOrderStatus(o._id, e.target.value)}
                        >
                          {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <div className="section-header">
              <h2>👥 All Users <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>({users.length})</span></h2>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="user-avatar">👤</div>
                          <span style={{ color: 'white', fontWeight: 600 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'rgba(255,255,255,0.6)' }}>{u.email}</td>
                      <td style={{ color: 'rgba(255,255,255,0.6)' }}>{u.phoneNumber}</td>
                      <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td><button className="del-btn" onClick={() => deleteUser(u._id)}>🗑️ Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEALERS TAB */}
        {activeTab === 'dealers' && (
          <div>
            <div className="section-header">
              <h2>🤝 Pending Dealer Approvals <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>({dealers.length})</span></h2>
            </div>
            
            {dealers.length === 0 ? (
              <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '20px', 
                padding: '60px 20px', 
                textAlign: 'center' 
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '10px' }}>No Pending Approvals</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>All dealer registrations have been processed</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {dealers.map(dealer => (
                  <div key={dealer._id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,183,77,0.2)',
                    borderRadius: '20px',
                    padding: '25px',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                      {/* Dealer Info */}
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ffb74d, #ff8a5c)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            marginRight: '15px'
                          }}>🤝</div>
                          <div>
                            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                              {dealer.name}
                            </h3>
                            <span style={{ 
                              color: '#ffb74d', 
                              fontSize: '11px', 
                              background: 'rgba(255,183,77,0.1)', 
                              padding: '3px 10px', 
                              borderRadius: '20px',
                              fontWeight: 600
                            }}>
                              {dealer.dealerInfo?.dealerId || 'PENDING'}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '16px' }}>📧</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{dealer.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '16px' }}>📱</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{dealer.phoneNumber || 'N/A'}</span>
                          </div>
                          {dealer.dealerInfo?.companyName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '16px' }}>🏢</span>
                              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{dealer.dealerInfo.companyName}</span>
                            </div>
                          )}
                          {dealer.dealerInfo?.territory && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '16px' }}>📍</span>
                              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{dealer.dealerInfo.territory}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '16px' }}>📅</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                              Registered: {new Date(dealer.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ 
                            display: 'block', 
                            color: 'rgba(255,255,255,0.6)', 
                            fontSize: '11px', 
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}>
                            Commission %
                          </label>
                          <input
                            type="number"
                            id={`commission-${dealer._id}`}
                            defaultValue="5"
                            min="0"
                            max="100"
                            step="0.5"
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '20px',
                              color: 'white',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        
                        <button
                          onClick={() => {
                            const commission = document.getElementById(`commission-${dealer._id}`).value;
                            approveDealer(dealer._id, Number(commission));
                          }}
                          style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                            border: 'none',
                            borderRadius: '25px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                          onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                          onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                        >
                          <span>✅</span> Approve Dealer
                        </button>

                        <button
                          onClick={() => rejectDealer(dealer._id)}
                          style={{
                            padding: '12px 20px',
                            background: 'rgba(255,107,107,0.1)',
                            border: '1px solid rgba(255,107,107,0.3)',
                            borderRadius: '25px',
                            color: '#ff6b6b',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                          onMouseOver={e => { e.target.style.background = '#ff6b6b'; e.target.style.color = 'white'; }}
                          onMouseOut={e => { e.target.style.background = 'rgba(255,107,107,0.1)'; e.target.style.color = '#ff6b6b'; }}
                        >
                          <span>❌</span> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LIVE CHAT TAB */}
        {activeTab === 'livechat' && (
          <div>
            <div className="section-header">
              <h2>💬 Live Chat Support</h2>
            </div>
            <LiveChatPanel token={token} userRole="admin" userName={admin?.name} userId={admin?._id} />
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ROOT COMPONENT ============
export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (token && user) setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  return <AdminDashboard />;
}