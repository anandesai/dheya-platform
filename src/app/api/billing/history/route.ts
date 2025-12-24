/**
 * API Route: GET /api/billing/history
 * Get billing history for authenticated user
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getBillingHistory } from "@/lib/services/subscription.service"

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

    const history = await getBillingHistory(session.user.id)

    return NextResponse.json({
      transactions: history,
      count: history.length,
    })
  } catch (error) {
    console.error("Error fetching billing history:", error)
    return NextResponse.json(
      { error: "Failed to fetch billing history" },
      { status: 500 }
    )
  }
}
