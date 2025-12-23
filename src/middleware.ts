import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin routes - require ADMIN or SUPER_ADMIN role
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Onboarding routes - only for users who haven't completed onboarding
    if (pathname.startsWith("/onboarding")) {
      if (token?.onboardingComplete) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Dashboard and protected routes - require completed onboarding
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/assessments") ||
      pathname.startsWith("/sessions") ||
      pathname.startsWith("/progress")
    ) {
      if (!token?.onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/assessments/:path*",
    "/sessions/:path*",
    "/progress/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
  ],
}
