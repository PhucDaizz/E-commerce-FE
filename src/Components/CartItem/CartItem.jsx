import React, { useEffect, useState } from 'react';
import './CartItem.css';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

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
            cost += (item.price || item.productDTO.price) * item.quantity;
        });
        setTotalCost(cost);
    }, [cart]);

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!token || !refreshToken) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            setTimeout(() => {
                navigate('/register', { state: { from: '/cart' } });
            }, 5000);
            return;

        }

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
        <div className="cart-page-container">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="container">
                <div className="cart-header-section">
                    <div className="cart-title-group">
                        <ShoppingBag size={28} />
                        <h1>Giỏ hàng của bạn</h1>
                    </div>
                    <p className="cart-count">Có {cart.length} sản phẩm trong giỏ hàng</p>
                </div>

                <div className="cart-layout-grid">
                    {/* Main Cart Items Area */}
                    <div className="cart-items-main">
                        {cart.length === 0 ? (
                            <div className="empty-cart-state">
                                <ShoppingBag size={64} strokeWidth={1} />
                                <h3>Giỏ hàng đang trống</h3>
                                <p>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng của mình.</p>
                                <Link to="/shop" className="btn-shop-now">Tiếp tục mua sắm</Link>
                            </div>
                        ) : (
                            <div className="cart-list">
                                {cart.map(item => (
                                    <div key={item.cartItemID} className="cart-card">
                                        <div className="cart-card-image">
                                            <img
                                                src={
                                                    item.imageURL
                                                        ? item.imageURL.includes("cloudinary.com") ? item.imageURL : `${apiUrl}/${item.imageURL}`
                                                        : item.productDTO?.images[0]?.imageURL
                                                            ? item.productDTO.images[0].imageURL.includes("cloudinary.com") ? item.productDTO.images[0].imageURL : `${apiUrl}/${item.productDTO.images[0].imageURL}`
                                                            : 'https://via.placeholder.com/150'
                                                }
                                                alt="Product"
                                            />
                                        </div>

                                        <div className="cart-card-info">
                                            <div className="info-header">
                                                <Link to={`/product/${item.productID}`} className="product-name">
                                                    {item.productName || item.productDTO?.productName}
                                                </Link>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => handleRemoveItem(item.cartItemID, item.productID, item.productSizeID)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <p className="product-specs">
                                                Size: <span>{item.size || item.productSizeDTO?.size}</span> •
                                                Màu: <span>{item.colorName || 'Mặc định'}</span>
                                            </p>

                                            <div className="info-footer">
                                                <div className="quantity-control-premium">
                                                    <button
                                                        onClick={() => handleUpdateItemCart(item.cartItemID, item.productID, item.quantity - 1, item.productSizeID)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="qty-value">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateItemCart(item.cartItemID, item.productID, item.quantity + 1, item.productSizeID)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <div className="price-tag">
                                                    {formatCurrency(item.price || item.productDTO.price)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    {cart.length > 0 && (
                        <div className="cart-summary-sidebar">
                            <div className="summary-card">
                                <h3>Tổng kết đơn hàng</h3>
                                <div className="summary-details">
                                    <div className="summary-row">
                                        <span>Tạm tính</span>
                                        <span>{formatCurrency(totalCost)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Phí vận chuyển</span>
                                        <span className="free-shipping">Miễn phí</span>
                                    </div>
                                    <div className="summary-divider"></div>
                                    <div className="summary-row total">
                                        <span>Tổng cộng</span>
                                        <span className="total-amount">{formatCurrency(totalCost)}</span>
                                    </div>
                                </div>

                                <button className="checkout-btn-premium" onClick={handleCheckout}>
                                    Thanh toán ngay
                                </button>

                                <div className="cart-benefits">
                                    <div className="benefit-item">
                                        <div className="dot"></div>
                                        <span>Đổi trả trong vòng 7 ngày</span>
                                    </div>
                                    <div className="benefit-item">
                                        <div className="dot"></div>
                                        <span>Cam kết chất lượng 100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartItem;
