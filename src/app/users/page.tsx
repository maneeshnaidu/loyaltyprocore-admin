"use client";

import { UserModel } from '@/types';
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import ProtectedRoute from '@/components/protected-route';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from '@/components/app-sidebar';
import UserForm from './user-form';
import { useDeleteUser, useUsers } from '@/lib/user-service';
import { getUserColumns } from './user-columns';

const UsersPage = () => {
    const { data: userModels, isLoading } = useUsers();
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
                <AppSidebar setActiveMenu={setActiveMenu} variant="inset" />
                <SidebarInset>
                    <SiteHeader user={undefined} />
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <div className="flex justify-between">
                                <div />
                                <div className="flex-nowrap">
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
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading && <span>Loading</span>}
                            {!isLoading && <DataTable data={userModels ? userModels : []} columns={columns} />}
                        </CardContent>
                    </Card>
                </SidebarInset>
            </SidebarProvider >
        </ProtectedRoute>
    )
}

export default UsersPage