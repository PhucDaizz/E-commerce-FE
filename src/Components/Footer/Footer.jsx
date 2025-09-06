import React from 'react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='footer mt-5'>
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Store Information */}
            <div className="footer-section">
              <div className="section-header">
                <i className="bi bi-geo-alt-fill"></i>
                <h3 className='section-title text-white'>Hệ thống cửa hàng</h3>
              </div>
              <div className="section-content">
                <div className="store-location">
                  <div className="location-item">
                    <i className="bi bi-shop"></i>
                    <div className="location-details">
                      <span className="location-name">Cửa hàng chính</span>
                      <span className="location-address">Long Thành, Đồng Nai</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="footer-section">
              <div className="section-header">
                <i className="bi bi-telephone-fill"></i>
                <h3 className='section-title text-white'>Thông tin liên hệ</h3>
              </div>
              <div className="section-content">
                <div className="contact-item">
                  <i className="bi bi-headset"></i>
                  <div className="contact-details">
                    <span className="contact-label">Hotline CSKH</span>
                    <a href="tel:090974XXXX" className="contact-value">090974XXXX</a>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="bi bi-envelope-fill"></i>
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <a href="mailto:exemple@gmail.com" className="contact-value">exemple@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="footer-section">
              <div className="section-header">
                <i className="bi bi-share-fill"></i>
                <h3 className='section-title text-white'>Kết nối với chúng tôi</h3>
              </div>
              <div className="section-content">
                <p className="social-description">
                  Theo dõi chúng tôi để cập nhật những tin tức mới nhất
                </p>
                <div className="social-links">
                  <a href='https://www.facebook.com' className="social-link facebook" aria-label="Facebook">
                    <i className="bi bi-facebook"></i>
                    <span>Facebook</span>
                  </a>
                  <a href='https://www.instagram.com' className="social-link instagram" aria-label="Instagram">
                    <i className="bi bi-instagram"></i>
                    <span>Instagram</span>
                  </a>
                  <a href='https://www.youtube.com' className="social-link youtube" aria-label="YouTube">
                    <i className="bi bi-youtube"></i>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="footer-section">
              <div className="section-header">
                <i className="bi bi-bell-fill"></i>
                <h3 className='section-title text-white'>Đăng ký nhận tin</h3>
              </div>
              <div className="section-content">
                <p className="newsletter-description">
                  Đăng ký để nhận thông báo về sản phẩm mới và ưu đãi đặc biệt
                </p>
                <div className="newsletter-form">
                  <div className="input-group">
                    <input 
                      type="email" 
                      placeholder="Nhập email của bạn..."
                      className="newsletter-input"
                    />
                    <button className="newsletter-button" type="button">
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} PhucDai. Bản quyền trang web thuộc về PhucDai.</p>
            </div>
            <div className="footer-links">
              <a href="/privacy">Chính sách bảo mật</a>
              <a href="/terms">Điều khoản sử dụng</a>
              <a href="/support">Hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer