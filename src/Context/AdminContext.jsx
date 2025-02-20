import React, { createContext, useContext, useState } from 'react';
import { apiRequest } from '../utils/apiHelper';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [hideSideBar, setHideSideBar] = useState(false);

    const handleHideSideBar = () => {
        setHideSideBar(!hideSideBar);
    };

    const getListOrder = async (page, itemsPerPage, filter, findUserId) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `api/Order`,
                params: {
                    page: page,
                    itemInPage: itemsPerPage,
                    sortBy: filter,
                    userId: findUserId
                }
            });
            if (response.status === 200) {
                return response;
            }
        } catch (error) {
            console.log('Lỗi khi gọi danh sách đơn hàng');
            throw error;
        }
    };

    const getDetailOrder = async (orderId) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `/api/Order/GetDetailOderByIdADMIN?orderId=${orderId}`
            })
            if(response.status === 200) {
                return response
            }
        } catch (error) {
            console.log('Lỗi khi xem chi tiết hoá đơn:' , error)
            toast.error('Có lỗi khi xem chi tiết hoá đơn')
            throw error;
        }
    }



    return (
        <AdminContext.Provider
            value={{
                hideSideBar,
                handleHideSideBar,
                getListOrder,
                getDetailOrder
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    return useContext(AdminContext);
};
