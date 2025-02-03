import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { useAdmin } from '../../Context/AdminContext';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const {hideSideBar, handleHideSideBar} = useAdmin();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className={`sidebar ${hideSideBar ? 'hide' : ''}`}>
      <div className="sidebar-header">
        <div className="row d-flex">
          <div className="col">
            <img className='img-fluid fit-img' src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/356208594_110346902103991_4758667603753954564_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=I8rdYedqzygQ7kNvgH1AgXL&_nc_zt=23&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=AMCP5lPDZfC8tDDqfOrSvNi&oh=00_AYBIGUwmQG5azRVouoULz2lbflJExVBhqlus7VJl4VGlwQ&oe=67961468" alt="" />
          </div>
          <div className="col-3">
          <i onClick={() => handleHideSideBar()} className="bi bi-list justify-content-center align-content-center"></i>
          </div>
        </div>
      </div>

      <div className="menu">
        {/* Dashboard */}
        <div className="menu-item" onClick={() => toggleMenu('dashboard')}>
          <span>📊 Dashboard</span>
        </div>

        {/* Ecommerce */}
        <div className="menu-item" onClick={() => toggleMenu('ecommerce')}>
        <i className="bi bi-cart me-1"></i> <span>Sản phẩm</span>
        </div>
        {openMenus.ecommerce && (
          <div className="submenu">
            <Link to="/admin/products/add">Thêm sản phẩm</Link>
            <Link to="/sales">💰 Sales</Link>
          </div>
        )}

        {/* Category */}
        <div className="menu-item" onClick={() => toggleMenu('category')}>
          <span>📚 Category</span>
        </div>
        {openMenus.category && (
          <div className="submenu">
            <Link to="/electronics">🔌 Electronics</Link>
            <Link to="/fashion">👗 Fashion</Link>
          </div>
        )}

        {/* Order */}
        <div className="menu-item" onClick={() => toggleMenu('order')}>
          <span>📑 Order</span>
        </div>
        {openMenus.order && (
          <div className="submenu">
            <Link to="/pending-orders">⏳ Pending Orders</Link>
            <Link to="/completed-orders">✅ Completed Orders</Link>
          </div>
        )}

        {/* User */}
        <div className="menu-item" onClick={() => toggleMenu('user')}>
          <span>👤 User</span>
        </div>
        {openMenus.user && (
          <div className="submenu">
            <Link to="/user-list">📋 User List</Link>
            <Link to="/roles">🔑 Roles</Link>
          </div>
        )}

        {/* Settings */}
        <div className="menu-item" onClick={() => toggleMenu('settings')}>
          <span>⚙️ Settings</span>
        </div>
        {openMenus.settings && (
          <div className="submenu">
            <Link to="/profile">📝 Profile</Link>
            <Link to="/preferences">🔧 Preferences</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
