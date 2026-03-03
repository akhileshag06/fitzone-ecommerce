// TEST FILE - Use this to see all new features working!
// To use: Import this in App.jsx and add a route to it

import { useState } from 'react';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ThemeToggle from './components/ThemeToggle';
import ProductReviews from './components/ProductReviews';
import ProductComparison from './components/ProductComparison';
import CouponInput from './components/CouponInput';
import OrderTracking from './components/OrderTracking';

function TestEnhancements() {
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [compareProducts, setCompareProducts] = useState([]);

  // Sample data for testing
  const sampleProducts = [
    {
      _id: '1',
      name: 'Whey Protein',
      price: 2999,
      originalPrice: 3999,
      category: 'protein',
      image: 'http://localhost:8080/images/whey-protein.png',
      rating: 4.5,
      reviews: 120,
      stock: 50,
      badge: 'BESTSELLER'
    },
    {
      _id: '2',
      name: 'Creatine Monohydrate',
      price: 1499,
      originalPrice: 1999,
      category: 'creatine',
      image: 'http://localhost:8080/images/creatine.png',
      rating: 4.7,
      reviews: 85,
      stock: 30,
      badge: 'HOT'
    }
  ];

  const sampleOrder = {
    _id: '123',
    orderId: 'ORD-2024-001',
    status: 'Shipped',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { _id: '1', name: 'Whey Protein', quantity: 2, price: 2999 }
    ],
    total: 5998
  };

  const sampleReviews = [
    {
      rating: 5,
      title: 'Excellent Product!',
      comment: 'Best protein powder I have ever used. Highly recommended!',
      userName: 'John Doe',
      createdAt: new Date(),
      helpful: 12
    },
    {
      rating: 4,
      title: 'Good quality',
      comment: 'Nice taste and good results. Will buy again.',
      userName: 'Jane Smith',
      createdAt: new Date(),
      helpful: 8
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, #1a1e2a, #0c0f14)',
      padding: '40px 20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(18, 22, 30, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 183, 77, 0.2)',
        borderRadius: '40px',
        padding: '40px'
      }}>
        
        {/* Header with Theme Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ color: 'white', fontSize: '32px' }}>
            🧪 Test <span style={{ color: '#ffb74d' }}>Enhancements</span>
          </h1>
          <ThemeToggle />
        </div>

        {/* Section 1: Coupon Input */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            🎟️ Coupon System
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '20px' }}>
            Try these codes: FITZONE10, FITZONE20, WELCOME50
          </p>
          <CouponInput 
            total={3000}
            onApplyCoupon={(discount) => {
              setCouponDiscount(discount);
              alert(`Coupon applied! Discount: ₹${discount}`);
            }}
          />
          {couponDiscount > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '15px',
              color: '#4CAF50'
            }}>
              ✅ Discount Applied: ₹{couponDiscount}
            </div>
          )}
        </section>

        {/* Section 2: Product Comparison */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            🔄 Product Comparison
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '20px' }}>
            Click buttons below to add products to comparison
          </p>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            {sampleProducts.map(product => (
              <button
                key={product._id}
                onClick={() => {
                  if (compareProducts.length < 4) {
                    setCompareProducts([...compareProducts, product]);
                  } else {
                    alert('Maximum 4 products can be compared');
                  }
                }}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ffb74d, #ff8a5c)',
                  border: 'none',
                  borderRadius: '25px',
                  color: '#0a0c10',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add {product.name}
              </button>
            ))}
            {compareProducts.length > 0 && (
              <button
                onClick={() => setCompareProducts([])}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid #ff6b6b',
                  borderRadius: '25px',
                  color: '#ff6b6b',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            )}
          </div>
          {compareProducts.length > 0 && (
            <div style={{
              padding: '15px',
              background: 'rgba(77, 208, 255, 0.1)',
              border: '1px solid rgba(77, 208, 255, 0.3)',
              borderRadius: '15px',
              color: '#4dd0ff'
            }}>
              {compareProducts.length} product(s) selected. Comparison modal will open automatically.
            </div>
          )}
        </section>

        {/* Section 3: Order Tracking */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            📦 Order Tracking
          </h2>
          <OrderTracking order={sampleOrder} />
        </section>

        {/* Section 4: Product Reviews */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            ⭐ Product Reviews
          </h2>
          <ProductReviews 
            productId="test-product"
            reviews={sampleReviews}
            onAddReview={(review) => {
              console.log('Review submitted:', review);
              alert(`Review submitted!\nRating: ${review.rating} stars\nTitle: ${review.title}`);
            }}
          />
        </section>

        {/* Instructions */}
        <section style={{
          background: 'rgba(255, 183, 77, 0.1)',
          border: '1px solid rgba(255, 183, 77, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          marginTop: '40px'
        }}>
          <h2 style={{ color: '#ffb74d', marginBottom: '20px' }}>
            ✅ What You Should See:
          </h2>
          <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '2' }}>
            <li>🎟️ <strong>Coupon Input</strong> - Try entering "FITZONE10" and click Apply</li>
            <li>🔄 <strong>Product Comparison</strong> - Click buttons to add products, modal opens automatically</li>
            <li>📦 <strong>Order Tracking</strong> - Visual timeline showing order status</li>
            <li>⭐ <strong>Product Reviews</strong> - Click "Write a Review" to test the form</li>
            <li>🌓 <strong>Theme Toggle</strong> - Sun/moon button in top-right corner</li>
            <li>📱 <strong>PWA Install Prompt</strong> - Orange button at bottom of screen</li>
          </ul>
        </section>

      </div>

      {/* Product Comparison Modal */}
      {compareProducts.length > 0 && (
        <ProductComparison 
          products={compareProducts}
          onClose={() => setCompareProducts([])}
        />
      )}
    </div>
  );
}

export default TestEnhancements;
