import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { mentorService } from "@/lib/services/mentor.service"
import { MentorLevel, UserSegment } from "@prisma/client"
import { z } from "zod"

// Validation schema for creating a mentor
const createMentorSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  level: z.enum(["L1", "L2", "L3", "L4"]).optional(),
  specializations: z.array(z.enum(["EARLY_CAREER", "MID_CAREER", "SENIOR", "RETURNING_WOMEN"])).optional(),
  certifications: z.array(z.string()).optional(),
  bio: z.string().optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
})

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

// GET /api/admin/mentors - List all mentors
export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  const { searchParams } = new URL(request.url)
  const level = searchParams.get("level") as MentorLevel | null
  const specialization = searchParams.get("specialization") as UserSegment | null
  const isActive = searchParams.get("isActive")
  const search = searchParams.get("search")
  const eligible = searchParams.get("eligible") === "true"

  try {
    // Return eligible users to become mentors
    if (eligible) {
      const eligibleUsers = await mentorService.getEligibleUsers()
      return NextResponse.json({ users: eligibleUsers })
    }

    const filters = {
      level: level || undefined,
      specialization: specialization || undefined,
      isActive: isActive !== null ? isActive === "true" : undefined,
      search: search || undefined,
    }

    const mentors = await mentorService.getMentors(filters)

    // Transform for frontend
    const transformedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      userId: mentor.userId,
      name: [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ") || mentor.user.email,
      email: mentor.user.email,
      image: mentor.user.image,
      level: mentor.level,
      specializations: mentor.specializations,
      bio: mentor.bio,
      yearsExperience: mentor.yearsExperience,
      totalMentees: mentor.totalMentees,
      rating: mentor.rating,
      isActive: mentor.isActive,
      bookingsCount: mentor._count.bookings,
    }))

    return NextResponse.json({ mentors: transformedMentors })
  } catch (error) {
    console.error("Error fetching mentors:", error)
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 }
    )
  }
}

// POST /api/admin/mentors - Create a new mentor
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess()
  if ("error" in authCheck) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  try {
    const body = await request.json()
    const validatedData = createMentorSchema.parse(body)

    const mentor = await mentorService.createMentor({
      userId: validatedData.userId,
      level: validatedData.level as MentorLevel | undefined,
      specializations: validatedData.specializations as UserSegment[] | undefined,
      certifications: validatedData.certifications,
      bio: validatedData.bio,
      yearsExperience: validatedData.yearsExperience,
      linkedinUrl: validatedData.linkedinUrl || undefined,
    })

    return NextResponse.json(
      {
        message: "Mentor created successfully",
        mentor: {
          id: mentor.id,
          name: [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ") || mentor.user.email,
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

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "This user is already a mentor" },
        { status: 409 }
      )
    }

    console.error("Error creating mentor:", error)
    return NextResponse.json(
      { error: "Failed to create mentor" },
      { status: 500 }
    )
  }
}
