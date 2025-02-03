import React, { useEffect, useState } from 'react'
import './AdminNavbar.css'
import { useAdmin } from '../../Context/AdminContext';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('')
    const {hideSideBar, handleHideSideBar} = useAdmin();
    const {isAdminLogin, logout} = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // handleSearch();
        }
    }

    useEffect(() => {
        const checkAdmin = async () => {
            const result = await isAdminLogin();
            console.log("Admin check result:", result);
            setIsAdmin(result);
            if (!result) {
                logout(); 
                navigate('/'); // Chỉ điều hướng nếu không có quyền admin
            }
        };
        checkAdmin();
    }, [navigate]); // Chỉ thêm navigate vào dependencies
    
    const handleLogout = () => {
        logout();
        navigate('/');
    }



    return (
        <div className='navbar'>
        <div className='navbar-container container'>
            <div className="navbar-actions">
                {
                    hideSideBar
                    ? 
                    <i onClick={() => handleHideSideBar()} className="bi bi-list justify-content-center align-content-center"></i>
                    : <></>
                }
                <div className="search-container">
                    <i className="bi bi-search" ></i>
                    <input 
                        type='search'
                        placeholder='Tìm kiếm sản phẩm'
                        className='search-input'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
            <div className="notify">

            </div>
            <div className="profile">
                <span>Phucs Dai</span>
                <button className="auth-button logout" onClick={() => handleLogout()}>
                    Đăng xuất
                </button>
            </div>
        </div>
        </div>
  )
}

export default AdminNavbar
