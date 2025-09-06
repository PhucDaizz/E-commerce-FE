import React, { useEffect, useState } from 'react';
import { useDashboard } from '../Context/DashboardContext';
import { useProduct } from '../Context/ProductContext';
import './CSS/Admin.css';
import TrendChart from '../Components/TrendChart/TrendChart';
import RevenueChart from '../Components/RevenueChart/RevenueChart';
import CustomerLocationAnalysis from '../Components/CustomerLocationAnalysis/CustomerLocationAnalysis';

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

    const formatPercentage = (percentage) => {
        return Math.abs(percentage || 0).toFixed(1);
    };

    return (
        <div className="admin-dashboard container mt-4">
            {/* Header Section */}
            <div className="dashboard-header mb-4 card-header">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="dashboard-title mb-0">
                                {/* <i className="bi bi-speedometer2 me-3"></i> */}
                                Dashboard Quản Trị
                            </h1>
                            {/* <p className="dashboard-subtitle text-muted mt-2 mb-0">
                                Tổng quan hiệu suất kinh doanh
                            </p> */}
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="dashboard-date">
                                <i className="bi bi-calendar3 me-2"></i>
                                {new Date().toLocaleDateString('vi-VN', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                {/* Stats Cards */}
                <div className="row g-4 mb-5">
                    {/* Revenue Card */}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="stats-card revenue-card">
                            <div className="card-body">
                                <div className="stats-icon">
                                    <i className="bi bi-currency-dollar"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-header">
                                        <h6 className="stats-title">Tổng Doanh Thu</h6>
                                        <div className="stats-trend">
                                            {dataRevenue.revenueChangePercentage > 0 ? (
                                                <span className="trend-up">
                                                    <i className="bi bi-arrow-up"></i>
                                                    {formatPercentage(dataRevenue.revenueChangePercentage)}%
                                                </span>
                                            ) : (
                                                <span className="trend-down">
                                                    <i className="bi bi-arrow-down"></i>
                                                    {formatPercentage(dataRevenue.revenueChangePercentage)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="stats-value">
                                        {formatCurrency(dataRevenue.totalRevenue || 0)}
                                    </div>
                                    <div className="stats-footer">
                                        <small className="text-muted">
                                            Tháng này: <strong>{formatCurrency(dataRevenue.totalRevenueThisMonth || 0)}</strong>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="stats-card orders-card">
                            <div className="card-body">
                                <div className="stats-icon">
                                    <i className="bi bi-bag-check"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-header">
                                        <h6 className="stats-title">Đơn Hàng</h6>
                                        <div className="stats-trend">
                                            {(dataReportOrder.orderChangePercentage || 0) > 0 ? (
                                                <span className="trend-up">
                                                    <i className="bi bi-arrow-up"></i>
                                                    {formatPercentage(dataReportOrder.orderChangePercentage)}%
                                                </span>
                                            ) : (
                                                <span className="trend-down">
                                                    <i className="bi bi-arrow-down"></i>
                                                    {formatPercentage(dataReportOrder.orderChangePercentage)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="stats-value">
                                        {(dataReportOrder.totalOrder || 0).toLocaleString()}
                                    </div>
                                    <div className="stats-footer">
                                        <small className="text-muted">
                                            Tháng này: <strong>{(dataReportOrder.totalOrderThisMonth || 0).toLocaleString()} đơn</strong>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Card */}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="stats-card inventory-card">
                            <div className="card-body">
                                <div className="stats-icon">
                                    <i className="bi bi-boxes"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-header">
                                        <h6 className="stats-title">Tồn Kho</h6>
                                        <div className="inventory-status">
                                            <span className="badge bg-success">Hoạt động</span>
                                        </div>
                                    </div>
                                    <div className="stats-value">
                                        {(dataReportInventory.totalInventory || 0).toLocaleString()}
                                    </div>
                                    <div className="stats-footer">
                                        <div className="progress-container">
                                            <div className="d-flex justify-content-between mb-1">
                                                <small className="text-muted">Sản phẩm hoạt động</small>
                                                <small className="fw-bold">
                                                    {dataReportInventory.totalProductActive || 0}/{dataReportInventory.totalProduct || 0}
                                                </small>
                                            </div>
                                            <div className="progress" style={{height: '4px'}}>
                                                <div 
                                                    className="progress-bar bg-success" 
                                                    style={{
                                                        width: `${((dataReportInventory.totalProductActive || 0) / (dataReportInventory.totalProduct || 1)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Card */}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="stats-card users-card">
                            <div className="card-body">
                                <div className="stats-icon">
                                    <i className="bi bi-people"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-header">
                                        <h6 className="stats-title">Khách Hàng</h6>
                                        <div className="stats-trend">
                                            <span className="trend-neutral">
                                                <i className="bi bi-people-fill"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stats-value">
                                        {(dataReportUser.totalUser || 0).toLocaleString()}
                                    </div>
                                    <div className="stats-footer">
                                        <small className="text-muted">Tổng số khách hàng đăng ký</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="row">
                    <div className="col-12">
                        <div className="chart-container">
                            <div className="chart-header">
                                <h5 className="chart-title">
                                    <i className="bi bi-bar-chart-line me-2"></i>
                                    Phân Tích Bán Hàng
                                </h5>
                                <p className="chart-subtitle">Thống kê sản phẩm bán chạy nhất</p>
                            </div>
                            <div className="chart-body">
                                <TrendChart/>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <RevenueChart />
                            </div>
                            <div style={{ padding: '20px' }}>
                                <CustomerLocationAnalysis/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;