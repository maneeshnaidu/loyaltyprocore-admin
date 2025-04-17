"use server"

import apiClient from "@/lib/api-client";
import { setToken } from "@/lib/auth-storage";
import { LoginFormSchema } from "@/lib/types"

export const handleLogin = async (formData: FormData) => {
    const validateFields = LoginFormSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!validateFields.success) {
        return {
            error: validateFields.error.format(),
        };
    }

    const username = formData.get("username");
    const password = formData.get("password");

    try {
        const res = await apiClient.post("/account/login", {
            username,
            password,
        });
        const { token } = res.data;  // Assuming the token is in res.data.token
        console.log("Login response: ", res.data);  // Log the response data
        // Save the token to localStorage
        setToken(token);
        // Set the token in axios headers for future requests
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`; // Assuming the token is in res.data.token 
        // Redirect to the dashboard or home page
        // window.location.href = "/dashboard"; // Uncomment this line to redirect after login  
        // Or use a router to navigate to the dashboard
        // router.push("/dashboard"); 
    } catch (error) {
        console.error("Login error: ", error);  // Log the error
        throw error;  // Rethrow the error to be handled by the caller
    }

}