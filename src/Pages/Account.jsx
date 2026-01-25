import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useProduct } from '../Context/ProductContext';
import CancelOrderModal from '../Components/Modals/CancelOrderModal';
import './CSS/Account.css';
import { toast, ToastContainer } from 'react-toastify';
import { Package, User, ChevronRight, X, ExternalLink, MapPin, CreditCard, ShoppingBag } from 'lucide-react';

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
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const statusMapping = {
    0: 'Đang đóng gói',
    1: 'Chờ xử lý',
    2: 'Đã xác nhận',
    3: 'Đã hủy',
    4: 'Hoàn thành'
  };

  const paymentMethod = {
    1: 'VnPay',
    2: 'COD',
    3: 'PayPal',
  };

  const getOrdDetail = async (orderID, status, paymentMethodID) => {
    try {
      const response = await getOrderDetail(orderID);
      setOrderDetail({
        items: response.data,
        status: status,
        orderId: orderID,
        paymentMethodID: paymentMethodID
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
        toast.success("Đã hủy đơn hàng thành công");
      }
    } catch (error) {
      setCancelError(error.message || 'Không thể hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  if (error) return <div className="error-container">Lỗi: {error.message}</div>;
  if (!inforUser && !error) return <div className="loading-container">Đang tải...</div>;

  return (
    <div className='account-page-premium'>
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 999999 }} />

      {!isHidden && (
        <div className='container'>
          {/* Header Section */}
          <div className="account-hero-header">
            <div className="account-welcome-group">
              <h1>Tài khoản của tôi</h1>
              <p>Chào mừng trở lại, <strong>{inforUser.userName}</strong>. Đây là nơi quản lý đơn hàng của bạn.</p>
            </div>
          </div>

          <div className="account-grid">
            {/* Main Content: Orders */}
            <div className="orders-list-wrapper">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-2 bg-light rounded">
                  <Package size={20} className="text-dark" />
                </div>
                <h2 className="m-0">Đơn hàng gần đây</h2>
              </div>

              <div className="premium-order-table-header">
                <div>Mã đơn</div>
                <div>Ngày đặt</div>
                <div>Giao đến</div>
                <div>Tổng tiền</div>
                <div>Trạng thái</div>
              </div>

              <div className="orders-list">
                {dataOrder.length > 0 ? (
                  dataOrder.map(order => (
                    <div key={order.orderID} className="order-row-lux">
                      <div className="order-id-lux" onClick={() => getOrdDetail(order.orderID, order.status, order.paymentMethodID)}>
                        #{order.orderID}
                      </div>
                      <div className="order-date-lux">{formatDateTime(order.orderDate)}</div>
                      <div className="order-address-lux" title={order.shipping.shippingAddress}>
                        {order.shipping.shippingAddress}
                      </div>
                      <div className="order-total-lux">
                        {order.totalAmount.toLocaleString()}₫
                      </div>
                      <div className="order-status-lux">
                        <span className={`badge-lux badge-lux-${order.status}`}>
                          {statusMapping[order.status]}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <ShoppingBag size={48} strokeWidth={1} className="text-muted mb-3" />
                    <p className="text-muted">Bạn chưa có đơn hàng nào.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Settings */}
            <div className="account-settings-sidebar">
              <div className="d-flex align-items-center gap-3 mb-4">
                <User size={20} />
                <h3 className="m-0">Thiết lập</h3>
              </div>
              <p className="small opacity-75 mb-4">Cập nhật thông tin cá nhân và địa chỉ giao hàng của bạn.</p>

              <button
                className="btn-update-account"
                onClick={() => navigate('/account/update')}
              >
                <span>Chỉnh sửa hồ sơ</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Detailed Order Modal */}
          {showDetail && (
            <div className="order-detail-modal">
              <div
                className={`modal-backdrop ${showCancelModal ? 'confirmation-active' : ''}`}
                onClick={() => !showCancelModal && setShowDetail(false)}
              />

              <div className="order-detail-content" style={{ borderRadius: '24px' }}>
                <div className="lux-modal-header">
                  <h2>Chi tiết đơn hàng #{orderDetail.orderId}</h2>
                  <button className="lux-close-btn" onClick={() => setShowDetail(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="lux-modal-body">
                  <div className="order-items-lux-list">
                    {orderDetail.items.map((item) => (
                      <div key={item.orderDetailID} className="order-item-lux-card">
                        <div className="item-info-lux">
                          <Link to={`/product/${item.productDTO.productID}`} className="text-dark text-decoration-none">
                            <h4 className="item-name-lux">{item.productDTO.productName}</h4>
                          </Link>
                          <div className="item-meta-lux">
                            Màu: {item.productSizeDTO.colorName} • Size: {item.productSizeDTO.size}
                          </div>
                        </div>
                        <div className="item-pricing-lux">
                          <div className="fw-bold">{item.unitPrice.toLocaleString()}₫</div>
                          <div className="small text-muted">x{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lux-summary-box">
                    <div className="summary-row-lux">
                      <span>Tạm tính</span>
                      <span>{orderDetail.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0).toLocaleString()}₫</span>
                    </div>
                    <div className="summary-row-lux">
                      <span>Phí vận chuyển</span>
                      <span>30.000₫</span>
                    </div>
                    <div className="summary-row-lux total">
                      <span>Tổng cộng</span>
                      <span>{(orderDetail.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0) + 30000).toLocaleString()}₫</span>
                    </div>
                  </div>

                  {orderDetail.status === 0 && (
                    <div className="mt-5">
                      {orderDetail.paymentMethodID !== 1 ? (
                        <button
                          className="btn btn-danger w-100 py-3 fw-bold"
                          style={{ borderRadius: '12px' }}
                          onClick={() => setShowCancelModal(true)}
                          disabled={isCancelling}
                        >
                          {isCancelling ? 'Đang xử lý...' : 'Hủy đơn hàng này'}
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary w-100 py-3 fw-bold opacity-50"
                          style={{ borderRadius: '12px' }}
                          onClick={() => toast.info('Đơn hàng đã thanh toán không thể hủy tự động. Vui lòng liên hệ CSKH.')}
                        >
                          Không thể hủy đơn này
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

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