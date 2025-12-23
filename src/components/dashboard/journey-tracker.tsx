"use client"

import { CheckCircle, Circle, Lock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Phase {
  id: number
  name: string
  description: string
  status: "completed" | "current" | "locked"
}

const phases: Phase[] = [
  {
    id: 1,
    name: "Discovery",
    description: "Understand your current situation and aspirations",
    status: "completed",
  },
  {
    id: 2,
    name: "Definition",
    description: "Define your career goals and success metrics",
    status: "completed",
  },
  {
    id: 3,
    name: "Design",
    description: "Create your personalized career roadmap",
    status: "current",
  },
  {
    id: 4,
    name: "Development",
    description: "Build skills and capabilities for your goals",
    status: "locked",
  },
  {
    id: 5,
    name: "Delivery",
    description: "Execute your career transition plan",
    status: "locked",
  },
  {
    id: 6,
    name: "Delight",
    description: "Celebrate success and plan continued growth",
    status: "locked",
  },
]

export function JourneyTracker() {
  const currentPhaseIndex = phases.findIndex((p) => p.status === "current")
  const progress = Math.round(((currentPhaseIndex + 0.5) / phases.length) * 100)

  return (
    <Card variant="light">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-display">Your Career Journey</CardTitle>
            <CardDescription>7D Methodology Progress</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-500">{progress}%</div>
            <div className="text-xs text-charcoal-600 font-body">Complete</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-cream-200" />
          <div
            className="absolute left-4 top-0 w-0.5 bg-purple-500 transition-all duration-500"
            style={{ height: `${(currentPhaseIndex / (phases.length - 1)) * 100}%` }}
          />

          {/* Phases */}
          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.id} className="relative flex items-start gap-4 pl-2">
                {/* Status icon */}
                <div className="relative z-10 flex-shrink-0">
                  {phase.status === "completed" ? (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : phase.status === "current" ? (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                      <Circle className="w-3 h-3 text-white fill-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-cream-200 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-cream-400" />
                    </div>
                  )}
                </div>

                {/* Phase content */}
                <div
                  className={`flex-1 ${
                    phase.status === "locked" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-medium font-display ${
                        phase.status === "current"
                          ? "text-purple-500"
                          : "text-charcoal-800"
                      }`}
                    >
                      {phase.name}
                    </h4>
                    {phase.status === "current" && (
                      <span className="text-xs bg-purple-100 text-purple-500 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-charcoal-600 font-body">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
