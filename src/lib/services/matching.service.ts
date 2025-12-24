// Mentor Matching Service - Smart mentor-user matching algorithm
import { prisma } from "@/lib/prisma"
import { MentorLevel, UserSegment } from "@prisma/client"

// ==========================================
// TYPES
// ==========================================

export interface MatchedMentor {
  id: string
  userId: string
  level: MentorLevel
  specializations: UserSegment[]
  bio: string | null
  yearsExperience: number | null
  totalMentees: number
  rating: number | null
  isActive: boolean
  matchScore: number
  matchReasons: string[]
  user: {
    firstName: string | null
    lastName: string | null
    email: string
    image: string | null
  }
  availability: {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isRecurring: boolean
    specificDate: Date | null
  }[]
}

interface MatchScoreComponents {
  segmentMatch: number      // 0-40 points
  levelMatch: number         // 0-25 points
  availabilityMatch: number  // 0-20 points
  ratingScore: number        // 0-15 points
}

// ==========================================
// SCORING CONSTANTS
// ==========================================

const SCORING_WEIGHTS = {
  SEGMENT_MATCH: 40,
  LEVEL_MATCH: 25,
  AVAILABILITY: 20,
  RATING: 15,
} as const

const PACKAGE_TIER_TO_MENTOR_LEVEL: Record<string, MentorLevel[]> = {
  GUIDANCE: [MentorLevel.L1, MentorLevel.L2],
  PLANNING: [MentorLevel.L2, MentorLevel.L3],
  MENTORSHIP: [MentorLevel.L3, MentorLevel.L4],
}

// ==========================================
// MATCHING SERVICE
// ==========================================

export class MatchingService {
  /**
   * Match mentors for a specific user based on intelligent scoring algorithm
   */
  async matchMentorsForUser(userId: string): Promise<MatchedMentor[]> {
    // Get user details with their package
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPackages: {
          where: { status: "active" },
          include: {
            package: true,
          },
          orderBy: { purchasedAt: "desc" },
          take: 1,
        },
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Get active package or use default tier
    const activePackage = user.userPackages[0]?.package
    const packageTier = activePackage?.tier || "GUIDANCE"
    const userSegment = user.segment

    // Get all active mentors with their details
    const mentors = await prisma.mentor.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        availability: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    })

    // Score each mentor
    const scoredMentors = mentors.map((mentor) => {
      const scoreComponents = this.calculateMatchScore(
        mentor,
        userSegment,
        packageTier
      )

      const totalScore =
        scoreComponents.segmentMatch +
        scoreComponents.levelMatch +
        scoreComponents.availabilityMatch +
        scoreComponents.ratingScore

      const matchReasons = this.generateMatchReasons(scoreComponents, userSegment)

      return {
        ...mentor,
        matchScore: Math.round(totalScore),
        matchReasons,
      } as MatchedMentor
    })

    // Sort by match score (highest first) and return top 5
    return scoredMentors
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
  }

  /**
   * Calculate match score components for a mentor
   */
  private calculateMatchScore(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mentor: any,
    userSegment: UserSegment | null,
    packageTier: string
  ): MatchScoreComponents {
    // 1. Segment Match (0-40 points)
    let segmentMatch = 0
    if (userSegment && mentor.specializations.includes(userSegment)) {
      segmentMatch = SCORING_WEIGHTS.SEGMENT_MATCH
    } else if (mentor.specializations.length > 0) {
      // Partial credit for having specializations
      segmentMatch = SCORING_WEIGHTS.SEGMENT_MATCH * 0.3
    }

    // 2. Level Match (0-25 points)
    let levelMatch = 0
    const preferredLevels = PACKAGE_TIER_TO_MENTOR_LEVEL[packageTier] || []
    if (preferredLevels.includes(mentor.level)) {
      levelMatch = SCORING_WEIGHTS.LEVEL_MATCH
    } else {
      // Partial credit for adjacent levels
      const levelDistance = Math.abs(
        parseInt(mentor.level.replace("L", "")) -
        parseInt(preferredLevels[0]?.replace("L", "") || "1")
      )
      levelMatch = Math.max(0, SCORING_WEIGHTS.LEVEL_MATCH - levelDistance * 5)
    }

    // 3. Availability Match (0-20 points)
    // More availability slots = higher score
    const availabilityMatch = Math.min(
      SCORING_WEIGHTS.AVAILABILITY,
      (mentor.availability?.length || 0) * 4
    )

    // 4. Rating Score (0-15 points)
    // Rating out of 5, scaled to 15 points
    const ratingScore = mentor.rating
      ? (mentor.rating / 5) * SCORING_WEIGHTS.RATING
      : SCORING_WEIGHTS.RATING * 0.5 // New mentors get 50% credit

    return {
      segmentMatch,
      levelMatch,
      availabilityMatch,
      ratingScore,
    }
  }

  /**
   * Generate human-readable match reasons
   */
  private generateMatchReasons(
    scores: MatchScoreComponents,
    userSegment: UserSegment | null
  ): string[] {
    const reasons: string[] = []

    // Segment match reason
    if (scores.segmentMatch >= SCORING_WEIGHTS.SEGMENT_MATCH * 0.8) {
      const segmentLabels: Record<UserSegment, string> = {
        EARLY_CAREER: "Early Career",
        MID_CAREER: "Mid Career",
        SENIOR: "Senior",
        RETURNING_WOMEN: "Returning Women",
      }
      const label = userSegment ? segmentLabels[userSegment] : "your segment"
      reasons.push(`Specializes in ${label}`)
    }

    // Level match reason
    if (scores.levelMatch >= SCORING_WEIGHTS.LEVEL_MATCH * 0.8) {
      reasons.push("Perfect level match for your package")
    }

    // Availability reason
    if (scores.availabilityMatch >= SCORING_WEIGHTS.AVAILABILITY * 0.6) {
      reasons.push("Excellent availability")
    }

    // Rating reason
    if (scores.ratingScore >= SCORING_WEIGHTS.RATING * 0.8) {
      reasons.push("Highly rated by mentees")
    }

    // Default reason if no specific matches
    if (reasons.length === 0) {
      reasons.push("Experienced mentor available to help")
    }

    return reasons
  }

  /**
   * Get detailed match explanation for a specific mentor-user pair
   */
  async getMatchExplanation(
    userId: string,
    mentorId: string
  ): Promise<{
    matchScore: number
    matchReasons: string[]
    scoreBreakdown: MatchScoreComponents
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPackages: {
          where: { status: "active" },
          include: { package: true },
          orderBy: { purchasedAt: "desc" },
          take: 1,
        },
      },
    })

    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        availability: true,
      },
    })

    if (!user || !mentor) {
      throw new Error("User or mentor not found")
    }

    const packageTier = user.userPackages[0]?.package?.tier || "GUIDANCE"
    const scoreComponents = this.calculateMatchScore(
      mentor,
      user.segment,
      packageTier
    )

    const totalScore =
      scoreComponents.segmentMatch +
      scoreComponents.levelMatch +
      scoreComponents.availabilityMatch +
      scoreComponents.ratingScore

    const matchReasons = this.generateMatchReasons(scoreComponents, user.segment)

    return {
      matchScore: Math.round(totalScore),
      matchReasons,
      scoreBreakdown: scoreComponents,
    }
  }
}

// Export singleton instance
export const matchingService = new MatchingService()
