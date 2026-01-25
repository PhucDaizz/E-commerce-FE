import React from 'react';
import { Star } from 'lucide-react';
import './Rating.css';

const Rating = ({ rating }) => {
    const displayRating = rating === 0 ? 5 : Math.round(rating);

    return (
        <div className="modern-rating-display">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={14}
                    className={`rating-star-icon ${index < displayRating ? 'filled' : 'empty'}`}
                    fill={index < displayRating ? "currentColor" : "none"}
                />
            ))}
        </div>
    );
};

export default Rating;
