import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for creating/updating tools
const toolSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(200),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  category: z.enum(["assessment", "workbook", "framework", "report", "exercise"]),
  estimatedMinutes: z.number().min(1).max(180),
  phase: z.number().min(1).max(6),
  segments: z.array(z.enum(["EARLY_CAREER", "MID_CAREER", "SENIOR", "RETURNING_WOMEN"])),
  status: z.enum(["draft", "active", "published", "archived"]).optional(),
  contentSchema: z.any().optional(),
  contentData: z.any().optional(),
  scoringLogic: z.any().optional(),
})

// Map frontend status to Prisma enum
const statusToPrisma: Record<string, "DRAFT" | "PUBLISHED" | "ARCHIVED"> = {
  draft: "DRAFT",
  active: "PUBLISHED",
  published: "PUBLISHED",
  archived: "ARCHIVED",
}

// Map Prisma status to frontend
const statusToFrontend: Record<string, string> = {
  DRAFT: "draft",
  PUBLISHED: "active",
  ARCHIVED: "archived",
}

// Helper to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 }
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { error: "Forbidden - Admin access required", status: 403 }
  }
  return { user: session.user }
}

// GET /api/admin/tools - List all tools with filtering
export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const segment = searchParams.get("segment")
  const status = searchParams.get("status")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  try {
    // Build where clause
    const where: Record<string, unknown> = {}

    if (category && category !== "all") {
      where.category = category.toUpperCase()
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ]
    }

    // For segment filtering, we need to filter by the SegmentTool relation
    if (segment && segment !== "all") {
      where.segmentTools = {
        some: {
          segment: segment.toUpperCase(),
        },
      }
    }

    // Get tools with pagination
    const [tools, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        include: {
          segmentTools: {
            select: {
              segment: true,
              phaseNumber: true,
            },
          },
          _count: {
            select: {
              userProgress: true,
              toolResults: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tool.count({ where }),
    ])

    // Transform data for the frontend
    const transformedTools = tools.map((tool) => ({
      id: tool.id,
      code: tool.code,
      name: tool.name,
      shortDescription: tool.shortDescription,
      category: tool.category.toLowerCase(),
      estimatedMinutes: tool.estimatedMinutes,
      status: statusToFrontend[tool.status] || tool.status.toLowerCase(),
      segments: tool.segmentTools.map((st) => st.segment.toLowerCase()),
      phase: tool.segmentTools[0]?.phaseNumber || 1,
      questionsCount: (tool.contentSchema as { sections?: { questions: unknown[] }[] })?.sections?.reduce(
        (acc: number, s: { questions: unknown[] }) => acc + (s.questions?.length || 0),
        0
      ) || 0,
      completionRate: tool._count.toolResults > 0
        ? Math.round((tool._count.toolResults / (tool._count.userProgress || 1)) * 100)
        : 0,
      createdAt: tool.createdAt.toISOString(),
      updatedAt: tool.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      tools: transformedTools,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tools:", error)
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    )
  }
}

// POST /api/admin/tools - Create a new tool
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  try {
    const body = await request.json()
    const validatedData = toolSchema.parse(body)

    // Check for duplicate code
    const existingTool = await prisma.tool.findUnique({
      where: { code: validatedData.code },
    })

    if (existingTool) {
      return NextResponse.json(
        { error: "Tool with this code already exists" },
        { status: 400 }
      )
    }

    // Create the tool
    const tool = await prisma.tool.create({
      data: {
        code: validatedData.code,
        name: validatedData.name,
        shortDescription: validatedData.shortDescription || "",
        longDescription: validatedData.longDescription || "",
        category: validatedData.category.toUpperCase() as "ASSESSMENT" | "WORKBOOK" | "FRAMEWORK" | "REPORT" | "EXERCISE",
        estimatedMinutes: validatedData.estimatedMinutes,
        status: validatedData.status ? statusToPrisma[validatedData.status] : "DRAFT",
        contentSchema: validatedData.contentSchema || {},
        contentData: validatedData.contentData || {},
        scoringLogic: validatedData.scoringLogic || {},
        // Create segment associations
        segmentTools: {
          create: validatedData.segments.map((segment, index) => ({
            segment: segment as "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN",
            phaseNumber: validatedData.phase,
            orderInPhase: index + 1,
          })),
        },
      },
      include: {
        segmentTools: true,
      },
    })

    return NextResponse.json(
      {
        message: "Tool created successfully",
        tool: {
          id: tool.id,
          code: tool.code,
          name: tool.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Error creating tool:", error)
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    )
  }
}
