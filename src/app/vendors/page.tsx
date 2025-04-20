"use client";

import { useDeleteVendor, useVendors } from '@/hooks/use-vendors';
import { Vendor } from '@/types';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import VendorForm from './vendor-form';
import { getVendorColumns } from './vendor-columns';
import { useAuth } from '@/components/providers/auth-provider';
import ProtectedRoute from '@/components/protected-route';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

const VendorsPage = () => {
    const { user } = useAuth();
    const { data: vendors, isLoading } = useVendors();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeMenu, setActiveMenu] = useState("vendors");

    const deleteVendorMutation = useDeleteVendor();

    const onEdit = useCallback((vendor: Vendor) => {
        setSelectedVendor(vendor);
        setIsDialogOpen(true);
    }, []);

    const onDelete = useCallback(async (vendor: Vendor) => {
        await deleteVendorMutation.mutateAsync(vendor.id, {
            onSuccess: () => {
                toast.success('Vendor was deleted successfully.');
            },
            onError: () => {
                toast.error('There was a problem with your request.');
            },
        });
    }, [deleteVendorMutation]);

    const columns = useMemo(() => getVendorColumns({ onEdit, onDelete }), [onDelete, onEdit]);

    return (
        <ProtectedRoute requiredRoles={["SuperAdmin"]}>
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
                    <SiteHeader user={user} />
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Vendors</CardTitle>
                            <div className="flex justify-between">
                                <div />
                                <div className="flex-nowrap">
                                    <VendorForm
                                        isOpen={isDialogOpen}
                                        vendor={selectedVendor}
                                        onOpenChange={(value) => {
                                            setIsDialogOpen(value);
                                            if (!value) {
                                                setSelectedVendor(null);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading && <span>Loading</span>}
                            {!isLoading && <DataTable data={vendors ? vendors : []} columns={columns} />}
                        </CardContent>
                    </Card>
                </SidebarInset>
            </SidebarProvider >
        </ProtectedRoute>
    )
}

export default VendorsPage;