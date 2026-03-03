import { useState } from 'react';
import { formatINR } from '../utils/helpers';

function ProductComparison({ products, onClose }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="comparison-modal">
      <div className="comparison-content">
        <button className="close-comparison" onClick={onClose}>✕</button>
        <h2>Product <span>Comparison</span></h2>
        
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {products.map(product => (
                  <th key={product._id}>
                    <img src={product.image} alt={product.name} />
                    <h4>{product.name}</h4>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Price</strong></td>
                {products.map(product => (
                  <td key={product._id} className="price-cell">
                    {formatINR(product.price)}
                    {product.originalPrice && (
                      <span className="original-price">{formatINR(product.originalPrice)}</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Rating</strong></td>
                {products.map(product => (
                  <td key={product._id}>
                    {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Reviews</strong></td>
                {products.map(product => (
                  <td key={product._id}>{product.reviews} reviews</td>
                ))}
              </tr>
              <tr>
                <td><strong>Category</strong></td>
                {products.map(product => (
                  <td key={product._id} className="category-cell">{product.category}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Stock</strong></td>
                {products.map(product => (
                  <td key={product._id} className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                    {product.stock > 0 ? `✓ ${product.stock} available` : '✗ Out of stock'}
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Badge</strong></td>
                {products.map(product => (
                  <td key={product._id}>
                    {product.badge && <span className="badge-pill">{product.badge}</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Flavors</strong></td>
                {products.map(product => (
                  <td key={product._id}>
                    {product.flavors && product.flavors.length > 0 
                      ? product.flavors.join(', ') 
                      : 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .comparison-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .comparison-content {
          background: rgba(18, 22, 30, 0.98);
          border: 1px solid rgba(255, 183, 77, 0.3);
          border-radius: 30px;
          padding: 40px;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .close-comparison {
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

        .close-comparison:hover {
          background: rgba(255, 107, 107, 0.2);
          border-color: #ff6b6b;
        }

        .comparison-content h2 {
          color: white;
          font-size: 28px;
          margin-bottom: 30px;
          text-align: center;
        }

        .comparison-content h2 span {
          color: #ffb74d;
        }

        .comparison-table-wrapper {
          overflow-x: auto;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .comparison-table thead th {
          background: rgba(255, 183, 77, 0.1);
          color: #ffb74d;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .comparison-table thead th img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin: 0 auto 10px;
          display: block;
          border-radius: 15px;
          background: linear-gradient(145deg, #2d3342, #1f232e);
        }

        .comparison-table thead th h4 {
          color: white;
          font-size: 14px;
          margin: 0;
        }

        .comparison-table tbody td {
          padding: 15px;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .comparison-table tbody td:first-child {
          background: rgba(255, 255, 255, 0.02);
          color: white;
          font-weight: 600;
          text-align: left;
        }

        .price-cell {
          color: #ffb74d;
          font-weight: 700;
          font-size: 18px;
        }

        .original-price {
          display: block;
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
          text-decoration: line-through;
          margin-top: 5px;
        }

        .category-cell {
          text-transform: uppercase;
          font-size: 12px;
          color: #4dd0ff;
        }

        .in-stock {
          color: #4CAF50;
        }

        .out-stock {
          color: #ff6b6b;
        }

        .badge-pill {
          background: linear-gradient(135deg, #ffb74d, #ff8a5c);
          color: #0a0c10;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .comparison-content {
            padding: 25px;
          }

          .comparison-table thead th img {
            width: 60px;
            height: 60px;
          }

          .comparison-table thead th h4 {
            font-size: 12px;
          }

          .comparison-table tbody td {
            padding: 10px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductComparison;
