"use client"

import apiClient from "@/lib/api-client";
import { loginAPI, logoutAPI, registerAPI, registerVendorAPI } from "@/lib/auth-service";
import { getToken, removeToken, setToken } from "@/lib/auth-storage";
import { RefreshToken, UserContextType, UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Initializing token and user from local storage
    useEffect(() => {
        async function loadUser() {
            try {
                const token = getToken();
                const userData = localStorage.getItem("user");
                if (token && userData) {
                    setToken(token);
                    if (userData) {
                        const parsedUser = JSON.parse(userData);
                        setUser(parsedUser as UserProfile);
                    }
                }
            } catch (error) {
                console.error("Error loading user:", error);
                logoutAPI(); // Clear token if there's an error
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const registerVendor = async (
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string,
        name: string,
        description: string,
        category: string
    ) => {
        await registerVendorAPI(
            firstName,
            lastName,
            username,
            email,
            password,
            name,
            description,
            category
        )
            .then((res) => {
                if (res) {
                    setToken(res?.data.token);
                    const userObj = {
                        firstName: res?.data.firstName,
                        lastName: res?.data.lastName,
                        userName: res?.data.userName,
                        email: res?.data.email,
                    };
                    localStorage.setItem("user", JSON.stringify(userObj));
                    if (res.data.token !== null) {
                        setToken(res.data.token);
                    }
                    setUser(userObj!);
                    toast.success("Login Success!");
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch((e) => toast.warning("Server error occured"));
    }

    const registerUser = async (
        email: string,
        username: string,
        password: string
    ) => {
        await registerAPI(email, username, password)
            .then((res) => {
                if (res) {
                    setToken(res?.data.token);
                    const userObj = {
                        firstName: res?.data.firstName,
                        lastName: res?.data.lastName,
                        userName: res?.data.userName,
                        email: res?.data.email,
                    };
                    localStorage.setItem("user", JSON.stringify(userObj));
                    if (res.data.token !== null) {
                        setToken(res.data.token);
                    }
                    setUser(userObj!);
                    toast.success("Login Success!");
                    router.push("/dashboard");
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch((e) => toast.warning("Server error occured"));
    };

    const loginUser = async (username: string, password: string) => {
        await loginAPI(username, password)
            .then((res) => {
                if (res) {
                    const userObj = {
                        firstName: res?.firstName,
                        lastName: res?.lastName,
                        userName: res?.userName,
                        email: res?.email,
                        roles: res?.roles,
                    };
                    localStorage.setItem("user", JSON.stringify(userObj));
                    if (res.token !== null) {
                        setToken(res.token);
                    }
                    setUser(userObj!);
                    toast.success("Login Success!");
                    router.push("/dashboard");
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch((e) => toast.warning("Server error occured"));
    };

    const isLoggedIn = () => {
        return !!user;
    };

    const logoutUser = async () => {
        try {
            await logoutAPI(); // Call the logout API
            clearAuthData(); // Clear local storage and reset state
            console.log("Logged out successfully");
            toast.success("Logged out successfully!");
            router.push("/login"); // Redirect to the login page

        } catch (error) {
            console.log("Logout failed:", error);
            toast.error("Failed to log out. Please try again.");
        }
    };

    const refreshToken = async (): Promise<string | null> => {
        try {
            const refreshToken = getToken();
            if (!refreshToken) {
                logoutUser();
                return null;
            }

            const { data } = await apiClient.post<RefreshToken>('/api/account/refresh-token', { refreshToken });

            setToken(data.token); // Update the token in local storage

            return getToken(); // Return the new token
        } catch (error) {
            console.error('Token refresh error:', error);
            logoutUser();
            return null;
        }
    };

    // Helper function to clear authentication data
    const clearAuthData = () => {
        removeToken(); // Clear the token from storage
        setUser(null); // Reset user state
    };

    return (
        <UserContext.Provider
            value={{
                loginUser,
                user,
                loading,
                logoutUser,
                isLoggedIn,
                registerUser,
                registerVendor,
                refreshToken
            }}
        >
            {!loading && children}
        </UserContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useAuth must be used within a UserProvider");
    }
    return context;
}
