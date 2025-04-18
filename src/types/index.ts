export interface Vendor {
    id: string;
    name: string;
    description?: string;
    category: string;
    coverImageUrl?: string;
    logoImageUrl?: string;
    isActive?: boolean;
    createdOn?: Date;
    outlets?: Outlet[];
}

export interface Outlet {
    id: number;
    vendorId: number;
    address: string;
    isActive: boolean;
    createdOn: Date;
}

export interface Reward {
    id: number;
    vendorId: number;
    title: string;
    pointsRequired: number;
    description: string;
    isActive: boolean;
    createdOn: Date;
}

export interface Device {
    id: number;
    deviceId: string;
    deviceType: string;
    deviceToken: string;
    vendorId: number;
    isActive: boolean;
    createdOn: Date;
}

export interface UserProfileToken {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    token: string;
    roles?: string[];
}

export type UserProfile = {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    roles?: string[],
}

export type RefreshToken = {
    token: string;
    refreshToken: string;
    roles: [];
}

export interface UserContextType {
    user: UserProfile | null;
    // token: string | null;
    loading: boolean;
    registerVendor: (
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string,
        name: string,
        description: string,
        category: string
    ) => void;
    registerUser: (
        email: string,
        username: string,
        password: string
    ) => void;
    loginUser: (
        username: string,
        password: string
    ) => void;
    logoutUser: () => Promise<void>;
    isLoggedIn: () => boolean;
    refreshToken: () => Promise<string | null>;
};

// Add other types as needed