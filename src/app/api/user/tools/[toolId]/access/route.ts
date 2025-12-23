// Tool Access Check API Route
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { accessControlService } from "@/lib/services/access-control.service"

interface RouteParams {
  params: Promise<{ toolId: string }>
}

// GET /api/user/tools/[toolId]/access - Check access to a specific tool
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const { toolId } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessResult = await accessControlService.checkToolAccess(
      session.user.id,
      toolId
    )

    return NextResponse.json(accessResult)
  } catch (error) {
    console.error("Error checking tool access:", error)
    return NextResponse.json(
      { error: "Failed to check tool access" },
      { status: 500 }
    )
  }
}
