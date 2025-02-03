import React, { useState } from 'react';
import './WriteReview.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo bạn đã cài đặt Bootstrap
import { useAuth } from '../../Context/AuthContext';

const WriteReview = () => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0); // Trạng thái cho sao hover
    const [errorMessage, setErrorMessage] = useState('');
    const {loggedIn} = useAuth();
 
    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi đánh giá ở đây

        if (!loggedIn) {
            setErrorMessage('Bạn cần đăng nhập để gửi đánh giá.'); // Hiển thị thông báo lỗi
            return;
        }

        console.log('Đánh giá:', review);
        console.log('Đánh giá sao:', rating);
        // Reset form
        setReview('');
        setRating(0);
        setHoverRating(0);
        setErrorMessage('');
    };

    return (
        <div className='write-review mb-5'>
            <div className='container mt-5 p-5 border shadow mb-3'>
                <h4 className='text-center mb-4 opacity-75'>Viết Đánh Giá Của Bạn</h4>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Đánh giá sao:</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star} 
                                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`} 
                                    onMouseEnter={() => setHoverRating(star)} 
                                    onMouseLeave={() => setHoverRating(0)} 
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="review" className="form-label">Nội dung đánh giá:</label>
                        <textarea 
                            id="review" 
                            className="form-control" 
                            rows="4" 
                            value={review} 
                            onChange={(e) => setReview(e.target.value)} 
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary opacity-75">Gửi Đánh Giá</button>
                </form>
            </div>
        </div>
    );
}

export default WriteReview;