import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from '../Pages/Admin'
import AdminLayout from '../layouts/AdminLayout'
import AddProduct from '../Pages/AdminPages/AddProduct'
import ListProducts from '../Pages/AdminPages/ListProducts'
import EditProduct from '../Pages/AdminPages/EditProduct'
import ListCategory from '../Pages/AdminPages/ListCategory'
import AddCategory from '../Pages/AdminPages/AddCategory'
import EditCategory from '../Pages/AdminPages/EditCategory'
import ListOrder from '../Pages/AdminPages/ListOrder'
import DetailOrder from '../Components/DetailOrder/DetailOrder'
import Profile from '../Pages/AdminPages/Profile'
import ListUser from '../Pages/AdminPages/ListUser'
import RegisterAdmin from '../Components/RegisterAdmin/RegisterAdmin'
import ListVoucher from '../Pages/AdminPages/ListVoucher'
import AddVoucher from '../Pages/AdminPages/AddVoucher'
import EditVoucher from '../Pages/AdminPages/EditVoucher'
import Chat from '../Pages/Chat'
import ListBanner from '../Components/ListBanner/ListBanner'
import ListTag from '../Pages/AdminPages/ListTag'

const AdminRoutes = () => {
  return (
    <AdminLayout>
        <Routes>
            <Route path='/' element={<Admin/>}></Route>
            <Route path='/products'>
                <Route path='add' element={<AddProduct/>}></Route>
                <Route path='list' element={<ListProducts/>}></Route>
                <Route path='edit' element={<EditProduct/>}>
                  <Route path=':productID' element={<EditProduct/>}></Route>
                </Route>
            </Route>
            <Route path='/categories'>
              <Route path='list' element={<ListCategory/>}></Route>
              <Route path='add' element={<AddCategory/>}></Route>
              <Route path='edit' element={<EditCategory/>}>
                <Route path=':categoryID' element={<EditCategory/>}></Route>
              </Route> 
            </Route>
            <Route path='/orders'>
              <Route path='list' element={<ListOrder/>}></Route>
              <Route path=':orderId' element={<DetailOrder/>}></Route>
            </Route>
            <Route>
              <Route path='/account' element={<Profile/>}></Route>
            </Route>
            <Route path='/user'>
              <Route path='list' element={<ListUser/>}></Route>
              <Route path='add-admin' element={<RegisterAdmin/>}></Route>
            </Route>
            <Route path='/voucher'>
              <Route path='list' element={<ListVoucher/>}></Route>
              <Route path='add' element={<AddVoucher/>}></Route>
              <Route path='edit'>
                <Route path=':voucherId' element={<EditVoucher/>}></Route>
              </Route>
            </Route>
            <Route path='/banner'>
              <Route path='list' element={<ListBanner/>}></Route>
            </Route>
            <Route path='/tag'>
              <Route path='list' element={<ListTag/>}></Route>
            </Route>
            <Route path='/chat' element={<Chat/>}></Route>
        </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes
