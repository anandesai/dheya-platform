import { NextRequest, NextResponse } from "next/server"
import { mentorService } from "@/lib/services/mentor.service"
import { MentorLevel, UserSegment } from "@prisma/client"

// GET /api/mentors - Public endpoint to list active mentors
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get("level") as MentorLevel | null
  const specialization = searchParams.get("specialization") as UserSegment | null

  try {
    const mentors = await mentorService.getPublicMentors({
      level: level || undefined,
      specialization: specialization || undefined,
    })

    // Transform for public consumption (no sensitive data)
    const publicMentors = mentors.map((mentor) => ({
      id: mentor.id,
      name:
        [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ") ||
        "Anonymous Mentor",
      image: mentor.user.image,
      level: mentor.level,
      specializations: mentor.specializations,
      bio: mentor.bio,
      yearsExperience: mentor.yearsExperience,
      rating: mentor.rating,
      totalMentees: mentor.totalMentees,
    }))

    return NextResponse.json({ mentors: publicMentors })
  } catch (error) {
    console.error("Error fetching public mentors:", error)
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 }
    )
  }
}
