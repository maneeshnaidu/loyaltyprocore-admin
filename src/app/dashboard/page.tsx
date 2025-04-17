"use client"

import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// import data from "./data.json"
import { VendorTable } from "@/components/vendors/vendors-table"
import { useVendors } from "@/hooks/use-vendors"
import { columns } from "@/components/vendors/columns"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
// import { handleError } from "../helpers/error-handler"

export default function Page() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const { data: vendors, isLoading, error } = useVendors();

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (isLoggedIn === null) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // Prevent rendering until authentication is verified
  }

  return (
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
              <div className="px-4 lg:px-6">
                {activeMenu === "Vendors" && (
                  <>
                    {isLoading && <div>Loading...</div>}
                    {error && <div>Error loading vendors</div>}
                    {vendors && <VendorTable columns={columns} data={vendors} />}
                  </>
                )}
                {activeMenu !== "Vendors" && <div>Welcome to {activeMenu}</div>}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider >
  )
}
