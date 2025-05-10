"use client";

import { QueryObject, UserModel } from '@/types';
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import ProtectedRoute from '@/components/protected-route';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from '@/components/app-sidebar';
import UserForm from './user-form';
import { useDeleteUser, useUsers } from '@/lib/user-service';
import { getUserColumns } from './user-columns';
import RoleBasedRender from '@/components/role-based-render';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { useAuth } from '@/components/providers/auth-provider';

const UsersPage = () => {
    const { user } = useAuth();
    const query: QueryObject = {
        vendorId: user?.vendor || undefined
    };
    const { data: userModels, isLoading } = useUsers(query);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeMenu, setActiveMenu] = useState("userModels");

    const deleteUserMutation = useDeleteUser();

    const onEdit = useCallback((userModel: UserModel) => {
        setSelectedUser(userModel);
        setIsDialogOpen(true);
    }, []);

    const onDelete = useCallback(async (userModel: UserModel) => {
        await deleteUserMutation.mutateAsync(userModel.id, {
            onSuccess: () => {
                toast.success('User was deleted successfully.');
            },
            onError: () => {
                toast.error('There was a problem with your request.');
            },
        });
    }, [deleteUserMutation]);

    const columns = useMemo(() => getUserColumns({ onEdit, onDelete }), [onDelete, onEdit]);
    return (
        <ProtectedRoute requiredRoles={["SuperAdmin", "Admin"]}>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader user={activeMenu} />
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <div className="flex justify-between mt-3 items-center py-4">
                                    <div />
                                    <RoleBasedRender allowedRoles={['SuperAdmin', 'Admin']}>
                                        <UserForm
                                            isOpen={isDialogOpen}
                                            userModel={selectedUser}
                                            onOpenChange={(value) => {
                                                setIsDialogOpen(value);
                                                if (!value) {
                                                    setSelectedUser(null);
                                                }
                                            }}
                                        />
                                    </RoleBasedRender>
                                </div>
                                <div className="container mx-auto">
                                    {!isLoading ? (
                                        <DataTable data={userModels ? userModels : []} columns={columns} />
                                    ) : (
                                        <DataTableSkeleton columns={columns.entries.length} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider >
        </ProtectedRoute>
    )
}

export default UsersPage