"use client"

import { z } from "zod";

const LoginFormSchema = z.object({
    username: z.string().trim(),
    password: z.string().min(12).trim(),
})

const RegisterFormSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    username: z.string().trim(),
    email: z.string().email().trim(),
    password: z.string()
        .min(12, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    vendorId: z.number().optional(),
    roles: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const UpdateUserFormSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    username: z.string().trim(),
    email: z.string().email().trim(),
    vendorId: z.number().optional(),
    roles: z.string().optional()
})

const RegisterVendorFormSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    username: z.string().trim(),
    email: z.string().email().trim(),
    password: z.string().min(12).trim(),
    name: z.string().trim(),
    description: z.string().trim(),
    category: z.string().trim(),
    logoImage: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be under 5MB")
        .optional(),
    // logo: z.string().optional(),
    coverImage: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be under 5MB")
        .optional(),
})

const UpdateVendorSchema = z.object({
    name: z.string().min(1, "Required"),
    description: z.string().optional(),
    category: z.string().min(1, "Required"),
    logoImage: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be under 5MB")
        .optional(),
    coverImage: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be under 5MB")
        .optional(),
});

const ForgotPasswordFormSchema = z.object({
    email: z.string().email().trim(),
})

const OutletFormSchema = z.object({
    userName: z.string(),
    vendorId: z.number(),
    name: z.string().trim(),
    description: z.string().trim(),
    category: z.string().trim(),
    address: z.string().trim(),
    phoneNumber: z.string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(15, { message: "Phone number can't be longer than 15 digits" })
        .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/, {
            message: "Invalid phone number format"
        }),
    isActive: z.boolean(),
    coverImage: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be under 5MB")
        .optional(),
})

const RewardFormSchema = z.object({
    vendor: z.number().min(1, "Vendor is required"),
    title: z.string().trim(),
    description: z.string().trim(),
    pointsRequired: z.number().min(1, "Points must be at least 1"),
    isActive: z.boolean(),
})

const AddPointSchema = z.object({
    userCode: z.number().min(10000, "User Code is required"),
    rewardId: z.number().min(1, "Reward Plan is required"),
    vendorId: z.number().min(1, "Vendor is required"),
    outletId: z.number().min(1, "Outlet is required"),
    orderId: z.number().optional(),
    point: z.number().min(1, "Points earned is required"),
})

const RedeemPointSchema = z.object({
    userCode: z.number().min(10000, "User Code is required").max(99999),
    rewardId: z.number().min(1, "Reward Plan is required"),
    outletId: z.number().min(1, "Vendor is required"),
})

const UserFormSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: z.string().email().trim(),
    userCode: z.number().max(99999),
    userName: z.string().trim(),
    password: z.string().min(12).trim(),
    vendorId: z.number().optional(),
    outletId: z.number().optional(),
    createdOn: z.date().optional(),
})

const PasswordSchema = z.object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z.string()
        .min(12, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export {
    LoginFormSchema,
    RegisterFormSchema,
    RegisterVendorFormSchema,
    ForgotPasswordFormSchema,
    OutletFormSchema,
    UserFormSchema,
    UpdateVendorSchema,
    PasswordSchema,
    UpdateUserFormSchema,
    RewardFormSchema,
    AddPointSchema,
    RedeemPointSchema
}