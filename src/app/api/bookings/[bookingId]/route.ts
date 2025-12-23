import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bookingService } from "@/lib/services/booking.service"
import { z } from "zod"

// Validation schema for updating a booking
const updateBookingSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  feedback: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
})

// GET /api/bookings/[bookingId] - Get booking details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bookingId } = await params

  try {
    const booking = await bookingService.getBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if user has access to this booking
    const isOwner = booking.userId === session.user.id
    const isMentor = booking.mentor?.user?.id === session.user.id
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (!isOwner && !isMentor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Extract rating from feedback JSON
    const feedbackData = booking.feedback as { rating?: number; comment?: string } | null

    return NextResponse.json({
      booking: {
        id: booking.id,
        scheduledAt: booking.scheduledAt,
        duration: booking.duration,
        status: booking.status,
        notes: booking.notes,
        feedback: feedbackData?.comment || null,
        rating: feedbackData?.rating || null,
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
        package: booking.package
          ? {
              id: booking.package.id,
              name: booking.package.fullName,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[bookingId] - Update booking (reschedule, add feedback)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bookingId } = await params

  try {
    const booking = await bookingService.getBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if user has access to update this booking
    const isOwner = booking.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    // Build the update data - feedback is stored as JSON object
    const updateData: {
      scheduledAt?: Date
      notes?: string
      feedback?: { rating: number; comment: string }
    } = {}

    if (validatedData.scheduledAt) {
      updateData.scheduledAt = new Date(validatedData.scheduledAt)
    }
    if (validatedData.notes) {
      updateData.notes = validatedData.notes
    }
    if (validatedData.rating || validatedData.feedback) {
      updateData.feedback = {
        rating: validatedData.rating || 0,
        comment: validatedData.feedback || "",
      }
    }

    const updatedBooking = await bookingService.updateBooking(bookingId, updateData)

    return NextResponse.json({
      message: "Booking updated successfully",
      booking: {
        id: updatedBooking.id,
        scheduledAt: updatedBooking.scheduledAt,
        status: updatedBooking.status,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating booking:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[bookingId] - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bookingId } = await params

  try {
    const booking = await bookingService.getBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if user has access to cancel this booking
    const isOwner = booking.userId === session.user.id
    const isMentor = booking.mentor?.user?.id === session.user.id
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (!isOwner && !isMentor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if booking can be cancelled
    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot cancel a completed booking" },
        { status: 400 }
      )
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reason = searchParams.get("reason")

    await bookingService.cancelBooking(bookingId, reason || undefined)

    return NextResponse.json({ message: "Booking cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    )
  }
}
