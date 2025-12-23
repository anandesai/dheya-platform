"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BBDRadarChartProps {
  scores: {
    bored: number
    burnedOut: number
    dissatisfied: number
  }
  maxScore?: number
  showLegend?: boolean
  title?: string
}

export function BBDRadarChart({
  scores,
  maxScore = 25,
  showLegend = true,
  title = "BBD Syndrome Analysis",
}: BBDRadarChartProps) {
  const data = [
    {
      dimension: "Boredom",
      score: scores.bored,
      fullMark: maxScore,
    },
    {
      dimension: "Burnout",
      score: scores.burnedOut,
      fullMark: maxScore,
    },
    {
      dimension: "Dissatisfaction",
      score: scores.dissatisfied,
      fullMark: maxScore,
    },
  ]

  // Calculate severity colors
  const getSeverityColor = (score: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage <= 33) return "#22c55e" // green
    if (percentage <= 66) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  const averageScore = (scores.bored + scores.burnedOut + scores.dissatisfied) / 3
  const fillColor = getSeverityColor(averageScore)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "#374151", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, maxScore]}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                tickCount={6}
              />
              <Radar
                name="Your Score"
                dataKey="score"
                stroke={fillColor}
                fill={fillColor}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              {showLegend && <Legend />}
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
                formatter={(value) => [
                  `${value ?? 0}/${maxScore}`,
                  "Score",
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: getSeverityColor(scores.bored) }}
            >
              {scores.bored}
            </div>
            <div className="text-xs text-muted-foreground">Boredom</div>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: getSeverityColor(scores.burnedOut) }}
            >
              {scores.burnedOut}
            </div>
            <div className="text-xs text-muted-foreground">Burnout</div>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: getSeverityColor(scores.dissatisfied) }}
            >
              {scores.dissatisfied}
            </div>
            <div className="text-xs text-muted-foreground">Dissatisfaction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
