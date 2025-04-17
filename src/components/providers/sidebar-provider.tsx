"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

type SidebarContextType = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType>({
    isOpen: true,
    setIsOpen: () => {},
    isMobile: false,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true)
    const isMobile = useMediaQuery("(max-width: 768px)")

    // Close sidebar by default on mobile
    useEffect(() => {
        if (isMobile) {
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
    }, [isMobile])

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}