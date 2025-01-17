import React from 'react'
import './Rating.css'

const Rating = ({ rating }) => { 
    return ( 
        <div className="rating-stars"> {
            [...Array(5)].map((_, index) => ( 
                <span 
                    key={index} 
                    className={`star ${index < (rating === 0 ? 5 : Math.round(rating)) ? 'filled' : 'empty'}`} 
                > ★ 
                </span> 
                ))} 
        </div> 
    ); 
}

export default Rating;


