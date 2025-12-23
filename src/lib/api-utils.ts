import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

// Standard API response types
export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  message: string
  details?: unknown
  code?: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// Success response helper
export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(message && { message }),
    },
    { status }
  )
}

// Error response helper
export function errorResponse(
  error: string,
  message: string,
  status = 400,
  details?: unknown,
  code?: string
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false as const,
    error,
    message,
  }

  if (details !== undefined) {
    response.details = details
  }

  if (code !== undefined) {
    response.code = code
  }

  return NextResponse.json(response, { status })
}

// Handle common errors
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error("API Error:", error)

  // Zod validation errors
  if (error instanceof ZodError) {
    const zodError = error as ZodError<unknown>
    return errorResponse(
      "Validation Error",
      "Invalid request data",
      400,
      zodError.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
      "VALIDATION_ERROR"
    )
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return errorResponse(
          "Conflict",
          "A record with this value already exists",
          409,
          { field: error.meta?.target },
          "DUPLICATE_ENTRY"
        )
      case "P2025":
        return errorResponse(
          "Not Found",
          "The requested resource was not found",
          404,
          undefined,
          "NOT_FOUND"
        )
      case "P2003":
        return errorResponse(
          "Bad Request",
          "Invalid reference to related record",
          400,
          undefined,
          "FOREIGN_KEY_ERROR"
        )
      default:
        return errorResponse(
          "Database Error",
          "An error occurred while processing your request",
          500,
          undefined,
          `DB_${error.code}`
        )
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponse(
      "Validation Error",
      "Invalid data provided",
      400,
      undefined,
      "PRISMA_VALIDATION"
    )
  }

  // Standard Error with message
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes("not found")) {
      return errorResponse("Not Found", error.message, 404, undefined, "NOT_FOUND")
    }
    if (error.message.includes("unauthorized") || error.message.includes("Unauthorized")) {
      return errorResponse("Unauthorized", error.message, 401, undefined, "UNAUTHORIZED")
    }
    if (error.message.includes("forbidden") || error.message.includes("Forbidden")) {
      return errorResponse("Forbidden", error.message, 403, undefined, "FORBIDDEN")
    }
    if (error.message.includes("already exists") || error.message.includes("duplicate")) {
      return errorResponse("Conflict", error.message, 409, undefined, "CONFLICT")
    }

    // Generic error
    return errorResponse(
      "Internal Server Error",
      process.env.NODE_ENV === "development"
        ? error.message
        : "An unexpected error occurred",
      500,
      process.env.NODE_ENV === "development" ? error.stack : undefined,
      "INTERNAL_ERROR"
    )
  }

  // Unknown error
  return errorResponse(
    "Internal Server Error",
    "An unexpected error occurred",
    500,
    undefined,
    "UNKNOWN_ERROR"
  )
}

// Wrap async API handlers with error handling
export function withErrorHandler<T>(
  handler: (request: Request, context?: T) => Promise<NextResponse>
) {
  return async (request: Request, context?: T): Promise<NextResponse> => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Authentication check helper
export function requireAuth(session: unknown): asserts session is { user: { id: string } } {
  if (!session || typeof session !== "object" || !("user" in session)) {
    throw new Error("Unauthorized")
  }
}

// Admin role check helper
export function requireAdmin(session: unknown): asserts session is { user: { id: string; role: "ADMIN" } } {
  requireAuth(session)
  const s = session as { user: { role?: string } }
  if (s.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }
}

// Pagination helpers
export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultLimit = 20,
  maxLimit = 100
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(searchParams.get("limit") || String(defaultLimit), 10))
  )
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasMore: boolean
  }
}

export function createPaginatedResponse<T>(
  items: T[],
  totalItems: number,
  { page, limit }: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalItems / limit)
  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasMore: page < totalPages,
    },
  }
}

// Sort params helper
export function parseSortParams(
  searchParams: URLSearchParams,
  allowedFields: string[],
  defaultField = "createdAt",
  defaultOrder: "asc" | "desc" = "desc"
): { field: string; order: "asc" | "desc" } {
  const sortBy = searchParams.get("sortBy") || defaultField
  const order = (searchParams.get("order") || defaultOrder) as "asc" | "desc"

  return {
    field: allowedFields.includes(sortBy) ? sortBy : defaultField,
    order: ["asc", "desc"].includes(order) ? order : defaultOrder,
  }
}
