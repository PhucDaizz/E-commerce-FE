import React, { createContext, useContext, useState } from 'react';

// Tạo Context
const CategoryContext = createContext();

// Tạo Provider để bọc các thành phần con
export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, handleCategoryChange }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook để sử dụng CategoryContext
export const useCategory = () => {
  return useContext(CategoryContext);
};
