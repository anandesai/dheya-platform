"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CLIQIScores {
  selfAwareness: number
  opportunityAwareness: number
  goalClarity: number
  planningCapability: number
  decisionConfidence: number
}

interface CLIQIGaugeProps {
  scores: CLIQIScores
  maxScore?: number
  showBreakdown?: boolean
  title?: string
  previousScores?: CLIQIScores
}

const dimensionLabels = {
  selfAwareness: "Self-Awareness",
  opportunityAwareness: "Opportunity Awareness",
  goalClarity: "Goal Clarity",
  planningCapability: "Planning Capability",
  decisionConfidence: "Decision Confidence",
}

const dimensionDescriptions = {
  selfAwareness: "Understanding of your strengths, values, and motivations",
  opportunityAwareness: "Knowledge of career options and market trends",
  goalClarity: "Clear definition of your career objectives",
  planningCapability: "Ability to create actionable career plans",
  decisionConfidence: "Confidence in making career decisions",
}

export function CLIQIGauge({
  scores,
  maxScore = 100,
  showBreakdown = true,
  title = "Career Life Quotient Index (CLIQI)",
  previousScores,
}: CLIQIGaugeProps) {
  const data = Object.entries(scores).map(([key, value]) => ({
    dimension: dimensionLabels[key as keyof CLIQIScores],
    score: value,
    fullMark: maxScore,
    previous: previousScores?.[key as keyof CLIQIScores],
  }))

  // Calculate overall CLIQI score (average of all dimensions)
  const overallScore = Math.round(
    Object.values(scores).reduce((sum, val) => sum + val, 0) / 5
  )

  const previousOverall = previousScores
    ? Math.round(
        Object.values(previousScores).reduce((sum, val) => sum + val, 0) / 5
      )
    : null

  const improvement = previousOverall ? overallScore - previousOverall : null

  // Get severity level based on overall score
  const getLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-600" }
    if (score >= 60) return { label: "Good", color: "text-blue-600" }
    if (score >= 40) return { label: "Developing", color: "text-amber-600" }
    return { label: "Needs Focus", color: "text-red-600" }
  }

  const level = getLevel(overallScore)

  // Get color for individual dimension
  const getDimensionColor = (score: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "#22c55e" // green
    if (percentage >= 60) return "#3b82f6" // blue
    if (percentage >= 40) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score Display */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32">
              <circle
                className="text-gray-200"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="52"
                cx="64"
                cy="64"
              />
              <circle
                className="text-purple-600"
                strokeWidth="10"
                strokeDasharray={`${(overallScore / 100) * 327} 327`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="52"
                cx="64"
                cy="64"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-forest-800">
                {overallScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className={`mt-2 font-medium ${level.color}`}>{level.label}</div>
          {improvement !== null && (
            <div
              className={`text-sm ${
                improvement >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {improvement >= 0 ? "+" : ""}
              {improvement} from previous
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "#374151", fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, maxScore]}
                tick={{ fill: "#9ca3af", fontSize: 9 }}
                tickCount={5}
              />
              {previousScores && (
                <Radar
                  name="Previous"
                  dataKey="previous"
                  stroke="#9ca3af"
                  fill="#9ca3af"
                  fillOpacity={0.1}
                  strokeDasharray="5 5"
                />
              )}
              <Radar
                name="Current"
                dataKey="score"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => [
                  `${value ?? 0}%`,
                  name === "previous" ? "Previous Score" : "Current Score",
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Breakdown */}
        {showBreakdown && (
          <div className="space-y-4">
            <h4 className="font-medium text-forest-800 text-sm">
              Dimension Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(scores).map(([key, value]) => {
                const dimKey = key as keyof CLIQIScores
                const prevValue = previousScores?.[dimKey]
                const change = prevValue ? value - prevValue : null

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forest-700">
                        {dimensionLabels[dimKey]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{ color: getDimensionColor(value) }}
                        >
                          {value}%
                        </span>
                        {change !== null && (
                          <span
                            className={`text-xs ${
                              change >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {change >= 0 ? "+" : ""}
                            {change}
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress
                      value={value}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {dimensionDescriptions[dimKey]}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
