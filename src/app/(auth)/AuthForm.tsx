"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

const AuthForm = () => {
    const { user, loginUser } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';

    useEffect(() => {
        if (user) {
            console.log(returnUrl);
            router.push(returnUrl);
        }
        setMounted(true);
    }, [returnUrl, router, user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await loginUser(username, password);
            router.push(returnUrl);
        } catch (err) {
            setError('Error: ' + err);
            toast.error("Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1 px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
                    <CardTitle className="text-2xl font-bold text-center sm:text-3xl">
                        Login
                    </CardTitle>
                    <CardDescription className="text-center text-sm sm:text-base">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {error && (
                            <div className="text-sm text-destructive text-center font-medium px-2 py-1 rounded bg-destructive/10">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                type="text"
                                required
                                disabled={isLoading}
                                className="h-10 sm:h-11 text-sm sm:text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                                className="h-10 sm:h-11 text-sm sm:text-base"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-10 sm:h-11 text-sm sm:text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                        <div className="text-center text-sm sm:text-base">
                            Don&apos;t have an account?{" "}
                            <a
                                href="/register"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthForm;