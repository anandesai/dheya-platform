// Access Control Service - Core business logic for package-based tool access
import { prisma } from "@/lib/prisma"
import { AccessLevel, PackageTier, UserSegment, ProgressStatus } from "@prisma/client"

// ==========================================
// TYPES
// ==========================================

export interface AccessCheckResult {
  allowed: boolean
  accessLevel: AccessLevel | 'NOT_FOUND' | 'NO_PACKAGE'
  reason?: string
  upgradeRequired?: boolean
  requiredPackage?: PackageTier
  message?: string
  teaserConfig?: Record<string, unknown>
}

export interface ToolWithAccess {
  id: string
  code: string
  name: string
  description: string
  category: string
  phase: number
  orderInPhase: number
  estimatedMinutes: number
  isMandatory: boolean
  // Access info
  accessLevel: AccessLevel | 'NOT_FOUND' | 'NO_PACKAGE'
  isLocked: boolean
  upgradeRequired: boolean
  requiredPackage?: PackageTier
  teaserConfig?: Record<string, unknown>
  lockedMessage?: string
  // Progress info
  status: ProgressStatus
  progressPercent: number
  completedAt?: Date | null
}

export interface UserDashboardData {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    segment: UserSegment
    email: string
  }
  package: {
    id: string
    code: string
    tier: PackageTier
    productName: string
    packageName: string
    fullName: string
    totalSessions: number
    sessionsUsed: number
    currentPhase: number
    includedPhases: number[]
  } | null
  tools: ToolWithAccess[]
  progress: {
    overallPercent: number
    completedTools: number
    totalTools: number
    currentPhase: number
  }
}

// ==========================================
// ACCESS CONTROL SERVICE
// ==========================================

export class AccessControlService {
  /**
   * Check if user can access a specific tool
   */
  async checkToolAccess(userId: string, toolId: string): Promise<AccessCheckResult> {
    // 1. Get user with their active package
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPackages: {
          where: { status: 'active' },
          include: {
            package: {
              include: {
                packagePhases: true,
                packageToolAccess: true
              }
            }
          },
          take: 1
        }
      }
    })

    if (!user) {
      return { allowed: false, accessLevel: 'NOT_FOUND', reason: 'User not found' }
    }

    if (!user.segment) {
      return { allowed: false, accessLevel: 'NOT_FOUND', reason: 'User segment not set' }
    }

    // 2. Check if tool is assigned to user's segment
    const segmentTool = await prisma.segmentTool.findUnique({
      where: {
        segment_toolId: {
          segment: user.segment,
          toolId: toolId
        }
      },
      include: { tool: true }
    })

    if (!segmentTool || !segmentTool.isVisible) {
      return {
        allowed: false,
        accessLevel: 'NOT_FOUND',
        reason: 'Tool not available for your profile'
      }
    }

    // 3. Check if user has an active package
    const activePackage = user.userPackages[0]
    if (!activePackage) {
      return {
        allowed: false,
        accessLevel: 'NO_PACKAGE',
        reason: 'No active package',
        upgradeRequired: true,
        message: 'Purchase a package to access this tool'
      }
    }

    // 4. Check if tool's phase is included in package
    const includedPhases = activePackage.package.packagePhases
      .filter(p => p.isIncluded)
      .map(p => p.phaseNumber)

    if (!includedPhases.includes(segmentTool.phaseNumber)) {
      const requiredPackage = this.getRequiredPackageForPhase(segmentTool.phaseNumber)

      return {
        allowed: false,
        accessLevel: 'LOCKED',
        reason: 'Phase not included in your package',
        upgradeRequired: true,
        requiredPackage: requiredPackage,
        message: `Upgrade to ${requiredPackage} to unlock this tool`
      }
    }

    // 5. Get specific access configuration
    const toolAccess = activePackage.package.packageToolAccess
      .find(a => a.toolId === toolId)

    const accessLevel = toolAccess?.accessLevel || AccessLevel.FULL

    if (accessLevel === AccessLevel.TEASER) {
      return {
        allowed: false,
        accessLevel: 'TEASER',
        reason: 'Preview mode only',
        upgradeRequired: true,
        requiredPackage: this.getRequiredPackageForPhase(segmentTool.phaseNumber),
        teaserConfig: toolAccess?.teaserConfig as Record<string, unknown> || { questionsToShow: 3 },
        message: 'Upgrade to access the full tool'
      }
    }

    return {
      allowed: accessLevel === AccessLevel.FULL || accessLevel === AccessLevel.VIEW_ONLY,
      accessLevel: accessLevel,
      reason: accessLevel === AccessLevel.FULL ? 'Full access granted' : 'View only access'
    }
  }

  /**
   * Get all tools for a user with their access levels
   */
  async getUserToolsWithAccess(userId: string): Promise<ToolWithAccess[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPackages: {
          where: { status: 'active' },
          include: {
            package: {
              include: {
                packagePhases: true,
                packageToolAccess: true
              }
            }
          },
          take: 1
        },
        toolProgress: true
      }
    })

    if (!user || !user.segment) {
      throw new Error('User not found or segment not set')
    }

    // Get all tools for user's segment
    const segmentTools = await prisma.segmentTool.findMany({
      where: {
        segment: user.segment,
        isVisible: true
      },
      include: { tool: true },
      orderBy: [
        { phaseNumber: 'asc' },
        { orderInPhase: 'asc' }
      ]
    })

    const activePackage = user.userPackages[0]?.package
    const includedPhases = activePackage?.packagePhases
      .filter(p => p.isIncluded)
      .map(p => p.phaseNumber) || []

    return segmentTools.map(st => {
      const progress = user.toolProgress.find(p => p.toolId === st.toolId)
      const toolAccess = activePackage?.packageToolAccess
        .find(a => a.toolId === st.toolId)

      let accessLevel: AccessLevel | 'NOT_FOUND' | 'NO_PACKAGE' = AccessLevel.LOCKED
      let upgradeRequired = false
      let requiredPackage: PackageTier | undefined

      if (!activePackage) {
        accessLevel = 'NO_PACKAGE'
        upgradeRequired = true
        requiredPackage = PackageTier.GUIDANCE
      } else if (includedPhases.includes(st.phaseNumber)) {
        accessLevel = toolAccess?.accessLevel || AccessLevel.FULL
      } else {
        accessLevel = AccessLevel.LOCKED
        upgradeRequired = true
        requiredPackage = this.getRequiredPackageForPhase(st.phaseNumber)
      }

      return {
        id: st.tool.id,
        code: st.tool.code,
        name: st.customName || st.tool.name,
        description: st.customDescription || st.tool.shortDescription,
        category: st.tool.category,
        phase: st.phaseNumber,
        orderInPhase: st.orderInPhase,
        estimatedMinutes: st.tool.estimatedMinutes,
        isMandatory: st.isMandatory,

        // Access info
        accessLevel: accessLevel,
        isLocked: accessLevel === AccessLevel.LOCKED || accessLevel === 'NO_PACKAGE',
        upgradeRequired: upgradeRequired,
        requiredPackage: requiredPackage,
        teaserConfig: toolAccess?.teaserConfig as Record<string, unknown> | undefined,
        lockedMessage: toolAccess?.lockedMessage || undefined,

        // Progress info
        status: progress?.status || ProgressStatus.NOT_STARTED,
        progressPercent: progress?.progressPercent || 0,
        completedAt: progress?.completedAt
      }
    })
  }

  /**
   * Get complete dashboard data for a user
   */
  async getUserDashboardData(userId: string): Promise<UserDashboardData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPackages: {
          where: { status: 'active' },
          include: {
            package: {
              include: {
                packagePhases: true
              }
            }
          },
          take: 1
        }
      }
    })

    if (!user || !user.segment) {
      throw new Error('User not found or segment not set')
    }

    const tools = await this.getUserToolsWithAccess(userId)
    const activeUserPackage = user.userPackages[0]
    const activePackage = activeUserPackage?.package

    const completedTools = tools.filter(t => t.status === ProgressStatus.COMPLETED).length
    const totalAccessibleTools = tools.filter(t => !t.isLocked).length
    const overallPercent = totalAccessibleTools > 0
      ? Math.round((completedTools / totalAccessibleTools) * 100)
      : 0

    // Determine current phase based on progress
    const currentPhase = this.calculateCurrentPhase(tools)

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        segment: user.segment,
        email: user.email
      },
      package: activePackage ? {
        id: activePackage.id,
        code: activePackage.code,
        tier: activePackage.tier,
        productName: activePackage.productName,
        packageName: activePackage.packageName,
        fullName: activePackage.fullName,
        totalSessions: activePackage.totalSessions,
        sessionsUsed: activeUserPackage.sessionsUsed,
        currentPhase: activeUserPackage.currentPhase,
        includedPhases: activePackage.packagePhases
          .filter(p => p.isIncluded)
          .map(p => p.phaseNumber)
      } : null,
      tools,
      progress: {
        overallPercent,
        completedTools,
        totalTools: totalAccessibleTools,
        currentPhase
      }
    }
  }

  /**
   * Determine which package tier is required to access a specific phase
   */
  private getRequiredPackageForPhase(phaseNumber: number): PackageTier {
    if (phaseNumber <= 2) return PackageTier.GUIDANCE
    if (phaseNumber <= 5) return PackageTier.PLANNING
    return PackageTier.MENTORSHIP
  }

  /**
   * Calculate current phase based on tool progress
   */
  private calculateCurrentPhase(tools: ToolWithAccess[]): number {
    // Group tools by phase
    const phaseGroups = new Map<number, ToolWithAccess[]>()
    tools.forEach(tool => {
      if (!tool.isLocked) {
        const existing = phaseGroups.get(tool.phase) || []
        phaseGroups.set(tool.phase, [...existing, tool])
      }
    })

    // Find the first phase that is not fully completed
    const phases = Array.from(phaseGroups.keys()).sort((a, b) => a - b)
    for (const phase of phases) {
      const phaseTools = phaseGroups.get(phase) || []
      const completedInPhase = phaseTools.filter(t => t.status === ProgressStatus.COMPLETED).length
      if (completedInPhase < phaseTools.length) {
        return phase
      }
    }

    // All phases completed, return last phase
    return phases[phases.length - 1] || 1
  }
}

// Export singleton instance
export const accessControlService = new AccessControlService()
