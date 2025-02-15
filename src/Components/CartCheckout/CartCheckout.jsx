import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../Context/ProductContext';
import { ToastContainer } from 'react-toastify';

const CartCheckout = () => {
    const { getCart, cart } = useAuth();
    const { formatCurrency, applyCoupon } = useProduct();
    const [coupon, setCoupon] = useState('');
    const [dataCoupon, setDataCoupon] = useState({});
    const [couponError,  setCouponError] = useState(false); 
    const [totalCost, setTotalCost] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            await getCart();
        };
        fetchCart();
    }, []); 

    useEffect(() => {
        let cost = 0;
        cart.forEach(item => {
            cost += item.productDTO.price * item.quantity;
        });
        setTotalCost(cost);
    }, [cart]);

    useEffect(()=> {
        console.log(dataCoupon)
    },[dataCoupon])

    const handleChange = (e) => {
        setCoupon(e.target.value);
        if (couponError) {
            setCouponError(false); // Ẩn thông báo lỗi khi người dùng nhập lại mã
        }
    };

    const handleApplyCoupon = async (coupon) => {
        const response = await applyCoupon(coupon);
        
        if (response) {
            setDataCoupon(response.data);
            setCouponError(false);
        } else {
            setDataCoupon({});  // Xóa dữ liệu giảm giá nếu mã sai
            setCouponError(true);
        }
    };
    

    return (
        <div className='cartcheckout bg-light p-2' style={{minHeight: '80vh'}}>
            <ToastContainer/>
            <h5>Đơn hàng ({cart.length} sản phẩm)</h5>
            <hr />
            {cart.length > 0 ? (
                cart.map((item) => (
                    <div key={item.cartItemID} className='d-flex mb-3'>
                        <div className="row w-100">
                            <div className="col-3 position-relative">
                                <img
                                    className="img-fluid rounded-1 border"
                                    src={`https://localhost:7295/Resources/${item.productDTO.images[0].imageURL}`}
                                    alt={item.productDTO.productName} 
                                    style={{ maxHeight: '50px' }}
                                />
                                {/* <div
                                    className='position-absolute bg-info-subtle rounded-circle d-flex justify-content-center align-items-center'
                                    style={{ width: '20px', height: '20px', top: '-8px', right: '5px' }}
                                >
                                    <span style={{ fontSize: '14px' }}>{item.quantity}</span>
                                </div> */}
                            </div>
                            <div className="col-6 d-flex align-items-center">
                                <Link to={`/product/${item.productID}`} className="text-decoration-none text-black" style={{fontSize: '13px'}}>
                                    {item.productDTO.productName}<span className='ms-2' style={{ fontSize: '13px' }}>x{item.quantity}</span>
                                </Link>
                            </div>
                            <div className="col-3 d-flex align-items-center justify-content-center" style={{fontSize: '13px'}}>
                                {formatCurrency(item.productDTO.price)}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center">Giỏ hàng của bạn đang trống.</p>
            )}
            <hr />
            <div className="d-flex" style={{ fontSize: '13px' }}>
                <input type="text" 
                    className={`p-2 w-75 me-2 border ${couponError ? ' border-danger' : ''}`}
                    placeholder='Nhập mã giảm giá' 
                    value={coupon}
                    onChange={handleChange}
                />
                <button 
                    className='w-25 btn btn-primary' 
                    style={{ fontSize: '13px' }}
                    disabled={!coupon} 
                    onClick={() => handleApplyCoupon(coupon)}
                >Áp dụng</button>
            </div>
            {couponError && (
                <p className='ms-2 text-danger pb-0' style={{ fontSize: '13px' }}>Mã khuyến mãi không hợp lệ</p>
            )}
            <div className=' opacity-75 justify-content-md-between p-3 pb-0' style={{ fontSize: '15px' }}>
                <div className="d-flex justify-content-between">
                    <p>Tạm tính</p>
                    <p className=''>{formatCurrency(totalCost)}</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p>Phí vận chuyển</p>
                    <p className=''>{formatCurrency(30000)}</p>
                </div>
                {dataCoupon?.discountValue ? (
                    <div className="d-flex justify-content-between">
                        <p>Giảm giá</p>
                        <p className=''>-{formatCurrency(dataCoupon.discountValue)}</p>
                    </div>
                ) : null}
            </div>
            <hr className=' pt-0 mb-1 mt-1'/>
            <div className='opacity-75 justify-content-md-between p-3 pt-1' style={{ fontSize: '15px' }}>
                <div className='d-flex justify-content-between'>
                    <p>Tổng cộng </p>
                    <p className=''>{formatCurrency(totalCost + 30000 - (dataCoupon.discountValue ? dataCoupon.discountValue : 0))}</p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <p className=' text-primary' 
                        style={{ fontSize: '13px', cursor: 'pointer'}}
                        onClick={() => navigate('/cart')}
                    >
                        <i className="bi bi-chevron-left small" ></i>Quay về giỏ hàng
                    </p>
                    <button className='btn btn-primary'>Đặt hàng</button>
                </div>
            </div>
        </div>
    );
};

export default CartCheckout;
