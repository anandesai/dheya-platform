// Authentication and Authorization Middleware
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserRole } from "@prisma/client"

export interface AuthMiddlewareOptions {
  requiredRoles?: UserRole[]
  requireOnboarding?: boolean
  requireSegment?: boolean
}

/**
 * Middleware to check authentication and authorization
 */
export async function withAuth(
  request: NextRequest,
  options: AuthMiddlewareOptions = {}
): Promise<{ success: true; userId: string; role: UserRole } | NextResponse> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Check if user is authenticated
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - Please log in" },
      { status: 401 }
    )
  }

  // Check required roles
  if (options.requiredRoles && options.requiredRoles.length > 0) {
    const userRole = token.role as UserRole
    if (!options.requiredRoles.includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }
  }

  // Check if onboarding is required
  if (options.requireOnboarding && !token.onboardingComplete) {
    return NextResponse.json(
      { error: "Please complete onboarding first" },
      { status: 403 }
    )
  }

  // Check if segment is required
  if (options.requireSegment && !token.segment) {
    return NextResponse.json(
      { error: "Please complete profile setup first" },
      { status: 403 }
    )
  }

  return {
    success: true,
    userId: token.id as string,
    role: token.role as UserRole
  }
}

/**
 * Check if user is an admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
}

/**
 * Check if user is a mentor
 */
export function isMentor(role: UserRole): boolean {
  return role === UserRole.MENTOR
}

/**
 * Middleware configuration for different route types
 */
export const authConfig = {
  // Admin routes require ADMIN or SUPER_ADMIN role
  admin: {
    requiredRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  // Mentor routes require MENTOR, ADMIN, or SUPER_ADMIN role
  mentor: {
    requiredRoles: [UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  // User routes require authentication and completed onboarding
  user: {
    requireOnboarding: true,
    requireSegment: true
  },
  // Basic authenticated routes
  authenticated: {}
}
