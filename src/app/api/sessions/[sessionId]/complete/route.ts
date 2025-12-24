import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bookingService } from "@/lib/services/booking.service"

/**
 * POST /api/sessions/[sessionId]/complete
 * Mark a session as completed
 */
export async function POST(
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

    // Complete the booking
    const completedBooking = await bookingService.completeBooking(sessionId)

    return NextResponse.json({
      success: true,
      booking: {
        id: completedBooking.id,
        status: completedBooking.status,
      },
    })
  } catch (error) {
    console.error("Error completing session:", error)
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    )
  }
}
