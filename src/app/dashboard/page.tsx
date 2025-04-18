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
import ProtectedRoute from "@/components/protected-route"
import RoleBasedRender from "@/components/role-based-render"
import { SectionCards } from "@/components/section-cards"
// import { handleError } from "../helpers/error-handler"

export default function Page() {
  // const router = useRouter();
  // const { isLoggedIn } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  // const { data: vendors, isLoading, error } = useVendors();

  // // Redirect unauthenticated users to the login page
  // useEffect(() => {
  //   if (isLoggedIn === null) {
  //     router.push("/login"); // Redirect to login if not authenticated
  //   }
  // }, [isLoggedIn, router]);

  // if (!isLoggedIn) {
  //   return null; // Prevent rendering until authentication is verified
  // }

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
                  <div className="bg-red-50 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Admin Content</h2>
                    <p>This content is visible only to admins</p>
                    <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete User
                    </button>
                  </div>
                </RoleBasedRender>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider >
    </ProtectedRoute>
  )
}
