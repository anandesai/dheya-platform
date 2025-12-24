"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Star, CheckCircle2 } from "lucide-react"

interface SessionFeedbackProps {
  bookingId: string
  mentorName: string
  initialFeedback?: FeedbackData | null
  onSubmitSuccess?: () => void
  className?: string
}

interface FeedbackData {
  rating: number
  helpful: number
  goalsAchieved: "yes" | "no" | "partially"
  wouldRecommend: "yes" | "no"
  comment: string
}

export function SessionFeedback({
  bookingId,
  mentorName,
  initialFeedback = null,
  onSubmitSuccess,
  className
}: SessionFeedbackProps) {
  const [rating, setRating] = React.useState(initialFeedback?.rating || 0)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [helpful, setHelpful] = React.useState(initialFeedback?.helpful || 0)
  const [hoverHelpful, setHoverHelpful] = React.useState(0)
  const [goalsAchieved, setGoalsAchieved] = React.useState<"yes" | "no" | "partially" | "">(
    initialFeedback?.goalsAchieved || ""
  )
  const [wouldRecommend, setWouldRecommend] = React.useState<"yes" | "no" | "">(
    initialFeedback?.wouldRecommend || ""
  )
  const [comment, setComment] = React.useState(initialFeedback?.comment || "")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(!!initialFeedback)
  const [error, setError] = React.useState<string | null>(null)

  const isReadOnly = !!initialFeedback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError("Please provide a rating")
      return
    }

    if (helpful === 0) {
      setError("Please rate how helpful the session was")
      return
    }

    if (!goalsAchieved) {
      setError("Please indicate if you achieved your session goals")
      return
    }

    if (!wouldRecommend) {
      setError("Please indicate if you would recommend this mentor")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/sessions/${bookingId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          helpful,
          goalsAchieved,
          wouldRecommend,
          comment,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit feedback")
      }

      setIsSubmitted(true)
      onSubmitSuccess?.()
    } catch (err) {
      console.error("Error submitting feedback:", err)
      setError(err instanceof Error ? err.message : "Failed to submit feedback")
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({
    value,
    onChange,
    hoverValue,
    onHover,
    readOnly = false,
    label
  }: {
    value: number
    onChange: (value: number) => void
    hoverValue: number
    onHover: (value: number) => void
    readOnly?: boolean
    label?: string
  }) => (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-charcoal-800">{label}</label>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onChange(star)}
            onMouseEnter={() => !readOnly && onHover(star)}
            onMouseLeave={() => !readOnly && onHover(0)}
            disabled={readOnly}
            className={cn(
              "transition-all duration-200",
              !readOnly && "hover:scale-110 cursor-pointer",
              readOnly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                (hoverValue >= star || value >= star)
                  ? "fill-purple-500 text-purple-500"
                  : "fill-none text-cream-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )

  const RadioGroup = ({
    value,
    onChange,
    options,
    readOnly = false,
    label
  }: {
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    readOnly?: boolean
    label: string
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-charcoal-800">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => !readOnly && onChange(option.value)}
            disabled={readOnly}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              value === option.value
                ? "bg-purple-500 text-white shadow-md"
                : "bg-cream-100 text-charcoal-700 hover:bg-cream-200",
              readOnly && "cursor-default"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )

  if (isSubmitted) {
    return (
      <Card variant="light" className={cn("border-2 border-green-200 bg-green-50", className)}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-green-800">
                Thank you for your feedback!
              </h3>
              <p className="mt-2 text-sm text-green-700">
                Your feedback helps us improve the mentoring experience.
              </p>
            </div>
            {!isReadOnly && (
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="mt-4"
              >
                Edit Feedback
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="light" className={className}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">Session Feedback</CardTitle>
          <CardDescription>
            Share your experience with {mentorName}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Rating */}
          <StarRating
            value={rating}
            onChange={setRating}
            hoverValue={hoverRating}
            onHover={setHoverRating}
            readOnly={isReadOnly}
            label="Overall Rating"
          />

          {/* How Helpful */}
          <StarRating
            value={helpful}
            onChange={setHelpful}
            hoverValue={hoverHelpful}
            onHover={setHoverHelpful}
            readOnly={isReadOnly}
            label="How helpful was this session?"
          />

          {/* Goals Achieved */}
          <RadioGroup
            value={goalsAchieved}
            onChange={(value) => setGoalsAchieved(value as "yes" | "no" | "partially")}
            readOnly={isReadOnly}
            label="Did you achieve your session goals?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "partially", label: "Partially" },
              { value: "no", label: "No" },
            ]}
          />

          {/* Would Recommend */}
          <RadioGroup
            value={wouldRecommend}
            onChange={(value) => setWouldRecommend(value as "yes" | "no")}
            readOnly={isReadOnly}
            label="Would you recommend this mentor?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />

          {/* Additional Comments */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal-800">
              Additional comments (optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share any additional thoughts about your session..."
              className="min-h-[100px] focus-visible:ring-purple-500"
              disabled={isReadOnly}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button
            type="submit"
            variant="uplift"
            size="lg"
            disabled={isSubmitting || isReadOnly}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
