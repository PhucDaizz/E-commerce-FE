import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom';
const Item = (props) => {
  function formatCurrency(amount) { 
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  }

  return (
    <div className='item m-5'>
      <Link to={`/product/${props.id}`}>
        <img src={props.image} alt={props.name} className='item-image'/>
      </Link>
        <p className='item-name'>{props.name}</p>
        <p className='item-price'>{formatCurrency(props.price)}</p>
    </div>
  )
}

export default Item
