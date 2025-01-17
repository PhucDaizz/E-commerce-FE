import React from 'react'
import './Breadcrum.css'
import { Link } from 'react-router-dom'
const Breadcrum = (props) => {

    return (
        <div className='breadcrum container'>
            <Link to='/'>TRANG CHỦ</Link> / {props.categoryname} / {props.productName}
        </div>
    )
}

export default Breadcrum
