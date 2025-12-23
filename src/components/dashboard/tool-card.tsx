"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ToolWithAccess,
  getToolActionLabel,
  isToolCompleted,
  isToolInProgress
} from "@/hooks/use-tool-access"
import { AccessLevel } from "@prisma/client"
import { Lock, Play, Eye, CheckCircle, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ==========================================
// TYPES
// ==========================================

interface ToolCardProps {
  tool: ToolWithAccess
  onStart?: (toolId: string) => void
  onContinue?: (toolId: string) => void
  onViewResults?: (toolId: string) => void
  onPreview?: (toolId: string) => void
  onUpgrade?: (requiredPackage: string) => void
  className?: string
}

// ==========================================
// COMPONENT
// ==========================================

export function ToolCard({
  tool,
  onStart,
  onContinue,
  onViewResults,
  onPreview,
  onUpgrade,
  className
}: ToolCardProps) {
  const isLocked = tool.isLocked
  const isTeaser = tool.accessLevel === AccessLevel.TEASER
  const completed = isToolCompleted(tool)
  const inProgress = isToolInProgress(tool)

  const handleAction = () => {
    if (isLocked && !isTeaser) {
      onUpgrade?.(tool.requiredPackage || 'PLANNING')
      return
    }

    if (isTeaser) {
      onPreview?.(tool.id)
      return
    }

    if (completed) {
      onViewResults?.(tool.id)
      return
    }

    if (inProgress) {
      onContinue?.(tool.id)
      return
    }

    onStart?.(tool.id)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ASSESSMENT':
        return '📋'
      case 'WORKBOOK':
        return '📓'
      case 'FRAMEWORK':
        return '🧭'
      case 'REPORT':
        return '📊'
      case 'EXERCISE':
        return '💪'
      default:
        return '📄'
    }
  }

  const getStatusBadge = () => {
    if (isLocked && !isTeaser) {
      return (
        <Badge variant="outline" className="bg-muted text-charcoal-600 font-body">
          <Lock className="w-3 h-3 mr-1" />
          Locked
        </Badge>
      )
    }

    if (isTeaser) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Eye className="w-3 h-3 mr-1" />
          Preview
        </Badge>
      )
    }

    if (completed) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      )
    }

    if (inProgress) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Play className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="text-charcoal-600 font-body">
        Not Started
      </Badge>
    )
  }

  return (
    <Card variant="light" className={cn(
      "relative transition-all duration-200",
      isLocked && !isTeaser && "opacity-75 bg-muted/50",
      !isLocked && "hover:shadow-md",
      className
    )}>
      {/* Locked Overlay */}
      {isLocked && !isTeaser && (
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 rounded-lg flex items-end justify-center pb-16">
          <div className="text-center px-4">
            <Lock className="w-8 h-8 mx-auto text-charcoal-600 font-body mb-2" />
            <p className="text-sm text-charcoal-600 font-body mb-2">
              {tool.lockedMessage || `Upgrade to ${tool.requiredPackage} to unlock`}
            </p>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(tool.category)}</span>
            <div>
              <CardTitle className="text-base font-display">{tool.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Phase {tool.phase} • {tool.estimatedMinutes} min
                {tool.isMandatory && <span className="text-red-500 ml-1">*</span>}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-charcoal-600 font-body line-clamp-2">
          {tool.description}
        </p>

        {/* Progress Bar (only for accessible tools) */}
        {!isLocked && tool.progressPercent > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-charcoal-600 font-body">
              <span>Progress</span>
              <span>{tool.progressPercent}%</span>
            </div>
            <Progress value={tool.progressPercent} className="h-2" />
          </div>
        )}

        {/* Completed Date */}
        {completed && tool.completedAt && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Clock className="w-3 h-3" />
            <span>Completed {new Date(tool.completedAt).toLocaleDateString()}</span>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleAction}
          variant={isLocked && !isTeaser ? "outline" : "default"}
          className="w-full"
          size="sm"
        >
          {getToolActionLabel(tool)}
          {!isLocked && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </CardContent>
    </Card>
  )
}

// ==========================================
// LOCKED TOOL CARD (Standalone)
// ==========================================

interface LockedToolCardProps {
  tool: ToolWithAccess
  onUpgrade?: (requiredPackage: string) => void
  onPreview?: (toolId: string) => void
  className?: string
}

export function LockedToolCard({
  tool,
  onUpgrade,
  onPreview,
  className
}: LockedToolCardProps) {
  const isTeaser = tool.accessLevel === AccessLevel.TEASER

  return (
    <Card variant="light" className={cn(
      "relative overflow-hidden",
      "bg-gradient-to-br from-muted/30 to-muted/60",
      "border-dashed",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-charcoal-600 font-body" />
              <CardTitle className="text-base text-charcoal-600 font-body font-display">{tool.name}</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Phase {tool.phase} • {tool.estimatedMinutes} min
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Upgrade
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-charcoal-600 font-body line-clamp-2">
          {tool.description}
        </p>

        <div className="bg-background/60 rounded-lg p-3 text-center">
          <p className="text-sm font-medium font-display mb-1">
            Unlock with {tool.requiredPackage}
          </p>
          <p className="text-xs text-charcoal-600 font-body">
            {tool.lockedMessage || "Upgrade your package to access this tool"}
          </p>
        </div>

        <div className="flex gap-2">
          {isTeaser && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onPreview?.(tool.id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onUpgrade?.(tool.requiredPackage || 'PLANNING')}
          >
            <Lock className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
