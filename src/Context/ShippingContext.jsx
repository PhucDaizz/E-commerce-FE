import React, { createContext, useContext } from 'react'
import axios, { ghnApi } from '../api/axios';
import { ghnHeaders } from '../api/ghnHeaders';

const ShippingContext = createContext();

const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;
const SHOP_ID = import.meta.env.VITE_SHOP_ID;

export const ShippingProvider = ({children}) => {

    const getProvince = async() => {
        try {
            console.log(GHN_TOKEN)
            const response = await ghnApi.get('/master-data/province', {
                headers: ghnHeaders(GHN_TOKEN)
            });
            console.log(response);
        } catch (error) {
            console.error('Lỗi lấy danh sách tỉnh:', error);
            throw error;
        }
    }


    return (
        <ShippingContext.Provider value={{
            getProvince
        }}>
            {children}
        </ShippingContext.Provider>
    )
}

export const useShipping = () => {
    return useContext(ShippingContext);
}
