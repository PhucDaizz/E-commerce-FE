import React, { useState } from 'react';
import './Confirmation.css';

const Confirmation = ({ productID, setProductID, setColors, setIsEditingProduct }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleEndEditing = () => {
        setShowConfirm(true);
    };

    const handleConfirmEnd = () => {
        setProductID(null);
        setColors([]);
        setShowConfirm(false);
        setIsEditingProduct(false);
    };

    const handleCancelEnd = () => {
        setShowConfirm(false);
    };

    return (
        <div className="confirmation-container">
            {productID !== null && (
                <div className="editing-info">
                    <span className="product-id-badge">
                        Mã sản phẩm: <span className="id-value">{productID}</span>
                    </span>
                    <button 
                        className="end-editing-btn"
                        onClick={handleEndEditing}
                    >
                        <i className="fas fa-check-circle"></i> Kết thúc chỉnh sửa
                    </button>
                </div>
            )}

            {showConfirm && (
                <div className="confirmation-modal">
                    <div className="confirmation-dialog">
                        <div className="confirmation-header">
                            <h3>Xác nhận</h3>
                        </div>
                        <div className="confirmation-body">
                            <p>Bạn có chắc chắn muốn kết thúc chỉnh sửa sản phẩm này?</p>
                            <p className="text-muted">Mọi thay đổi chưa lưu sẽ bị mất.</p>
                        </div>
                        <div className="confirmation-footer">
                            <button 
                                className="confirm-btn"
                                onClick={handleConfirmEnd}
                            >
                                <i className="fas fa-check"></i> Đồng ý
                            </button>
                            <button 
                                className="cancel-btn"
                                onClick={handleCancelEnd}
                            >
                                <i className="fas fa-times"></i> Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Confirmation;