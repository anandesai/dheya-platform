// Mentor Management Service - CRUD operations for mentors
import { prisma } from "@/lib/prisma"
import { MentorLevel, UserSegment, Prisma } from "@prisma/client"

// ==========================================
// TYPES
// ==========================================

export interface CreateMentorInput {
  userId: string
  level?: MentorLevel
  specializations?: UserSegment[]
  certifications?: string[]
  bio?: string
  yearsExperience?: number
  linkedinUrl?: string
}

export interface UpdateMentorInput extends Partial<Omit<CreateMentorInput, "userId">> {
  isActive?: boolean
}

export interface MentorAvailabilityInput {
  dayOfWeek: number
  startTime: string
  endTime: string
  isRecurring?: boolean
  specificDate?: Date
}

export interface MentorWithDetails {
  id: string
  userId: string
  level: MentorLevel
  specializations: UserSegment[]
  certifications: string[]
  bio: string | null
  yearsExperience: number | null
  totalMentees: number
  rating: number | null
  linkedinUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
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
  _count: {
    bookings: number
  }
}

export interface MentorListItem {
  id: string
  userId: string
  level: MentorLevel
  specializations: UserSegment[]
  bio: string | null
  yearsExperience: number | null
  totalMentees: number
  rating: number | null
  isActive: boolean
  user: {
    firstName: string | null
    lastName: string | null
    email: string
    image: string | null
  }
  _count: {
    bookings: number
  }
}

// ==========================================
// MENTOR SERVICE
// ==========================================

export class MentorService {
  /**
   * Create a new mentor profile
   */
  async createMentor(input: CreateMentorInput): Promise<MentorWithDetails> {
    // First, update the user's role to MENTOR
    await prisma.user.update({
      where: { id: input.userId },
      data: { role: "MENTOR" },
    })

    const mentor = await prisma.mentor.create({
      data: {
        user: { connect: { id: input.userId } },
        level: input.level || MentorLevel.L1,
        specializations: input.specializations || [],
        certifications: input.certifications || [],
        bio: input.bio,
        yearsExperience: input.yearsExperience,
        linkedinUrl: input.linkedinUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        availability: true,
        _count: {
          select: { bookings: true },
        },
      },
    })

    return mentor as unknown as MentorWithDetails
  }

  /**
   * Update a mentor profile
   */
  async updateMentor(id: string, input: UpdateMentorInput): Promise<MentorWithDetails> {
    const mentor = await prisma.mentor.update({
      where: { id },
      data: {
        level: input.level,
        specializations: input.specializations,
        certifications: input.certifications,
        bio: input.bio,
        yearsExperience: input.yearsExperience,
        linkedinUrl: input.linkedinUrl,
        isActive: input.isActive,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        availability: true,
        _count: {
          select: { bookings: true },
        },
      },
    })

    return mentor as unknown as MentorWithDetails
  }

  /**
   * Get mentor by ID
   */
  async getMentorById(id: string): Promise<MentorWithDetails | null> {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        availability: {
          orderBy: { dayOfWeek: "asc" },
        },
        _count: {
          select: { bookings: true },
        },
      },
    })

    return mentor as unknown as MentorWithDetails | null
  }

  /**
   * Get mentor by user ID
   */
  async getMentorByUserId(userId: string): Promise<MentorWithDetails | null> {
    const mentor = await prisma.mentor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        availability: {
          orderBy: { dayOfWeek: "asc" },
        },
        _count: {
          select: { bookings: true },
        },
      },
    })

    return mentor as unknown as MentorWithDetails | null
  }

  /**
   * Get all mentors with optional filtering
   */
  async getMentors(filters?: {
    level?: MentorLevel
    specialization?: UserSegment
    isActive?: boolean
    search?: string
  }): Promise<MentorListItem[]> {
    const where: Prisma.MentorWhereInput = {}

    if (filters?.level) {
      where.level = filters.level
    }

    if (filters?.specialization) {
      where.specializations = {
        has: filters.specialization,
      }
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters?.search) {
      where.OR = [
        {
          user: {
            OR: [
              { firstName: { contains: filters.search, mode: "insensitive" } },
              { lastName: { contains: filters.search, mode: "insensitive" } },
              { email: { contains: filters.search, mode: "insensitive" } },
            ],
          },
        },
        { bio: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    const mentors = await prisma.mentor.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: [{ level: "asc" }, { createdAt: "desc" }],
    })

    return mentors as unknown as MentorListItem[]
  }

  /**
   * Get public mentors for the marketing site
   */
  async getPublicMentors(filters?: {
    specialization?: UserSegment
    level?: MentorLevel
    limit?: number
  }): Promise<MentorListItem[]> {
    const where: Prisma.MentorWhereInput = {
      isActive: true,
    }

    if (filters?.level) {
      where.level = filters.level
    }

    if (filters?.specialization) {
      where.specializations = {
        has: filters.specialization,
      }
    }

    const mentors = await prisma.mentor.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: [{ rating: "desc" }, { totalMentees: "desc" }],
      take: filters?.limit,
    })

    return mentors as unknown as MentorListItem[]
  }

  /**
   * Delete a mentor profile
   */
  async deleteMentor(id: string): Promise<void> {
    // Get the mentor to find the user
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!mentor) {
      throw new Error("Mentor not found")
    }

    // Check if mentor has any bookings
    const bookingCount = await prisma.booking.count({
      where: { mentorId: id },
    })

    if (bookingCount > 0) {
      throw new Error("Cannot delete mentor with existing bookings")
    }

    // Delete mentor and update user role back to USER
    await prisma.$transaction([
      prisma.mentorAvailability.deleteMany({ where: { mentorId: id } }),
      prisma.mentor.delete({ where: { id } }),
      prisma.user.update({
        where: { id: mentor.userId },
        data: { role: "USER" },
      }),
    ])
  }

  /**
   * Set mentor availability
   */
  async setAvailability(
    mentorId: string,
    availability: MentorAvailabilityInput[]
  ): Promise<MentorWithDetails> {
    // Delete existing availability
    await prisma.mentorAvailability.deleteMany({
      where: { mentorId },
    })

    // Create new availability slots
    await prisma.mentorAvailability.createMany({
      data: availability.map((slot) => ({
        mentorId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring ?? true,
        specificDate: slot.specificDate,
      })),
    })

    return this.getMentorById(mentorId) as Promise<MentorWithDetails>
  }

  /**
   * Get mentor statistics
   */
  async getMentorStats(mentorId: string): Promise<{
    totalBookings: number
    completedBookings: number
    upcomingBookings: number
    averageRating: number | null
    totalMentees: number
  }> {
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      select: {
        rating: true,
        totalMentees: true,
      },
    })

    const bookingStats = await prisma.booking.groupBy({
      by: ["status"],
      where: { mentorId },
      _count: true,
    })

    const totalBookings = bookingStats.reduce((acc, curr) => acc + curr._count, 0)
    const completedBookings =
      bookingStats.find((s) => s.status === "COMPLETED")?._count || 0
    const upcomingBookings =
      bookingStats.find((s) => s.status === "SCHEDULED")?._count || 0

    return {
      totalBookings,
      completedBookings,
      upcomingBookings,
      averageRating: mentor?.rating || null,
      totalMentees: mentor?.totalMentees || 0,
    }
  }

  /**
   * Update mentor rating
   */
  async updateRating(mentorId: string, newRating: number): Promise<void> {
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      select: { rating: true, totalMentees: true },
    })

    if (!mentor) {
      throw new Error("Mentor not found")
    }

    // Calculate new average rating
    const currentRating = mentor.rating || 0
    const totalRatings = mentor.totalMentees || 0
    const newAverageRating =
      totalRatings > 0
        ? (currentRating * totalRatings + newRating) / (totalRatings + 1)
        : newRating

    await prisma.mentor.update({
      where: { id: mentorId },
      data: {
        rating: newAverageRating,
        totalMentees: { increment: 1 },
      },
    })
  }

  /**
   * Get eligible users to become mentors
   */
  async getEligibleUsers(): Promise<
    { id: string; email: string; firstName: string | null; lastName: string | null }[]
  > {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        mentor: null, // Not already a mentor
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return users
  }
}

// Export singleton instance
export const mentorService = new MentorService()
