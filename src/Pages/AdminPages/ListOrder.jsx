import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import '../CSS/ListOrder.css';
import Pagination from '../../Components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';

const ListOrder = () => {
    const { getListOrder } = useAdmin();
    const [listOrder, setListOrder] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [findUserId, setFindUserId] = useState('');
    const [clickSearch, setClickSearch] = useState(false);
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [error, setError] = useState(null); // Lưu lỗi API
    const navigate = useNavigate();
    

    const handleGetListOrder = async (page, itemsPerPage, filter, findUserId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getListOrder(page, itemsPerPage, filter, findUserId);
            if (response.status === 200) {
                setListOrder(response.data.items);
                setTotalPages(response.data.pageSize); // Tính tổng số trang
            }
        } catch (error) {
            setError('Không thể tải danh sách đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetListOrder(currentPage, itemsPerPage, filter, findUserId);
    }, [currentPage, itemsPerPage, filter, clickSearch]);

    const methodPayment = {
        '1': 'VnPay',
        '2': 'COD'
    };

    const statusOrder = {
        '0': { label: 'Chờ duyệt', className: 'text-warning fw-bold status-container border border-0 bg-pending' },
        '1': { label: 'Lỗi', className: 'text-danger fw-bold status-container border border-0 bg-error' },
        '2': { label: 'Hoàn tất', className: 'text-success fw-bold status-container border border-0 bg-succ' },
        '3': { label: 'Huỷ', className: 'text-secondary fw-bold status-container border border-0 bg-cancel' },
        '4': { label: 'Đã duyệt', className: ' text-white fw-bold status-container border border-0 bg-confirmed'}
    };

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = Number(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset về trang 1 để tránh lỗi
        setFilter(filter)
    };

    const handleChangeFilter = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
        setItemsPerPage(itemsPerPage);
    }

    const handleChangeUserId = (event) => {
        setFindUserId(event.target.value);
        
    }

    const handleClickSearch = () => {
        setClickSearch(!clickSearch);
        setCurrentPage(1);
        setItemsPerPage(itemsPerPage);
        setFilter(filter)
    }

    return (
        <div className='list-order container'>
            <div className='card admin-custom-header bg-primary text-white d-flex justify-content-between align-items-center mt-3'>
                <h4>Danh sách hoá đơn</h4>
            </div>

            <div className='mt-3 bg-white border shadow-sm border-0 p-3' style={{ minHeight: '30vh' }}>
                <div className='d-flex align-items-center mb-3'>
                    <div>
                        <label className='me-2 mb-0'>Hiển thị</label>
                        <select 
                            className='form-select d-inline-block w-auto me-2' 
                            onChange={handleItemsPerPageChange}
                            value={itemsPerPage}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>

                    <div>
                        <label className='me-2 mb-0'>Lọc theo</label>
                        <select 
                            className='form-select d-inline-block w-auto me-2'
                            onChange={handleChangeFilter}
                            value={filter}
                        >
                            <option value="orderdate">Ngày đặt</option>
                            <option value="error">TT Đơn: Lỗi</option>
                            <option value="pending">TT Đơn: Chờ duyệt</option>
                            <option value="confirmed">TT Đơn: Đã duyệt</option>
                            <option value="completed">TT Đơn: Hoàn tất</option>
                            <option value="cancel">TT Đơn: Huỷ</option>
                        </select>
                    </div>

                    <div className='d-flex position-relative w-25'>
                        <input
                            type="text"
                            className='form-control'
                            placeholder='Tìm kiếm đơn hàng'
                            style={{ paddingRight: '30px' }}
                            onChange={handleChangeUserId}
                            value={findUserId}
                        />
                        <i className="bi bi-search position-absolute" onClick={handleClickSearch} style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}></i>
                    </div>
                </div>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto', fontSize: '14px' }}>
                            <div className='row title mt-3 p-3 bg-light border border-0 fw-bold mb-3'>
                                <div className="col-2 text-center">Mã đơn hàng</div>
                                <div className="col-1 text-center">Giá</div>
                                <div className="col-1 text-center">Ngày đặt</div>
                                <div className="col-2 text-center">Phương thức TT</div>
                                <div className="col-2 text-center">Trạng thái</div>
                                <div className="col-2 text-center">Mã người đặt</div>
                                <div className="col text-center">Thao tác</div>
                            </div>
                            {listOrder.length > 0 ? 
                                (

                                    listOrder.map((order, index) => (
                                        <div key={order.orderID} className={`row  p-2 pt-3 pb-3 border border-0 rounded-4 ${index % 2 === 0 ? 'bg-light' : ''}`}>
                                            <div className="col-2 text-center" style={{ whiteSpace: 'normal' }}>{order.orderID}</div>
                                            <div className="col-1 text-center">{order.totalAmount.toLocaleString()} đ</div>
                                            <div className="col-1 text-center">{new Date(order.orderDate).toLocaleDateString()}</div>
                                            <div className="col-2 text-center">{methodPayment[order.paymentMethodID] || 'Không xác định'}</div>
                                            <div className="col-2 d-flex justify-content-center text-center">
                                                <span className={statusOrder[order.status]?.className}>
                                                    {statusOrder[order.status]?.label}
                                                </span>
                                            </div>
                                            <div className="col-2 text-center">{order.userID}</div>
                                            <div className="col d-flex align-items-center justify-content-center"> 
                                                <i className="bi bi-eye link-primary link-opacity-75-hover fw-bold" 
                                                    style={{fontSize:'20px', cursor: 'pointer'}}
                                                    onClick={() => navigate(`/admin/orders/${order.orderID}`)}
                                                ></i>
    
                                            </div>
                                        </div>
                                    ))
                                ): ( 
                                    <div className='container p-3' style={{minHeight: '50vh'}}>
                                        <div className='d-flex justify-content-center m-auto'>
                                            <h2 className=' opacity-75 mt-5'>Đơn hàng trống 🧐</h2>
                                        </div>

                                    </div>
                                )
                            }

                            
                        </div>
                        <hr />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ListOrder;
