import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            )
        }

        const token = authHeader.split(' ')[1]
        const decoded = verify(token, JWT_SECRET)

        return NextResponse.json(decoded)
    } catch (error) {
        console.error('Token verification error:', error)
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        )
    }
} 