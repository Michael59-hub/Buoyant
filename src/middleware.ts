import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "admin"
  const pathname = req.nextUrl.pathname

  const isAdminRoute = pathname.startsWith("/admin")
  const isProtectedRoute = pathname.startsWith("/orders")
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")

  // Block non-admins from admin routes entirely
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/login", req.url))
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
  matcher: ["/admin/:path*", "/orders/:path*", "/login", "/signup"],
}