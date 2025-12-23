import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { analyticsService } from "@/lib/services/analytics.service"

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

// GET /api/admin/analytics - Get admin dashboard analytics
export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "dashboard"

  try {
    switch (type) {
      case "dashboard":
        const dashboardData = await analyticsService.getAdminAnalytics()
        return NextResponse.json(dashboardData)

      case "users":
        const segment = searchParams.get("segment") || undefined
        const fromDate = searchParams.get("fromDate")
          ? new Date(searchParams.get("fromDate")!)
          : undefined
        const toDate = searchParams.get("toDate")
          ? new Date(searchParams.get("toDate")!)
          : undefined
        const userData = await analyticsService.getUserAnalytics({
          segment,
          fromDate,
          toDate,
        })
        return NextResponse.json({ users: userData })

      case "tools":
        const toolData = await analyticsService.getToolAnalytics()
        return NextResponse.json({ tools: toolData })

      case "mentors":
        const mentorData = await analyticsService.getMentorAnalytics()
        return NextResponse.json({ mentors: mentorData })

      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
