"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Scale,
  Compass,
  Target,
  BarChart3,
  ClipboardList,
  Lock,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react"

type AccessLevel = "full" | "view_only" | "teaser" | "locked"

interface Assessment {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: "assessment" | "workbook" | "framework"
  estimatedTime: number
  accessLevel: AccessLevel
  progress?: number
  completed?: boolean
  segments: string[]
}

const assessments: Assessment[] = [
  {
    id: "bbd",
    name: "BBD Syndrome Assessment",
    description:
      "Identify if you're Bored, Burned out, or Dissatisfied with your career",
    icon: Brain,
    category: "assessment",
    estimatedTime: 15,
    accessLevel: "full",
    progress: 0,
    segments: ["MID_CAREER"],
  },
  {
    id: "work-values",
    name: "Work Values Assessment",
    description: "Discover your core work values and how aligned they are",
    icon: Scale,
    category: "assessment",
    estimatedTime: 20,
    accessLevel: "full",
    segments: ["EARLY_CAREER", "MID_CAREER", "SENIOR", "RETURNING_WOMEN"],
  },
  {
    id: "kp-matrix",
    name: "Knowledge-Passion Matrix",
    description: "Map your skills on the Knowledge vs Passion quadrant",
    icon: Compass,
    category: "framework",
    estimatedTime: 25,
    accessLevel: "full",
    segments: ["MID_CAREER", "SENIOR"],
  },
  {
    id: "cliqi",
    name: "CLIQI Diagnostic",
    description: "Career and Life Intelligence Quotient assessment",
    icon: ClipboardList,
    category: "assessment",
    estimatedTime: 30,
    accessLevel: "full",
    segments: ["EARLY_CAREER", "MID_CAREER", "SENIOR", "RETURNING_WOMEN"],
  },
  {
    id: "career-vision",
    name: "Career Vision Canvas",
    description: "Design your ideal career vision with structured exercises",
    icon: Target,
    category: "workbook",
    estimatedTime: 45,
    accessLevel: "teaser",
    segments: ["EARLY_CAREER", "MID_CAREER"],
  },
  {
    id: "life-stage",
    name: "Life Stage Assessment",
    description: "Evaluate your current life stage and career alignment",
    icon: BarChart3,
    category: "assessment",
    estimatedTime: 20,
    accessLevel: "locked",
    segments: ["MID_CAREER", "SENIOR"],
  },
]

const categoryLabels = {
  assessment: "Assessment",
  workbook: "Workbook",
  framework: "Framework",
}

const categoryColors = {
  assessment: "bg-purple-100 text-purple-700",
  workbook: "bg-sage-100 text-sage-700",
  framework: "bg-green-100 text-green-700",
}

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

export default function AssessmentsPage() {
  const [segment, setSegment] = useState<string>("MID_CAREER")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const storedSegment = localStorage.getItem("selectedSegment")
    if (storedSegment) {
      setSegment(storedSegment)
    }
  }, [])

  // Filter assessments based on segment and tab
  const filteredAssessments = assessments.filter((a) => {
    const segmentMatch = a.segments.includes(segment)
    const categoryMatch = activeTab === "all" || a.category === activeTab
    return segmentMatch && categoryMatch
  })

  const completedCount = assessments.filter((a) => a.completed).length
  const totalCount = assessments.filter((a) => a.segments.includes(segment)).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-charcoal-800">
          Assessment Tools
        </h1>
        <p className="text-charcoal-600 font-body mt-1">
          Complete these assessments to gain clarity about your career journey
        </p>
      </div>

      {/* Progress overview */}
      <Card variant="light" className="border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold font-display text-charcoal-800 mb-2">
                Your Assessment Progress
              </h3>
              <div className="flex items-center gap-4">
                <Progress
                  value={(completedCount / totalCount) * 100}
                  className="flex-1 h-2"
                />
                <span className="text-sm font-medium text-purple-600">
                  {completedCount}/{totalCount} completed
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="assessment">Assessments</TabsTrigger>
          <TabsTrigger value="workbook">Workbooks</TabsTrigger>
          <TabsTrigger value="framework">Frameworks</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => {
              const Icon = assessment.icon
              const isAccessible =
                assessment.accessLevel === "full" ||
                assessment.accessLevel === "view_only"

              return (
                <Card
                  key={assessment.id}
                  variant="light"
                  className={`relative transition-all ${isAccessible
                    ? "hover:shadow-md hover:border-purple-300"
                    : "opacity-75"
                    }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${assessment.completed
                          ? "bg-green-100"
                          : isAccessible
                            ? "bg-purple-100"
                            : "bg-cream-200"
                          }`}
                      >
                        {assessment.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Icon
                            className={`w-6 h-6 ${isAccessible
                              ? "text-purple-600"
                              : "text-cream-400"
                              }`}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={categoryColors[assessment.category]}
                          variant="secondary"
                        >
                          {categoryLabels[assessment.category]}
                        </Badge>
                        {getAccessBadge(assessment.accessLevel)}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-display mt-3">
                      {assessment.name}
                    </CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-charcoal-600 font-body">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {assessment.estimatedTime} min
                      </span>
                    </div>

                    {assessment.progress !== undefined &&
                      assessment.accessLevel === "full" && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-charcoal-600 font-body">
                              Progress
                            </span>
                            <span className="font-medium">
                              {assessment.progress}%
                            </span>
                          </div>
                          <Progress
                            value={assessment.progress}
                            className="h-1.5"
                          />
                        </div>
                      )}

                    {assessment.accessLevel === "full" ? (
                      <Link href={`/assessments/${assessment.id}`}>
                        <Button className="w-full bg-purple-500 hover:bg-purple-600">
                          {assessment.progress
                            ? assessment.progress > 0
                              ? "Continue"
                              : "Start"
                            : "Start"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : assessment.accessLevel === "view_only" ? (
                      <Link href={`/assessments/${assessment.id}/preview`}>
                        <Button variant="outline" className="w-full">
                          View Sample
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : assessment.accessLevel === "teaser" ? (
                      <Link href={`/assessments/${assessment.id}/preview`}>
                        <Button variant="outline" className="w-full">
                          Preview
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <Lock className="mr-2 h-4 w-4" />
                        Upgrade to Access
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredAssessments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-charcoal-600 font-body">
                No tools available for this category.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
