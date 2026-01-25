import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useCategory } from '../../Context/CategoryContext';
import { useSearch } from '../../Context/SearchContext';
import './Navbar.css';
import { ShoppingCart, Search, LogOut, User, Menu, X, ChevronDown, ChevronRight, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const [menu, setMenu] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { loggedIn, logout, itemInCart, inforUser } = useAuth();
  const { handleCategoryChange, categories, getCategory } = useCategory();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = () => {
    navigate('/shop');
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryClick = (categoryName, categoryID) => {
    setMenu(categoryName);
    handleCategoryChange(categoryID);
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  useEffect(() => {
    getCategory()
  }, []);

  return (
    <nav className='navbar'>
      <div className="navbar-container">
        {/* Toggle Button (Mobile Only) */}
        {isMobile && (
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to={'/'} onClick={() => setMenu('')}>
            <img
              src="/images/logo.jpg"
              alt="Doris Logo"
              className='navimg'
            />
          </Link>
        </div>

        {/* Desktop Categories */}
        {!isMobile && (
          <div className="desktop-categories">
            <div onClick={() => { setMenu("shop"); handleCategoryChange(null); }} className={`category-item ${menu === "shop" ? 'active' : ''}`}>
              <Link to={'/shop'}>Tất cả</Link>
              <hr />
            </div>
            {categories.slice(0, 4).map((d) => (
              <div
                onClick={() => handleCategoryClick(d.categoryName, d.categoryID)}
                key={d.categoryID}
                className={`category-item ${menu === d.categoryName ? 'active' : ''}`}
              >
                <Link to={'/shop'}>{d.categoryName}</Link>
                <hr />
              </div>
            ))}
            {categories.length > 4 && (
              <div className="category-dropdown" onMouseEnter={() => setIsCategoryDropdownOpen(true)} onMouseLeave={() => setIsCategoryDropdownOpen(false)}>
                <div className='dropdown-toggle'>
                  <span>Khác</span>
                  <ChevronDown size={14} />
                </div>
                <div className="dropdown-menu">
                  {categories.slice(4).map((d) => (
                    <div
                      onClick={() => handleCategoryClick(d.categoryName, d.categoryID)}
                      key={d.categoryID}
                      className='dropdown-item'
                    >
                      <Link to={'/shop'}>{d.categoryName}</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="navbar-actions">
          {!isMobile && (
            <div className="search-container">
              <input
                type="search"
                placeholder='Tìm kiếm đồ của bạn...'
                className='search-input'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <i onClick={handleSearch}><Search size={16} /></i>
            </div>
          )}

          <Link to={'/cart'} className="cart-link-wrapper">
            <ShoppingCart size={isMobile ? 24 : 20} className="cart-icon" />
            {itemInCart > 0 && (
              <div className="cart-badge">
                <span>{itemInCart}</span>
              </div>
            )}
          </Link>

          {!isMobile && (
            !loggedIn ? (
              <div className="auth-buttons">
                <Link to={'/login'}>
                  <button className="auth-button">Đăng nhập</button>
                </Link>
                <Link to={'/register'}>
                  <button className="auth-button register">Đăng ký</button>
                </Link>
              </div>
            ) : (
              <div className="user-info">
                <Link to='/account' className='user-link'>
                  <User size={16} className="me-2" />
                  <span>Hồ sơ</span>
                </Link>
                <button className="auth-button logout" onClick={logout} title="Đăng xuất">
                  <LogOut size={16} />
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* --- PREMIUM MOBILE DRAWER --- */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <img src="/images/logo.jpg" alt="Logo" />
          </div>
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <div className="mobile-search-wrapper">
            <div className="search-container">
              <input
                type="search"
                placeholder='Tìm kiếm...'
                className='search-input'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <i onClick={handleSearch}><Search size={14} /></i>
            </div>
          </div>

          <span className="mobile-section-label">Danh mục sản phẩm</span>
          <div className="mobile-nav-list">
            <Link to='/shop' onClick={() => handleCategoryClick("shop", null)} className="mobile-nav-item">
              <span>Tất cả sản phẩm</span>
              <ChevronRight size={16} />
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.categoryID}
                to='/shop'
                onClick={() => handleCategoryClick(cat.categoryName, cat.categoryID)}
                className="mobile-nav-item"
              >
                <span>{cat.categoryName}</span>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mobile-footer">
          {!loggedIn ? (
            <div className="mobile-auth-grid">
              <Link to='/login' className="mobile-btn-primary">
                <LogIn size={18} className="me-2" />
                Đăng nhập
              </Link>
              <Link to='/register' className="mobile-btn-outline">
                <UserPlus size={18} className="me-2" />
                Tạo tài khoản
              </Link>
            </div>
          ) : (
            <>
              <Link to='/account' className="mobile-user-card">
                <div className="mobile-user-avatar">
                  {inforUser.userName?.charAt(0).toUpperCase()}
                </div>
                <div className="mobile-user-info">
                  <div className="mobile-user-name">{inforUser.userName}</div>
                  <div className="small text-muted">Xem hồ sơ của bạn</div>
                </div>
                <ChevronRight size={16} className="ms-auto text-muted" />
              </Link>
              <button className="mobile-logout-btn" onClick={logout}>
                <LogOut size={18} />
                <span>Đăng xuất tài khoản</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;