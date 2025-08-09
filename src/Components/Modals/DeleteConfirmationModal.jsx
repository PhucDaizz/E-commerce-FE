import React from 'react';

const DeleteConfirmationModal = ({ show, onHide, onConfirm, bannerTitle }) => {
    if (!show) return null;
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onHide();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Xác nhận xóa</h3>
                    <button type="button" onClick={onHide} aria-label="Đóng">&times;</button>
                </div>
                <div className="modal-body">
                    Bạn có chắc chắn muốn xóa banner <strong>"{bannerTitle}"</strong> không?
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onHide}>Hủy bỏ</button>
                    <button className="btn-confirm" onClick={onConfirm}>Xác nhận xóa</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;