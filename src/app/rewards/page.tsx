"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

import { useCallback, useEffect, useMemo, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { useDeleteReward, useRewards } from "@/hooks/use-rewards"
import { Reward } from "@/types"
import { getRewardColumns } from "./reward-columns"
import { DataTable } from "@/components/data-table"
import RoleBasedRender from "@/components/role-based-render"
import RewardForm from "./reward-form"
// import { SectionCards } from "@/components/section-cards"

export default function Page() {
    const { data: rewards } = useRewards();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const { isLoggedIn, user } = useAuth();
    const pathname = usePathname();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeMenu, setActiveMenu] = useState("Rewards");

    const deleteRewardMutation = useDeleteReward();

    const onEdit = useCallback((reward: Reward) => {
        setSelectedReward(reward);
        setIsDialogOpen(true);
    }, []);

    const onDelete = useCallback(async (reward: Reward) => {
        await deleteRewardMutation.mutateAsync(reward.id, {
            onSuccess: () => {
                toast.success('Reward was deleted successfully.');
            },
            onError: () => {
                toast.error('There was a problem with your request.');
            },
        });
    }, [deleteRewardMutation]);

    const columns = useMemo(() => getRewardColumns({ onEdit, onDelete }), [onDelete, onEdit]);

    // Update active menu based on current path
    useEffect(() => {
        // Extract the first part of the path (e.g., /dashboard -> Dashboard)
        const path = pathname.split('/')[1];
        if (path) {
            // Capitalize the first letter
            const menuName = path.charAt(0).toUpperCase() + path.slice(1);
            setActiveMenu(menuName);
        }
    }, [pathname]);

    // Redirect unauthenticated users to the login page
    useEffect(() => {
        if (isLoggedIn === null) {
            toast.error("Please login to access this page");
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null; // Prevent rendering until authentication is verified
    }

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
                    <SiteHeader user={user} />
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                {/* <SectionCards /> */}
                                <div className="flex justify-between mt-3 items-center py-4">
                                    <div />
                                    <RoleBasedRender allowedRoles={['SuperAdmin', 'Admin']}>
                                        <RewardForm
                                            isOpen={isDialogOpen}
                                            reward={selectedReward}
                                            onOpenChange={(value) => {
                                                setIsDialogOpen(value);
                                                if (!value) {
                                                    setSelectedReward(null);
                                                }
                                            }}
                                        />
                                    </RoleBasedRender>
                                </div>
                                <div className="container mx-auto">
                                    <DataTable data={rewards ? rewards : []} columns={columns} />
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider >
        </ProtectedRoute>
    )
}
