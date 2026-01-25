import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { Lock, ShieldCheck } from 'lucide-react';
import './ResetPassword.css';

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
    <div className='reset-password-page'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='reset-password-card'>
        <div className="reset-header">
          <div className="reset-icon-wrapper mb-4 d-flex justify-content-center">
            <div className="p-3 bg-light rounded-circle">
              <ShieldCheck size={40} strokeWidth={1.5} className="text-dark" />
            </div>
          </div>
          <h2>Đặt lại mật khẩu</h2>
          <p>Vui lòng tạo mật khẩu mới an toàn để bảo vệ tài khoản của bạn.</p>
        </div>

        <form onSubmit={handleResetPassword}>
          <div className="premium-form-group">
            <label>Mật khẩu mới</label>
            <div className="position-relative">
              <input
                type="password"
                className='premium-input'
                placeholder='Nhập mật khẩu mới'
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
          </div>

          <div className="premium-form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="position-relative">
              <input
                type="password"
                className='premium-input'
                placeholder='Nhập lại mật khẩu'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>
          </div>

          <button type="submit" className='btn-premium-action d-flex align-items-center justify-content-center gap-2'>
            <Lock size={18} />
            <span>Cập nhật mật khẩu</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;