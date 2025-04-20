"use client"

import { z } from "zod";

const LoginFormSchema = z.object({
    username: z.string().trim(),
    password: z.string().min(12).trim(),
})

const RegisterFormSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim().optional(),
    username: z.string().trim(),
    email: z.string().email().trim(),
    password: z.string().min(12).trim(),
    admin: z.string().trim().optional()
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
    logoImage: z.instanceof(File).optional(),
    coverImage: z.instanceof(File).optional(),
});

const ForgotPasswordFormSchema = z.object({
    email: z.string().email().trim(),
})

const OutletFormSchema = z.object({
    // id: z.number().optional(),
    // vendorId: z.number().optional(),
    userName: z.string().trim(),
    address: z.string().trim(),
    isActive: z.boolean(),
    // createdOn: z.date().optional(),
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

export {
    LoginFormSchema,
    RegisterFormSchema,
    RegisterVendorFormSchema,
    ForgotPasswordFormSchema,
    OutletFormSchema,
    UserFormSchema,
    UpdateVendorSchema
}