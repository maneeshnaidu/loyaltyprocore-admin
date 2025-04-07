export interface Vendor {
    id: string;
    name: string;
    description?: string;
    category: string;
    isActive: boolean;
    createdOn: Date;
    outlets: Outlet[];
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

// Add other types as needed