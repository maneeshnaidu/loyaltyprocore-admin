import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and public API routes
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ]
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')
    const { pathname } = request.nextUrl

    // Check if the path is a protected route
    const isProtectedRoute = pathname.startsWith('/dashboard')
    
    // Check if the path is an auth route
    const isAuthRoute = ['/login', '/register'].includes(pathname)

    // If trying to access protected route without token
    if (isProtectedRoute && !token) {
        const returnUrl = encodeURIComponent(pathname)
        return NextResponse.redirect(
            new URL(`/?returnUrl=${returnUrl}`, request.url)
        )
    }

    // If trying to access auth routes with token
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}