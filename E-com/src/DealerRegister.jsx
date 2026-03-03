import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function DealerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    companyName: '',
    territory: '',
    registrationKey: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Don't send any auth headers for registration
      const res = await axios.post(`${API_URL}/dealer/register`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 50%, #1a1e2a, #0c0f14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(18,22,30,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(76,175,80,0.4)',
          borderRadius: '40px',
          padding: '50px 40px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '15px' }}>
            Registration <span style={{ color: '#4CAF50' }}>Successful!</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
            Your dealer account has been created successfully. Please wait for admin approval to access your dashboard.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '30px' }}>
            You will receive access once the admin reviews and approves your application.
          </p>
          <button
            onClick={() => navigate('/dealer')}
            style={{
              padding: '14px 30px',
              background: 'linear-gradient(135deg, #4dd0ff, #00b0ff)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, #1a1e2a, #0c0f14)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '20px'
    }}>
      <div style={{ position: 'fixed', top: '-20vh', right: '-20vw', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(77,208,255,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'sphereFloat 20s infinite' }} />
      
      <style>{`
        @keyframes sphereFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(5%,5%) scale(1.1)} 66%{transform:translate(-5%,-5%) scale(0.9)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{
        background: 'rgba(18,22,30,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(77,208,255,0.4)',
        borderRadius: '40px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 30px 70px rgba(0,0,0,0.9)',
        animation: 'slideUp 0.6s ease',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '56px' }}>🤝</span>
        </div>

        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '28px', fontWeight: 800, marginBottom: '5px' }}>
          Become a <span style={{ color: '#4dd0ff' }}>Dealer</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '30px' }}>
          Register your business with FIT ZONE
        </p>

        {error && (
          <div style={{ background: 'rgba(255,107,107,0.2)', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '12px 20px', borderRadius: '15px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Registration Key *</label>
            <input
              type="text"
              name="registrationKey"
              value={formData.registrationKey}
              onChange={handleChange}
              required
              placeholder="Enter dealer registration key"
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(10,12,18,0.8)', border: '1px solid rgba(255,183,77,0.3)', borderRadius: '15px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
            <p style={{ color: 'rgba(255,183,77,0.7)', fontSize: '11px', marginTop: '5px' }}>
              🔑 Contact admin to get your registration key
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(10,12,18,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(10,12,18,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(10,12,18,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(10,12,18,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(10,12,18,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Territory/Region</label>
            <input
              type="text"
              name="territory"
              value={formData.territory}
              onChange={handleChange}
              required
              placeholder="e.g., North India, Mumbai, etc."
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(10,12,18,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #4dd0ff, #00b0ff)',
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '15px'
            }}
          >
            {loading ? '⏳ Registering...' : '🚀 Register as Dealer'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/dealer')}
              style={{
                background: 'none',
                border: 'none',
                color: '#4dd0ff',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Already registered? Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
