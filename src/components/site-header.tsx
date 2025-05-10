// import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface SiteHeaderProps {
  user: unknown; // You can replace 'any' with a more specific user type if available
}



export function SiteHeader({ }: SiteHeaderProps) {
  const pathname = usePathname();
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

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{activeMenu}</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button> */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
