"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  TrendingUp,
  Sparkles,
  Lightbulb,
  AlertCircle,
  Zap,
} from "lucide-react"

interface Skill {
  id: string
  name: string
  knowledge: number
  passion: number
}

interface KPMatrixResult {
  skills: Skill[]
  completedAt: string
}

type Quadrant = "growth" | "development" | "survivor" | "weedoff"

interface QuadrantData {
  name: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  icon: React.ElementType
  description: string
  recommendation: string
}

const quadrants: Record<Quadrant, QuadrantData> = {
  growth: {
    name: "Growth Zone",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    textColor: "text-green-700",
    icon: Sparkles,
    description: "High Knowledge + High Passion",
    recommendation:
      "These are your sweet spots! Leverage these skills for maximum impact and career growth.",
  },
  development: {
    name: "Development Zone",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    textColor: "text-blue-700",
    icon: TrendingUp,
    description: "Low Knowledge + High Passion",
    recommendation:
      "You love these but need to build competence. Invest in learning and development here.",
  },
  survivor: {
    name: "Survivor Zone",
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-700",
    icon: AlertCircle,
    description: "High Knowledge + Low Passion",
    recommendation:
      "You're good at these but they drain you. Minimize or delegate when possible.",
  },
  weedoff: {
    name: "Weed Off Zone",
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    textColor: "text-red-700",
    icon: Zap,
    description: "Low Knowledge + Low Passion",
    recommendation:
      "Neither skilled nor interested. Actively avoid or deprioritize these tasks.",
  },
}

function getQuadrant(knowledge: number, passion: number): Quadrant {
  const kHigh = knowledge > 5
  const pHigh = passion > 5

  if (kHigh && pHigh) return "growth"
  if (!kHigh && pHigh) return "development"
  if (kHigh && !pHigh) return "survivor"
  return "weedoff"
}

export default function KPMatrixResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<KPMatrixResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)

  useEffect(() => {
    const savedResult = localStorage.getItem("kp-matrix-result")
    if (savedResult) {
      const parsed: KPMatrixResult = JSON.parse(savedResult)
      setResult(parsed)
    } else {
      router.push("/assessments/kp-matrix")
    }
    setLoading(false)
  }, [router])

  // Draw interactive matrix
  useEffect(() => {
    if (!result || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = 60
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw quadrant backgrounds
    const midX = padding + chartWidth / 2
    const midY = padding + chartHeight / 2

    // Growth Zone (top-right) - green
    ctx.fillStyle = "rgba(34, 197, 94, 0.08)"
    ctx.fillRect(midX, padding, chartWidth / 2, chartHeight / 2)

    // Development Zone (top-left) - blue
    ctx.fillStyle = "rgba(59, 130, 246, 0.08)"
    ctx.fillRect(padding, padding, chartWidth / 2, chartHeight / 2)

    // Survivor Zone (bottom-right) - yellow
    ctx.fillStyle = "rgba(234, 179, 8, 0.08)"
    ctx.fillRect(midX, midY, chartWidth / 2, chartHeight / 2)

    // Weed Off Zone (bottom-left) - red
    ctx.fillStyle = "rgba(239, 68, 68, 0.08)"
    ctx.fillRect(padding, midY, chartWidth / 2, chartHeight / 2)

    // Draw grid lines
    ctx.strokeStyle = "#e5e5e5"
    ctx.lineWidth = 1

    // Vertical line
    ctx.beginPath()
    ctx.moveTo(midX, padding)
    ctx.lineTo(midX, height - padding)
    ctx.stroke()

    // Horizontal line
    ctx.beginPath()
    ctx.moveTo(padding, midY)
    ctx.lineTo(width - padding, midY)
    ctx.stroke()

    // Draw axes
    ctx.strokeStyle = "#404040"
    ctx.lineWidth = 2

    // X-axis (Knowledge)
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Y-axis (Passion)
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = "#404040"
    ctx.font = "600 14px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"

    // X-axis label
    ctx.fillText("Knowledge / Competence →", width / 2, height - 20)

    // Y-axis label
    ctx.save()
    ctx.translate(20, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Passion / Interest →", 0, 0)
    ctx.restore()

    // Draw scale markers
    ctx.font = "400 11px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#737373"

    // X-axis scale
    ctx.textAlign = "center"
    ctx.fillText("0", padding, height - padding + 20)
    ctx.fillText("5", midX, height - padding + 20)
    ctx.fillText("10", width - padding, height - padding + 20)

    // Y-axis scale
    ctx.textAlign = "right"
    ctx.fillText("0", padding - 10, height - padding + 5)
    ctx.fillText("5", padding - 10, midY + 5)
    ctx.fillText("10", padding - 10, padding + 5)

    // Draw quadrant labels
    ctx.font = "600 12px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"

    // Growth Zone
    ctx.fillStyle = "#15803d"
    ctx.fillText("GROWTH", midX + chartWidth / 4, padding + 20)
    ctx.fillText("ZONE", midX + chartWidth / 4, padding + 35)

    // Development Zone
    ctx.fillStyle = "#1d4ed8"
    ctx.fillText("DEVELOPMENT", padding + chartWidth / 4, padding + 20)
    ctx.fillText("ZONE", padding + chartWidth / 4, padding + 35)

    // Survivor Zone
    ctx.fillStyle = "#a16207"
    ctx.fillText("SURVIVOR", midX + chartWidth / 4, height - padding - 30)
    ctx.fillText("ZONE", midX + chartWidth / 4, height - padding - 15)

    // Weed Off Zone
    ctx.fillStyle = "#b91c1c"
    ctx.fillText("WEED OFF", padding + chartWidth / 4, height - padding - 30)
    ctx.fillText("ZONE", padding + chartWidth / 4, height - padding - 15)

    // Draw skills as dots
    result.skills.forEach((skill) => {
      const x = padding + (skill.knowledge / 10) * chartWidth
      const y = height - padding - (skill.passion / 10) * chartHeight

      const isSelected = selectedSkill?.id === skill.id
      const isHovered = hoveredSkill?.id === skill.id

      // Draw dot
      ctx.beginPath()
      ctx.arc(x, y, isSelected || isHovered ? 8 : 6, 0, 2 * Math.PI)

      const quadrant = getQuadrant(skill.knowledge, skill.passion)
      switch (quadrant) {
        case "growth":
          ctx.fillStyle = isSelected || isHovered ? "#22c55e" : "#86efac"
          break
        case "development":
          ctx.fillStyle = isSelected || isHovered ? "#3b82f6" : "#93c5fd"
          break
        case "survivor":
          ctx.fillStyle = isSelected || isHovered ? "#eab308" : "#fde047"
          break
        case "weedoff":
          ctx.fillStyle = isSelected || isHovered ? "#ef4444" : "#fca5a5"
          break
      }

      ctx.fill()

      // Draw border
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label for selected or hovered skill
      if (isSelected || isHovered) {
        ctx.fillStyle = "#1f2937"
        ctx.font = "600 12px Inter, system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(skill.name, x, y - 15)
      }
    })
  }, [result, selectedSkill, hoveredSkill])

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!result || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const padding = 60
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Find clicked skill
    for (const skill of result.skills) {
      const skillX = padding + (skill.knowledge / 10) * chartWidth
      const skillY = rect.height - padding - (skill.passion / 10) * chartHeight

      const distance = Math.sqrt(
        Math.pow(x - skillX, 2) + Math.pow(y - skillY, 2)
      )

      if (distance <= 10) {
        setSelectedSkill(skill.id === selectedSkill?.id ? null : skill)
        return
      }
    }

    setSelectedSkill(null)
  }

  // Handle canvas hover
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!result || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const padding = 60
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Find hovered skill
    for (const skill of result.skills) {
      const skillX = padding + (skill.knowledge / 10) * chartWidth
      const skillY = rect.height - padding - (skill.passion / 10) * chartHeight

      const distance = Math.sqrt(
        Math.pow(x - skillX, 2) + Math.pow(y - skillY, 2)
      )

      if (distance <= 10) {
        setHoveredSkill(skill)
        canvas.style.cursor = "pointer"
        return
      }
    }

    setHoveredSkill(null)
    canvas.style.cursor = "default"
  }

  if (loading || !result) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  // Group skills by quadrant
  const skillsByQuadrant = result.skills.reduce((acc, skill) => {
    const quadrant = getQuadrant(skill.knowledge, skill.passion)
    if (!acc[quadrant]) acc[quadrant] = []
    acc[quadrant].push(skill)
    return acc
  }, {} as Record<Quadrant, Skill[]>)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Target className="w-8 h-8 text-purple-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-charcoal-800 font-display">
          Your Knowledge-Passion Matrix
        </h1>
        <p className="text-charcoal-600 font-body mt-2">
          Completed on {new Date(result.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Interactive Matrix */}
      <Card variant="light" className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Target className="w-5 h-5 text-purple-500" />
            Your Skills Matrix
          </CardTitle>
          <CardDescription className="text-charcoal-600 font-body">
            Click on any dot to see details. Each skill is plotted based on your
            knowledge and passion ratings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-white rounded-lg border border-cream-200 p-4">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoveredSkill(null)}
              style={{ width: "100%", height: "500px" }}
              className="rounded-lg"
            />
            {selectedSkill && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border-2 border-purple-300 p-4 max-w-xs">
                <h4 className="font-semibold text-charcoal-800 mb-2 font-display">
                  {selectedSkill.name}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Knowledge:</span>
                    <Badge className="bg-blue-500">
                      {selectedSkill.knowledge}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Passion:</span>
                    <Badge className="bg-pink-500">
                      {selectedSkill.passion}/10
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <Badge
                      className={`${
                        quadrants[getQuadrant(selectedSkill.knowledge, selectedSkill.passion)]
                          .bgColor
                      } ${
                        quadrants[getQuadrant(selectedSkill.knowledge, selectedSkill.passion)]
                          .textColor
                      }`}
                    >
                      {quadrants[getQuadrant(selectedSkill.knowledge, selectedSkill.passion)].name}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quadrant breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.entries(quadrants) as [Quadrant, QuadrantData][]).map(
          ([key, data]) => {
            const Icon = data.icon
            const skills = skillsByQuadrant[key] || []
            const count = skills.length

            return (
              <Card
                key={key}
                className={`border-2 ${data.borderColor}`}
                variant="light"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${data.bgColor}`}
                      >
                        <Icon className={`w-5 h-5 ${data.textColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-display">
                          {data.name}
                        </CardTitle>
                        <CardDescription className="text-xs font-body">
                          {data.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={`${data.bgColor} ${data.textColor} text-lg px-3 py-1`}
                    >
                      {count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-charcoal-600 font-body">
                    {data.recommendation}
                  </p>

                  {count > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-charcoal-700 font-display">
                        Your skills:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-cream-50"
                            onClick={() => setSelectedSkill(skill)}
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {count === 0 && (
                    <p className="text-xs text-charcoal-500 italic">
                      No skills in this quadrant
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          }
        )}
      </div>

      {/* Key Insights */}
      <Card variant="light" className="border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Lightbulb className="w-5 h-5 text-purple-500" />
            Key Insights & Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Growth Zone insights */}
            {(skillsByQuadrant.growth?.length || 0) > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Leverage Your Strengths
                </h4>
                <p className="text-sm text-green-700">
                  Focus your career on your {skillsByQuadrant.growth.length} Growth
                  Zone skill(s). These are where you&apos;ll excel and feel fulfilled.
                </p>
              </div>
            )}

            {/* Development Zone insights */}
            {(skillsByQuadrant.development?.length || 0) > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 font-display flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Invest in Learning
                </h4>
                <p className="text-sm text-blue-700">
                  You have {skillsByQuadrant.development.length} skill(s) you&apos;re
                  passionate about but need to develop. These are great growth
                  opportunities.
                </p>
              </div>
            )}

            {/* Survivor Zone insights */}
            {(skillsByQuadrant.survivor?.length || 0) > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2 font-display flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Minimize Drain
                </h4>
                <p className="text-sm text-yellow-700">
                  {skillsByQuadrant.survivor.length} skill(s) drain your energy
                  despite competence. Find ways to delegate or automate these.
                </p>
              </div>
            )}

            {/* Weed Off Zone insights */}
            {(skillsByQuadrant.weedoff?.length || 0) > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2 font-display flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Deprioritize Actively
                </h4>
                <p className="text-sm text-red-700">
                  You have {skillsByQuadrant.weedoff.length} skill(s) in the Weed Off
                  Zone. Avoid tasks requiring these when possible.
                </p>
              </div>
            )}
          </div>

          {/* Overall recommendation */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2 font-display">
              Strategic Career Direction
            </h4>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">1.</span>
                <span>
                  Build your role around your{" "}
                  <strong>Growth Zone skills</strong> for maximum satisfaction and
                  impact
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">2.</span>
                <span>
                  Invest learning time in your{" "}
                  <strong>Development Zone skills</strong> - high passion will fuel
                  your progress
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">3.</span>
                <span>
                  Find ways to minimize or delegate{" "}
                  <strong>Survivor Zone tasks</strong> to prevent burnout
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">4.</span>
                <span>
                  Actively avoid or outsource <strong>Weed Off Zone</strong>{" "}
                  activities
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next steps CTA */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50" variant="light">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-800 text-lg mb-2 font-display">
                Ready to Build Your Ideal Career?
              </h3>
              <p className="text-charcoal-600 font-body">
                Work with a career mentor to create a personalized plan based on your
                K-P Matrix results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sessions/book">
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Mentor Session
                </Button>
              </Link>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Matrix
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
            Share Results
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
