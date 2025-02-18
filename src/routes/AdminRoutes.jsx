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
            </Route>
        </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes
