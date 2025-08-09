import axios, { axiosInstance } from '../api/axios';
import { isAxiosError } from 'axios';

export const header = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});

export const headerIMG = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
});

export const refreshToken = async () => {
    const oldToken = localStorage.getItem('token');
    const oldRefreshToken = localStorage.getItem('refreshToken');

    if (!oldToken || !oldRefreshToken) {
        console.error("Please login again!");
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
        return null;
    }
};

export const apiRequest = async (config) => {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
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
                    console.log('Token hết hạn, đang làm mới token...');
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
};

export const apiMultipartRequest = async (config) => {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // CHỈ gắn Authorization header, KHÔNG gắn Content-Type
        config.headers = {
            'Authorization': `Bearer ${token}`,
            ...config.headers
        };

        // Đảm bảo xóa Content-Type nếu có (để axios tự động thêm với boundary)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            console.log('FormData detected, removed Content-Type header');
        }

        config.timeout = 30000; // Tăng timeout cho upload file

        console.log('Multipart request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            hasFormData: config.data instanceof FormData
        });

        try {
            return await axiosInstance(config);
        } catch (error) {
            if (isAxiosError(error)) {
                if (!error.response) {
                    console.error('Network Error');
                    throw new Error('Network Error');
                }

                // Token hết hạn
                if (error.response.status === 401) {
                    console.log('Token hết hạn, đang làm mới token...');
                    token = await refreshToken();
                    if (token) {
                        // Cập nhật lại header với token mới
                        config.headers = {
                            'Authorization': `Bearer ${token}`,
                            ...config.headers
                        };

                        // Xóa Content-Type cho FormData lần nữa
                        if (config.data instanceof FormData) {
                            delete config.headers['Content-Type'];
                        }

                        return await axiosInstance(config);
                    }
                    throw new Error('Failed to refresh token');
                }
            }
            throw error;
        }
    } catch (error) {
        console.error('API Multipart Request Error:', error);
        throw error;
    }
};


export const apiRequestIMG = async (config) => {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        config.headers = headerIMG(token);
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
                    console.log('Token hết hạn, đang làm mới token...');
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
};