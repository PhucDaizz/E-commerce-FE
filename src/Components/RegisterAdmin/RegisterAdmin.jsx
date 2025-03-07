import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';

const RegisterAdmin = () => {
  const { registerAdmin } = useAuth();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       navigate('/');
//     }
//   }, []);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = 'Họ tên là bắt buộc';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      const dataSend = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
      };

      const response = await registerAdmin(dataSend);
      if (response.status === 200) {
        setFormData({ userName: '', email: '', password: '', confirmPassword: '', phone: '' });
        setErrors({});
      }
    }
  };

  return (
    <div className='Register container mt-4 border bg-white shadow' >
      <ToastContainer />
      <div className="row" style={{ minHeight: '700px' }}>
        <div className="col d-flex flex-column align-items-center justify-content-center">
          <h1>Đăng ký Admin</h1>
          <div className='border border-0 w-25 bg-black' style={{ height: '2px' }}></div>
        </div>
        <div className="col">
          <form onSubmit={handleSubmit} className="mb-4 mt-5 p-4">
            <div className='mb-3'>
              <label className='form-label'>Họ tên:</label>
              <input type="text" name='userName' className='form-control' value={formData.userName} onChange={handleChange} />
              {errors.userName && <div className="text-danger">{errors.userName}</div>}
            </div>
            <div className="mb-3">
              <label className='form-label'>Email:</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className='form-label'>Mật mã:</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label className='form-label'>Nhập lại mật mã:</label>
              <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
            </div>
            <div className="mb-3">
              <label className='form-label'>SĐT:</label>
              <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
            </div>
            <button type="submit" className="btn btn-outline-dark rounded-0 w-25">Đăng ký Admin</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
