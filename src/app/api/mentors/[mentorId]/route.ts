import { NextRequest, NextResponse } from "next/server"
import { mentorService } from "@/lib/services/mentor.service"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// GET /api/mentors/[mentorId] - Public endpoint to get mentor details with reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  const { mentorId } = params

  try {
    // Fetch mentor details using the service
    const mentor = await mentorService.getMentorById(mentorId)

    if (!mentor) {
      return NextResponse.json(
        { error: "Mentor not found" },
        { status: 404 }
      )
    }

    // Check if mentor is active (for public endpoint)
    if (!mentor.isActive) {
      return NextResponse.json(
        { error: "Mentor profile is not available" },
        { status: 404 }
      )
    }

    // Fetch recent reviews/feedback for this mentor
    // Reviews come from completed bookings with feedback (rating is inside feedback JSON)
    const bookingsWithFeedback = await prisma.booking.findMany({
      where: {
        mentorId,
        status: "COMPLETED",
        feedback: { not: Prisma.JsonNull },
      },
      select: {
        id: true,
        feedback: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Get latest 10 reviews
    })

    // Extract reviews from feedback JSON
    interface FeedbackData {
      rating?: number
      comment?: string
    }

    const reviews = bookingsWithFeedback
      .map((booking) => {
        const feedbackData = booking.feedback as FeedbackData | null
        return {
          id: booking.id,
          rating: feedbackData?.rating ?? null,
          comment: feedbackData?.comment ?? null,
          createdAt: booking.createdAt,
          user: booking.user,
        }
      })
      .filter((review) => review.rating !== null)

    // Transform mentor data for public consumption
    const publicMentorProfile = {
      id: mentor.id,
      userId: mentor.userId,
      user: {
        firstName: mentor.user.firstName,
        lastName: mentor.user.lastName,
        image: mentor.user.image,
      },
      level: mentor.level,
      specializations: mentor.specializations,
      certifications: mentor.certifications,
      bio: mentor.bio,
      yearsExperience: mentor.yearsExperience,
      linkedinUrl: mentor.linkedinUrl,
      totalMentees: mentor.totalMentees,
      rating: mentor.rating,
      availability: mentor.availability,
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          firstName: review.user.firstName,
          lastName: review.user.lastName,
        },
      })),
    }

    return NextResponse.json({ mentor: publicMentorProfile })
  } catch (error) {
    console.error("Error fetching mentor profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch mentor profile" },
      { status: 500 }
    )
  }
}
