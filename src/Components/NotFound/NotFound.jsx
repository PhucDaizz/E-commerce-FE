import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-wrapper">
      <div className="not-found-inner">
        {/* Visual Element */}
        <div className="not-found-visual">
          <div className="big-404">404</div>
          <div className="not-found-icon-overlay">
            <Search size={40} strokeWidth={1.5} />
          </div>
        </div>

        {/* Info Section */}
        <div className="not-found-info">
          <h1>Trang không tìm thấy</h1>
          <p>
            Có vẻ như liên kết đã bị hỏng hoặc trang này không còn tồn tại trên hệ thống của chúng tôi.
          </p>

          <div className="not-found-buttons">
            <Link to="/" className="nf-btn nf-btn-primary">
              <Home size={18} />
              <span>Về trang chủ</span>
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="nf-btn nf-btn-secondary"
            >
              <ArrowLeft size={18} />
              <span>Quay lại trang cũ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;