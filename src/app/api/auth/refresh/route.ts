import { NextResponse } from 'next/server'
import { verify, sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            )
        }

        const token = authHeader.split(' ')[1]
        const decoded = verify(token, JWT_SECRET) as any

        // Generate a new token with the same user data
        const newToken = sign(
            {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
                permissions: decoded.permissions
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        return NextResponse.json({ token: newToken })
    } catch (error) {
        console.error('Token refresh error:', error)
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        )
    }
} 