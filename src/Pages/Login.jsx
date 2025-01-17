import React, { useState } from 'react'
import './CSS/Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    apiLogin(email, password);
  }

  const apiLogin = (email, password) => {
    axios.post('https://localhost:7295/api/Auth/Login', {email,password})
      .then(res => {
        console.log('Login successful:', res.data);
        const token = res.data.token
        localStorage.setItem('token', token);
        const decodeToken = jwtDecode(token)
        const roles = decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        console.log(roles)
        if (roles.includes("Admin") || roles.includes("SuperAdmin")) {
          navigate('/admin')
        } else {
          window.location.reload();
        }
      })
      .catch(err => console.log("Login failed: ", err))

  }

  return (
    <div className="login-form-container"> 
      <form onSubmit={handleSubmit} className="login-form"> 
        <h2>Đăng nhập tài khoản</h2> 
        <div className="form-group"> 
          <label htmlFor="email">Email:</label> 
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          /> 
        </div> 
        <div className="form-group"> 
          <label htmlFor="password">Mật khẩu:</label> 
          <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          /> 
        </div> 
        <button type="submit" className="login-button">Đăng nhập</button> 
      </form> 
    </div>
  )
}

export default Login