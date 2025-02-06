import React from 'react'
import './AddColors.css'
import { useProduct } from '../../Context/ProductContext';

const AddColors = ({productID, 
                    selectedColor, 
                    setSelectedColor, 
                    colorName, 
                    setColorName, 
                    handleAddColor, 
                    colors, 
                    handleRemoveColor, 
                    handleAddColors,
                    handleRemoveColorInData
                }) => {
    
    const {deleteColor}  = useProduct();

    const isColorInDatabase = (colorObj) => {
        return colorObj.productSizes && colorObj.productSizes.length > 0;
    };

    const countNewColors = () => {
        return colors.filter(color => !isColorInDatabase(color)).length;
    };


    return (
        <div>
            
                {/* Chọn màu */}
                <div className="border ms-1 shadow-sm bg-white p-3">
                    <p>Màu sản phẩm: (nhấp vào bảng màu để chọn)</p>
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="color-picker"
                        disabled={productID === null}
                    />
                    <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Nhập tên màu"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        disabled={productID === null}
                    />
                    <button className="btn btn-success mt-2" 
                        onClick={handleAddColor} 
                        disabled={productID === null}
                    >
                        Thêm màu
                    </button>

                    <div className="selected-colors mt-2">
                        {colors.map((colorObj) => (
                            <div key={colorObj.colorHex} className="color-circle-container">
                                <div
                                    className="color-circle"
                                    style={{ backgroundColor: colorObj.colorHex }}
                                />

                                {/* Fix in here */}
                                {isColorInDatabase(colorObj) ? (
                                    <button
                                        className="remove-color-btn bg-danger"
                                        onClick={() => handleRemoveColorInData(colorObj.productColorID, colorObj.colorHex)}
                                    >
                                        ×
                                    </button>
                                ) : (
                                    <button
                                        className="remove-color-btn"
                                        onClick={() => handleRemoveColor(colorObj.colorHex)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                
                    <div className={`btn btn-light border ${productID === null ? 'disabled-button' : ''}`} 
                        onClick={() => productID !== null && handleAddColors(colors)}
                    >
                        Đồng ý thêm {countNewColors()} màu
                    </div>
                </div>
             
        </div>
    )
}

export default AddColors
