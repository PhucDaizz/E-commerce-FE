import React, { createContext, useContext, useState } from 'react'
import { apiRequest } from '../utils/apiHelper';

const AdminContext = createContext();


export const AdminProvider = ({ children }) => {
    const [hideSideBar, SetHideSideBar] = useState(false);

    const handleHideSideBar = () => {
        SetHideSideBar(!hideSideBar);
    }

    const getListOrder = async() => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/Order?isDESC=true&page=1&itemInPage=10',
            })
            if(response.status === 200) {
                return response;
            }
        } catch (error) {
            console.log('Lỗi khi gọi ds đơn hàng')
            throw error;
        }
    }


    return (
        <AdminContext.Provider value={
                {hideSideBar, 
                handleHideSideBar,
                getListOrder
                
                }}>
            {children}
        </AdminContext.Provider>

    ) 
}

export const useAdmin = () => {
    return useContext(AdminContext);
}
