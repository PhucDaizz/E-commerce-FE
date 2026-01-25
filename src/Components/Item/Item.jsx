import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag } from 'lucide-react';

const Item = (props) => {
  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  }

  return (
    <div className='item-card'>
      <div className='image-wrapper'>
        <Link to={`/product/${props.id}`}>
          <div className="image-container">
            <img src={props.image} alt={props.name} className='item-image primary-image' />
            {props.hoverImage && (
              <img src={props.hoverImage} alt={`${props.name} hover`} className='item-image hover-image' />
            )}
          </div>
        </Link>

        <div className="item-actions">
          <button className="action-btn" aria-label="Add to wishlist">
            <Heart size={18} />
          </button>
          <button className="action-btn" aria-label="Quick view">
            <Eye size={18} />
          </button>
          <button className="action-btn main-action" aria-label="Add to cart">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      <div className="item-info">
        <Link to={`/product/${props.id}`} className="item-link">
          <p className='item-name'>{props.name}</p>
        </Link>
        <div className="item-footer">
          <span className='item-price'>{formatCurrency(props.price)}</span>
          <div className="item-tags">
            <span className="tag">New</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
