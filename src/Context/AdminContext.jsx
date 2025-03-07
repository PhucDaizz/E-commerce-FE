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

    const changeStatusDiscount = async(discountId) => {
        try {
            const response = await apiRequest({
                method: 'put',
                url : `/api/Discount/ChangeStatus/${discountId}`
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái discount:", error)
        }
    }

    const addVoucher = async(data) => {
        try {
            const response = apiRequest({
                method: 'post',
                url: '/api/Discount',
                data: data
            })
            return response;
        } catch (error) {
            console.error("Lỗi khi thêm discount:", error);
            return error.response;
        }
    }

    const deleteVoucher = async(voucherId) => {
        try {
            const response = await apiRequest({
                method: 'delete',
                url: `/api/Discount/${voucherId}`
            })
            return response;
        } catch (error) {
            console.error('Lỗi khi xoá voucher:', error);
            return error.response;
        }
    }
 
    const editVoucher = async(discountId,data) => {
        try {
            const response = apiRequest({
                method: 'put',
                url: `api/Discount/Update/${discountId}`,
                data: data
            })
            return response;
        } catch (error) {
            console.error('Lỗi khi sửa voucher:', error)
            return error.response;
        }
    }

    


    return (
        <AdminContext.Provider
            value={{
                hideSideBar,
                handleHideSideBar,
                getListOrder,
                getDetailOrder,
                changeStatusDiscount,
                addVoucher,
                deleteVoucher,
                editVoucher
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    return useContext(AdminContext);
};
