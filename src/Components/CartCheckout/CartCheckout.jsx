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
        <div className="cart-checkout-wrapper h-100 d-flex flex-column">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            {/* --- MODAL KIỂM TRA TỒN KHO --- */}
            {isValidationModalOpen && validationResult && (
                <div className="cart-item-overlay">
                    <div className='cart-item-modal'>
                        <div className='d-flex align-items-center mb-3'>
                            <i className="bi bi-exclamation-triangle-fill text-warning me-2 fs-4"></i>
                            <h5 className='mb-0 fw-bold'>Cập nhật giỏ hàng</h5>
                        </div>
                        <div className="alert alert-light border mb-3">
                            <small className="text-secondary">Một số sản phẩm không đủ số lượng tồn kho. Vui lòng xem lại thay đổi bên dưới.</small>
                        </div>

                        <div className='cart-item-update'>
                            {validationResult.validatedItems.map((item) => (
                                <div key={item.cartItemID} className='d-flex mb-3 align-items-center p-2 border rounded-3 bg-light'>
                                    <div className="me-3">
                                        <img
                                            className="rounded-2 border"
                                            src={item.imageUrl ? (item.imageUrl.includes("cloudinary.com") ? item.imageUrl : `${apiUrl}${item.imageUrl}`) : 'https://via.placeholder.com/60'}
                                            alt={item.productName}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <Link to={`/product/${item.productID}`} className="text-decoration-none text-dark fw-medium d-block text-truncate" style={{ maxWidth: '200px' }}>
                                            {item.productName}
                                        </Link>
                                        <div className="d-flex align-items-center small mt-1">
                                            <span className="text-muted me-2">Size: {item.size}</span>
                                            <span className="text-decoration-line-through text-muted ms-auto me-2">{item.originalQuantity}</span>
                                            <i className="bi bi-arrow-right small text-muted me-2"></i>
                                            <span className="fw-bold text-danger">{item.adjustedQuantity}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-link text-secondary p-0 ms-3"
                                        onClick={() => handleRemoveItemFromModal(item)}
                                        title="Xóa khỏi giỏ"
                                    >
                                        <i className="bi bi-x-circle-fill fs-5"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button className='btn btn-light' onClick={() => setIsValidationModalOpen(false)}>
                                Quay lại
                            </button>
                            <button className='btn btn-dark' onClick={handleConfirmCartUpdate}>
                                Cập nhật & Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 border-bottom">
                <h5 className="section-title mb-0">
                    Đơn hàng <span className="text-muted fw-normal ms-1">({cart.length} sản phẩm)</span>
                </h5>
            </div>

            <div className="order-items p-4 flex-grow-1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item.cartItemID} className="d-flex mb-4 align-items-center">
                            <div className="position-relative me-3">
                                <img
                                    className="rounded-3 border"
                                    src={
                                        item.productDTO.images[0]?.imageURL
                                            ? item.productDTO.images[0].imageURL.includes("cloudinary.com")
                                                ? item.productDTO.images[0].imageURL
                                                : `${apiUrl}${item.productDTO.images[0].imageURL}`
                                            : 'https://via.placeholder.com/80x80?text=No+Image'
                                    }
                                    alt={item.productDTO.productName}
                                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ fontSize: '0.7rem' }}>
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-grow-1">
                                <Link to={`/product/${item.productID}`} className="text-decoration-none text-dark fw-medium line-clamp-2 small mb-1">
                                    {item.productDTO.productName}
                                </Link>
                                <div className="text-muted small">
                                    {formatCurrency(item.productDTO.price)}
                                </div>
                            </div>
                            <div className="fw-semibold small ms-2">
                                {formatCurrency(item.productDTO.price * item.quantity)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
                        <p className="text-muted">Giỏ hàng trống</p>
                    </div>
                )}
            </div>

            <div className="discount-section px-4 pb-2">
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-ticket-perforated text-dark"></i>
                    </span>
                    <input type="text"
                        className={`form-control border-start-0 ps-0 ${couponError ? 'is-invalid' : ''}`}
                        placeholder='Mã giảm giá'
                        value={coupon}
                        onChange={handleChange}
                    />
                    <button
                        className='btn btn-dark'
                        disabled={!coupon}
                        onClick={() => handleApplyCoupon(coupon)}
                    >Áp dụng</button>
                </div>
                {couponError && (
                    <div className="text-danger small mt-1 ms-1">
                        <i className="bi bi-exclamation-circle me-1"></i>Mã không hợp lệ
                    </div>
                )}
            </div>

            <div className="summary-section p-4 pt-2 bg-light bg-opacity-50 mt-auto rounded-bottom-4">
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(totalCost)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                    <span>Phí vận chuyển</span>
                    <span>{formatCurrency(30000)}</span>
                </div>
                {dataCoupon?.discountValue && (
                    <div className="d-flex justify-content-between mb-2 small text-success">
                        <span><i className="bi bi-tag-fill me-1"></i>Giảm giá</span>
                        <span>
                            {dataCoupon.discountType === 1
                                ? `-${formatCurrency(dataCoupon.discountValue)}`
                                : `-${dataCoupon.discountValue}%`}
                        </span>
                    </div>
                )}

                <hr className="my-3 border-secondary border-opacity-10" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold fs-5">Tổng cộng</span>
                    <span className="fw-bold fs-4 text-dark">{formatCurrency(totalAmount)}</span>
                </div>

                <button
                    className='btn btn-dark w-100 py-3 rounded-3 fw-bold shadow-sm mb-3'
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0}
                >
                    ĐẶT HÀNG NGAY
                </button>

                <div className="text-center">
                    <span
                        className="text-dark text-decoration-none small fw-medium cursor-pointer link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                        onClick={handleBackToCart}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="bi bi-arrow-left me-1"></i>
                        Quay về giỏ hàng
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartCheckout;