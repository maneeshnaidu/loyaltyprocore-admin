import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { Toaster } from 'sonner'
import { UserProvider } from "@/components/providers/auth-provider"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "LoyaltyPro",
    description: "Loyalty rewards system",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ReactQueryProvider>
                        <UserProvider>
                            {children}
                        </UserProvider>
                        <Toaster
                            position="top-right"
                            expand={false}
                            richColors
                            closeButton
                            theme="system"
                        />
                    </ReactQueryProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}