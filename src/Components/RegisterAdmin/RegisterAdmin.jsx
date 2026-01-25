import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';
import { User, Mail, Lock, Phone, UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';
import './RegisterAdmin.css';

const RegisterAdmin = () => {
  const { registerAdmin } = useAuth();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = 'Họ tên là bắt buộc';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải từ 8 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (!formData.phone) {
      newErrors.phone = 'SĐT là bắt buộc';
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'SĐT không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      const dataSend = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
      };

      try {
        const response = await registerAdmin(dataSend);
        if (response.status === 200) {
          setFormData({ userName: '', email: '', password: '', confirmPassword: '', phone: '' });
          setErrors({});
        }
      } catch (error) {
        console.error("Registration error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className='register-admin-page'>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="register-admin-card">
        {/* Left Side - Visual Decoration */}
        <div className="register-admin-left">
          <div className="admin-status-badge">
            <ShieldCheck size={48} strokeWidth={1.5} />
          </div>
          <h1>Quản Trị Viên</h1>
          <p>Thiết lập tài khoản quản trị mới để bắt đầu quản lý hệ thống cửa hàng của bạn.</p>
        </div>

        {/* Right Side - Form */}
        <div className="register-admin-right">
          <div className="admin-form-header">
            <h2>Đăng Ký Tài Khoản</h2>
            <p>Vui lòng điền đầy đủ các thông tin bên dưới</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className='form-field full-width'>
                <label>Họ và tên</label>
                <div className="input-wrapper">
                  <i><User size={18} /></i>
                  <input
                    type="text"
                    name='userName'
                    placeholder="Nhập họ và tên admin"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </div>
                {errors.userName && <span className="error-text">{errors.userName}</span>}
              </div>

              <div className="form-field full-width">
                <label>Email liên hệ</label>
                <div className="input-wrapper">
                  <i><Mail size={18} /></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label>Mật mã</label>
                <div className="input-wrapper">
                  <i><Lock size={18} /></i>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-field">
                <label>Xác nhận</label>
                <div className="input-wrapper">
                  <i><ShieldCheck size={18} /></i>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="form-field full-width">
                <label>Số điện thoại</label>
                <div className="input-wrapper">
                  <i><Phone size={18} /></i>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="09xx xxx xxx"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <button type="submit" className="admin-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span>Khởi tạo tài khoản Admin</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
