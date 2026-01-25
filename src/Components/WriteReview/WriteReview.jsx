import React, { useState } from 'react';
import './WriteReview.css';
import { useAuth } from '../../Context/AuthContext';
import { useProduct } from '../../Context/ProductContext';
import { Star, Send, Loader2 } from 'lucide-react';

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
        setErrorMessage('');

        try {
            const response = await postReview(productId, review, rating);

            if (response && response.success) {
                const newReview = {
                    username: user?.username || user?.email || "Bạn",
                    comment: review,
                    rating: rating,
                    createdAt: new Date().toISOString()
                };

                onNewReview(newReview);
                setReview('');
                setRating(0);
                onClose();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    setErrorMessage(
                        error.response.data.message === "You can't review this product because you haven't bought it yet"
                            ? 'Bạn cần mua sản phẩm này trước khi đánh giá'
                            : 'Bạn đã đánh giá sản phẩm này rồi'
                    );
                } else {
                    setErrorMessage(error.response.data.message || 'Đánh giá phải ít nhất 10 ký tự');
                }
            } else {
                setErrorMessage('Lỗi kết nối, vui lòng thử lại sau');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="write-review-form-premium">
            <div className="form-header-premium">
                <h3>Viết đánh giá</h3>
                <p>Chia sẻ trải nghiệm của bạn về sản phẩm này với những người mua khác.</p>
            </div>

            {errorMessage && (
                <div className="review-error-alert">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="rating-input-group">
                    <label>Xếp hạng của bạn</label>
                    <div className="star-input-list">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                size={32}
                            />
                        ))}
                    </div>
                </div>

                <div className="review-textarea-wrapper">
                    <label>Nội dung nhận xét</label>
                    <textarea
                        className="premium-textarea"
                        placeholder="Cảm nhận của bạn về sản phẩm (chất liệu, form dáng, màu sắc...)"
                        rows="5"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </div>

                <div className="form-actions-premium">
                    <button
                        type="button"
                        className="btn-cancel-review"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="btn-submit-review"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Đang gởi...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Gửi đánh giá</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WriteReview;