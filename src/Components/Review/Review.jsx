import React, { useState } from 'react';
import './Review.css';
import Rating from '../Rating/Rating';
import WriteReview from '../WriteReview/WriteReview';
import { MessageSquare, PenLine, X, User } from 'lucide-react';

const Review = ({ reviews = [], productId, onNewReview }) => {
  const [isWriting, setIsWriting] = useState(false);

  const toggleWriteReview = () => {
    setIsWriting(!isWriting);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return <User size={20} />;
    return name.charAt(0).toUpperCase();
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="reviews-section-premium">
      <div className="container">
        {/* Header Section */}
        <div className="reviews-header">
          <div className="reviews-title-group">
            <h2>Đánh giá từ khách hàng</h2>
            <div className="reviews-summary">
              {reviews.length > 0 && (
                <>
                  <span className="avg-rating-value">{averageRating}</span>
                  <Rating rating={Math.round(parseFloat(averageRating))} />
                  <span className="dot-separator">•</span>
                </>
              )}
              <span className="reviews-count">{reviews.length} nhận xét</span>
            </div>
          </div>

          <button
            onClick={toggleWriteReview}
            className={`write-review-trigger ${isWriting ? 'active' : ''}`}
          >
            {isWriting ? (
              <>
                <X size={18} />
                <span>Hủy bỏ</span>
              </>
            ) : (
              <>
                <PenLine size={18} />
                <span>Viết đánh giá</span>
              </>
            )}
          </button>
        </div>

        {/* Write Review Component */}
        {isWriting && (
          <div className="write-review-container">
            <WriteReview
              productId={productId}
              onNewReview={onNewReview}
              onClose={() => setIsWriting(false)}
            />
          </div>
        )}

        {/* Review List */}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((item, i) => (
              <div key={i} className="review-card-modern">
                <div className="reviewer-avatar">
                  {getInitials(item.username)}
                </div>
                <div className="review-card-content">
                  <div className="review-meta-top">
                    <h4 className="reviewer-name">{item.username}</h4>
                    <span className="review-date">{formatDate(item.createdAt)}</span>
                  </div>
                  <Rating rating={item.rating} />
                  <p className="review-comment-text">{item.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-reviews-state">
              <MessageSquare size={48} strokeWidth={1} />
              <p>Chưa có đánh giá nào cho sản phẩm này.<br />Hãy là người đầu tiên chia sẻ cảm nhận!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Review;