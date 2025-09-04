import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleLoginGG, login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isProcessing) return;
    
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    // console.log('Auth callback - token:', token ? 'exists' : 'null');
    // console.log('Auth callback - refreshToken:', refreshToken ? 'exists' : 'null');
    // console.log('Auth callback - error:', error);

    if (error) {
      console.error('Login error:', error);
      setIsProcessing(true);
      // Xóa URL params và chuyển hướng
      window.history.replaceState({}, document.title, '/login');
      navigate('/login', { replace: true });
      return;
    }

    if (token && refreshToken) {
      setIsProcessing(true);
      
      const processLogin = async () => {
        try {
          const isAdmin = await handleLoginGG(token, refreshToken);
          
          window.history.replaceState({}, document.title, '/');
          
          if (isAdmin) {
            navigate('/admin', { replace: true });
          } else {
            login(token, refreshToken);
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error processing login:', error);
          window.history.replaceState({}, document.title, '/login');
          navigate('/login', { replace: true });
        }
      };

      processLogin();
    } else {
      setIsProcessing(true);
      window.history.replaceState({}, document.title, '/login');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, handleLoginGG, login, isProcessing]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh' 
    }}>
      <h1>Đang xử lý đăng nhập...</h1>
      <p>Vui lòng chờ trong giây lát.</p>
    </div>
  );
};

export default AuthCallback;