import React from 'react';
import './Review.css';
import Rating from '../Rating/Rating';

const Review = ({ reviews = [] }) => {

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
    <div className='review'>
      <div className="container">
        <h4 className='d-flex justify-content-center opacity-75'>Bài đánh giá của khách hàng</h4> 
        <button className='btn btn-primary opacity-75'>Viết đánh giá</button>
        <hr></hr>
        {
          reviews.map((item, i) => (
            <div key={i} className='review-item'>
              <p className='infor-review'>{maskEmail(item.username)} - {convertToYMD(item.createdAt)}</p> 
              <div className='review-body'>
                <Rating rating={item.rating}/>
                <i className='opacity-75'><p>{item.comment}</p></i>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Review;
