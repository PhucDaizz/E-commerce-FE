import React, { useEffect, useState } from 'react';
import './CartCheckOut.css';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../Context/ProductContext';
import { toast, ToastContainer } from 'react-toastify';

const CartCheckout = ({ dataCoupon, setDataCoupon, selectedMethod, note }) => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const { getCart, cart, getInforUser, handleRemoveItem, handleUpdateItemCart } = useAuth();
    const { formatCurrency, applyCoupon, createURLPayment, processPaymentCOD, validateCart, reserveInventory, releaseReservation } = useProduct();
    const navigate = useNavigate();

    const [coupon, setCoupon] = useState('');
    const [couponError, setCouponError] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // --- STATE ĐỂ QUẢN LÝ VIỆC KIỂM TRA TỒN KHO ---
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    // ---------------------------------------------

    useEffect(() => {
        getCart();
        
        return () => {
            // Cleanup khi component unmount
            const releaseBeforeUnmount = async () => {
                try {
                    await releaseReservation();
                } catch (error) {
                    console.error('Lỗi khi release reservation:', error);
                }
            };
            releaseBeforeUnmount();
        };
    }, []);

    useEffect(() => {
        let cost = 0;
        cart.forEach(item => {
            cost += item.productDTO.price * item.quantity;
        });
        setTotalCost(cost);
    }, [cart]);

    useEffect(() => {
        if (dataCoupon?.discountValue) {
            if (dataCoupon.discountType === 1) {
                setTotalAmount(totalCost + 30000 - dataCoupon.discountValue);
            } else if (dataCoupon.discountType === 2) {
                setTotalAmount(totalCost * (100 - dataCoupon.discountValue) / 100 + 30000);
            }
        } else {
            setTotalAmount(totalCost + 30000);
        }
    }, [totalCost, dataCoupon]);

    const handleChange = (e) => {
        setCoupon(e.target.value);
        if (couponError) {
            setCouponError(false);
        }
    };

    const handleApplyCoupon = async (coupon) => {
        const response = await applyCoupon(coupon, totalAmount);
        if (response) {
            setDataCoupon(response.data);
            setCouponError(false);
        } else {
            setDataCoupon({});
            setCouponError(true);
        }
    };

    const handleBackToCart = async () => {
        try {
            await releaseReservation();
        } catch (error) {
            console.error("Lỗi khi release reservation:", error);
        } finally {
            navigate('/cart');
        }
    };
    // --- HÀM XỬ LÝ SỰ KIỆN TRÊN MODAL ---

    const handleRemoveItemFromModal = async (itemToRemove) => {
        await handleRemoveItem(itemToRemove.cartItemID, itemToRemove.productID, itemToRemove.productSizeID);
        
        setValidationResult(prevResult => {
            const updatedItems = prevResult.validatedItems.filter(
                item => item.cartItemID !== itemToRemove.cartItemID
            );

            if (updatedItems.length === 0) {
                setIsValidationModalOpen(false);
                getCart(); // Tải lại giỏ hàng vì không còn item nào để cập nhật
                return null;
            }

            return { ...prevResult, validatedItems: updatedItems };
        });
        toast.info(`Đã xóa sản phẩm '${itemToRemove.productName}' khỏi giỏ hàng.`);
    };

    const handleConfirmCartUpdate = async () => {
        if (!validationResult || !validationResult.wasAdjusted) return;

        toast.info("Đang cập nhật lại giỏ hàng của bạn...");

        const updatePromises = validationResult.validatedItems.map(item => {
            if (item.adjustedQuantity > 0) {
                if (item.adjustedQuantity !== item.originalQuantity) {
                    return handleUpdateItemCart(item.cartItemID, item.productID, item.adjustedQuantity, item.productSizeID);
                }
            } else {
                return handleRemoveItem(item.cartItemID, item.productID, item.productSizeID);
            }
            return Promise.resolve();
        });

        await Promise.all(updatePromises);

        toast.success("Giỏ hàng của bạn đã được cập nhật. Vui lòng kiểm tra lại đơn hàng.");
        setIsValidationModalOpen(false);
        setValidationResult(null);
        getCart(); 
    };

    // --- HÀM "ĐẶT HÀNG" CHÍNH ---
    const handlePlaceOrder = async () => {
        const validationData = await validateCart();
        
        if (!validationData) return;

        if (validationData.wasAdjusted) {
            setValidationResult(validationData);
            setIsValidationModalOpen(true);
            return; 
        }

        const isFillFullInfor = await getInforUser();
        if (isFillFullInfor.phoneNumber === null || isFillFullInfor.address === null) {
            toast.error('Bạn chưa điền đầy đủ thông tin cá nhân.');
            return;
        }

        const reservationResult = await reserveInventory();
        if (!reservationResult || reservationResult.status !== 200) return;

        if (selectedMethod === "vnpay") {
            const response = await createURLPayment(totalAmount, note, dataCoupon?.discountID);
            if (response?.data) {
                window.location.href = response.data;
            }
        } else if (selectedMethod === "cod") {
            const response = await processPaymentCOD(dataCoupon?.discountID);
            if (response.status === 200) {
                toast.success('Đơn hàng của bạn đã được tạo thành công!');
                setTimeout(() => navigate("/"), 3000);
            }
        }
    };

    return (
        <div className='cartcheckout bg-light p-2' style={{ minHeight: '80vh' }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            {/* --- MODAL KIỂM TRA TỒN KHO VÀ CHO PHÉP XÓA --- */}
            {isValidationModalOpen && validationResult && (
                <div className="cart-item-overlay">
                    <div className='border bg-white shadow cart-item-modal'>
                        <div className='d-flex align-items-center'>
                            <h4 className='mb-0'><i className="bi bi-exclamation-triangle-fill text-warning me-2"></i> Cập nhật giỏ hàng</h4>
                        </div>
                        <hr/>
                        <p style={{ fontSize: '15px' }}>
                            Một số sản phẩm không còn đủ số lượng. Giỏ hàng của bạn cần được cập nhật để tiếp tục:
                        </p>
                        <div className='cart-item-update'>
                            {validationResult.validatedItems.map((item) => (
                                <div key={item.cartItemID} className='d-flex mb-3 align-items-center'>
                                    <div className="row w-100">
                                        <div className="col-3">
                                            <img
                                                className="img-fluid rounded-1 border"
                                                src={item.imageUrl ? (item.imageUrl.includes("cloudinary.com") ? item.imageUrl : `${apiUrl}${item.imageUrl}`) : 'https://via.placeholder.com/80x80?text=No+Image'}
                                                alt={item.productName}
                                                style={{ maxHeight: '80px' }}
                                            />
                                        </div>
                                        <div className="col-5 d-flex flex-column justify-content-center">
                                            <Link to={`/product/${item.productID}`} className="text-decoration-none text-black" style={{ fontSize: '15px' }}>
                                                {item.productName}
                                            </Link>
                                            <div className='mt-1' style={{ fontSize: '14px', color: 'gray' }}>
                                                Size: {item.size}
                                            </div>
                                            <br/>
                                        </div>
                                        <div className="col-4 d-flex flex-column align-items-center justify-content-center" style={{ fontSize: '15px' }}>
                                            <div className='d-flex align-items-center'>
                                                <span className='me-1 text-muted text-decoration-line-through'>{item.originalQuantity}</span>
                                                <i className="bi bi-arrow-right"></i>
                                                <span className='ms-1 fw-bold text-danger'>{item.adjustedQuantity}</span>
                                                <i 
                                                    className="ms-3 bi bi-x-circle-fill text-secondary cancel" 
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleRemoveItemFromModal(item)}
                                                    title="Xóa sản phẩm này"
                                                ></i>
                                            </div>
                                            <small className='text-muted'>(Chỉ còn: {item.availableStock})</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <button className='btn btn-outline-secondary me-2' onClick={() => setIsValidationModalOpen(false)}>
                                Quay lại
                            </button>
                            <button className='btn btn-primary' onClick={handleConfirmCartUpdate}>
                                Cập nhật tất cả
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <h5>Đơn hàng ({cart.length} sản phẩm)</h5>
            <hr />
            {cart.length > 0 ? (
                cart.map((item) => (
                    <div key={item.cartItemID} className='d-flex mb-3'>
                         <div className="row w-100">
                            <div className="col-3 position-relative">
                                <img
                                    className="img-fluid rounded-1 border"
                                    src={
                                        item.productDTO.images[0]?.imageURL
                                        ? item.productDTO.images[0].imageURL.includes("cloudinary.com")
                                            ? item.productDTO.images[0].imageURL
                                            : `${apiUrl}${item.productDTO.images[0].imageURL}`
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
                        onClick={handleBackToCart}
                    >
                        <i className="bi bi-chevron-left small" ></i>Quay về giỏ hàng
                    </p>
                    <button className='btn btn-primary' onClick={handlePlaceOrder}>Đặt hàng</button>
                </div>
            </div>
        </div>
    );
};

export default CartCheckout;