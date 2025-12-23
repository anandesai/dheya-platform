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
import { workValues } from "@/lib/assessments/work-values-assessment"
import {
  Scale,
  ArrowRight,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface WorkValuesResult {
  selectedTop10: string[]
  selectedCore5: string[]
  weights: Record<string, number>
  alignments: Record<string, number>
  reflections: { gaps: string; ideal: string }
  alignmentScore: number
  completedAt: string
}

const levelConfig = {
  "Strong Alignment": {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    icon: CheckCircle,
  },
  "Moderate Alignment": {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
    icon: TrendingUp,
  },
  "Low Alignment": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
    icon: TrendingDown,
  },
  "Critical Misalignment": {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
    icon: AlertTriangle,
  },
}

function getLevel(score: number): keyof typeof levelConfig {
  if (score >= 75) return "Strong Alignment"
  if (score >= 50) return "Moderate Alignment"
  if (score >= 25) return "Low Alignment"
  return "Critical Misalignment"
}

function getValueLabel(id: string) {
  return workValues.find((v) => v.id === id)?.label || id
}

export default function WorkValuesResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<WorkValuesResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("work-values-result")
    if (saved) {
      setResult(JSON.parse(saved))
    } else {
      router.push("/assessments/work-values")
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

  const level = getLevel(result.alignmentScore)
  const config = levelConfig[level]
  const LevelIcon = config.icon

  // Sort values by alignment for insights
  const valueAlignments = result.selectedCore5.map((id) => ({
    id,
    label: getValueLabel(id),
    weight: result.weights[id],
    alignment: result.alignments[id],
    weightedScore: (result.weights[id] / 100) * result.alignments[id],
  }))

  const sortedByAlignment = [...valueAlignments].sort(
    (a, b) => b.alignment - a.alignment
  )
  const topAligned = sortedByAlignment.slice(0, 2)
  const lowAligned = sortedByAlignment.slice(-2).reverse()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Scale className="w-8 h-8 text-purple-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-charcoal-800 font-display">
          Work Values Assessment Results
        </h1>
        <p className="text-charcoal-600 font-body mt-2">
          Completed on {new Date(result.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Overall alignment score */}
      <Card className={`border-2 ${config.border}`} variant="light">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-display">Overall Values Alignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.text} mb-4`}
            >
              <LevelIcon className="w-5 h-5" />
              <span className="font-semibold">{level}</span>
            </div>
            <div className="text-5xl font-bold text-charcoal-800 font-display">
              {result.alignmentScore}%
            </div>
            <div className="text-sm text-charcoal-600 font-body">
              weighted alignment score
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={result.alignmentScore} className="h-3" />
            <div className="flex justify-between text-xs text-charcoal-600 font-body">
              <span>Critical (0-24%)</span>
              <span>Low (25-49%)</span>
              <span>Moderate (50-74%)</span>
              <span>Strong (75-100%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core values breakdown */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="text-xl font-display">Your Core Values Breakdown</CardTitle>
          <CardDescription className="text-charcoal-600 font-body">
            How well your current role fulfills each of your core values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {valueAlignments.map((value) => (
            <div key={value.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-charcoal-800">
                    {value.label}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {value.weight}% weight
                  </Badge>
                </div>
                <span
                  className={`font-bold ${
                    value.alignment >= 70
                      ? "text-green-600"
                      : value.alignment >= 40
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {value.alignment}%
                </span>
              </div>
              <Progress value={value.alignment} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top aligned */}
        <Card className="border-green-200" variant="light">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-display">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Best Aligned Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topAligned.map((value) => (
                <li
                  key={value.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <span className="font-medium">{value.label}</span>
                  <Badge className="bg-green-600">{value.alignment}%</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-charcoal-600 font-body">
              These values are well-satisfied in your current role. Protect and
              nurture these aspects of your work.
            </p>
          </CardContent>
        </Card>

        {/* Low aligned */}
        <Card className="border-orange-200" variant="light">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-display">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {lowAligned.map((value) => (
                <li
                  key={value.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                >
                  <span className="font-medium">{value.label}</span>
                  <Badge className="bg-orange-600">{value.alignment}%</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-charcoal-600 font-body">
              These values have the biggest gaps. Focus your career development
              efforts here.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card variant="light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <CheckCircle className="w-5 h-5 text-purple-500" />
            Recommended Actions
          </CardTitle>
          <CardDescription className="text-charcoal-600 font-body">Based on your {level.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {level === "Strong Alignment" && (
              <>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    1
                  </span>
                  <span className="text-charcoal-600">
                    Continue nurturing your current role&apos;s alignment with your values.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    2
                  </span>
                  <span className="text-charcoal-600">
                    Look for opportunities to mentor others in values-aligned career decisions.
                  </span>
                </li>
              </>
            )}
            {level === "Moderate Alignment" && (
              <>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    1
                  </span>
                  <span className="text-charcoal-600">
                    Focus on improving alignment for your lowest-scoring values.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    2
                  </span>
                  <span className="text-charcoal-600">
                    Discuss potential role adjustments with your manager.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    3
                  </span>
                  <span className="text-charcoal-600">
                    Explore projects or responsibilities that better align with your values.
                  </span>
                </li>
              </>
            )}
            {(level === "Low Alignment" || level === "Critical Misalignment") && (
              <>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    1
                  </span>
                  <span className="text-charcoal-600">
                    A significant career change may be beneficial for your wellbeing.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    2
                  </span>
                  <span className="text-charcoal-600">
                    Work with a career mentor to discuss your results and
                    create a personalized action plan.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                    3
                  </span>
                  <span className="text-charcoal-600">
                    Consider internal mobility options before external opportunities.
                  </span>
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Next steps CTA */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50" variant="light">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-800 text-lg mb-2 font-display">
                Ready to Improve Your Values Alignment?
              </h3>
              <p className="text-charcoal-600 font-body">
                Book a session with a mentor to create a personalized action plan
                for better aligning your career with your values.
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

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/assessments">
          <Button variant="ghost">Back to Assessments</Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-purple-500 hover:bg-purple-600">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
