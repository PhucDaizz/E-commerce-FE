import React, { useEffect, useState } from 'react';
import './CSS/Regster.css'
import { useAuth } from '../Context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Login from '../Pages/Login'

const Register = () => {

    const { register } = useAuth()
    const navigation = useNavigate();
    const [hideRegister, setHideRegister] = useState(false);
    const [isSliding, setIsSliding] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigation('/')
        }
    }, [])

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
        const userNameRegex = /^[a-zA-Z\sÀ-ỹ]+$/;
        if (!formData.userName) {
            newErrors.userName = 'Họ tên là bắt buộc';
        } else if (!userNameRegex.test(formData.userName)) {
            newErrors.userName = 'Họ tên không hợp lệ';
        }
        if (!formData.email) newErrors.email = 'Email là bắt buộc';
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Mật khẩu không đủ mạnh';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        const phoneRegex = /^0\d{9}$/;
        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'SĐT không hợp lệ';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const dataSend = {
                "userName": formData.userName,
                "email": formData.email,
                "password": formData.password,
                "phoneNumber": formData.phone
            }
            const response = await register(dataSend)
            if (response.status === 200) {
                navigation('/');
            }
        }
    };

    const handleShowLogin = () => {
        setIsSliding(true);
        setTimeout(() => {
            setHideRegister(true);
            setIsSliding(false); // Reset sliding state to make login visible
        }, 400);
    };

    return (
        <div className='Register'>
            <ToastContainer />
            <div className="container">
                <div className={`register-main-card ${isSliding ? 'sliding' : ''}`}>
                    {!hideRegister ? (
                        <div className="row g-0">
                            <div className="col-md-5 d-flex flex-column align-items-center justify-content-center border-end bg-light-premium">
                                <h1>Chào mừng</h1>
                                <div className='title-underline-premium'></div>
                                <p className="mt-3 text-center text-muted px-4">Đăng ký thành viên để nhận ngay nhiều ưu đãi đặc biệt.</p>
                            </div>
                            <div className="col-md-7 p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className='form-label'>Họ tên</label>
                                        <input type="text" name='userName' placeholder="Họ và tên" className='form-control' value={formData.userName} onChange={handleChange} />
                                        {errors.userName && <div className="text-danger">{errors.userName}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Email</label>
                                        <input type="email" name="email" placeholder="example@email.com" className="form-control" value={formData.email} onChange={handleChange} />
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label className='form-label'>Mật mã</label>
                                            <input type="password" name="password" placeholder="••••••••" className="form-control" value={formData.password} onChange={handleChange} />
                                        </div>
                                        <div className="col-6">
                                            <label className='form-label'>Xác nhận</label>
                                            <input type="password" name="confirmPassword" placeholder="••••••••" className="form-control" value={formData.confirmPassword} onChange={handleChange} />
                                        </div>
                                        {(errors.password || errors.confirmPassword) && <div className="text-danger px-3">{errors.password || errors.confirmPassword}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className='form-label'>Số điện thoại</label>
                                        <input type="tel" name="phone" placeholder="0xxxxxxxxx" className="form-control" value={formData.phone} onChange={handleChange} />
                                        {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                    </div>
                                    <button type="submit" className="btn-register-premium">Tạo tài khoản</button>
                                </form>
                                <button className='link-underline w-100 mt-3' onClick={handleShowLogin}>
                                    Đã có tài khoản? <strong className="text-black">Đăng nhập ngay</strong>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="login-embedded-container slide-in">
                            <Login onPage={true} setHideRegister={setHideRegister} setIsSliding={setIsSliding} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;