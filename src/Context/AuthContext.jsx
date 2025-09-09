import { toast } from 'react-toastify';
import axios from '../api/axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

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
    const LOCAL_CART_KEY = 'unauth_cart';       

     useEffect(() => {
        checkAuthStatus();
    }, []);


const ClaimTypes = {
  email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  nameidentifier: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
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

        // Kiểm tra hạn token
        if (decodedToken.exp * 1000 > Date.now()) {
            // console.log('[AuthContext] checkAuthStatus: Token is valid and not expired.');
            setToken(storedToken);

            const userRoles = decodedToken[ClaimTypes.role];
            const rolesArray = Array.isArray(userRoles) ? userRoles : (userRoles ? [userRoles] : []);

            
            const userId = decodedToken[ClaimTypes.nameidentifier] || decodedToken.sub || decodedToken.userId;
            const userEmail = decodedToken[ClaimTypes.email] || decodedToken.email;
            
            // console.log('[AuthContext] Extracted user info:', {
            //     userId,
            //     userEmail,
            //     roles: rolesArray
            // });

            const userInfo = {
                id: userId, 
                email: userEmail,
                userName: userEmail, 
                roles: rolesArray,
                isAdmin: rolesArray.includes('Admin') || rolesArray.includes('SuperAdmin')
            };

            // console.log('[AuthContext] Setting user:', userInfo);
            setUser(userInfo);
            setIsAuthenticated(true);
            setLoggedIn(true); 
        } else {
            // console.log('[AuthContext] checkAuthStatus: Token is expired.');
            logout();
        }
        } else {
        // console.log('[AuthContext] checkAuthStatus: No token found in localStorage.');
        }
    } catch (error) {
        console.error('[AuthContext] checkAuthStatus: Error during token processing:', error);
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
                
                checkAuthStatus();
                
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

    const addToCart = async (product, quantity, selectedSize, images, selectedColor) => {
        if (loggedIn) {
            // Đã đăng nhập - gọi API
            try {
            const response = await apiRequest({
                method: 'post',
                url: '/api/CartItem/AddToCart',
                data: { 
                productID: product.productID, 
                quantity, 
                productSizeID: selectedSize.productSizeID 
                }
            });
            toast.success('🛒 Sản phẩm đã được thêm vào giỏ hàng!');
            await getCart();
            } catch(error) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            console.error('Lỗi khi thêm vào giỏ: ', error);
            }
        } else {
            // Chưa đăng nhập - lưu vào localStorage
            const localCart = getLocalCart();
            
            // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
            const existingItemIndex = localCart.findIndex(
            item => item.productID === product.productID && 
                    item.productSizeID === selectedSize.productSizeID
            );

            if (existingItemIndex !== -1) {
            // Cập nhật số lượng nếu đã tồn tại
            localCart[existingItemIndex].quantity += quantity;
        } else {
            // Thêm mới vào giỏ
            // Tìm ảnh chính (isPrimary) hoặc lấy ảnh đầu tiên
            const primaryImage = images.find(img => img.isPrimary) || images[0];
            const imageURL = primaryImage ? primaryImage.imageURL : '';
            
            localCart.push({
                productID: product.productID,
                productName: product.productName,
                price: product.price,   
                quantity,
                imageURL: imageURL, // Sử dụng URL ảnh đúng cách
                productSizeID: selectedSize.productSizeID,
                size: selectedSize.size,
                colorName: selectedColor.colorName,
                colorHex: selectedColor.colorHex
            });
        }

        saveLocalCart(localCart);
        
        // Cập nhật state để hiển thị
        setCart(localCart);
        setItemInCart(localCart.reduce((total, item) => total + item.quantity, 0));
        
        toast.success('🛒 Sản phẩm đã được thêm vào giỏ hàng!');
        }
    };


    const getCart = async() => {
        if (loggedIn) {
            // Lấy giỏ hàng từ API khi đã đăng nhập
            try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/CartItem/GetAll'
            });

            if (!Array.isArray(response.data)) {
                setCart([]);
                setItemInCart(0);
            } else {
                setCart(response.data);
                const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0);
                setItemInCart(totalItems);
            }
            } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng: ', error);
            setCart([]);
            setItemInCart(0);
            }
        } else {
            // Lấy giỏ hàng từ localStorage khi chưa đăng nhập
            const localCart = getLocalCart();
            setCart(localCart);
            setItemInCart(localCart.reduce((total, item) => total + item.quantity, 0));
        }
    }
    

    const updateItemCart = async (cartItemID, productID, quantity, productSizeID) => {
        if (loggedIn) {
            // Gọi API khi đã đăng nhập
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
        } else {
            // Cập nhật localStorage khi chưa đăng nhập
            updateLocalCart(productID, productSizeID, quantity);
        }
    };


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
                
                // FIX: Đảm bảo roles là array
                const rolesArray = Array.isArray(roles) ? roles : (roles ? [roles] : []);

                if (rolesArray.includes("Admin") || rolesArray.includes("SuperAdmin")) {
                    const userId = decodeToken[ClaimTypes.nameidentifier] || decodeToken.sub || decodeToken.userId;
                    const userEmail = decodeToken[ClaimTypes.email] || decodeToken.email;
                    
                    setToken(token);
                    const userInfo = {
                        id: userId,
                        email: userEmail,
                        userName: userEmail,
                        roles: rolesArray,
                        isAdmin: true
                    };
                    
                    // console.log('[AuthContext] handleLogin - Setting user:', userInfo);
                    setUser(userInfo);
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    setLoggedIn(true);

                    return true;
                  } else {
                    return false;
                  }
            }
        } catch (error) {
            console.log('Lỗi khi đăng nhập: ',error);
        }
    }

    const handleLoginGG = async(token, refreshToken) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        const decodeToken = jwtDecode(token);
        const roles = decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const rolesArray = Array.isArray(roles) ? roles : (roles ? [roles] : []);

        if (rolesArray.includes("Admin") || rolesArray.includes("SuperAdmin")) {
            const userId = decodeToken[ClaimTypes.nameidentifier] || decodeToken.sub || decodeToken.userId;
            const userEmail = decodeToken[ClaimTypes.email] || decodeToken.email;
            
            setToken(token);
            const userInfo = {
                id: userId,
                email: userEmail,
                userName: userEmail,
                roles: rolesArray,
                isAdmin: true
            };
            
            // console.log('[AuthContext] handleLoginGG - Setting user:', userInfo);
            setUser(userInfo);
            setIsAuthenticated(true);
            setIsLoading(false);
            setLoggedIn(true);

            return true;
        } else {
            return false;
        }
    }

    const login = (token, refreshToken) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setLoggedIn(true);

        try {
            const decodedToken = jwtDecode(token);
            // console.log('[AuthContext] login - Decoded token:', decodedToken);
            
            const userId = decodedToken[ClaimTypes.nameidentifier] || decodedToken.sub || decodedToken.userId;
            const userEmail = decodedToken[ClaimTypes.email] || decodedToken.email;
            const userRoles = decodedToken[ClaimTypes.role] || decodedToken.roles || decodedToken.role || [];
            const rolesArray = Array.isArray(userRoles) ? userRoles : (userRoles ? [userRoles] : []);
            
            setToken(token);
            const userInfo = {
                id: userId, 
                email: userEmail,
                userName: userEmail,
                roles: rolesArray,
                isAdmin: rolesArray.includes('Admin') || rolesArray.includes('SuperAdmin')
            };
            
            // console.log('[AuthContext] login - Setting user:', userInfo);
            setUser(userInfo);
            setIsAuthenticated(true);
            setIsLoading(false);
            
            const localCart = getLocalCart();
            if (localCart.length > 0) {
                mergeCarts(localCart).then(() => {
                getCart(); // Lấy lại giỏ hàng từ server sau khi merge
            });
            } else {
                getCart();
            }

        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            throw new Error('Invalid token');
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setLoggedIn(false);
        
        setCart([]);
        setItemInCart(0);

        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    }

    const isAdminLogin = () => {
        const token = localStorage.getItem('token');
    
        if (!token) return false;
    
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
    
        setCart(prevCart => prevCart.map(item =>
            item.cartItemID === cartItemID
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const handleRemoveItem = (cartItemID, productID, productSizeID) => {
        updateItemCart(cartItemID, productID, 0, productSizeID); 

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
        if (isAuthenticated) {
            getInforUser();
        }
    }, [isAuthenticated]) 

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
            if(querySearch == null) {
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


    const getLocalCart = () => {
        const cartStr = localStorage.getItem(LOCAL_CART_KEY);
        return cartStr ? JSON.parse(cartStr) : [];
    };

    const saveLocalCart = (cartItems) => {
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
    };

    let isMerging = false; 

    const mergeCarts = async (localCart) => {
        if (isMerging) {
            return;
        }

        isMerging = true;

        try {
            console.log('Local cart to merge:', localCart);
            
            const mergeData = {
                items: localCart.map(item => ({
                    productID: item.productID,
                    quantity: item.quantity,
                    productSizeID: item.productSizeID
                }))
            };
            
            await apiRequest({
                method: 'post',
                url: '/api/CartItem/MergeCart',
                data: mergeData
            });
            
            localStorage.removeItem(LOCAL_CART_KEY);
            
            await getCart();
            
        } catch (error) {
            console.error('Merge error:', error);
            toast.error('Có lỗi xảy ra khi đồng bộ giỏ hàng');
        } finally {
            isMerging = false;
        }
    };

    const updateLocalCart = (productID, productSizeID, newQuantity) => {
        const localCart = getLocalCart();
        const itemIndex = localCart.findIndex(
            item => item.productID === productID && item.productSizeID === productSizeID
        );

        if (itemIndex !== -1) {
            if (newQuantity <= 0) {
            localCart.splice(itemIndex, 1);
            } else {
            localCart[itemIndex].quantity = newQuantity;
            }
            
            saveLocalCart(localCart);
            setCart(localCart);
            setItemInCart(localCart.reduce((total, item) => total + item.quantity, 0));
        }
    };
    
    const removeFromLocalCart = (productID, productSizeID) => {
        updateLocalCart(productID, productSizeID, 0);
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
            handleLoginGG,
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