import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import "./Register.css";
import { API_URL } from './config';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroPermission, setGyroPermission] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Refs for animation
  const supplementRefs = useRef([]);
  const animationFrameRef = useRef(null);
  const mousePosition = useRef({ x: -1000, y: -1000 });
  const velocities = useRef([]);
  const positions = useRef([]);
  const lastTimestamp = useRef(0);
  
  // Gyroscope data
  const gyroData = useRef({ beta: 0, gamma: 0, alpha: 0 });

  // Supplement items data (reduced for better performance)
  const supplementItems = [
    { type: 'protein', name: 'WHEY PROTEIN', icon: ProteinIcon, color: '#ffb74d' },
    { type: 'protein', name: 'ISO PROTEIN', icon: ProteinIcon, color: '#ffb74d' },
    { type: 'shaker', name: 'SHAKER BOTTLE', icon: ShakerIcon, color: '#4dd0ff' },
    { type: 'creatine', name: 'CREATINE', icon: CreatineIcon, color: '#b473ff' },
    { type: 'preworkout', name: 'PRE-WORKOUT', icon: PreWorkoutIcon, color: '#ff6b6b' },
    { type: 'protein', name: 'CASEIN', icon: ProteinIcon, color: '#ffb74d' },
    { type: 'shaker', name: 'PROTEIN SHAKER', icon: ShakerIcon, color: '#4dd0ff' },
    { type: 'creatine', name: 'MONOHYDRATE', icon: CreatineIcon, color: '#b473ff' },
    { type: 'preworkout', name: 'ENERGY BOOST', icon: PreWorkoutIcon, color: '#ff6b6b' },
  ];

  // ============ GYROSCOPE SETUP ============
  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const requestGyroPermission = async () => {
          try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
              window.addEventListener('deviceorientation', handleGyroscope);
              setGyroPermission(true);
              setGyroActive(true);
            }
          } catch (error) {
            console.log('Gyroscope permission denied:', error);
          }
        };
        
        const gyroButton = document.createElement('div');
        gyroButton.className = 'gyro-status';
        gyroButton.innerHTML = '🔄 Click to enable Gyroscope';
        gyroButton.onclick = requestGyroPermission;
        document.body.appendChild(gyroButton);
        
        return () => {
          window.removeEventListener('deviceorientation', handleGyroscope);
          gyroButton.remove();
        };
      } else {
        window.addEventListener('deviceorientation', handleGyroscope);
        setGyroPermission(true);
        setGyroActive(true);
        
        return () => {
          window.removeEventListener('deviceorientation', handleGyroscope);
        };
      }
    }
  }, []);

  // Handle gyroscope data
  const handleGyroscope = (event) => {
    gyroData.current = {
      beta: event.beta || 0,
      gamma: event.gamma || 0,
      alpha: event.alpha || 0
    };
  };

  // Initialize velocities and positions
  useEffect(() => {
    velocities.current = supplementItems.map(() => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6
    }));
    
    positions.current = supplementItems.map(() => ({
      x: Math.random() * (window.innerWidth - 150),
      y: Math.random() * (window.innerHeight - 150)
    }));

    setTimeout(() => {
      supplementRefs.current.forEach((ref, i) => {
        if (ref && positions.current[i]) {
          ref.style.left = `${positions.current[i].x}px`;
          ref.style.top = `${positions.current[i].y}px`;
        }
      });
    }, 100);

    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // ============ MAIN ANIMATION LOOP ============
  const animate = (timestamp) => {
    if (!lastTimestamp.current) {
      lastTimestamp.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = Math.min(16, timestamp - lastTimestamp.current);
    lastTimestamp.current = timestamp;

    supplementRefs.current.forEach((ref, index) => {
      if (!ref || !positions.current[index]) return;

      const pos = positions.current[index];
      const vel = velocities.current[index];
      
      if (!pos || !vel) return;

      if (gyroPermission && gyroActive) {
        const gammaForce = (gyroData.current.gamma / 45) * 1.5;
        const betaForce = (gyroData.current.beta / 45) * 1.5;
        
        vel.x += gammaForce;
        vel.y += betaForce;
        
        ref.classList.add('gyro-active');
        
        if (index === 0) {
          updateGyroStatus(gammaForce, betaForce);
        }
      } else {
        ref.classList.remove('gyro-active');
      }

      const gyroMagnitude = Math.abs(gyroData.current.gamma) + Math.abs(gyroData.current.beta);
      if (!gyroPermission || gyroMagnitude < 5) {
        vel.x += (Math.random() - 0.5) * 0.4;
        vel.y += (Math.random() - 0.5) * 0.4;
      }

      const dx = pos.x + 50 - mousePosition.current.x;
      const dy = pos.y + 50 - mousePosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 220) {
        const force = (220 - distance) / 220 * 2.8;
        const angle = Math.atan2(dy, dx);
        vel.x += Math.cos(angle) * force;
        vel.y += Math.sin(angle) * force;
        
        if (distance < 150) {
          ref.classList.add('fleeing');
        } else {
          ref.classList.remove('fleeing');
        }
      } else {
        ref.classList.remove('fleeing');
      }

      vel.x *= 0.985;
      vel.y *= 0.985;
      
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      const maxSpeed = gyroPermission ? 14 : 10;
      if (speed > maxSpeed) {
        vel.x = (vel.x / speed) * maxSpeed;
        vel.y = (vel.y / speed) * maxSpeed;
      }
      
      pos.x += vel.x * (deltaTime / 16);
      pos.y += vel.y * (deltaTime / 16);
      
      const itemWidth = 100;
      const itemHeight = 100;
      
      if (pos.x < 0) {
        pos.x = 0;
        vel.x *= -0.6;
      }
      if (pos.x > window.innerWidth - itemWidth) {
        pos.x = window.innerWidth - itemWidth;
        vel.x *= -0.6;
      }
      if (pos.y < 0) {
        pos.y = 0;
        vel.y *= -0.6;
      }
      if (pos.y > window.innerHeight - itemHeight) {
        pos.y = window.innerHeight - itemHeight;
        vel.y *= -0.6;
      }
      
      ref.style.left = `${pos.x}px`;
      ref.style.top = `${pos.y}px`;
      ref.style.transform = `rotate(${vel.x * 3}deg)`;
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const updateGyroStatus = (gammaForce, betaForce) => {
    let statusEl = document.querySelector('.gyro-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'gyro-status';
      document.body.appendChild(statusEl);
    }
    
    if (gyroPermission) {
      const direction = [];
      if (gammaForce > 0.3) direction.push('➡️ RIGHT');
      if (gammaForce < -0.3) direction.push('⬅️ LEFT');
      if (betaForce > 0.3) direction.push('⬇️ DOWN');
      if (betaForce < -0.3) direction.push('⬆️ UP');
      
      if (direction.length > 0) {
        statusEl.innerHTML = `🔄 GYROSCOPE ACTIVE ${direction.join(' ')}`;
        statusEl.classList.add('active');
      } else {
        statusEl.innerHTML = `🔄 GYROSCOPE ACTIVE - STABLE`;
        statusEl.classList.add('active');
      }
    }
  };

  const handleMouseEnter = (index, e) => {
    const element = e.currentTarget;
    element.classList.add('fleeing');
    
    const vel = velocities.current[index];
    if (vel) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = centerX - mousePosition.current.x;
      const dy = centerY - mousePosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const force = 30;
        vel.x += (dx / distance) * force;
        vel.y += (dy / distance) * force;
      }
    }
  };

  const handleMouseLeave = (index, e) => {
    const element = e.currentTarget;
    element.classList.remove('fleeing');
  };

  // Form handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  // Focus handlers for placeholder animations
  const handleFocus = (e) => {
    const fieldName = e.target.name;
    const inputGroup = e.target.closest('.input-group');
    inputGroup.classList.add('focused');
    
    if (fieldName === 'email') {
      inputGroup.classList.add('email-focused');
    } else if (fieldName === 'password') {
      inputGroup.classList.add('password-focused');
    }
  };

  const handleBlur = (e) => {
    const fieldName = e.target.name;
    const inputGroup = e.target.closest('.input-group');
    inputGroup.classList.remove('focused');
    
    if (fieldName === 'email') {
      inputGroup.classList.remove('email-focused');
    } else if (fieldName === 'password') {
      inputGroup.classList.remove('password-focused');
    }
  };

  // UPDATE has-value class based on input value - IMMEDIATE
  useEffect(() => {
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
      const inputGroup = input.closest('.input-group');
      if (input.value) {
        inputGroup.classList.add('has-value');
      } else {
        inputGroup.classList.remove('has-value');
      }
    });
  }, [formData]);

  // Check for autofill on mount
  useEffect(() => {
    setTimeout(() => {
      const inputs = document.querySelectorAll('.input-group input');
      inputs.forEach(input => {
        const inputGroup = input.closest('.input-group');
        if (input.value) {
          inputGroup.classList.add('has-value');
        }
      });
    }, 100);
  }, []);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');
    if (token && currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // ============ LOGIN FUNCTION WITH API ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("❌ Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        // Set remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        alert(`✅ WELCOME BACK, ${response.data.user.name}! 💪`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Invalid email or password!");
      } else {
        setError("Server error. Please make sure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* FLOATING SUPPLEMENTS */}
      <div className="supplement-background">
        {supplementItems.map((item, index) => {
          const IconComponent = item.icon;
          
          let boxClass = '';
          if (item.type === 'protein') boxClass = 'protein-box';
          else if (item.type === 'shaker') boxClass = 'shaker-box';
          else if (item.type === 'creatine') boxClass = 'creatine-box';
          else if (item.type === 'preworkout') boxClass = 'preworkout-box';
          
          return (
            <div
              key={index}
              ref={el => supplementRefs.current[index] = el}
              className="supplement-item"
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={(e) => handleMouseLeave(index, e)}
            >
              <div className={boxClass}>
                <IconComponent />
                <span className="protein-label">
                  {item.type === 'protein' ? 'PROTEIN' : 
                   item.type === 'shaker' ? 'SHAKER' : 
                   item.type === 'creatine' ? 'CREATINE' : 'PRE'}
                </span>
              </div>
              <span className="supplement-label">{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* LOGIN FORM */}
      <form className="register-form login-form" onSubmit={handleSubmit}>
        <h2>
          <span>FIT</span> ZONE
        </h2>
        <p className="form-subtitle">WELCOME BACK</p>

        {error && <div className="error-message">{error}</div>}

        {/* EMAIL FIELD */}
        <div className="input-group">
          <span className="input-icon">📧</span>
          <input
            type="email"
            name="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <span className="placeholder-label">Email Address</span>
        </div>

        {/* PASSWORD FIELD */}
        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            name="password"
            placeholder=""
            value={formData.password}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <span className="placeholder-label">Password</span>
        </div>

        {/* REMEMBER ME & FORGOT PASSWORD */}
        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMe}
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="forgot-password" onClick={(e) => {
            e.preventDefault();
            alert("Please contact support@fitzone.com to reset your password.");
          }}>Forgot Password?</a>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>

        <div className="signup-link-container">
          <div className="signup-link">
            Not a member? <Link to="/register">Join the crew</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

// ============ SVG ICONS ============
function ProteinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="45" height="45" fill="currentColor">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <circle cx="12" cy="13" r="3" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <path d="M8 4L16 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ShakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
      <rect x="8" y="4" width="8" height="16" rx="2" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <circle cx="12" cy="20" r="2" stroke="currentColor" fill="none"/>
      <path d="M10 4L14 4L15 2L9 2L10 4Z" stroke="currentColor" fill="none"/>
    </svg>
  );
}

function CreatineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
      <ellipse cx="12" cy="12" rx="6" ry="8" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="4" ry="6" stroke="currentColor" fill="none"/>
      <path d="M12 4L12 2M12 22L12 20" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function PreWorkoutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
      <path d="M6 8L12 4L18 8L18 16L12 20L6 16L6 8Z" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor" fill="none"/>
    </svg>
  );
}

export default Login;