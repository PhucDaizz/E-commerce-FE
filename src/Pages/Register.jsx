import React, { useEffect, useState } from 'react';
import './CSS/Regster.css'
import { useAuth } from '../Context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Login  from '../Pages/Login'

const Register = () => {

const {register} = useAuth()
const navigation = useNavigate();
const [hideRegister, setHideRegister] = useState(false);
const [isSliding, setIsSliding] = useState(false);

useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
        navigation('/')
    }
}, [])

// State to hold form data
const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
});

// State to hold error messages
const [errors, setErrors] = useState({});

// Handle input changes
const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
};

// Validate form data
const validateForm = () => {
    const newErrors = {};

    // Kiểm tra email
    if (!formData.email) {
    newErrors.email = 'Email là bắt buộc';
    }

    // Kiểm tra mật khẩu
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
    newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (!passwordRegex.test(formData.password)) {
    newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất 1 chữ in hoa, 1 chữ số và 1 ký tự đặc biệt';
    }

    // Kiểm tra nhập lại mật khẩu
    if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^0\d{9}$/;
    if (!formData.phone) {
    newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!phoneRegex.test(formData.phone)) {
    newErrors.phone = 'Số điện thoại phải có 10 số và bắt đầu bằng số 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
};


// Handle form submission
const handleSubmit = async(event) => {
    event.preventDefault(); // Prevent default form submission
    if (validateForm()) {

    // Here you can handle the form submission, e.g., send data to an API
    const dataSend = {
        "email": formData.email,
        "password": formData.password,
        "phoneNumber": formData.phone
      }

    const response = await register(dataSend)

    if(response.status === 200) {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
        });
        // Reset form after submission
        setErrors({});
        navigation('/');
    }
    }
};

const handleShowLogin = () => {
    setIsSliding(true);
    setTimeout(() => {
    setHideRegister(true);
    }, 500); // Đợi animation hoàn thành
};

return (
    <div className='Register container mt-4' style={{ minHeight: '700px' }}>
    <ToastContainer/>
    <div className={`register-content ${isSliding ? 'slide-out' : ''}`}>

        <div className="row" style={{ minHeight: '700px' }}>
            {
                !hideRegister && (
                    <div className="col d-flex flex-column align-items-center justify-content-center border-end">
                        <h1>Tạo tài khoản</h1>
                        <div className='border border-0 w-25 bg-black'
                            style={{ height: '2px' }}
                        ></div>
                    </div>
                )
            }

            {
                !hideRegister && (
                    <div className="col">
                        <form onSubmit={handleSubmit} className=" mb-4 mt-5 p-4">
                            <div className="mb-3">
                            <label className='form-label'>Email:</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                            <label className='form-label'>Mật mã:</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <div className="text-danger">{errors.password}</div>}
                            </div>
                            <div className="mb-3">
                            <label className='form-label'>Nhập lại mật mã:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                            </div>
                            <div className="mb-3">
                            <label className='form-label'>SĐT:</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <div className="text-danger">{errors.phone}</div>}
                            </div>
                            <button type="submit" className="btn btn-outline-dark rounded-0 w-25" >Đăng ký</button>
                        </form>
                        <button className='text-primary link-underline bg-white border-0 ms-4' 
                                onClick={handleShowLogin}
                                style={{position: 'relative', top: '-80px'}}
                        >Tôi đã có tài khoản</button>
                    </div>
                )
            }

            <div className={`login-content ${hideRegister ? 'slide-in' : ''}`}>
                {hideRegister && <Login onPage={true} setHideRegister={setHideRegister} setIsSliding={setIsSliding} />}
            </div>

        </div>
    
    </div>
    </div>
);
}

export default Register;