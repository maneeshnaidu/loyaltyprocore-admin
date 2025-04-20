export interface Vendor {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    name: string,
    description?: string,
    category: string,
    coverImage?: File | null,
    logoImage?: File | null,
    coverImageUrl?: string,
    logoImageUrl?: string,
    isActive?: boolean,
    createdOn?: Date,
    outlets?: Outlet[]
}

export interface UpdateVendorRequestDto {
    name: string;
    description?: string;
    category: string;
    // Add other fields your backend expects
}

export interface UpdateVendorResponse {
    id: number;
    name: string;
    // Include other fields returned by your API
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

export type Point = {
    id: number;
    customerId: string;
    rewardId: number;
    vendorId: number;
    outletId?: number;
    points: number;
    level: number;
    lastUpdatedOn: Date;
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

export type UserModel = {
    id: string,
    userCode: number,
    firstName: string,
    lastName?: string,
    userName: string,
    password: string,
    email: string,
    vendorId?: number,
    outletId?: number,
    roles?: string[],
    favoriteVendors?: Vendor[],
    stamps?: Point[],
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
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        password: string,
        admin: string
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