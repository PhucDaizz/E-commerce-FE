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
import Checkout from './Pages/Checkout'
import Register from './Pages/Register'
import VerifyEmail from './Components/VerifyEmail/VerifyEmail'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import Account from './Pages/Account'
import UpdateInfor from './Components/UpdateInfor/UpdateInfor'
import ResultPayment from './Components/ResultPayment/ResultPayment'
  
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
        <Route path='/checkout' element={<Checkout/>}></Route>
        <Route path='/login' element={<Login onPage={true}/>} />
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/verifyemail' element={<VerifyEmail/>}></Route>
        <Route path='/resultpayment' element={<ResultPayment/>}></Route>
        <Route path='/account' element={<Account/>}>
          <Route path='reset' element={<ResetPassword/>}></Route>
          <Route path='update' element={<UpdateInfor/>}></Route>
        </Route>
        <Route path='/resetpassword' element={<ResetPassword/>}/>
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
