import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import '../CSS/ListOrder.css';

const ListOrder = () => {
    const { getListOrder } = useAdmin();
    const [listOrder, setListOrder] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handleGetListOrder = async () => {
        const response = await getListOrder();
        if (response.status === 200) {
            setListOrder(response.data.items);
        }
    };

    useEffect(() => {
        handleGetListOrder();
    }, []);

    useEffect(() => {
        console.log(listOrder);
    }, [listOrder]);

    const methodPayment = {
        '1': 'VnPay',
        '2': 'COD'
    };

    const statusOrder = {
        '0': { label: 'Lỗi', className: 'text-danger fw-bold status-container border border-0 bg-error' },
        '1': { label: 'Chưa giải quyết', className: 'text-warning fw-bold status-container border border-0 bg-pending' },
        '2': { label: 'Hoàn tất', className: 'text-success fw-bold status-container border border-0 bg-succ' },
        '3': { label: 'Huỷ', className: 'text-secondary fw-bold status-container border border-0 bg-cancel' }
    };

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = Number(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    }

    return (
        <div className='list-order container'>
            <div className='mt-3'>
                <h4>Danh sách hoá đơn</h4>
            </div>

            <div className='mt-3 bg-white border shadow-sm border-0 p-3' style={{ minHeight: '30vh' }}>
                <div className='d-flex'>
                    <div>
                        <label className='me-2 mb-0'>Hiển thị</label>
                        <select 
                            id='hide' 
                            name='hide' 
                            className='form-select d-inline-block w-auto me-2' 
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>

                    <div>
                        <label className='me-2 mb-0'>Lọc theo</label>
                        <select 
                            id='filter' 
                            name='filter' 
                            className='form-select d-inline-block w-auto me-2' 
                        >
                            <option value="10">Ngày đặt</option>
                            <option value="20">TT Đơn: Lỗi</option>
                            <option value="30">TT Đơn: Chưa giải quyết</option>
                            <option value="30">TT Đơn: Hoàn tất</option>
                            <option value="30">TT Đơn: Lỗi</option>
                        </select>
                    </div>

                    <div className='d-flex position-relative w-25'>
                        <input
                            type="text"
                            className='form-control'
                            placeholder='Kìm kiếm đơn hàng'
                            style={{ paddingRight: '30px' }}
                        />
                        <i
                            className="bi bi-search position-absolute"
                            style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                        ></i>
                    </div>
                </div>
                
                
                <div style={{ overflowX: 'auto' }}>
                    <div className='row title mt-3 p-2 bg-light border border-0 fw-bold'>
                        <div className="col-2 text-center">Mã đơn hàng</div>
                        <div className="col-1 text-center">Giá</div>
                        <div className="col-1 text-center">Ngày đặt</div>
                        <div className="col-2 text-center">Phương thức TT</div>
                        <div className="col-2 text-center">Trạng thái đơn hàng</div>
                        <div className="col-2 text-center">Mã người đặt</div>
                        <div className="col text-center">Thao tác</div>
                    </div>
                    {listOrder.map((order) => (
                        <div key={order.orderID} className='row mt-3 p-2 border border-0'>
                            <div className="col-2 text-center" style={{ whiteSpace: 'normal' }}>{order.orderID}</div>
                            <div className="col-1 text-center">{order.totalAmount}</div>
                            <div className="col-1 text-center">{new Date(order.orderDate).toLocaleDateString()}</div>
                            <div className="col-2 text-center">{methodPayment[order.paymentMethodID]}</div>
                            <div className="col-2 d-flex justify-content-center text-center">
                                <span className={statusOrder[order.status]?.className}>
                                    {statusOrder[order.status]?.label}
                                </span>
                            </div>
                            <div className="col-2 text-center" style={{ whiteSpace: 'normal' }}>{order.userID}</div>
                            <div className="col text-center">
                                {/* Thao tác ở đây */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListOrder;
