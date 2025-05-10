"use client"

import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { useCallback, useEffect, useMemo } from "react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"
import { useTransactions } from "@/hooks/use-transactions"
import { QueryObject } from "@/types"
import { getTransactionColumns } from "../transactions/transactions-columns"
import AddPoints from "@/components/add-point"
import RedeemPoints from "@/components/redeem-point"

export default function Page() {
  const { isLoggedIn, user } = useAuth();
  const query: QueryObject = {
    vendorId: user?.vendor || undefined,
    isLatest: true
  };

  // const [selectedVendor, setSelectedVendor] = useState<number>();  
  const { data: transactions } = useTransactions(query);

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Authentication failed!")
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null; // Prevent rendering until authentication is verified
  }

  const handleSuccess = () => {
    toast.success("Points added - refresh data if needed")
  }

  const handleRedeem = () => {
    toast.success("Points redeemed - refresh data if needed")
  }


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onEdit = useCallback(() => {
    toast.warning('Method not implemented');
  }, []);


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onDelete = useCallback(async () => {
    console.log("test");
  }, []);


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const columns = useMemo(() => getTransactionColumns({ onEdit, onDelete }), [onDelete, onEdit]);

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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* <SectionCards /> */}
                <div className="px-4 lg:px-6">
                  {/* <ChartAreaInteractive /> */}
                  <AddPoints onSuccess={handleSuccess} />
                  <RedeemPoints onSuccess={handleRedeem} />
                </div>
                <div className="px-4 lg:px-6">
                  <DataTable data={transactions || []} columns={columns} />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider >
    </ProtectedRoute>
  )
}
