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
    name: string,
    description: string,
    category: string,
    address: string;
    phoneNumber: string,
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
}

export interface Transaction {
    id: number,
    customer: string,
    orderNumber: string,
    outletAddress: string,
    points: number,
    transactionType: string,
    createdOn: Date
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
export interface QueryObject {
    role?: string,
    userCode?: number,
    vendorId?: number,
    outletId?: number,
    category?: string,
    title?: string,
    address?: string,
    isLatest?: boolean,
    createdDate?: Date
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

export type RegisterUser = {
    firstName: string,
    lastName?: string,
    userName: string,
    email: string,
    password: string,
    vendorId: number,
    roles?: string,
}

export type UpdateUserRequestDto = {
    firstName: string,
    lastName?: string,
    userName: string,
    email: string,
    vendorId: number,
    roles?: string,
}

export type UpdatePointsDto = {
    customerCode: number,
    rewardId: number,
    vendorId: number,
    outletId: number,
    orderId: number,
    point: number,
}

export type RedeemRewardsDto = {
    customerCode: number,
    rewardId: number,
    outletId: number,
}

export type UpdateUserResponseDto = {
    id: string,
    firstName: string,
    lastName?: string,
    userName: string,
    email: string,
    vendorId: number,
    roles?: string,
}

export interface UserProfileToken {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    vendor: number;
    token: string;
    refreshToken: string;
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
    password?: string,
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

export type ChangePassword = {
    currentPassword: string;
    newPassword: string;
}

export interface UserContextType {
    user: UserProfileToken | null;
    // token: string | null;
    loading: boolean;
    // registerVendor: (
    //     firstName: string,
    //     lastName: string,
    //     username: string,
    //     email: string,
    //     password: string,
    //     name: string,
    //     description: string,
    //     category: string
    // ) => UserProfileToken;
    registerUser: (
        registerModel: RegisterUser
    ) => Promise<UserProfileToken>;
    loginUser: (
        username: string,
        password: string
    ) => void;
    logoutUser: () => Promise<void>;
    isLoggedIn: () => boolean;
    refreshToken: () => Promise<string | null>;
};

// Add other types as needed