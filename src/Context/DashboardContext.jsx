import React, { createContext, useContext } from 'react'
import { apiRequest } from '../utils/apiHelper';

const DashboardContext = createContext();

export const DashboardProvider = ({children}) => {

    const getTotalRevenue = async() => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/Dashboard/GetTotalRevenue'
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi thống kê doanh thu:", error)
        }
    }

    const getReportOrder = async() => {
        try {
            const response = apiRequest({
                method: 'get',
                url: '/api/Dashboard/GetReportOrder'
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi thống kê đơn hàng:", error)
        }
    }

    const getReportInventory = async() => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/Dashboard/GetReportInventory'
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi thống kê tồn kho:", error)
        }
    }

    const getReportUser = async() => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/Dashboard/GetReportUser'
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi thống người dùng:", error)
        }
    }

    const getReportTopSelling = async(item) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `/api/Dashboard/TopSellingProducts?items=${item}`
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi thống sản phẩm bán chạy:", error)
        }
    }

    const getReportRevenue = async(type) => {
        try {
            const endpoint = type === 'DAILY' ? '/api/Dashboard/daily' : '/api/Dashboard/monthly';
            const response = await apiRequest({
                method: 'get',
                url: endpoint
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi thống kê doanh thu:", error)
        }
    }

    const CustomerLocationAnalysis = async() => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/Dashboard/top-locations?topN=10'
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi thống kê địa điểm khách hàng:", error)
        }
    }

    return (
        <DashboardContext.Provider
            value={{
                getTotalRevenue,
                getReportOrder,
                getReportInventory,
                getReportUser,
                getReportTopSelling,
                getReportRevenue,
                CustomerLocationAnalysis
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}

export const useDashboard = () => {
    return useContext(DashboardContext);
};