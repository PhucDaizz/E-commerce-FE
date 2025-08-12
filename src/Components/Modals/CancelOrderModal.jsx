import React from 'react'

const CancelOrderModal = ({
  showCancelModal,
  setShowCancelModal,
  orderDetail,
  isCancelling,
  cancelError,
  handleCancelOrder
}) => {
  if (!showCancelModal) return null;

  return (
    <div className="confirmation-modal">
      <div className="confirmation-content">
        <h3>Xác nhận hủy đơn hàng</h3>
        <p>Bạn có chắc chắn muốn hủy đơn hàng #{orderDetail.orderId}?</p>
        
        {cancelError && (
          <div className="alert alert-danger">{cancelError}</div>
        )}
        
        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowCancelModal(false)}
            disabled={isCancelling}
          >
            Quay lại
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
