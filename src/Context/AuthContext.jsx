import { toast } from 'react-toastify';
import axios from '../api/axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { data, useNavigate } from 'react-router-dom';

const AuthContext =  createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    const [cart, setCart] = useState([]);
    const [itemInCart, setItemInCart] = useState(0);
    const [inforUser, setInforUser] = useState({});

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
        checkAuthStatus();
    }, []);


const ClaimTypes = {
  email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  nameidentifier: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  // userName: "username" 
};

const checkAuthStatus = () => {
//   console.log('[AuthContext] checkAuthStatus: Starting...');
  try {
    const storedToken = localStorage.getItem('token');
    // console.log('[AuthContext] checkAuthStatus: storedToken from localStorage:', storedToken);

    if (storedToken) {
        // console.log('[AuthContext] checkAuthStatus: Token found. Attempting to decode...');
        const decodedToken = jwtDecode(storedToken);
        // console.log('[AuthContext] checkAuthStatus: Token decoded:', decodedToken);

        // Kiểm tra hạn token: decodedToken.exp đã là Unix timestamp (giây)
        // Date.now() là milliseconds, nên cần nhân decodedToken.exp với 1000
        if (decodedToken.exp * 1000 > Date.now()) {
            // console.log('[AuthContext] checkAuthStatus: Token is valid and not expired.');
            setToken(storedToken);

            const userRoles = decodedToken[ClaimTypes.role];
            // Đảm bảo roles luôn là một mảng
            const rolesArray = Array.isArray(userRoles) ? userRoles : (userRoles ? [userRoles] : []);

            setUser({
                id: decodedToken[ClaimTypes.nameidentifier],
                email: decodedToken[ClaimTypes.email],
                userName: decodedToken[ClaimTypes.email], 
                roles: rolesArray,
                isAdmin: rolesArray.includes('Admin') 
            });
            setIsAuthenticated(true);
        } else {
            // console.log('[AuthContext] checkAuthStatus: Token is expired.');
            // logout();
        }
        } else {
        // console.log('[AuthContext] checkAuthStatus: No token found in localStorage.');
        }
    } catch (error) {
        // console.error('[AuthContext] checkAuthStatus: Error during token processing:', error);
        logout();
    } finally {
        // console.log('[AuthContext] checkAuthStatus: Setting isLoading to false.');
        setIsLoading(false);
    }
    };


    useEffect(() => {
        if (loggedIn) {
            getCart();
        } else {
            setCart([]);
            setItemInCart(0);
        }
    }, [loggedIn]);

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

            await getCart();            
            // Cập nhật giỏ hàng ngay lập tức trong state
            setCart(prevCart => {
                const existingItem = prevCart.find(item => item.productID === productID && item.productSizeID === productSizeID);
                if (existingItem) {
                    return prevCart.map(item =>
                        item.productID === productID && item.productSizeID === productSizeID
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    return [...prevCart, { productID, productSizeID, quantity, cartItemID: response.data.cartItemID }];
                }
            });
            setItemInCart(prev => prev + quantity);
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
                setCart([]);
                setItemInCart(0);
            }
            else{
                setCart(response.data);
                const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0);
                setItemInCart(totalItems);
            }

        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng: ',error);
            setCart([]);
            setItemInCart(0);
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


    const handleLogin = async(email, password) => {
        try {
            const response = await axios.post('/api/Auth/Login', {email,password})
            if(response.status === 200) {
                const token = response.data.token;
                const refreshToken = response.data.refreshToken;
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                const decodeToken = jwtDecode(token);
                const roles = decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                if (roles.includes("Admin") || roles.includes("SuperAdmin")) {
                    localStorage.setItem('token', token);
                    setToken(token);
                    setUser({
                        id: decodeToken.sub || decodeToken.userId,
                        email: decodeToken.email,
                        userName: decodeToken.userName || decodeToken.name,
                        roles: decodeToken.roles || decodeToken.role || [],
                        isAdmin: true
                    });
                    setIsAuthenticated(true);
                    setIsLoading(false);


                    return true;
                  } else {
                    return false;
                  }
            }
        } catch (error) {
            console.log('Lỗi khi đăng nhập: ',error);
        }
    }

    const login = (token, refreshToken) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setLoggedIn(true);
        getCart();

        try {
        const decodedToken = jwtDecode(token);
        localStorage.setItem('token', token);
        setToken(token);
        setUser({
            id: decodedToken.sub || decodedToken.userId,
            email: decodedToken.email,
            userName: decodedToken.userName || decodedToken.name,
            roles: decodedToken.roles || decodedToken.role || [],
            isAdmin: decodedToken.roles?.includes('Admin') || decodedToken.role?.includes('Admin') || false
        });
        setIsAuthenticated(true);
        setIsLoading(false);
        } catch (error) {
        console.error('Error decoding token:', error);
        throw new Error('Invalid token');
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setLoggedIn(false);
        
        setCart([]);
        setItemInCart(0);


        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    }

    const isAdminLogin = () => {
        const token = localStorage.getItem('token');
    
        if (!token) return false; // Không logout ngay, chỉ trả về false
    
        try {
            const decodeToken = jwtDecode(token);
            let roles = decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
            roles = Array.isArray(roles) ? roles : [roles];
            
            return roles.includes("Admin") || roles.includes("SuperAdmin");
        } catch (error) {
            console.error("Invalid token:", error);
            return false;
        }
    };

    const handleUpdateItemCart = (cartItemID, productID, newQuantity, productSizeID) => {
        updateItemCart(cartItemID, productID, newQuantity, productSizeID);
    
        // Cập nhật cart ngay lập tức để hiển thị thay đổi ngay
        setCart(prevCart => prevCart.map(item =>
            item.cartItemID === cartItemID
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const handleRemoveItem = (cartItemID, productID, productSizeID) => {
        updateItemCart(cartItemID, productID, 0, productSizeID); // Gửi API để xóa

        // Cập nhật cart ngay lập tức
        setCart(prevCart => prevCart.filter(item => item.cartItemID !== cartItemID));
    };


    const getInforUser = async() => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/Auth/GetnInfo'
            });
            if(response.status === 200){
                setInforUser(response.data);
                return response.data;
            }
        } catch(error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
    }

    useEffect(() => {
        getInforUser();
    }, [])

    const getInforById = async(userId) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `/api/Auth/GetInforById?id=${userId}`
            })
            return response;
        } catch (error) {
            console.log("Lỗi khi lấy thông tin khách hàng: ",error)
        }
    }

    const register = async(data) => {
        try {
            const response = await axios.post('/api/Auth/RegisterUser', data);
            if (response.status === 200) {
                toast.success('Đăng ký thành công');
                return response;
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký: ", error);
        }
    }

    const registerAdmin = async(dataSend) => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: '/api/Auth/RegisterAdmin',
                data:  dataSend
            })

            // const response = await axios.post('/api/Auth/RegisterAdmin', dataSend);
            if (response.status === 200) {
                toast.success('Đăng ký thành công');
                return response;
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký admin: ", error);
        }
    }

    const verifyEmail = async(userId, token) => {
        try {
            const response = await axios.get(`/api/Auth/email-confirmation?userId=${userId}&token=${token}`)
            if(response.status === 200) {
                return "success"
            }
            return 'error'
        } catch (error) {
            console.error("Lỗi xác nhận email: ", error);
            return 'error'
        }
    }

    const forgotPassword = (email) => {
        try {
            const data = {
                email: email,
                clientUrl: 'http://localhost:5173/resetpassword'
            }
            const response = axios.post('/api/Auth/forgotpassword', data)
            if(response.status === 200) {
                return toast.success('Vui lòng check mail của bạn thể thay đổi mật mã')
            }
            return response;
        } catch (error) {
            console.error("Lỗi khi đặt lại mật mã:" , error)
        }
    }

    const resetPassword = async(data) => {
        try {
            const response = await axios.post('/api/Auth/resetpassword', data);
            if (response.status === 200) {
                return toast.success('Đặt lại mât khẩu thành công')
            }
            return response;
        } catch (error) {
            console.error('Lỗi khi resetPassword:' , error);
        }
    }

    const confirmEmail = async() => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: '/api/Auth/confirmemail' 
            })
            return response;
        } catch (error) {
            console.error('Lỗi khi xác nhận email:' , error);
        }
    }

    const updateUserInfor = async(data) => {
        try {
            const dataSend = {
                "phoneNumber": data.phoneNumber,
                "address": data.address,
                "gender": data.gender === '' ? null : data.gender
            }
            const response = await apiRequest({
                method: 'post',
                url: '/api/Auth/updateinfor',
                data: dataSend
            });
            return response;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin cá nhân: ",error);
        }
    }

    const getAllUser = async(querySearch, searchField, page, itemInPage) => {
        try {
            let url;
            if(querySearch == null) { // Kiểm tra cả null và undefined
                url = `/api/Auth/GetAllUser?searchField=${searchField}&page=${page}&itemInPage=${itemInPage}`;
            } else {
                url = `/api/Auth/GetAllUser?querySearch=${querySearch}&searchField=${searchField}&page=${page}&itemInPage=${itemInPage}`;
            }
    
            const response = await apiRequest({
                method: 'get',
                url: url
            });
            
            return response;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng: ", error);
        }
    };
    
    

    return (
        <AuthContext.Provider value={{
            loggedIn, 
            login, 
            logout, 
            addToCart, 
            getCart, 
            cart, 
            updateItemCart, 
            handleUpdateItemCart, 
            handleRemoveItem, 
            itemInCart, 
            isAdminLogin,
            getInforUser,
            register,
            registerAdmin,
            handleLogin,
            verifyEmail,
            forgotPassword,
            resetPassword,
            confirmEmail,
            updateUserInfor,
            getInforById,
            getAllUser,
            inforUser,

            checkAuthStatus,
            user,
            token,
            isAuthenticated,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}