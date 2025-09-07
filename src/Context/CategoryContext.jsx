import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { apiMultipartRequest, apiRequest } from '../utils/apiHelper';
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


  const addCategory = async (categoryName, description, imageFile, useCloudStorage, onSuccess) => {
      try {
          const formData = new FormData();
          formData.append('CategoryName', categoryName);
          formData.append('Description', description || '');
          formData.append('UseCloudStorage', useCloudStorage.toString());
          
          if (imageFile) {
              formData.append('ImageFile', imageFile);
          }

          const response = await apiMultipartRequest({
              method: 'post',
              url: 'api/Category',
              data: formData
          });

          if (response.status === 200) {
              toast.success('Thêm danh mục thành công');
              
              // Gọi hàm reset form khi thành công
              if (onSuccess && typeof onSuccess === 'function') {
                  onSuccess();
              }
          }
      } catch (error) {
          console.error('Lỗi khi thêm mục sản phẩm:', error);
          if (error.response?.data) {
              toast.error(error.response.data);
          } else {
              toast.error('Có lỗi xảy ra khi thêm danh mục');
          }
      }
  }

  const editCategory = async (categoryID, categoryName, description, imageFile, useCloudStorage, onSuccess) => {
      try {
          const formData = new FormData();
          formData.append('CategoryName', categoryName);
          formData.append('Description', description || '');
          formData.append('UseCloudStorage', useCloudStorage.toString());
          
          if (imageFile) {
              formData.append('ImageFile', imageFile);
              // HasNewImage sẽ được server tự động tính từ việc có ImageFile
          }

          const response = await apiMultipartRequest({
              method: 'put',
              url: `/api/Category/${categoryID}`,
              data: formData
          });

          if (response.status === 200) {
              toast.success('Cập nhật danh mục thành công');
              
              if (onSuccess && typeof onSuccess === 'function') {
                  onSuccess();
              }
          }
      } catch (error) {
          console.error('Lỗi khi cập nhật danh mục:', error);
          if (error.response?.data) {
              toast.error(error.response.data);
          } else {
              toast.error('Có lỗi xảy ra khi cập nhật danh mục');
          }
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
      console.log('Xoá mục sp thành công:', response);
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
