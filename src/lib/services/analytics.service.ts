import { prisma } from "@/lib/prisma"

export const analyticsService = {
  // Get user progress data
  async getUserProgress(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPackages: {
          where: { status: "ACTIVE" },
          include: {
            package: {
              include: {
                packagePhases: true,
              },
            },
          },
        },
        toolProgress: {
          include: {
            tool: true,
          },
        },
        toolResults: {
          include: {
            tool: true,
          },
          orderBy: { completedAt: "desc" },
        },
        bookings: {
          where: { status: "COMPLETED" },
          include: {
            mentor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Calculate phase progress
    const activePackage = user.userPackages[0]
    const totalPhases = activePackage?.package.packagePhases.length || 6
    const completedPhases = activePackage?.currentPhase || 1

    // Calculate tool completion
    const completedTools = user.toolResults.length
    const inProgressTools = user.toolProgress.filter(
      (tp) => tp.status === "IN_PROGRESS"
    ).length

    // Get CLIQI scores over time (if available)
    const cliqiResults = user.toolResults.filter(
      (tr) => tr.tool.code?.includes("CLIQI")
    )

    // Get recent achievements/milestones
    const milestones = []
    if (user.onboardingComplete) {
      milestones.push({
        title: "Onboarding Complete",
        date: user.updatedAt,
        type: "onboarding",
      })
    }
    if (completedTools > 0) {
      milestones.push({
        title: `${completedTools} Assessment${completedTools > 1 ? "s" : ""} Completed`,
        date: user.toolResults[0]?.completedAt || new Date(),
        type: "assessment",
      })
    }
    if (user.bookings.length > 0) {
      milestones.push({
        title: `${user.bookings.length} Session${user.bookings.length > 1 ? "s" : ""} Completed`,
        date: user.bookings[0]?.scheduledAt || new Date(),
        type: "session",
      })
    }

    return {
      user: {
        id: user.id,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
        segment: user.segment,
        currentPhase: activePackage?.currentPhase || null,
      },
      package: activePackage
        ? {
            id: activePackage.package.id,
            name: activePackage.package.fullName,
            tier: activePackage.package.tier,
            totalPhases,
          }
        : null,
      progress: {
        phaseProgress: Math.round((completedPhases / totalPhases) * 100),
        currentPhase: completedPhases,
        totalPhases,
        completedTools,
        inProgressTools,
        totalSessions: user.bookings.length,
      },
      toolResults: user.toolResults.map((tr) => ({
        id: tr.id,
        toolName: tr.tool.name,
        toolCode: tr.tool.code,
        completedAt: tr.completedAt,
        scores: tr.scores,
      })),
      cliqiHistory: cliqiResults.map((cr) => ({
        date: cr.completedAt,
        scores: cr.scores,
      })),
      milestones: milestones.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }
  },

  // Get admin dashboard analytics
  async getAdminAnalytics() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    // User metrics
    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      activeUsers,
      usersBySegment,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        },
      }),
      prisma.user.count({
        where: {
          OR: [
            { toolProgress: { some: { updatedAt: { gte: startOfWeek } } } },
            { bookings: { some: { scheduledAt: { gte: startOfWeek } } } },
          ],
        },
      }),
      prisma.user.groupBy({
        by: ["segment"],
        _count: true,
      }),
    ])

    // Package metrics
    const [
      totalPackagePurchases,
      revenueBySegment,
    ] = await Promise.all([
      prisma.userPackage.count({ where: { status: "ACTIVE" } }),
      prisma.userPackage.findMany({
        where: { status: "ACTIVE" },
        include: {
          package: {
            select: {
              segment: true,
              tier: true,
              priceINR: true,
            },
          },
        },
      }),
    ])

    // Calculate revenue by segment
    const revenueMap = revenueBySegment.reduce(
      (acc, up) => {
        const segment = up.package.segment
        acc[segment] = (acc[segment] || 0) + (up.package.priceINR || 0)
        return acc
      },
      {} as Record<string, number>
    )

    // Assessment metrics
    const [
      totalAssessments,
      assessmentsThisMonth,
      avgCompletionRate,
    ] = await Promise.all([
      prisma.toolResult.count(),
      prisma.toolResult.count({
        where: { completedAt: { gte: startOfMonth } },
      }),
      prisma.userToolProgress.groupBy({
        by: ["status"],
        _count: true,
      }),
    ])

    const completedCount =
      avgCompletionRate.find((a) => a.status === "COMPLETED")?._count || 0
    const totalProgress = avgCompletionRate.reduce((sum, a) => sum + a._count, 0)
    const completionRate =
      totalProgress > 0 ? Math.round((completedCount / totalProgress) * 100) : 0

    // Mentor metrics
    const [
      totalMentors,
      activeMentors,
      totalBookings,
      bookingsThisMonth,
      completedBookings,
      avgMentorRating,
    ] = await Promise.all([
      prisma.mentor.count(),
      prisma.mentor.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.booking.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.mentor.aggregate({
        _avg: { rating: true },
        where: { rating: { not: null } },
      }),
    ])

    // Calculate growth rates
    const userGrowthRate =
      newUsersLastMonth > 0
        ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
        : 100

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        active: activeUsers,
        growthRate: userGrowthRate,
        bySegment: usersBySegment.map((s) => ({
          segment: s.segment,
          count: s._count,
        })),
      },
      packages: {
        totalPurchases: totalPackagePurchases,
        revenueBySegment: Object.entries(revenueMap).map(([segment, revenue]) => ({
          segment,
          revenue,
        })),
      },
      assessments: {
        total: totalAssessments,
        thisMonth: assessmentsThisMonth,
        completionRate,
      },
      mentors: {
        total: totalMentors,
        active: activeMentors,
        avgRating: avgMentorRating._avg.rating,
      },
      bookings: {
        total: totalBookings,
        thisMonth: bookingsThisMonth,
        completed: completedBookings,
        completionRate:
          totalBookings > 0
            ? Math.round((completedBookings / totalBookings) * 100)
            : 0,
      },
    }
  },

  // Get detailed user analytics for admin
  async getUserAnalytics(options: {
    segment?: string
    fromDate?: Date
    toDate?: Date
  }) {
    const { segment, fromDate, toDate } = options

    const users = await prisma.user.findMany({
      where: {
        segment: segment ? (segment as never) : undefined,
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        userPackages: {
          include: {
            package: true,
          },
        },
        toolResults: true,
        bookings: true,
      },
    })

    return users.map((user) => {
      const activePackage = user.userPackages.find((up) => up.status === "ACTIVE")
      return {
        id: user.id,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
        email: user.email,
        segment: user.segment,
        joinedAt: user.createdAt,
        onboardingComplete: user.onboardingComplete,
        currentPhase: activePackage?.currentPhase || null,
        activePackage: activePackage?.package.fullName,
        assessmentsCompleted: user.toolResults.length,
        sessionsCompleted: user.bookings.filter((b) => b.status === "COMPLETED").length,
      }
    })
  },

  // Get tool usage analytics
  async getToolAnalytics() {
    const toolStats = await prisma.tool.findMany({
      include: {
        _count: {
          select: {
            userProgress: true,
            toolResults: true,
          },
        },
        toolResults: {
          select: {
            scores: true,
          },
        },
      },
    })

    return toolStats.map((tool) => ({
      id: tool.id,
      code: tool.code,
      name: tool.name,
      category: tool.category,
      totalStarts: tool._count.userProgress,
      totalCompletions: tool._count.toolResults,
      completionRate:
        tool._count.userProgress > 0
          ? Math.round(
              (tool._count.toolResults / tool._count.userProgress) * 100
            )
          : 0,
    }))
  },

  // Get mentor performance analytics
  async getMentorAnalytics() {
    const mentors = await prisma.mentor.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        bookings: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    })

    return mentors.map((mentor) => {
      const completedBookings = mentor.bookings.filter(
        (b) => b.status === "COMPLETED"
      )
      // Extract ratings from feedback JSON
      const ratings = mentor.bookings
        .map((b) => {
          const feedback = b.feedback as { rating?: number } | null
          return feedback?.rating
        })
        .filter((r): r is number => typeof r === "number")

      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : null

      return {
        id: mentor.id,
        name:
          [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ") ||
          mentor.user.email,
        level: mentor.level,
        isActive: mentor.isActive,
        totalBookings: mentor._count.bookings,
        completedSessions: completedBookings.length,
        totalMentees: mentor.totalMentees,
        rating: avgRating,
        utilization:
          mentor._count.bookings > 0
            ? Math.round((completedBookings.length / mentor._count.bookings) * 100)
            : 0,
      }
    })
  },
}
