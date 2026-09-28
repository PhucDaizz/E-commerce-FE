import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/apiHelper';
import { Check, X, Home, CreditCard, Receipt, Building, Info, ArrowLeft, Clock } from 'lucide-react';
import './ResultPayment.css';

// Trạng thái đơn BE: 0 = Pending, 1 = Error, 2 = Completed, 3 = Cancelled, 4 = Confirmed
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_TRIES = 20;

const ResultPayment = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const bankSuccess = searchParams.get("vnp_ResponseCode") === "00";
    const txnRef = searchParams.get("vnp_TxnRef");
    const amount = Number(searchParams.get("vnp_Amount")) / 100;
    const bank = searchParams.get("vnp_BankCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");

    // phase: polling | success | failed | processing | error
    const [phase, setPhase] = useState(bankSuccess ? 'polling' : 'failed');
    const [orderTotal, setOrderTotal] = useState(amount);

    useEffect(() => {
        if (!bankSuccess) {
            // Ngân hàng báo fail: hủy đơn nháp để giải phóng hold ngay, không chờ hết hạn
            const cancelDraft = async () => {
                try {
                    if (!txnRef) return;
                    const status = await apiRequest({
                        method: 'get',
                        url: `/api/Payment/StatusByTxn/${txnRef}`
                    }).then(r => r.data).catch(() => null);
                    if (status && status.status === 0) {
                        await apiRequest({
                            method: 'put',
                            url: `/api/Order/CancelOrder/${status.orderId}`
                        }).catch(() => null);
                    }
                } catch (error) {
                    console.error("Lỗi khi hủy đơn nháp:", error);
                }
            };
            cancelDraft();
            return;
        }

        if (!txnRef) {
            setPhase('failed');
            return;
        }

        let tries = 0;
        let timer;
        let cancelled = false;

        const poll = async () => {
            tries += 1;
            try {
                const res = await apiRequest({
                    method: 'get',
                    url: `/api/Payment/StatusByTxn/${txnRef}`
                });
                const s = res.data;
                if (cancelled) return;
                if (s.status === 4 || s.status === 2) {
                    setOrderTotal(s.totalAmount || amount);
                    setPhase('success');
                    return;
                }
                if (s.status === 1) {
                    setPhase('error');
                    return;
                }
                if (s.status === 3) {
                    setPhase('failed');
                    return;
                }
                // status 0 (Pending): IPN chưa về, poll tiếp
            } catch (error) {
                console.error("Lỗi khi lấy trạng thái thanh toán:", error);
            }
            if (!cancelled) {
                if (tries >= POLL_MAX_TRIES) {
                    setPhase('processing');
                    return;
                }
                timer = setTimeout(poll, POLL_INTERVAL_MS);
            }
        };

        poll();
        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
        };
    }, [searchParams, bankSuccess, navigate, apiUrl, txnRef, amount]);

    useEffect(() => {
        if (phase === 'success') {
            const timeout = setTimeout(() => navigate("/"), 30000);
            return () => clearTimeout(timeout);
        }
    }, [phase, navigate]);

    const isSuccess = phase === 'success';
    const isPolling = phase === 'polling';
    const isProcessing = phase === 'processing';
    const isError = phase === 'error';
    const statusText = isSuccess ? "Thành công" : isPolling ? "Đang xác nhận" : isProcessing ? "Đang xử lý" : "Thất bại";

    return (
        <div className="payment-result-page">
            <div className="payment-card-lux">
                <div className={`result-icon-wrapper ${isSuccess ? 'success' : (isPolling || isProcessing) ? 'pending' : 'error'}`}>
                    {isSuccess ?
                        <Check size={48} className="icon-animation" /> :
                        (isPolling || isProcessing) ?
                        <Clock size={48} className="icon-animation" /> :
                        <X size={48} className="icon-animation" />
                    }
                </div>

                <h1>Thanh toán {statusText}</h1>
                <p className="subtitle">
                    {isSuccess
                        ? "Cảm ơn bạn đã mua sắm tại Doris. Đơn hàng của bạn đang được xử lý."
                        : isPolling
                        ? "Ngân hàng đã ghi nhận giao dịch. Hệ thống đang xác nhận đơn hàng, vui lòng chờ giây lát, đừng tắt trang."
                        : isProcessing
                        ? "Giao dịch của bạn đang được xử lý. Vui lòng kiểm tra lại trong mục Đơn hàng của tôi sau ít phút."
                        : isError
                        ? "Tiền đã được ghi nhận nhưng kho không còn đủ hàng. Vui lòng liên hệ hỗ trợ để được hoàn tiền."
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
                        <span className="info-value-lux">{(isSuccess ? orderTotal : amount).toLocaleString()} VNĐ</span>
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
                        <span className="info-value-lux">{transactionNo || txnRef || "N/A"}</span>
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

                {!isSuccess && !isPolling && !isProcessing && (
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
