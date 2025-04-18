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
    email: string,
    username: string,
    password: string
) => {
    try {
        const response = await apiClient.post<UserProfileToken>("/account/register", {
            email,
            username,
            password,
        });
        return response;
    } catch (error) {
        handleError(error);
    }
};

export const loginAPI = async (
    username: string,
    password: string
) => {
    try {
        const response = await apiClient.post<UserProfileToken>("/account/login", {
            username,
            password,
        });

        // Log the entire response to see its structure
        console.log('Login response:', response);

        // Check if the token exists in the response
        const token = response.data.token;

        if (!token) {
            throw new Error('No token received from the server');
        }

        // Save the token
        setToken(token);

        // Set the default authorization header
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutAPI = async () => {
    try {
        // Call logout endpoint if your API has one
        const response = await apiClient.post("/account/logout");
        console.log('Logout response:', response);
        // Handle the response
        if (response.status === 204 || response.status === 200) {
            return true; // Logout successful
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear the Authorization header
        delete apiClient.defaults.headers.common["Authorization"];
    }
};

