"use client"

import { Textarea } from "@/components/ui/textarea"
import { Question } from "@/lib/assessment-types"

interface OpenTextProps {
  question: Question
  value: string | undefined
  onChange: (value: string) => void
}

export function OpenText({ question, value = "", onChange }: OpenTextProps) {
  const minLength = question.validation?.minLength ?? 0
  const maxLength = question.validation?.maxLength ?? 1000
  const charCount = value.length

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-forest-800">{question.text}</p>
        {question.helpText && (
          <p className="text-sm text-muted-foreground mt-1">{question.helpText}</p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your response here..."
          className="min-h-[120px] resize-y"
          maxLength={maxLength}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {minLength > 0 && charCount < minLength && (
              <span className="text-orange-600">
                Minimum {minLength} characters required
              </span>
            )}
          </span>
          <span className={charCount > maxLength * 0.9 ? "text-orange-600" : ""}>
            {charCount}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  )
}
