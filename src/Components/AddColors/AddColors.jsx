import React, { useEffect } from 'react'
import './AddColors.css'
import { useProduct } from '../../Context/ProductContext';

const AddColors = ({
    productID,
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
    const { deleteColor } = useProduct();

    const isColorInDatabase = (colorObj) => {
        return colorObj.productColorID && colorObj.productColorID !== undefined;
    };

    const countNewColors = () => {
        return colors.filter(color => !isColorInDatabase(color)).length;
    };

    const handleRemoveColorClick = async (colorObj) => {
        if (isColorInDatabase(colorObj)) {
            await handleRemoveColorInData(colorObj.productColorID, colorObj.colorHex);
        } else {
            handleRemoveColor(colorObj.colorHex);
        }
    };

    useEffect(() => {
        console.log(productID)
    }, [])

    return (
        <div className="add-colors-container">
            <div className="color-section-card">
                <div className="section-header">
                    <h5 className="section-title">
                        <i className="fas fa-palette me-2"></i>
                        Màu sản phẩm
                    </h5>
                    <p className="section-subtitle">Nhấp vào bảng màu để chọn màu sắc</p>
                </div>

                <div className="color-input-group">
                    <div className="color-picker-wrapper">
                        <label className="color-picker-label">Chọn màu:</label>
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="color-picker-input"
                            disabled={productID === null}
                        />
                        <div 
                            className="color-preview" 
                            style={{ backgroundColor: selectedColor }}
                        ></div>
                    </div>

                    <div className="color-name-wrapper">
                        <label className="color-name-label">Tên màu:</label>
                        <input
                            type="text"
                            className="color-name-input"
                            placeholder="Nhập tên màu (vd: Xanh dương, Đỏ cherry...)"
                            value={colorName}
                            onChange={(e) => setColorName(e.target.value)}
                            disabled={productID === null}
                        />
                    </div>
                </div>

                <button 
                    className={`add-color-btn ${productID === null ? 'disabled' : ''}`}
                    onClick={handleAddColor}
                    disabled={productID === null}
                >
                    <i className="fas fa-plus me-2"></i>
                    Thêm màu
                </button>

                {colors.length > 0 && (
                    <div className="selected-colors-section">
                        <div className="colors-header">
                            <h6 className="colors-title">Màu đã chọn ({colors.length})</h6>
                        </div>
                        
                        <div className="colors-grid">
                            {colors.map((colorObj) => (
                                <div key={colorObj.colorHex} className="color-item">
                                    <div className="color-circle-wrapper">
                                        <div
                                            className="color-circle"
                                            style={{ backgroundColor: colorObj.colorHex }}
                                            title={colorObj.colorName || colorObj.colorHex}
                                        />
                                        
                                        <button
                                            className={`remove-color-btn ${isColorInDatabase(colorObj) ? 'database-color' : 'new-color'}`}
                                            onClick={() => handleRemoveColorClick(colorObj)}
                                            title={isColorInDatabase(colorObj) ? "Xóa màu từ cơ sở dữ liệu" : "Xóa màu mới"}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                    
                                    <div className="color-info">
                                        <span className="color-name">{colorObj.colorName || 'Không tên'}</span>
                                        <span className="color-hex">{colorObj.colorHex}</span>
                                        {isColorInDatabase(colorObj) && (
                                            <span className="color-status">Đã lưu</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {countNewColors() > 0 && (
                    <div className="submit-section">
                        <button 
                            className={`submit-colors-btn ${productID === null ? 'disabled' : ''}`}
                            onClick={() => productID !== null && handleAddColors(colors)}
                            disabled={productID === null}
                        >
                            <i className="fas fa-check me-2"></i>
                            Đồng ý thêm {countNewColors()} màu mới
                        </button>
                    </div>
                )}

                {productID === null && (
                    <div className="warning-message">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Vui lòng chọn sản phẩm trước khi thêm màu
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddColors