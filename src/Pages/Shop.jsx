import React from 'react'
import './CSS/Shop.css'
import Breadcrum from '../Components/Breadcrum/Breadcrum'
import Collections from '../Components/Collections/Collections'

const Shop = () => {
  return (
    
    <div className='shop'>
        <div className='breadcum-category pt-4'>
            <Breadcrum categoryname='DANH MỤC' ></Breadcrum>
        </div>
        <Collections/>
    </div>
   
  )
}

export default Shop