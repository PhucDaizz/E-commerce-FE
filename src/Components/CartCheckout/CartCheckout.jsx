import React, { useEffect, useState } from 'react';
import './CartCheckOut.css';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../Context/ProductContext';
import { toast, ToastContainer } from 'react-toastify';

const CartCheckout = ({dataCoupon, setDataCoupon, selectedMethod, note}) => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL
    const { getCart, cart, getInforUser, handleRemoveItem, handleUpdateItemCart } = useAuth();
    const { formatCurrency, applyCoupon, createURLPayment, processPaymentCOD } = useProduct();
    const [coupon, setCoupon] = useState('');
    const [couponError,  setCouponError] = useState(false); 
    const [totalCost, setTotalCost] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [cartItemUpdate, setCartItemUpdate] = useState([])
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
        setTotalAmount(cost + 30000);
    }, [cart]);

    const handleChange = (e) => {
        setCoupon(e.target.value);
        if (couponError) {
            setCouponError(false); // Ẩn thông báo lỗi khi người dùng nhập lại mã
        }
    };

    const handleApplyCoupon = async (coupon) => {
        const response = await applyCoupon(coupon, totalAmount);
        
        if (response) {
            setDataCoupon(response.data);
            setCouponError(false);
        } else {
            setDataCoupon({});  // Xóa dữ liệu giảm giá nếu mã sai
            setCouponError(true);
        }
    };
    

    const handleProcessPaymentCOD = async() => {
        const response = await processPaymentCOD(dataCoupon?.discountID);
        if(response.status === 200) {
            toast.success('Đơn hàng của bạn đang được xử lý');

            const timeout = setTimeout(() => {
                navigate("/");
            }, 20000);
            return () => clearTimeout(timeout);
        }
    }

    useEffect(() => {
        console.log(dataCoupon);
        console.log(selectedMethod)
    }, [dataCoupon])

    useEffect(() => {
        console.log(selectedMethod)
    }, [selectedMethod])

    const handleGetUrlPayment = async(totalAmount, selectedMethod, note) => {
        if(selectedMethod === "vnpay") {
            const isFillFullInfor = await getInforUser();
            if(isFillFullInfor.phoneNumber === null || isFillFullInfor.address === null) {
                toast.error('Bạn chưa điền đầy đủ thông tin');
            }
            else {
                const response = await createURLPayment(totalAmount, note, dataCoupon?.discountID);
                if (response?.data) {
                    window.location.href = response.data; // Chuyển hướng đến VNPay
                }
            }
        }
        else if(selectedMethod === "cod") {
            const isFillFullInfor = await getInforUser();
            if(isFillFullInfor.phoneNumber === null || isFillFullInfor.address === null) {
                toast.error('Bạn chưa điền đầy đủ thông tin');
            }
            else {
                handleProcessPaymentCOD();
            }
        }
    }

    useEffect(() => {
        console.log(totalAmount);  // Bây giờ giá trị sẽ được cập nhật đúng
    }, [totalAmount]);
    
    useEffect(() => {
        if(dataCoupon?.discountValue) {
            if(dataCoupon.discountType === 1) {
                setTotalAmount(totalCost + 30000 - dataCoupon.discountValue);
            }
            else if(dataCoupon.discountType === 2) {
                setTotalAmount(totalCost * (100 - dataCoupon.discountValue)/100 + 30000);
            }
            console.log(dataCoupon);
        }
        else{
            setTotalAmount(totalCost + 30000);
        }
    },[dataCoupon])

    // const handleUpdateCart = () => {
    //     if (cartItemUpdate !== null) {
    //         const cartItemsUpdate = filterItemsWithExcessQuantity(cart)
    //     }
    // }


    const filterItemsWithExcessQuantity = (cartItems) => {
        return setCartItemUpdate(cartItems.filter(item =>  item.quantity > item.productSizeDTO.stock))
    }

    const handleCartItemUpdateAll = (cartItemsUpdate) => {
        cartItemsUpdate.forEach((cartItemUpdate) => {
            handleUpdateItemCart(
                cartItemUpdate.cartItemID,
                cartItemUpdate.productID,
                cartItemUpdate.productSizeDTO.stock,
                cartItemUpdate.productSizeDTO.productSizeID
            );
        });
    };
    

    useEffect(() => {
        filterItemsWithExcessQuantity(cart)
        console.log(cartItemUpdate);
    }, [cart])

    return (
        <div className='cartcheckout bg-light p-2' style={{minHeight: '80vh'}}>
            <ToastContainer/>
            <h5>Đơn hàng ({cart.length} sản phẩm)</h5>
            {cart.length > 0 && cartItemUpdate.length > 0 && (
                <div className="cart-item-overlay">
                    <div className='border bg-white shadow cart-item-modal'>
                        <div className='d-flex'>
                            <h4><i className="bi bi-exclamation-circle"></i> Thông báo </h4>
                        </div>
                        <p style={{ fontSize: '15px' }}>
                            Một số sản phẩm trong giỏ hàng không còn đủ số lượng để đặt hàng. Chúng tôi xin lỗi vì sự bất tiện này.
                        </p>

                        <div className='cart-item-update'>
                            {cartItemUpdate.map((item) => (
                                <div key={item.cartItemID} className='d-flex mb-3'>
                                    <div className="row w-100">
                                        <div className="col-3 position-relative">
                                            <img
                                                className="img-fluid rounded-1 border"
                                                src={
                                                    item.productDTO.images[0].imageURL
                                                    ? item.productDTO.images[0].imageURL.includes("cloudinary.com")
                                                        ? item.productDTO.images[0].imageURL
                                                        : `${item.productDTO.images[0].imageURL}`
                                                    : 'https://via.${apiUrl}/placeholder.com/80x80?text=No+Image'
                                                }
                                                alt={item.productDTO.productName} 
                                                style={{ maxHeight: '80px' }}
                                            />
                                        </div>
                                        <div className="col-6 d-flex flex-column justify-content-center">
                                            <Link to={`/product/${item.productID}`} className="text-decoration-none text-black" style={{fontSize: '15px'}}>
                                                {item.productDTO.productName}
                                            </Link>
                                            <div className='mt-1 d-flex' style={{fontSize: '14px', color: 'gray'}}>
                                                <p className='me-3'>{item.productSizeDTO.size}</p>
                                                {formatCurrency(item.productDTO.price)}
                                            </div>
                                        </div>
                                        <div className="col-3 d-flex align-items-center justify-content-center" style={{fontSize: '15px'}}>
                                            <span className='mt-1 me-1'>{item.quantity}</span> 
                                            <i className="mt-1 align-content-center bi bi-arrow-right"></i> 
                                            <span className='mt-1 ms-1'>{item.productSizeDTO.stock}</span>
                                            <i className="ms-2 mt-1 bi bi-x-circle-fill cancel" onClick={() => handleRemoveItem(item.cartItemID, item.productID, item.productSizeID)}></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className='btn btn-outline-dark' onClick={() => handleCartItemUpdateAll(cartItemUpdate)}>
                            Tiếp tục
                        </button>
                    </div>
                </div>
            )}

            <hr />
            {cart.length > 0 ? (
                cart.map((item) => (
                    <div key={item.cartItemID} className='d-flex mb-3'>
                        <div className="row w-100">
                            <div className="col-3 position-relative">
                                <img
                                    className="img-fluid rounded-1 border"
                                    src={
                                        item.productDTO.images[0].imageURL
                                        ? item.productDTO.images[0].imageURL.includes("cloudinary.com")
                                            ? item.productDTO.images[0].imageURL
                                            : `${apiUrl}/${item.productDTO.images[0].imageURL}`
                                        : 'https://via.placeholder.com/80x80?text=No+Image'
                                    }
                                    
                                    alt={item.productDTO.productName} 
                                    style={{ maxHeight: '50px' }}
                                />
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
                        <p className=''>
                            {dataCoupon.discountType === 1 
                                ? `-${formatCurrency(dataCoupon.discountValue)}`
                                : `-${dataCoupon.discountValue}%`}
                        </p>
                    </div>
                ) : null}

            </div>
            <hr className=' pt-0 mb-1 mt-1'/>
            <div className='opacity-75 justify-content-md-between p-3 pt-1' style={{ fontSize: '15px' }}>
                <div className='d-flex justify-content-between' style={{fontSize: '17px'}}>
                    <p>Tổng cộng </p>
                    <p className=' fw-bold text-primary'>{formatCurrency(totalAmount)}</p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <p className=' text-primary' 
                        style={{ fontSize: '13px', cursor: 'pointer'}}
                        onClick={() => navigate('/cart')}
                    >
                        <i className="bi bi-chevron-left small" ></i>Quay về giỏ hàng
                    </p>
                    <button className='btn btn-primary' onClick={() => handleGetUrlPayment(totalAmount, selectedMethod, note)}>Đặt hàng</button>
                </div>
            </div>
        </div>
    );
};

export default CartCheckout;
