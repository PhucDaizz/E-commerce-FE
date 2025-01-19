import { toast } from 'react-toastify';
import axios from '../api/axios';
import React, { createContext, useContext, useState } from 'react'
import { isAxiosError } from 'axios';

const AuthContext =  createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    const [cart, setCart] = useState([]);
    

    const header = (token) => {
        return  {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        };
    };

    const refreshToken = async () => {
        const oldToken = localStorage.getItem('token');
        const oldRefreshToken = localStorage.getItem('refreshToken');

        if(!oldToken || !oldRefreshToken) {
            console.error("Please login again!");
            logout();
            return null;
        }

        try {
            const response = await axios.post('/api/Auth/Refreshtoken', {
                token: oldToken,
                refreshToken: oldRefreshToken
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                return response.data.token;
            }
            return null;

        } catch (error) {
            console.error("Lỗi refreshToken: ", error);
            logout();
            return null;
        } 
    }

    // Auto refresh
    const apiRequest = async (config) => {
        try {
            let token = localStorage.getItem('token');
            if(!token) {
                throw new Error('No token found');
            }
            
            config.headers = header(token); 
            config.timeout = 10000;

            try {
                return await axios(config);
            } catch (error) {
                if (isAxiosError(error)) {
                    if (!error.response) {
                        console.error('Network Error');
                        throw new Error('Network Error');
                    }
                    if (error.response.status === 401) {
                        console.log('Token hết hạn, đang làm mới token...')
                        token = await refreshToken();
                        if (token) {
                            config.headers = header(token);
                            return await axios(config);
                        }
                        throw new Error('Failed to refresh token');
                    }
                }
                throw error;
            }
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }


    const addToCart = async (productID, quantity, productSizeID) => { 

        try {
            const response = await apiRequest({
                method: 'post',
                url: '/api/CartItem/AddToCart',
                data: { productID, quantity, productSizeID }
            });
            toast.success('🛒 Sản phẩm đã được thêm vào giỏ hàng!', { 
                position: "top-right", 
                autoClose: 5000, 
                hideProgressBar: false, 
                closeOnClick: true, 
                pauseOnHover: true, 
                draggable: true, 
                progress: undefined, 
                theme: "light" 
            });

            console.log(cart);
        } catch(error) {
            console.error('Lỗi khi thêm vào giỏ: ', error)
        }
    };


    const getCart = async() => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/CartItem/GetAll'
            });

            if (!Array.isArray(response.data)) {
                setCart([])
            }
            else{
                setCart(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng: ',error);
            setCart([]);
        }
    }
    

    const updateItemCart = async (cartItemID, productID, quantity, productSizeID ) => {
        try {
            const response = await apiRequest({
                method: 'put',
                url: '/api/CartItem/UpdateCartItem',
                data: {cartItemID, productID, quantity, productSizeID}
            });

            await getCart();
        } catch(error) {
            console.error("Lỗi khi sửa giỏ hàng:", error);
        }
    }


    const login = (token, refreshToken) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setLoggedIn(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setLoggedIn(false);
    }



    return (
        <AuthContext.Provider value={{loggedIn, login, logout, addToCart, getCart, cart, updateItemCart}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}