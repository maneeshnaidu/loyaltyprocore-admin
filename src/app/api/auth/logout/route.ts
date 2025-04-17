import { NextResponse } from "next/server"
import apiClient from "@/lib/api-client"

export async function POST() {
    try {
        // Call the backend API to logout
        await apiClient.post("/account/logout")
        
        // Clear the token cookie
        const response = NextResponse.json({ success: true })
        
        // Clear the token cookie with proper options
        response.cookies.set('token', '', {
            expires: new Date(0),
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })
        
        // In a real application, you might want to:
        // 1. Add the token to a blacklist
        // 2. Clear any server-side sessions
        // 3. Perform any cleanup tasks

        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
