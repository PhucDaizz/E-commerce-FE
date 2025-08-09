import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useProduct } from '../Context/ProductContext';
import './CSS/Account.css'

const Account = () => {
  const location = useLocation();
  const { getInforUser } = useAuth();
  const { getListOrder, getOrderDetail } = useProduct();
  const [inforUser, setInforUser] = useState({});
  const [dataOrder, setDataOrder] = useState([]);
  const [error, setError] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]); // Lưu chi tiết đơn hàng
  const [showDetail, setShowDetail] = useState(false); // Kiểm soát hiển thị tab
  const navigate = useNavigate();

  const hiddenRoutes = [
    '/account/update'
  ];
  const isHidden = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInforUser();
        const responseOrder = await getListOrder();
        setInforUser(response);
        setDataOrder(responseOrder.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [getListOrder]);

  useEffect(()=> {
    console.log(dataOrder)
  },[])

  if (error) return <div className="error-container">Error: {error.message}</div>;
  if (!inforUser || !dataOrder) return <div className="loading-container">Loading...</div>;

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')
    }:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  const statusMapping = {
    0: 'Đang đóng gói hàng',
    1: 'Chưa giải quyết',
    2: 'Confirmed',
    3: 'Cancelled',
    4: 'Completed'
  };

  const paymentMethod = {
    1: 'VnPay', 
    2: 'COD',
    3: 'PayPal',
  }

  const getOrdDetail = async (orderID) => {
    try {
      const response = await getOrderDetail(orderID);
      setOrderDetail(response.data);
      console.log(response.data)
      setShowDetail(true); // Hiển thị tab chi tiết
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    }
  };

  return (
    <div className='account'>
      {!isHidden && (
        <div className='account-container'>
          <div className="account-content">
            <div className="account-main">
              <div className="account-header">
                <div className="header-line"></div>
                <h1 className="account-title">MY ACCOUNT</h1>
                <p className="welcome-text">Welcome back, <span className="username">{inforUser.userName}</span></p>
              </div>

              <div className="orders-section">
                <h2 className="section-title">RECENT ORDERS</h2>
                
                <div className="orders-table">
                  <div className="table-header">
                    <div className="header-cell order-id">ORDER ID</div>
                    <div className="header-cell date">DATE</div>
                    <div className="header-cell address">SHIPPING TO</div>
                    <div className="header-cell amount">TOTAL</div>
                    <div className="header-cell payment">PAYMENT</div>
                    <div className="header-cell status">STATUS</div>
                  </div>

                  <div className="table-body">
                    {dataOrder.length > 0 ? (
                      dataOrder.map(order => (
                        <div key={order.orderID} className="table-row">
                          <div className="cell order-id-cell" 
                            onClick={() => getOrdDetail(order.orderID)}
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
                        <p>No recent orders found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="account-sidebar">
              <div className="sidebar-content">
                <h3 className="sidebar-title">Cài ĐẶT TÀI KHOẢN</h3>
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
              <div className="modal-backdrop" onClick={() => setShowDetail(false)}></div>
              <div className="order-detail-content">
                <div className="modal-header">
                  <h2 className="modal-title">ORDER DETAILS</h2>
                  <button className="close-btn" onClick={() => setShowDetail(false)}>
                    <span className="close-icon">✕</span>
                  </button>
                </div>

                <div className="order-items">
                  <div className="items-header">
                    <div className="item-header product">PRODUCT</div>
                    <div className="item-header quantity">QTY</div>
                    <div className="item-header price">PRICE</div>
                  </div>

                  <div className="items-list">
                    {orderDetail.map((item) => (
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
                <div className="order-summary">
                  <div className="summary-item">
                    <span className="summary-label">Total: </span>
                    <span className="summary-value">{orderDetail.reduce((total, item) => total + (item.unitPrice * item.quantity), 0).toLocaleString()} VND</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Shipping: </span>
                    <span className="summary-value">30.000 VND</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Grand Total: </span>
                    <span className="summary-value">{(orderDetail.reduce((total, item) => total + (item.unitPrice * item.quantity), 0) + 30000).toLocaleString()} VND</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Account;