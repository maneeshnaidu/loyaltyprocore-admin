"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { removeToken } from "@/lib/auth-storage"
import apiClient from "@/lib/api-client"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call our API route to handle backend logout
        await apiClient.post('/auth/logout')

        // Clear local token
        removeToken()

        // Redirect to login page
        router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
        // Still redirect even if there's an error
        router.push('/login')
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we log you out.</p>
      </div>
    </div>
  )
} 