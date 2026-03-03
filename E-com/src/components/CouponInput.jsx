import { useState } from 'react';
import { applyCoupon } from '../utils/helpers';

function CouponInput({ total, onApplyCoupon }) {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApply = () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code');
      setMessageType('error');
      return;
    }

    const result = applyCoupon(couponCode, total);
    
    if (result.success) {
      setMessage(result.message);
      setMessageType('success');
      setAppliedCoupon({ code: couponCode, discount: result.discount });
      onApplyCoupon(result.discount);
    } else {
      setMessage(result.message);
      setMessageType('error');
      setAppliedCoupon(null);
    }
  };

  const handleRemove = () => {
    setCouponCode('');
    setMessage('');
    setMessageType('');
    setAppliedCoupon(null);
    onApplyCoupon(0);
  };

  const availableCoupons = [
    { code: 'FITZONE10', desc: '10% off on orders above ₹1000' },
    { code: 'FITZONE20', desc: '20% off on orders above ₹2000' },
    { code: 'WELCOME50', desc: '₹50 off on orders above ₹500' },
    { code: 'NEWYEAR100', desc: '₹100 off on orders above ₹1500' }
  ];

  return (
    <div className="coupon-section">
      <div className="coupon-input-wrapper">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="coupon-input"
          disabled={appliedCoupon !== null}
        />
        {appliedCoupon ? (
          <button onClick={handleRemove} className="coupon-btn remove">
            Remove
          </button>
        ) : (
          <button onClick={handleApply} className="coupon-btn apply">
            Apply
          </button>
        )}
      </div>

      {message && (
        <div className={`coupon-message ${messageType}`}>
          {messageType === 'success' ? '✅' : '❌'} {message}
        </div>
      )}

      <div className="available-coupons">
        <h4>Available Coupons</h4>
        <div className="coupons-grid">
          {availableCoupons.map(coupon => (
            <div 
              key={coupon.code} 
              className="coupon-card"
              onClick={() => !appliedCoupon && setCouponCode(coupon.code)}
            >
              <div className="coupon-code">🎟️ {coupon.code}</div>
              <div className="coupon-desc">{coupon.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .coupon-section {
          margin: 20px 0;
        }

        .coupon-input-wrapper {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .coupon-input {
          flex: 1;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          color: white;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .coupon-input:focus {
          outline: none;
          border-color: #ffb74d;
        }

        .coupon-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .coupon-btn {
          padding: 12px 25px;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .coupon-btn.apply {
          background: linear-gradient(135deg, #ffb74d, #ff8a5c);
          color: #0a0c10;
        }

        .coupon-btn.apply:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 183, 77, 0.3);
        }

        .coupon-btn.remove {
          background: transparent;
          border: 1px solid #ff6b6b;
          color: #ff6b6b;
        }

        .coupon-btn.remove:hover {
          background: #ff6b6b;
          color: white;
        }

        .coupon-message {
          padding: 10px 15px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .coupon-message.success {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4CAF50;
        }

        .coupon-message.error {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
        }

        .available-coupons h4 {
          color: white;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .coupons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }

        .coupon-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .coupon-card:hover {
          border-color: #ffb74d;
          background: rgba(255, 183, 77, 0.05);
          transform: translateY(-2px);
        }

        .coupon-code {
          color: #ffb74d;
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }

        .coupon-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
        }

        @media (max-width: 768px) {
          .coupons-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default CouponInput;
