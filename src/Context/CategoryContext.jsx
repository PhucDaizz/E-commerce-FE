import React, { createContext, useContext, useState } from 'react';
import axios from '../api/axios';

// Tạo Context
const CategoryContext = createContext();

// Tạo Provider để bọc các thành phần con
export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const getCategory = async () => {
    try {
      const res = await axios.get('https://localhost:7295/api/Category');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, handleCategoryChange , categories, getCategory}}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook để sử dụng CategoryContext
export const useCategory = () => {
  return useContext(CategoryContext);
};
