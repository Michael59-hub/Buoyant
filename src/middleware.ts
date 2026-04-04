import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const isAdmin = role === "admin"
  const isVendor = role === "vendor"
  const pathname = req.nextUrl.pathname

  const isAdminRoute = pathname.startsWith("/admin")
  const isVendorRoute = pathname.startsWith("/vendor")
  const isProtectedRoute = pathname.startsWith("/orders")
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")

  // Block non-admins from admin routes
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Block non-vendors from vendor routes
  if (isVendorRoute && !isVendor) {
    return NextResponse.redirect(
      isLoggedIn
        ? new URL("/", req.url)      // logged in but wrong role → home
        : new URL("/login", req.url) // not logged in → login
    )
  }

  // Redirect logged-out users away from protected pages
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Redirect logged-in users away from login/signup
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*", "/orders/:path*", "/login", "/signup"],
}