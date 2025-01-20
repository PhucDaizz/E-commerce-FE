import React, { useEffect, useState } from 'react'
import './CartItem.css'
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const CartItem = () => {
    const [totalCost, setTotalCost] = useState(0);
    const {cart, getCart, handleUpdateItemCart, handleRemoveItem} = useAuth();
    const navigate  = useNavigate();

    useEffect(() => {
        getCart();
    },[]);

    useEffect(() => {
        let cost = 0;
        cart.forEach(item => {
            cost += item.productDTO.price * item.quantity;
        });
        setTotalCost(cost);
    }, [cart]);

    const handleCheckout = () => {
        if (totalCost === 0) {
            toast.error('Giỏ hàng của bạn đang trống');
        }
        else {
            navigate('/checkout')
        }
    }

    function formatCurrency(amount) {
        if (!amount || isNaN(amount)) return '0đ';
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
      }

    
    return (
        <div className='cart-item'>
            <div className='container mt-5 border rounded shadow'>
                <h3 className='text-center mb-4'>Giỏ hàng</h3>
                <div className='border rounded'>
                    <div className='row bg-light text-dark fw-bold'>
                        <div className='col-1'></div>
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
                            <img className='col-1' src={`https://localhost:7295/Resources/${item.productDTO.images[0].imageURL}`}></img>
                            
                            <p className='col-5 d-flex align-content-center'>
                                <Link to={`/product/${item.productID}`}
                                    className='text-decoration-none text-black'>
                                    {item.productDTO.productName}
                                </Link>
                            </p>
                            <p className='col'>
                                <button onClick={() => handleUpdateItemCart(
                                    item.cartItemID, 
                                    item.productID, 
                                    item.quantity - 1, 
                                    item.productSizeID
                                )}>-</button>
                                {item.quantity}
                                <button onClick={() => handleUpdateItemCart(
                                    item.cartItemID, 
                                    item.productID, 
                                    item.quantity + 1, 
                                    item.productSizeID
                                )}>+</button>
                            </p>
                            <p className='col'>{formatCurrency(item.productDTO.price)}</p>
                            <p className='col'>
                                <button onClick={() => handleRemoveItem(item.cartItemID, item.productID, item.productSizeID)} className='btn btn-danger btn-sm'>Xóa</button>
                            </p>
                        </div>
                    )))}
                </div>
                <div className='total-cost row'>
                    <div className="col font-weight-bold">Thông tin đơn hàng</div>
                </div>
                <div>
                    <div>
                        <p>Tổng tiền: {formatCurrency(totalCost)}</p> 
                        <button onClick={handleCheckout} className='btn btn-danger'>Thanh Toán</button>
                        <ToastContainer/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem
