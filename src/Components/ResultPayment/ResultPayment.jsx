import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const ResultPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Hook để điều hướng trang

    const status = searchParams.get("vnp_ResponseCode") === "00" ? "Thành công" : "Thất bại";
    const amount = Number(searchParams.get("vnp_Amount")) / 100;
    const bank = searchParams.get("vnp_BankCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");

    useEffect(() => {
        const savePaymentResult = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());

                const response = await axios.get("https://localhost:7295/api/Payment/IpnAction", {
                    params: params
                });

                console.log("Thanh toán đã được xử lý:", response.data);
            } catch (error) {
                console.error("Lỗi khi gửi dữ liệu thanh toán:", error);
            }
        };

        if (status === "Thành công") {
            savePaymentResult();

            // Chuyển hướng về trang chủ sau 30 giây
            const timeout = setTimeout(() => {
                navigate("/");
            }, 30000);

            return () => clearTimeout(timeout); // Dọn dẹp timeout khi unmount
        }

    }, [searchParams, status, navigate]);

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center" 
             style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-5">
                        <div className="card border-0 shadow-lg" 
                             style={{ borderRadius: '20px', transition: 'transform 0.3s ease-in-out' }}>
                            
                            <div className="card-body text-center p-5">
                                <div className="mb-4 m-auto d-flex flex-column align-items-center">
                                    <div className={`d-flex justify-content-center align-items-center 
                                                    rounded-circle mb-3
                                                    ${status === "Thành công" ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}
                                        style={{ width: '80px', height: '80px' }}>
                                        <i className={`bi ${status === "Thành công" ? 'bi-check' : 'bi-x-lg'} 
                                                        ${status === "Thành công" ? 'text-success' : 'text-danger'}`}
                                        style={{ fontSize: '3rem', animation: 'fadeIn 0.5s ease-in-out' }}></i>
                                    </div>

                                    <h2 className={`mb-1 fw-bold ${status === "Thành công" ? 'text-success' : 'text-danger'}`}>
                                        Kết quả thanh toán
                                    </h2>
                                </div>

                                {/* Payment Details */}
                                <div className="payment-details">
                                    <div className="bg-light p-3 rounded-3 mb-3 text-start">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-info-circle me-3 text-primary"></i>
                                            <div>
                                                <small className="text-muted d-block">Trạng thái</small>
                                                <span className={`fw-bold ${status === "Thành công" ? 'text-success' : 'text-danger'}`}>
                                                    {status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-light p-3 rounded-3 mb-3 text-start">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-money-bill-wave me-3 text-primary"></i>
                                            <div>
                                                <small className="text-muted d-block">Số tiền</small>
                                                <span className="fw-bold">{amount.toLocaleString()} VNĐ</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-light p-3 rounded-3 mb-3 text-start">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-university me-3 text-primary"></i>
                                            <div>
                                                <small className="text-muted d-block">Ngân hàng</small>
                                                <span className="fw-bold">{bank || "Không có"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-light p-3 rounded-3 mb-4 text-start">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-receipt me-3 text-primary"></i>
                                            <div>
                                                <small className="text-muted d-block">Mã giao dịch</small>
                                                <span className="fw-bold">{transactionNo || "Không có"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/" className="btn btn-primary btn-lg w-100 rounded-3">
                                    <i className="fas fa-home me-2"></i>
                                    Quay lại trang chủ
                                </Link>

                                {status === "Thành công" && (
                                    <p className="mt-3 text-muted">
                                        Bạn sẽ được chuyển về trang chủ sau <b>30 giây</b>...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPayment;
