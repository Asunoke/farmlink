import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Public routes that don't require authentication
  const isPublicRoute =
    nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/auth/") || nextUrl.pathname.startsWith("/api/auth/")

  // Admin routes that require admin role
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  // Dashboard routes that require authentication
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")

  // Redirect to signin if trying to access protected routes without auth
  if (!isLoggedIn && (isDashboardRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }

  // Redirect to dashboard if logged in user tries to access auth pages
  if (isLoggedIn && nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Check admin access for admin routes
  if (isAdminRoute && isLoggedIn) {
    const userRole = req.auth?.user?.role
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
