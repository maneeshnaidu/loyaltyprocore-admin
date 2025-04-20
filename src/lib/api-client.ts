import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getToken, setToken, removeToken } from './auth-storage';

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
    apiClient.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            // Log the error details for debugging
            console.error('API Error:', {
                status: error.response?.status,
                url: originalRequest.url,
                method: originalRequest.method,
                headers: originalRequest.headers,
                data: error.response?.data
            });

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = getToken();
                    console.log('Attempting to refresh token:', refreshToken ? 'Token exists' : 'No token');
                    
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    // Log the refresh token request
                    console.log('Sending refresh token request to:', '/api/account/refresh-token');
                    
                    const { data } = await apiClient.post('/api/account/refresh-token', { refreshToken });
                    console.log('Refresh token response:', data);
                    
                    const newToken = data.token;
                    
                    if (newToken) {
                        console.log('New token received, updating...');
                        setToken(newToken);
                        
                        // Update the default headers for all future requests
                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        
                        if (originalRequest.headers) {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            console.log('Retrying original request with new token');
                            return apiClient(originalRequest);
                        }
                    } else {
                        console.error('No token in refresh response');
                    }
                } catch (err) {
                    console.error('Refresh token failed:', err);
                    removeToken();
                    // Redirect to login page
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
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
            console.log('Adding Authorization header with token');
        } else {
            console.warn('No token available for request');
        }
        
        // Log request details for debugging
        console.log(
            "Sending request to backend: ",
            config.baseURL! + config.url,
            "Headers: ",
            JSON.stringify(config.headers),
            "RequestData: ",
            JSON.stringify(config.data),
        );
    }
    return config;
});

export default apiClient;