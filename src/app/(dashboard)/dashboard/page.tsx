"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { JourneyTracker } from "@/components/dashboard/journey-tracker"
import { ToolsGrid } from "@/components/dashboard/tools-grid"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import {
  BBDScoreWidget,
  ValuesAlignmentWidget,
  CLIQIWidget,
  PossibilityMatrixWidget,
  LegacyVisionWidget,
  ConfidenceScoreWidget,
} from "@/components/dashboard/segment-widgets"
import {
  Rocket,
  Target,
  Crown,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

type SegmentId = "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN"

const segmentConfig = {
  EARLY_CAREER: {
    name: "Develop Advantage",
    icon: Rocket,
    color: "bg-blue-500",
    tagline: "Build your career foundation with clarity and confidence",
  },
  MID_CAREER: {
    name: "Destination Mastery",
    icon: Target,
    color: "bg-purple-500",
    tagline: "Break through stagnation and find fulfillment",
  },
  SENIOR: {
    name: "Design Legacy",
    icon: Crown,
    color: "bg-gold-500",
    tagline: "Create your second innings with purpose and impact",
  },
  RETURNING_WOMEN: {
    name: "Restart & Rise",
    icon: Heart,
    color: "bg-pink-500",
    tagline: "Return to work with renewed confidence and direction",
  },
}

const packageNames = {
  guidance: "Guidance",
  planning: "Planning",
  mentorship: "Mentorship",
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [segment, setSegment] = useState<SegmentId>("MID_CAREER")
  const [packageTier, setPackageTier] = useState<keyof typeof packageNames>("planning")

  useEffect(() => {
    // Get segment and package from localStorage
    const storedSegment = localStorage.getItem("selectedSegment") as SegmentId
    const storedPackage = localStorage.getItem("selectedPackage") as keyof typeof packageNames

    if (storedSegment && storedSegment in segmentConfig) {
      setSegment(storedSegment)
    }
    if (storedPackage && storedPackage in packageNames) {
      setPackageTier(storedPackage)
    }
  }, [])

  const config = segmentConfig[segment]
  const Icon = config.icon
  const firstName = session?.user?.firstName || "User"

  // Render segment-specific widgets
  const renderSegmentWidgets = () => {
    switch (segment) {
      case "EARLY_CAREER":
        return (
          <>
            <PossibilityMatrixWidget />
            <CLIQIWidget />
          </>
        )
      case "MID_CAREER":
        return (
          <>
            <BBDScoreWidget />
            <ValuesAlignmentWidget />
          </>
        )
      case "SENIOR":
        return (
          <>
            <LegacyVisionWidget />
            <CLIQIWidget />
          </>
        )
      case "RETURNING_WOMEN":
        return (
          <>
            <ConfidenceScoreWidget />
            <ValuesAlignmentWidget />
          </>
        )
      default:
        return (
          <>
            <CLIQIWidget />
            <ValuesAlignmentWidget />
          </>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-charcoal-800">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-charcoal-600 font-body mt-1">{config.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${config.color} text-white`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.name}
          </Badge>
          <Badge variant="outline">
            <Sparkles className="w-3 h-3 mr-1" />
            {packageNames[packageTier]} Package
          </Badge>
        </div>
      </div>

      {/* Quick action card for incomplete onboarding */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-semibold font-display text-charcoal-800">
                Complete your first assessment
              </h3>
              <p className="text-sm text-charcoal-600 font-body">
                Start with the BBD Assessment to understand your current career state
              </p>
            </div>
            <Link href="/assessments/bbd-assessment">
              <Button className="bg-purple-500 hover:bg-purple-600">
                Start Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Journey tracker */}
        <div className="lg:col-span-1">
          <JourneyTracker />
        </div>

        {/* Right column - Segment widgets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSegmentWidgets()}
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <ToolsGrid />

      {/* Upcoming sessions */}
      <UpcomingSessions />

      {/* Upgrade prompt for non-mentorship packages */}
      {packageTier !== "mentorship" && (
        <Card variant="light" className="border-gold-200 bg-gradient-to-r from-gold-50 to-cream-50">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold-500" />
              Unlock Full Potential
            </CardTitle>
            <CardDescription className="font-body">
              Upgrade to the Mentorship package for complete access to all tools
              and extended mentor support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings/upgrade">
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
                View Upgrade Options
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
