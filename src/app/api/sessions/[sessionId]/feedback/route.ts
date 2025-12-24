import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bookingService } from "@/lib/services/booking.service"
import { z } from "zod"

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  helpful: z.number().min(1).max(5),
  goalsAchieved: z.enum(["yes", "no", "partially"]),
  wouldRecommend: z.enum(["yes", "no"]),
  comment: z.string().optional(),
})

// POST /api/sessions/[sessionId]/feedback - Submit session feedback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { sessionId } = await params
    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    // First check if booking exists and user has access
    const booking = await bookingService.getBookingById(sessionId)

    if (!booking) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Only the session attendee can provide feedback
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - Only session attendees can provide feedback" },
        { status: 403 }
      )
    }

    // Check if session is completed
    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Feedback can only be submitted for completed sessions" },
        { status: 400 }
      )
    }

    // Check if feedback already exists
    const existingFeedback = booking.feedback as { rating?: number } | null
    if (existingFeedback?.rating) {
      return NextResponse.json(
        { error: "Feedback has already been submitted for this session" },
        { status: 409 }
      )
    }

    // Prepare feedback data
    const feedbackData = {
      rating: validatedData.rating,
      helpful: validatedData.helpful,
      goalsAchieved: validatedData.goalsAchieved,
      wouldRecommend: validatedData.wouldRecommend,
      comment: validatedData.comment || "",
      submittedAt: new Date().toISOString(),
    }

    // Update the booking with feedback
    // This will also trigger mentor rating update via bookingService
    await bookingService.updateBooking(sessionId, {
      feedback: feedbackData,
    })

    return NextResponse.json(
      {
        message: "Feedback submitted successfully",
        feedback: feedbackData,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error submitting feedback:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}

// GET /api/sessions/[sessionId]/feedback - Get session feedback
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { sessionId } = await params
    const booking = await bookingService.getBookingById(sessionId)

    if (!booking) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Verify user has access to this session
    if (booking.userId !== session.user.id && booking.mentor.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You don't have access to this session" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      feedback: booking.feedback,
      hasFeedback: !!booking.feedback,
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}
