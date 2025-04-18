// components/ProtectedRoute.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

export default function ProtectedRoute({
    children,
    requiredRoles = []
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            } else if (requiredRoles.length > 0 &&
                !requiredRoles.some(role => user.roles?.includes(role))) {
                router.push('/unauthorized');
            }
        }
    }, [user, router, requiredRoles, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || (requiredRoles.length > 0 &&
        !requiredRoles.some(role => user.roles?.includes(role)))) {
        return null;
    }

    return <>{children}</>;
}