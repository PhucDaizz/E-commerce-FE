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
    const [productID, setProductID] = useState(11);

    const [colorName, setColorName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000'); // Mặc định màu đen
    const [colors, setColors] = useState([]);

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
        // Handle form submission here
        const productId = await handleAddProduct(productName, selectedCategory, price, description);
        if (productId !== null) {
        setProductID(productId);
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
    }, [JSON.stringify(colors)])
    
    const handleRemoveColor = (colorHex) => {
        setColors(colors.filter(colorObj => colorObj.colorHex !== colorHex));
    };
    
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
    
    const handleRemoveSize = (colorHex, size) => {
        setSelectedSizes((prev) => {
        const updatedSizes = { ...prev };
        if (updatedSizes[colorHex]) {
            delete updatedSizes[colorHex][size]; // Xóa size được chọn
            if (Object.keys(updatedSizes[colorHex]).length === 0) {
            delete updatedSizes[colorHex]; // Nếu không còn size nào, xóa luôn màu
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

  return (
    <div className="add-product container mt-3">
      <ToastContainer/>
      <div className="row">
        <div className="d-flex justify-content-between align-content-center">
          <span className="title">Thêm sản phẩm</span>
          {
            productID !== null && (
              <div className='d-flex'>
                <Confirmation productID = {productID} setProductID={setProductID} setColors={setColors}/>
              </div>
            )
          }
        </div>
      </div>
      <div className="row">
        <div className="col border me-1 product-attribute shadow-sm bg-white">
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="productName">Tên sản phẩm:</label>
              <input
                type="text"
                className="form-control"
                id="productName"
                placeholder="Nhập tên sản phẩm"
                value={productName}
                onChange={handleProductNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Loại sản phẩm:</label>
              <select
                className="form-control"
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
              <label htmlFor="price">Giá bán:</label>
              <input
                type="number"
                className="form-control"
                id="price"
                placeholder="Nhập giá bán"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả sản phẩm:</label>
              <textarea
                className="form-control"
                id="description"
                placeholder="Nhập mô tả sản phẩm"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2" disabled={productID !== null}>
              Thêm sản phẩm
            </button>
          </form>
        </div>
        <div className="col">
          {/* Chọn màu */}
          <AddColors productId={productID} 
                      selectedColor={selectedColor}
                      setSelectedColor= {setSelectedColor}
                      colorName = {colorName}
                      setColorName = {setColorName}
                      handleAddColor = {handleAddColor}
                      colors = {colors}
                      handleRemoveColor = {handleRemoveColor}
                      handleAddColors = {handleAddColors}
          />



          {/* Chọn kích thước */}
          <div className="border ms-1 shadow-sm bg-white p-3 mt-3">
            <p>Kích thước sản phẩm:</p>
            <div className="color-options d-flex">
              {colors.map((colorObj) => (
                <button
                  key={colorObj.productColorID}
                  className={`btn m-1 ${selectedColorForSize?.colorHex === colorObj.colorHex ? 'btn-secondary' : 'btn-outline-dark'}`}
                  onClick={() => handleSelectColorForSize(colorObj)}
                >
                  {colorObj.colorName}
                </button>
              ))}
            </div>
            {selectedColorForSize && (
              <div>
                <p>Chọn size và số lượng cho {selectedColorForSize.colorName}:</p>
                <div className="d-flex flex-wrap">
                  {sizes.map((size) => (
                    <div key={size} className="m-1">
                      <button 
                        style={{ width: '90px' }} 
                        className={`btn ${selectedSizes[selectedColorForSize.productColorID]?.[size] ? 'btn-success' : 'btn-primary'}`} 
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                      
                      {/* Ô nhập số lượng nếu size đã chọn */}
                      {selectedSizes[selectedColorForSize.productColorID]?.[size] && (
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            min="1"
                            value={selectedSizes[selectedColorForSize.productColorID][size]}
                            onChange={(e) => handleQuantityChange(selectedColorForSize.productColorID, size, parseInt(e.target.value))}
                            className="form-control mt-1"
                            style={{ width: '60px' }}
                          />
                          
                          {/* Nút Xóa Size */}
                          <button 
                            className="btn btn-danger btn-sm ms-1" 
                            onClick={() => handleRemoveSize(selectedColorForSize.productColorID, size)}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <button className="btn btn-info mt-3" onClick={handleAddSizes}>
                  Thêm size
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
        {/* Thêm ảnh sản phẩm */}
        <div className="row">
          <UploadImages productId={productID}/>
        </div>
    </div>
  )
}

export default AddProducts
