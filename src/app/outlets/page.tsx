"use client";
import { useDeleteOutlet, useOutlets } from '@/hooks/use-outlets';
import { Outlet } from '@/types';
import React, { useCallback, useMemo, useState } from 'react'
import { getOutletColumns } from './outlet-columns';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import OutletForm from './outlet-form';
import ProtectedRoute from '@/components/protected-route';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from '@/components/app-sidebar';

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
                toast.success('Bank account was deleted successfully.');
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
                <AppSidebar setActiveMenu={setActiveMenu} variant="inset" />
                <SidebarInset>
                    <SiteHeader user={undefined} />
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Outlets</CardTitle>
                            <div className="flex justify-between">
                                <div />
                                <div className="flex-nowrap">
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
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading && <span>Loading</span>}
                            {!isLoading && <DataTable data={outlets ? outlets : []} columns={columns} />}
                        </CardContent>
                    </Card>
                </SidebarInset>
            </SidebarProvider >
        </ProtectedRoute>
    )
}

export default OutletsPage