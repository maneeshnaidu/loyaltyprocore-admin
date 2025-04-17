import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // TODO: Replace with your actual user verification logic
        if (email === 'admin@example.com' && password === 'password') {
            const user = {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin',
                permissions: ['read:users', 'write:users']
            }

            const token = sign(user, JWT_SECRET, { expiresIn: '1d' })

            return NextResponse.json({ token, user })
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}