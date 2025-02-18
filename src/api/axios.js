import axios from "axios";
const BASE_URL = 'https://localhost:7295';

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})


export const ghnApi = axios.create({
    baseURL: 'https://online-gateway.ghn.vn/shiip/public-api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const ghnApiDev = axios.create({
    baseURL: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});