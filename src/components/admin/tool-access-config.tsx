"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Check,
  Eye,
  Lock,
  Play,
  Settings2,
  Wrench,
} from "lucide-react"
import { toast } from "sonner"

interface PackageToolAccess {
  id: string
  toolId: string
  accessLevel: "FULL" | "VIEW_ONLY" | "TEASER" | "LOCKED"
  teaserConfig: Record<string, unknown> | null
  lockedMessage: string | null
  tool: {
    id: string
    code: string
    name: string
    category: string
  }
}

interface SegmentTool {
  toolId: string
  phaseNumber: number
  orderInPhase: number
  isMandatory: boolean
  tool: {
    id: string
    code: string
    name: string
    shortDescription: string
    category: string
  }
}

interface ToolAccessConfigProps {
  segment: string
  includedPhases: number[]
  toolAccess: PackageToolAccess[]
  onToolAccessChange: (toolAccess: PackageToolAccess[]) => void
}

const ACCESS_LEVELS = [
  {
    value: "FULL",
    label: "Full Access",
    icon: Check,
    color: "text-green-600",
    description: "User can fully interact with the tool",
  },
  {
    value: "VIEW_ONLY",
    label: "View Only",
    icon: Eye,
    color: "text-blue-600",
    description: "User can view but not interact",
  },
  {
    value: "TEASER",
    label: "Teaser",
    icon: Play,
    color: "text-amber-600",
    description: "User can preview limited content",
  },
  {
    value: "LOCKED",
    label: "Locked",
    icon: Lock,
    color: "text-gray-600",
    description: "User cannot access this tool",
  },
]

export function ToolAccessConfig({
  segment,
  includedPhases,
  toolAccess,
  onToolAccessChange,
}: ToolAccessConfigProps) {
  const [segmentTools, setSegmentTools] = useState<SegmentTool[]>([])
  const [loading, setLoading] = useState(true)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<PackageToolAccess | null>(null)
  const [teaserQuestions, setTeaserQuestions] = useState("3")
  const [lockedMessage, setLockedMessage] = useState("")

  useEffect(() => {
    fetchSegmentTools()
  }, [segment])

  const fetchSegmentTools = async () => {
    setLoading(true)
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use mock data
      const mockTools: SegmentTool[] = [
        {
          toolId: "tool-1",
          phaseNumber: 1,
          orderInPhase: 1,
          isMandatory: true,
          tool: {
            id: "tool-1",
            code: "values-assessment",
            name: "Values Assessment",
            shortDescription: "Discover your core values and motivations",
            category: "Assessment",
          },
        },
        {
          toolId: "tool-2",
          phaseNumber: 1,
          orderInPhase: 2,
          isMandatory: false,
          tool: {
            id: "tool-2",
            code: "strengths-finder",
            name: "Strengths Finder",
            shortDescription: "Identify your key strengths and talents",
            category: "Assessment",
          },
        },
        {
          toolId: "tool-3",
          phaseNumber: 2,
          orderInPhase: 1,
          isMandatory: true,
          tool: {
            id: "tool-3",
            code: "boreout-diagnostic",
            name: "Boreout Diagnostic",
            shortDescription: "Assess career engagement and satisfaction",
            category: "Assessment",
          },
        },
        {
          toolId: "tool-4",
          phaseNumber: 2,
          orderInPhase: 2,
          isMandatory: false,
          tool: {
            id: "tool-4",
            code: "career-satisfaction",
            name: "Career Satisfaction Survey",
            shortDescription: "Evaluate your overall career satisfaction",
            category: "Survey",
          },
        },
        {
          toolId: "tool-5",
          phaseNumber: 3,
          orderInPhase: 1,
          isMandatory: true,
          tool: {
            id: "tool-5",
            code: "career-explorer",
            name: "Career Path Explorer",
            shortDescription: "Explore potential career paths",
            category: "Exploration",
          },
        },
        {
          toolId: "tool-6",
          phaseNumber: 4,
          orderInPhase: 1,
          isMandatory: true,
          tool: {
            id: "tool-6",
            code: "goal-builder",
            name: "SMART Goals Builder",
            shortDescription: "Create actionable career goals",
            category: "Planning",
          },
        },
        {
          toolId: "tool-7",
          phaseNumber: 5,
          orderInPhase: 1,
          isMandatory: true,
          tool: {
            id: "tool-7",
            code: "action-planner",
            name: "Action Plan Generator",
            shortDescription: "Build your career action plan",
            category: "Planning",
          },
        },
      ]
      setSegmentTools(mockTools)
    } catch {
      toast.error("Failed to load tools")
    } finally {
      setLoading(false)
    }
  }

  const getToolAccessLevel = (toolId: string): "FULL" | "VIEW_ONLY" | "TEASER" | "LOCKED" => {
    const access = toolAccess.find((ta) => ta.toolId === toolId)
    if (access) return access.accessLevel

    // Default: FULL if phase is included, LOCKED otherwise
    const tool = segmentTools.find((st) => st.toolId === toolId)
    if (tool && includedPhases.includes(tool.phaseNumber)) {
      return "FULL"
    }
    return "LOCKED"
  }

  const handleAccessLevelChange = (toolId: string, level: "FULL" | "VIEW_ONLY" | "TEASER" | "LOCKED") => {
    const existing = toolAccess.find((ta) => ta.toolId === toolId)
    const tool = segmentTools.find((st) => st.toolId === toolId)

    if (!tool) return

    if (existing) {
      const updated = toolAccess.map((ta) =>
        ta.toolId === toolId ? { ...ta, accessLevel: level } : ta
      )
      onToolAccessChange(updated)
    } else {
      const newAccess: PackageToolAccess = {
        id: `temp-${toolId}`,
        toolId,
        accessLevel: level,
        teaserConfig: level === "TEASER" ? { questionsToShow: 3 } : null,
        lockedMessage: null,
        tool: tool.tool,
      }
      onToolAccessChange([...toolAccess, newAccess])
    }
  }

  const openConfigDialog = (toolId: string) => {
    const access = toolAccess.find((ta) => ta.toolId === toolId)
    const tool = segmentTools.find((st) => st.toolId === toolId)

    if (tool) {
      setSelectedTool(
        access || {
          id: `temp-${toolId}`,
          toolId,
          accessLevel: getToolAccessLevel(toolId),
          teaserConfig: { questionsToShow: 3 },
          lockedMessage: null,
          tool: tool.tool,
        }
      )
      setTeaserQuestions(
        (access?.teaserConfig as { questionsToShow?: number })?.questionsToShow?.toString() || "3"
      )
      setLockedMessage(access?.lockedMessage || "")
      setConfigDialogOpen(true)
    }
  }

  const saveToolConfig = () => {
    if (!selectedTool) return

    const updated = toolAccess.filter((ta) => ta.toolId !== selectedTool.toolId)
    const newConfig: PackageToolAccess = {
      ...selectedTool,
      teaserConfig:
        selectedTool.accessLevel === "TEASER"
          ? { questionsToShow: parseInt(teaserQuestions) || 3 }
          : null,
      lockedMessage: selectedTool.accessLevel === "LOCKED" ? lockedMessage || null : null,
    }
    onToolAccessChange([...updated, newConfig])
    setConfigDialogOpen(false)
    toast.success("Tool configuration saved")
  }

  // Group tools by phase
  const toolsByPhase = segmentTools.reduce((acc, tool) => {
    const phase = tool.phaseNumber
    if (!acc[phase]) acc[phase] = []
    acc[phase].push(tool)
    return acc
  }, {} as Record<number, SegmentTool[]>)

  const getAccessLevelConfig = (level: string) => {
    return ACCESS_LEVELS.find((al) => al.value === level) || ACCESS_LEVELS[3]
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <>
      <Accordion type="multiple" defaultValue={includedPhases.map((p) => `phase-${p}`)}>
        {Object.entries(toolsByPhase)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([phase, tools]) => {
            const phaseNum = parseInt(phase)
            const isPhaseIncluded = includedPhases.includes(phaseNum)

            return (
              <AccordionItem key={phase} value={`phase-${phase}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                        isPhaseIncluded
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {phase}
                    </div>
                    <span>Phase {phase}</span>
                    <Badge variant={isPhaseIncluded ? "default" : "secondary"}>
                      {tools.length} tools
                    </Badge>
                    {!isPhaseIncluded && (
                      <Badge variant="outline" className="text-gray-500">
                        <Lock className="h-3 w-3 mr-1" />
                        Phase not included
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {tools
                      .sort((a, b) => a.orderInPhase - b.orderInPhase)
                      .map((tool) => {
                        const accessLevel = getToolAccessLevel(tool.toolId)
                        const accessConfig = getAccessLevelConfig(accessLevel)
                        const AccessIcon = accessConfig.icon

                        return (
                          <div
                            key={tool.toolId}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-lg border",
                              accessLevel === "FULL" && "bg-green-50 border-green-200",
                              accessLevel === "VIEW_ONLY" && "bg-blue-50 border-blue-200",
                              accessLevel === "TEASER" && "bg-amber-50 border-amber-200",
                              accessLevel === "LOCKED" && "bg-gray-50 border-gray-200"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-lg",
                                  accessLevel === "FULL" && "bg-green-100",
                                  accessLevel === "VIEW_ONLY" && "bg-blue-100",
                                  accessLevel === "TEASER" && "bg-amber-100",
                                  accessLevel === "LOCKED" && "bg-gray-100"
                                )}
                              >
                                <Wrench className={cn("h-4 w-4", accessConfig.color)} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{tool.tool.name}</p>
                                  {tool.isMandatory && (
                                    <Badge variant="outline" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {tool.tool.shortDescription}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Select
                                value={accessLevel}
                                onValueChange={(value) =>
                                  handleAccessLevelChange(
                                    tool.toolId,
                                    value as "FULL" | "VIEW_ONLY" | "TEASER" | "LOCKED"
                                  )
                                }
                              >
                                <SelectTrigger className="w-[140px]">
                                  <AccessIcon className={cn("h-4 w-4 mr-2", accessConfig.color)} />
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ACCESS_LEVELS.map((level) => {
                                    const Icon = level.icon
                                    return (
                                      <SelectItem key={level.value} value={level.value}>
                                        <div className="flex items-center gap-2">
                                          <Icon className={cn("h-4 w-4", level.color)} />
                                          {level.label}
                                        </div>
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>

                              {(accessLevel === "TEASER" || accessLevel === "LOCKED") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openConfigDialog(tool.toolId)}
                                >
                                  <Settings2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
      </Accordion>

      {/* Tool Config Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedTool?.tool.name}</DialogTitle>
            <DialogDescription>
              Customize the access settings for this tool
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedTool?.accessLevel === "TEASER" && (
              <div className="space-y-2">
                <Label htmlFor="teaserQuestions">Preview Questions</Label>
                <Input
                  id="teaserQuestions"
                  type="number"
                  min={1}
                  max={10}
                  value={teaserQuestions}
                  onChange={(e) => setTeaserQuestions(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Number of questions to show in teaser mode (1-10)
                </p>
              </div>
            )}

            {selectedTool?.accessLevel === "LOCKED" && (
              <div className="space-y-2">
                <Label htmlFor="lockedMessage">Custom Locked Message</Label>
                <Textarea
                  id="lockedMessage"
                  placeholder="Upgrade to unlock this assessment..."
                  value={lockedMessage}
                  onChange={(e) => setLockedMessage(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the default message
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveToolConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
