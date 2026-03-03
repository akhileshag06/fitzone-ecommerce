import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImagePicker from './components/ImagePicker';
import LiveChatPanel from './components/LiveChatPanel';
import DealerRegister from './DealerRegister';

import { API_URL } from './config';

// ============ DEALER LOGIN PAGE ============
function DealerLogin({ onLogin, onShowRegister }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/dealer/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem('dealerToken', res.data.token);
        localStorage.setItem('dealerUser', JSON.stringify(res.data.user));
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
      <div style={{ position: 'fixed', top: '-20vh', right: '-20vw', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(77,208,255,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'sphereFloat 20s infinite' }} />
      <div style={{ position: 'fixed', bottom: '-20vh', left: '-20vw', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(180,115,255,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'sphereFloat 25s infinite reverse' }} />

      <style>{`
        @keyframes sphereFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(5%,5%) scale(1.1)} 66%{transform:translate(-5%,-5%) scale(0.9)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{
        background: 'rgba(18,22,30,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(77,208,255,0.4)',
        borderRadius: '40px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 30px 70px rgba(0,0,0,0.9)',
        animation: 'slideUp 0.6s ease',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '56px' }}>🤝</span>
        </div>

        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '32px', fontWeight: 800, letterSpacing: '3px', marginBottom: '5px' }}>
          FIT <span style={{ color: '#4dd0ff' }}>ZONE</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', letterSpacing: '4px', fontSize: '12px', marginBottom: '35px', textTransform: 'uppercase' }}>
          Dealer Portal
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
              placeholder="Dealer Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '18px 20px 18px 52px', background: 'rgba(10,12,18,0.8)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#4dd0ff'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', zIndex: 2 }}>🔒</span>
            <input
              type="password"
              placeholder="Dealer Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '18px 20px 18px 52px', background: 'rgba(10,12,18,0.8)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#4dd0ff'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4dd0ff, #00b0ff)', border: 'none', borderRadius: '50px', color: 'white', fontSize: '16px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 8px 0 #0077b3', transition: 'all 0.3s' }}
            onMouseOver={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.letterSpacing = '4px'; }}
            onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.letterSpacing = '3px'; }}
          >
            {loading ? '⏳ Logging in...' : '🔐 Enter Dealer Panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '25px' }}>
          Authorized dealers only
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            onClick={() => onShowRegister()}
            style={{
              background: 'none',
              border: 'none',
              color: '#4dd0ff',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            New dealer? Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DealerPanel() {
  const [dealer, setDealer] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('dealerToken');
    const stored = localStorage.getItem('dealerUser');
    if (!token || !stored) {
      // Not logged in
    } else {
      setDealer(JSON.parse(stored));
    }
  }, []);

  if (showRegister) {
    return <DealerRegister />;
  }

  if (!dealer) {
    return <DealerLogin onLogin={setDealer} onShowRegister={() => setShowRegister(true)} />;
  }

  return <DealerDashboard dealer={dealer} />;
}


// ============ DEALER DASHBOARD ============
function DealerDashboard({ dealer }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Notification system state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'protein',
    image: '', rating: '4.5', reviews: '100', stock: '50'
  });

  const token = localStorage.getItem('dealerToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, customersRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/dealer/stats`, { headers }),
        axios.get(`${API_URL}/dealer/products`, { headers }),
        axios.get(`${API_URL}/dealer/customers`, { headers }),
        axios.get(`${API_URL}/dealer/orders`, { headers }),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (productsRes.data.success) setProducts(productsRes.data.products);
      if (customersRes.data.success) setCustomers(customersRes.data.customers);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
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
      await axios.put(`${API_URL}/notifications/${id}/read`, {}, { headers });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`, {}, { headers });
      fetchNotifications();
      showNotif('✅ All notifications marked as read');
    } catch (err) {
      showNotif('Failed to mark all as read', 'error');
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || undefined,
        rating: Number(productForm.rating),
        reviews: Number(productForm.reviews),
        stock: Number(productForm.stock)
      };
      await axios.post(`${API_URL}/dealer/products`, data, { headers });
      showNotif('✅ Product submitted for approval!');
      setShowProductModal(false);
      fetchAll();
    } catch (err) {
      showNotif(err.response?.data?.message || 'Failed to add product', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('dealerToken');
    localStorage.removeItem('dealerUser');
    window.location.reload();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle,#1a1e2a,#0c0f14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle,#1a1e2a,#0c0f14)', padding: '20px', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeOut { from{opacity:1} to{opacity:0} }
      `}</style>

      {notification.show && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', padding: '14px 24px', borderRadius: '50px',
          background: notification.type === 'error' ? 'linear-gradient(135deg,#ff6b6b,#ff5252)' : 'linear-gradient(135deg,#4CAF50,#45a049)',
          color: 'white', zIndex: 99999, animation: 'slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s'
        }}>
          {notification.message}
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', background: 'rgba(18,22,30,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(77,208,255,0.2)', borderRadius: '40px', padding: '30px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: 0 }}>
              FIT <span style={{ color: '#4dd0ff' }}>ZONE</span> <span style={{ background: 'linear-gradient(135deg,#4dd0ff,#00b0ff)', color: 'white', padding: '4px 14px', borderRadius: '30px', fontSize: '11px', letterSpacing: '1px' }}>DEALER</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '5px' }}>
              👋 Welcome, <strong style={{ color: '#4dd0ff' }}>{dealer?.name}</strong> | {dealer?.dealerInfo?.companyName}
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
                  background: 'rgba(77,208,255,0.1)',
                  border: '1px solid rgba(77,208,255,0.3)',
                  color: '#4dd0ff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(77,208,255,0.2)'}
                onMouseOut={e => e.target.style.background = 'rgba(77,208,255,0.1)'}
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
                    border: '2px solid #0a0c10'
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
                  border: '1px solid rgba(77,208,255,0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  zIndex: 9999,
                  overflow: 'hidden'
                }}>
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
                            background: notif.isRead ? 'transparent' : 'rgba(77,208,255,0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseOut={e => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(77,208,255,0.05)'}
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
                                background: '#4dd0ff'
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

            <button onClick={logout} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,107,107,0.5)', borderRadius: '30px', color: '#ff6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '60px' }}>
          {[
            { key: 'dashboard', icon: '📊', label: 'Dashboard' },
            { key: 'products', icon: '📦', label: 'My Products' },
            { key: 'customers', icon: '👥', label: 'Customers' },
            { key: 'orders', icon: '🛒', label: 'Orders' },
            { key: 'livechat', icon: '💬', label: 'Live Chat' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, minWidth: '110px', padding: '12px 15px', background: activeTab === t.key ? 'rgba(77,208,255,0.15)' : 'transparent',
                border: 'none', borderRadius: '40px', color: activeTab === t.key ? '#4dd0ff' : 'rgba(255,255,255,0.6)',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px', marginBottom: '30px' }}>
              {[
                { icon: '📦', label: 'My Products', value: stats.totalProducts, sub: `${stats.approvedProducts} approved`, bg: 'rgba(77,208,255,0.15)' },
                { icon: '⏳', label: 'Pending Approval', value: stats.pendingProducts, sub: 'Awaiting admin', bg: 'rgba(255,183,77,0.15)' },
                { icon: '👥', label: 'My Customers', value: stats.totalCustomers, sub: 'Assigned to me', bg: 'rgba(180,115,255,0.15)' },
                { icon: '🛒', label: 'Total Orders', value: stats.totalOrders, sub: formatINR(stats.totalRevenue), bg: 'rgba(76,175,80,0.15)' },
                { icon: '💰', label: 'Commission', value: formatINR(stats.commission), sub: `${dealer?.dealerInfo?.commission}% rate`, bg: 'rgba(255,107,107,0.15)' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '30px', padding: '20px' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{s.icon}</div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block' }}>{s.label}</span>
                    <span style={{ color: 'white', fontSize: '26px', fontWeight: 700, display: 'block' }}>{s.value}</span>
                    <span style={{ color: '#4dd0ff', fontSize: '11px' }}>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ color: 'white', fontSize: '22px' }}>My Products</h2>
              <button onClick={() => setShowProductModal(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#4dd0ff,#00b0ff)', border: 'none', borderRadius: '30px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                ➕ Add Product
              </button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'rgba(77,208,255,0.1)' }}>
                  <tr>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>PRODUCT</th>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>PRICE</th>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>STOCK</th>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>{p.name}</td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>{formatINR(p.price)}</td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>{p.stock}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                          background: p.isApproved ? 'rgba(76,175,80,0.15)' : 'rgba(255,183,77,0.15)',
                          color: p.isApproved ? '#4CAF50' : '#ffb74d'
                        }}>
                          {p.isApproved ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '20px' }}>My Customers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '15px' }}>
              {customers.map(c => (
                <div key={c._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '18px' }}>
                  <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>{c.name}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '5px 0' }}>📧 {c.email}</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '5px 0' }}>📞 {c.phoneNumber}</p>
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#4dd0ff', fontSize: '12px' }}>🛒 {c.orderCount} orders | 💰 {formatINR(c.totalSpent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '20px' }}>Customer Orders</h2>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'rgba(77,208,255,0.1)' }}>
                  <tr>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>ORDER ID</th>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>CUSTOMER</th>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>TOTAL</th>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>STATUS</th>
                    <th style={{ padding: '14px', color: '#4dd0ff', fontSize: '12px', textAlign: 'left' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>{o.orderId}</td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>{o.user?.name}</td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>{formatINR(o.total)}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(77,208,255,0.15)', color: '#4dd0ff' }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Chat Tab */}
        {activeTab === 'livechat' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '20px' }}>💬 Live Chat Support</h2>
            <LiveChatPanel token={token} userRole="dealer" userName={dealer?.name} userId={dealer?._id} />
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <div style={{ background: 'rgba(18,22,30,0.99)', border: '1px solid rgba(77,208,255,0.3)', borderRadius: '35px', padding: '35px', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: 'white', marginBottom: '25px' }}>➕ Add <span style={{ color: '#4dd0ff' }}>Product</span></h2>
            <form onSubmit={handleProductSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>PRODUCT NAME</label>
                <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>DESCRIPTION</label>
                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', minHeight: '80px', fontFamily: 'Inter,sans-serif' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>PRICE (₹)</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>STOCK</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>PRODUCT IMAGE</label>
                <ImagePicker 
                  currentImage={productForm.image}
                  onSelect={(imageUrl) => setProductForm({ ...productForm, image: imageUrl })}
                  token={token}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(255,107,107,0.5)', borderRadius: '40px', color: '#ff6b6b', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg,#4dd0ff,#00b0ff)', border: 'none', borderRadius: '40px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
