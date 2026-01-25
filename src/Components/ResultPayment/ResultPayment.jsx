import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Check, X, Home, CreditCard, Receipt, Building, Info, ArrowLeft } from 'lucide-react';
import './ResultPayment.css';

const ResultPayment = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isSuccess = searchParams.get("vnp_ResponseCode") === "00";
    const statusText = isSuccess ? "Thành công" : "Thất bại";
    const amount = Number(searchParams.get("vnp_Amount")) / 100;
    const bank = searchParams.get("vnp_BankCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");

    useEffect(() => {
        const savePaymentResult = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                await axios.get(`${apiUrl}/api/Payment/IpnAction`, { params });
            } catch (error) {
                console.error("Lỗi khi xử lý thanh toán:", error);
            }
        };

        if (isSuccess) {
            savePaymentResult();
            const timeout = setTimeout(() => navigate("/"), 30000);
            return () => clearTimeout(timeout);
        }
    }, [searchParams, isSuccess, navigate, apiUrl]);

    return (
        <div className="payment-result-page">
            <div className="payment-card-lux">
                <div className={`result-icon-wrapper ${isSuccess ? 'success' : 'error'}`}>
                    {isSuccess ?
                        <Check size={48} className="icon-animation" /> :
                        <X size={48} className="icon-animation" />
                    }
                </div>

                <h1>Thanh toán {statusText}</h1>
                <p className="subtitle">
                    {isSuccess
                        ? "Cảm ơn bạn đã mua sắm tại Doris. Đơn hàng của bạn đang được xử lý."
                        : "Tiếc quá! Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."}
                </p>

                <div className="payment-info-grid">
                    <div className="info-row-lux">
                        <div className="d-flex align-items-center gap-2 info-label-lux">
                            <Info size={16} />
                            <span>Trạng thái</span>
                        </div>
                        <span className={`info-value-lux ${isSuccess ? 'success-text' : 'error-text'}`}>
                            {statusText}
                        </span>
                    </div>

                    <div className="info-row-lux">
                        <div className="d-flex align-items-center gap-2 info-label-lux">
                            <CreditCard size={16} />
                            <span>Số tiền</span>
                        </div>
                        <span className="info-value-lux">{amount.toLocaleString()} VNĐ</span>
                    </div>

                    <div className="info-row-lux">
                        <div className="d-flex align-items-center gap-2 info-label-lux">
                            <Building size={16} />
                            <span>Ngân hàng</span>
                        </div>
                        <span className="info-value-lux">{bank || "System"}</span>
                    </div>

                    <div className="info-row-lux">
                        <div className="d-flex align-items-center gap-2 info-label-lux">
                            <Receipt size={16} />
                            <span>Mã giao dịch</span>
                        </div>
                        <span className="info-value-lux">{transactionNo || "N/A"}</span>
                    </div>
                </div>

                <Link to="/" className="btn-payment-return">
                    <Home size={20} />
                    <span>Quay lại trang chủ</span>
                </Link>

                {isSuccess && (
                    <div className="auto-redirect-msg">
                        Tự động chuyển hướng sau <b>30 giây</b>...
                    </div>
                )}

                {!isSuccess && (
                    <Link to="/cart" className="d-flex align-items-center justify-content-center gap-2 mt-4 text-dark text-decoration-none fw-bold small">
                        <ArrowLeft size={14} />
                        Trở lại giỏ hàng
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ResultPayment;
