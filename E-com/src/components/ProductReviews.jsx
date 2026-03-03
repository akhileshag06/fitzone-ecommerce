import { useState } from 'react';
import { getTimeAgo } from '../utils/helpers';

function ProductReviews({ productId, reviews = [], onAddReview }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReview(newReview);
    setNewReview({ rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 
      : 0
  }));

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          ✍️ Write a Review
        </button>
      </div>

      <div className="reviews-summary">
        <div className="average-rating">
          <div className="rating-number">{averageRating}</div>
          <div className="rating-stars">
            {'⭐'.repeat(Math.floor(averageRating))}
          </div>
          <div className="rating-count">{reviews.length} reviews</div>
        </div>

        <div className="rating-distribution">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="rating-bar">
              <span className="star-label">{star} ⭐</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="count-label">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h4>Write Your Review</h4>
          
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= newReview.rating ? 'active' : ''}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Review Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="Sum up your experience"
              required
            />
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your thoughts about this product..."
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowReviewForm(false)}>Cancel</button>
            <button type="submit">Submit Review</button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <span className="no-reviews-icon">📝</span>
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">{review.userName?.charAt(0) || '👤'}</div>
                  <div>
                    <div className="reviewer-name">{review.userName || 'Anonymous'}</div>
                    <div className="review-date">{getTimeAgo(review.createdAt || new Date())}</div>
                  </div>
                </div>
                <div className="review-rating">
                  {'⭐'.repeat(review.rating)}
                </div>
              </div>
              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>
              {review.helpful && (
                <div className="review-helpful">
                  👍 {review.helpful} people found this helpful
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        .product-reviews {
          margin: 30px 0;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .reviews-header h3 {
          color: white;
          font-size: 24px;
        }

        .write-review-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #ffb74d, #ff8a5c);
          border: none;
          border-radius: 30px;
          color: #0a0c10;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .write-review-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 183, 77, 0.3);
        }

        .reviews-summary {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 40px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .average-rating {
          text-align: center;
        }

        .rating-number {
          font-size: 48px;
          font-weight: 700;
          color: #ffb74d;
          margin-bottom: 10px;
        }

        .rating-stars {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .rating-count {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .rating-distribution {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rating-bar {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .star-label {
          color: rgba(255, 255, 255, 0.7);
          min-width: 50px;
          font-size: 14px;
        }

        .bar-container {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffb74d, #ff8a5c);
          transition: width 0.3s ease;
        }

        .count-label {
          color: rgba(255, 255, 255, 0.6);
          min-width: 30px;
          text-align: right;
          font-size: 14px;
        }

        .review-form {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .review-form h4 {
          color: white;
          margin-bottom: 20px;
        }

        .review-form .form-group {
          margin-bottom: 20px;
        }

        .review-form label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 8px;
        }

        .star-rating-input {
          display: flex;
          gap: 5px;
        }

        .star-rating-input .star {
          font-size: 32px;
          cursor: pointer;
          opacity: 0.3;
          transition: all 0.2s ease;
        }

        .star-rating-input .star.active {
          opacity: 1;
          transform: scale(1.1);
        }

        .star-rating-input .star:hover {
          transform: scale(1.2);
        }

        .review-form input,
        .review-form textarea {
          width: 100%;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          color: white;
          font-size: 14px;
          font-family: inherit;
        }

        .review-form input:focus,
        .review-form textarea:focus {
          outline: none;
          border-color: #ffb74d;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
        }

        .form-actions button {
          padding: 10px 25px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .form-actions button[type="button"] {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .form-actions button[type="submit"] {
          background: linear-gradient(135deg, #ffb74d, #ff8a5c);
          border: none;
          color: #0a0c10;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .no-reviews {
          text-align: center;
          padding: 60px;
          color: rgba(255, 255, 255, 0.5);
        }

        .no-reviews-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 20px;
          opacity: 0.3;
        }

        .review-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 25px;
          transition: all 0.3s ease;
        }

        .review-card:hover {
          border-color: rgba(255, 183, 77, 0.2);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .reviewer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffb74d, #ff8a5c);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #0a0c10;
        }

        .reviewer-name {
          color: white;
          font-weight: 600;
        }

        .review-date {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
        }

        .review-rating {
          font-size: 18px;
        }

        .review-title {
          color: white;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .review-comment {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .review-helpful {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .reviews-summary {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .reviews-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductReviews;
