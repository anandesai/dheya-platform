import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bookingService } from "@/lib/services/booking.service"
import { z } from "zod"

// Validation schema for updating session
const updateSessionSchema = z.object({
  notes: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  feedback: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
})

// GET /api/sessions/[sessionId] - Get session details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { sessionId } = await params

  try {
    const booking = await bookingService.getBookingById(sessionId)

    if (!booking) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Check if user has access to this session
    const isOwner = booking.userId === session.user.id
    const isMentor = booking.mentor?.user?.id === session.user.id
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (!isOwner && !isMentor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Extract rating and feedback from JSON
    const feedbackData = booking.feedback as { rating?: number; comment?: string } | null

    // Transform data for frontend
    const sessionData = {
      id: booking.id,
      scheduledAt: booking.scheduledAt.toISOString(),
      duration: booking.duration,
      status: booking.status,
      notes: booking.notes,
      feedback: feedbackData?.comment || null,
      rating: feedbackData?.rating || null,
      createdAt: booking.createdAt.toISOString(),
      user: {
        id: booking.user.id,
        name: [booking.user.firstName, booking.user.lastName]
          .filter(Boolean)
          .join(" ") || booking.user.email,
        email: booking.user.email,
        image: booking.user.image,
      },
      mentor: booking.mentor ? {
        id: booking.mentor.id,
        name: [booking.mentor.user.firstName, booking.mentor.user.lastName]
          .filter(Boolean)
          .join(" ") || booking.mentor.user.email,
        email: booking.mentor.user.email,
        image: booking.mentor.user.image,
        level: booking.mentor.level,
      } : null,
      package: booking.package ? {
        id: booking.package.id,
        name: booking.package.fullName,
      } : null,
    }

    return NextResponse.json({ session: sessionData })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

// PATCH /api/sessions/[sessionId] - Update session (notes, reschedule)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { sessionId } = await params

  try {
    const booking = await bookingService.getBookingById(sessionId)

    if (!booking) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Check if user has access to update this session
    const isOwner = booking.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateSessionSchema.parse(body)

    // Build the update data
    const updateData: {
      notes?: string
      scheduledAt?: Date
      feedback?: { rating: number; comment: string }
    } = {}

    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }

    if (validatedData.scheduledAt) {
      // Check if session can be rescheduled
      if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
        return NextResponse.json(
          { error: "Cannot reschedule a completed or cancelled session" },
          { status: 400 }
        )
      }
      updateData.scheduledAt = new Date(validatedData.scheduledAt)
    }

    if (validatedData.rating || validatedData.feedback) {
      updateData.feedback = {
        rating: validatedData.rating || 0,
        comment: validatedData.feedback || "",
      }
    }

    const updatedBooking = await bookingService.updateBooking(sessionId, updateData)

    return NextResponse.json({
      message: "Session updated successfully",
      session: {
        id: updatedBooking.id,
        scheduledAt: updatedBooking.scheduledAt,
        status: updatedBooking.status,
        notes: updatedBooking.notes,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating session:", error)
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    )
  }
}

// DELETE /api/sessions/[sessionId] - Cancel session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { sessionId } = await params

  try {
    const booking = await bookingService.getBookingById(sessionId)

    if (!booking) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Check if user has access to cancel this session
    const isOwner = booking.userId === session.user.id
    const isMentor = booking.mentor?.user?.id === session.user.id
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (!isOwner && !isMentor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if session can be cancelled
    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot cancel a completed session" },
        { status: 400 }
      )
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Session is already cancelled" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reason = searchParams.get("reason")

    await bookingService.cancelBooking(sessionId, reason || undefined)

    return NextResponse.json({
      message: "Session cancelled successfully",
      sessionId
    })
  } catch (error) {
    console.error("Error cancelling session:", error)
    return NextResponse.json(
      { error: "Failed to cancel session" },
      { status: 500 }
    )
  }
}
