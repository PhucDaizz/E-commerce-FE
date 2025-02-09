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
        <div className='cart-item mb-5'>
            <div className='container mt-5 border rounded shadow-sm'>
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
                        <div key={item.cartItemID} className="row py-2 align-items-center text-center">
                            <div className="col-1 d-flex justify-content-center">
                                <img className="img-fluid rounded"    
                                    src={`https://localhost:7295/Resources/${item.productDTO.images[0].imageURL}`} 
                                    alt="Product"
                                />
                            </div>
                            <div className="col-5 d-flex align-items-center">
                                <Link to={`/product/${item.productID}`} className="text-decoration-none text-black">
                                    {item.productDTO.productName}
                                </Link>
                            </div>
                            <div className="col d-flex justify-content-center align-items-center">
                                <button className="btn btn-outline-primary me-2"
                                    onClick={() => handleUpdateItemCart(item.cartItemID, item.productID, item.quantity - 1, item.productSizeID)}
                                >-</button>
                                <span className="mx-2">{item.quantity}</span>
                                <button className="btn btn-outline-primary ms-2"
                                    onClick={() => handleUpdateItemCart(item.cartItemID, item.productID, item.quantity + 1, item.productSizeID)}
                                >+</button>
                            </div>
                            <div className="col d-flex justify-content-center">{formatCurrency(item.productDTO.price)}</div>
                            <div className="col d-flex justify-content-center">
                                <button 
                                    onClick={() => handleRemoveItem(item.cartItemID, item.productID, item.productSizeID)} 
                                    className="btn btn-danger btn-sm"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    )))}
                </div>
                <div className='total-cost row'>
                    <div className="col title-info mt-2">Thông tin đơn hàng</div>
                </div>
                <div>
                    <div className=' d-flex justify-content-center align-items-center flex-column'>
                        <p className='mt-4'>Tổng tiền: {formatCurrency(totalCost)}</p> 
                        <button onClick={handleCheckout} className='btn btn-outline-danger center'>Thanh Toán</button>
                        <ToastContainer/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem
