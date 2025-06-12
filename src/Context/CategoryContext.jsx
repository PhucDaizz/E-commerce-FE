import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { apiRequest } from '../utils/apiHelper';
import { toast } from 'react-toastify';

// Tạo Context
const CategoryContext = createContext();

// Tạo Provider để bọc các thành phần con
export const CategoryProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const getCategory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/Category`);
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, [])


  const addCategory = async (categoryName, description) => {
    try {
      const response = await apiRequest({
        method : 'post',
        url: 'api/Category',
        data: {
          categoryName: categoryName,
          description: description
        }
      });
      if (response.status === 200) {
        toast.success('Thêm danh mục thành công')
      }
    } catch (error) {
      console.error('Lỗi khi thêm mục sản phẩm:', error);
    }
  }

  const editCategory = async (categoryID, categoryName, description) => {
    try {
      const response = await apiRequest({
        method: 'put',
        url: `/api/Category/${categoryID}`,
        data: {
          categoryName: categoryName,
          description: description
        }
      })
      if(response.status === 200) {
        toast.success('Chỉnh sửa mục sp thành công')
      }
    } catch (error) {
      console.log('Lỗi khi thêm mục sp:', error)
    }
  } 

  const getDetailCategory = async(categoryID) => {
    try {
      const response = await axios.get(`${apiUrl}/api/Category/${categoryID}`)
      return response.data
    } catch(error) {
      console.error("Lỗi khi lấy thông tin muc sp: ",error)
    }
  }

  const deleteCategory = async(categoryID) => {
    try {
      const response = await apiRequest({
        method: 'delete',
        url: `/api/Category/${categoryID}`
      })
      return response;
    } catch (error) {
      console.error('Lỗi khi xoá mục:' ,error);
    }
  }

  return (
    <CategoryContext.Provider value={{ 
                  selectedCategory, 
                  handleCategoryChange , 
                  categories, 
                  getCategory,
                  setCategories,
                  addCategory,
                  editCategory,
                  getDetailCategory,
                  deleteCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook để sử dụng CategoryContext
export const useCategory = () => {
  return useContext(CategoryContext);
};
