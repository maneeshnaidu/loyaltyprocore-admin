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

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import RoleBasedRender from "@/components/role-based-render"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"
import { usePathname } from "next/navigation"

export default function Page() {
  const { isLoggedIn, user } = useAuth();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeMenu, setActiveMenu] = useState("Dashboard");

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
        <AppSidebar setActiveMenu={setActiveMenu} variant="inset" />
        <SidebarInset>
          <SiteHeader user={user} />
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
