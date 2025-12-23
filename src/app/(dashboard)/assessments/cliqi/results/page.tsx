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
  Target,
  Compass,
  Map,
  TrendingUp,
  Zap,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Award,
  BookOpen,
} from "lucide-react"

interface CLIQIResult {
  selfAwareness: number
  opportunityAwareness: number
  goalClarity: number
  planningCapability: number
  decisionConfidence: number
  overall: number
  level: string
  completedAt: string
}

function calculateCLIQIScores(responses: Record<string, number>): CLIQIResult {
  let selfAwareness = 0
  let opportunityAwareness = 0
  let goalClarity = 0
  let planningCapability = 0
  let decisionConfidence = 0

  Object.entries(responses).forEach(([key, value]) => {
    if (typeof value === "number") {
      if (key.startsWith("sa-")) selfAwareness += value
      if (key.startsWith("oa-")) opportunityAwareness += value
      if (key.startsWith("gc-")) goalClarity += value
      if (key.startsWith("pc-")) planningCapability += value
      if (key.startsWith("dc-")) decisionConfidence += value
    }
  })

  // Convert to 0-100 scale (each dimension: 5 questions × 5 max = 25, multiply by 4 to get 100)
  selfAwareness = Math.round((selfAwareness / 25) * 100)
  opportunityAwareness = Math.round((opportunityAwareness / 25) * 100)
  goalClarity = Math.round((goalClarity / 25) * 100)
  planningCapability = Math.round((planningCapability / 25) * 100)
  decisionConfidence = Math.round((decisionConfidence / 25) * 100)

  const overall = Math.round(
    (selfAwareness + opportunityAwareness + goalClarity + planningCapability + decisionConfidence) / 5
  )

  let level: string
  if (overall <= 40) level = "Developing"
  else if (overall <= 60) level = "Emerging"
  else if (overall <= 80) level = "Proficient"
  else level = "Advanced"

  return {
    selfAwareness,
    opportunityAwareness,
    goalClarity,
    planningCapability,
    decisionConfidence,
    overall,
    level,
    completedAt: new Date().toISOString(),
  }
}

const levelColors = {
  Developing: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  Emerging: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  Proficient: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  Advanced: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
}

const dimensionInfo = {
  selfAwareness: {
    icon: Target,
    name: "Self-Awareness",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    description: "Understanding of your values, strengths, and interests",
    lowGuidance: "Focus on self-reflection and identifying your core values and natural talents.",
    highGuidance: "Continue leveraging your strong self-understanding in career decisions.",
  },
  opportunityAwareness: {
    icon: Compass,
    name: "Opportunity Awareness",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    description: "Knowledge of career options and market conditions",
    lowGuidance: "Research different career paths and stay current with industry trends.",
    highGuidance: "Use your market knowledge to identify emerging opportunities proactively.",
  },
  goalClarity: {
    icon: Map,
    name: "Goal Clarity",
    color: "text-green-500",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    description: "Clear vision of your career objectives",
    lowGuidance: "Work with a mentor to define specific, achievable career goals.",
    highGuidance: "Your clear goals provide strong direction. Stay focused on execution.",
  },
  planningCapability: {
    icon: TrendingUp,
    name: "Planning Capability",
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
    description: "Ability to create and execute career plans",
    lowGuidance: "Break down goals into actionable steps with timelines and milestones.",
    highGuidance: "Your planning strength positions you well for career advancement.",
  },
  decisionConfidence: {
    icon: Zap,
    name: "Decision Confidence",
    color: "text-red-500",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    description: "Confidence in making career decisions",
    lowGuidance: "Build confidence through informed decision-making and mentor support.",
    highGuidance: "Your decision confidence enables bold career moves when opportunities arise.",
  },
}

const recommendations = {
  Developing: [
    "Work closely with a career mentor to build foundational career awareness and planning skills.",
    "Focus on self-discovery: identify your values, strengths, and career interests through assessments and reflection.",
    "Research career options systematically and explore different paths before committing to decisions.",
    "Start with small, achievable goals to build confidence and momentum in your career development.",
  ],
  Emerging: [
    "Continue developing your career intelligence by addressing your lowest-scoring dimensions first.",
    "Create a structured career development plan with specific milestones and accountability measures.",
    "Expand your professional network to gain insights about career opportunities and industry trends.",
    "Practice making career decisions using a systematic approach to build confidence over time.",
  ],
  Proficient: [
    "You have strong career intelligence. Focus on execution and taking action on your plans.",
    "Consider specializing or going deeper in areas where you want to excel professionally.",
    "Share your career insights with others and consider informal mentoring opportunities.",
    "Continue refining your approach based on outcomes and lessons learned from experience.",
  ],
  Advanced: [
    "You demonstrate exceptional career intelligence. Leverage this for ambitious career goals.",
    "Consider formal mentoring roles to help others develop their career intelligence.",
    "Focus on strategic career moves that align with your long-term vision and values.",
    "Share your expertise through thought leadership, writing, or speaking opportunities.",
  ],
}

export default function CLIQIResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<CLIQIResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedResult = localStorage.getItem("cliqi-assessment-result")
    if (savedResult) {
      const parsed = JSON.parse(savedResult)
      const scores = calculateCLIQIScores(
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
      router.push("/assessments/cliqi")
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

  const dimensions = [
    { key: "selfAwareness" as const, value: result.selfAwareness },
    { key: "opportunityAwareness" as const, value: result.opportunityAwareness },
    { key: "goalClarity" as const, value: result.goalClarity },
    { key: "planningCapability" as const, value: result.planningCapability },
    { key: "decisionConfidence" as const, value: result.decisionConfidence },
  ]

  const sortedDimensions = [...dimensions].sort((a, b) => a.value - b.value)
  const lowestDimension = sortedDimensions[0]
  const highestDimension = sortedDimensions[sortedDimensions.length - 1]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Brain className="w-8 h-8 text-purple-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-charcoal-800 font-display">
          Your CLIQI Results
        </h1>
        <p className="text-charcoal-600 font-body mt-2">
          Career Life Intelligence Quotient Index
        </p>
        <p className="text-sm text-charcoal-500 font-body">
          Completed on {new Date(result.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Overall score card */}
      <Card className={`border-2 ${colors.border}`} variant="light">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-display">Overall CLIQI Score</CardTitle>
          <CardDescription className="font-body">
            Average across all five dimensions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`inline-flex px-4 py-2 rounded-full ${colors.bg} ${colors.text} mb-4`}>
              <Award className="w-4 h-4 mr-2" />
              <span className="font-semibold">{result.level} Level</span>
            </div>
            <div className="text-6xl font-bold text-charcoal-800 font-display">{result.overall}</div>
            <div className="text-sm text-charcoal-600 font-body">out of 100</div>
          </div>

          <div className="space-y-4">
            <Progress value={result.overall} className="h-3" />
            <div className="flex justify-between text-xs text-charcoal-600 font-body">
              <span>Developing (0-40)</span>
              <span>Emerging (41-60)</span>
              <span>Proficient (61-80)</span>
              <span>Advanced (81-100)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar chart representation */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="font-display">Dimension Breakdown</CardTitle>
          <CardDescription className="font-body">
            Your scores across the five CLIQI dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map(({ key, value }) => {
              const info = dimensionInfo[key]
              const Icon = info.icon
              const isLowest = key === lowestDimension.key
              const isHighest = key === highestDimension.key

              return (
                <Card
                  key={key}
                  className={`${
                    isLowest
                      ? "border-2 border-orange-300 bg-orange-50"
                      : isHighest
                      ? "border-2 border-green-300 bg-green-50"
                      : ""
                  }`}
                  variant="light"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${info.color}`} />
                        <CardTitle className="text-base font-display">{info.name}</CardTitle>
                      </div>
                      {isLowest && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Focus Area
                        </Badge>
                      )}
                      {isHighest && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Strength
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-charcoal-800 font-display">
                        {value}
                      </div>
                      <div className="text-xs text-charcoal-600 font-body">out of 100</div>
                    </div>
                    <Progress value={value} className="h-2" />
                    <p className="text-xs text-charcoal-600 font-body leading-relaxed">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="light" className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Focus Area
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = dimensionInfo[lowestDimension.key].icon
                return <Icon className={`w-5 h-5 ${dimensionInfo[lowestDimension.key].color}`} />
              })()}
              <h4 className="font-semibold text-charcoal-800 font-display">
                {dimensionInfo[lowestDimension.key].name} ({lowestDimension.value}/100)
              </h4>
            </div>
            <p className="text-sm text-charcoal-600 font-body leading-relaxed">
              {dimensionInfo[lowestDimension.key].lowGuidance}
            </p>
          </CardContent>
        </Card>

        <Card variant="light" className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Key Strength
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = dimensionInfo[highestDimension.key].icon
                return <Icon className={`w-5 h-5 ${dimensionInfo[highestDimension.key].color}`} />
              })()}
              <h4 className="font-semibold text-charcoal-800 font-display">
                {dimensionInfo[highestDimension.key].name} ({highestDimension.value}/100)
              </h4>
            </div>
            <p className="text-sm text-charcoal-600 font-body leading-relaxed">
              {dimensionInfo[highestDimension.key].highGuidance}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed dimension insights */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Dimension-Specific Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dimensions.map(({ key, value }) => {
            const info = dimensionInfo[key]
            const Icon = info.icon
            const guidance = value < 60 ? info.lowGuidance : info.highGuidance

            return (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  value < 60 ? info.borderColor + " bg-opacity-10" : "border-cream-200 bg-cream-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${info.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-charcoal-800 font-display">{info.name}</h4>
                      <Badge variant="outline">{value}/100</Badge>
                    </div>
                    <p className="text-sm text-charcoal-600 font-body leading-relaxed">{guidance}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <CheckCircle className="w-5 h-5 text-purple-500" />
            Recommended Actions
          </CardTitle>
          <CardDescription className="text-charcoal-600 font-body">
            Based on your {result.level.toLowerCase()} level career intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations[result.level as keyof typeof recommendations].map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                  {index + 1}
                </span>
                <span className="text-charcoal-600 font-body leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Benchmark comparison placeholder */}
      <Card variant="light" className="border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-800 text-lg mb-2 font-display">
                How You Compare
              </h3>
              <p className="text-charcoal-600 font-body mb-4">
                Your overall CLIQI score of {result.overall} places you in the {result.level.toLowerCase()} category.
                This represents strong career intelligence development{" "}
                {result.overall >= 61 && "with excellent"}{" "}
                {result.overall >= 41 && result.overall < 61 && "with good"}{" "}
                {result.overall < 41 && "with foundational"} awareness across key career dimensions.
              </p>
              <div className="text-sm text-charcoal-500 font-body">
                Benchmark data will be available as more users complete this assessment.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next steps */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50" variant="light">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-800 text-lg mb-2 font-display">
                Ready to Enhance Your Career Intelligence?
              </h3>
              <p className="text-charcoal-600 font-body">
                Work with a career mentor to develop your lowest-scoring dimensions and create a
                personalized development plan.
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
          <Button variant="ghost">Back to Assessments</Button>
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
