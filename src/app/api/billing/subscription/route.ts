/**
 * API Route: GET /api/billing/subscription
 * Get current subscription details for authenticated user
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserSubscription, getUsageStats } from "@/lib/services/subscription.service"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const subscription = await getUserSubscription(session.user.id)
    const usageStats = await getUsageStats(session.user.id)

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      subscription,
      usage: usageStats,
    })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    )
  }
}
