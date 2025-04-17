import axios from 'axios';
import { getToken } from './auth-storage';

const isClient = typeof window !== 'undefined';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5082/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Only enable withCredentials on the client side
if (isClient) {
    apiClient.defaults.withCredentials = true;
}

// Add response interceptor to handle errors globally
if (isClient) {
    axios.interceptors.response.use(
        function (response) {
            console.log(
                "Sending request to backend: ",
                response.config.baseURL + response.config.url!,
                "ResponseData: ",
                JSON.stringify(response.data),
            );
            return response;
        },
        function (error) {
            return Promise.reject(error);
        }
    );
}

// Add request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
    if (isClient) {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(
            "Sending request to backend: ",
            config.baseURL! + config.url,
            "RequestData: ",
            JSON.stringify(config.data),
        );
    }
    return config;
});

export default apiClient;