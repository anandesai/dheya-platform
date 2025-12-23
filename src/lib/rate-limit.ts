import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiter
// For production, use Redis or similar
const rateLimit = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
}

const strictConfig: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute (for auth endpoints)
}

export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  if (realIp) {
    return realIp
  }

  // Fallback to a default (not ideal but works for development)
  return "anonymous"
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const key = identifier
  const entry = rateLimit.get(key)

  // Clean up old entries periodically
  if (rateLimit.size > 10000) {
    const cutoff = now - config.interval
    Array.from(rateLimit.entries()).forEach(([k, v]) => {
      if (v.resetTime < cutoff) {
        rateLimit.delete(k)
      }
    })
  }

  if (!entry || entry.resetTime < now) {
    // New window
    rateLimit.set(key, {
      count: 1,
      resetTime: now + config.interval,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.interval,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  }
}

export function rateLimitMiddleware(
  request: NextRequest,
  config?: RateLimitConfig
) {
  const identifier = getClientIdentifier(request)
  const path = request.nextUrl.pathname

  // Use stricter limits for auth endpoints
  const effectiveConfig = path.startsWith("/api/auth")
    ? strictConfig
    : config || defaultConfig

  const result = checkRateLimit(`${identifier}:${path}`, effectiveConfig)

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Please try again later",
        retryAfter: Math.ceil(result.resetIn / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.resetIn / 1000)),
          "X-RateLimit-Limit": String(effectiveConfig.maxRequests),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(Math.ceil(result.resetIn / 1000)),
        },
      }
    )
  }

  return null // Allowed, continue with request
}

// Helper to create rate-limited API handler
export function withRateLimit<T>(
  handler: (request: NextRequest, context?: T) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (request: NextRequest, context?: T) => {
    const rateLimitResponse = rateLimitMiddleware(request, config)
    if (rateLimitResponse) {
      return rateLimitResponse
    }
    return handler(request, context)
  }
}
