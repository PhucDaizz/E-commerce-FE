import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAdmin } from '../../Context/AdminContext';
import { toast, ToastContainer } from 'react-toastify';
import { useProduct } from '../../Context/ProductContext';

const EditVoucher = () => {
    const {voucherId} = useParams();
    const {editVoucher} = useAdmin();
    const {getInforCoupon} = useProduct();

    const [discountValueLabel, setDiscountValueLabel] = useState('Giá trị giảm (VNĐ)');
    const [discountPlaceholder, setDiscountPlaceholder] = useState('VD: 50000');
    const [voucher, setVoucher] = useState({
        code: '',
        description: '',
        discountType: 1, // 1 = fixed amount, 2 = percentage
        discountValue: 0,
        quantity: 1,
        maxUsagePerUser: 1,
        minOrderValue: 0,
        startDate: '',
        endDate: '',
        isActive: true
    });
    const [used, setUsed] = useState(true);


    useEffect(() => {
        const handleGetInforVoucher = async(voucherId) => {
            const response = await getInforCoupon(voucherId);
            if(response.status === 200) {
                setVoucher(response.data)
                setUsed(response.data.description?.includes('[USED]') || false);
            }
        }
        

        handleGetInforVoucher(voucherId);
    }, [voucherId])
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'discountType') {
            setVoucher(prev => ({
                ...prev,
                [name]: parseInt(value, 10)
            }));
        } else {
            setVoucher(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : 
                        type === 'number' ? Number(value) : value
            }));
        }
    };


    const handleCreateVoucher = async (voucher) => {
        try {
            const response = await addVoucher(voucher);
            if (response && response.status === 200) {
                toast.success('Thêm voucher thành công');
            } else if (response && response.status === 400) {
                toast.error(response.data || 'Có lỗi xảy ra khi thêm voucher');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // Hiển thị thông báo lỗi từ phản hồi của máy chủ
                toast.error('Lỗi khi thêm voucher: ' + error.response.data);
            } else {
                // Hiển thị thông báo lỗi chung
                toast.error('Lỗi khi thêm voucher: ' + error.message);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Voucher data:', voucher);
        handleCreateVoucher(voucher);
    };

    return (
        <div className='edit-voucher container'>
            <ToastContainer/>

            <h3 className='mt-3'>Sửa voucher</h3>

            <div className="card shadow-sm border-0 mt-3">
                <div className=" d-flex justify-content-between align-items-center">
                    <button type="button" className="btn-close btn-close-white" aria-label="Close"></button>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Mã voucher */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="code" className="form-label fw-bold">Mã voucher</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="bi bi-tag-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="code"
                                        name="code"
                                        value={voucher.code}
                                        onChange={handleChange}
                                        placeholder="Nhập mã voucher (VD: SUMMER2025)"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Loại giảm giá */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="discountType" className="form-label fw-bold">Loại giảm giá</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="bi bi-percent"></i>
                                    </span>
                                    <select
                                        className="form-select"
                                        id="discountType"
                                        name="discountType"
                                        value={voucher.discountType}
                                        onChange={handleChange}
                                        required
                                        disabled={used}
                                    >
                                        <option value={1}>Giảm tiền cố định</option>
                                        <option value={2}>Giảm theo phần trăm</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Giá trị giảm - Dynamically updates label */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="discountValue" className="form-label fw-bold">{discountValueLabel}</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        {parseInt(voucher.discountType, 10) === 1 ? 
                                            <i className="bi bi-currency-dollar"></i> : 
                                            <i className="bi bi-percent"></i>}
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="discountValue"
                                        name="discountValue"
                                        value={voucher.discountValue}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder={discountPlaceholder}
                                        required
                                        disabled={used}
                                    />
                                </div>
                                <small className="text-muted">
                                    {parseInt(voucher.discountType, 10) === 1 ? 
                                        "Giảm trực tiếp số tiền này khỏi đơn hàng" : 
                                        "Giảm theo % tổng giá trị đơn hàng"}
                                </small>
                            </div>

                            {/* Giá trị đơn hàng tối thiểu */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="minOrderValue" className="form-label fw-bold">Giá trị đơn hàng tối thiểu (VNĐ)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="bi bi-cart-check"></i>
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="minOrderValue"
                                        name="minOrderValue"
                                        value={voucher.minOrderValue}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="VD: 100000"
                                        required
                                        disabled={used}
                                    />
                                </div>
                                <small className="text-muted">Đơn hàng phải đạt giá trị này mới áp dụng được voucher</small>
                            </div>
                        </div>

                        <div className="row">
                            {/* Số lượng */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="quantity" className="form-label fw-bold">Số lượng voucher</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="bi bi-stack"></i>
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        name="quantity"
                                        value={voucher.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="Số lượng voucher khả dụng"
                                        required
                                    />
                                </div>
                                <small className="text-muted">Tổng số voucher có thể sử dụng</small>
                            </div>

                            {/* Số lần sử dụng tối đa trên mỗi người dùng */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="maxUsagePerUser" className="form-label fw-bold">Số lần dùng tối đa/người</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="bi bi-person-check"></i>
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="maxUsagePerUser"
                                        name="maxUsagePerUser"
                                        value={voucher.maxUsagePerUser}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="VD: 1"
                                        required
                                    />
                                </div>
                                <small className="text-muted">Số lần tối đa mỗi người dùng có thể sử dụng voucher này</small>
                            </div>
                        </div>

                        <div className="row">
                            {/* Ngày bắt đầu */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="startDate" className="form-label fw-bold">Ngày bắt đầu</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="bi bi-calendar-plus"></i>
                                    </span>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="startDate"
                                        name="startDate"
                                        value={voucher.startDate}
                                        onChange={handleChange}
                                        required
                                        disabled={used}
                                    />
                                </div>
                            </div>

                            {/* Ngày kết thúc */}
                            <div className="mb-4 col-md-6">
                                <label htmlFor="endDate" className="form-label fw-bold">Ngày kết thúc</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <i className="bi bi-calendar-x"></i>
                                    </span>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="endDate"
                                        name="endDate"
                                        value={voucher.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className="mb-4">
                            <label htmlFor="description" className="form-label fw-bold">Mô tả</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-file-text"></i>
                                </span>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={voucher.description}
                                    onChange={handleChange}
                                    placeholder="Mô tả chi tiết về voucher"
                                    rows="3"
                                />
                            </div>
                        </div>

                        {/* Trạng thái kích hoạt - More attractive design */}
                        <div className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body d-flex justify-content-between align-items-center p-3">
                                    <div>
                                        <h6 className="fw-bold mb-0">Trạng thái voucher</h6>
                                        <p className="text-muted mb-0 small">
                                            {voucher.isActive ? 
                                                "Voucher đang được kích hoạt và sẵn sàng sử dụng" : 
                                                "Voucher hiện đang bị vô hiệu hóa"}
                                        </p>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="isActive"
                                            name="isActive"
                                            checked={voucher.isActive}
                                            onChange={handleChange}
                                            style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nút lưu - Action buttons */}
                        <div className="row mt-4">
                            <div className="col-12 col-md-6 mb-3 mb-md-0">
                                <button type="button" className="btn btn-outline-secondary w-100 py-2" onClick={() =>  navigate(-1)}>
                                    <i className="bi bi-x-circle me-2"></i>Hủy
                                </button>
                            </div>
                            <div className="col-12 col-md-6">
                                <button type="submit" className="btn btn-outline-primary w-100 py-2">
                                    <i className="bi bi-save me-2"></i>Lưu voucher
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditVoucher
