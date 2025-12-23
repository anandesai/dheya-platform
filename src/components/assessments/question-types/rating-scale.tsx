"use client"

import { Slider } from "@/components/ui/slider"
import { Question } from "@/lib/assessment-types"

interface RatingScaleProps {
  question: Question
  value: number | undefined
  onChange: (value: number) => void
}

export function RatingScale({ question, value, onChange }: RatingScaleProps) {
  const min = question.validation?.min ?? 0
  const max = question.validation?.max ?? 100

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-forest-800">{question.text}</p>
        {question.helpText && (
          <p className="text-sm text-muted-foreground mt-1">{question.helpText}</p>
        )}
      </div>

      <div className="pt-6 pb-2">
        <div className="flex items-center gap-4">
          <Slider
            value={[value ?? min]}
            onValueChange={(vals) => onChange(vals[0])}
            min={min}
            max={max}
            step={1}
            className="flex-1"
          />
          <div className="w-16 text-center">
            <span className="text-2xl font-bold text-purple-600">
              {value ?? min}
            </span>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Not at all ({min}%)</span>
          <span>Completely ({max}%)</span>
        </div>
      </div>
    </div>
  )
}
