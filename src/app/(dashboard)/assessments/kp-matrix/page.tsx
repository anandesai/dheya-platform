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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Target,
  Plus,
  X,
  CheckCircle,
  Lightbulb,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface Skill {
  id: string
  name: string
  knowledge: number
  passion: number
}

const STORAGE_KEY = "kp-matrix-assessment"

export default function KPMatrixAssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState<"intro" | "input" | "rating">("intro")
  const [skills, setSkills] = useState<Skill[]>([])
  const [currentSkillInput, setCurrentSkillInput] = useState("")
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      setSkills(data.skills || [])
      setStep(data.step || "intro")
      setCurrentRatingIndex(data.currentRatingIndex || 0)
    }
  }, [])

  // Auto-save progress
  useEffect(() => {
    if (skills.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          skills,
          step,
          currentRatingIndex,
        })
      )
    }
  }, [skills, step, currentRatingIndex])

  const addSkill = () => {
    if (currentSkillInput.trim() && skills.length < 20) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: currentSkillInput.trim(),
        knowledge: 5,
        passion: 5,
      }
      setSkills([...skills, newSkill])
      setCurrentSkillInput("")
    }
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id))
  }

  const updateSkillRating = (
    id: string,
    type: "knowledge" | "passion",
    value: number
  ) => {
    setSkills(
      skills.map((s) =>
        s.id === id ? { ...s, [type]: value } : s
      )
    )
  }

  const handleNext = () => {
    if (step === "intro") {
      setStep("input")
    } else if (step === "input") {
      if (skills.length >= 5) {
        setStep("rating")
      }
    } else if (step === "rating") {
      if (currentRatingIndex < skills.length - 1) {
        setCurrentRatingIndex(currentRatingIndex + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (step === "input") {
      setStep("intro")
    } else if (step === "rating") {
      if (currentRatingIndex > 0) {
        setCurrentRatingIndex(currentRatingIndex - 1)
      } else {
        setStep("input")
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Save to localStorage
    localStorage.setItem(
      "kp-matrix-result",
      JSON.stringify({
        skills,
        completedAt: new Date().toISOString(),
      })
    )

    // Clear in-progress data
    localStorage.removeItem(STORAGE_KEY)

    // Navigate to results
    router.push("/assessments/kp-matrix/results")
  }

  const progress =
    step === "intro"
      ? 0
      : step === "input"
      ? 33
      : Math.round(((currentRatingIndex + 1) / skills.length) * 67 + 33)

  // Intro screen
  if (step === "intro") {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg" variant="light">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <CardTitle className="text-2xl text-charcoal-800 font-display">
              Knowledge-Passion Matrix
            </CardTitle>
            <CardDescription className="text-base mt-2 text-charcoal-600 font-body">
              Identify which skills to leverage, develop, or deprioritize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-cream-50 rounded-lg">
                <div className="text-2xl font-bold text-charcoal-800 font-display">
                  10-15
                </div>
                <div className="text-sm text-charcoal-600 font-body">Skills to Rate</div>
              </div>
              <div className="text-center p-4 bg-cream-50 rounded-lg">
                <div className="text-2xl font-bold text-charcoal-800 font-display">
                  15-20
                </div>
                <div className="text-sm text-charcoal-600 font-body">Minutes</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-charcoal-800 mb-3 font-display">
                  What you&apos;ll discover:
                </h4>
                <ul className="space-y-2 text-sm text-charcoal-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-green-600">Growth Zone</strong> - High
                      knowledge + passion: Your sweet spot to leverage
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-blue-600">Development Zone</strong> - Low
                      knowledge + high passion: Learn and grow here
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-yellow-600">Survivor Zone</strong> - High
                      knowledge + low passion: Can do, but draining
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-red-600">Weed Off Zone</strong> - Low
                      knowledge + passion: Deprioritize these
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-sage-100 rounded-lg p-4 border border-sage-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-charcoal-700">
                    <strong className="font-medium">Pro tip:</strong> Include both
                    technical skills (coding, design) and soft skills (communication,
                    leadership) for a comprehensive view.
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-charcoal-600 font-body">
              Your responses are saved automatically. Pause and resume anytime.
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
      </div>
    )
  }

  // Skill input step
  if (step === "input") {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress header */}
        <Card variant="light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Step 1 of 2</Badge>
                <span className="text-sm text-charcoal-600 font-body">
                  List Your Skills
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

        {/* Main input card */}
        <Card className="shadow-lg" variant="light">
          <CardHeader>
            <CardTitle className="text-xl text-charcoal-800 font-display">
              List 10-15 Skills or Activities
            </CardTitle>
            <CardDescription className="text-charcoal-600 font-body">
              Think about both technical and soft skills from your work. You can
              always add or remove skills later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input field */}
            <div className="space-y-2">
              <Label htmlFor="skill-input" className="font-body">
                Add a skill or activity
              </Label>
              <div className="flex gap-2">
                <Input
                  id="skill-input"
                  value={currentSkillInput}
                  onChange={(e) => setCurrentSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="e.g., JavaScript, Public Speaking, Team Leadership"
                  className="flex-1"
                  maxLength={50}
                />
                <Button
                  onClick={addSkill}
                  disabled={!currentSkillInput.trim() || skills.length >= 20}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between text-xs text-charcoal-500">
                <span>
                  {skills.length < 5
                    ? `Add at least ${5 - skills.length} more skill(s)`
                    : skills.length < 10
                    ? "Good start! Add a few more for better insights"
                    : "Great! You can add up to 20 skills total"}
                </span>
                <span>
                  {skills.length}/20
                </span>
              </div>
            </div>

            {/* Skills list */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <Label className="font-body">Your skills ({skills.length})</Label>
                <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg border border-cream-200"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-600">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-charcoal-700 font-body">
                          {skill.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={skills.length < 5}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Rate Skills
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rating step
  const currentSkill = skills[currentRatingIndex]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress header */}
      <Card variant="light">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 2 of 2</Badge>
              <span className="text-sm text-charcoal-600 font-body">
                Rate Your Skills
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">Auto-saved</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm font-medium text-purple-500">{progress}%</span>
          </div>
          <div className="text-xs text-charcoal-500 mt-2 text-center">
            Skill {currentRatingIndex + 1} of {skills.length}
          </div>
        </CardContent>
      </Card>

      {/* Rating card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRatingIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg" variant="light">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-purple-600">
                  {currentRatingIndex + 1}
                </span>
              </div>
              <CardTitle className="text-2xl text-charcoal-800 font-display">
                {currentSkill.name}
              </CardTitle>
              <CardDescription className="text-charcoal-600 font-body">
                Rate your knowledge and passion for this skill
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Knowledge rating */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium font-display">
                    Knowledge / Competence
                  </Label>
                  <Badge className="bg-blue-500 text-white">
                    {currentSkill.knowledge}/10
                  </Badge>
                </div>
                <div className="px-3">
                  <Slider
                    value={[currentSkill.knowledge]}
                    onValueChange={(value) =>
                      updateSkillRating(currentSkill.id, "knowledge", value[0])
                    }
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-charcoal-500 px-2">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
                <p className="text-sm text-charcoal-600 bg-blue-50 p-3 rounded-lg">
                  How skilled are you at this? Rate from 1 (just starting) to 10
                  (expert level).
                </p>
              </div>

              {/* Passion rating */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium font-display">
                    Passion / Interest
                  </Label>
                  <Badge className="bg-pink-500 text-white">
                    {currentSkill.passion}/10
                  </Badge>
                </div>
                <div className="px-3">
                  <Slider
                    value={[currentSkill.passion]}
                    onValueChange={(value) =>
                      updateSkillRating(currentSkill.id, "passion", value[0])
                    }
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-charcoal-500 px-2">
                  <span>Dislike</span>
                  <span>Neutral</span>
                  <span>Love it</span>
                </div>
                <p className="text-sm text-charcoal-600 bg-pink-50 p-3 rounded-lg">
                  How much do you enjoy this? Rate from 1 (draining) to 10 (energizing).
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {currentRatingIndex === 0 ? "Back to Skills" : "Previous"}
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentRatingIndex === skills.length - 1
                    ? "View Results"
                    : "Next Skill"}
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
