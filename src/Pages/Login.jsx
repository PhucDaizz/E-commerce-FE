import React, { useEffect, useState } from 'react';
import './CSS/Login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ToastContainer } from 'react-toastify';

const Login = ({ onPage, setHideRegister, setIsSliding }) => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { handleLogin, forgotPassword } = useAuth();
  const [forgetPass, setForgetPass] = useState(false);

  useEffect(() => {
    if (location.state?.forgetPassword) {
      setForgetPass(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await handleLogin(email, password);
    if (response === true) {
      return navigate('/admin');
    }
    navigate('/');
    return window.location.reload();
  };

  const hideLogin = () => {
    if (setHideRegister && setIsSliding) {
      setIsSliding(false);
      setTimeout(() => {
        setHideRegister(false);
      }, 300);
    }
  }

  const navigateToResetPass = () => {
    setForgetPass(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  }

  // Check if it should render as a standalone page or embedded
  const isEmbedded = !!setHideRegister;

  const renderContent = () => (
    <>
      <ToastContainer />
      {onPage ? (
        <div className='row login-inner-row'>
          {/* Cột tiêu đề */}
          <div className="col-md-5 d-flex flex-column align-items-center justify-content-center login-title-section">
            <h1>{forgetPass ? 'Khôi phục' : 'Đăng nhập'}</h1>
            <div className='title-underline'></div>
          </div>
          {/* Cột form */}
          <div className="col-md-7 d-flex flex-column align-items-center justify-content-center p-4 p-md-5">
            {
              forgetPass ? (
                <div className='w-100'>
                  <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                      <label htmlFor="email">Địa chỉ Email</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className='mt-4'>
                      <button type="submit" className="btn-premium btn-black mb-3">
                        Gửi mã xác nhận
                      </button>
                      <button
                        type="button"
                        className='forgot-link w-100 text-center border-0 bg-transparent'
                        onClick={() => setForgetPass(false)}
                      >
                        Quay lại đăng nhập
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='w-100'>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <span className='forgot-link' onClick={() => setForgetPass(true)}>Quên mật khẩu?</span>
                  </div>

                  <button type="submit" className="btn-premium btn-black">Đăng nhập</button>

                  <div className='mt-3'>
                    <button
                      type="button"
                      className="google-login-button"
                      onClick={() => {
                        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google-login`;
                      }}
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        style={{ width: '18px', marginRight: '10px' }}
                      />
                      Đăng nhập với Google
                    </button>
                  </div>
                  {
                    (location.pathname === '/register' || isEmbedded) && (
                      <div className='mt-4 text-center'>
                        <p className='forgot-link'
                          onClick={hideLogin}
                          style={{ cursor: 'pointer' }}>
                          Chưa có tài khoản? <strong className='text-black'>Đăng ký ngay</strong>
                        </p>
                      </div>
                    )
                  }
                </form>
              )
            }
          </div>
        </div>
      ) : (
        <div className="login-modal-box">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Đăng nhập</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Đăng nhập</button>
          </form>
        </div>
      )
      }
    </>
  );

  if (isEmbedded) return renderContent();

  return (
    <div className="login-form-container standalone-page">
      {renderContent()}
    </div>
  );
};

export default Login;
