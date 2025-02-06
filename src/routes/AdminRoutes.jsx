import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from '../Pages/Admin'
import AdminLayout from '../layouts/AdminLayout'
import AddProduct from '../Pages/AdminPages/AddProduct'
import ListProducts from '../Pages/AdminPages/ListProducts'
import EditProduct from '../Pages/AdminPages/EditProduct'

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
        </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes
