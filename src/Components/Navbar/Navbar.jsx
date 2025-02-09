import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useCategory } from '../../Context/CategoryContext';
import { useSearch } from '../../Context/SearchContext';
import axios from '../../api/axios';
import './Navbar.css';
import Login from '../../Pages/Login'

const Navbar = () => {
  const [data, setData] = useState([]);
  const [menu, setMenu] = useState("");
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const { loggedIn, logout, itemInCart } = useAuth();
  const { handleCategoryChange } = useCategory();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/Category')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSearch = () => {
    navigate('/shop');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav className='navbar'>
      <div className="navbar-container container">
        <div className="navbar-logo">
          <i className='bi bi-list'></i>
          <Link to={'/'} onClick={() => setMenu('')}>
            <img
              src="https://rubicmarketing.com/wp-content/uploads/2023/04/y-nghia-logo-adidas.jpg"
              alt="Logo"
              className='navimg'
            />
          </Link>
        </div>
        
        <div className="navbar-categories">
          <p onClick={() => {setMenu("shop"); handleCategoryChange(null);}} className='category-item'>
            <Link style={{textDecoration: 'none'}} to={'/shop'}>
              <strong>Shop</strong> {menu === "shop" && <hr/>}
            </Link>
          </p>
          {data.map((d) => (
            <p 
              onClick={() => {
                setMenu(d.categoryName); 
                handleCategoryChange(d.categoryID);
              }}
              key={d.categoryID}
              className='category-item'
            >
              <Link style={{textDecoration: 'none'}} to={'/shop'}>
                <strong>{d.categoryName}</strong>
              </Link>
              {menu === d.categoryName && <hr/>}
            </p>
          ))}
        </div>

        <div className="navbar-actions">
          <div className="search-container">
            <i className="bi bi-search" onClick={handleSearch}></i>
            <input
              type="search"
              placeholder='Tìm kiếm sản phẩm'
              className='search-input'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {!loggedIn ? (
            <div className="auth-buttons">
              <button className="auth-button">Đăng ký</button>
              <div 
                className="login-container"
                onMouseEnter={() => setIsLoginHovered(true)}
                onMouseLeave={() => setIsLoginHovered(false)}
              >
                <button className="auth-button">Đăng nhập</button>
                {isLoginHovered && (
                  <div className="login-form-popup">
                    <div className='haha'></div>
                    <Login />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="user-info ms-3">
              <span>Xin chào, User!</span>
              <Link to={'/cart'}>
                <i className="bi bi-bag ms-2"></i>
                <div className='cart-container'>
                  <span className='cart-count'>{itemInCart}</span>
                </div>
              </Link>
              <button className="auth-button logout" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;