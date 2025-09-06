// components/NotFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <AlertTriangle size={64} />
        </div>
        <h1 className="not-found-title">404 - Trang không tồn tại</h1>
        <p className="not-found-message">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button primary">
            <Home size={20} />
            <span>Về trang chủ</span>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="not-found-button secondary"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;