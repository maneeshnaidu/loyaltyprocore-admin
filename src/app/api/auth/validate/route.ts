import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
    try {
        const token = (await cookies()).get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'No token found' },
                { status: 401 }
            )
        }

        // Validate token with your backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/validate`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        })

        if (!response.ok) {
            // Clear invalid token
            (await
                // Clear invalid token
                cookies()).delete('token')
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const data = await response.json()
        
        return NextResponse.json({
            user: {
                name: data.userName,
                email: data.email
            }
        })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json(
            { error: 'Validation failed' },
            { status: 500 }
        )
    }
}