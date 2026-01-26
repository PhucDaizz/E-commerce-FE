import React, { useEffect, useState } from 'react';
import './CSS/Checkout.css';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartCheckout from '../Components/CartCheckout/CartCheckout';

const Checkout = () => {
    const { getInforUser } = useAuth();
    const navigation = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState("cod");
    const [dataCoupon, setDataCoupon] = useState({});

    const [detailLocaton, setDetailLocaton] = useState('');
    const [isFillFull, setIsFillFull] = useState(false);

    const [inforUser, setInforUser] = useState({});
    const [note, setNote] = useState(null);

    useEffect(() => {
        getInfor()
    }, [])

    const getInfor = async () => {
        let isLogIn = localStorage.getItem('token');
        if (isLogIn !== null) {
            let inf = await getInforUser();
            setInforUser(inf);
            if (inf.address !== null) {
                setDetailLocaton(inf.address);
                setIsFillFull(false);
            }
            else {
                setIsFillFull(true);
            }
            return inforUser;
        }
        navigation('/');
        return null;
    }

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    // const handlePayment = async() => {
    //     if (selectedMethod === 'vnpay') {

    //     }

    // }


    return (
        <div className='checkout-container container py-5' style={{ minHeight: '80vh' }}>
            <div className="row g-4">
                {/* Column 1: Customer Info */}
                <div className="col-lg-4 col-md-12">
                    <div className="checkout-card p-4">
                        <h5 className="section-title mb-4">
                            <i className="bi bi-person-lines-fill me-2"></i>
                            Thông tin nhận hàng
                        </h5>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Email</label>
                            <input type="email" className="form-control custom-input" value={inforUser.email} placeholder='Địa chỉ email' readOnly disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Họ và tên</label>
                            <input type="text" className="form-control custom-input" value={inforUser.userName} placeholder="Nhập họ và tên" disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Số điện thoại</label>
                            <input type="tel" value={inforUser.phoneNumber} className="form-control custom-input" placeholder="+84xxxxxxxxx" disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Địa chỉ</label>
                            <textarea type="text" className="form-control custom-input" value={detailLocaton} placeholder="Địa chỉ chi tiết" disabled rows={3} />
                        </div>
                        <div className="mb-3">
                            <button className='btn btn-outline-dark w-100 rounded-pill' onClick={() => navigation('/account/update')}>Thay đổi địa chỉ</button>
                        </div>

                        <div className="mb-3 mt-4">
                            <label className="form-label text-secondary small fw-bold">Ghi chú (tùy chọn)</label>
                            <textarea className="form-control custom-input"
                                placeholder="Ví dụ: Giao hàng giờ hành chính..."
                                onChange={handleNoteChange}
                                value={note}
                                rows={3}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Column 2: Shipping & Payment */}
                <div className="col-lg-4 col-md-12">
                    <div className="d-flex flex-column gap-4">
                        {/* Shipping Section */}
                        <div className="checkout-card p-4">
                            <h5 className="section-title mb-4">
                                <i className="bi bi-truck me-2"></i>
                                Vận chuyển
                            </h5>
                            {
                                isFillFull ? (
                                    <div className='alert alert-warning d-flex align-items-center' role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <div>Vui lòng cập nhật địa chỉ giao hàng</div>
                                    </div>
                                ) : (
                                    <div className='shipping-method-selected p-3 rounded-3 d-flex justify-content-between align-items-center'>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill text-dark me-2 fs-5"></i>
                                            <span className="fw-medium">Giao hàng tận nơi</span>
                                        </div>
                                        <span className="fw-bold text-dark">30.000đ</span>
                                    </div>

                                )
                            }
                        </div>

                        {/* Payment Section */}
                        <div className="checkout-card p-4">
                            <h5 className='section-title mb-4'>
                                <i className="bi bi-credit-card me-2"></i>
                                Thanh toán
                            </h5>

                            <div className="payment-methods d-flex flex-column gap-3">
                                <div
                                    className={`payment-option ${selectedMethod === "vnpay" ? "active" : ""}`}
                                    onClick={() => setSelectedMethod("vnpay")}
                                >
                                    <div className="d-flex align-items-center w-100">
                                        <div className="custom-radio me-3">
                                            <div className="radio-dot"></div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between flex-grow-1">
                                            <span className="fw-medium">Thanh toán qua VNPAY-QR</span>
                                            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLeYoMVenMbgWL1FxDJPKuQvJD6R0KdnXE7A&s'
                                                alt="VNPAY" className="payment-logo" />
                                        </div>
                                    </div>
                                    {selectedMethod === "vnpay" && (
                                        <div className="payment-desc">Quét mã QR để thanh toán nhanh chóng, an toàn.</div>
                                    )}
                                </div>

                                <div
                                    className={`payment-option ${selectedMethod === "cod" ? "active" : ""}`}
                                    onClick={() => setSelectedMethod("cod")}
                                >
                                    <div className="d-flex align-items-center w-100">
                                        <div className="custom-radio me-3">
                                            <div className="radio-dot"></div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between flex-grow-1">
                                            <span className="fw-medium">Thanh toán khi nhận hàng (COD)</span>
                                            <i className="bi bi-cash-coin fs-4 text-secondary"></i>
                                        </div>
                                    </div>
                                    {selectedMethod === "cod" && (
                                        <div className="payment-desc">Bạn sẽ thanh toán tiền mặt cho shipper khi nhận được hàng.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Cart Summary */}
                <div className="col-lg-4 col-md-12">
                    <div className="checkout-card h-100 summary-card">
                        <CartCheckout
                            dataCoupon={dataCoupon}
                            setDataCoupon={setDataCoupon}
                            selectedMethod={selectedMethod}
                            note={note}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
