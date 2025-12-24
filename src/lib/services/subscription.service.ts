/**
 * Subscription Service
 * Manages user subscriptions, upgrades, and usage tracking
 */

import { db } from "@/lib/db"
import { PackageTier, UserSegment } from "@prisma/client"

export interface UserSubscription {
  id: string
  packageId: string
  packageName: string
  tier: PackageTier
  segment: UserSegment
  status: string
  totalSessions: number
  sessionsUsed: number
  sessionsRemaining: number
  currentPhase: number
  purchasedAt: Date
  expiresAt: Date | null
  daysRemaining: number | null
  isExpired: boolean
  canUpgrade: boolean
  nextTier: PackageTier | null
}

export interface UsageStats {
  toolsCompleted: number
  toolsInProgress: number
  totalToolsAccessible: number
  phasesCompleted: number
  totalPhases: number
  overallProgress: number
}

export interface BillingHistory {
  id: string
  date: Date
  amount: number
  status: string
  packageName: string
  invoiceUrl: string | null
}

/**
 * Get user's active subscription details
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  const userPackage = await db.userPackage.findFirst({
    where: {
      userId,
      status: "active",
    },
    include: {
      package: {
        select: {
          id: true,
          fullName: true,
          tier: true,
          segment: true,
          totalSessions: true,
          packagePhases: {
            select: {
              phaseNumber: true,
            },
            orderBy: {
              phaseNumber: "desc",
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      purchasedAt: "desc",
    },
  })

  if (!userPackage) {
    return null
  }

  const now = new Date()
  const expiresAt = userPackage.expiresAt
  const daysRemaining = expiresAt
    ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null
  const isExpired = expiresAt ? now > expiresAt : false

  // Determine next tier for upgrades
  const currentTier = userPackage.package.tier
  let nextTier: PackageTier | null = null
  let canUpgrade = false

  if (currentTier === "GUIDANCE") {
    nextTier = "PLANNING"
    canUpgrade = true
  } else if (currentTier === "PLANNING") {
    nextTier = "MENTORSHIP"
    canUpgrade = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalPhases =
    userPackage.package.packagePhases[0]?.phaseNumber || 6 // Reserved for progress tracking

  return {
    id: userPackage.id,
    packageId: userPackage.packageId,
    packageName: userPackage.package.fullName,
    tier: userPackage.package.tier,
    segment: userPackage.package.segment,
    status: userPackage.status,
    totalSessions: userPackage.package.totalSessions,
    sessionsUsed: userPackage.sessionsUsed,
    sessionsRemaining:
      userPackage.package.totalSessions - userPackage.sessionsUsed,
    currentPhase: userPackage.currentPhase,
    purchasedAt: userPackage.purchasedAt,
    expiresAt,
    daysRemaining,
    isExpired,
    canUpgrade,
    nextTier,
  }
}

/**
 * Get user's usage statistics
 */
export async function getUsageStats(userId: string): Promise<UsageStats> {
  // Get user's segment and package
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { segment: true },
  })

  const userPackage = await db.userPackage.findFirst({
    where: {
      userId,
      status: "active",
    },
    include: {
      package: {
        include: {
          packageToolAccess: true,
          packagePhases: true,
        },
      },
    },
  })

  if (!user || !userPackage) {
    return {
      toolsCompleted: 0,
      toolsInProgress: 0,
      totalToolsAccessible: 0,
      phasesCompleted: 0,
      totalPhases: 0,
      overallProgress: 0,
    }
  }

  // Get tool progress
  const toolProgress = await db.userToolProgress.findMany({
    where: { userId },
  })

  const toolsCompleted = toolProgress.filter(
    (p) => p.status === "COMPLETED"
  ).length
  const toolsInProgress = toolProgress.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length
  const totalToolsAccessible = userPackage.package.packageToolAccess.filter(
    (access) => access.accessLevel === "FULL"
  ).length

  // Get phase progress
  const phaseProgress = await db.userPhaseProgress.findMany({
    where: {
      userId,
      segment: user.segment || "EARLY_CAREER",
    },
  })

  const phasesCompleted = phaseProgress.filter(
    (p) => p.status === "COMPLETED"
  ).length
  const totalPhases = userPackage.package.packagePhases.length

  // Calculate overall progress (average of tools and phases)
  const toolProgressPercent =
    totalToolsAccessible > 0 ? (toolsCompleted / totalToolsAccessible) * 100 : 0
  const phaseProgressPercent =
    totalPhases > 0 ? (phasesCompleted / totalPhases) * 100 : 0
  const overallProgress = Math.round(
    (toolProgressPercent + phaseProgressPercent) / 2
  )

  return {
    toolsCompleted,
    toolsInProgress,
    totalToolsAccessible,
    phasesCompleted,
    totalPhases,
    overallProgress,
  }
}

/**
 * Upgrade user's subscription to a higher tier
 */
export async function upgradeSubscription(
  userId: string,
  newPackageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentSubscription = await getUserSubscription(userId)

    if (!currentSubscription) {
      return {
        success: false,
        error: "No active subscription found",
      }
    }

    // Verify new package is an upgrade
    const newPackage = await db.package.findUnique({
      where: { id: newPackageId },
      select: { tier: true, segment: true },
    })

    if (!newPackage) {
      return {
        success: false,
        error: "Invalid package selected",
      }
    }

    // Verify same segment
    if (newPackage.segment !== currentSubscription.segment) {
      return {
        success: false,
        error: "Cannot upgrade to a different segment",
      }
    }

    // Verify tier is higher
    const tierOrder = {
      GUIDANCE: 1,
      PLANNING: 2,
      MENTORSHIP: 3,
    }

    if (tierOrder[newPackage.tier] <= tierOrder[currentSubscription.tier]) {
      return {
        success: false,
        error: "New package must be a higher tier",
      }
    }

    // Update current subscription to expired
    await db.userPackage.update({
      where: { id: currentSubscription.id },
      data: { status: "upgraded" },
    })

    // Create new subscription
    // Calculate prorated expiry based on remaining days
    const daysRemaining = currentSubscription.daysRemaining || 0
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysRemaining + 180) // Add 6 months + remaining days

    await db.userPackage.create({
      data: {
        userId,
        packageId: newPackageId,
        status: "active",
        currentPhase: currentSubscription.currentPhase,
        sessionsUsed: currentSubscription.sessionsUsed,
        expiresAt,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    return {
      success: false,
      error: "Failed to upgrade subscription. Please contact support.",
    }
  }
}

/**
 * Cancel user's subscription
 */
export async function cancelSubscription(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reason?: string // Reserved for logging cancellation reasons
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscription = await getUserSubscription(userId)

    if (!subscription) {
      return {
        success: false,
        error: "No active subscription found",
      }
    }

    await db.userPackage.update({
      where: { id: subscription.id },
      data: {
        status: "cancelled",
      },
    })

    // TODO: Log cancellation reason for analytics
    // TODO: Send cancellation confirmation email

    return { success: true }
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    return {
      success: false,
      error: "Failed to cancel subscription. Please contact support.",
    }
  }
}

/**
 * Get user's billing history
 * Note: This is a placeholder implementation
 * In production, integrate with payment gateway for actual transaction history
 */
export async function getBillingHistory(
  userId: string
): Promise<BillingHistory[]> {
  // Get all user packages (including expired/cancelled)
  const userPackages = await db.userPackage.findMany({
    where: { userId },
    include: {
      package: {
        select: {
          fullName: true,
          priceINR: true,
          discountPercent: true,
        },
      },
    },
    orderBy: {
      purchasedAt: "desc",
    },
  })

  // Map to billing history format
  return userPackages.map((up) => ({
    id: up.id,
    date: up.purchasedAt,
    amount:
      up.package.priceINR -
      (up.package.priceINR * up.package.discountPercent) / 100,
    status: up.status === "active" ? "paid" : up.status,
    packageName: up.package.fullName,
    invoiceUrl: null, // TODO: Generate invoice URLs
  }))
}

/**
 * Get available upgrade options for user
 */
export async function getUpgradeOptions(userId: string) {
  const currentSubscription = await getUserSubscription(userId)

  if (!currentSubscription || !currentSubscription.canUpgrade) {
    return []
  }

  // Get available packages in same segment with higher tier
  const availablePackages = await db.package.findMany({
    where: {
      segment: currentSubscription.segment,
      isActive: true,
      isPublished: true,
      tier: currentSubscription.nextTier || undefined,
    },
    include: {
      packagePhases: {
        select: {
          phaseNumber: true,
          phaseName: true,
        },
        orderBy: {
          phaseNumber: "asc",
        },
      },
    },
  })

  return availablePackages
}
