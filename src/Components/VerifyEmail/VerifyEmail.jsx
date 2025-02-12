import React, { useEffect } from 'react'
import './VerifyEmail.css'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const VerifyEmail = () => {

    const [status, setStatus] = useState('loading');
    const [searchParams] = useSearchParams();
    const navigation = useNavigate();
    const {verifyEmail} = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if(!token  || !status) {
            setStatus('error')
            return;
        } 

        handleVerifyEmail(userId, token);
    },[searchParams])

    const handleVerifyEmail = async(userId, token) => {
        const response = await verifyEmail(userId,token);
        setStatus(response)
    }



    return (
        <div className='verifyemail'>
            {status === 'loading' && (
                <div className="status ">
                    <div className="loader loading"></div>
                    <h3>Đang xác nhận...</h3>
                </div>
            )}
            {status === 'error' && (
                <div className="status error ">
                    <i className="bi bi-x-circle"></i>
                    <h3>Đã xảy ra lỗi khi xác nhận email.</h3>
                    <p>Vui lòng thử lại</p>
                </div>
            )}
            {status === 'success' && (
                <div className="status success">
                    <i className="bi bi-check-circle"></i>
                    <h1>Xác nhận email thành công!</h1>
                    <button className='btn btn-outline-success d-flex m-auto' onClick={() => navigation('/')}>Trở về</button>
                </div>
            )}
        </div>
    )
}

export default VerifyEmail
