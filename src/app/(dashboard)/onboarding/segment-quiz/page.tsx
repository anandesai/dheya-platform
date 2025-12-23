"use client"

import { useState } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Rocket,
  Target,
  Crown,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"

const questions = [
  {
    id: 1,
    question: "What is your current career stage?",
    options: [
      { value: "0-3", label: "Just starting (0-3 years of experience)" },
      { value: "3-10", label: "Building momentum (3-10 years of experience)" },
      { value: "10-20", label: "Established professional (10-20 years of experience)" },
      { value: "20+", label: "Senior leader (20+ years of experience)" },
    ],
  },
  {
    id: 2,
    question: "What is your age range?",
    options: [
      { value: "22-30", label: "22-30 years" },
      { value: "30-45", label: "30-45 years" },
      { value: "45+", label: "45+ years" },
      { value: "any", label: "Prefer not to say" },
    ],
  },
  {
    id: 3,
    question: "What best describes your current situation?",
    options: [
      { value: "exploring", label: "Exploring career options and finding my path" },
      { value: "stuck", label: "Feeling stuck or unfulfilled in my current role" },
      { value: "legacy", label: "Planning my next chapter and legacy" },
      { value: "returning", label: "Returning to work after a career break" },
    ],
  },
  {
    id: 4,
    question: "What is your primary goal?",
    options: [
      { value: "clarity", label: "Gain clarity on my career direction" },
      { value: "growth", label: "Break through to the next level" },
      { value: "meaning", label: "Find more meaning and purpose" },
      { value: "restart", label: "Successfully restart my career" },
    ],
  },
  {
    id: 5,
    question: "Have you taken a career break recently?",
    options: [
      { value: "no", label: "No, I've been continuously employed" },
      { value: "short", label: "Yes, a short break (less than 1 year)" },
      { value: "long", label: "Yes, an extended break (1+ years)" },
      { value: "considering", label: "Considering taking a break" },
    ],
  },
]

const segments = {
  "early-career": {
    id: "EARLY_CAREER",
    name: "Develop Advantage",
    description: "Perfect for professionals aged 22-30 who are exploring career options and building their foundation.",
    icon: Rocket,
    color: "bg-blue-500",
  },
  "mid-career": {
    id: "MID_CAREER",
    name: "Destination Mastery",
    description: "Designed for professionals aged 30-45 who feel stuck and want to break through to the next level.",
    icon: Target,
    color: "bg-purple-500",
  },
  "senior": {
    id: "SENIOR",
    name: "Design Legacy",
    description: "For seasoned professionals aged 45+ planning their next chapter and creating lasting impact.",
    icon: Crown,
    color: "bg-gold-500",
  },
  "returning-women": {
    id: "RETURNING_WOMEN",
    name: "Restart & Rise",
    description: "Specially crafted for women returning to work after a career break, ready to restart with confidence.",
    icon: Heart,
    color: "bg-pink-500",
  },
}

function calculateSegment(answers: Record<number, string>): keyof typeof segments {
  // Simple algorithm to determine segment based on answers
  const age = answers[2]
  const situation = answers[3]
  const careerBreak = answers[5]

  // Check for returning women first
  if (careerBreak === "long" || (careerBreak === "short" && situation === "returning")) {
    return "returning-women"
  }

  // Check age-based segments
  if (age === "22-30" || situation === "exploring") {
    return "early-career"
  }

  if (age === "45+" || situation === "legacy") {
    return "senior"
  }

  // Default to mid-career
  return "mid-career"
}

export default function SegmentQuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [recommendedSegment, setRecommendedSegment] = useState<keyof typeof segments | null>(null)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate and show result
      const segment = calculateSegment(answers)
      setRecommendedSegment(segment)
      setShowResult(true)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleConfirmSegment = async () => {
    if (!recommendedSegment) return

    // TODO: Save segment to user profile via API
    // For now, store in localStorage and redirect
    localStorage.setItem("selectedSegment", segments[recommendedSegment].id)
    router.push("/onboarding/profile")
  }

  const currentAnswer = answers[questions[currentQuestion]?.id]

  if (showResult && recommendedSegment) {
    const segment = segments[recommendedSegment]
    const Icon = segment.icon

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card variant="light" className="border-2 border-purple-200 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <div className={`inline-flex p-4 rounded-full ${segment.color}`}>
                  <Icon className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Perfect Match Found!</span>
              </div>
              <CardTitle className="font-display text-3xl text-charcoal-800">
                {segment.name}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {segment.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-cream-100 rounded-lg p-4">
                <h4 className="font-medium text-charcoal-800 mb-2">Based on your answers:</h4>
                <ul className="space-y-2 text-sm text-charcoal-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Career stage aligns with this program
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Goals match our methodology
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Assessment tools tailored for you
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResult(false)
                    setCurrentQuestion(0)
                    setAnswers({})
                  }}
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
                <Button
                  onClick={handleConfirmSegment}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  Continue with {segment.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="text-center text-sm text-charcoal-600 font-body">
                Don&apos;t worry, you can change this later in settings
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-charcoal-600 font-body">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="light" className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-charcoal-800">
                  {questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={currentAnswer || ""}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        currentAnswer === option.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-cream-200 hover:border-purple-300 hover:bg-cream-50"
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="text-charcoal-700">{option.label}</span>
                    </Label>
                  ))}
                </RadioGroup>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
