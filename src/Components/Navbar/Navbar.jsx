import React, { useEffect, useState } from 'react'
import './Navbar.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Login from '../../Pages/Login'
import { useAuth } from '../../Context/AuthContext'
import { useCategory } from '../../Context/CategoryContext'
import { useSearch } from '../../Context/SearchContext'

const Navbar = () => {
  const [data, setData] = useState([])
  const [menu, setMenu] = useState("")
  const {loggedIn, logout } = useAuth();
  const { handleCategoryChange } = useCategory();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('https://localhost:7295/api/Category')
    .then(res => setData(res.data))
    .catch(err => console.log(err))
  },[])

  const handleSearch = () => {
    navigate('/shop')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

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
            <Link style={{textDecoration: 'none'}} to={'/shop'}><strong>Shop</strong> {menu === "shop"? <hr/>:<></>}</Link>
          </p>
          {data.map((d) => (
            <p onClick={() => {setMenu(`${d.categoryName}`); handleCategoryChange(d.categoryID);}} 
              key={d.categoryID} 
              className='category-item'>
              <Link style={{textDecoration: 'none'}} to={'/shop'} ><strong>{d.categoryName}</strong> </Link>
              {menu === `${d.categoryName}`? <hr/>:<></>}
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
          
          {
            !loggedIn ? (
              <div className="auth-buttons">
                <button className="auth-button">Đăng ký</button>
                <div className="login-container">
                  <button className="auth-button">Đăng nhập</button>
                  <div className="login-form-popup">
                    <div className='haha'></div>
                    <Login />
                  </div>
                </div>
              </div>
          ) : (
            <div className="user-info ms-3">
              <span>Xin chào, User!</span>
              <button className="auth-button" onClick={logout}>
                Đăng xuất
              </button>
              <i class="bi bi-bag ms-2"></i>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
