// WriteReview.js
import React, { useState } from 'react';
import './WriteReview.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../Context/AuthContext';
import { useProduct } from '../../Context/ProductContext';

const WriteReview = ({ productId, onNewReview, onClose }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { loggedIn, user } = useAuth();
    const { postReview } = useProduct();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!loggedIn) {
            setErrorMessage('Bạn cần đăng nhập để gửi đánh giá.');
            return;
        }

        if (rating === 0) {
            setErrorMessage('Vui lòng chọn số sao đánh giá.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(''); // Clear previous errors
        
        try {
            const response = await postReview(productId, review, rating);
            
            if (response && response.success) {
                // Create new review object
                const newReview = {
                    username: user?.username || user?.email || "Bạn",
                    comment: review,
                    rating: rating,
                    createdAt: new Date().toISOString()
                };
                
                onNewReview(newReview);
                setReview('');
                setRating(0);
                setHoverRating(0);
                onClose();
            }
        } catch (error) {
            if (error.response) {
                // Handle 500 error with specific message
                if (error.response.status === 500) {
                    setErrorMessage(
                        error.response.data.message === "You can't review this product because you haven't bought it yet" 
                        ? 'Bạn cần mua sản phẩm này trước khi đánh giá' 
                        : 'Bạn đã đánh giá sản phẩm này rồi'
                    );
                } else {
                    // Handle other error statuses
                    setErrorMessage(error.response.data.message || 'Đánh giá phải ít nhất 10 ký tự');
                }
            } else {
                // Handle network errors or other exceptions
                setErrorMessage('Lỗi kết nối, vui lòng thử lại sau');
            }
            console.error('Lỗi khi gửi đánh giá:', error);
        } finally {
            setIsSubmitting(false);
        }
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
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary flex-grow-1 flex-md-grow-0 px-4" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary flex-grow-1 flex-md-grow-0 px-4 ms-0" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Đang gửi...
                                </>
                            ) : 'Gửi Đánh Giá'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WriteReview;