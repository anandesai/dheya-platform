import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bookingService } from "@/lib/services/booking.service"
import { z } from "zod"

// Type for booking with mentor included
interface BookingWithMentor {
  id: string
  scheduledAt: Date
  duration: number
  status: string
  notes: string | null
  feedback: unknown
  mentor: {
    id: string
    level: string
    user: {
      firstName: string | null
      lastName: string | null
      email: string
      image: string | null
    }
  }
}

// Validation schema for creating a booking
const createBookingSchema = z.object({
  mentorId: z.string().min(1, "Mentor ID is required"),
  scheduledAt: z.string().datetime("Invalid date format"),
  duration: z.number().min(30).max(120).optional(),
  notes: z.string().optional(),
  packageId: z.string().min(1, "Package ID is required"),
})

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // upcoming, past, all

  try {
    let bookings

    if (type === "upcoming") {
      bookings = await bookingService.getUserUpcomingBookings(session.user.id)
    } else if (type === "past") {
      bookings = await bookingService.getUserPastBookings(session.user.id)
    } else {
      bookings = await bookingService.getBookings({ userId: session.user.id })
    }

    // Transform for frontend - cast to include mentor relation
    const transformedBookings = (bookings as unknown as BookingWithMentor[]).map((booking) => {
      const feedbackData = booking.feedback as { rating?: number; comment?: string } | null
      return {
        id: booking.id,
        scheduledAt: booking.scheduledAt,
        duration: booking.duration,
        status: booking.status,
        notes: booking.notes,
        feedback: feedbackData?.comment || null,
        rating: feedbackData?.rating || null,
        mentor: {
          id: booking.mentor.id,
          name: [booking.mentor.user.firstName, booking.mentor.user.lastName]
            .filter(Boolean)
            .join(" ") || booking.mentor.user.email,
          image: booking.mentor.user.image,
          level: booking.mentor.level,
        },
      }
    })

    return NextResponse.json({ bookings: transformedBookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)

    const booking = await bookingService.createBooking({
      userId: session.user.id,
      mentorId: validatedData.mentorId,
      scheduledAt: new Date(validatedData.scheduledAt),
      duration: validatedData.duration,
      notes: validatedData.notes,
      packageId: validatedData.packageId,
    }) as unknown as BookingWithMentor

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking: {
          id: booking.id,
          scheduledAt: booking.scheduledAt,
          status: booking.status,
          mentor: {
            name: [booking.mentor.user.firstName, booking.mentor.user.lastName]
              .filter(Boolean)
              .join(" "),
          },
        },
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

    if (error instanceof Error) {
      if (error.message.includes("not available")) {
        return NextResponse.json(
          { error: "Mentor is not available at this time" },
          { status: 409 }
        )
      }
      if (error.message.includes("No remaining sessions")) {
        return NextResponse.json(
          { error: "No remaining sessions in your package" },
          { status: 403 }
        )
      }
    }

    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
