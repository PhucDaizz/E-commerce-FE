import React, { useEffect } from 'react'
import './CartItem.css'
import { useAuth } from '../../Context/AuthContext';

const CartItem = () => {

    const {cart, getCart, updateItemCart} = useAuth();

    useEffect(() => {
        getCart();
    },[]);

    
    return (
        <div className='container mt-5 border rounded shadow'>
            <h3 className='text-center mb-4'>Giỏ hàng</h3>
            <div className='border rounded'>
                <div className='row bg-light text-dark fw-bold'>
                    <div className='col-2'></div>
                    <div className="col-5">Tên sản phẩm</div>
                    <div className="col">Số lượng</div>
                    <div className='col'>Đơn giá</div>
                    <div className="col">Thao tác</div>
                </div>
                {cart.length === 0 ? (
                    <div className='row text-center'>
                        <p className='col-12'>Giỏ hàng trống</p>
                    </div>
                ) : (
                cart.map((item) => (
                    <div key={item.cartItemID} className='row border-bottom py-2'>
                        <img className='col-2' href={`https://localhost:7295/Resources/${item.productDTO.images[0].imageURL}`}></img>
                        <p className='col-5'>{item.productDTO.productName}</p>
                        <p className='col'>
                            <button onClick={() => updateItemCart(
                                item.cartItemID, 
                                item.productID, 
                                item.quantity - 1, 
                                item.productSizeID
                            )}>-</button>
                            {item.quantity}
                            <button onClick={() => updateItemCart(
                                item.cartItemID, 
                                item.productID, 
                                item.quantity + 1, 
                                item.productSizeID
                            )}>+</button>
                        </p>
                        <p className='col'>{item.productDTO.price}</p>
                        <p className='col'>
                            <button onClick={() => updateItemCart(item.cartItemID, item.productID, 0, item.productSizeID)} className='btn btn-danger btn-sm'>Xóa</button>
                        </p>
                    </div>
                )))}
            </div>
        </div>
    )
}

export default CartItem
