"use client"

import { useState, useEffect, useCallback } from "react"
import { AccessLevel, PackageTier, ProgressStatus } from "@prisma/client"

// ==========================================
// TYPES
// ==========================================

export interface ToolAccess {
  allowed: boolean
  accessLevel: AccessLevel | 'NOT_FOUND' | 'NO_PACKAGE'
  upgradeRequired: boolean
  requiredPackage?: PackageTier
  teaserConfig?: Record<string, unknown>
  message?: string
  loading: boolean
  error?: string
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
  accessLevel: AccessLevel | 'NOT_FOUND' | 'NO_PACKAGE'
  isLocked: boolean
  upgradeRequired: boolean
  requiredPackage?: PackageTier
  teaserConfig?: Record<string, unknown>
  lockedMessage?: string
  status: ProgressStatus
  progressPercent: number
  completedAt?: string | null
}

export interface UserDashboardData {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    segment: string
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
// HOOKS
// ==========================================

/**
 * Hook to check access to a specific tool
 */
export function useToolAccess(toolId: string): ToolAccess {
  const [access, setAccess] = useState<ToolAccess>({
    allowed: false,
    accessLevel: 'LOCKED',
    upgradeRequired: false,
    loading: true
  })

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch(`/api/user/tools/${toolId}/access`)

        if (!response.ok) {
          throw new Error("Failed to check access")
        }

        const data = await response.json()

        setAccess({
          allowed: data.allowed,
          accessLevel: data.accessLevel,
          upgradeRequired: data.upgradeRequired || false,
          requiredPackage: data.requiredPackage,
          teaserConfig: data.teaserConfig,
          message: data.message,
          loading: false
        })
      } catch (error) {
        setAccess(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error"
        }))
      }
    }

    if (toolId) {
      checkAccess()
    }
  }, [toolId])

  return access
}

/**
 * Hook to get all tools for the current user with access levels
 */
export function useUserTools() {
  const [tools, setTools] = useState<ToolWithAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTools = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/user/dashboard")

      if (!response.ok) {
        throw new Error("Failed to fetch tools")
      }

      const data: UserDashboardData = await response.json()
      setTools(data.tools)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTools()
  }, [fetchTools])

  return { tools, loading, error, refetch: fetchTools }
}

/**
 * Hook to get the full dashboard data for the current user
 */
export function useDashboard() {
  const [data, setData] = useState<UserDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/user/dashboard")

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const dashboardData: UserDashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, loading, error, refetch: fetchDashboard }
}

/**
 * Hook to get tools grouped by phase
 */
export function useToolsByPhase() {
  const { tools, loading, error, refetch } = useUserTools()

  const toolsByPhase = tools.reduce((acc, tool) => {
    const phase = tool.phase
    if (!acc[phase]) {
      acc[phase] = []
    }
    acc[phase].push(tool)
    return acc
  }, {} as Record<number, ToolWithAccess[]>)

  return { toolsByPhase, loading, error, refetch }
}

/**
 * Utility function to check if a tool can be started
 */
export function canStartTool(tool: ToolWithAccess): boolean {
  return (
    !tool.isLocked &&
    tool.accessLevel === AccessLevel.FULL &&
    tool.status !== ProgressStatus.COMPLETED
  )
}

/**
 * Utility function to check if a tool is in progress
 */
export function isToolInProgress(tool: ToolWithAccess): boolean {
  return tool.status === ProgressStatus.IN_PROGRESS
}

/**
 * Utility function to check if a tool is completed
 */
export function isToolCompleted(tool: ToolWithAccess): boolean {
  return tool.status === ProgressStatus.COMPLETED
}

/**
 * Utility function to get the appropriate action button label
 */
export function getToolActionLabel(tool: ToolWithAccess): string {
  if (tool.isLocked) {
    if (tool.accessLevel === AccessLevel.TEASER) {
      return "Preview"
    }
    return "🔒 Upgrade"
  }

  if (tool.accessLevel === AccessLevel.VIEW_ONLY) {
    return "View Results"
  }

  switch (tool.status) {
    case ProgressStatus.COMPLETED:
      return "View Results"
    case ProgressStatus.IN_PROGRESS:
      return "Continue"
    case ProgressStatus.NOT_STARTED:
    default:
      return "Start"
  }
}

/**
 * Utility function to get status color
 */
export function getToolStatusColor(tool: ToolWithAccess): string {
  if (tool.isLocked) {
    return "text-muted-foreground"
  }

  switch (tool.status) {
    case ProgressStatus.COMPLETED:
      return "text-green-600"
    case ProgressStatus.IN_PROGRESS:
      return "text-blue-600"
    case ProgressStatus.NOT_STARTED:
    default:
      return "text-gray-600"
  }
}
