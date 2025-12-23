"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, Lock, Unlock, Info } from "lucide-react"

interface PackagePhase {
  id: string
  phaseNumber: number
  isIncluded: boolean
  customName: string | null
}

interface PhaseSelectorProps {
  tier: "GUIDANCE" | "PLANNING" | "MENTORSHIP"
  phases: PackagePhase[]
  onPhasesChange: (phases: PackagePhase[]) => void
}

// Default phase configuration based on tier
const TIER_PHASES = {
  GUIDANCE: [1, 2],
  PLANNING: [1, 2, 3, 4, 5],
  MENTORSHIP: [1, 2, 3, 4, 5, 6, 7],
}

// Phase descriptions
const PHASE_INFO = [
  {
    number: 1,
    name: "Self-Discovery",
    description: "Understanding personal values, strengths, and motivations",
    tools: ["Values Assessment", "Strengths Finder", "Motivation Mapper"],
  },
  {
    number: 2,
    name: "Career Assessment",
    description: "Evaluating current career situation and satisfaction",
    tools: ["Boreout Diagnostic", "Career Satisfaction Survey", "Skills Gap Analysis"],
  },
  {
    number: 3,
    name: "Exploration",
    description: "Exploring career options and opportunities",
    tools: ["Career Path Explorer", "Industry Research Guide", "Opportunity Mapper"],
  },
  {
    number: 4,
    name: "Goal Setting",
    description: "Defining clear career goals and objectives",
    tools: ["SMART Goals Builder", "Vision Board", "Milestone Planner"],
  },
  {
    number: 5,
    name: "Action Planning",
    description: "Creating actionable steps toward career goals",
    tools: ["Action Plan Generator", "Resource Finder", "Timeline Builder"],
  },
  {
    number: 6,
    name: "Implementation",
    description: "Executing the career plan with mentor support",
    tools: ["Progress Tracker", "Mentor Check-ins", "Accountability Partner"],
  },
  {
    number: 7,
    name: "Sustaining Success",
    description: "Maintaining momentum and continuous growth",
    tools: ["Success Journal", "Growth Tracker", "Career Health Check"],
  },
]

export function PhaseSelector({
  tier,
  phases,
  onPhasesChange,
}: PhaseSelectorProps) {
  const [localPhases, setLocalPhases] = useState<PackagePhase[]>(phases)

  useEffect(() => {
    // Initialize phases if empty
    if (phases.length === 0) {
      const defaultPhases = PHASE_INFO.map((phase) => ({
        id: `temp-${phase.number}`,
        phaseNumber: phase.number,
        isIncluded: TIER_PHASES[tier].includes(phase.number),
        customName: null,
      }))
      setLocalPhases(defaultPhases)
      onPhasesChange(defaultPhases)
    } else {
      setLocalPhases(phases)
    }
  }, [phases, tier, onPhasesChange])

  const handlePhaseToggle = (phaseNumber: number) => {
    const updated = localPhases.map((phase) => {
      if (phase.phaseNumber === phaseNumber) {
        return { ...phase, isIncluded: !phase.isIncluded }
      }
      return phase
    })
    setLocalPhases(updated)
    onPhasesChange(updated)
  }

  const handleCustomNameChange = (phaseNumber: number, customName: string) => {
    const updated = localPhases.map((phase) => {
      if (phase.phaseNumber === phaseNumber) {
        return { ...phase, customName: customName || null }
      }
      return phase
    })
    setLocalPhases(updated)
    onPhasesChange(updated)
  }

  const applyTierDefaults = () => {
    const updated = localPhases.map((phase) => ({
      ...phase,
      isIncluded: TIER_PHASES[tier].includes(phase.phaseNumber),
    }))
    setLocalPhases(updated)
    onPhasesChange(updated)
  }

  const includedCount = localPhases.filter((p) => p.isIncluded).length
  const tierDefault = TIER_PHASES[tier].length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Phase Configuration</CardTitle>
            <CardDescription>
              Select which phases are included in this package
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{includedCount}</span> of{" "}
              {PHASE_INFO.length} phases included
            </div>
            <Button variant="outline" size="sm" onClick={applyTierDefaults}>
              Apply {tier} Defaults ({tierDefault} phases)
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {PHASE_INFO.map((phaseInfo) => {
            const phase = localPhases.find((p) => p.phaseNumber === phaseInfo.number)
            const isIncluded = phase?.isIncluded ?? false
            const isTierDefault = TIER_PHASES[tier].includes(phaseInfo.number)

            return (
              <div
                key={phaseInfo.number}
                className={cn(
                  "relative rounded-lg border p-4 transition-all",
                  isIncluded
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-gray-50/50",
                  !isTierDefault && isIncluded && "border-amber-400 bg-amber-50/50"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Phase Number Badge */}
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full font-semibold",
                      isIncluded
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {phaseInfo.number}
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{phaseInfo.name}</h3>
                      {isIncluded ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Unlock className="h-3 w-3 mr-1" />
                          Included
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                      {!isTierDefault && isIncluded && (
                        <Badge className="bg-amber-100 text-amber-800">
                          <Info className="h-3 w-3 mr-1" />
                          Above Tier Default
                        </Badge>
                      )}
                      {isTierDefault && !isIncluded && (
                        <Badge variant="destructive">
                          Below Tier Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {phaseInfo.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {phaseInfo.tools.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>

                    {/* Custom Name Input */}
                    {isIncluded && (
                      <div className="mt-3 pt-3 border-t">
                        <Label
                          htmlFor={`custom-name-${phaseInfo.number}`}
                          className="text-xs text-muted-foreground"
                        >
                          Custom Phase Name (optional)
                        </Label>
                        <Input
                          id={`custom-name-${phaseInfo.number}`}
                          placeholder={phaseInfo.name}
                          value={phase?.customName || ""}
                          onChange={(e) =>
                            handleCustomNameChange(phaseInfo.number, e.target.value)
                          }
                          className="mt-1 max-w-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center">
                    <Checkbox
                      id={`phase-${phaseInfo.number}`}
                      checked={isIncluded}
                      onCheckedChange={() => handlePhaseToggle(phaseInfo.number)}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Phase Summary</h4>
          <div className="flex flex-wrap gap-2">
            {localPhases
              .filter((p) => p.isIncluded)
              .sort((a, b) => a.phaseNumber - b.phaseNumber)
              .map((phase) => {
                const info = PHASE_INFO.find((p) => p.number === phase.phaseNumber)
                return (
                  <Badge key={phase.phaseNumber} className="bg-primary text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Phase {phase.phaseNumber}: {phase.customName || info?.name}
                  </Badge>
                )
              })}
            {includedCount === 0 && (
              <p className="text-sm text-muted-foreground">
                No phases selected. Select at least one phase.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
