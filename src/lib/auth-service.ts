import { UserProfileToken } from "@/types";
import apiClient from "./api-client";
import { setToken } from "./auth-storage";
import { handleError } from "@/app/helpers/error-handler";

export const registerVendorAPI = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    name: string,
    description: string,
    category: string
) => {
    try {
        const response = await apiClient.post<UserProfileToken>("/account/register-vendor", {
            firstName,
            lastName,
            username,
            email,
            password,
            name,
            description,
            category,
        });
        return response;
    } catch (error) {
        handleError(error);
    }
};

export const registerAPI = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    admin: string
) => {
    if (admin == null || admin == "") {
        try {
            const response = await apiClient.post<UserProfileToken>("/account/register", {
                firstName,
                lastName,
                email,
                username,
                password,
                admin
            });
            return response;
        } catch (error) {
            handleError(error);
        }
    } else {
        try {
            const response = await apiClient.post<UserProfileToken>("/users/add-staff", {
                firstName,
                lastName,
                email,
                username,
                password,
                admin
            });
            return response;
        } catch (error) {
            handleError(error);
        }
    }
};

export const loginAPI = async (
    username: string,
    password: string
) => {
    try {
        console.log('Attempting login with username:', username);

        const response = await apiClient.post<UserProfileToken>("/account/login", {
            username,
            password,
        });

        // Log the entire response to see its structure
        console.log('Login response:', response);

        // Check if the token exists in the response
        const token = response.data.token;

        if (!token) {
            console.error('No token in login response:', response.data);
            throw new Error('No token received from the server');
        }

        console.log('Token received, saving to storage');

        // Save the token
        setToken(token);

        // Set the default authorization header for all future requests
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        console.log('Authorization header set for future requests');

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutAPI = async () => {
    try {
        console.log('Attempting to logout');

        // Call logout endpoint if your API has one
        const response = await apiClient.post("/account/logout");
        console.log('Logout response:', response);

        // Handle the response
        if (response.status === 204 || response.status === 200) {
            console.log('Logout successful');
            return true; // Logout successful
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear the Authorization header
        delete apiClient.defaults.headers.common["Authorization"];
        console.log('Authorization header cleared');
    }
};

