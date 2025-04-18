"use client";

import { columns } from "@/components/vendors/columns";
import { VendorTable } from "@/components/vendors/vendors-table";
import { useVendors } from "@/hooks/use-vendors";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RoleBasedRender from "@/components/role-based-render";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/protected-route";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

// type Props = {};

const VendorsPage = () => {
    const { data: vendors, isLoading, error } = useVendors();
    const [activeMenu, setActiveMenu] = useState<string>("Vendors");

    useEffect(() => {
        if (error) {
            console.error("Error fetching vendors:", error);
        }

        if (isLoading) {
            console.log("Loading vendors...");
        }
    }, [error, isLoading]);

    if (isLoading) {
        // Render skeleton loading while data is being fetched
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-5/6" />
                <Skeleton className="h-8 w-2/3" />
            </div>
        );
    }

    if (error) {
        // Render an error message if fetching vendors fails
        return <div className="text-red-500">Failed to load vendors. Please try again later.</div>;
    }

    if (!vendors || vendors.length === 0) {
        // Render a message if no vendors are available
        return <div className="text-gray-500">No vendors available.</div>;
    }

    // Render the VendorTable when data is available
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
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                {/* <SectionCards /> */}
                                <div className="px-4 lg:px-6">
                                    {/* <ChartAreaInteractive /> */}
                                </div>
                                {/* <DataTable data={data} /> */}
                                <RoleBasedRender allowedRoles={['SuperAdmin']}>
                                    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                                        <div className="px-4 lg:px-6">
                                            <VendorTable data={vendors} columns={columns} />
                                        </div>
                                    </div>
                                </RoleBasedRender>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider >
        </ProtectedRoute>

    );
}

export default VendorsPage;