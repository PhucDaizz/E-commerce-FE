// Review.js
import React, { useEffect, useState } from 'react';
import './Review.css';
import Rating from '../Rating/Rating';
import WriteReview from '../WriteReview/WriteReview';

const Review = ({ reviews = [], productId, onNewReview }) => {
  const [hideReview, setHideReview] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setHideReview(true);
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleHide = () => {
    setHideReview(!hideReview);
  }

  const convertToYMD = (YMD) => { 
    const dateOnly = YMD.split("T")[0]; 
    return dateOnly; 
  }

  // const maskEmail = (email) => { 
  //   const [username, domain] = email.split("@"); 
  //   const maskedUsername = username.slice(0, 2) + "***" + username.slice(-1); 
  //   return maskedUsername + "@" + domain; 
  // }

  return (
    <div className={`review ${isMobile ? 'mobile-review' : ''}`}>
      <div className="container">
        <h4 className={`d-flex justify-content-center opacity-75 ${isMobile ? 'mobile-review-title' : ''}`}>Bài đánh giá của khách hàng</h4> 
        <button onClick={handleHide} className={`btn btn-primary opacity-75 ${isMobile ? 'mobile-review-btn' : ''}`}>
          {hideReview ? 'Viết đánh giá' : 'Đóng'}
        </button>
        <hr></hr>
        <div> 
          {!hideReview && (
            <WriteReview 
              productId={productId} 
              onNewReview={onNewReview}
              onClose={() => setHideReview(true)}
            />
          )}
        </div>
        {reviews.length > 0 ? (
          reviews.map((item, i) => (
            <div key={i} className={`review-item ${isMobile ? 'mobile-review-item' : ''}`}>
              <p className={`infor-review ${isMobile ? 'mobile-info-review' : ''}`}>
                {(item.username)} - {convertToYMD(item.createdAt)}
              </p> 
              <div className='review-body'>
                <Rating rating={item.rating}/>
                <i className='opacity-75'>
                  <p className={isMobile ? 'mobile-review-comment' : ''}>{item.comment}</p>
                </i>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">Chưa có đánh giá nào</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;