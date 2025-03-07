import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import './ResetPassword.css'; // Import CSS nếu dùng

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const query = useQuery();
  const token = query.get('token');
  const email = query.get('email');
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    const data = {
      "password": newPassword,
      "confirmPassword": confirmPassword,
      "email": email,
      "token": token
    };

    await resetPassword(data);
  };

  return (
    <div className='reset-password d-flex justify-content-center align-items-center vh-100'>
      <ToastContainer />
      <div className='container w-100'>
        <div className='row justify-content-center'>
          <div className='col-md-8 col-lg-6'> {/* Kích thước lớn hơn */}
            <form className='border p-4 rounded shadow bg-white' onSubmit={handleResetPassword}>
              <h4 className='text-center mb-3'>Đặt lại mật khẩu</h4>
              <p className='mb-1'>Mật khẩu mới</p>
              <input 
                type="password" 
                className='form-control mb-3'
                placeholder='Nhập mật khẩu mới'
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required 
              />

              <p className='mb-1'>Xác nhận lại mật khẩu</p>
              <input 
                type="password" 
                className='form-control mb-3'
                placeholder='Nhập lại mật khẩu'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required 
              />

              <button className='btn btn-outline-dark w-100 mt-3 btn-lg'>Đặt lại mật khẩu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;