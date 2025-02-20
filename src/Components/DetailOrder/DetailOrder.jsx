import React, { useEffect, useState } from 'react';
import './DetailOrder.css'
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useAdmin } from '../../Context/AdminContext';
import { useProduct } from '../../Context/ProductContext';
import { apiRequest } from '../../utils/apiHelper';

const DetailOrder = () => {
  const { orderId } = useParams();
  const { getDetailOrder } = useAdmin();
  const { formatCurrency, getInforCoupon } = useProduct();
  const [dataOrder, setDataOrder] = useState({});
  const [orderDetail, setOrderDetail] = useState([]);
  const [dataCoupon, setDataCoupon] = useState({});

  const handleGetDataDetailOrder = async () => {
    const response = await getDetailOrder(orderId);
    if (response.status === 200) {
      setDataOrder(response.data);
      setOrderDetail(response.data.getOrderDetailDTO)
      console.log(response.data);
    }
  };

  const handlegetDataCoupon = async () => {
    try {
      if (!dataOrder.discountID) return null;
      const response = await getInforCoupon(dataOrder.discountID);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin mã giảm giá:", error);
      return null;
    }
  };  

  const subtotal = () => {
    let total = 0
    orderDetail.forEach(element => {
      total += (element.unitPrice * element.quantity)
    });
    return total;
  }

  const methodPayment = {
    '1': 'Chuyển khoản ngân hàng',
    '2': 'COD'
  };

  useEffect(() => {
    handleGetDataDetailOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchCoupon = async () => {
      if (dataOrder.discountID) {
        const response = await handlegetDataCoupon();
        if (response.status === 200) {
          setDataCoupon(response.data);
          console.log("Coupon data loaded:", response.data);
        } else {
          console.error("Không thể lấy thông tin mã giảm giá");
        }
      }
    };
  
    fetchCoupon();
  }, [dataOrder.discountID]);
  

  return (
    <div className='detail-order container'>
      <ToastContainer />
      <h4 className='mt-4 mb-3 fw-bold'>Đơn hàng: {orderId}</h4>
      <div className="row">
        <div className="col">
          {/* Chi tiết sản phẩm */}
          <div className="border shadow-sm border-0 d-flex flex-column p-3 bg-white">
            <div className='border border-0 bg-info bg-light p-3'>
              <span className=' fw-bold'>Tất cả sản phẩm</span>
            </div>
            <div className='mt-3'> 
            {orderDetail?.length > 0 ? (
              orderDetail.map((item, index) => (
                <div key={index} className={`d-flex align-items-center p-3 mb-2 rounded ${index % 2 === 0 ? "bg-light" :""}`}>
                  {/* Hình ảnh sản phẩm */}
                  <img
                    src={`https://localhost:7295/Resources/${item.productDTO.image}` || "https://via.placeholder.com/60"}
                    alt={item.productDTO.productName}
                    className="rounded me-3"
                    width="60"
                    height="60"
                  />
                  
                  {/* Thông tin sản phẩm */}
                  <div className="w-50" >
                    <p className="mb-0 text-muted">Sản phẩm</p>
                    <h6 className={`fw-bold name-product`} style={{cursor: 'pointer'}}>
                      {item.productDTO.productName}
                    </h6>
                  </div>

                  {/* Số lượng */}
                  <div className="text-center mx-4 w-25">
                    <p className="mb-0 text-muted">Số lượng</p>
                    <h6 className="fw-bold">{item.quantity}</h6>
                  </div>

                  {/* Giá tiền */}
                  <div className="w-25 text-center">
                    <p className="mb-0 text-muted">Đơn giá</p>
                    <h6 className="fw-bold">{formatCurrency(item.productDTO.price)}</h6>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">Không có sản phẩm nào</p>
            )}

            </div>

            {/* Thông tin giỏ hàng */}
            <div className='mt-3 border shadow-sm border-0 d-flex flex-column p-3 bg-white'>
              <div className='bg-light w-100 border border-0 p-3 fw-bold d-flex'>
                <span className='w-75'>Tổng giỏ</span>
                <span className=''>Giá</span>
              </div>
              <div className='p-3 d-flex'>
                <span className='w-75'>Tổng phụ</span>
                <span className='fw-bold'>{formatCurrency(subtotal())}</span>
              </div>
              <hr className='m-1'/>
              <div className='p-3 d-flex'>
                <span className='w-75'>Vận chuyển</span>
                <span className='fw-bold'>30.0000đ</span>
              </div>
              <hr className='m-1'/>
              <div className='p-3 d-flex'>
                <span className='w-75'>Thuế</span>
                <span className='fw-bold'>...</span>
              </div>
              <hr className='m-1'/>

              {
                dataOrder.discountID && (
                  <div className='p-3 d-flex'>
                    <span className='w-75'>Giảm giá</span>
                    <span className='fw-bold'>
                      {dataCoupon.discountType === 1 
                        ? `-${formatCurrency(dataCoupon.discountValue)}` 
                        : `-${dataCoupon.discountValue}%`}
                    </span>
                    <hr className='m-1' />
                  </div>
                )
              }



              <div className='p-3 d-flex'>
                <span className='w-75 fw-bold'>Tổng cộng</span>
                <span className='fw-bold' style={{color:'red'}}>{formatCurrency(dataOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="border bg-white p-3">
            <span className='fw-bold'>Sơ lược</span>
            <div className='d-flex mt-2'>
              <span className='w-50'>Mã đơn hàng</span>
              <span className='w-50'>{orderId}</span>
            </div>
            <div className='d-flex mt-2'>
              <span className='w-50'>Ngày</span>
              <span className='w-50'>{new Date(dataOrder.orderDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Đ/C vận chuyển */}
          <div className='border bg-white p-3 mt-3'>
            <p className='fw-bold'>Địa chỉ vận chuyển:</p>
            <p>Chưa làm tới cái này dfhdjkf fdsljkfdsf fdsfds dskld</p>
          </div>

          {/* PP thanh toán */}
          <div className='border bg-white p-3 mt-3'>
            <p className='fw-bold'>Phương thức thanh toán</p>
            <p>{methodPayment[dataOrder.paymentMethodID]}</p>
          </div>

          {/* Shipping */}
          <div className='border bg-white p-3 mt-3'>
            <p className='fw-bold'>Ngày giao hàng dự kiến</p>
            <p className='fw-bold tx-succ'>7/4/2025 (chưa làm)</p>
            <p className='btn btn-outline-primary fw-bolder'><i className="bi bi-truck me-2 fw-bolder"></i>Theo dõi đơn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailOrder;
