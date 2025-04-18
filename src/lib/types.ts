"use client"

import { z } from "zod";

const LoginFormSchema = z.object({
    username: z.string().trim(),
    password: z.string().min(12).trim(),
})

const RegisterFormSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    username: z.string().email().trim(),
    password: z.string().min(12).trim(),
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

const ForgotPasswordFormSchema = z.object({
    email: z.string().email().trim(),
})

export { LoginFormSchema, RegisterFormSchema, RegisterVendorFormSchema, ForgotPasswordFormSchema }