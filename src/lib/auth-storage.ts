const TOKEN_KEY = "auth_token";

// Save the token to localStorage
export const setToken = (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
};

// Retrieve the token from localStorage
export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
};

// Remove the token from localStorage
export const removeToken = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
};