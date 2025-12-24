import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bookingService } from "@/lib/services/booking.service"
import { z } from "zod"

const updateNotesSchema = z.object({
  notes: z.string(),
})

// GET /api/sessions/[sessionId]/notes - Fetch session notes
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
      notes: booking.notes,
      updatedAt: booking.updatedAt,
    })
  } catch (error) {
    console.error("Error fetching session notes:", error)
    return NextResponse.json(
      { error: "Failed to fetch session notes" },
      { status: 500 }
    )
  }
}

// PUT /api/sessions/[sessionId]/notes - Update session notes
export async function PUT(
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
    const validatedData = updateNotesSchema.parse(body)

    // First check if booking exists and user has access
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

    // Update the notes
    const updatedBooking = await bookingService.updateBooking(sessionId, {
      notes: validatedData.notes,
    })

    return NextResponse.json({
      message: "Notes updated successfully",
      notes: updatedBooking.notes,
      updatedAt: updatedBooking.updatedAt,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating session notes:", error)
    return NextResponse.json(
      { error: "Failed to update session notes" },
      { status: 500 }
    )
  }
}
