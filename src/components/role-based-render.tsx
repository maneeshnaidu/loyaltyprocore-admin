// components/RoleBasedRender.tsx
'use client';

import { useAuth } from '@/components/providers/auth-provider';

interface RoleBasedRenderProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function RoleBasedRender({
    children,
    allowedRoles
}: RoleBasedRenderProps) {
    const { user } = useAuth();

    if (!user || !allowedRoles.some(role => user.roles?.includes(role))) {
        return null;
    }

    return <>{children}</>;
}