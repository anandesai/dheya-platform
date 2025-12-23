import { prisma } from "@/lib/prisma"
import { BookingStatus } from "@prisma/client"

interface CreateBookingInput {
  userId: string
  mentorId: string
  packageId: string
  scheduledAt: Date
  duration?: number
  notes?: string
  sessionNumber?: number
}

interface UpdateBookingInput {
  status?: BookingStatus
  scheduledAt?: Date
  notes?: string
  feedback?: { rating: number; comment: string }
}

interface BookingFilters {
  userId?: string
  mentorId?: string
  status?: BookingStatus
  fromDate?: Date
  toDate?: Date
}

export const bookingService = {
  // Create a new booking
  async createBooking(input: CreateBookingInput) {
    const { userId, mentorId, packageId, scheduledAt, duration = 60, notes } = input

    // Check if mentor is available at this time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        mentorId,
        scheduledAt: {
          gte: new Date(scheduledAt.getTime() - duration * 60 * 1000),
          lte: new Date(scheduledAt.getTime() + duration * 60 * 1000),
        },
        status: {
          in: ["SCHEDULED"],
        },
      },
    })

    if (existingBooking) {
      throw new Error("Mentor is not available at this time")
    }

    // Check user's package for remaining sessions
    const userPackage = await prisma.userPackage.findFirst({
      where: {
        userId,
        packageId,
        status: "ACTIVE",
      },
      include: {
        package: true,
      },
    })

    if (!userPackage) {
      throw new Error("No active package found")
    }

    // Check remaining sessions
    const usedSessions = await prisma.booking.count({
      where: {
        userId,
        packageId,
        status: {
          in: ["COMPLETED", "SCHEDULED"],
        },
      },
    })

    if (usedSessions >= (userPackage.package.totalSessions || 0)) {
      throw new Error("No remaining sessions in package")
    }

    const sessionNumber = usedSessions + 1

    const booking = await prisma.booking.create({
      data: {
        userId,
        mentorId,
        packageId,
        scheduledAt,
        duration,
        notes,
        sessionNumber,
        status: "SCHEDULED",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        mentor: {
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
          },
        },
      },
    })

    return booking
  },

  // Get booking by ID
  async getBookingById(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
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
        mentor: {
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
          },
        },
        package: true,
      },
    })
  },

  // Get bookings with filters
  async getBookings(filters: BookingFilters) {
    const { userId, mentorId, status, fromDate, toDate } = filters

    const where: {
      userId?: string
      mentorId?: string
      status?: BookingStatus
      scheduledAt?: { gte?: Date; lte?: Date }
    } = {}

    if (userId) where.userId = userId
    if (mentorId) where.mentorId = mentorId
    if (status) where.status = status
    if (fromDate || toDate) {
      where.scheduledAt = {}
      if (fromDate) where.scheduledAt.gte = fromDate
      if (toDate) where.scheduledAt.lte = toDate
    }

    return prisma.booking.findMany({
      where,
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
        mentor: {
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
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    })
  },

  // Get user's upcoming bookings
  async getUserUpcomingBookings(userId: string) {
    return prisma.booking.findMany({
      where: {
        userId,
        scheduledAt: {
          gte: new Date(),
        },
        status: {
          in: ["SCHEDULED"],
        },
      },
      include: {
        mentor: {
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
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    })
  },

  // Get user's past bookings
  async getUserPastBookings(userId: string) {
    return prisma.booking.findMany({
      where: {
        userId,
        OR: [
          { scheduledAt: { lt: new Date() } },
          { status: { in: ["COMPLETED", "CANCELLED", "NO_SHOW"] } },
        ],
      },
      include: {
        mentor: {
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
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    })
  },

  // Update booking
  async updateBooking(bookingId: string, input: UpdateBookingInput) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: input.status,
        scheduledAt: input.scheduledAt,
        notes: input.notes,
        feedback: input.feedback,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    // Update mentor rating if feedback provided
    if (input.feedback?.rating) {
      await this.updateMentorRating(booking.mentorId)
    }

    return booking
  },

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string) {
    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        notes: reason ? `Cancelled: ${reason}` : undefined,
      },
    })
  },

  // Complete booking
  async completeBooking(bookingId: string) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED",
      },
      include: {
        mentor: true,
      },
    })

    // Update mentor's total mentees if this is first completed session with user
    const previousSessions = await prisma.booking.count({
      where: {
        mentorId: booking.mentorId,
        userId: booking.userId,
        status: "COMPLETED",
        id: { not: bookingId },
      },
    })

    if (previousSessions === 0) {
      await prisma.mentor.update({
        where: { id: booking.mentorId },
        data: {
          totalMentees: { increment: 1 },
        },
      })
    }

    return booking
  },

  // Get available slots for a mentor
  async getMentorAvailableSlots(mentorId: string, date: Date) {
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        availability: true,
      },
    })

    if (!mentor) {
      throw new Error("Mentor not found")
    }

    const dayOfWeek = date.getDay()
    const availabilityForDay = mentor.availability.filter(
      (slot) => slot.dayOfWeek === dayOfWeek
    )

    // Get existing bookings for this day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const existingBookings = await prisma.booking.findMany({
      where: {
        mentorId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["SCHEDULED"],
        },
      },
    })

    // Generate available slots (1-hour slots)
    const slots: { time: string; available: boolean }[] = []

    availabilityForDay.forEach((availability) => {
      const [startHour] = availability.startTime.split(":").map(Number)
      const [endHour] = availability.endTime.split(":").map(Number)

      for (let hour = startHour; hour < endHour; hour++) {
        const slotTime = new Date(date)
        slotTime.setHours(hour, 0, 0, 0)

        const isBooked = existingBookings.some((booking) => {
          const bookingHour = new Date(booking.scheduledAt).getHours()
          return bookingHour === hour
        })

        const isPast = slotTime < new Date()

        slots.push({
          time: `${hour.toString().padStart(2, "0")}:00`,
          available: !isBooked && !isPast,
        })
      }
    })

    return slots
  },

  // Update mentor rating based on all completed bookings with feedback
  async updateMentorRating(mentorId: string) {
    const allBookings = await prisma.booking.findMany({
      where: {
        mentorId,
        status: "COMPLETED",
      },
      select: {
        feedback: true,
      },
    })

    // Filter bookings with feedback in JavaScript
    const ratings = allBookings
      .map((b) => {
        const feedback = b.feedback as { rating?: number } | null
        return feedback?.rating
      })
      .filter((r): r is number => typeof r === "number")

    if (ratings.length > 0) {
      const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length
      await prisma.mentor.update({
        where: { id: mentorId },
        data: {
          rating: avgRating,
        },
      })
    }
  },

  // Get booking stats for a user
  async getUserBookingStats(userId: string) {
    const [total, upcoming, completed, cancelled] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.booking.count({
        where: {
          userId,
          status: "SCHEDULED",
          scheduledAt: { gte: new Date() },
        },
      }),
      prisma.booking.count({ where: { userId, status: "COMPLETED" } }),
      prisma.booking.count({ where: { userId, status: "CANCELLED" } }),
    ])

    return { total, upcoming, completed, cancelled }
  },

  // Get booking stats for admin
  async getAdminBookingStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    const [
      totalBookings,
      thisMonthBookings,
      thisWeekBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.booking.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.booking.count({
        where: {
          status: "SCHEDULED",
          scheduledAt: { gte: now },
        },
      }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ])

    return {
      totalBookings,
      thisMonthBookings,
      thisWeekBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      completionRate: totalBookings > 0
        ? Math.round((completedBookings / totalBookings) * 100)
        : 0,
    }
  },
}
