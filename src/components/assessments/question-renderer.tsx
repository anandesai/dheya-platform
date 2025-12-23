"use client"

import { Question } from "@/lib/assessment-types"
import { LikertScale } from "./question-types/likert-scale"
import { RatingScale } from "./question-types/rating-scale"
import { MultiSelect } from "./question-types/multi-select"
import { OpenText } from "./question-types/open-text"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface QuestionRendererProps {
  question: Question
  value: unknown
  onChange: (value: unknown) => void
  maxSelections?: number
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  maxSelections,
}: QuestionRendererProps) {
  switch (question.type) {
    case "likert":
      return (
        <LikertScale
          question={question}
          value={value as number | undefined}
          onChange={onChange as (value: number) => void}
        />
      )

    case "rating-scale":
      return (
        <RatingScale
          question={question}
          value={value as number | undefined}
          onChange={onChange as (value: number) => void}
        />
      )

    case "multi-select":
      return (
        <MultiSelect
          question={question}
          value={value as string[] | undefined}
          onChange={onChange as (value: string[]) => void}
          maxSelections={maxSelections}
        />
      )

    case "open-text":
      return (
        <OpenText
          question={question}
          value={value as string | undefined}
          onChange={onChange as (value: string) => void}
        />
      )

    case "single-select":
      return (
        <div className="space-y-4">
          <div>
            <p className="font-medium text-forest-800">{question.text}</p>
            {question.helpText && (
              <p className="text-sm text-muted-foreground mt-1">
                {question.helpText}
              </p>
            )}
          </div>
          <RadioGroup
            value={value as string}
            onValueChange={onChange as (value: string) => void}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <Label
                key={option.id}
                htmlFor={`${question.id}-${option.id}`}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  value === option.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-cream-200 hover:border-purple-300 hover:bg-cream-50"
                }`}
              >
                <RadioGroupItem
                  value={option.id}
                  id={`${question.id}-${option.id}`}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className="font-medium text-forest-800">
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )

    default:
      return (
        <div className="p-4 bg-red-50 rounded-lg text-red-600">
          Unknown question type: {question.type}
        </div>
      )
  }
}
