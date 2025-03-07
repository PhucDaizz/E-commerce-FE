import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/AddProduct.css'

import { toast, ToastContainer } from 'react-toastify';
import { useProduct } from '../../Context/ProductContext';
import { useCategory } from '../../Context/CategoryContext';
import AddColors from '../../Components/AddColors/AddColors';
import Confirmation from '../../Components/Confirmation/Confirmation';
import UploadImagesAdmin from '../../Components/UploadImagesAdmin/UploadImagesAdmin';

const EditProducts = () => {
    const { productID } = useParams();
    const [productEdit, setProductEdit] = useState(productID);
    const [data, setData] = useState([]);

    const {handleAddProduct, handleAddProductColor, 
        getAllColor, addRangeColors, getDetailProduct, 
        editProduct, deleteColor, deleteSize} = useProduct();
        
    const { categories, getCategory } = useCategory();
    const [productName, setProductName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [colorName, setColorName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000'); // Mặc định màu đen
    const [colors, setColors] = useState([]);

    const [selectedColorForSize, setSelectedColorForSize] = useState(null);
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const [selectedSizes, setSelectedSizes] = useState({});
    

    useEffect(() => {
        getCategory();
        handleGetDetailProduct(productID);
        console.log(data);
    }, [productID]);

    
    const handleGetDetailProduct = async(productID) => {
        const response = await getDetailProduct(productID);
        setData(response);
        setProductName(response.product.productName)
        setSelectedCategory(response.category.categoryID)
        setPrice(response.product.price)
        setDescription(response.product.description)
        setSelectedSizes(transformColorData(response.color))
    }

    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    };
    
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    
    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };
    
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission here
        const newInfor =  {
            productName: productName,
            categoryID: selectedCategory,
            price: price,
            description: description
        }

        const response = await editProduct(productID, newInfor);
        
        const productId = response.data.ProductID;
        if (productId !== null) {
        setProductEdit(productId);
        }
    };
    
    
    // Thêm màu vào danh sách
    const handleAddColor = () => {
        if (selectedColor && colorName) {
        setColors([...colors, {productID: productID, colorName: colorName, colorHex: selectedColor }]);
        setSelectedColor('#000000'); // Reset picker
        setColorName('');
        
        } 
    };
    
    useEffect(()=> {
        console.log(colors);
        console.log(data);
    }, [JSON.stringify(colors)])
    
    const handleRemoveColor = (colorHex) => {
      setColors(colors.filter(colorObj => colorObj.colorHex !== colorHex));
    };

    const handleRemoveColorInData = (colorID ,colorHex) => {
      setColors(colors.filter(colorObj => colorObj.colorHex !== colorHex));
      deleteColor(colorID)
    }
    
    // Chọn màu để thêm kích thước
    const handleSelectColorForSize = (colorHex) => {
        setSelectedColorForSize(colorHex);
    };
    
    // Chọn size và số lượng cho màu
    const handleSizeSelect = (size) => {
        if (selectedColorForSize) {
        const colorKey = selectedColorForSize.productColorID;
        setSelectedSizes((prev) => ({
            ...prev,
            [colorKey]: {
            ...prev[colorKey],
            [size]: prev[colorKey]?.[size] ? prev[colorKey][size] + 1 : 1,
            },
        }));
        }
    };
    
    const handleQuantityChange = (colorKey, size, value) => {
        setSelectedSizes((prev) => ({
        ...prev,
        [colorKey]: {
            ...prev[colorKey],
            [size]: value,
        },
        }));
    };
    
    const handleRemoveSize = (colorID, size) => {
        setSelectedSizes((prev) => {
        const updatedSizes = { ...prev };
        if (updatedSizes[colorID]) {
            delete updatedSizes[colorID][size]; // Xóa size được chọn
            deleteSize(colorID, size)
            if (Object.keys(updatedSizes[colorID]).length === 0) {
            delete updatedSizes[colorID]; // Nếu không còn size nào, xóa luôn màu
            }
        }
        return updatedSizes;
        });
    };
    
    
    
    
    //   Chính thức
    const handleAddColors = async (colors) => {
      // Lọc ra những màu chưa có productColorID
        const newColors = colors.filter(color => !color.productColorID);
        if (newColors.length > 0) {
            const response = await handleAddProductColor(newColors);
            if (response.length !== 0) {
                // Kết hợp màu mới với màu cũ trong state
                const updatedColors = colors.map(color => {
                    // Nếu là màu cũ (có productColorID), giữ nguyên
                    if (color.productColorID) {
                        return color;
                    }
                    // Nếu là màu mới, tìm trong response để lấy data mới
                    const updatedColor = response.find(newColor => 
                        newColor.colorHex === color.colorHex
                    );
                    return updatedColor || color;
                });
                setColors(updatedColors);
            }
        }  
      
       
    }
    
    useEffect(() => {
        const fetchColors = async () => {
        const result = await getAllColor(productID);
        if (result) {
            setColors(result);
        }
        };
    
        fetchColors();
    }, [productID]);
    
    const handleAddSizes = async () => {
        const formattedSizes = Object.fromEntries(
            Object.entries(selectedSizes).map(([key, value]) => [parseInt(key), value])
        );
        try {
        console.log(formattedSizes);
        await addRangeColors(formattedSizes);
        toast.done('Thêm số lượng cho sản phẩm thành công.');
        } catch(error) {
        console.error('Lỗi khi thêm sản phẩm: ', error);
        }
    };


    const transformColorData = (colors) => {
      // Initialize result object
      const result = {};
      
      // Iterate through each color
      colors.forEach(color => {
          // Get the color ID
          const colorId = color.productColorID;
          
          // Create an object for this color if it doesn't exist
          result[colorId] = {};
          
          // Add each size and its stock
          color.productSizes.forEach(size => {
              if (size.stock > 0) { // Only add if stock is greater than 0
                  result[colorId][size.size] = size.stock;
              }
          });
          
          // Remove color entry if it has no sizes with stock
          if (Object.keys(result[colorId]).length === 0) {
              delete result[colorId];
          }
      });
      
      return result;
  };

    return (
        <div className="add-product-container">
            <ToastContainer />
            
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1 className="page-title">
                            <i className="fas fa-edit me-3"></i>
                            Chỉnh sửa sản phẩm
                        </h1>
                        <p className="page-subtitle">Cập nhật thông tin sản phẩm #{productID}</p>
                    </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="progress-indicator">
                    <div className="step completed">
                        <div className="step-number">1</div>
                        <span>Thông tin cơ bản</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step completed">
                        <div className="step-number">2</div>
                        <span>Màu sắc</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step completed">
                        <div className="step-number">3</div>
                        <span>Kích thước</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step completed">
                        <div className="step-number">4</div>
                        <span>Hình ảnh</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-grid">
                    
                    {/* Product Information Card */}
                    <div className="product-info-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="fas fa-info-circle me-2"></i>
                                Thông tin sản phẩm
                            </h3>
                        </div>
                        
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="product-form">
                                <div className="form-group">
                                    <label htmlFor="productName" className="form-label">
                                        <i className="fas fa-tag me-2"></i>
                                        Tên sản phẩm
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        id="productName"
                                        placeholder="Nhập tên sản phẩm..."
                                        value={productName}
                                        onChange={handleProductNameChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">
                                        <i className="fas fa-list me-2"></i>
                                        Loại sản phẩm
                                    </label>
                                    <select
                                        className="form-select"
                                        id="category"
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">Chọn loại sản phẩm</option>
                                        {categories.map((d) => (
                                            <option key={d.categoryID} value={d.categoryID}>
                                                {d.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price" className="form-label">
                                        <i className="fas fa-dollar-sign me-2"></i>
                                        Giá bán
                                    </label>
                                    <div className="price-input-wrapper">
                                        <input
                                            type="number"
                                            className="form-input price-input"
                                            id="price"
                                            placeholder="0"
                                            value={price}
                                            onChange={handlePriceChange}
                                        />
                                        <span className="price-currency">VNĐ</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" className="form-label">
                                        <i className="fas fa-align-left me-2"></i>
                                        Mô tả sản phẩm
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        id="description"
                                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        rows="4"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={productID === null}
                                >
                                    <i className="fas fa-save me-2"></i>
                                    Cập nhật thông tin
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Colors and Sizes Section */}
                    <div className="colors-sizes-section">
                        {/* Colors */}
                        <AddColors 
                            productId={productID} 
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            colorName={colorName}
                            setColorName={setColorName}
                            handleAddColor={handleAddColor}
                            colors={colors}
                            handleRemoveColor={handleRemoveColor}
                            handleAddColors={handleAddColors}
                            handleRemoveColorInData={handleRemoveColorInData}
                        />

                        {/* Sizes */}
                        <div className="sizes-card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-ruler me-2"></i>
                                    Kích thước sản phẩm
                                </h3>
                            </div>
                            
                            <div className="card-body">
                                {colors.length === 0 ? (
                                    <div className="empty-state">
                                        <i className="fas fa-palette"></i>
                                        <p>Chưa có màu sắc nào được thêm</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="color-selection">
                                            <p className="selection-label">Chọn màu để quản lý kích thước:</p>
                                            <div className="color-buttons">
                                                {colors.map((colorObj) => (
                                                    <button
                                                        key={colorObj.productColorID}
                                                        className={`color-button ${selectedColorForSize?.colorHex === colorObj.colorHex ? 'active' : ''}`}
                                                        onClick={() => handleSelectColorForSize(colorObj)}
                                                        style={{ '--color': colorObj.colorHex }}
                                                    >
                                                        <div className="color-preview" style={{ backgroundColor: colorObj.colorHex }}></div>
                                                        <span className="color-name">{colorObj.colorName}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedColorForSize && (
                                            <div className="size-selection">
                                                <div className="size-header">
                                                    <h4 className="size-title">
                                                        Quản lý kích thước cho màu: 
                                                        <span className="selected-color-name">
                                                            {selectedColorForSize.colorName}
                                                        </span>
                                                    </h4>
                                                </div>
                                                
                                                <div className="size-grid">
                                                    {sizes.map((size) => (
                                                        <div key={size} className="size-item">
                                                            <button 
                                                                className={`size-button ${selectedSizes[selectedColorForSize.productColorID]?.[size] ? 'selected' : ''}`}
                                                                onClick={() => handleSizeSelect(size)}
                                                            >
                                                                {size}
                                                                {selectedSizes[selectedColorForSize.productColorID]?.[size] && (
                                                                    <span className="quantity-badge">
                                                                        {selectedSizes[selectedColorForSize.productColorID][size]}
                                                                    </span>
                                                                )}
                                                            </button>
                                                            
                                                            {selectedSizes[selectedColorForSize.productColorID]?.[size] && (
                                                                <div className="quantity-controls">
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={selectedSizes[selectedColorForSize.productColorID][size]}
                                                                        onChange={(e) => handleQuantityChange(selectedColorForSize.productColorID, size, parseInt(e.target.value))}
                                                                        className="quantity-input"
                                                                    />
                                                                    <button 
                                                                        className="remove-size-btn"
                                                                        onClick={() => handleRemoveSize(selectedColorForSize.productColorID, size)}
                                                                        title="Xóa kích thước"
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <button className="add-sizes-btn" onClick={handleAddSizes}>
                                                    <i className="fas fa-check me-2"></i>
                                                    Cập nhật kích thước
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Images Section */}
                <div className="upload-section">
                    <UploadImagesAdmin productId={productID} photos={data.images}/>
                </div>
            </div>
        </div>
    );
};

export default EditProducts;