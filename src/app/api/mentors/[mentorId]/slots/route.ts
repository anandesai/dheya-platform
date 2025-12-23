import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bookingService } from "@/lib/services/booking.service"

// GET /api/mentors/[mentorId]/slots - Get available slots for a mentor on a date
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { mentorId } = await params
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get("date")

  if (!dateStr) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 }
    )
  }

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      )
    }

    const slots = await bookingService.getMentorAvailableSlots(mentorId, date)

    return NextResponse.json({ slots })
  } catch (error) {
    if (error instanceof Error && error.message === "Mentor not found") {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
    }

    console.error("Error fetching slots:", error)
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    )
  }
}
