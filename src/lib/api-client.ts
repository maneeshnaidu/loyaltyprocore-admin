import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getToken } from './auth-storage';
import { useAuth } from '@/components/providers/auth-provider';

const isClient = typeof window !== 'undefined';

const apiClient: AxiosInstance = axios.create({
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
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const { refreshToken } = useAuth();
                    const newToken = await refreshToken();

                    if (newToken && originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return apiClient(originalRequest);
                    }
                } catch (err) {
                    console.error('Refresh token failed:', err);
                    const { logoutUser } = useAuth();
                    logoutUser();
                }
            }

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