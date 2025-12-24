import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { matchingService } from "@/lib/services/matching.service"

/**
 * GET /api/mentors/match
 * Get matched mentors for the authenticated user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to view matched mentors" },
        { status: 401 }
      )
    }

    // Get matched mentors for the user
    const matchedMentors = await matchingService.matchMentorsForUser(session.user.id)

    return NextResponse.json({
      success: true,
      mentors: matchedMentors,
      count: matchedMentors.length,
    })
  } catch (error) {
    console.error("Error in GET /api/mentors/match:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch matched mentors",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
