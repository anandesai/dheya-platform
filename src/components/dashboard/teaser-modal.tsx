"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Lock, ArrowRight, Clock, Eye, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// ==========================================
// TYPES
// ==========================================

interface TeaserQuestion {
  id: string
  text: string
  type: 'likert' | 'multiple_choice' | 'text'
  options?: { value: string; label: string }[]
  helpText?: string
}

interface TeaserConfig {
  questionsToShow?: number
  showSampleResults?: boolean
  previewDuration?: number
}

interface TeaserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  toolName: string
  toolDescription: string
  estimatedMinutes: number
  teaserConfig?: TeaserConfig
  questions?: TeaserQuestion[]
  onUpgrade?: () => void
  onClose?: () => void
}

// ==========================================
// SAMPLE DATA
// ==========================================

const SAMPLE_QUESTIONS: TeaserQuestion[] = [
  {
    id: "q1",
    text: "I feel unchallenged by my current work responsibilities",
    type: "likert",
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" }
    ],
    helpText: "Consider your day-to-day tasks over the past 3 months"
  },
  {
    id: "q2",
    text: "My work feels repetitive and lacks variety",
    type: "likert",
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" }
    ]
  },
  {
    id: "q3",
    text: "I often feel like I'm just going through the motions at work",
    type: "likert",
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" }
    ]
  }
]

// ==========================================
// COMPONENT
// ==========================================

export function TeaserModal({
  open,
  onOpenChange,
  toolName,
  toolDescription,
  estimatedMinutes,
  teaserConfig = { questionsToShow: 3 },
  questions = SAMPLE_QUESTIONS,
  onUpgrade,
  onClose
}: TeaserModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})

  const questionsToShow = teaserConfig.questionsToShow || 3
  const displayQuestions = questions.slice(0, questionsToShow)
  const totalQuestions = questions.length || 25 // Assuming full assessment has more

  const progress = ((currentStep + 1) / questionsToShow) * 100
  const isLastStep = currentStep === displayQuestions.length - 1

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setCurrentStep(0)
      setResponses({})
    }
  }, [open])

  const handleResponse = (value: string) => {
    const questionId = displayQuestions[currentStep].id
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (isLastStep) {
      // Show upgrade prompt
      return
    }
    setCurrentStep(prev => prev + 1)
  }

  const handleClose = () => {
    onClose?.()
    onOpenChange(false)
  }

  const currentQuestion = displayQuestions[currentStep]
  const currentResponse = currentQuestion ? responses[currentQuestion.id] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Eye className="w-3 h-3 mr-1" />
              Preview Mode
            </Badge>
          </div>
          <DialogTitle className="text-xl font-display mt-2">{toolName}</DialogTitle>
          <DialogDescription>{toolDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-600 font-body">
                Question {currentStep + 1} of {questionsToShow}
              </span>
              <span className="text-charcoal-600 font-body flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {estimatedMinutes} min total
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          {currentQuestion && !isLastStep && (
            <Card variant="light" className="border-2">
              <CardContent className="pt-6">
                <p className="text-lg font-medium mb-2">{currentQuestion.text}</p>
                {currentQuestion.helpText && (
                  <p className="text-sm text-charcoal-600 font-body mb-4">
                    {currentQuestion.helpText}
                  </p>
                )}

                {currentQuestion.type === 'likert' && currentQuestion.options && (
                  <RadioGroup
                    value={currentResponse || ""}
                    onValueChange={handleResponse}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer",
                          currentResponse === option.value
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => handleResponse(option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upgrade Prompt at End of Preview */}
          {isLastStep && currentResponse && (
            <Card variant="light" className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="inline-flex p-3 bg-primary/10 rounded-full">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold font-display mb-2">
                    You&apos;ve completed the preview!
                  </h3>
                  <p className="text-charcoal-600 font-body">
                    This assessment has {totalQuestions} questions in total.
                    Upgrade to access the full assessment and get personalized insights.
                  </p>
                </div>

                <div className="bg-background/60 rounded-lg p-4 space-y-2">
                  <p className="font-medium font-display">What you&apos;ll get with the full assessment:</p>
                  <ul className="text-sm text-charcoal-600 font-body space-y-1">
                    <li>✓ Complete {totalQuestions}-question diagnostic</li>
                    <li>✓ Personalized score and analysis</li>
                    <li>✓ Actionable recommendations</li>
                    <li>✓ Downloadable report</li>
                  </ul>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <Button variant="outline" onClick={handleClose}>
                    Maybe Later
                  </Button>
                  <Button onClick={onUpgrade}>
                    <Lock className="w-4 h-4 mr-2" />
                    Upgrade to Unlock
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {!isLastStep && (
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" onClick={handleClose}>
                Exit Preview
              </Button>
              <Button
                onClick={handleNext}
                disabled={!currentResponse}
              >
                {isLastStep ? "See Results" : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// TEASER RESULTS PREVIEW
// ==========================================

interface TeaserResultsProps {
  toolName: string
  onUpgrade?: () => void
  onClose?: () => void
}

export function TeaserResultsPreview({
  toolName,
  onUpgrade,
  onClose
}: TeaserResultsProps) {
  return (
    <Card variant="light" className="relative overflow-hidden">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <Lock className="w-12 h-12 mx-auto text-charcoal-600 font-body mb-4" />
          <h3 className="text-lg font-semibold font-display mb-2">
            Your {toolName} Results
          </h3>
          <p className="text-sm text-charcoal-600 font-body mb-4">
            Complete the full assessment to see your personalized results and recommendations.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onUpgrade}>
              <Lock className="w-4 h-4 mr-2" />
              Unlock Full Assessment
            </Button>
          </div>
        </div>
      </div>

      {/* Blurred sample results */}
      <CardContent className="pt-6">
        <div className="space-y-4 filter blur-sm">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">58%</div>
            <div className="text-sm text-charcoal-600 font-body">Overall Score</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-semibold">45%</div>
              <div className="text-xs text-charcoal-600 font-body">Category 1</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-semibold">72%</div>
              <div className="text-xs text-charcoal-600 font-body">Category 2</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-semibold">48%</div>
              <div className="text-xs text-charcoal-600 font-body">Category 3</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
