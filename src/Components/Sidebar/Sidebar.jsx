import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { useAdmin } from '../../Context/AdminContext';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const { hideSideBar, handleHideSideBar } = useAdmin();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className={`sidebar bg-white text-dark ${hideSideBar ? 'hide' : ''}`}>
      <div className="sidebar-header p-3 d-flex align-items-center justify-content-between">
        <div className="col-9">
          <img
            className="img-fluid fit-img"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS99TXM-MEQUoSk7E7kmf2OB9HNW6bplfFOiQ&s"
            alt="Logo"
          />
        </div>
        <div className="col-3 d-flex justify-content-center">
          <i
            onClick={() => handleHideSideBar()}
            className="bi bi-list fs-3 cursor-pointer hover-icon"
          ></i>
        </div>
      </div>

      <div className="menu px-3">
        {/* Dashboard */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('dashboard')}
        >
          <i className="bi bi-house-door"></i>
          <Link to="/admin" className="text-dark text-decoration-none">Dashboard</Link>
        </div>

        {/* Ecommerce */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('ecommerce')}
        >
          <i className="bi bi-cart"></i>
          <span>Sản phẩm</span>
        </div>
        {openMenus.ecommerce && (
          <div className="submenu ps-4 d-flex flex-column gap-1">
            <Link to="/admin/products/add" className="text-dark text-decoration-none py-1 hover-link">Thêm sản phẩm</Link>
            <Link to="/admin/products/list" className="text-dark text-decoration-none py-1 hover-link">DS sản phẩm</Link>
          </div>
        )}

        {/* Category */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('category')}
        >
          <i className="bi bi-archive"></i>
          <span>Danh mục SP</span>
        </div>
        {openMenus.category && (
          <div className="submenu ps-4 d-flex flex-column gap-1">
            <Link to="/admin/categories/list" className="text-dark text-decoration-none py-1 hover-link">Danh sách</Link>
          </div>
        )}

        {/* Order */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('order')}
        >
          <i className="bi bi-journal-text"></i>
          <span>Hoá đơn</span>
        </div>
        {openMenus.order && (
          <div className="submenu ps-4 d-flex flex-column gap-1">
            <Link to="/admin/orders/list" className="text-dark text-decoration-none py-1 hover-link">Danh sách</Link>
          </div>
        )}

        {/* User */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('user')}
        >
          <i className="bi bi-person"></i>
          <span>Người dùng</span>
        </div>
        {openMenus.user && (
          <div className="submenu ps-4 d-flex flex-column gap-1">
            <Link to="/admin/user/list" className="text-dark text-decoration-none py-1 hover-link">DS người dùng</Link>
            <Link to="/admin/user/add-admin" className="text-dark text-decoration-none py-1 hover-link">Thêm Admin</Link>
          </div>
        )}

        {/* Voucher */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('voucher')}
        >
          <i className="bi bi-ticket-perforated"></i>
          <span>Mã giảm</span>
        </div>
        {openMenus.voucher && (
          <div className="submenu ps-4 d-flex flex-column gap-1">
            <Link to="/admin/voucher/list" className="text-dark text-decoration-none py-1 hover-link">DS mã giảm</Link>
            <Link to="/admin/voucher/add" className="text-dark text-decoration-none py-1 hover-link">Thêm mã giảm</Link>
          </div>
        )}


        {/* Banner */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('banner')}
        >
          <i className="bi bi-image"></i>
          <span>Banner</span>
        </div>
        {openMenus.banner && (
          <div className="submenu ps-4 d-flex flex-column gap-1">
            <Link to="/admin/banner/list" className="text-dark text-decoration-none py-1 hover-link">DS Banner</Link>
            <Link to="/admin/banner/add" className="text-dark text-decoration-none py-1 hover-link">Thêm Banner</Link>
          </div>
        )}
          

        {/* Settings */}
        <div
          className="menu-item py-2 px-3 d-flex align-items-center gap-2 rounded hover-bg"
          onClick={() => toggleMenu('settings')}
        >
          <i className="bi bi-gear"></i>
          <span>Settings</span>
        </div>
        {openMenus.settings && (
          <div className="submenu ps-4 d-flex flex-column gap-1">
            <Link to="/profile" className="text-dark text-decoration-none py-1 hover-link">Profile</Link>
            <Link to="/preferences" className="text-dark text-decoration-none py-1 hover-link">Preferences</Link>
            <Link to="chat"> Chat</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;