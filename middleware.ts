import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const isLoggedIn = req.cookies.get("auth")?.value
    const pathname = req.nextUrl.pathname

    // Protect dashboard routes
    const protectedRoutes = ["/dashboard"]
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirect to dashboard if already logged in and trying to access login/signup
    const authRoutes = ["/login", "/signup"]
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
}
