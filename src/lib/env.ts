import { z } from "zod"

// Server-side environment variables
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().optional(),

  // Google OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Email (optional for development)
  RESEND_API_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

// Validate server environment
export function validateServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error("❌ Invalid server environment variables:")
    console.error(parsed.error.flatten().fieldErrors)

    // In production, throw an error
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid server environment variables")
    }

    // In development, just warn
    console.warn("⚠️ Running with invalid environment variables")
    return null
  }

  return parsed.data
}

// Validate client environment
export function validateClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  })

  if (!parsed.success) {
    console.error("❌ Invalid client environment variables:")
    console.error(parsed.error.flatten().fieldErrors)
    return null
  }

  return parsed.data
}

// Type-safe environment access
export const serverEnv = validateServerEnv()
export const clientEnv = validateClientEnv()

// Helper to check if required OAuth is configured
export function isGoogleOAuthConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  )
}

// Helper to check if email is configured
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

// Environment type definitions
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
