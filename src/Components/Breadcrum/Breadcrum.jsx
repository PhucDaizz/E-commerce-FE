import React from 'react'
import './Breadcrum.css'
import { Link } from 'react-router-dom'
const Breadcrum = (props) => {

    return (
        <div className='breadcrum container mobile-breadcrum'>
            <Link to='/'>TRANG CHỦ</Link> / <span className="category-name">{props.categoryname}</span> / <span className="product-name">{props.productName}</span>
        </div>
    )
}

export default Breadcrum
