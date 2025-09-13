import React, { createContext, useContext, useState } from 'react'
import { apiRequest, apiRequestIMG } from '../utils/apiHelper'
import { data } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const ProductContext = createContext();


export const ProductProvider  = ({children}) => {

    const [listProduct, setListProduct] = useState([])

 
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
            return response;
        } catch(error) {
            console.log("Lỗi khi thêm số lượng sản phẩm: ", error);
            toast.error("Có lỗi xảy ra khi thêm kích thước");
            throw error;
        }
    }

    const uploadImages = async (productID, images, onCloud = false) => {
        try {
            const response = await apiRequestIMG({
                method: 'post',
                url: `/api/ProductImage/UploadListImage/${productID}?onCloud=${onCloud}`,
                data: images,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                toast.success("Thêm hình ảnh thành công");
                return response;
            } else {
                toast.error('Lỗi khi tải ảnh lên');
                return response;
            }
        } catch (error) {
            console.log('Lỗi khi tải ảnh lên: ', error);
        }
    };


    const deleteProduct = async(productId) => {
        try {
            const response = await apiRequest({
                method: 'delete',
                url: `/api/Product/delete/${productId}`
            })
            if (response.status === 200) {
                toast.success(`Xoá sản phẩm #${productId} thành công`)
                return response;
            }
            else{
                toast.error('Sản phẩm này đã được người dùng mua. Không thể xoá');
                return response;
            }

        } catch (error) {
            console.log('Lỗi khi xoá sản phẩm   : ', error);
        }
    }

    const getAllProduct = async(page, itemInPage, sortBy, categoryId) => {
        try {
            const response = await axios.get(`/api/Product/GetAll`, {
                params: {
                    isDESC: true,
                    page: page,
                    itemInPage: itemInPage,
                    sortBy: null,
                    categoryId: categoryId
                }
            })
            if(response.status === 200) {
                setListProduct(response.data)
                console.log(response.data)
            }
        } catch(error) {
            console.error("Lỗi khi gọi ds sản phẩm:", error)
        }
    }
    
    const getAllProductAdmin = async (page, itemInPage, sortBy, categoryId, searchQuery) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `/api/Product/GetAllAdmin`,
                params: {
                    isDESC: true,
                    page: page,
                    itemInPage: itemInPage,
                    sortBy: sortBy,
                    categoryId: categoryId,
                    productName: searchQuery? searchQuery : ''
                }
            });
            
            if (response.status === 200) {
                setListProduct(response.data);
                console.log(response.data);
            } else {
                console.error("Lỗi khi gọi ds sản phẩm:", response.status);
            }
        } catch (error) {
            console.error("Lỗi khi gọi ds sản phẩm:", error);
        }
    };
    
    const getDetailProduct = async(productID) => {
        try {
            const response = await axios.get(`/api/Product/Detail/${productID}`);
            if(response.status === 200) {
                return response.data;
            }
        } catch(error) {
            console.error("Lỗi khi gọi chi tiết sản phẩm:", error)
        }
    }

    function formatCurrency(amount) {
        if (!amount || isNaN(amount)) return '0đ';
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
    }
    
    const editProduct = async (productID, information) => {
        try {
            const response = await apiRequest({
                method: 'put',
                url : `/api/Product/edit/${productID}`,
                data: information
            })
            if(response.status === 200) {
                toast.success("Chỉnh sửa thông tin sản phẩm thành công")
                return response;
            }
        } catch(error) {
            console.error("Lỗi khi chỉnh sửa thông tin sản phẩm:", error)
        }
    }

    const deleteColor = async (colorID) => {
        try {
            const response = await apiRequest({
                method: 'delete',
                url: `/api/ProductColor/${colorID}`
            })

            return response;
        } catch(error) {
            console.error('Lỗi khi xoá màu: ', error);
        }
    }

    const deleteSize = async (colorID, size) => {
        try {
            const response = await apiRequest({
                method: 'delete',
                url: `/api/ProductSize/DeleteByColorAndSize/${colorID}?size=${size}`
            })
            if(response.status === 200) {
                toast.success("Xoá màu thành công")
            }
        } catch(error) {
            console.error("Lỗi khi xoá size:", error);
        }
        
    }

    const changeStatusProduct = async (productID) => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: `/api/Product/ToPublic/${productID}`
            });
    
            return response; // Trả về response để kiểm tra status
    
        } catch (error) {
            console.log("Lỗi khi chuyển trạng thái SP: ", error);
            throw error; // Ném lỗi để handleCheckboxChange có thể bắt được
        }
    };

    const pauseSaleProduct = async (productID) => {
        try {
            const resonse = await apiRequest({
                method: 'post',
                url: `api/Product/pausesale/${productID}`
            });
            return resonse;
        } catch (error) {
            console.log("Lỗi khi xoá sản phẩm: ",error);
            throw error;
        }
    }



    const deleteImage = async (imageID) => {
        try {
            const response =  apiRequest({
                method: 'delete', 
                url: `/api/ProductImage/${imageID}`
            })
            return response;
        } catch(error) {
            console.error("Lỗi khi xoá ảnh: ", error);
            throw error;
        }
    }

    const getListOrder = async() => {
        try {
            const response =await apiRequest({
                method: 'get',
                url: '/api/Order/ListOrders'
            })
            if(response.data == 'Your order is empty'){
                response.data = [];
            }
            return response;
        } catch (error) {
            console.error('Lỗi khi gọi danh sách đặt hàng: ', error)
        }
    }

    const getOrderDetail = async(orderID) => {
        try {
            const response = apiRequest({
                method: 'get',
                url: `/api/OrderDetail/getdetail/${orderID}`
            })
            return response;
        } catch (error) {
            console.error('Lỗi khi xem chi tiết đơn hàng: ', error)
        }
    }

    const applyCoupon = async (coupon, totalCost) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `api/Discount/GetDiscountByCode/${coupon}/${totalCost}`
            });
    
            if (response.status === 200) {
                toast.success("Áp mã thành công");
                return response;
            }
            toast.error('Mã giảm đã hết hạn hoặc bạn đã dùng rồi')
        } catch (error) {
            console.log('Lỗi khi dùng mã giảm: ', error);
            return null; // Trả về null khi có lỗi
        }
    };


    const getInforCoupon = async(discountId) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `/api/Discount/${discountId}`
            })
            return response;
        } catch (error) {
            console.log('Lỗi khi tìm mã giảm: ', error);
            return null;
        }
    }

    const processBankingPay = async()=> {
        
        try {
            const resonse = apiRequest({
                method: 'get',
                url: '/api/Payment/IpnAction'
            })
            return resonse;
        } catch (error) {
            console.log('Lỗi khi thanh toán: ', error);
        }
    }

    const createURLPayment = async (amount, description, discountId) => {
        try {
            const url = discountId 
                ? `/api/Payment/CreatePaymentUrl?moneyToPay=${amount}&description=${description}&discountId=${discountId}`
                : `/api/Payment/CreatePaymentUrl?moneyToPay=${amount}&description=${description}`;
    
            const response = await apiRequest({
                method: 'get',
                url: url
            });
            return response;
        } catch (error) {
            console.log('Lỗi khi tạo URL thanh toán:', error);
        }
    };
    
    const processPaymentCOD = async(discountId) => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: '/api/Payment/PaymentCOD',
                data: discountId
            })
            return response;
        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán COD: ',error);
        }
    } 

    const getAllVoucher = async(page, itemsPerPage, sortBy, desc) => {
        try {
            const response = apiRequest({
                method: 'get',
                url: `/api/Discount/GetAll?page=${page}&itemsInPage=${itemsPerPage}&sortBy=${sortBy}&isDESC=${desc}`
            })
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách voucher:', error);
        }
    }

    const cancelOrder = async(orderId) => {
        try {
            const response = await apiRequest({
                method: 'put',
                url: `/api/Order/CancelOrder/${orderId}`
            });
            return response;
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng: ', error); 
        }
    }

    const postReview = async (productId, review, rating) => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: `/api/ProductReview`,
                data: {
                    productID: productId,
                    rating: rating,
                    comment: review
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    };
    
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };    

    const getRecomendedProduct = async (productID, pageIndex, pageSize) => {
        try {
            const response = await axios.get(`/api/Product/${productID}/recommend?pageIndex=${pageIndex}&pageSize=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm gợi ý:', error);
        }
    }

               
    const validateCart = async () => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: '/api/InventoryReservation/validate-cart'
            });
            return response.data; 
        } catch (error) {
            console.error("Error validating cart:", error);
            toast.error("Không thể kiểm tra tồn kho. Vui lòng thử lại.");
            return null; 
        }
    };

    const reserveInventory = async () => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: 'api/InventoryReservation/ReserveInventory'
            })
            console.log("Inventory reserved successfully:", response);
            return response;

        } catch (error) {
            console.error("Error reserving inventory:", error);
            toast.error("Không thể đặt hàng. Vui lòng thử lại.");
            return null;
        }
    } 

    const releaseReservation = async () => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: 'api/InventoryReservation/ReleaseReservation'
            })
            console.log("Inventory reservation released successfully:", response);
            return response;

        } catch (error) {
            console.error("Error releasing inventory reservation:", error);
            toast.error("Không thể hủy đặt hàng. Vui lòng thử lại.");
            return null;
        }
    }

    const getInvoiceLink = async (orderId) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `/api/Order/${orderId}/html`
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy liên kết hóa đơn:', error);
            return null;
        }
    }

    return (
        <ProductContext.Provider value={{
            handleAddProduct,
            handleAddProductColor,
            getAllColor,
            addRangeColors,
            uploadImages,
            getAllProduct,
            listProduct,
            formatCurrency,
            getDetailProduct,
            editProduct,
            deleteColor,
            deleteSize,
            getAllProductAdmin,
            changeStatusProduct,
            setListProduct,
            deleteImage,
            getListOrder,
            getOrderDetail,
            applyCoupon,
            processBankingPay,
            createURLPayment,
            getInforCoupon,
            processPaymentCOD,
            getAllVoucher,
            formatDateTime,
            pauseSaleProduct,
            deleteProduct,
            cancelOrder,
            postReview,
            getRecomendedProduct,
            validateCart,
            reserveInventory,
            releaseReservation,
            getInvoiceLink
        }}>
            {children}
        </ProductContext.Provider>
  )
}




export const useProduct = () => {
    return useContext(ProductContext);
}
