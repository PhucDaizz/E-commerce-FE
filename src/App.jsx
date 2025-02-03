  import './App.css'
  import {Route, Routes, BrowserRouter, useLocation} from 'react-router-dom'
  import Navbar from './Components/Navbar/Navbar'
  import Home from './Pages/Home'
  import Footer from './Components/Footer/Footer'
  import Cart from './Pages/Cart'
  import Login from './Pages/Login'
  import Product from './Pages/Product'
  import Shop from './Pages/Shop'
import AdminRoutes from './routes/AdminRoutes'
import AdminNavbar from './Components/AdminNavbar/AdminNavbar'
  
function AppContent() { // Tạo một component mới để sử dụng useLocation()
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/ao' />
        <Route path='/quan' />
        <Route path='/product' element={<Product />}>
          <Route path=':productId' element={<Product />} />
        </Route>
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
    return (
      <>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </>
    )
  }

  export default App
