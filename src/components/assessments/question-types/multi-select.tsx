"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Question } from "@/lib/assessment-types"

interface MultiSelectProps {
  question: Question
  value: string[] | undefined
  onChange: (value: string[]) => void
  maxSelections?: number
}

export function MultiSelect({
  question,
  value = [],
  onChange,
  maxSelections,
}: MultiSelectProps) {
  const handleToggle = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((v) => v !== optionId))
    } else {
      if (maxSelections && value.length >= maxSelections) {
        // Remove the first selection to make room
        onChange([...value.slice(1), optionId])
      } else {
        onChange([...value, optionId])
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-forest-800">{question.text}</p>
        {question.helpText && (
          <p className="text-sm text-muted-foreground mt-1">{question.helpText}</p>
        )}
        {maxSelections && (
          <p className="text-sm text-purple-600 mt-1">
            Select up to {maxSelections} options ({value.length}/{maxSelections} selected)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options?.map((option) => {
          const isSelected = value.includes(option.id)
          const isDisabled = maxSelections
            ? !isSelected && value.length >= maxSelections
            : false

          return (
            <Label
              key={option.id}
              htmlFor={`${question.id}-${option.id}`}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-50"
                  : isDisabled
                  ? "border-cream-200 bg-cream-50 opacity-50 cursor-not-allowed"
                  : "border-cream-200 hover:border-purple-300 hover:bg-cream-50"
              }`}
            >
              <Checkbox
                id={`${question.id}-${option.id}`}
                checked={isSelected}
                onCheckedChange={() => !isDisabled && handleToggle(option.id)}
                disabled={isDisabled}
                className="mt-0.5"
              />
              <div className="flex-1">
                <span className="font-medium text-forest-800">{option.label}</span>
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </Label>
          )
        })}
      </div>
    </div>
  )
}
