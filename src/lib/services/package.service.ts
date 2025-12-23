// Package Management Service - CRUD operations for packages
import { prisma } from "@/lib/prisma"
import { PackageTier, UserSegment, AccessLevel, MentorLevel, Prisma } from "@prisma/client"

// ==========================================
// TYPES
// ==========================================

export interface CreatePackageInput {
  code: string
  segment: UserSegment
  tier: PackageTier
  productName: string
  packageName: string
  tagline?: string
  description: string
  priceINR: number
  discountPercent?: number
  durationValue: number
  durationType: string
  totalSessions: number
  sessionDurationMins?: number
  sessionFrequency: string
  mentorLevel: MentorLevel
  features?: string[]
  phases: PackagePhaseInput[]
  toolAccess?: PackageToolAccessInput[]
}

export interface UpdatePackageInput extends Partial<CreatePackageInput> {
  isActive?: boolean
  isPublished?: boolean
}

export interface PackagePhaseInput {
  phaseNumber: number
  phaseName: string
  description?: string
  isIncluded: boolean
}

export interface PackageToolAccessInput {
  toolId: string
  accessLevel: AccessLevel
  teaserConfig?: Prisma.InputJsonValue
  lockedMessage?: string
}

export interface PackageWithDetails {
  id: string
  code: string
  segment: UserSegment
  tier: PackageTier
  productName: string
  packageName: string
  fullName: string
  tagline: string | null
  description: string
  priceINR: number
  discountPercent: number
  durationValue: number
  durationType: string
  totalSessions: number
  sessionDurationMins: number
  sessionFrequency: string
  mentorLevel: MentorLevel
  features: string[] | null
  isActive: boolean
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  packagePhases: {
    id: string
    phaseNumber: number
    phaseName: string
    description: string | null
    isIncluded: boolean
  }[]
  packageToolAccess: {
    id: string
    toolId: string
    accessLevel: AccessLevel
    teaserConfig: Record<string, unknown> | null
    lockedMessage: string | null
    tool: {
      id: string
      code: string
      name: string
    }
  }[]
  _count: {
    userPackages: number
  }
}

export interface QuickGenerateInput {
  segment: UserSegment
  productName: string
  packages: {
    tier: PackageTier
    priceINR: number
    durationValue: number
    durationType: string
    totalSessions: number
    mentorLevel: MentorLevel
    phases: number[]
    mentorPayoutINR?: number
    referralPayoutINR?: number
  }[]
  autoConfigureAccess?: boolean
  enableTeaserMode?: boolean
}

// ==========================================
// PACKAGE SERVICE
// ==========================================

export class PackageService {
  /**
   * Create a new package
   */
  async createPackage(input: CreatePackageInput): Promise<PackageWithDetails> {
    const fullName = `${input.productName} - ${input.packageName}`

    const pkg = await prisma.package.create({
      data: {
        code: input.code,
        segment: input.segment,
        tier: input.tier,
        productName: input.productName,
        packageName: input.packageName,
        fullName,
        tagline: input.tagline,
        description: input.description,
        priceINR: input.priceINR,
        discountPercent: input.discountPercent || 0,
        durationValue: input.durationValue,
        durationType: input.durationType,
        totalSessions: input.totalSessions,
        sessionDurationMins: input.sessionDurationMins || 60,
        sessionFrequency: input.sessionFrequency,
        mentorLevel: input.mentorLevel,
        features: input.features,
        packagePhases: {
          create: input.phases.map(phase => ({
            phaseNumber: phase.phaseNumber,
            phaseName: phase.phaseName,
            description: phase.description,
            isIncluded: phase.isIncluded
          }))
        },
        packageToolAccess: input.toolAccess ? {
          create: input.toolAccess.map(access => ({
            tool: { connect: { id: access.toolId } },
            accessLevel: access.accessLevel,
            teaserConfig: access.teaserConfig,
            lockedMessage: access.lockedMessage
          }))
        } : undefined
      },
      include: {
        packagePhases: true,
        packageToolAccess: {
          include: {
            tool: {
              select: { id: true, code: true, name: true }
            }
          }
        },
        _count: {
          select: { userPackages: true }
        }
      }
    })

    return pkg as unknown as PackageWithDetails
  }

  /**
   * Update an existing package
   */
  async updatePackage(id: string, input: UpdatePackageInput): Promise<PackageWithDetails> {
    const fullName = input.productName && input.packageName
      ? `${input.productName} - ${input.packageName}`
      : undefined

    // Update phases if provided
    if (input.phases) {
      // Delete existing phases and recreate
      await prisma.packagePhase.deleteMany({
        where: { packageId: id }
      })

      await prisma.packagePhase.createMany({
        data: input.phases.map(phase => ({
          packageId: id,
          phaseNumber: phase.phaseNumber,
          phaseName: phase.phaseName,
          description: phase.description,
          isIncluded: phase.isIncluded
        }))
      })
    }

    // Update tool access if provided
    if (input.toolAccess) {
      await prisma.packageToolAccess.deleteMany({
        where: { packageId: id }
      })

      await prisma.packageToolAccess.createMany({
        data: input.toolAccess.map(access => ({
          packageId: id,
          toolId: access.toolId,
          accessLevel: access.accessLevel,
          teaserConfig: access.teaserConfig,
          lockedMessage: access.lockedMessage
        }))
      })
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        code: input.code,
        segment: input.segment,
        tier: input.tier,
        productName: input.productName,
        packageName: input.packageName,
        fullName,
        tagline: input.tagline,
        description: input.description,
        priceINR: input.priceINR,
        discountPercent: input.discountPercent,
        durationValue: input.durationValue,
        durationType: input.durationType,
        totalSessions: input.totalSessions,
        sessionDurationMins: input.sessionDurationMins,
        sessionFrequency: input.sessionFrequency,
        mentorLevel: input.mentorLevel,
        features: input.features,
        isActive: input.isActive,
        isPublished: input.isPublished
      },
      include: {
        packagePhases: true,
        packageToolAccess: {
          include: {
            tool: {
              select: { id: true, code: true, name: true }
            }
          }
        },
        _count: {
          select: { userPackages: true }
        }
      }
    })

    return pkg as unknown as PackageWithDetails
  }

  /**
   * Get package by ID
   */
  async getPackageById(id: string): Promise<PackageWithDetails | null> {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        packagePhases: {
          orderBy: { phaseNumber: 'asc' }
        },
        packageToolAccess: {
          include: {
            tool: {
              select: { id: true, code: true, name: true }
            }
          }
        },
        _count: {
          select: { userPackages: true }
        }
      }
    })

    return pkg as unknown as PackageWithDetails | null
  }

  /**
   * Get package by code
   */
  async getPackageByCode(code: string): Promise<PackageWithDetails | null> {
    const pkg = await prisma.package.findUnique({
      where: { code },
      include: {
        packagePhases: {
          orderBy: { phaseNumber: 'asc' }
        },
        packageToolAccess: {
          include: {
            tool: {
              select: { id: true, code: true, name: true }
            }
          }
        },
        _count: {
          select: { userPackages: true }
        }
      }
    })

    return pkg as unknown as PackageWithDetails | null
  }

  /**
   * Get all packages with optional filtering
   */
  async getPackages(filters?: {
    segment?: UserSegment
    tier?: PackageTier
    isActive?: boolean
    isPublished?: boolean
  }): Promise<PackageWithDetails[]> {
    const packages = await prisma.package.findMany({
      where: {
        segment: filters?.segment,
        tier: filters?.tier,
        isActive: filters?.isActive,
        isPublished: filters?.isPublished
      },
      include: {
        packagePhases: {
          orderBy: { phaseNumber: 'asc' }
        },
        packageToolAccess: {
          include: {
            tool: {
              select: { id: true, code: true, name: true }
            }
          }
        },
        _count: {
          select: { userPackages: true }
        }
      },
      orderBy: [
        { segment: 'asc' },
        { tier: 'asc' }
      ]
    })

    return packages as unknown as PackageWithDetails[]
  }

  /**
   * Get packages grouped by segment
   */
  async getPackagesBySegment(): Promise<Record<UserSegment, PackageWithDetails[]>> {
    const packages = await this.getPackages()

    const grouped = {
      [UserSegment.EARLY_CAREER]: [],
      [UserSegment.MID_CAREER]: [],
      [UserSegment.SENIOR]: [],
      [UserSegment.RETURNING_WOMEN]: []
    } as Record<UserSegment, PackageWithDetails[]>

    packages.forEach(pkg => {
      grouped[pkg.segment].push(pkg)
    })

    return grouped
  }

  /**
   * Delete a package (soft delete by setting isActive to false)
   */
  async deletePackage(id: string, hardDelete = false): Promise<void> {
    if (hardDelete) {
      // Check if package has any users
      const pkg = await prisma.package.findUnique({
        where: { id },
        include: { _count: { select: { userPackages: true } } }
      })

      if (pkg && pkg._count.userPackages > 0) {
        throw new Error('Cannot delete package with active users. Use soft delete instead.')
      }

      await prisma.package.delete({ where: { id } })
    } else {
      await prisma.package.update({
        where: { id },
        data: { isActive: false }
      })
    }
  }

  /**
   * Publish a package
   */
  async publishPackage(id: string): Promise<PackageWithDetails> {
    return this.updatePackage(id, { isPublished: true })
  }

  /**
   * Unpublish a package
   */
  async unpublishPackage(id: string): Promise<PackageWithDetails> {
    return this.updatePackage(id, { isPublished: false })
  }

  /**
   * Clone a package to create a new one
   */
  async clonePackage(id: string, newCode: string): Promise<PackageWithDetails> {
    const source = await this.getPackageById(id)
    if (!source) {
      throw new Error('Source package not found')
    }

    return this.createPackage({
      code: newCode,
      segment: source.segment,
      tier: source.tier,
      productName: source.productName,
      packageName: `${source.packageName} (Copy)`,
      tagline: source.tagline || undefined,
      description: source.description,
      priceINR: source.priceINR,
      discountPercent: source.discountPercent,
      durationValue: source.durationValue,
      durationType: source.durationType,
      totalSessions: source.totalSessions,
      sessionDurationMins: source.sessionDurationMins,
      sessionFrequency: source.sessionFrequency,
      mentorLevel: source.mentorLevel,
      features: source.features || undefined,
      phases: source.packagePhases.map(p => ({
        phaseNumber: p.phaseNumber,
        phaseName: p.phaseName,
        description: p.description || undefined,
        isIncluded: p.isIncluded
      })),
      toolAccess: source.packageToolAccess.map(a => ({
        toolId: a.toolId,
        accessLevel: a.accessLevel,
        teaserConfig: (a.teaserConfig as Prisma.InputJsonValue) || undefined,
        lockedMessage: a.lockedMessage || undefined
      }))
    })
  }

  /**
   * Quick generate all 3 package tiers for a segment
   */
  async quickGeneratePackages(input: QuickGenerateInput): Promise<PackageWithDetails[]> {
    const createdPackages: PackageWithDetails[] = []

    // Get all tools for the segment if auto-configuring access
    let segmentTools: { toolId: string; phaseNumber: number }[] = []
    if (input.autoConfigureAccess) {
      const tools = await prisma.segmentTool.findMany({
        where: { segment: input.segment, isVisible: true },
        select: { toolId: true, phaseNumber: true }
      })
      segmentTools = tools
    }

    // Phase configuration based on tier
    const phaseConfig = this.getDefaultPhaseConfig(input.segment)

    for (const pkgInput of input.packages) {
      const tierName = this.getTierDisplayName(pkgInput.tier)
      const code = `${this.getSegmentCode(input.segment)}_${pkgInput.tier}`

      // Determine included phases
      const phases = phaseConfig.map(pc => ({
        ...pc,
        isIncluded: pkgInput.phases.includes(pc.phaseNumber)
      }))

      // Configure tool access based on phases
      let toolAccess: PackageToolAccessInput[] = []
      if (input.autoConfigureAccess && segmentTools.length > 0) {
        toolAccess = segmentTools.map(st => {
          const isIncludedPhase = pkgInput.phases.includes(st.phaseNumber)

          if (isIncludedPhase) {
            return {
              toolId: st.toolId,
              accessLevel: AccessLevel.FULL
            }
          } else if (input.enableTeaserMode) {
            return {
              toolId: st.toolId,
              accessLevel: AccessLevel.TEASER,
              teaserConfig: { questionsToShow: 3 },
              lockedMessage: `Upgrade to ${this.getRequiredTierForPhase(st.phaseNumber)} to unlock this tool`
            }
          } else {
            return {
              toolId: st.toolId,
              accessLevel: AccessLevel.LOCKED,
              lockedMessage: `Upgrade to ${this.getRequiredTierForPhase(st.phaseNumber)} to unlock this tool`
            }
          }
        })
      }

      const pkg = await this.createPackage({
        code,
        segment: input.segment,
        tier: pkgInput.tier,
        productName: input.productName,
        packageName: tierName,
        description: this.getDefaultDescription(input.segment, pkgInput.tier),
        priceINR: pkgInput.priceINR,
        durationValue: pkgInput.durationValue,
        durationType: pkgInput.durationType,
        totalSessions: pkgInput.totalSessions,
        sessionFrequency: this.getDefaultSessionFrequency(pkgInput.tier),
        mentorLevel: pkgInput.mentorLevel,
        phases,
        toolAccess
      })

      createdPackages.push(pkg)
    }

    return createdPackages
  }

  /**
   * Auto-configure tool access for a package based on included phases
   */
  async autoConfigureToolAccess(
    packageId: string,
    enableTeaserMode = true
  ): Promise<PackageWithDetails> {
    const pkg = await this.getPackageById(packageId)
    if (!pkg) {
      throw new Error('Package not found')
    }

    const includedPhases = pkg.packagePhases
      .filter(p => p.isIncluded)
      .map(p => p.phaseNumber)

    // Get all tools for the segment
    const segmentTools = await prisma.segmentTool.findMany({
      where: { segment: pkg.segment, isVisible: true },
      select: { toolId: true, phaseNumber: true }
    })

    const toolAccess: PackageToolAccessInput[] = segmentTools.map(st => {
      const isIncludedPhase = includedPhases.includes(st.phaseNumber)

      if (isIncludedPhase) {
        return {
          toolId: st.toolId,
          accessLevel: AccessLevel.FULL
        }
      } else if (enableTeaserMode) {
        return {
          toolId: st.toolId,
          accessLevel: AccessLevel.TEASER,
          teaserConfig: { questionsToShow: 3 },
          lockedMessage: `Upgrade to ${this.getRequiredTierForPhase(st.phaseNumber)} to unlock this tool`
        }
      } else {
        return {
          toolId: st.toolId,
          accessLevel: AccessLevel.LOCKED,
          lockedMessage: `Upgrade to ${this.getRequiredTierForPhase(st.phaseNumber)} to unlock this tool`
        }
      }
    })

    return this.updatePackage(packageId, { toolAccess })
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  private getSegmentCode(segment: UserSegment): string {
    const codes: Record<UserSegment, string> = {
      [UserSegment.EARLY_CAREER]: 'EC',
      [UserSegment.MID_CAREER]: 'MC',
      [UserSegment.SENIOR]: 'SR',
      [UserSegment.RETURNING_WOMEN]: 'RW'
    }
    return codes[segment]
  }

  private getTierDisplayName(tier: PackageTier): string {
    const names: Record<PackageTier, string> = {
      [PackageTier.GUIDANCE]: 'Guidance',
      [PackageTier.PLANNING]: 'Planning',
      [PackageTier.MENTORSHIP]: 'Mentorship'
    }
    return names[tier]
  }

  private getRequiredTierForPhase(phaseNumber: number): string {
    if (phaseNumber <= 2) return 'Guidance'
    if (phaseNumber <= 5) return 'Planning'
    return 'Mentorship'
  }

  private getDefaultPhaseConfig(segment: UserSegment): PackagePhaseInput[] {
    const phaseConfigs: Record<UserSegment, PackagePhaseInput[]> = {
      [UserSegment.MID_CAREER]: [
        { phaseNumber: 1, phaseName: 'Diagnosis', isIncluded: true },
        { phaseNumber: 2, phaseName: 'Alignment Analysis', isIncluded: true },
        { phaseNumber: 3, phaseName: 'Life Review', isIncluded: false },
        { phaseNumber: 4, phaseName: 'Possibility Exploration', isIncluded: false },
        { phaseNumber: 5, phaseName: 'Transition Planning', isIncluded: false },
        { phaseNumber: 6, phaseName: 'Implementation & Support', isIncluded: false }
      ],
      [UserSegment.EARLY_CAREER]: [
        { phaseNumber: 1, phaseName: 'Discovery', isIncluded: true },
        { phaseNumber: 2, phaseName: 'Possibility Analysis', isIncluded: true },
        { phaseNumber: 3, phaseName: 'Identity Design', isIncluded: false },
        { phaseNumber: 4, phaseName: 'Path Creation', isIncluded: false },
        { phaseNumber: 5, phaseName: 'Readiness & Exploration', isIncluded: false },
        { phaseNumber: 6, phaseName: 'Identity Adoption', isIncluded: false }
      ],
      [UserSegment.SENIOR]: [
        { phaseNumber: 1, phaseName: 'Wisdom & Asset Audit', isIncluded: true },
        { phaseNumber: 2, phaseName: 'Capacity Assessment', isIncluded: true },
        { phaseNumber: 3, phaseName: 'Legacy Visioning', isIncluded: false },
        { phaseNumber: 4, phaseName: 'Second Innings Options', isIncluded: false },
        { phaseNumber: 5, phaseName: 'Transition Execution', isIncluded: false }
      ],
      [UserSegment.RETURNING_WOMEN]: [
        { phaseNumber: 1, phaseName: 'Foundation Building', isIncluded: true },
        { phaseNumber: 2, phaseName: 'Gap Assessment', isIncluded: true },
        { phaseNumber: 3, phaseName: 'Support System Design', isIncluded: false },
        { phaseNumber: 4, phaseName: 'Skills Bridge Building', isIncluded: false },
        { phaseNumber: 5, phaseName: 'Confidence Strengthening', isIncluded: false },
        { phaseNumber: 6, phaseName: 'Re-entry & Stabilization', isIncluded: false }
      ]
    }
    return phaseConfigs[segment]
  }

  private getDefaultDescription(segment: UserSegment, tier: PackageTier): string {
    const descriptions: Record<UserSegment, Record<PackageTier, string>> = {
      [UserSegment.MID_CAREER]: {
        [PackageTier.GUIDANCE]: 'Quick diagnostic to understand your current career state and initial alignment analysis.',
        [PackageTier.PLANNING]: 'Comprehensive career planning with life review, possibility exploration, and transition planning.',
        [PackageTier.MENTORSHIP]: 'Complete transformation journey with ongoing mentorship, implementation support, and crisis management.'
      },
      [UserSegment.EARLY_CAREER]: {
        [PackageTier.GUIDANCE]: 'Discover your interests and explore career possibilities.',
        [PackageTier.PLANNING]: 'Design your professional identity and create your career path.',
        [PackageTier.MENTORSHIP]: 'Full journey support from discovery to identity adoption.'
      },
      [UserSegment.SENIOR]: {
        [PackageTier.GUIDANCE]: 'Audit your wisdom and assess your capacity for the next phase.',
        [PackageTier.PLANNING]: 'Vision your legacy and explore second innings options.',
        [PackageTier.MENTORSHIP]: 'Complete transition execution with ongoing support.'
      },
      [UserSegment.RETURNING_WOMEN]: {
        [PackageTier.GUIDANCE]: 'Build foundation and assess gaps in your professional journey.',
        [PackageTier.PLANNING]: 'Design support systems and bridge skill gaps.',
        [PackageTier.MENTORSHIP]: 'Complete re-entry journey with confidence strengthening.'
      }
    }
    return descriptions[segment][tier]
  }

  private getDefaultSessionFrequency(tier: PackageTier): string {
    const frequencies: Record<PackageTier, string> = {
      [PackageTier.GUIDANCE]: 'bi-weekly',
      [PackageTier.PLANNING]: 'monthly',
      [PackageTier.MENTORSHIP]: 'quarterly'
    }
    return frequencies[tier]
  }
}

// Export singleton instance
export const packageService = new PackageService()
