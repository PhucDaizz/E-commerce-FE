import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../Context/ProductContext';
import Pagination from '../../Components/Pagination/Pagination';
import { useAdmin } from '../../Context/AdminContext';
import { toast, ToastContainer } from 'react-toastify';

const ListVoucher = () => {
    const [searchVoucher, setSearchVoucher] = useState('');
    const { getAllVoucher, formatCurrency, formatDateTime } = useProduct();
    const {changeStatusDiscount, addVoucher, deleteVoucher} = useAdmin();
    const [vouchers, setVouchers] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [fieldSearch, setFieldSearch] = useState("all");
    const [loading, setLoading] = useState(false);
    const [desc, setDesc] = useState(true);

    const navigate = useNavigate();
 
    const handleGetAllVoucher = async (page, items, field) => {
        setLoading(true);
        try {
            const response = await getAllVoucher(page, items, field, desc);
            if (response.status === 200) {
                setVouchers(response.data.discounts || []);
                setTotalPage(response.data.pageSize || 1);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách voucher:', error);
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatusVoucher = async(discountId) => {
        const response = await changeStatusDiscount(discountId)
        if(response.status === 200) {
            toast.success('Thay đổi trạng thái voucher thành công.')

            setVouchers(prevVouchers => 
                prevVouchers.map(voucher => 
                    voucher.discountID === discountId 
                    ? {...voucher, isActive: !voucher.isActive }
                    : voucher
                )
            )
        } 
        else {
            toast.error('Có lỗi trong quá trình chuyển trạng thái')
        }
    }

    useEffect(() => {
        handleGetAllVoucher(currentPage, itemsPerPage, fieldSearch, desc);
    }, [currentPage, itemsPerPage, fieldSearch, desc]);

    const typeVoucher = {
        '1': 'Giảm tiền',
        '2': 'Giảm phần trăm'
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleFieldSearchChange = (event) => {
        setFieldSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleChangeSort = () => {
        setDesc(!desc);
        setCurrentPage(1);
    }

    const handleDeleteVoucher = async(voucherId) => {
        const response = await deleteVoucher(voucherId);
        if(response.status === 200) {
            toast.success('Xoá voucher thành công');
        }
        else {
            toast.error('Đã có người dùng voucher này bạn không thể xoá');
        }
    }

    return (
        <div className='list-voucher container'>
            <ToastContainer/>
            <h4 className="mt-3">Danh sách voucher</h4>
            <div className="border shadow-sm mt-3 p-3 bg-white">
                <div className="row container mt-2 align-items-center">
                    <div className="col d-flex align-items-center flex-wrap gap-3">
                        <div className="d-flex align-items-center">
                            <label htmlFor='hide' className='me-2 mb-0'>Hiển thị</label>
                            <select
                                id='hide'
                                name='hide'
                                className='form-select w-auto'
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                        </div>

                        <div className="d-flex align-items-center">
                            <label className='me-2 mb-0'>Tìm kiếm theo</label>
                            <select
                                className='form-select w-auto'
                                value={fieldSearch}
                                onChange={handleFieldSearchChange}
                            >
                                <option value="all">Tất cả</option>
                                <option value="active">Đã kích hoạt</option>
                                <option value="inactive">Chưa kích hoạt</option>
                            </select>
                        </div>
                        
                        <div className="d-flex align-items-center">
                            <label htmlFor="">Ngày giảm dần</label>
                            <div className="form-check form-switch d-flex justify-content-center">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={desc}
                                    onChange={handleChangeSort}
                                />
                            </div>
                        </div>

                        <div className="d-flex align-items-center flex-grow-1">
                            <label htmlFor="find" className="me-2 mb-0">Mục</label>
                            <input
                                id="find"
                                name="find"
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm mã hoặc ID..."
                                value={searchVoucher}
                                onChange={(e) => setSearchVoucher(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col text-end btn-add">
                        <button className="btn btn-outline-primary" onClick={() => navigate('/admin/voucher/add')}>
                            <i className="bi bi-plus"></i> Thêm mới
                        </button>
                    </div>
                </div>

                <div className="voucher-header mt-3 bg-light p-2 mb-2 fw-bold" style={{ fontSize: '14px' }}>
                    <div className="row text-center">
                        <div className="col-1">Id</div>
                        <div className="col">Loại voucher</div>
                        <div className="col-1">Mã</div>
                        <div className="col-1">Số lượng</div>
                        <div className="col">Giá trị giảm</div>
                        <div className="col">Tiền tối thiểu</div>
                        <div className="col-1">Số lần dùng/người</div>
                        <div className="col-2">Ngày bắt đầu/Kết thúc</div>
                        <div className="col-1">Kích hoạt</div>
                        <div className="col">Tuỳ chỉnh</div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center mt-5">Đang tải...</div>
                ) : vouchers.length > 0 ? (
                    vouchers.map((item, index) => (
                        <div
                            key={item.discountID}
                            className={`row p-2 pt-3 pb-3 border border-0 rounded-4 text-center ${index % 2 === 0 ? 'bg-light' : ''}`}
                            style={{ fontSize: '14px' }}
                        >
                            <div className="col-1 d-flex justify-content-center align-items-center">{item.discountID}</div>
                            <div className="col d-flex justify-content-center align-items-center">{typeVoucher[item.discountType]}</div>
                            <div className="col-1 d-flex justify-content-center align-items-center">{item.code}</div>
                            <div className="col-1 d-flex justify-content-center align-items-center">{item.quantity}</div>
                            <div className="col d-flex justify-content-center align-items-center">
                                {item.discountType === 1 ? formatCurrency(item.discountValue) : `${item.discountValue}%`}
                            </div>
                            <div className="col d-flex justify-content-center align-items-center">{formatCurrency(item.minOrderValue)}</div>
                            <div className="col-1 d-flex justify-content-center align-items-center">{item.maxUsagePerUser}</div>
                            <div className="col-2 d-flex justify-content-center align-items-center">
                                <p className='border-end mb-0'>{formatDateTime(item.startDate)}</p>
                                <p className='mb-0'>{formatDateTime(item.endDate)}</p>
                            </div>
                            <div className="col-1 d-flex justify-content-center align-items-center">
                                <div className="form-check form-switch d-flex justify-content-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        checked={item.isActive}
                                        onChange={() => handleChangeStatusVoucher(item.discountID)} 
                                    />
                                </div>
                            </div>
                            <div className="col d-flex justify-content-center align-items-center">
                                <i className="bi bi-pencil me-2" onClick={() => navigate(`/admin/voucher/edit/${item.discountID}`)} style={{cursor: 'pointer', color: 'green'}}></i>
                                <i className="bi bi-trash3" onClick={() => handleDeleteVoucher(item.discountID)} style={{cursor: 'pointer', color: 'red'}}></i>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="container mt-5 border p-5 text-center">
                        <h4>Hiện không có voucher nào</h4>
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ListVoucher;