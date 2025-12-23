"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ClipboardList,
  Scale,
  Compass,
  BarChart3,
  Target,
  Brain,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

type AccessLevel = "full" | "view_only" | "teaser" | "locked"

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: string
  accessLevel: AccessLevel
  progress?: number
  completed?: boolean
}

const tools: Tool[] = [
  {
    id: "bbd-assessment",
    name: "BBD Syndrome Assessment",
    description: "Identify if you're Bored, Burned out, or Dissatisfied",
    icon: Brain,
    category: "Assessment",
    accessLevel: "full",
    progress: 100,
    completed: true,
  },
  {
    id: "work-values",
    name: "Work Values Alignment",
    description: "Discover your core work values and alignment",
    icon: Scale,
    category: "Assessment",
    accessLevel: "full",
    progress: 60,
  },
  {
    id: "kp-matrix",
    name: "Knowledge-Passion Matrix",
    description: "Map your skills on the Knowledge-Passion quadrant",
    icon: Compass,
    category: "Framework",
    accessLevel: "full",
    progress: 0,
  },
  {
    id: "life-stage",
    name: "Life Stage Assessment",
    description: "Evaluate your current life stage and priorities",
    icon: BarChart3,
    category: "Assessment",
    accessLevel: "view_only",
  },
  {
    id: "career-vision",
    name: "Career Vision Canvas",
    description: "Design your ideal career vision",
    icon: Target,
    category: "Workbook",
    accessLevel: "teaser",
  },
  {
    id: "cliqi",
    name: "CLIQI Diagnostic",
    description: "Career and Life Intelligence Quotient Index",
    icon: ClipboardList,
    category: "Assessment",
    accessLevel: "locked",
  },
]

function getAccessBadge(accessLevel: AccessLevel) {
  switch (accessLevel) {
    case "full":
      return null
    case "view_only":
      return (
        <Badge variant="secondary" className="text-xs">
          View Only
        </Badge>
      )
    case "teaser":
      return (
        <Badge variant="outline" className="text-xs">
          Preview
        </Badge>
      )
    case "locked":
      return (
        <Badge variant="outline" className="text-xs bg-cream-100">
          <Lock className="w-3 h-3 mr-1" />
          Upgrade
        </Badge>
      )
  }
}

export function ToolsGrid() {
  return (
    <Card variant="light">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-display">Assessment Tools</CardTitle>
            <CardDescription>
              Complete these tools to gain career clarity
            </CardDescription>
          </div>
          <Link href="/assessments">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isAccessible =
              tool.accessLevel === "full" || tool.accessLevel === "view_only"

            return (
              <div
                key={tool.id}
                className={`relative p-4 rounded-lg border transition-all ${
                  isAccessible
                    ? "border-cream-200 hover:border-purple-300 hover:shadow-sm cursor-pointer"
                    : "border-cream-200 bg-cream-50 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tool.completed
                        ? "bg-green-100"
                        : isAccessible
                        ? "bg-purple-100"
                        : "bg-cream-200"
                    }`}
                  >
                    {tool.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isAccessible ? "text-purple-500" : "text-cream-400"
                        }`}
                      />
                    )}
                  </div>
                  {getAccessBadge(tool.accessLevel)}
                </div>

                <h4
                  className={`font-medium font-display mb-1 ${
                    isAccessible ? "text-charcoal-800" : "text-charcoal-600"
                  }`}
                >
                  {tool.name}
                </h4>
                <p className="text-xs text-charcoal-600 font-body mb-3">
                  {tool.description}
                </p>

                {tool.accessLevel === "full" && tool.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-charcoal-600 font-body">Progress</span>
                      <span className="font-medium">{tool.progress}%</span>
                    </div>
                    <Progress value={tool.progress} className="h-1.5" />
                  </div>
                )}

                {tool.accessLevel === "locked" && (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Lock className="w-3 h-3 mr-1" />
                    Upgrade to Unlock
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
