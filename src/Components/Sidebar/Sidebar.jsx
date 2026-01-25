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
    <div className={`sidebar ${hideSideBar ? 'hide' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-wrapper">
          <img
            className="sidebar-logo"
            src="/images/logo.jpg"
            alt="Logo"
          />
        </div>
        <button
          className="toggle-btn"
          onClick={() => handleHideSideBar()}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="sidebar-content">
        {/* Dashboard */}
        <div className={`menu-group ${openMenus.dashboard ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('dashboard')}
          >
            <div className="menu-title">
              <i className="bi bi-grid-fill"></i>
              <Link to="/admin">Dashboard</Link>
            </div>
          </div>
        </div>

        {/* Ecommerce */}
        <div className={`menu-group ${openMenus.ecommerce ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('ecommerce')}
          >
            <div className="menu-title">
              <i className="bi bi-bag-fill"></i>
              <span>Sản phẩm</span>
            </div>
            <i className={`bi bi-chevron-right arrow ${openMenus.ecommerce ? 'open' : ''}`}></i>
          </div>
          {openMenus.ecommerce && (
            <div className="submenu">
              <Link to="/admin/products/add" className="submenu-link">Thêm sản phẩm</Link>
              <Link to="/admin/products/list" className="submenu-link">DS sản phẩm</Link>
            </div>
          )}
        </div>

        {/* Category */}
        <div className={`menu-group ${openMenus.category ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('category')}
          >
            <div className="menu-title">
              <i className="bi bi-collection-fill"></i>
              <span>Danh mục</span>
            </div>
            <i className={`bi bi-chevron-right arrow ${openMenus.category ? 'open' : ''}`}></i>
          </div>
          {openMenus.category && (
            <div className="submenu">
              <Link to="/admin/categories/list" className="submenu-link">Danh sách</Link>
            </div>
          )}
        </div>

        {/* Order */}
        <div className={`menu-group ${openMenus.order ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('order')}
          >
            <div className="menu-title">
              <i className="bi bi-receipt"></i>
              <span>Hoá đơn</span>
            </div>
            <i className={`bi bi-chevron-right arrow ${openMenus.order ? 'open' : ''}`}></i>
          </div>
          {openMenus.order && (
            <div className="submenu">
              <Link to="/admin/orders/list" className="submenu-link">Danh sách</Link>
            </div>
          )}
        </div>

        {/* User */}
        <div className={`menu-group ${openMenus.user ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('user')}
          >
            <div className="menu-title">
              <i className="bi bi-people-fill"></i>
              <span>Người dùng</span>
            </div>
            <i className={`bi bi-chevron-right arrow ${openMenus.user ? 'open' : ''}`}></i>
          </div>
          {openMenus.user && (
            <div className="submenu">
              <Link to="/admin/user/list" className="submenu-link">DS người dùng</Link>
              <Link to="/admin/user/add-admin" className="submenu-link">Thêm Admin</Link>
            </div>
          )}
        </div>

        {/* Voucher */}
        <div className={`menu-group ${openMenus.voucher ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('voucher')}
          >
            <div className="menu-title">
              <i className="bi bi-ticket-fill"></i>
              <span>Mã giảm giá</span>
            </div>
            <i className={`bi bi-chevron-right arrow ${openMenus.voucher ? 'open' : ''}`}></i>
          </div>
          {openMenus.voucher && (
            <div className="submenu">
              <Link to="/admin/voucher/list" className="submenu-link">DS mã giảm</Link>
              <Link to="/admin/voucher/add" className="submenu-link">Thêm mã giảm</Link>
            </div>
          )}
        </div>

        {/* Banner */}
        <div className={`menu-group ${openMenus.banner ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('banner')}
          >
            <div className="menu-title">
              <i className="bi bi-card-image"></i>
              <span>Banner</span>
            </div>
            <i className={`bi bi-chevron-right arrow ${openMenus.banner ? 'open' : ''}`}></i>
          </div>
          {openMenus.banner && (
            <div className="submenu">
              <Link to="/admin/banner/list" className="submenu-link">DS Banner</Link>
            </div>
          )}
        </div>

        {/* Tag */}
        <div className={`menu-group ${openMenus.tag ? 'active' : ''}`}>
          <div
            className="menu-item"
            onClick={() => toggleMenu('tag')}
          >
            <div className="menu-title">
              <i className="bi bi-tags-fill"></i>
              <span>Tag</span>
            </div>
            <i className={`bi bi-chevron-right arrow ${openMenus.tag ? 'open' : ''}`}></i>
          </div>
          {openMenus.tag && (
            <div className="submenu">
              <Link to="/admin/tag/list" className="submenu-link">DS Tag</Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className={`menu-group ${openMenus.settings ? 'active' : ''}`}>
          {/* Placeholder for future settings */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;