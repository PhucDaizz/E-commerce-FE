import React, { useEffect, useState } from 'react';
import { useDashboard } from '../Context/DashboardContext';
import { useProduct } from '../Context/ProductContext';
import './CSS/Admin.css'; // Thêm file CSS riêng
import TrendChart from '../Components/TrendChart/TrendChart';

const Admin = () => {
    const { getTotalRevenue, getReportOrder, getReportInventory, getReportUser } = useDashboard();
    const { formatCurrency } = useProduct();
    const [dataRevenue, setDataRevenue] = useState({
        totalRevenue: 0,
        revenueChangePercentage: 0,
        totalRevenueThisMonth: 0
    });
    const [dataReportOrder, setDataReportOrder] = useState({})
    const [dataReportInventory, setDataReportInventory] = useState({})
    const [dataReportUser, setDataReportUser] = useState({})

    const handleGetTotalRevenue = async () => {
        try {
            const response = await getTotalRevenue();
            if (response.status === 200) {
                setDataRevenue(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy doanh thu:', error);
        }
    };

    const handleGetReportOrder = async () => {
      const response = await getReportOrder();
      if(response.status === 200) {
        setDataReportOrder(response.data);
      }
    }
    
    const handleGetReportInventory = async () => {
      const response = await getReportInventory();
      if(response.status === 200) {
        setDataReportInventory(response.data);
      }
    }
    const handleGetReportUser = async () => {
      const response = await getReportUser();
      if(response.status === 200) {
        setDataReportUser(response.data);
      }
    }

    useEffect(() => {
        handleGetTotalRevenue();
        handleGetReportOrder();
        handleGetReportInventory();
        handleGetReportUser();
    }, []);

    useEffect(() => {
        console.log(dataReportUser);
    }, [dataReportUser]);

    return (
        <div className="admin-dashboard container-fluid py-4 cont">
            <div className="row g-4">
                {/* Báo cáo doanh thu */}
                <h2 className=' fw-bold'>Thống kế bán hàng </h2>
                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm border-0 revenue-card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-bag-check-fill me-2" style={{ fontSize: '1.5rem' }}></i>
                                <h5 className="card-title mb-0 fw-bold">Tổng Doanh Thu</h5>
                            </div>
                            <p className="display-6 fw-bold text-dark mb-2">
                                {formatCurrency(dataRevenue.totalRevenue || 0)}
                            </p>
                            <div className="d-flex align-items-center">
                                {dataRevenue.revenueChangePercentage <= 0 ? (
                                    <div className="text-danger d-flex align-items-center">
                                        <i className="bi bi-graph-down-arrow me-1" style={{ fontSize: '1.2rem' }}></i>
                                        <span>{Math.abs(dataRevenue.revenueChangePercentage).toFixed(2)}%</span>
                                    </div>
                                ) : (
                                    <div className="text-success d-flex align-items-center">
                                        <i className="bi bi-graph-up-arrow me-1" style={{ fontSize: '1.2rem' }}></i>
                                        <span>{dataRevenue.revenueChangePercentage.toFixed(2)}%</span>
                                    </div>
                                )}
                                <small className="text-muted ms-2">so với kỳ trước</small>
                            </div>
                              <p><small>Tháng này: {formatCurrency(dataRevenue.totalRevenueThisMonth || 0)}</small></p>
                        </div>
                    </div>
                </div>

                {/* Các ô khác (placeholder) */}
                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm border-0 orders-card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-cart-fill text-success me-2" style={{ fontSize: '1.5rem' }}></i>
                                <h5 className="card-title mb-0 fw-bold">Số Đơn Hàng</h5>
                            </div>
                            <p className="display-6 fw-bold text-dark mb-2">{dataReportOrder.totalOrder}</p>
                            <div className="d-flex align-items-center">
                                {dataReportOrder.orderChangePercentage <= 0 ? (
                                    <div className="text-danger d-flex align-items-center">
                                        <i className="bi bi-graph-down-arrow me-1" style={{ fontSize: '1.2rem' }}></i>
                                        <span>{Math.abs(dataReportOrder.orderChangePercentage)}%</span>
                                    </div>
                                ) : (
                                    <div className="text-success d-flex align-items-center">
                                        <i className="bi bi-graph-up-arrow me-1" style={{ fontSize: '1.2rem' }}></i>
                                        <span>{dataReportOrder.orderChangePercentage}%</span>
                                    </div>
                                )}
                                <small className="text-muted ms-2">so với kỳ trước</small>
                            </div>
                            <p><small>Tháng này: {(dataReportOrder.totalOrderThisMonth || 0)} đơn</small></p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm border-0 inventory-card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-box-seam text-white me-2" style={{ fontSize: '1.5rem' }}></i>
                                <h5 className="card-title mb-0 fw-bold">Tồn Kho</h5>
                            </div>
                            <p className="display-6 fw-bold text-dark mb-2">{dataReportInventory.totalInventory}</p>
                            <small className="text-muted">Có <span className=' fw-bold'>{dataReportInventory.totalProductActive}/{dataReportInventory.totalProduct}</span> sản phẩm đang hoạt động</small>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm border-0 customers-card">
                        <div className="card-body p-4 ">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-people-fill text-white me-2" style={{ fontSize: '1.5rem' }}></i>
                                <h5 className="card-title mb-0 fw-bold">Khách Hàng</h5>
                            </div>
                            <p className="display-6 fw-bold text-dark mb-2">{dataReportUser.totalUser}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Khu vực bổ sung (ví dụ: biểu đồ) */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            {/* <h5 className="fw-bold mb-3">Xu hướng Doanh Thu</h5> */}
                            <div className="chart-placeholder p-2">
                                <TrendChart/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;