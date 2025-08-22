import React, { createContext, useContext } from 'react'
import axios, { ghnApi } from '../api/axios';
import { ghnHeaders } from '../api/ghnHeaders';
import { apiRequest, header } from '../utils/apiHelper';
import { data } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShippingContext = createContext();


const BASE_URL = import.meta.env.VITE_BASE_URL;
const GHN_TOKEN = import.meta.env.VITE_GHN_DEV_TOKEN;
const SHOP_ID = import.meta.env.VITE_SHOP_DEV_ID;

export const ShippingProvider = ({children}) => {

    const getProvince = async() => {
        try {
            const response = await ghnApi.get('/shiip/public-api/master-data/province', {
                headers: ghnHeaders(GHN_TOKEN)
            });
            return response.data.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách tỉnh:', error);
            throw error;
        }
    }

    const splitAndReverseAddress = (address) => {
        const parts = address.split(',').map(part => part.trim());
        const reversedParts = parts.reverse();

        const level4 = reversedParts[0];
        const level3 = reversedParts[1];
        const level2 = reversedParts[2];
        const level1 = reversedParts.slice(3).reverse().join(', ');

        return [level1, level2, level3, level4];
    };

    const getProvinceFromAddress = (address) => {
        const [, , , level4] = splitAndReverseAddress(address);
        return level4.trim();
    };

    const findProvince = (provinceName, provinces) => {
    if (!provinceName || !provinces) return null;

        return provinces.find(p =>
            p.ProvinceName?.toLowerCase().includes(provinceName.toLowerCase()) ||
            (Array.isArray(p.NameExtension) && 
            p.NameExtension.some(ext => ext.toLowerCase().includes(provinceName.toLowerCase())))
        ) || null;
    };

    const getTypeService = async(provinceAdminClient) => {
        const response = await ghnApi.post('/shiip/public-api/v2/shipping-order/available-services',
            {
                shop_id: parseInt(SHOP_ID),
                from_district: provinceAdminClient.admin.ProvinceID,
                to_district: provinceAdminClient.client.ProvinceID
            },
            {
                headers: ghnHeaders(GHN_TOKEN)
            }
        );
        return response.data;

    }


    const get_pick_shift = async() => {
        const response = await ghnApi.get('/shiip/public-api/v2/shift/date', {
            headers: ghnHeaders(GHN_TOKEN)
        });
        return response;
    }

    const updateShipping = async(orderId, data) => {
        
        if (!data || !data.data) {
            console.error("❌ Dữ liệu phản hồi từ API bị thiếu:", data);
            return { success: false, message: "Dữ liệu không hợp lệ từ API" };
        }

        const { order_code, total_fee, expected_delivery_time } = data.data;

        const dataSend = {
            shippingServicesID: order_code,
            shippingFee: total_fee,
            shippingStatus: "1", 
            actualDeliveryDate: expected_delivery_time
        };


        try {
            const response = await apiRequest({
                method: 'put',
                url: `/api/Shipping/${orderId}`,
                data: dataSend
            });
            return response;
        } catch (error) {
            console.error("Lỗi khi cập nhật shipping: ", error)
        }
    }



    const createShippingOrder = async(data, inforUserRecive, detailFromAddress, requiredNote, dimensions, pick_shift, couponShip, isWeightCargo, itemDimensions) => {
        try {

            function splitAndReverseAddress(address) {
                const parts = address.split(',').map(part => part.trim());
                
                const reversedParts = parts.reverse();
            
                const level4 = reversedParts[0];
                const level3 = reversedParts[1];
                const level2 = reversedParts[2];
                const level1 = reversedParts.slice(3).reverse().join(', '); 
            
                return [level1, level2, level3, level4];
            }

            function transformOrderDetails(orderDetails, itemDimensions) {
                return orderDetails.map(detail => {
                    const productName = detail.productDTO.productName;
                    const colorName = detail.productSizeDTO.colorName;
                    const size = detail.productSizeDTO.size;
                    const newName = `${productName} - ${colorName} - Size: ${size}`;

                    // Lấy kích thước từ itemDimensions nếu có (cho hàng nặng)
                    const dimensionData = itemDimensions?.find(item => 
                        item.productID === detail.productDTO.productID
                    );

                    return {
                        name: newName ,
                        code: detail.productDTO.productID.toString(),
                        quantity: detail.quantity,
                        price: detail.unitPrice,
                        length: dimensionData?.length || 20,
                        width: dimensionData?.width || 18,
                        height: dimensionData?.height || 7,
                        weight: dimensionData?.weight || 600,
                        category: {
                            level1: "Trang phục"  // Giá trị ví dụ, bạn có thể điều chỉnh hoặc lấy từ dữ liệu thực tế
                        }
                    };
                });
            }

            const addressUserFourLevel = splitAndReverseAddress(data.shippingDTO[0].shippingAddress)
            const addressAdminFourLevel = splitAndReverseAddress(detailFromAddress)
            const items = transformOrderDetails(data.getOrderDetailDTO, itemDimensions)


            const dataSend = {
                payment_type_id: 1,
                required_note: requiredNote,
                return_phone: '0373907378',
                return_address: detailFromAddress,
                return_district_id: null,
                return_ward_code: "",
                client_order_code: data.orderID,
                from_name: 'phucdaiStore',
                from_phone: '0373907378',
                from_address: detailFromAddress,
                from_ward_name: addressAdminFourLevel[1],
                from_district_name: addressAdminFourLevel[2],
                from_province_name: addressAdminFourLevel[3],
                to_name: inforUserRecive.userName,
                to_phone: inforUserRecive.phoneNumber,
                to_address: data.shippingDTO[0].shippingAddress,
                to_ward_name: addressUserFourLevel[1],
                to_district_name: addressUserFourLevel[2],
                to_province_name: addressUserFourLevel[3],
                cod_amount: data.totalAmount,
                length: dimensions.length,
                width: dimensions.width,
                height: dimensions.height,
                weight: dimensions.weight,
                cod_failed_amount: 20000,
                deliver_station_id: null,
                insurance_value: data.totalAmount,
                service_type_id: isWeightCargo ? 5 : 2,
                coupon: couponShip,
                pick_shift: [pick_shift],
                items: items
            }

            console.log(dataSend);

            const response = await ghnApi.post('/shiip/public-api/v2/shipping-order/create', 
                dataSend, 
                {
                    headers: ghnHeaders(GHN_TOKEN, SHOP_ID)
                }
            );
            return response;
        } catch (error) {
            console.log("Lỗi khi tạo hoá đơn: ", error);
            toast.error('Thông tin của đơn này chưa đầy đủ để lên đơn')
        }
    };
    
    const printBillOfLading = async (orderId, paperSize) => {
        try {
            const response = await ghnApi.post(`${BASE_URL}/shiip/public-api/v2/a5/gen-token`, 
                { order_codes: [orderId] },  
                { headers: ghnHeaders(GHN_TOKEN) }
            );
    
            if (response.status !== 200 || !response.data?.data?.token) {
                toast.error('Lỗi khi lấy token in vận đơn');
                return null;
            }
    
            const token = response.data.data.token;
            let url = '';
    
            switch (paperSize) {
                case 'A5':
                    url = `${BASE_URL}/a5/public-api/printA5?token=${token}`;
                    break;
                case '80x80':
                    url = `${BASE_URL}/a5/public-api/print80x80?token=${token}`;
                    break;
                case '52x70':
                    url = `${BASE_URL}/a5/public-api/print52x70?token=${token}`;
                    break;
                default:
                    toast.error('Kích thước giấy không hợp lệ');
                    return null;
            }
            console.log(url);
            return url;
        } catch (error) {
            console.error("Lỗi khi in vận đơn:", error);
            toast.error(error.response?.data?.message || 'Lỗi khi kết nối đến API in vận đơn');
            return null;
        }
    };


    return (
        <ShippingContext.Provider value={{
            getProvince,
            get_pick_shift,
            createShippingOrder,
            updateShipping,
            printBillOfLading,
            getProvinceFromAddress,
            findProvince,
            getTypeService
        }}>
            {children}
        </ShippingContext.Provider>
    )
}

export const useShipping = () => {
    return useContext(ShippingContext);
}
