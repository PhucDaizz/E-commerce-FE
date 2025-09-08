import React, { useEffect, useState } from 'react';
import './CSS/Login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ToastContainer } from 'react-toastify';
import axios from '../api/axios';

const Login = ({ onPage, setHideRegister, setIsSliding}) => {

  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {handleLogin, forgotPassword} = useAuth();
  const [forgetPass, setForgetPass] = useState(false);

  useEffect(() => {
    if (location.state?.forgetPassword) {
      setForgetPass(true);
    }
  }, [location]);


  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await handleLogin(email, password);
    if (response === true) {
      return navigate('/admin');
    }
    navigate('/');
    return window.location.reload();
  };

  const hideLogin = () => {
    setHideRegister(false);
    setIsSliding(false);
  }

  const navigateToResetPass = () => {
    navigate('/login', { state: { forgetPassword: true } });
    setForgetPass(true);
  };

  const handleResetPassword = async(e) => {
    e.preventDefault();
    await forgotPassword(email);
  }

  // const handleGoogleLogin = async () => {
  //   try {
  //     const res = await axios.get("/auth/google-login", {
  //       headers: { "ngrok-skip-browser-warning": "true" }
  //     });
  //     // Giả sử backend trả về { redirectUrl: "https://accounts.google.com/..." }
  //     window.location.href = res.data.redirectUrl;
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //   }
  // };

  return (
    <div className="login-form-container"> 
      <ToastContainer/>
      { onPage ? (
          <div className='row' style={{ minHeight: '700px' }}>
            {/* Cột tiêu đề được đặt lên trước */}
            <div className="col d-flex flex-column align-items-center justify-content-center order-md-2 order-1"> {/* order-md-2: normal order on desktop, order-1: first on mobile */}
                <h1>{forgetPass ? 'Đặt lại mật mã' : 'Đăng nhập tài khoản'}</h1>
                <div className='border border-0 w-25 bg-black' style={{ height: '2px' }}></div>
            </div>
            {/* Cột form được đặt sau */}
            <div className="col border-end d-flex flex-column align-items-center justify-content-center order-md-1 order-2"> {/* order-md-1: normal order on desktop, order-2: second on mobile */}
              {
                forgetPass ? (
                  <div className='w-75'>
                    <form onSubmit={handleResetPassword}>
                      <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className='d-flex justify-content-between align-items-center mt-3'>
                        <button 
                          type="button" 
                          className='border-0 bg-white text-primary' 
                          onClick={() => setForgetPass(false)}
                        >
                          Đăng nhập
                        </button>
                        <button type="submit" className="btn btn-outline-dark rounded-0 w-50">
                          Gửi yêu cầu
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='w-75'>
                    <div className="form-group"> 
                      <label htmlFor="email">Email:</label> 
                      <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      /> 
                    </div> 
                    <div className="form-group"> 
                      <label htmlFor="password">Mật khẩu:</label> 
                      <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                      /> 
                    </div> 
                    <div className="d-flex">
                      <p className='mt-1 text-primary' style={{cursor: 'pointer'}} onClick={() => setForgetPass(true)}>Quên mật khẩu?</p>
                      <button type="submit" className="btn btn-outline-dark rounded-0 w-25">Đăng nhập</button> 
                    </div>
                    <div className='d-flex justify-content-center align-items-center mt-3'>
                      <button 
                        className="google-login-button" 
                        onClick={() => {
                          window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google-login`; // URL API backend
                        }}
                      >
                        <img 
                          src="https://developers.google.com/identity/images/g-logo.png" 
                          alt="Google logo" 
                          style={{ width: '20px', marginRight: '8px' }} 
                        />
                        Đăng nhập với Google
                      </button>
                    </div>
                    {
                      location.pathname === '/register' && (
                        <p className='mt-2 icon-link icon-link-hv d-flex align-items-center' 
                          onClick={() => hideLogin()}
                          style={{ cursor: 'pointer' }}>
                          <i className="bi bi-arrow-bar-left"></i>Đăng ký tài khoản
                        </p>
                      )
                    }
                  </form>
                )
              }
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit} className="login-form"> 
              <h2>Đăng nhập tài khoản</h2> 
              <div className="form-group"> 
                <label htmlFor="email">Email:</label> 
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                /> 
              </div> 
              <div className="form-group"> 
                <label htmlFor="password">Mật khẩu:</label> 
                <input 
                  type="password" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                /> 
              </div> 
              <div className="d-flex flex-column">
                <div className="">
                  <p className='mt-1 text-primary' 
                    style={{cursor: 'pointer'}} 
                    onClick={() => {
                      navigateToResetPass();
                    }}>Quên mật khẩu?</p>
                  <button type="submit" className="login-button">Đăng nhập</button> 
                </div>
              </div>
            </form> 
            <div className='d-flex justify-content-center align-items-center mt-3'>
              <button 
                className="google-login-button" 
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google-login`; // URL API backend
                }}
              >
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google logo" 
                  style={{ width: '20px', marginRight: '8px' }} 
                />
                Đăng nhập với Google
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Login;
