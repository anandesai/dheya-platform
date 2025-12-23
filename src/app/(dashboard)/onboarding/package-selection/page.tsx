"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
} from "lucide-react"

type SegmentId = "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN"

interface PackageTier {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  sessions: number
  mentorLevel: string
  features: string[]
  highlighted?: boolean
  badge?: string
}

const packagesBySegment: Record<SegmentId, PackageTier[]> = {
  EARLY_CAREER: [
    {
      id: "guidance",
      name: "Career Guidance",
      description: "Foundation package for career clarity",
      price: 25000,
      sessions: 3,
      mentorLevel: "Associate",
      features: [
        "Identity Discovery Assessment",
        "Interest Inventory Tool",
        "3 Mentor Sessions",
        "Career Direction Report",
        "Email Support",
      ],
    },
    {
      id: "planning",
      name: "Career Planning",
      description: "Comprehensive career planning with action roadmap",
      price: 45000,
      sessions: 6,
      mentorLevel: "Senior",
      highlighted: true,
      badge: "Most Popular",
      features: [
        "All Guidance Features",
        "Possibility Matrix Tool",
        "Skills Gap Analysis",
        "6 Mentor Sessions",
        "Personalized Career Roadmap",
        "Priority Email Support",
        "LinkedIn Profile Review",
      ],
    },
    {
      id: "mentorship",
      name: "Career Mentorship",
      description: "Full mentorship program for career transformation",
      price: 75000,
      sessions: 12,
      mentorLevel: "Principal",
      features: [
        "All Planning Features",
        "Full Assessment Suite",
        "12 Mentor Sessions",
        "Interview Preparation",
        "Salary Negotiation Coaching",
        "Quarterly Career Reviews",
        "Alumni Network Access",
        "1-Year Support Access",
      ],
    },
  ],
  MID_CAREER: [
    {
      id: "guidance",
      name: "Career Guidance",
      description: "Break through career stagnation",
      price: 35000,
      sessions: 3,
      mentorLevel: "Senior",
      features: [
        "BBD Syndrome Assessment",
        "Work Values Alignment",
        "3 Mentor Sessions",
        "Career Reset Report",
        "Email Support",
      ],
    },
    {
      id: "planning",
      name: "Career Planning",
      description: "Strategic career pivot planning",
      price: 65000,
      sessions: 8,
      mentorLevel: "Principal",
      highlighted: true,
      badge: "Best Value",
      features: [
        "All Guidance Features",
        "Knowledge-Passion Matrix",
        "Life Stage Assessment",
        "8 Mentor Sessions",
        "Career Pivot Strategy",
        "Leadership Assessment",
        "Priority Email Support",
        "Executive Resume Review",
      ],
    },
    {
      id: "mentorship",
      name: "Career Mentorship",
      description: "Executive-level career transformation",
      price: 110000,
      sessions: 15,
      mentorLevel: "Executive",
      features: [
        "All Planning Features",
        "Full Assessment Suite",
        "15 Mentor Sessions",
        "Executive Coaching",
        "Board-Ready Profile Building",
        "C-Suite Networking",
        "Quarterly Strategic Reviews",
        "2-Year Support Access",
      ],
    },
  ],
  SENIOR: [
    {
      id: "guidance",
      name: "Legacy Guidance",
      description: "Define your second innings vision",
      price: 45000,
      sessions: 4,
      mentorLevel: "Principal",
      features: [
        "Wisdom Assets Portfolio",
        "Legacy Vision Canvas",
        "4 Mentor Sessions",
        "Second Innings Blueprint",
        "Email Support",
      ],
    },
    {
      id: "planning",
      name: "Legacy Planning",
      description: "Comprehensive legacy planning",
      price: 85000,
      sessions: 10,
      mentorLevel: "Executive",
      highlighted: true,
      badge: "Recommended",
      features: [
        "All Guidance Features",
        "Financial Freedom Assessment",
        "Board Readiness Evaluation",
        "10 Mentor Sessions",
        "Advisory Path Strategy",
        "Mentoring Program Design",
        "Priority Email Support",
        "Executive Network Access",
      ],
    },
    {
      id: "mentorship",
      name: "Legacy Mentorship",
      description: "Complete legacy transformation",
      price: 150000,
      sessions: 18,
      mentorLevel: "C-Suite",
      features: [
        "All Planning Features",
        "Full Assessment Suite",
        "18 Mentor Sessions",
        "Board Placement Support",
        "Author/Speaker Platform",
        "Non-Profit Board Access",
        "Quarterly Legacy Reviews",
        "Lifetime Alumni Access",
      ],
    },
  ],
  RETURNING_WOMEN: [
    {
      id: "guidance",
      name: "Restart Guidance",
      description: "Rebuild confidence and clarity",
      price: 25000,
      sessions: 4,
      mentorLevel: "Senior",
      features: [
        "Confidence Assessment",
        "Skills Gap Analysis",
        "4 Mentor Sessions",
        "Re-entry Strategy Report",
        "Email Support",
        "Women's Network Access",
      ],
    },
    {
      id: "planning",
      name: "Restart Planning",
      description: "Strategic career re-entry planning",
      price: 45000,
      sessions: 8,
      mentorLevel: "Principal",
      highlighted: true,
      badge: "Most Chosen",
      features: [
        "All Guidance Features",
        "Support System Mapping",
        "Work-Life Integration Plan",
        "8 Mentor Sessions",
        "Returnship Preparation",
        "Interview Coaching",
        "Priority Email Support",
        "Peer Support Circle",
      ],
    },
    {
      id: "mentorship",
      name: "Restart Mentorship",
      description: "Complete restart transformation",
      price: 75000,
      sessions: 12,
      mentorLevel: "Executive",
      features: [
        "All Planning Features",
        "Full Assessment Suite",
        "12 Mentor Sessions",
        "Flexible Role Matching",
        "Negotiation Coaching",
        "Leadership Fast-Track",
        "Quarterly Progress Reviews",
        "1-Year Support Access",
      ],
    },
  ],
}

const segmentNames: Record<SegmentId, string> = {
  EARLY_CAREER: "Develop Advantage",
  MID_CAREER: "Destination Mastery",
  SENIOR: "Design Legacy",
  RETURNING_WOMEN: "Restart & Rise",
}

export default function PackageSelectionPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [segment, setSegment] = useState<SegmentId>("MID_CAREER")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get segment from localStorage (set in segment-quiz)
    const storedSegment = localStorage.getItem("selectedSegment")
    if (storedSegment && storedSegment in packagesBySegment) {
      setSegment(storedSegment as SegmentId)
    }
  }, [])

  const packages = packagesBySegment[segment]

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId)
  }

  const handleContinue = async () => {
    if (!selectedPackage) return
    setIsSubmitting(true)

    // TODO: Save package selection via API
    localStorage.setItem("selectedPackage", selectedPackage)

    await new Promise(resolve => setTimeout(resolve, 500))
    router.push("/onboarding/welcome")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-charcoal-600 font-body">Step 3 of 4</span>
          <span className="text-sm font-medium text-purple-600">75% Complete</span>
        </div>
        <Progress value={75} className="h-2" />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
          {segmentNames[segment]}
        </Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal-800 mb-3">
          Choose Your Mentorship Package
        </h1>
        <p className="text-lg text-charcoal-600 font-body max-w-2xl mx-auto">
          Select the package that best fits your career goals. All packages include
          our signature 7D methodology and personalized guidance.
        </p>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            variant="light"
            className={`relative cursor-pointer transition-all ${
              selectedPackage === pkg.id
                ? "border-purple-500 border-2 shadow-lg"
                : pkg.highlighted
                ? "border-purple-200 border-2 shadow-md"
                : "hover:border-purple-300 hover:shadow-md"
            }`}
            onClick={() => handleSelectPackage(pkg.id)}
          >
            {pkg.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-purple-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {pkg.badge}
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl text-charcoal-800">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center">
                <div className="text-3xl font-bold text-charcoal-800">
                  {formatPrice(pkg.price)}
                </div>
                <p className="text-sm text-charcoal-600 font-body mt-1">
                  {pkg.sessions} mentor sessions
                </p>
              </div>

              {/* Mentor level */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <Star className="h-4 w-4 text-gold-500" />
                <span className="text-charcoal-600">{pkg.mentorLevel} Mentor</span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-charcoal-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Select button */}
              <Button
                className={`w-full ${
                  selectedPackage === pkg.id
                    ? "bg-purple-500 hover:bg-purple-600"
                    : pkg.highlighted
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-charcoal-800 hover:bg-charcoal-900"
                }`}
                variant={selectedPackage === pkg.id ? "default" : "default"}
              >
                {selectedPackage === pkg.id ? "Selected" : "Select Package"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Money-back guarantee */}
      <div className="text-center mb-8">
        <p className="text-sm text-charcoal-600 font-body">
          ✓ 7-day money-back guarantee • ✓ Flexible payment options • ✓ EMI available
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/onboarding/profile")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedPackage || isSubmitting}
          className="bg-purple-500 hover:bg-purple-600"
        >
          {isSubmitting ? "Processing..." : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
