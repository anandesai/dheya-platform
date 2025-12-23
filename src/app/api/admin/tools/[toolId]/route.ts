import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for updating tools
const updateToolSchema = z.object({
  code: z.string().min(1).max(20).optional(),
  name: z.string().min(1).max(200).optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  category: z.enum(["assessment", "workbook", "framework", "report", "exercise"]).optional(),
  estimatedMinutes: z.number().min(1).max(180).optional(),
  phase: z.number().min(1).max(6).optional(),
  segments: z.array(z.enum(["EARLY_CAREER", "MID_CAREER", "SENIOR", "RETURNING_WOMEN"])).optional(),
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

// GET /api/admin/tools/[toolId] - Get a single tool
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { toolId } = await params

  try {
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
      include: {
        segmentTools: {
          select: {
            segment: true,
            phaseNumber: true,
          },
        },
        packageAccess: {
          include: {
            package: {
              select: {
                id: true,
                packageName: true,
                tier: true,
                segment: true,
              },
            },
          },
        },
        _count: {
          select: {
            userProgress: true,
            toolResults: true,
          },
        },
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Transform data for the frontend
    const transformedTool = {
      id: tool.id,
      code: tool.code,
      name: tool.name,
      shortDescription: tool.shortDescription,
      longDescription: tool.longDescription,
      category: tool.category.toLowerCase(),
      estimatedMinutes: tool.estimatedMinutes,
      status: statusToFrontend[tool.status] || tool.status.toLowerCase(),
      segments: tool.segmentTools.map((st) => st.segment.toLowerCase()),
      phase: tool.segmentTools[0]?.phaseNumber || 1,
      contentSchema: tool.contentSchema,
      contentData: tool.contentData,
      scoringLogic: tool.scoringLogic,
      packageAccess: tool.packageAccess.map((pa) => ({
        packageId: pa.package.id,
        packageName: pa.package.packageName,
        tier: pa.package.tier,
        segment: pa.package.segment,
        accessLevel: pa.accessLevel.toLowerCase(),
      })),
      stats: {
        usersStarted: tool._count.userProgress,
        usersCompleted: tool._count.toolResults,
        completionRate: tool._count.userProgress > 0
          ? Math.round((tool._count.toolResults / tool._count.userProgress) * 100)
          : 0,
      },
      createdAt: tool.createdAt.toISOString(),
      updatedAt: tool.updatedAt.toISOString(),
    }

    return NextResponse.json({ tool: transformedTool })
  } catch (error) {
    console.error("Error fetching tool:", error)
    return NextResponse.json(
      { error: "Failed to fetch tool" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/tools/[toolId] - Update a tool
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { toolId } = await params

  try {
    const body = await request.json()
    const validatedData = updateToolSchema.parse(body)

    // Check if tool exists
    const existingTool = await prisma.tool.findUnique({
      where: { id: toolId },
    })

    if (!existingTool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // If code is being changed, check for duplicates
    if (validatedData.code && validatedData.code !== existingTool.code) {
      const duplicateCode = await prisma.tool.findUnique({
        where: { code: validatedData.code },
      })
      if (duplicateCode) {
        return NextResponse.json(
          { error: "Tool with this code already exists" },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: Record<string, unknown> = {}

    if (validatedData.code) updateData.code = validatedData.code
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.shortDescription !== undefined)
      updateData.shortDescription = validatedData.shortDescription
    if (validatedData.longDescription !== undefined)
      updateData.longDescription = validatedData.longDescription
    if (validatedData.category)
      updateData.category = validatedData.category.toUpperCase()
    if (validatedData.estimatedMinutes)
      updateData.estimatedMinutes = validatedData.estimatedMinutes
    if (validatedData.status)
      updateData.status = statusToPrisma[validatedData.status]
    if (validatedData.contentSchema !== undefined)
      updateData.contentSchema = validatedData.contentSchema
    if (validatedData.contentData !== undefined)
      updateData.contentData = validatedData.contentData
    if (validatedData.scoringLogic !== undefined)
      updateData.scoringLogic = validatedData.scoringLogic

    // Update tool
    const tool = await prisma.tool.update({
      where: { id: toolId },
      data: updateData,
    })

    // Update segment associations if provided
    if (validatedData.segments && validatedData.phase) {
      // Delete existing associations
      await prisma.segmentTool.deleteMany({
        where: { toolId },
      })

      // Create new associations
      await prisma.segmentTool.createMany({
        data: validatedData.segments.map((segment, index) => ({
          toolId,
          segment: segment as "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN",
          phaseNumber: validatedData.phase!,
          orderInPhase: index + 1,
        })),
      })
    }

    return NextResponse.json({
      message: "Tool updated successfully",
      tool: {
        id: tool.id,
        code: tool.code,
        name: tool.name,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Error updating tool:", error)
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tools/[toolId] - Delete a tool
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { toolId } = await params

  try {
    // Check if tool exists
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
      include: {
        _count: {
          select: {
            userProgress: true,
            toolResults: true,
          },
        },
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Prevent deletion if tool has user data
    if (tool._count.userProgress > 0 || tool._count.toolResults > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete tool with existing user data. Archive it instead.",
          hasUserData: true,
          userProgress: tool._count.userProgress,
          toolResults: tool._count.toolResults,
        },
        { status: 400 }
      )
    }

    // Delete related records first (if no user data)
    await prisma.segmentTool.deleteMany({ where: { toolId } })
    await prisma.packageToolAccess.deleteMany({ where: { toolId } })

    // Delete the tool
    await prisma.tool.delete({ where: { id: toolId } })

    return NextResponse.json({
      message: "Tool deleted successfully",
      deletedId: toolId,
    })
  } catch (error) {
    console.error("Error deleting tool:", error)
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/tools/[toolId] - Quick status update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { toolId } = await params

  try {
    const body = await request.json()
    const { status } = body

    // Map frontend status to Prisma enum (active -> PUBLISHED)
    const statusMap: Record<string, "DRAFT" | "PUBLISHED" | "ARCHIVED"> = {
      draft: "DRAFT",
      active: "PUBLISHED",
      published: "PUBLISHED",
      archived: "ARCHIVED",
    }

    if (!status || !statusMap[status.toLowerCase()]) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
    }

    const tool = await prisma.tool.update({
      where: { id: toolId },
      data: { status: statusMap[status.toLowerCase()] },
    })

    // Map back to frontend-friendly status
    const reverseStatusMap: Record<string, string> = {
      DRAFT: "draft",
      PUBLISHED: "active",
      ARCHIVED: "archived",
    }

    return NextResponse.json({
      message: "Tool status updated successfully",
      tool: {
        id: tool.id,
        status: reverseStatusMap[tool.status] || tool.status.toLowerCase(),
      },
    })
  } catch (error) {
    console.error("Error updating tool status:", error)
    return NextResponse.json(
      { error: "Failed to update tool status" },
      { status: 500 }
    )
  }
}
