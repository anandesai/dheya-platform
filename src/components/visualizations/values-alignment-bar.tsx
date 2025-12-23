"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ValueAlignment {
  value: string
  importance: number // weight/importance (0-100)
  fulfillment: number // current role fulfillment (0-100)
}

interface ValuesAlignmentBarProps {
  values: ValueAlignment[]
  title?: string
  showGap?: boolean
}

export function ValuesAlignmentBar({
  values,
  title = "Values Alignment Analysis",
  showGap = true,
}: ValuesAlignmentBarProps) {
  // Calculate overall alignment score
  const totalWeight = values.reduce((sum, v) => sum + v.importance, 0)
  const weightedAlignment = values.reduce(
    (sum, v) => sum + (v.importance / totalWeight) * v.fulfillment,
    0
  )
  const overallScore = Math.round(weightedAlignment)

  // Sort values by gap (largest gap first)
  const sortedValues = [...values].sort(
    (a, b) => (a.importance - a.fulfillment) - (b.importance - b.fulfillment)
  ).reverse()

  // Prepare data for chart
  const chartData = sortedValues.map((v) => ({
    name: v.value,
    importance: v.importance,
    fulfillment: v.fulfillment,
    gap: v.importance - v.fulfillment,
  }))

  // Get alignment level
  const getAlignmentLevel = (score: number) => {
    if (score >= 75) return { label: "Strong Alignment", color: "bg-green-100 text-green-700" }
    if (score >= 50) return { label: "Moderate Alignment", color: "bg-amber-100 text-amber-700" }
    if (score >= 25) return { label: "Low Alignment", color: "bg-orange-100 text-orange-700" }
    return { label: "Critical Misalignment", color: "bg-red-100 text-red-700" }
  }

  const level = getAlignmentLevel(overallScore)

  // Get bar color based on gap
  const getBarColor = (gap: number) => {
    if (gap <= -10) return "#22c55e" // Exceeding expectations (green)
    if (gap <= 10) return "#3b82f6" // Aligned (blue)
    if (gap <= 25) return "#f59e0b" // Gap (amber)
    return "#ef4444" // Critical gap (red)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={level.color}>{level.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-4xl font-bold text-purple-600">{overallScore}%</div>
          <div className="text-sm text-muted-foreground">Overall Values Alignment</div>
        </div>

        {/* Bar Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value ?? 0}%`,
                  name === "importance" ? "Importance" : "Fulfillment",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <ReferenceLine x={50} stroke="#9ca3af" strokeDasharray="3 3" />
              <Bar
                dataKey="importance"
                fill="#e0e7ff"
                radius={[0, 4, 4, 0]}
                name="Importance"
              />
              <Bar dataKey="fulfillment" radius={[0, 4, 4, 0]} name="Fulfillment">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.gap)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-indigo-100" />
            <span className="text-muted-foreground">Importance</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-muted-foreground">Exceeding</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-muted-foreground">Aligned</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-muted-foreground">Gap</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-muted-foreground">Critical Gap</span>
          </div>
        </div>

        {/* Gap Analysis */}
        {showGap && (
          <div className="space-y-3">
            <h4 className="font-medium text-forest-800 text-sm">Gap Analysis</h4>
            <div className="space-y-2">
              {sortedValues.map((value) => {
                const gap = value.importance - value.fulfillment
                const isPositive = gap <= 0

                return (
                  <div
                    key={value.value}
                    className="flex items-center justify-between p-2 rounded-lg bg-cream-50"
                  >
                    <span className="text-sm text-forest-700">{value.value}</span>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground">
                        {value.importance}% → {value.fulfillment}%
                      </div>
                      <Badge
                        className={
                          isPositive
                            ? "bg-green-100 text-green-700"
                            : gap <= 10
                            ? "bg-blue-100 text-blue-700"
                            : gap <= 25
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {isPositive ? "+" : ""}
                        {-gap}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-forest-800 mb-2">Key Insight</h4>
          <p className="text-sm text-forest-600">
            {sortedValues.length > 0 && sortedValues[0].importance - sortedValues[0].fulfillment > 20 ? (
              <>
                Your biggest gap is in <strong>{sortedValues[0].value}</strong> (
                {sortedValues[0].importance - sortedValues[0].fulfillment}% deficit).
                Consider discussing ways to honor this value more in your current role.
              </>
            ) : (
              <>
                Your values are generally well-aligned with your role. Focus on
                maintaining this balance and exploring growth opportunities.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
