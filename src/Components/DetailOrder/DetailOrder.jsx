import React, { useEffect, useState } from 'react';
import './DetailOrder.css';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useAdmin } from '../../Context/AdminContext';
import { useProduct } from '../../Context/ProductContext';
import OrderApproval from '../OrderApproval/OrderApproval';
import { useShipping } from '../../Context/ShippingContext';

const DetailOrder = () => {
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const { orderId } = useParams();
const { getDetailOrder } = useAdmin();
const { formatCurrency, getInforCoupon } = useProduct();
const { printBillOfLading } = useShipping();

const [showTab, setShowTab] = useState(false);
const [dataOrder, setDataOrder] = useState({});
const [orderDetail, setOrderDetail] = useState([]);
const [dataCoupon, setDataCoupon] = useState({});
const [showDropdown, setShowDropdown] = useState(false);
const [isOrderProcessing, setIsOrderProcessing] = useState(false);

const isApproved = dataOrder?.shippingDTO?.length > 0 && dataOrder.shippingDTO[0]?.shippingServicesID;

const handleGetDataDetailOrder = async () => {
    const response = await getDetailOrder(orderId);
    if (response.status === 200) {
        setDataOrder(response.data);
        setOrderDetail(response.data.getOrderDetailDTO);
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

const handlePrintBill = async (paperSize) => {
    const url = await printBillOfLading(dataOrder.shippingDTO[0].shippingServicesID, paperSize);
    if (url) {
        window.open(url, '_blank');
    }
};

const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
};

const subtotal = () => {
    let total = 0;
    orderDetail.forEach(element => {
        total += (element.unitPrice * element.quantity);
    });
    return total;
};

const methodPayment = {
    '1': 'Chuyển khoản ngân hàng',
    '2': 'COD'
};

const handleToggleTab = () => {
    setShowTab(!showTab);
};

const handleOrderApproved = async () => {
    setIsOrderProcessing(true);
    setShowTab(false);
    toast.success("Đơn hàng đã được duyệt thành công!");
    await handleGetDataDetailOrder(); // Cập nhật dữ liệu ngay lập tức
    setIsOrderProcessing(false);
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
  <div className='detail-order container mb-3'>
      <ToastContainer />
      <div className='d-flex justify-content-between w-100'>
        <h4 className='mt-4 mb-3 fw-bold'>Đơn hàng: {orderId}</h4>
        <div className='d-flex'>
          <button
              className={isApproved || isOrderProcessing ? 'btn btn-secondary m-3' : 'btn btn-outline-primary m-3'}
              onClick={handleToggleTab}
              disabled={isApproved || isOrderProcessing}
          >
              {showTab ? "Đóng" : "Duyệt đơn"}
          </button>
          {isApproved && (
              <div className='dropdown-container'>
                  <button className='btn btn-success m-3' onClick={handleToggleDropdown}>
                      In vận đơn <i className="bi bi-chevron-down" style={{ fontSize: '10px' }}></i>
                  </button>
                  {showDropdown && (
                      <div className='print-order'>
                          <button className='dropdown-item' onClick={() => handlePrintBill('A5')}>A5</button>
                          <button className='dropdown-item' onClick={() => handlePrintBill('80x80')}>80x80</button>
                          <button className='dropdown-item' onClick={() => handlePrintBill('52x70')}>52x70</button>
                      </div>
                  )}
              </div>
          )}
        </div>
      </div>

      {showTab && !isOrderProcessing && (
          <div className="order-approval-overlay" onClick={handleToggleTab}>
              <div className="order-approval-tab" onClick={(e) => e.stopPropagation()}>
                  <OrderApproval dataOrder={dataOrder} orderDetail={orderDetail} onOrderApproved={handleOrderApproved} />
              </div>
          </div>
      )}

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
                    src={
                      item.productDTO.images[0].imageURL
                      ? item.productDTO.images[0].imageURL.includes("cloudinary.com")
                          ? item.productDTO.images[0].imageURL
                          : `${apiUrl}/${item.productDTO.images[0].imageURL}`
                      : 'https://via.placeholder.com/60'
                    }
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
                      <br/>
                      <span className="text-muted fw-normal">{item.productSizeDTO.size} - {item.productSizeDTO.colorName}</span>
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
          <span className='fw-bold'>Thông tin vận chuyển</span>
            <div className="row mt-2">
              <p className='col-5'>Địa chỉ vận chuyển:</p>
              {dataOrder.shippingDTO && dataOrder.shippingDTO.length > 0 && (
                <p className='col'>{dataOrder.shippingDTO[0].shippingAddress}</p>
              )}
            </div>
            <div className="row">
              <p className='col-5'>SĐT: </p>
              {dataOrder.shippingDTO && dataOrder.shippingDTO.length > 0 && (
                <p className='col'>{dataOrder.shippingDTO[0].trackingNumber}</p>
              )}
            </div>
          </div>

          {/* PP thanh toán */}
          <div className='border bg-white p-3 mt-3'>
            <p className='fw-bold'>Phương thức thanh toán</p>
            <p>{methodPayment[dataOrder.paymentMethodID]}</p>
          </div>

          {/* Shipping */}
          <div className='border bg-white p-3 mt-3'>
            <p className='fw-bold'>Ngày vận chuyển dự kiến</p>
            {dataOrder.shippingDTO && dataOrder.shippingDTO.length > 0 && (
                <p className='fw-bold tx-succ'>
                    {(dataOrder.shippingDTO[0].actualDeliveryDate && dataOrder.shippingDTO[0].actualDeliveryDate !== "0001-01-01T00:00:00") 
                        ? dataOrder.shippingDTO[0].actualDeliveryDate 
                        : dataOrder.shippingDTO[0].estimatedDeliveryDate}
                </p>
            )}
            
            <p className='btn btn-outline-primary fw-bolder'><i className="bi bi-truck me-2 fw-bolder"></i>Theo dõi đơn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailOrder;
