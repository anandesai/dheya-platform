import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { mentorService } from "@/lib/services/mentor.service"
import { MentorLevel, UserSegment } from "@prisma/client"
import { z } from "zod"

// Validation schema for updating a mentor
const updateMentorSchema = z.object({
  level: z.enum(["L1", "L2", "L3", "L4"]).optional(),
  specializations: z.array(z.enum(["EARLY_CAREER", "MID_CAREER", "SENIOR", "RETURNING_WOMEN"])).optional(),
  certifications: z.array(z.string()).optional(),
  bio: z.string().optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
})

// Validation schema for availability
const availabilitySchema = z.array(z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isRecurring: z.boolean().optional(),
  specificDate: z.string().datetime().optional(),
}))

// Helper to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 }
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { error: "Forbidden - Admin access required", status: 403 }
  }
  return { user: session.user }
}

// GET /api/admin/mentors/[mentorId] - Get a single mentor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { mentorId } = await params

  try {
    const mentor = await mentorService.getMentorById(mentorId)

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
    }

    const stats = await mentorService.getMentorStats(mentorId)

    // Transform for frontend
    const transformedMentor = {
      id: mentor.id,
      userId: mentor.userId,
      name: [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ") || mentor.user.email,
      email: mentor.user.email,
      image: mentor.user.image,
      level: mentor.level,
      specializations: mentor.specializations,
      certifications: mentor.certifications,
      bio: mentor.bio,
      yearsExperience: mentor.yearsExperience,
      linkedinUrl: mentor.linkedinUrl,
      totalMentees: mentor.totalMentees,
      rating: mentor.rating,
      isActive: mentor.isActive,
      createdAt: mentor.createdAt,
      updatedAt: mentor.updatedAt,
      availability: mentor.availability.map((slot) => ({
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring,
        specificDate: slot.specificDate,
      })),
      stats,
    }

    return NextResponse.json({ mentor: transformedMentor })
  } catch (error) {
    console.error("Error fetching mentor:", error)
    return NextResponse.json(
      { error: "Failed to fetch mentor" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/mentors/[mentorId] - Update a mentor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { mentorId } = await params

  try {
    const body = await request.json()
    const validatedData = updateMentorSchema.parse(body)

    // Check if mentor exists
    const existingMentor = await mentorService.getMentorById(mentorId)
    if (!existingMentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
    }

    const mentor = await mentorService.updateMentor(mentorId, {
      level: validatedData.level as MentorLevel | undefined,
      specializations: validatedData.specializations as UserSegment[] | undefined,
      certifications: validatedData.certifications,
      bio: validatedData.bio,
      yearsExperience: validatedData.yearsExperience,
      linkedinUrl: validatedData.linkedinUrl || undefined,
      isActive: validatedData.isActive,
    })

    return NextResponse.json({
      message: "Mentor updated successfully",
      mentor: {
        id: mentor.id,
        name: [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ") || mentor.user.email,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Error updating mentor:", error)
    return NextResponse.json(
      { error: "Failed to update mentor" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/mentors/[mentorId] - Delete a mentor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { mentorId } = await params

  try {
    await mentorService.deleteMentor(mentorId)

    return NextResponse.json({
      message: "Mentor deleted successfully",
      deletedId: mentorId,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
      }
      if (error.message.includes("existing bookings")) {
        return NextResponse.json(
          { error: "Cannot delete mentor with existing bookings" },
          { status: 400 }
        )
      }
    }
    console.error("Error deleting mentor:", error)
    return NextResponse.json(
      { error: "Failed to delete mentor" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/mentors/[mentorId] - Quick status update or set availability
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { mentorId } = await params

  try {
    const body = await request.json()

    // Handle availability update
    if (body.availability) {
      const validatedAvailability = availabilitySchema.parse(body.availability)
      const mentor = await mentorService.setAvailability(mentorId, validatedAvailability.map(slot => ({
        ...slot,
        specificDate: slot.specificDate ? new Date(slot.specificDate) : undefined,
      })))

      return NextResponse.json({
        message: "Availability updated successfully",
        availability: mentor.availability,
      })
    }

    // Handle status update
    if (typeof body.isActive === "boolean") {
      const mentor = await mentorService.updateMentor(mentorId, {
        isActive: body.isActive,
      })

      return NextResponse.json({
        message: `Mentor ${body.isActive ? "activated" : "deactivated"} successfully`,
        mentor: {
          id: mentor.id,
          isActive: mentor.isActive,
        },
      })
    }

    return NextResponse.json(
      { error: "No valid update data provided" },
      { status: 400 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Error updating mentor:", error)
    return NextResponse.json(
      { error: "Failed to update mentor" },
      { status: 500 }
    )
  }
}
