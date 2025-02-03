import React, { createContext, useContext } from 'react'
import { apiRequest, apiRequestIMG } from '../utils/apiHelper'
import { data } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductContext = createContext();


export const ProductProvider  = ({children}) => {
 
    const handleAddProduct = async (productName, categoryID, price, description) => {
        try {
            const reponse = await apiRequest({
                method: 'post',
                url: '/api/Product/Add',
                data: {productName, categoryID, price, description}
            })
            toast.success("Thêm sản phẩm thành công");
            return reponse.data.productID
        } catch (error) {
            console.log("Lỗi khi thêm sản phẩm: ", error);
        }
    }

    const handleAddProductColor = async (colors) => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: '/api/ProductColor/AddRange',
                data: colors
            })
            toast.success("Thêm màu thành công");
            return response.data;
        } catch(error) {
            console.error("Lỗi khi thêm màu: ",error);
            return [];
        }
    }
    
    const getAllColor = async (productID) => {
        try{ 
            const response = await apiRequest({
                method: 'get',
                url: `/api/ProductColor/GetAllByProductId/${productID}`
            })
            return response.data;
        } catch(error) {
            console.error("lỗi khi gọi api màu: ", error);
        }
    }
 
    const addRangeColors = async(productSizes) => {
        try{

            const formattedData = {
                productSizes: productSizes
            };


            const response = await apiRequest({
                method: 'post',
                url: '/api/ProductSize/AddRange',
                data: formattedData
            })
            if(response.status === 200) {
                toast.success("Thêm kích thức sản phẩm thành công");
            } else {
                toast.error("Thêm thất bại")
            }
            
        } catch(error) {
            console.log("Lỗi khi thêm số lượng sản phẩm: ", error);
        }
    }

    const uploadImages = async(productID,images) => {
        try {
            const response = await apiRequestIMG({
                method: 'post',
                url: `/api/ProductImage/UploadListImage/${productID}`,
                data: images,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if(response.status === 200) {
                toast.success("Thêm hình ảnh thành công");
                return response;
            }
            else {
                toast.error('Lỗi khi tải ảnh lên');
                return response;
            }
        } catch(error) {
            console.log('Lỗi khi tải ảnh lên: ', error);
        }
    }

    
    return (
        <ProductContext.Provider value={{
            handleAddProduct,
            handleAddProductColor,
            getAllColor,
            addRangeColors,
            uploadImages
        }}>
            {children}
        </ProductContext.Provider>
  )
}




export const useProduct = () => {
    return useContext(ProductContext);
}
