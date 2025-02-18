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
    '/account/reset',
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
  }, [getInforUser, getListOrder]);

  if (error) return <div>Error: {error.message}</div>;
  if (!inforUser || !dataOrder) return <div>Loading...</div>;

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')
    }:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  const statusMapping = {
    0: 'Đăng đóng gói hàng',
    1: 'Chưa giải quyết',
    2: 'Confirmed',
    3: 'Cancelled',
    4: 'Completed'
  };

  const paymentMethod = {
    1: 'VnPay', 
    2: 'VnPay',
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
        <div className='container' style={{ minHeight: '80vh' }}>
          <div className="row">
            <div className="col-10">
              <h3 className='mt-5'>Thông tin tài khoản</h3>
              <p>Xin chào, {inforUser.userName}</p>
              <div className='d-flex flex-column' style={{ fontSize: '14px' }}>
                <p className='mt-3 fw-bold'>Đơn hàng gần nhất của bạn</p>
                <div className='row title bg-light p-3 w-100 justify-content-center align-items-center'>
                  <div className="col-3 fw-bold">Mã đơn hàng</div>
                  <div className="col fw-bold">Ngày</div>
                  <div className="col fw-bold">Chuyển đến</div>
                  <div className="col fw-bold">Giá trị đơn hàng</div>
                  <div className="col fw-bold">Phương thức TT</div>
                  <div className="col fw-bold">Tình trạng TT</div>
                </div>

                <div className="row w-100 justify-content-center align-items-center border border-top-0 pt-2 pb-2">
                  {dataOrder.length > 0 ? (
                    dataOrder.map(order => (
                      <div key={order.orderID} className='row pt-2'>
                        <div className="col-3 text-primary" 
                          style={{cursor: 'pointer'}}
                          onClick={() => getOrdDetail(order.orderID)}
                        >
                          {order.orderID}
                        </div>
                        <div className="col">{formatDateTime(order.orderDate)}</div>
                        <div className="col"></div>
                        <div className="col">{order.totalAmount}</div>
                        <div className="col">{paymentMethod[order.paymentMethodID]}</div>
                        <div className="col">{statusMapping[order.status]}</div>
                      </div>
                    ))
                  ) : (
                    <p className='mt-2'>Không có đơn hàng nào gần đây.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col border-start" style={{minHeight: '80vh'}}>
              <p className='mt-5'>Tài khoản của tôi</p>
              <button className='btn btn-outline-dark m-auto' onClick={() => navigate('/account/update')}>Cập nhật thông tin</button>
            </div>
          </div>

          {/* Tab chi tiết đơn hàng */}
          {showDetail && (
            <div className="order-detail-modal">
              <div className="order-detail-content w-50">
                <h4>Chi tiết đơn hàng</h4>
                <button className="btn-close" onClick={() => setShowDetail(false)}>✖</button>
                <div className="row bg-light p-2">
                  <div className="col fw-bold text-uppercase">Tên sp</div>
                  <div className="col fw-bold text-uppercase">Số lượng</div>
                  <div className="col fw-bold text-uppercase">Đơn giá</div>
                </div>
                <div className="order-detail-items">
                  {orderDetail.map((item) => (
                    <div key={item.orderDetailID} className="order-item row">
                      <p className='col'><Link className='text-black' to={`/product/${item.productDTO.productID}`} style={{textDecoration: 'none'}}><strong>{item.productDTO.productName}</strong></Link></p>
                      <p className='col'>Số lượng: {item.quantity}</p>
                      <p className='col'>Đơn giá: {item.unitPrice.toLocaleString()} VND</p>
                    </div>
                  ))}
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
