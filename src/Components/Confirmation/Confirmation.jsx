import React, { useState } from 'react'
import './Confirmation.css'

const Confirmation = ({ productID, setProductID, setColors }) => {

    const [showConfirm, setShowConfirm] = useState(false);

    const handleEndEditing = () => {
        setShowConfirm(true); // Hiện hộp xác nhận
    };

    const handleConfirmEnd = () => {
        setProductID(null); // Xóa productID (ẩn UI chỉnh sửa)
        setColors([]);
        setShowConfirm(false); // Ẩn hộp xác nhận
    };

    const handleCancelEnd = () => {
        setShowConfirm(false); // Ẩn hộp xác nhận
    };


    return (
        <>
            {productID !== null && (
                <div className="d-flex align-items-center">
                <span className="me-3">Mã sản phẩm bạn đang chỉnh là: {productID}</span>
                <button className="btn btn-primary" onClick={handleEndEditing}>
                    Kết thúc thêm sản phẩm này
                </button>
                </div>
            )}

            {/* Hộp xác nhận */}
            {showConfirm && (
                <div className="confirm-overlay">
                <div className="confirm-tab">
                    <p className="mb-3">Bạn có chắc chắn muốn kết thúc không?</p>
                    <div className="d-flex gap-2">
                    <button className="btn btn-danger w-100" onClick={handleConfirmEnd}>
                        Có
                    </button>
                    <button className="btn btn-secondary w-100" onClick={handleCancelEnd}>
                        Không
                    </button>
                    </div>
                </div>
                </div>
            )}
    </>
    )
}

export default Confirmation
