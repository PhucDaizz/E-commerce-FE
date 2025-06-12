import React, { useEffect, useState } from 'react';
import './Review.css';
import Rating from '../Rating/Rating';
import WriteReview from '../WriteReview/WriteReview';

const Review = ({ reviews = [] }) => {
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

  const handleHide = (hideReview) => {
    if(hideReview === true) {
      return setHideReview(false);
    }
    else {
      return setHideReview(true);
    }
  } 


  const convertToYMD = (YMD) => { 
    const dateOnly = YMD.split("T")[0]; 
    return dateOnly; 
  }

  const maskEmail = (email) => { 
    const [username, domain] = email.split("@"); 
    const maskedUsername = username.slice(0, 2) + "***" + username.slice(-1); 
    return maskedUsername + "@" + domain; 
  }

  return (
    <div className={`review ${isMobile ? 'mobile-review' : ''}`}>
      <div className="container">
        <h4 className={`d-flex justify-content-center opacity-75 ${isMobile ? 'mobile-review-title' : ''}`}>Bài đánh giá của khách hàng</h4> 
        <button onClick={() => handleHide(hideReview)} className={`btn btn-primary opacity-75 ${isMobile ? 'mobile-review-btn' : ''}`}>Viết đánh giá</button>
        <hr></hr>
        <div> 
          {
            hideReview? 
              (<div></div>) : 
              (<WriteReview/>)
          }
          
        </div>
        {
          reviews.map((item, i) => (
            <div key={i} className={`review-item ${isMobile ? 'mobile-review-item' : ''}`}>
              <p className={`infor-review ${isMobile ? 'mobile-info-review' : ''}`}>{maskEmail(item.username)} - {convertToYMD(item.createdAt)}</p> 
              <div className='review-body'>
                <Rating rating={item.rating}/>
                <i className='opacity-75'><p className={isMobile ? 'mobile-review-comment' : ''}>{item.comment}</p></i>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Review;
