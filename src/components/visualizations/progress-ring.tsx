"use client"

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value: number
  maxValue?: number
  size?: "sm" | "md" | "lg" | "xl"
  strokeWidth?: number
  showLabel?: boolean
  label?: string
  sublabel?: string
  color?: "purple" | "green" | "blue" | "amber" | "red" | "auto"
  className?: string
}

const sizeConfig = {
  sm: { size: 60, strokeWidth: 6, fontSize: "text-sm", sublabelSize: "text-[8px]" },
  md: { size: 80, strokeWidth: 8, fontSize: "text-lg", sublabelSize: "text-xs" },
  lg: { size: 120, strokeWidth: 10, fontSize: "text-2xl", sublabelSize: "text-sm" },
  xl: { size: 160, strokeWidth: 12, fontSize: "text-4xl", sublabelSize: "text-base" },
}

const colorConfig = {
  purple: { stroke: "#7c3aed", bg: "#ede9fe" },
  green: { stroke: "#22c55e", bg: "#dcfce7" },
  blue: { stroke: "#3b82f6", bg: "#dbeafe" },
  amber: { stroke: "#f59e0b", bg: "#fef3c7" },
  red: { stroke: "#ef4444", bg: "#fee2e2" },
}

function getAutoColor(percentage: number) {
  if (percentage >= 80) return colorConfig.green
  if (percentage >= 60) return colorConfig.blue
  if (percentage >= 40) return colorConfig.amber
  return colorConfig.red
}

export function ProgressRing({
  value,
  maxValue = 100,
  size = "md",
  strokeWidth: customStrokeWidth,
  showLabel = true,
  label,
  sublabel,
  color = "purple",
  className,
}: ProgressRingProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))
  const config = sizeConfig[size]
  const strokeWidth = customStrokeWidth || config.strokeWidth
  const radius = (config.size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colors = color === "auto" ? getAutoColor(percentage) : colorConfig[color]

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.size}
        height={config.size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={colors.bg}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={colors.stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center">
          <span className={cn("font-bold text-forest-800", config.fontSize)}>
            {label !== undefined ? label : Math.round(percentage)}
          </span>
          {sublabel && (
            <span className={cn("text-muted-foreground", config.sublabelSize)}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Multi-ring progress component for showing multiple metrics
interface MultiProgressRingProps {
  rings: {
    value: number
    maxValue?: number
    color: keyof typeof colorConfig
    label: string
  }[]
  size?: "md" | "lg" | "xl"
  className?: string
}

export function MultiProgressRing({
  rings,
  size = "lg",
  className,
}: MultiProgressRingProps) {
  const config = sizeConfig[size]
  const baseStrokeWidth = config.strokeWidth
  const gap = 4

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={config.size} height={config.size} className="transform -rotate-90">
        {rings.map((ring, index) => {
          const strokeWidth = baseStrokeWidth - index * 2
          const radius = (config.size - strokeWidth) / 2 - index * (baseStrokeWidth + gap)
          const circumference = radius * 2 * Math.PI
          const percentage = Math.min(100, Math.max(0, (ring.value / (ring.maxValue || 100)) * 100))
          const strokeDashoffset = circumference - (percentage / 100) * circumference
          const colors = colorConfig[ring.color]

          return (
            <g key={ring.label}>
              {/* Background circle */}
              <circle
                cx={config.size / 2}
                cy={config.size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke={colors.bg}
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx={config.size / 2}
                cy={config.size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke={colors.stroke}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: "stroke-dashoffset 0.5s ease-in-out",
                }}
              />
            </g>
          )
        })}
      </svg>
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 -mb-8">
        {rings.map((ring) => (
          <div key={ring.label} className="flex items-center gap-1 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colorConfig[ring.color].stroke }}
            />
            <span className="text-muted-foreground">{ring.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
