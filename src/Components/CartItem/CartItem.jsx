import React, { useEffect, useState } from 'react';
import './CartItem.css';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const CartItem = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [totalCost, setTotalCost] = useState(0);
    const { cart, getCart, handleUpdateItemCart, handleRemoveItem } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getCart();
    }, []);

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
        } else {
            navigate('/checkout');
        }
    };

    function formatCurrency(amount) {
        if (!amount || isNaN(amount)) return '0đ';
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
    }

    return (
        <div className="cart-item container mt-5 mb-5" style={{minHeight: '70vh'}}>
            <div className="card shadow-sm p-4">
                <h3 className="text-center mb-4 ">Giỏ hàng của bạn</h3>
                
                {/* Header */}
                <div className="table-responsive">
                    <table className="table text-center align-middle">
                        <thead className="bg-light fw-bold">
                            <tr>
                                <th>Ảnh</th>
                                <th className="text-start">Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-3">
                                        <p className="text-muted">Giỏ hàng trống</p>
                                    </td>
                                </tr>
                            ) : (
                                cart.map(item => (
                                    <tr key={item.cartItemID}>
                                        {/* Ảnh sản phẩm */}
                                        <td>
                                            <img 
                                                src={`${apiUrl}/Resources/${item.productDTO.images[0].imageURL}`} 
                                                alt="Product" 
                                                className="img-fluid rounded"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        {/* Tên sản phẩm */}
                                        <td className="text-start">
                                            <Link to={`/product/${item.productID}`} className="text-decoration-none text-dark ">
                                                {item.productDTO.productName}
                                            </Link>
                                        </td>
                                        {/* Số lượng */}
                                        <td>
                                        <div className="col d-flex justify-content-center align-items-center gap-3">
                                            <button className=" d-flex m-auto justify-content-center align-content-center btn btn-outline-primary px-2"
                                                style={{ minWidth: "30px" }}
                                                onClick={() => handleUpdateItemCart(item.cartItemID, item.productID, item.quantity - 1, item.productSizeID)}
                                            >-</button>
                                            <span className="">{item.quantity}</span>
                                            <button className="d-flex m-auto justify-content-center align-content-center btn btn-outline-primary px-2 "
                                                style={{ minWidth: "30px" }}
                                                onClick={() => handleUpdateItemCart(item.cartItemID, item.productID, item.quantity + 1, item.productSizeID)}
                                            >+</button>
                                        </div>
                                        </td>
                                        {/* Giá tiền */}
                                        <td className="">{formatCurrency(item.productDTO.price)}</td>
                                        {/* Xóa sản phẩm */}
                                        <td>
                                        <div className="col d-flex justify-content-center align-items-center">
                                            <button 
                                                onClick={() => handleRemoveItem(item.cartItemID, item.productID, item.productSizeID)} 
                                                className="d-flex m-auto btn btn-outline-danger btn-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Thông tin tổng tiền */}
                <div className="mt-4 p-3 border-top text-end">
                    <h5 className="">Tổng tiền: <span className=" text-black">{formatCurrency(totalCost)}</span></h5>
                    <button 
                        onClick={handleCheckout} 
                        className="btn btn-outline-dark  mt-2"
                        style={{ padding: '10px 20px' }}
                    >
                        Thanh Toán
                    </button>
                </div>

                <ToastContainer />
            </div>
        </div>
    );
};

export default CartItem;
