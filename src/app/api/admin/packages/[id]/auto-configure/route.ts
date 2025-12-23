// Auto-Configure Tool Access API Route
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { packageService } from "@/lib/services/package.service"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/admin/packages/[id]/auto-configure - Auto-configure tool access
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const enableTeaserMode = body.enableTeaserMode !== false // Default to true

    const pkg = await packageService.autoConfigureToolAccess(id, enableTeaserMode)
    return NextResponse.json(pkg)
  } catch (error) {
    console.error("Error auto-configuring tool access:", error)

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Failed to auto-configure tool access" },
      { status: 500 }
    )
  }
}
