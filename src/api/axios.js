import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const BASE_URL = 'https://localhost:7295';

export default axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosPrivate = axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

export const axiosInstance = axios.create({
    baseURL: apiUrl
  // KHÔNG set Content-Type mặc định
});

export const ghnApi = axios.create({
    baseURL: 'https://dev-online-gateway.ghn.vn',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// export const ghnApiDev = axios.create({
//     baseURL: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });