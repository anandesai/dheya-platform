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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { workValues } from "@/lib/assessments/work-values-assessment"
import {
  ArrowLeft,
  ArrowRight,
  Scale,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

type Step = "intro" | "select-10" | "select-5" | "weight" | "align" | "reflect"

export default function WorkValuesAssessmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("intro")
  const [selectedTop10, setSelectedTop10] = useState<string[]>([])
  const [selectedCore5, setSelectedCore5] = useState<string[]>([])
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [alignments, setAlignments] = useState<Record<string, number>>({})
  const [reflections, setReflections] = useState({ gaps: "", ideal: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps: Step[] = ["intro", "select-10", "select-5", "weight", "align", "reflect"]
  const stepIndex = steps.indexOf(currentStep)
  const progress = Math.round((stepIndex / (steps.length - 1)) * 100)

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem("work-values-progress")
    if (saved) {
      const data = JSON.parse(saved)
      if (data.selectedTop10) setSelectedTop10(data.selectedTop10)
      if (data.selectedCore5) setSelectedCore5(data.selectedCore5)
      if (data.weights) setWeights(data.weights)
      if (data.alignments) setAlignments(data.alignments)
      if (data.reflections) setReflections(data.reflections)
    }
  }, [])

  // Auto-save progress
  useEffect(() => {
    if (currentStep !== "intro") {
      localStorage.setItem(
        "work-values-progress",
        JSON.stringify({
          selectedTop10,
          selectedCore5,
          weights,
          alignments,
          reflections,
        })
      )
    }
  }, [currentStep, selectedTop10, selectedCore5, weights, alignments, reflections])

  const handleToggleValue = (valueId: string, list: "top10" | "core5") => {
    if (list === "top10") {
      if (selectedTop10.includes(valueId)) {
        setSelectedTop10(selectedTop10.filter((v) => v !== valueId))
        // Also remove from core5 if it was selected
        setSelectedCore5(selectedCore5.filter((v) => v !== valueId))
      } else if (selectedTop10.length < 10) {
        setSelectedTop10([...selectedTop10, valueId])
      }
    } else {
      if (selectedCore5.includes(valueId)) {
        setSelectedCore5(selectedCore5.filter((v) => v !== valueId))
      } else if (selectedCore5.length < 5) {
        setSelectedCore5([...selectedCore5, valueId])
      }
    }
  }

  const handleWeightChange = (valueId: string, newWeight: number) => {
    const otherValues = selectedCore5.filter((v) => v !== valueId)
    const currentTotal = otherValues.reduce((sum, v) => sum + (weights[v] || 20), 0)
    const maxAllowed = 100 - currentTotal

    const adjustedWeight = Math.min(newWeight, maxAllowed)
    setWeights({ ...weights, [valueId]: adjustedWeight })
  }

  const getTotalWeight = () =>
    selectedCore5.reduce((sum, v) => sum + (weights[v] || 0), 0)

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Calculate alignment score
    const weightedSum = selectedCore5.reduce((sum, valueId) => {
      const weight = weights[valueId] || 20
      const alignment = alignments[valueId] || 50
      return sum + (weight / 100) * alignment
    }, 0)

    const result = {
      selectedTop10,
      selectedCore5,
      weights,
      alignments,
      reflections,
      alignmentScore: Math.round(weightedSum),
      completedAt: new Date().toISOString(),
    }

    localStorage.setItem("work-values-result", JSON.stringify(result))
    localStorage.removeItem("work-values-progress")

    router.push("/assessments/work-values/results")
  }

  const canProceed = () => {
    switch (currentStep) {
      case "intro":
        return true
      case "select-10":
        return selectedTop10.length === 10
      case "select-5":
        return selectedCore5.length === 5
      case "weight":
        return getTotalWeight() === 100
      case "align":
        return selectedCore5.every((v) => alignments[v] !== undefined)
      case "reflect":
        return true
      default:
        return false
    }
  }

  const getValueLabel = (id: string) =>
    workValues.find((v) => v.id === id)?.label || id

  // Initialize weights when core5 changes
  useEffect(() => {
    if (selectedCore5.length === 5) {
      setWeights((prevWeights) => {
        const newWeights: Record<string, number> = {}
        selectedCore5.forEach((v) => {
          newWeights[v] = prevWeights[v] || 20
        })
        return newWeights
      })
    }
  }, [selectedCore5])

  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return (
          <Card className="shadow-lg" variant="light">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Scale className="w-8 h-8 text-purple-500" />
              </div>
              <CardTitle className="text-2xl text-charcoal-800 font-display">
                Work Values Assessment
              </CardTitle>
              <CardDescription className="text-base mt-2 text-charcoal-600 font-body">
                Discover what truly matters to you in your career and measure
                how well your current role aligns with your values.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-cream-50 rounded-lg">
                  <div className="text-2xl font-bold text-charcoal-800 font-display">4</div>
                  <div className="text-sm text-charcoal-600 font-body">Steps</div>
                </div>
                <div className="text-center p-4 bg-cream-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-charcoal-800 font-display">
                    <Clock className="w-5 h-5" />
                    20
                  </div>
                  <div className="text-sm text-charcoal-600 font-body">Minutes</div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-charcoal-800 mb-2 font-display">
                  What you&apos;ll discover:
                </h4>
                <ul className="space-y-2 text-sm text-charcoal-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5" />
                    Your top 5 core work values
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5" />
                    How well your current role honors these values
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5" />
                    Specific areas of alignment and misalignment
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-purple-500 hover:bg-purple-600"
                size="lg"
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )

      case "select-10":
        return (
          <Card className="shadow-lg" variant="light">
            <CardHeader>
              <CardTitle className="text-xl text-charcoal-800 font-display">
                Step 1: Select Your Top 10 Values
              </CardTitle>
              <CardDescription className="text-charcoal-600 font-body">
                Choose the 10 values that matter most to you in your work life.
              </CardDescription>
              <Badge
                variant={selectedTop10.length === 10 ? "default" : "outline"}
                className={
                  selectedTop10.length === 10
                    ? "bg-green-600"
                    : "bg-purple-100 text-purple-700"
                }
              >
                {selectedTop10.length}/10 selected
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workValues.map((value) => {
                  const isSelected = selectedTop10.includes(value.id)
                  const isDisabled = !isSelected && selectedTop10.length >= 10

                  return (
                    <Label
                      key={value.id}
                      htmlFor={value.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : isDisabled
                          ? "border-cream-200 bg-cream-50 opacity-50 cursor-not-allowed"
                          : "border-cream-200 hover:border-purple-300"
                      }`}
                    >
                      <Checkbox
                        id={value.id}
                        checked={isSelected}
                        onCheckedChange={() =>
                          !isDisabled && handleToggleValue(value.id, "top10")
                        }
                        disabled={isDisabled}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-medium text-charcoal-800">
                          {value.label}
                        </span>
                        <p className="text-sm text-charcoal-600 font-body">
                          {value.description}
                        </p>
                      </div>
                    </Label>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )

      case "select-5":
        return (
          <Card className="shadow-lg" variant="light">
            <CardHeader>
              <CardTitle className="text-xl text-charcoal-800 font-display">
                Step 2: Narrow to Your Core 5
              </CardTitle>
              <CardDescription className="text-charcoal-600 font-body">
                From your top 10, select the 5 values that are absolutely essential
                to your career satisfaction.
              </CardDescription>
              <Badge
                variant={selectedCore5.length === 5 ? "default" : "outline"}
                className={
                  selectedCore5.length === 5
                    ? "bg-green-600"
                    : "bg-purple-100 text-purple-700"
                }
              >
                {selectedCore5.length}/5 selected
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTop10.map((valueId) => {
                  const value = workValues.find((v) => v.id === valueId)
                  if (!value) return null

                  const isSelected = selectedCore5.includes(valueId)
                  const isDisabled = !isSelected && selectedCore5.length >= 5

                  return (
                    <Label
                      key={valueId}
                      htmlFor={`core-${valueId}`}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : isDisabled
                          ? "border-cream-200 bg-cream-50 opacity-50 cursor-not-allowed"
                          : "border-cream-200 hover:border-purple-300"
                      }`}
                    >
                      <Checkbox
                        id={`core-${valueId}`}
                        checked={isSelected}
                        onCheckedChange={() =>
                          !isDisabled && handleToggleValue(valueId, "core5")
                        }
                        disabled={isDisabled}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-medium text-charcoal-800">
                          {value.label}
                        </span>
                        <p className="text-sm text-charcoal-600 font-body">
                          {value.description}
                        </p>
                      </div>
                    </Label>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )

      case "weight":
        const totalWeight = getTotalWeight()
        return (
          <Card className="shadow-lg" variant="light">
            <CardHeader>
              <CardTitle className="text-xl text-charcoal-800 font-display">
                Step 3: Weight Your Values
              </CardTitle>
              <CardDescription className="text-charcoal-600 font-body">
                Assign importance weights to your core values. Total must equal 100%.
              </CardDescription>
              <div className="flex items-center gap-2">
                <Badge
                  variant={totalWeight === 100 ? "default" : "outline"}
                  className={
                    totalWeight === 100
                      ? "bg-green-600"
                      : totalWeight > 100
                      ? "bg-red-100 text-red-700"
                      : "bg-purple-100 text-purple-700"
                  }
                >
                  Total: {totalWeight}%
                </Badge>
                {totalWeight !== 100 && (
                  <span className="text-sm text-charcoal-600 font-body">
                    {totalWeight < 100
                      ? `(${100 - totalWeight}% remaining)`
                      : `(${totalWeight - 100}% over)`}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedCore5.map((valueId) => (
                <div key={valueId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium text-charcoal-800">
                      {getValueLabel(valueId)}
                    </Label>
                    <span className="text-lg font-bold text-purple-500">
                      {weights[valueId] || 0}%
                    </span>
                  </div>
                  <Slider
                    value={[weights[valueId] || 0]}
                    onValueChange={(val) => handleWeightChange(valueId, val[0])}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              ))}

              {totalWeight !== 100 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>
                    Adjust the sliders until the total equals exactly 100%.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "align":
        return (
          <Card className="shadow-lg" variant="light">
            <CardHeader>
              <CardTitle className="text-xl text-charcoal-800 font-display">
                Step 4: Rate Current Alignment
              </CardTitle>
              <CardDescription className="text-charcoal-600 font-body">
                How well does your current role fulfill each of your core values?
                Rate from 0% (not at all) to 100% (completely).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedCore5.map((valueId) => (
                <div key={valueId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium text-charcoal-800">
                      {getValueLabel(valueId)}
                      <span className="text-sm text-charcoal-600 font-body ml-2">
                        (Weight: {weights[valueId]}%)
                      </span>
                    </Label>
                    <span
                      className={`text-lg font-bold ${
                        (alignments[valueId] || 0) >= 70
                          ? "text-green-600"
                          : (alignments[valueId] || 0) >= 40
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {alignments[valueId] || 0}%
                    </span>
                  </div>
                  <Slider
                    value={[alignments[valueId] || 50]}
                    onValueChange={(val) =>
                      setAlignments({ ...alignments, [valueId]: val[0] })
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-charcoal-600 font-body">
                    <span>Not fulfilled</span>
                    <span>Fully fulfilled</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )

      case "reflect":
        return (
          <Card className="shadow-lg" variant="light">
            <CardHeader>
              <CardTitle className="text-xl text-charcoal-800 font-display">
                Step 5: Reflection
              </CardTitle>
              <CardDescription className="text-charcoal-600 font-body">
                Share your thoughts to help personalize your recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gaps" className="font-medium">
                  What aspects of your current role create the biggest gap with
                  your values?
                </Label>
                <Textarea
                  id="gaps"
                  value={reflections.gaps}
                  onChange={(e) =>
                    setReflections({ ...reflections, gaps: e.target.value })
                  }
                  placeholder="Describe the specific situations or aspects..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ideal" className="font-medium">
                  Describe a work situation where your values would be fully
                  honored.
                </Label>
                <Textarea
                  id="ideal"
                  value={reflections.ideal}
                  onChange={(e) =>
                    setReflections({ ...reflections, ideal: e.target.value })
                  }
                  placeholder="Imagine your ideal work scenario..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress header */}
      {currentStep !== "intro" && (
        <Card variant="light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-charcoal-600 font-body">
                Step {stepIndex} of {steps.length - 1}
              </span>
              <span className="text-sm font-medium text-purple-500">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {currentStep !== "intro" && (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isSubmitting
              ? "Submitting..."
              : currentStep === "reflect"
              ? "Submit"
              : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
