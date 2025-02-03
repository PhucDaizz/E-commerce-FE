import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from '../Pages/Admin'
import AdminLayout from '../layouts/AdminLayout'
import AddProduct from '../Pages/AdminPages/AddProduct'

const AdminRoutes = () => {
  return (
    <AdminLayout>
        <Routes>
            <Route path='/' element={<Admin/>}></Route>
            <Route path='/products'>
                <Route path='add' element={<AddProduct/>}></Route>
            </Route>
        </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes
