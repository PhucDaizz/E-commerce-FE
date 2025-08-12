import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useProduct } from '../Context/ProductContext';
import CancelOrderModal from '../Components/Modals/CancelOrderModal';
import './CSS/Account.css';

const Account = () => {
  const location = useLocation();
  const { getInforUser } = useAuth();
  const { getListOrder, getOrderDetail, cancelOrder } = useProduct();
  const [inforUser, setInforUser] = useState({});
  const [dataOrder, setDataOrder] = useState([]);
  const [error, setError] = useState(null);
  const [orderDetail, setOrderDetail] = useState({
    items: [],
    status: null,
    orderId: null
  });
  const [showDetail, setShowDetail] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const navigate = useNavigate();

  const hiddenRoutes = ['/account/update'];
  const isHidden = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, orderResponse] = await Promise.all([
          getInforUser(),
          getListOrder()
        ]);
        setInforUser(userResponse);
        setDataOrder(orderResponse.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [getListOrder]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const statusMapping = {
    0: 'Đang đóng gói hàng',
    1: 'Chưa giải quyết',
    2: 'Đã xác nhận',
    3: 'Đã hủy',
    4: 'Hoàn thành'
  };

  const paymentMethod = {
    1: 'VnPay', 
    2: 'COD',
    3: 'PayPal',
  };

  const getOrdDetail = async (orderID, status) => {
    try {
      const response = await getOrderDetail(orderID);
      setOrderDetail({
        items: response.data,
        status: status,
        orderId: orderID
      });
      setShowDetail(true);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    }
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    setCancelError(null);
    
    try {
      const result = await cancelOrder(orderDetail.orderId);
      if (result) {
        const responseOrder = await getListOrder();
        setDataOrder(responseOrder.data);
        setShowCancelModal(false);
        setShowDetail(false);
      }
    } catch (error) {
      setCancelError(error.message || 'Không thể hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  if (error) return <div className="error-container">Error: {error.message}</div>;
  if (!inforUser) return <div className="loading-container">Loading...</div>;

  return (
    <div className='account'>
      {!isHidden && (
        <div className='account-container'>
          <div className="account-content">
            <div className="account-main">
              <div className="account-header">
                <div className="header-line"></div>
                <h1 className="account-title">TÀI KHOẢN CỦA TÔI</h1>
                <p className="welcome-text">Xin chào, <span className="username">{inforUser.userName}</span></p>
              </div>

              <div className="orders-section">
                <h2 className="section-title">ĐƠN HÀNG GẦN ĐÂY</h2>
                
                <div className="orders-table">
                  <div className="table-header">
                    <div className="header-cell order-id">MÃ ĐƠN</div>
                    <div className="header-cell date">NGÀY</div>
                    <div className="header-cell address">ĐỊA CHỈ</div>
                    <div className="header-cell amount">TỔNG</div>
                    <div className="header-cell payment">THANH TOÁN</div>
                    <div className="header-cell status">TRẠNG THÁI</div>
                  </div>

                  <div className="table-body">
                    {dataOrder.length > 0 ? (
                      dataOrder.map(order => (
                        <div key={order.orderID} className="table-row">
                          <div 
                            className="cell order-id-cell" 
                            onClick={() => getOrdDetail(order.orderID, order.status)}
                          >
                            #{order.orderID}
                          </div>
                          <div className="cell date-cell">{formatDateTime(order.orderDate)}</div>
                          <div className="cell address-cell">{order.shipping.shippingAddress}</div>
                          <div className="cell amount-cell">{order.totalAmount.toLocaleString()} VND</div>
                          <div className="cell payment-cell">{paymentMethod[order.paymentMethodID]}</div>
                          <div className="cell status-cell">
                            <span className={`status-badge status-${order.status}`}>
                              {statusMapping[order.status]}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <p>Không có đơn hàng nào</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="account-sidebar">
              <div className="sidebar-content">
                <h3 className="sidebar-title">CÀI ĐẶT TÀI KHOẢN</h3>
                <div className="sidebar-divider"></div>
                <button 
                  className="update-btn" 
                  onClick={() => navigate('/account/update')}
                >
                  <span className="btn-text">CHỈNH SỬA</span>
                  <div className="btn-arrow">→</div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Detail Modal */}
          {showDetail && (
            <div className="order-detail-modal">
              <div 
                className={`modal-backdrop ${showCancelModal ? 'confirmation-active' : ''}`} 
                onClick={() => showCancelModal ? setShowCancelModal(false) : setShowDetail(false)}
              />
              
              <div className="order-detail-content">
                <div className="modal-header">
                  <h2 className="modal-title">CHI TIẾT ĐƠN HÀNG</h2>
                  <button 
                    className="close-btn" 
                    onClick={() => setShowDetail(false)}
                    disabled={isCancelling}
                  >
                    <span className="close-icon">✕</span>
                  </button>
                </div>

                <div className="order-items">
                  <div className="items-header">
                    <div className="item-header product">SẢN PHẨM</div>
                    <div className="item-header quantity">SỐ LƯỢNG</div>
                    <div className="item-header price">GIÁ</div>
                  </div>

                  <div className="items-list">
                    {orderDetail.items.map((item) => (
                      <div key={item.orderDetailID} className="order-item">
                        <div className="item-product">
                          <Link 
                            className="product-link" 
                            to={`/product/${item.productDTO.productID}`}
                          >
                            {item.productDTO.productName}
                            <br/>
                            <span className='fw-normal'>{item.productSizeDTO.colorName} - {item.productSizeDTO.size}</span>
                          </Link>
                        </div>
                        <div className="item-quantity">{item.quantity}</div>
                        <div className="item-price">{item.unitPrice.toLocaleString()} VND</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {orderDetail.status === 0 && (
                  <div className='container cancel-button-container d-flex align-items-center justify-content-center mt-4'>
                    <button 
                      className='cancel-order-btn bg-danger button-primary'
                      onClick={() => setShowCancelModal(true)}
                      disabled={isCancelling}
                    >
                      Huỷ đơn hàng
                    </button>
                  </div>
                )}
                
                <div className="order-summary mt-2 container">
                  <div className="summary-item">
                    <span className="summary-label">Tổng tiền: </span>
                    <span className="summary-value">
                      {orderDetail.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0).toLocaleString()} VND
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Phí vận chuyển: </span>
                    <span className="summary-value">30.000 VND</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Tổng cộng: </span>
                    <span className="summary-value">
                      {(orderDetail.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0) + 30000).toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Cancel Order Confirmation Modal */}
              <CancelOrderModal
                showCancelModal={showCancelModal}
                setShowCancelModal={setShowCancelModal}
                orderDetail={orderDetail}
                isCancelling={isCancelling}
                cancelError={cancelError}
                handleCancelOrder={handleCancelOrder}
              />
            </div>
          )}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Account;