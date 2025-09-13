import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useCategory } from '../../Context/CategoryContext';
import { useSearch } from '../../Context/SearchContext';
import axios from '../../api/axios';
import './Navbar.css';
import Login from '../../Pages/Login';
import { ShoppingBasket, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const [menu, setMenu] = useState("");
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { loggedIn, logout, itemInCart, inforUser } = useAuth();
  const { handleCategoryChange, categories, getCategory } = useCategory();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = () => {
    navigate('/shop');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleCategoryClick = (categoryName, categoryID) => {
    setMenu(categoryName);
    handleCategoryChange(categoryID);
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  // Optimized API call for categories
  useEffect(() => {
    // const fetchCategories = async () => {
    //   try {
    //     if (categories.length === 0) {
    //       const response = await axios.get('/categories');
    //       handleCategoryChange(null, response.data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching categories:', error);
    //   }
    // };

    // fetchCategories();
    getCategory()
  }, []);

  return (
    <nav className='navbar'>
      <div className="navbar-container container">
        {/* Logo và Menu Toggle */}
        <div className="navbar-logo">
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
          </button>
          <Link to={'/'} onClick={() => setMenu('')}>
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className='navimg'
            />
          </Link>
        </div>

        {/* Desktop Categories - CHỈ HIỆN TRÊN DESKTOP */}
        {!isMobile && (
          <div className="navbar-categories desktop-categories">
            <p onClick={() => {setMenu("shop"); handleCategoryChange(null);}} className='category-item'>
              <Link style={{textDecoration: 'none'}} to={'/shop'}>
                <strong>Shop</strong> {menu === "shop" && <hr/>}
              </Link>
            </p>
            {categories.slice(0, 4).map((d) => (
              <p 
                onClick={() => handleCategoryClick(d.categoryName, d.categoryID)}
                key={d.categoryID}
                className='category-item'
              >
                <Link style={{textDecoration: 'none'}} to={'/shop'}>
                  <strong>{d.categoryName}</strong>
                </Link>
                {menu === d.categoryName && <hr/>}
              </p>
            ))}
            {categories.length > 4 && (
              <div className="category-dropdown">
                <p className='category-item dropdown-toggle' onClick={toggleCategoryDropdown}>
                  <strong>Xem thêm</strong>
                  <i className={`bi bi-chevron-${isCategoryDropdownOpen ? 'up' : 'down'} ms-1`}></i>
                </p>
                {isCategoryDropdownOpen && (
                  <div className="dropdown-menu">
                    {categories.slice(4).map((d) => (
                      <p 
                        onClick={() => handleCategoryClick(d.categoryName, d.categoryID)}
                        key={d.categoryID}
                        className='dropdown-item'
                      >
                        <Link style={{textDecoration: 'none'}} to={'/shop'}>
                          <strong>{d.categoryName}</strong>
                        </Link>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop Actions - CHỈ HIỆN TRÊN DESKTOP */}
        {!isMobile && (
          <div className="navbar-actions desktop-actions">
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
            <Link to={'/cart'} className="relative flex items-center">
              <ShoppingCart className="w-6 h-6 text-black" />
              <div className="cart-container absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                <span className="cart-count">{itemInCart}</span>
              </div>
            </Link>
            {!loggedIn ? (
              <div className="auth-buttons">
                <Link to={'/register'}>
                  <button className="auth-button">Đăng ký</button>
                </Link>
                <div 
                  className="login-container"
                  onMouseEnter={() => setIsLoginHovered(true)}
                  onMouseLeave={() => setIsLoginHovered(false)}
                >
                  <button className="auth-button">
                    <Link to={'/login'} className='auth-link' style={{textDecoration: 'none'}}>
                      Đăng nhập
                    </Link>
                  </button>
                  {isLoginHovered && (
                    <div className="login-form-popup">
                      <div className='haha'></div>
                      <Login onPage={false}/>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="user-info">
                <span>
                  <Link to='/account' className='text-black' style={{textDecoration: 'none', fontSize: '14px'}}>
                    Xin chào, {inforUser.userName}!
                  </Link>
                </span>
                {/* <Link to={'/cart'}>
                  <i className="bi bi-bag"></i>
                  <div className='cart-container'>
                    <span className='cart-count'>{itemInCart}</span>
                  </div>
                </Link> */}
                <button className="auth-button logout" onClick={logout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cart icon for mobile - CHỈ HIỆN TRÊN MOBILE */}
        {isMobile && loggedIn && (
          <div className="mobile-cart-icon">
            <Link to={'/cart'}>
              <i className="bi bi-bag"></i>
              <div className='cart-container'>
                <span className='cart-count'>{itemInCart}</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        {/* Mobile Search */}
        <div className="mobile-search-container">
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
        </div>

        {/* Mobile Categories */}
        <div className="mobile-categories">
          <p onClick={() => handleCategoryClick("shop", null)} className='mobile-category-item'>
            <Link style={{textDecoration: 'none'}} to={'/shop'}>
              <strong>Shop</strong>
            </Link>
          </p>
          {categories.map((d) => (
            <p 
              onClick={() => handleCategoryClick(d.categoryName, d.categoryID)}
              key={d.categoryID}
              className='mobile-category-item'
            >
              <Link style={{textDecoration: 'none'}} to={'/shop'}>
                <strong>{d.categoryName}</strong>
              </Link>
            </p>
          ))}
        </div>

        <Link to={'/cart'} onClick={() => setIsMobileMenuOpen(false)}>
          <div className="cart-link ms-3">
            <ShoppingCart className="w-6 h-6 text-black" />
            <span>Giỏ hàng ({itemInCart})</span>
          </div>
        </Link>

        {/* Mobile Auth */}
        <div className="mobile-auth">
          {!loggedIn ? (
            <div className="mobile-auth-buttons">
              <Link to={'/register'} onClick={() => setIsMobileMenuOpen(false)}>
                <button className="auth-button">Đăng ký</button>
              </Link>
              <Link to={'/login'} onClick={() => setIsMobileMenuOpen(false)}>
                <button className="auth-button">Đăng nhập</button>
              </Link>
            </div>
          ) : (
            <div className="mobile-user-info">
              <Link 
                to='/account' 
                className='user-link' 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Xin chào, {inforUser.userName}!
              </Link>
              {/* <Link to={'/cart'} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="cart-link">
                  <i className="bi bi-bag"></i>
                  <span>Giỏ hàng ({itemInCart})</span>
                </div>
              </Link> */}
              <button className="auth-button logout" onClick={() => {logout(); setIsMobileMenuOpen(false);}}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;