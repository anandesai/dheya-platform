"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Flame,
  Battery,
  Heart,
  Lightbulb,
  Compass,
} from "lucide-react"

// BBD Score Widget (Mid-Career)
export function BBDScoreWidget() {
  const scores = {
    bored: 7,
    burnedOut: 4,
    dissatisfied: 8,
  }
  const totalScore = scores.bored + scores.burnedOut + scores.dissatisfied
  const maxScore = 30

  const getScoreLevel = (score: number) => {
    if (score <= 5) return { level: "Low", color: "text-green-600", bg: "bg-green-100" }
    if (score <= 10) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" }
    if (score <= 15) return { level: "High", color: "text-orange-600", bg: "bg-orange-100" }
    return { level: "Critical", color: "text-red-600", bg: "bg-red-100" }
  }

  const overallLevel = getScoreLevel(totalScore)

  return (
    <Card variant="light">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">BBD Syndrome Score</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${overallLevel.bg} ${overallLevel.color}`}>
            {overallLevel.level}
          </span>
        </div>
        <CardDescription>Bored, Burned out, Dissatisfied</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall score */}
        <div className="text-center py-4">
          <div className="text-4xl font-bold text-charcoal-800">{totalScore}</div>
          <div className="text-sm text-charcoal-600 font-body">out of {maxScore}</div>
        </div>

        {/* Individual scores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Bored</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(scores.bored / 10) * 100} className="w-24 h-2" />
              <span className="text-sm font-medium w-6">{scores.bored}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Burned Out</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(scores.burnedOut / 10) * 100} className="w-24 h-2" />
              <span className="text-sm font-medium w-6">{scores.burnedOut}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm">Dissatisfied</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(scores.dissatisfied / 10) * 100} className="w-24 h-2" />
              <span className="text-sm font-medium w-6">{scores.dissatisfied}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-charcoal-600 font-body border-t">
          <strong>Recommendation:</strong> Focus on addressing dissatisfaction through values alignment.
        </div>
      </CardContent>
    </Card>
  )
}

// Values Alignment Widget (All segments)
export function ValuesAlignmentWidget() {
  const alignment = 62

  return (
    <Card variant="light">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Values Alignment</CardTitle>
          {alignment < 70 ? (
            <TrendingDown className="w-5 h-5 text-orange-500" />
          ) : (
            <TrendingUp className="w-5 h-5 text-green-500" />
          )}
        </div>
        <CardDescription>How well your role matches your values</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-cream-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(alignment / 100) * 352} 352`}
                className="text-purple-500"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-3xl font-bold text-charcoal-800">{alignment}%</div>
              <div className="text-xs text-charcoal-600 font-body">Aligned</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Top Value: Growth</span>
            <span className="text-green-600">85%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Low Match: Autonomy</span>
            <span className="text-orange-600">35%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// CLIQI Score Widget (All segments)
export function CLIQIWidget() {
  const dimensions = [
    { name: "Self-Awareness", score: 78, icon: Heart },
    { name: "Opportunity Awareness", score: 65, icon: Compass },
    { name: "Goal Clarity", score: 82, icon: Target },
    { name: "Planning Capability", score: 55, icon: Lightbulb },
    { name: "Decision Confidence", score: 70, icon: CheckCircle },
  ]

  const averageScore = Math.round(
    dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length
  )

  return (
    <Card variant="light">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">CLIQI Score</CardTitle>
          <span className="text-2xl font-bold text-purple-500">{averageScore}</span>
        </div>
        <CardDescription>Career & Life Intelligence Quotient</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dimensions.map((dim) => {
            const Icon = dim.icon
            return (
              <div key={dim.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-500" />
                    <span>{dim.name}</span>
                  </div>
                  <span className="font-medium">{dim.score}</span>
                </div>
                <Progress value={dim.score} className="h-1.5" />
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-charcoal-600 font-body">
          <strong>Insight:</strong> Focus on improving Planning Capability for better career outcomes.
        </div>
      </CardContent>
    </Card>
  )
}

// Early Career specific widgets
export function PossibilityMatrixWidget() {
  return (
    <Card variant="light">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Possibility Matrix</CardTitle>
        <CardDescription>Your career exploration results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-xs text-charcoal-600 font-body">Careers Explored</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">5</div>
            <div className="text-xs text-charcoal-600 font-body">Top Matches</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-xs text-charcoal-600 font-body">Industries</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">78%</div>
            <div className="text-xs text-charcoal-600 font-body">Trend Alignment</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Senior specific widgets
export function LegacyVisionWidget() {
  const paths = [
    { name: "Corporate Advisory", readiness: 85 },
    { name: "Entrepreneurship", readiness: 60 },
    { name: "Social Impact", readiness: 75 },
    { name: "Knowledge Legacy", readiness: 90 },
  ]

  return (
    <Card variant="light">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Legacy Pathways</CardTitle>
        <CardDescription>Your second innings readiness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paths.map((path) => (
          <div key={path.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{path.name}</span>
              <span className="font-medium">{path.readiness}%</span>
            </div>
            <Progress value={path.readiness} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Returning Women specific widgets
export function ConfidenceScoreWidget() {
  const confidenceScore = 72
  const previousScore = 58

  return (
    <Card variant="light">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Confidence Score</CardTitle>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+{confidenceScore - previousScore}%</span>
          </div>
        </div>
        <CardDescription>Your career re-entry confidence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-purple-500">{confidenceScore}</div>
          <div className="text-sm text-charcoal-600 font-body">out of 100</div>
          <div className="mt-2 text-xs text-green-600">
            Up from {previousScore} when you started
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-cream-50 rounded-lg">
            <div className="text-lg font-bold text-charcoal-800">4</div>
            <div className="text-xs text-charcoal-600 font-body">Skills Updated</div>
          </div>
          <div className="text-center p-3 bg-cream-50 rounded-lg">
            <div className="text-lg font-bold text-charcoal-800">85%</div>
            <div className="text-xs text-charcoal-600 font-body">Re-entry Ready</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
