"use client";
import { useDeleteOutlet, useOutlets } from '@/hooks/use-outlets';
import { Outlet } from '@/types';
import React, { useCallback, useMemo, useState } from 'react'
import { getOutletColumns } from './outlet-columns';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import OutletForm from './outlet-form';
import ProtectedRoute from '@/components/protected-route';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from '@/components/app-sidebar';
import RoleBasedRender from '@/components/role-based-render';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

const OutletsPage = () => {
    const { data: outlets, isLoading } = useOutlets();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedOultet, setSelectedOutlet] = useState<Outlet | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeMenu, setActiveMenu] = useState("Outlets");

    const deleteOutletMutation = useDeleteOutlet();

    const onEdit = useCallback((outlet: Outlet) => {
        setSelectedOutlet(outlet);
        setIsDialogOpen(true);
    }, []);

    const onDelete = useCallback(async (outlet: Outlet) => {
        await deleteOutletMutation.mutateAsync(outlet.id, {
            onSuccess: () => {
                toast.success('Outlet was deleted successfully.');
            },
            onError: () => {
                toast.error('There was a problem with your request.');
            },
        });
    }, [deleteOutletMutation]);

    const columns = useMemo(() => getOutletColumns({ onEdit, onDelete }), [onDelete, onEdit]);
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
                    <SiteHeader user={undefined} />
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <div className="flex justify-between mt-3 items-center py-4">
                                    <div />
                                    <RoleBasedRender allowedRoles={['SuperAdmin', 'Admin']}>
                                        <OutletForm
                                            isOpen={isDialogOpen}
                                            outlet={selectedOultet}
                                            onOpenChange={(value) => {
                                                setIsDialogOpen(value);
                                                if (!value) {
                                                    setSelectedOutlet(null);
                                                }
                                            }}
                                        />
                                    </RoleBasedRender>
                                </div>
                                <div className="container mx-auto">
                                    {isLoading ? (
                                        <DataTableSkeleton columns={columns.entries.length} />
                                    ) : (
                                        <DataTable data={outlets ? outlets : []} columns={columns} />
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

export default OutletsPage