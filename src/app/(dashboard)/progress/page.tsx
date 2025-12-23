"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Trophy,
  BookOpen,
  Calendar,
  TrendingUp,
  CheckCircle,
  Star,
  Loader2,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface ProgressData {
  user: {
    id: string
    name: string
    segment: string | null
    currentPhase: number | null
  }
  package: {
    id: string
    name: string
    tier: string
    totalPhases: number
  } | null
  progress: {
    phaseProgress: number
    currentPhase: number
    totalPhases: number
    completedTools: number
    inProgressTools: number
    totalSessions: number
  }
  toolResults: {
    id: string
    toolName: string
    toolCode: string
    completedAt: string
    scores: Record<string, unknown> | null
  }[]
  cliqiHistory: {
    date: string
    scores: Record<string, unknown> | null
  }[]
  milestones: {
    title: string
    date: string
    type: string
  }[]
}

const PHASE_NAMES = [
  "Discovery",
  "Assessment",
  "Planning",
  "Development",
  "Action",
  "Integration",
]

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/user/progress")
      if (!response.ok) throw new Error("Failed to fetch progress")
      const progressData = await response.json()
      setData(progressData)
    } catch (error) {
      console.error("Error fetching progress:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-charcoal-600 font-body">Failed to load progress data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-charcoal-800">My Progress</h1>
        <p className="text-charcoal-600 font-body">
          Track your journey and see how far you&apos;ve come
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card variant="light" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-display text-purple-100">
              Journey Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.progress.phaseProgress}%</div>
            <Progress
              value={data.progress.phaseProgress}
              className="mt-2 bg-purple-400"
            />
          </CardContent>
        </Card>
        <Card variant="light">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-display text-charcoal-600 font-body">
              Current Phase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              Phase {data.progress.currentPhase}
            </div>
            <p className="text-sm text-charcoal-600 font-body">
              {PHASE_NAMES[data.progress.currentPhase - 1] || "In Progress"}
            </p>
          </CardContent>
        </Card>
        <Card variant="light">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-display text-charcoal-600 font-body">
              Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.progress.completedTools}
            </div>
            <p className="text-sm text-charcoal-600 font-body">
              {data.progress.inProgressTools} in progress
            </p>
          </CardContent>
        </Card>
        <Card variant="light">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-display text-charcoal-600 font-body">
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.progress.totalSessions}
            </div>
            <p className="text-sm text-charcoal-600 font-body">completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Journey Phase Tracker */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Target className="h-5 w-5 text-purple-500" />
            Your Journey Phases
          </CardTitle>
          <CardDescription>
            {data.package?.name || "Career Development Journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {PHASE_NAMES.slice(0, data.progress.totalPhases).map((phase, index) => {
                const phaseNum = index + 1
                const isCompleted = phaseNum < data.progress.currentPhase
                const isCurrent = phaseNum === data.progress.currentPhase
                const isLocked = phaseNum > data.progress.currentPhase

                return (
                  <div key={phase} className="relative flex items-start gap-4 pl-4">
                    <div
                      className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-purple-500 text-white ring-4 ring-purple-100"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{phaseNum}</span>
                      )}
                    </div>
                    <div className="ml-8 flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium font-display ${
                            isLocked ? "text-gray-400" : "text-charcoal-800"
                          }`}
                        >
                          Phase {phaseNum}: {phase}
                        </h3>
                        {isCurrent && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Current
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          isLocked ? "text-gray-400" : "text-charcoal-600 font-body"
                        }`}
                      >
                        {getPhaseDescription(phaseNum)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Completed Assessments */}
        <Card variant="light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <BookOpen className="h-5 w-5 text-green-600" />
              Completed Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.toolResults.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-charcoal-600 font-body">No assessments completed yet</p>
                <Link
                  href="/assessments"
                  className="text-purple-500 hover:underline text-sm mt-2 inline-block"
                >
                  Start an assessment
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.toolResults.slice(0, 5).map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{result.toolName}</p>
                      <p className="text-xs text-charcoal-600 font-body">
                        {format(new Date(result.completedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Link href={`/assessments/${result.toolCode}/results`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50"
                      >
                        View Results
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Badge>
                    </Link>
                  </div>
                ))}
                {data.toolResults.length > 5 && (
                  <Link
                    href="/assessments"
                    className="block text-center text-purple-500 hover:underline text-sm"
                  >
                    View all {data.toolResults.length} assessments
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card variant="light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Trophy className="h-5 w-5 text-amber-500" />
              Milestones Achieved
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.milestones.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-charcoal-600 font-body">
                  Complete activities to earn milestones
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      {getMilestoneIcon(milestone.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{milestone.title}</p>
                      <p className="text-xs text-charcoal-600 font-body">
                        {format(new Date(milestone.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CLIQI Score History (if available) */}
      {data.cliqiHistory.length > 0 && (
        <Card variant="light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              CLIQI Score Progress
            </CardTitle>
            <CardDescription>
              Track your Career Life Intelligence Quotient over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-charcoal-600 font-body">
              <p>Score visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/assessments">
          <Card variant="light" className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Continue Assessments</p>
                <p className="text-sm text-charcoal-600 font-body">
                  {data.progress.inProgressTools} in progress
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/sessions/book">
          <Card variant="light" className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Book a Session</p>
                <p className="text-sm text-charcoal-600 font-body">
                  Meet with your mentor
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard">
          <Card variant="light" className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">View Dashboard</p>
                <p className="text-sm text-charcoal-600 font-body">
                  See your full journey
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

function getPhaseDescription(phase: number): string {
  const descriptions: Record<number, string> = {
    1: "Understand your current situation and define your goals",
    2: "Complete assessments to gain self-awareness",
    3: "Create your personalized career development plan",
    4: "Build skills and competencies for your target role",
    5: "Execute your plan and make progress toward goals",
    6: "Integrate learnings and establish new habits",
  }
  return descriptions[phase] || "Continue your development journey"
}

function getMilestoneIcon(type: string) {
  switch (type) {
    case "onboarding":
      return <Star className="h-5 w-5 text-amber-600" />
    case "assessment":
      return <BookOpen className="h-5 w-5 text-amber-600" />
    case "session":
      return <Calendar className="h-5 w-5 text-amber-600" />
    default:
      return <Trophy className="h-5 w-5 text-amber-600" />
  }
}
