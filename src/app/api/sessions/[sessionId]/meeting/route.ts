import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { meetingService } from "@/lib/services/meeting.service"
import { bookingService } from "@/lib/services/booking.service"

/**
 * GET /api/sessions/[sessionId]/meeting
 * Get meeting details for a session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params

    // Get booking details
    const booking = await bookingService.getBookingById(sessionId)

    if (!booking) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Verify user has access to this session
    const userId = session.user.id
    const isMentor = booking.mentor.userId === userId
    const isUser = booking.userId === userId

    if (!isMentor && !isUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get or create meeting URL
    const meetingUrl = await meetingService.getOrCreateMeetingUrl(sessionId)

    // Return meeting details
    return NextResponse.json({
      booking: {
        id: booking.id,
        sessionNumber: booking.sessionNumber,
        scheduledAt: booking.scheduledAt.toISOString(),
        duration: booking.duration,
        notes: booking.notes,
        status: booking.status,
        meetingUrl,
      },
      user: {
        name: `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim() || "User",
        email: booking.user.email,
      },
      mentor: {
        name:
          `${booking.mentor.user.firstName || ""} ${booking.mentor.user.lastName || ""}`.trim() ||
          "Mentor",
        email: booking.mentor.user.email,
      },
      package: {
        name: booking.package.productName,
      },
    })
  } catch (error) {
    console.error("Error fetching meeting details:", error)
    return NextResponse.json(
      { error: "Failed to fetch meeting details" },
      { status: 500 }
    )
  }
}
