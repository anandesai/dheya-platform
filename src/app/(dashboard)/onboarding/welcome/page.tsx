"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Rocket,
  Target,
  Crown,
  Heart,
  ArrowRight,
  ClipboardList,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react"

const segmentIcons = {
  EARLY_CAREER: Rocket,
  MID_CAREER: Target,
  SENIOR: Crown,
  RETURNING_WOMEN: Heart,
}

const segmentNames = {
  EARLY_CAREER: "Develop Advantage",
  MID_CAREER: "Destination Mastery",
  SENIOR: "Design Legacy",
  RETURNING_WOMEN: "Restart & Rise",
}

const packageNames = {
  guidance: "Guidance",
  planning: "Planning",
  mentorship: "Mentorship",
}

const nextSteps = [
  {
    icon: ClipboardList,
    title: "Complete Your First Assessment",
    description: "Start with our foundational assessment to establish your baseline.",
    action: "Start Assessment",
    href: "/assessments",
  },
  {
    icon: Calendar,
    title: "Book Your First Session",
    description: "Schedule a session with your assigned mentor to kickstart your journey.",
    action: "Book Session",
    href: "/sessions",
  },
  {
    icon: TrendingUp,
    title: "Explore Your Dashboard",
    description: "Familiarize yourself with your personalized dashboard and tools.",
    action: "Go to Dashboard",
    href: "/dashboard",
  },
]

export default function WelcomePage() {
  const router = useRouter()
  const [segment, setSegment] = useState<keyof typeof segmentIcons>("MID_CAREER")
  const [packageTier, setPackageTier] = useState<keyof typeof packageNames>("planning")

  useEffect(() => {
    // Get selections from localStorage
    const storedSegment = localStorage.getItem("selectedSegment") as keyof typeof segmentIcons
    const storedPackage = localStorage.getItem("selectedPackage") as keyof typeof packageNames

    if (storedSegment) setSegment(storedSegment)
    if (storedPackage) setPackageTier(storedPackage)

    // TODO: Mark onboarding as complete via API
  }, [])

  const Icon = segmentIcons[segment] || Target

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-charcoal-600 font-body">Step 4 of 4</span>
          <span className="text-sm font-medium text-green-600">Complete!</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>

      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal-800 mb-4">
          Welcome to Your Career Transformation!
        </h1>
        <p className="text-lg text-charcoal-600 font-body max-w-2xl mx-auto">
          You&apos;re all set to begin your {segmentNames[segment]} journey.
          Your personalized mentorship experience awaits.
        </p>
      </motion.div>

      {/* Selection summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card variant="light" className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold text-charcoal-800 mb-1">
                  {segmentNames[segment]} - {packageNames[packageTier]} Package
                </h2>
                <p className="text-charcoal-600 font-body">
                  Your personalized program has been configured based on your profile and goals.
                </p>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="font-display text-2xl font-bold text-charcoal-800 mb-6 text-center">
          Your Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {nextSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
            >
              <Card variant="light" className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                    <step.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={step.href}>
                    <Button variant="outline" className="w-full">
                      {step.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center"
      >
        <Button
          size="lg"
          className="bg-purple-500 hover:bg-purple-600 text-lg px-8"
          onClick={() => router.push("/dashboard")}
        >
          Go to My Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="mt-4 text-sm text-charcoal-600 font-body">
          Need help getting started?{" "}
          <Link href="/contact" className="text-purple-600 hover:underline">
            Contact our support team
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
