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
import { WorkbookProgressWidget } from "@/components/dashboard/workbook-progress-widget"
import { ToolsGrid } from "@/components/dashboard/tools-grid"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import {
  BBDScoreWidget,
  ValuesAlignmentWidget,
  CLIQIWidget,
  PossibilityMatrixWidget,
  LegacyVisionWidget,
  ConfidenceScoreWidget,
  LifeStageWidget,
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
    color: "bg-purple-500",
    tagline: "Build your career foundation with clarity and confidence",
  },
  MID_CAREER: {
    name: "Destination Mastery",
    icon: Target,
    color: "bg-sage-600",
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
            <LifeStageWidget />
            <ValuesAlignmentWidget />
          </>
        )
      case "SENIOR":
        return (
          <>
            <LegacyVisionWidget />
            <LifeStageWidget />
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
    <div className="container-uplift space-y-12">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 tracking-tight">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-lg text-charcoal-600 font-body mt-2 leading-relaxed">{config.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${config.color} text-white px-4 py-1.5 text-sm font-semibold rounded-full`}>
            <Icon className="w-4 h-4 mr-2" />
            {config.name}
          </Badge>
          <Badge variant="outline" className="px-4 py-1.5 text-sm font-semibold rounded-full border-charcoal-200">
            <Sparkles className="w-4 h-4 mr-2 text-gold-500" />
            {packageNames[packageTier]} Package
          </Badge>
        </div>
      </div>

      {/* Quick action card for incomplete onboarding */}
      <Card variant="light" hover="glow" className="border-purple-200 bg-gradient-to-r from-purple-50 from-10% to-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center border-4 border-white shadow-sm">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <h3 className="text-xl font-bold font-display text-charcoal-900">
                Complete your first assessment
              </h3>
              <p className="text-charcoal-600 font-body">
                Start with the <strong>BBD Syndrome Assessment</strong> to understand your current career state.
              </p>
            </div>
            <Link href="/assessments/bbd">
              <Button variant="uplift" size="lg">
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Journey tracker */}
        <div className="lg:col-span-1 space-y-8">
          <JourneyTracker />
          <WorkbookProgressWidget />
        </div>

        {/* Right column - Segment widgets */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderSegmentWidgets()}
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="space-y-4">
        <h2 className="heading-card text-charcoal-800">Your Tools</h2>
        <ToolsGrid />
      </div>

      {/* Upcoming sessions */}
      <div className="space-y-4">
        <h2 className="heading-card text-charcoal-800">Upcoming Sessions</h2>
        <UpcomingSessions />
      </div>

      {/* Upgrade prompt for non-mentorship packages */}
      {packageTier !== "mentorship" && (
        <Card variant="light" className="border-gold-200 bg-gradient-to-r from-gold-50/50 to-white">
          <CardHeader>
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <Crown className="w-6 h-6 text-gold-500 fill-gold-500" />
              Unlock Full Potential
            </CardTitle>
            <CardDescription className="text-base font-body text-charcoal-600">
              Upgrade to the Mentorship package for complete access to all tools
              and extended mentor support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings/upgrade">
              <Button variant="outline" className="border-gold-400 text-gold-700 hover:bg-gold-50">
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
