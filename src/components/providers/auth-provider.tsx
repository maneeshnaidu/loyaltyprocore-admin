"use client"

import apiClient from "@/lib/api-client";
import { loginAPI, logoutAPI, registerAPI, registerVendorAPI } from "@/lib/auth-service";
import { UserContextType, UserProfile } from "@/types";
import { redirect, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";


type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
            apiClient.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
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
                    localStorage.setItem("token", res?.data.token);
                    const userObj = {
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
                    localStorage.setItem("token", res?.data.token);
                    const userObj = {
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
                    console.log(res);
                    localStorage.setItem("token", res?.data.token);
                    const userObj = {
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

    const isLoggedIn = () => {
        return !!user;
    };

    const logoutUser = async () => {
        try {
            await logoutAPI(); // Call the logout API
            clearAuthData(); // Clear local storage and reset state
            toast.success("Logged out successfully!");
            redirect("/login"); // Redirect to the login page

        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to log out. Please try again.");
        }
    };

    // Helper function to clear authentication data
    const clearAuthData = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    return (
        <UserContext.Provider
            value={{ loginUser, user, token, logoutUser, isLoggedIn, registerUser, registerVendor }}
        >
            {isReady ? children : null}
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
