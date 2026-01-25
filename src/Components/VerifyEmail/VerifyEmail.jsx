import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { CheckCircle2, XCircle, Home, Loader2, MailCheck, ShieldAlert } from 'lucide-react';
import './VerifyEmail.css'

const VerifyEmail = () => {
    const [status, setStatus] = useState('loading');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if (!token || !userId) {
            setStatus('error');
            return;
        }

        const handleVerification = async () => {
            try {
                const response = await verifyEmail(userId, token);
                setStatus(response); // 'success' or 'error'
            } catch (err) {
                setStatus('error');
            }
        };

        handleVerification();
    }, [searchParams, verifyEmail]);

    return (
        <div className='verify-email-page'>
            <div className='verify-card-lux'>
                {status === 'loading' && (
                    <div className="verify-state-loading">
                        <div className="verify-icon-box loading mb-4">
                            <div className="spinner-lux"></div>
                        </div>
                        <h1>Đang xác nhận email</h1>
                        <p>Vui lòng đợi trong giây lát, chúng tôi đang kiểm tra mã xác nhận của bạn.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="verify-state-error">
                        <div className="verify-icon-box error mb-4">
                            <ShieldAlert size={48} />
                        </div>
                        <h1>Xác nhận thất bại</h1>
                        <p>Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại mã mới.</p>
                        <button className="btn-verify-action" onClick={() => navigate('/account/update')}>
                            <span>Quay lại trang hồ sơ</span>
                        </button>
                    </div>
                )}

                {status === 'success' && (
                    <div className="verify-state-success">
                        <div className="verify-icon-box success mb-4">
                            <MailCheck size={48} />
                        </div>
                        <h1>Xác nhận thành công!</h1>
                        <p>Tuyệt vời! Email của bạn đã được xác thực thành công. Bây giờ bạn có thể tận hưởng đầy đủ dịch vụ tại Doris.</p>
                        <button className="btn-verify-action" onClick={() => navigate('/')}>
                            <Home size={18} />
                            <span>Khám phá ngay</span>
                        </button>
                    </div>
                )}

                {status !== 'loading' && (
                    <button className="back-to-home" onClick={() => navigate('/')}>
                        Trở về trang chủ
                    </button>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail
