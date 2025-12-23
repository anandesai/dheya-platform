"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Battery,
  Flame,
  AlertTriangle,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  CheckCircle,
  TrendingUp,
} from "lucide-react"

interface BBDResult {
  bored: number
  burnedOut: number
  dissatisfied: number
  total: number
  level: string
  completedAt: string
}

function calculateBBDScores(responses: Record<string, number>): BBDResult {
  let bored = 0
  let burnedOut = 0
  let dissatisfied = 0

  Object.entries(responses).forEach(([key, value]) => {
    if (typeof value === "number") {
      if (key.startsWith("bored-")) bored += value
      if (key.startsWith("burnout-")) burnedOut += value
      if (key.startsWith("dissatisfied-")) dissatisfied += value
    }
  })

  const total = bored + burnedOut + dissatisfied
  let level: string

  if (total <= 25) level = "Low"
  else if (total <= 45) level = "Moderate"
  else if (total <= 60) level = "High"
  else level = "Critical"

  return {
    bored,
    burnedOut,
    dissatisfied,
    total,
    level,
    completedAt: new Date().toISOString(),
  }
}

const levelColors = {
  Low: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  Moderate: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  High: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  Critical: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
}

const recommendations = {
  Low: [
    "Your career health is good. Continue monitoring for any changes.",
    "Focus on maintaining engagement through new challenges.",
    "Consider setting stretch goals to prevent future stagnation.",
  ],
  Moderate: [
    "You're showing early signs of career stagnation. Take proactive steps now.",
    "Identify the primary source (Boredom, Burnout, or Dissatisfaction) and address it.",
    "Consider speaking with a mentor about realigning your career trajectory.",
  ],
  High: [
    "Your career health needs immediate attention.",
    "A structured intervention with a career mentor is recommended.",
    "Consider whether your current role aligns with your values and goals.",
    "Prioritize work-life balance and self-care.",
  ],
  Critical: [
    "Immediate action is required for your career wellbeing.",
    "Consider intensive mentorship and career counseling.",
    "Explore whether a career change might be beneficial.",
    "Seek support from professionals for stress management.",
    "Don't make major decisions alone - work with a mentor.",
  ],
}

export default function BBDResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<BBDResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved result
    const savedResult = localStorage.getItem("bbd-assessment-result")
    if (savedResult) {
      const parsed = JSON.parse(savedResult)
      const scores = calculateBBDScores(
        parsed.responses.reduce(
          (acc: Record<string, number>, r: { questionId: string; value: number }) => ({
            ...acc,
            [r.questionId]: r.value,
          }),
          {}
        )
      )
      setResult(scores)
    } else {
      router.push("/assessments/bbd-assessment")
    }
    setLoading(false)
  }, [router])

  if (loading || !result) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  const colors = levelColors[result.level as keyof typeof levelColors]
  const maxSingleScore = 25 // 5 questions × 5 max score
  const maxTotalScore = 75

  // Determine dominant issue
  const issues = [
    { name: "Boredom", score: result.bored, icon: Battery, color: "text-blue-500" },
    { name: "Burnout", score: result.burnedOut, icon: Flame, color: "text-orange-500" },
    { name: "Dissatisfaction", score: result.dissatisfied, icon: AlertTriangle, color: "text-red-500" },
  ]
  const sortedIssues = [...issues].sort((a, b) => b.score - a.score)
  const dominant = sortedIssues[0]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Brain className="w-8 h-8 text-purple-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-charcoal-800 font-display">
          Your BBD Assessment Results
        </h1>
        <p className="text-charcoal-600 font-body mt-2">
          Completed on {new Date(result.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Overall score card */}
      <Card className={`border-2 ${colors.border}`} variant="light">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-display">Overall BBD Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`inline-flex px-4 py-2 rounded-full ${colors.bg} ${colors.text} mb-4`}>
              <span className="font-semibold">{result.level} Severity</span>
            </div>
            <div className="text-5xl font-bold text-charcoal-800 font-display">{result.total}</div>
            <div className="text-sm text-charcoal-600 font-body">out of {maxTotalScore}</div>
          </div>

          <div className="space-y-4">
            <Progress
              value={(result.total / maxTotalScore) * 100}
              className="h-3"
            />
            <div className="flex justify-between text-xs text-charcoal-600 font-body">
              <span>Low (0-25)</span>
              <span>Moderate (26-45)</span>
              <span>High (46-60)</span>
              <span>Critical (61+)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimension breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {issues.map((issue) => {
          const Icon = issue.icon
          const percentage = Math.round((issue.score / maxSingleScore) * 100)
          const isDominant = issue.name === dominant.name

          return (
            <Card
              key={issue.name}
              className={isDominant ? "border-2 border-purple-300 shadow-md" : ""}
              variant="light"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${issue.color}`} />
                    <CardTitle className="text-lg font-display">{issue.name}</CardTitle>
                  </div>
                  {isDominant && (
                    <Badge className="bg-purple-500">Primary</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-charcoal-800 font-display">
                    {issue.score}
                  </div>
                  <div className="text-sm text-charcoal-600 font-body">
                    out of {maxSingleScore}
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="text-center mt-2 text-sm text-charcoal-600 font-body">
                  {percentage}%
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Insights */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-charcoal-800 mb-2 font-display">
              Your Primary Challenge: {dominant.name}
            </h4>
            <p className="text-sm text-charcoal-600">
              {dominant.name === "Boredom" &&
                "You're experiencing a lack of challenge and stimulation in your work. Your skills may be underutilized, and you need new growth opportunities."}
              {dominant.name === "Burnout" &&
                "You're experiencing exhaustion and emotional depletion from work. Your energy reserves are depleted, and you need to restore work-life balance."}
              {dominant.name === "Dissatisfaction" &&
                "There's a mismatch between your values and your current work situation. You may feel undervalued or see limited growth opportunities."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Recommended Actions
          </CardTitle>
          <CardDescription className="text-charcoal-600 font-body">
            Based on your {result.level.toLowerCase()} severity score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations[result.level as keyof typeof recommendations].map(
              (rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    {index + 1}
                  </span>
                  <span className="text-charcoal-600">{rec}</span>
                </li>
              )
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Next steps */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50" variant="light">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-800 text-lg mb-2 font-display">
                Ready to Take Action?
              </h3>
              <p className="text-charcoal-600 font-body">
                Book a session with a career mentor to discuss your results and
                create a personalized action plan.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sessions/book">
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Session
                </Button>
              </Link>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-between">
        <Link href="/assessments">
          <Button variant="ghost">
            Back to Assessments
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Link href="/assessments/work-values">
            <Button className="bg-purple-500 hover:bg-purple-600">
              Next Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
