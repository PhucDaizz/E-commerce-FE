import React, { useEffect, useState } from 'react'
import './AdminNavbar.css'
import { useAdmin } from '../../Context/AdminContext';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const {hideSideBar, handleHideSideBar} = useAdmin();
    const {isAdminLogin, logout, inforUser} = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [notificationCount, setNotificationCount] = useState(5); // Số thông báo mẫu
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const result = await isAdminLogin();
            setIsAdmin(result);
            if (!result) {
                logout(); 
                navigate('/');
            }
        };
        checkAdmin();
    }, [navigate]);
    
    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    }

    // Hàm này sẽ được gọi từ component cha để cập nhật thông báo
    const updateNotificationCount = (count) => {
        setNotificationCount(count);
    }

    return (
        <div className='navbar'>
            <div className='navbar-container container'>
                <div className="navbar-left">
                    {hideSideBar && (
                        <i 
                            onClick={() => handleHideSideBar()} 
                            className="bi bi-list menu-toggle"
                        ></i>
                    )}
                    <div className="logo-container">
                        <img 
                            src="https://yeuchaybo.com/wp-content/uploads/2014/09/adidas-logo.jpg" 
                            alt="Admin Logo" 
                            className="admin-logo"
                            onClick={() => navigate('/admin')}
                        />
                        <span className="admin-title"></span>
                    </div>
                </div>

                <div className="navbar-right">
                    {/* <div className="notification-container">
                        <div className="notification-bell" onClick={toggleNotifications}>
                            <i className="bi bi-bell"></i>
                            {notificationCount > 0 && (
                                <span className="notification-badge">{notificationCount}</span>
                            )}
                        </div>
                        
                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="notification-header">
                                    <h4>Thông báo</h4>
                                    <span className="mark-all-read">Đánh dấu đã đọc</span>
                                </div>
                                <div className="notification-list">
                                    <div className="notification-item unread">
                                        <i className="bi bi-exclamation-circle text-warning"></i>
                                        <div className="notification-content">
                                            <p>Có đơn hàng mới cần xử lý</p>
                                            <small>2 phút trước</small>
                                        </div>
                                    </div>
                                    <div className="notification-item unread">
                                        <i className="bi bi-person-plus text-info"></i>
                                        <div className="notification-content">
                                            <p>Người dùng mới đăng ký</p>
                                            <small>15 phút trước</small>
                                        </div>
                                    </div>
                                    <div className="notification-item">
                                        <i className="bi bi-box text-success"></i>
                                        <div className="notification-content">
                                            <p>Sản phẩm đã được cập nhật</p>
                                            <small>1 giờ trước</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="notification-footer">
                                    <Link to="/admin/notifications">Xem tất cả thông báo</Link>
                                </div>
                            </div>
                        )}
                    </div> */}

                    <div className="profile-container">
                        <div className="profile-info">
                            <div className="avatar">
                                <i className="bi bi-person-circle"></i>
                            </div>
                            <div className="user-details">
                                <span 
                                    className="user-name" 
                                    onClick={() => navigate('/admin/account')}
                                >
                                    {inforUser.userName}
                                </span>
                                <small className="user-role">Administrator</small>
                            </div>
                        </div>
                        <button className="logout-button" onClick={() => handleLogout()}>
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar