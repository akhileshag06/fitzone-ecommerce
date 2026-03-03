import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("");
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
  const formRef = useRef(null);
  
  // Gyroscope data
  const gyroData = useRef({ beta: 0, gamma: 0, alpha: 0 });

  // Supplement items data
  const supplementItems = [
    { type: 'protein', name: 'WHEY PROTEIN', icon: ProteinIcon, color: '#ffb74d' },
    { type: 'protein', name: 'ISO PROTEIN', icon: ProteinIcon, color: '#ffb74d' },
    { type: 'creatine', name: 'CREATINE', icon: CreatineIcon, color: '#b473ff' },
    { type: 'preworkout', name: 'PRE-WORKOUT', icon: PreWorkoutIcon, color: '#ff6b6b' },
    { type: 'protein', name: 'CASEIN', icon: ProteinIcon, color: '#ffb74d' },
    { type: 'shaker', name: 'PROTEIN SHAKER', icon: ShakerIcon, color: '#4dd0ff' },
    { type: 'protein', name: 'MASS GAINER', icon: ProteinIcon, color: '#ffb74d' },
    { type: 'shaker', name: 'INSULATED', icon: ShakerIcon, color: '#4dd0ff' },
    { type: 'creatine', name: 'MONOHYDRATE', icon: CreatineIcon, color: '#b473ff' },
    { type: 'preworkout', name: 'ENERGY BOOST', icon: PreWorkoutIcon, color: '#ff6b6b' },
  ];

  // API base URL
  const API_URL = 'http://localhost:8080/api';

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

  // Focus handlers for placeholder animations
  const handleFocus = (e) => {
    const fieldName = e.target.name;
    const inputGroup = e.target.closest('.input-group');
    inputGroup.classList.add('focused');
    
    if (fieldName === 'name') {
      inputGroup.classList.add('name-focused');
    } else if (fieldName === 'email') {
      inputGroup.classList.add('email-focused');
    } else if (fieldName === 'password') {
      inputGroup.classList.add('password-focused');
    } else if (fieldName === 'confirmPassword') {
      inputGroup.classList.add('confirm-focused');
    } else if (fieldName === 'phoneNumber') {
      inputGroup.classList.add('phone-focused');
    }
  };

  const handleBlur = (e) => {
    const fieldName = e.target.name;
    const inputGroup = e.target.closest('.input-group');
    inputGroup.classList.remove('focused');
    
    if (fieldName === 'name') {
      inputGroup.classList.remove('name-focused');
    } else if (fieldName === 'email') {
      inputGroup.classList.remove('email-focused');
    } else if (fieldName === 'password') {
      inputGroup.classList.remove('password-focused');
    } else if (fieldName === 'confirmPassword') {
      inputGroup.classList.remove('confirm-focused');
    } else if (fieldName === 'phoneNumber') {
      inputGroup.classList.remove('phone-focused');
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

  useEffect(() => {
    const password = formData.password;
    if (!password) {
      setPasswordStrength(0);
      setStrengthText("");
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    setPasswordStrength(strength);
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong 💪"];
    setStrengthText(strengthLabels[strength] || "");
  }, [formData.password]);

  // ============ REGISTER FUNCTION WITH API ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("❌ Passwords don't match!");
      return;
    }
    if (passwordStrength < 2) {
      setError("⚠️ Password too weak! Use at least 8 characters, numbers, and uppercase letters.");
      return;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      setError("❌ Please enter a valid 10-digit phone number!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        alert("✅ REGISTRATION SUCCESSFUL! Welcome to the FIT CREW! 💪");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Registration failed. Please try again.");
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

      {/* REGISTRATION FORM */}
      <form className="register-form registration-form" onSubmit={handleSubmit} ref={formRef}>
        <h2>
          Register To <br></br><span>FIT ZONE</span>
        </h2>

        {error && <div className="error-message">{error}</div>}

        {/* NAME FIELD */}
        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            name="name"
            placeholder=""
            value={formData.name}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <span className="placeholder-label">Full Name</span>
        </div>

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

        {/* PHONE NUMBER FIELD */}
        <div className="input-group">
          <span className="input-icon">📱</span>
          <input
            type="tel"
            name="phoneNumber"
            placeholder=""
            value={formData.phoneNumber}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength="10"
            pattern="[0-9]{10}"
            required
          />
          <span className="placeholder-label">Phone Number</span>
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

        {/* PASSWORD STRENGTH INDICATOR */}
        {formData.password && (
          <div className="password-strength-container">
            <div className="password-strength">
              <div className="strength-bars">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`strength-bar ${passwordStrength >= level ? 'active' : ''}`}
                  />
                ))}
              </div>
              <span className="strength-text">{strengthText}</span>
            </div>
          </div>
        )}

        {/* CONFIRM PASSWORD FIELD */}
        <div className="input-group">
          <span className="input-icon">✓</span>
          <input
            type="password"
            name="confirmPassword"
            placeholder=""
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <span className="placeholder-label">Confirm Password</span>
        </div>

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'REGISTERING...' : 'JOIN THE CREW'}
        </button>

        {/* LOGIN LINK */}
        <div className="login-link-container">
          <div className="login-link">
            Already pumped? <Link to="/login">Login here</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

// SVG ICONS
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

export default Register;