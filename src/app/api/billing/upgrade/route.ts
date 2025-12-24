/**
 * API Route: POST /api/billing/upgrade
 * Handle subscription upgrade requests
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { upgradeSubscription, getUserSubscription } from "@/lib/services/subscription.service"
import { z } from "zod"

const upgradeSchema = z.object({
  newPackageId: z.string().min(1, "Package ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = upgradeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { newPackageId } = validation.data

    // Verify user has an active subscription
    const currentSubscription = await getUserSubscription(session.user.id)

    if (!currentSubscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    if (!currentSubscription.canUpgrade) {
      return NextResponse.json(
        { error: "Your current plan cannot be upgraded" },
        { status: 400 }
      )
    }

    // Process upgrade
    const result = await upgradeSubscription(session.user.id, newPackageId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to upgrade subscription" },
        { status: 400 }
      )
    }

    // Get updated subscription
    const updatedSubscription = await getUserSubscription(session.user.id)

    return NextResponse.json({
      success: true,
      message: "Subscription upgraded successfully",
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    return NextResponse.json(
      { error: "Failed to process upgrade request" },
      { status: 500 }
    )
  }
}

/**
 * API Route: GET /api/billing/upgrade
 * Get available upgrade options for current user
 */
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

    const currentSubscription = await getUserSubscription(session.user.id)

    if (!currentSubscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    // Import getUpgradeOptions
    const { getUpgradeOptions } = await import("@/lib/services/subscription.service")
    const upgradeOptions = await getUpgradeOptions(session.user.id)

    return NextResponse.json({
      currentSubscription,
      upgradeOptions,
      canUpgrade: currentSubscription.canUpgrade,
    })
  } catch (error) {
    console.error("Error fetching upgrade options:", error)
    return NextResponse.json(
      { error: "Failed to fetch upgrade options" },
      { status: 500 }
    )
  }
}
