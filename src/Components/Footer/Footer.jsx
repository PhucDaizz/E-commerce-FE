import React from 'react';
import './Footer.css';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Send, ArrowUp, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="modern-footer">
      {/* Upper Footer - Trust Badges */}
      <div className="footer-trust-bar">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <Truck size={24} />
              <span>Giao hàng nhanh chóng</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={24} />
              <span>Bảo mật thanh toán</span>
            </div>
            <div className="trust-item">
              <RotateCcw size={24} />
              <span>7 ngày đổi trả</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand-column">
              <Link to="/" className="footer-logo">
                PHUCDAI<span>.STORE</span>
              </Link>
              <p className="brand-philosophy">
                Nâng tầm phong cách sống với những sản phẩm thời trang cao cấp, tối giản và bền vững.
              </p>
              <div className="social-pill-group">
                <a href="https://facebook.com" className="social-pill" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="https://instagram.com" className="social-pill" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="https://youtube.com" className="social-pill" aria-label="Youtube">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links-column">
              <h4 className="footer-heading">Khám phá</h4>
              <ul className="footer-link-list">
                <li><Link to="/shop">Cửa hàng</Link></li>
                <li><Link to="/best-sellers">Bán chạy nhất</Link></li>
                <li><Link to="/new-arrivals">Hàng mới về</Link></li>
                <li><Link to="/collections">Bộ sưu tập</Link></li>
              </ul>
            </div>

            {/* Customer Support */}
            <div className="footer-links-column">
              <h4 className="footer-heading">Hỗ trợ khách hàng</h4>
              <ul className="footer-link-list">
                <li><Link to="/track-order">Theo dõi đơn hàng</Link></li>
                <li><Link to="/shipping-policy">Chính sách giao hàng</Link></li>
                <li><Link to="/refund-policy">Chính sách đổi trả</Link></li>
                <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="footer-contact-column">
              <h4 className="footer-heading">Liên hệ & Đăng ký</h4>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <MapPin size={18} className="text-muted" />
                  <span>Long Thành, Đồng Nai</span>
                </div>
                <div className="contact-info-item">
                  <Phone size={18} className="text-muted" />
                  <a href="tel:090974XXXX">090974XXXX</a>
                </div>
                <div className="contact-info-item">
                  <Mail size={18} className="text-muted" />
                  <a href="mailto:support@phucdai.com">support@phucdai.com</a>
                </div>
              </div>

              <div className="footer-newsletter-box">
                <p>Nhận thông báo ưu đãi sớm nhất</p>
                <div className="newsletter-input-wrap">
                  <input type="email" placeholder="Email của bạn" />
                  <button aria-label="Subscribe">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom-bar">
        <div className="container">
          <div className="bottom-bar-flex">
            <div className="copyright-text">
              &copy; {currentYear} PHUCDAI.
            </div>
            <div className="legal-links">
              <Link to="/privacy">Bảo mật</Link>
              <Link to="/terms">Điều khoản</Link>
            </div>
            <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;