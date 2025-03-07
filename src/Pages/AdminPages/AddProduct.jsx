import React, { useEffect, useState } from 'react'
import '../CSS/AddProduct.css'
import { toast, ToastContainer } from 'react-toastify'
import { useProduct } from '../../Context/ProductContext';
import { useCategory } from '../../Context/CategoryContext';
import AddColors from '../../Components/AddColors/AddColors';
import UploadImages from '../../Components/UploadImages/UploadImages';
import Confirmation from '../../Components/Confirmation/Confirmation';

const AddProducts = () => {
    const {handleAddProduct, handleAddProductColor, getAllColor, addRangeColors} = useProduct();
    const { categories, getCategory } = useCategory();
    const [productName, setProductName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [productID, setProductID] = useState(null);

    const [colorName, setColorName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [colors, setColors] = useState([]);
    const [isEditingProduct, setIsEditingProduct] = useState(false);

    const [selectedColorForSize, setSelectedColorForSize] = useState(null);
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const [selectedSizes, setSelectedSizes] = useState({});

    useEffect(() => {
        getCategory();
    }, []);
    
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
        if (!productName || !selectedCategory || !price || !description) {
          toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
          return;
        }
        const productId = await handleAddProduct(productName, selectedCategory, price, description);
        if (productId !== null) {
          setProductID(productId);
          setIsEditingProduct(true);
        }
    };
    
    const handleAddColor = () => {
        if (selectedColor && colorName) {
        setColors([...colors, {productID: productID, colorName: colorName, colorHex: selectedColor }]);
        setSelectedColor('#000000');
        setColorName('');
        } 
    };
    
    useEffect(()=> {
        console.log(colors);
    }, [JSON.stringify(colors)])
    
    const handleRemoveColor = (colorHex) => {
        setColors(colors.filter(colorObj => colorObj.colorHex !== colorHex));
    };
    
    const handleSelectColorForSize = (colorHex) => {
        setSelectedColorForSize(colorHex);
    };
    
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
    
    const handleRemoveSize = (colorHex, size) => {
        setSelectedSizes((prev) => {
        const updatedSizes = { ...prev };
        if (updatedSizes[colorHex]) {
            delete updatedSizes[colorHex][size];
            if (Object.keys(updatedSizes[colorHex]).length === 0) {
            delete updatedSizes[colorHex];
            }
        }
        return updatedSizes;
        });
    };
    
    const handleAddColors = async (colors) => {
        const newColors = colors.filter(color => !color.productColorID);
        if (newColors.length > 0) {
            const response = await handleAddProductColor(newColors);
            if (response.length !== 0) {
                const updatedColors = colors.map(color => {
                    if (color.productColorID) {
                        return color;
                    }
                    const updatedColor = response.find(newColor => 
                        newColor.colorHex === color.colorHex
                    );
                    return updatedColor || color;
                });
                setColors(updatedColors);
            }
            if(response.status === 400) {
              toast.error('Vui lòng kiểm tra lại');
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

    return (
        <div className="add-product-container">
            <ToastContainer />
            
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1 className="page-title">
                            <i className="fas fa-plus-circle me-3"></i>
                            Thêm sản phẩm mới
                        </h1>
                        <p className="page-subtitle">Tạo và quản lý sản phẩm của bạn</p>
                    </div>
                    
                    {productID !== null && isEditingProduct && (
                        <div className="header-actions">
                            <Confirmation 
                                productID={productID} 
                                setProductID={setProductID} 
                                setColors={setColors}
                                setIsEditingProduct={setIsEditingProduct}
                            />
                        </div>
                    )}
                </div>
                
                {/* Progress Indicator */}
                <div className="progress-indicator">
                    <div className={`step ${productID ? 'completed' : 'active'}`}>
                        <div className="step-number">1</div>
                        <span>Thông tin cơ bản</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${productID && colors.length > 0 ? 'completed' : productID ? 'active' : 'pending'}`}>
                        <div className="step-number">2</div>
                        <span>Màu sắc</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${productID && colors.length > 0 && Object.keys(selectedSizes).length > 0 ? 'active' : 'pending'}`}>
                        <div className="step-number">3</div>
                        <span>Kích thước</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step pending">
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
                                        disabled={productID !== null}
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
                                        disabled={productID !== null}
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
                                            disabled={productID !== null}
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
                                        disabled={productID !== null}
                                        rows="4"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className={`submit-btn ${productID !== null ? 'disabled' : ''}`}
                                    disabled={productID !== null}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Tạo sản phẩm
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Colors and Sizes Section */}
                    <div className="colors-sizes-section">
                        {/* Colors */}
                        <AddColors 
                            productID={productID} 
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            colorName={colorName}
                            setColorName={setColorName}
                            handleAddColor={handleAddColor}
                            colors={colors}
                            handleRemoveColor={handleRemoveColor}
                            handleAddColors={handleAddColors}
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
                                        <p>Vui lòng thêm màu sắc trước khi chọn kích thước</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="color-selection">
                                            <p className="selection-label">Chọn màu để thêm kích thước:</p>
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
                                                        Chọn kích thước cho màu: 
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
                                                    Lưu kích thước
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
                    <UploadImages productId={productID}/>
                </div>
            </div>
        </div>
    )
}

export default AddProducts