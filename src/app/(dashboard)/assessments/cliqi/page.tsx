"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { QuestionRenderer } from "@/components/assessments/question-renderer"
import { cliqiAssessment } from "@/lib/assessments/cliqi-assessment"
import { AssessmentResponse } from "@/lib/assessment-types"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Brain,
  Clock,
  CheckCircle,
  Target,
  Compass,
  Map,
  TrendingUp,
  Zap,
} from "lucide-react"

export default function CLIQIAssessmentPage() {
  const router = useRouter()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const sections = cliqiAssessment.sections
  const currentSection = sections[currentSectionIndex]
  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0)
  const answeredQuestions = Object.keys(responses).length

  // Calculate progress
  const progress = Math.round((answeredQuestions / totalQuestions) * 100)

  // Check if current section is complete
  const isSectionComplete = currentSection.questions.every(
    (q) => !q.required || responses[q.id] !== undefined
  )

  // Load saved responses on mount
  useEffect(() => {
    const saved = localStorage.getItem("cliqi-assessment-responses")
    if (saved) {
      setResponses(JSON.parse(saved))
    }
  }, [])

  // Auto-save responses
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem("cliqi-assessment-responses", JSON.stringify(responses))
    }
  }, [responses])

  const handleResponse = (questionId: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Convert responses to AssessmentResponse format
    const formattedResponses: AssessmentResponse[] = Object.entries(responses).map(
      ([questionId, value]) => ({
        questionId,
        value: value as string | number | string[] | number[],
        timestamp: new Date(),
      })
    )

    // Store in localStorage
    localStorage.setItem(
      "cliqi-assessment-result",
      JSON.stringify({
        assessmentId: cliqiAssessment.id,
        responses: formattedResponses,
        completedAt: new Date().toISOString(),
      })
    )

    // Clear in-progress responses
    localStorage.removeItem("cliqi-assessment-responses")

    // Navigate to results page
    router.push("/assessments/cliqi/results")
  }

  const sectionIcons = [
    Target, // Self-Awareness
    Compass, // Opportunity Awareness
    Map, // Goal Clarity
    TrendingUp, // Planning Capability
    Zap, // Decision Confidence
  ]

  if (showIntro) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg" variant="light">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <CardTitle className="text-2xl text-charcoal-800 font-display">
              {cliqiAssessment.name}
            </CardTitle>
            <CardDescription className="text-base mt-2 text-charcoal-600 font-body">
              {cliqiAssessment.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-cream-50 rounded-lg">
                <div className="text-2xl font-bold text-charcoal-800 font-display">
                  {totalQuestions}
                </div>
                <div className="text-sm text-charcoal-600 font-body">Questions</div>
              </div>
              <div className="text-center p-4 bg-cream-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-charcoal-800 font-display">
                  <Clock className="w-5 h-5" />
                  {cliqiAssessment.estimatedTime}
                </div>
                <div className="text-sm text-charcoal-600 font-body">Minutes</div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-charcoal-800 mb-3 font-display">
                You&apos;ll discover your scores across 5 dimensions:
              </h4>
              <ul className="space-y-2 text-sm text-charcoal-600">
                {cliqiAssessment.scoringConfig.dimensions.map((dim, idx) => {
                  const Icon = sectionIcons[idx]
                  return (
                    <li key={dim.key} className="flex items-start gap-2">
                      <Icon className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-charcoal-800">{dim.name}:</span>{" "}
                        {dim.description}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="bg-cream-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5" />
                <p className="text-sm text-charcoal-600 font-body">
                  Your responses are saved automatically. You can pause and resume anytime.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowIntro(false)}
              className="w-full bg-purple-500 hover:bg-purple-600"
              size="lg"
            >
              Start Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress header */}
      <Card variant="light">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Section {currentSectionIndex + 1} of {sections.length}
              </Badge>
              <span className="text-sm text-charcoal-600 font-body">
                {currentSection.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">Auto-saved</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm font-medium text-purple-500">
              {progress}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Section navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section, index) => {
          const sectionComplete = section.questions.every(
            (q) => !q.required || responses[q.id] !== undefined
          )
          const Icon = sectionIcons[index]
          return (
            <Button
              key={section.id}
              variant={index === currentSectionIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSectionIndex(index)}
              className={`flex-shrink-0 ${
                index === currentSectionIndex
                  ? "bg-purple-500 hover:bg-purple-600"
                  : sectionComplete
                  ? "border-green-300 text-green-600"
                  : ""
              }`}
            >
              {sectionComplete && index !== currentSectionIndex ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <Icon className="w-4 h-4 mr-1" />
              )}
              <span className="hidden sm:inline">{section.title}</span>
              <span className="sm:hidden">{index + 1}</span>
            </Button>
          )
        })}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSectionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg" variant="light">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const Icon = sectionIcons[currentSectionIndex]
                  return <Icon className="w-6 h-6 text-purple-500" />
                })()}
                <CardTitle className="text-xl text-charcoal-800 font-display">
                  {currentSection.title}
                </CardTitle>
              </div>
              {currentSection.description && (
                <CardDescription className="text-charcoal-600 font-body">
                  {currentSection.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              {currentSection.questions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className={`${
                    qIndex < currentSection.questions.length - 1
                      ? "pb-8 border-b border-cream-200"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-500">
                      {qIndex + 1}
                    </span>
                    <div className="flex-1">
                      <QuestionRenderer
                        question={question}
                        value={responses[question.id]}
                        onChange={(value) => handleResponse(question.id, value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentSectionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isSectionComplete || isSubmitting}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentSectionIndex === sections.length - 1
                    ? "Submit"
                    : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
