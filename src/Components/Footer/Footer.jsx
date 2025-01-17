import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div className='footer'>
      <div className="container">
        <div className="row">
            <div className="col">
                <div className="infor-store">
                    <p className='title'>HỆ THỐNG CỬA HÀNG</p>
                    <div className="detail">
                        <ul>
                            <li>Long Thành, Đồng Nai</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="infor-contact">
                    <p className='title'>THÔNG TIN LIÊN HỆ</p>
                    <div className="detail">
                        <ul>    
                            <li>Số CSKH: 090974XXXX</li>
                            <li>Gmail: Exemple@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="infor-follow">
                    <div className="title">FOLLOW US ON SOCIAL MEDIA</div>
                    <div className="detail mt-2">
                        <a href='https://www.google.com'><i className="bi bi-facebook"></i></a>
                        <a href=''><i className="bi bi-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
