"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Question } from "@/lib/assessment-types"

interface LikertScaleProps {
  question: Question
  value: number | undefined
  onChange: (value: number) => void
}

const defaultLabels = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
]

export function LikertScale({ question, value, onChange }: LikertScaleProps) {
  const labels = question.options?.length
    ? question.options.map((opt) => ({ value: Number(opt.value), label: opt.label }))
    : defaultLabels

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-forest-800">{question.text}</p>
        {question.helpText && (
          <p className="text-sm text-muted-foreground mt-1">{question.helpText}</p>
        )}
      </div>

      <RadioGroup
        value={value?.toString()}
        onValueChange={(v) => onChange(parseInt(v, 10))}
        className="flex flex-col sm:flex-row sm:justify-between gap-2"
      >
        {labels.map((item) => (
          <Label
            key={item.value}
            htmlFor={`${question.id}-${item.value}`}
            className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
              value === item.value
                ? "border-purple-500 bg-purple-50"
                : "border-cream-200 hover:border-purple-300 hover:bg-cream-50"
            }`}
          >
            <RadioGroupItem
              value={item.value.toString()}
              id={`${question.id}-${item.value}`}
              className="sr-only"
            />
            <span className="text-lg font-bold text-forest-800">{item.value}</span>
            <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
              {item.label}
            </span>
          </Label>
        ))}
      </RadioGroup>

      {/* Mobile labels */}
      <div className="flex justify-between text-xs text-muted-foreground sm:hidden">
        <span>{labels[0]?.label}</span>
        <span>{labels[labels.length - 1]?.label}</span>
      </div>
    </div>
  )
}
