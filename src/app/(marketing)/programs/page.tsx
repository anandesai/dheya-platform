"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  Target,
  Crown,
  Heart,
  Check,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Award,
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const segments = [
  {
    id: "early-career",
    name: "Develop Advantage",
    subtitle: "Early Career (22-30)",
    description:
      "Launch your career with clarity and confidence. Discover your unique strengths, explore possibilities, and create a roadmap for success.",
    icon: Rocket,
    color: "purple",
    href: "/programs/early-career",
    features: [
      "Identity & Values Discovery",
      "Career Possibility Mapping",
      "Industry Trend Analysis",
      "Personal Branding",
      "Interview Preparation",
    ],
    idealFor: [
      "Recent graduates",
      "Career starters",
      "Those seeking direction",
      "Young professionals exploring options",
    ],
    outcomes: [
      "Clear career direction",
      "Strong professional identity",
      "Actionable career plan",
      "Confidence in decisions",
    ],
    pricing: {
      guidance: { price: 25000, sessions: 4, duration: "6 weeks" },
      planning: { price: 45000, sessions: 8, duration: "12 weeks" },
      mentorship: { price: 75000, sessions: 16, duration: "6 months" },
    },
  },
  {
    id: "mid-career",
    name: "Destination Mastery",
    subtitle: "Mid Career (30-45)",
    description:
      "Break through career plateaus and rediscover your passion. Overcome the Bored-Burned-Dissatisfied syndrome and design your ideal career destination.",
    icon: Target,
    color: "forest",
    href: "/programs/mid-career",
    features: [
      "BBD Syndrome Assessment",
      "Work Values Alignment",
      "Knowledge-Passion Matrix",
      "Life Stage Integration",
      "Career Redesign Strategy",
    ],
    idealFor: [
      "Professionals feeling stuck",
      "Those seeking meaningful work",
      "Mid-level to senior managers",
      "Career pivoters",
    ],
    outcomes: [
      "Clarity on career direction",
      "Renewed work motivation",
      "Work-life integration",
      "Strategic career moves",
    ],
    pricing: {
      guidance: { price: 35000, sessions: 6, duration: "8 weeks" },
      planning: { price: 65000, sessions: 12, duration: "16 weeks" },
      mentorship: { price: 110000, sessions: 24, duration: "9 months" },
    },
  },
  {
    id: "senior",
    name: "Design Legacy",
    subtitle: "Senior Professionals (45+)",
    description:
      "Transform your wealth of experience into lasting impact. Design your second innings with purpose, whether in corporate roles, consulting, or entrepreneurship.",
    icon: Crown,
    color: "gold",
    href: "/programs/senior",
    features: [
      "Wisdom Assets Portfolio",
      "Legacy Vision Design",
      "Financial Freedom Planning",
      "Second Innings Strategy",
      "Board/Advisory Positioning",
    ],
    idealFor: [
      "Senior executives",
      "Pre-retirement professionals",
      "Those seeking legacy impact",
      "Experienced leaders",
    ],
    outcomes: [
      "Clear legacy vision",
      "Second career roadmap",
      "Portfolio career design",
      "Meaningful contribution",
    ],
    pricing: {
      guidance: { price: 45000, sessions: 6, duration: "8 weeks" },
      planning: { price: 85000, sessions: 12, duration: "16 weeks" },
      mentorship: { price: 150000, sessions: 24, duration: "12 months" },
    },
  },
  {
    id: "returning-women",
    name: "Restart & Rise",
    subtitle: "Returning Women Professionals",
    description:
      "Confidently re-enter the workforce after a career break. Rebuild skills, update your professional brand, and find opportunities that fit your life.",
    icon: Heart,
    color: "rose",
    href: "/programs/returning-women",
    features: [
      "Confidence Rebuilding",
      "Skills Gap Analysis",
      "Market Re-entry Strategy",
      "Flexible Work Navigation",
      "Support Network Building",
    ],
    idealFor: [
      "Women returning after breaks",
      "Mothers re-entering workforce",
      "Caregivers seeking work",
      "Those rebuilding careers",
    ],
    outcomes: [
      "Restored confidence",
      "Updated skill set",
      "Strong professional network",
      "Successful re-entry",
    ],
    pricing: {
      guidance: { price: 25000, sessions: 6, duration: "8 weeks" },
      planning: { price: 45000, sessions: 10, duration: "12 weeks" },
      mentorship: { price: 75000, sessions: 18, duration: "6 months" },
    },
  },
]

const phases = [
  {
    number: 1,
    name: "Diagnosis",
    description: "Comprehensive assessment of your current situation",
  },
  {
    number: 2,
    name: "Clarity",
    description: "Deep understanding of your values and aspirations",
  },
  {
    number: 3,
    name: "Exploration",
    description: "Mapping possibilities and opportunities",
  },
  {
    number: 4,
    name: "Strategy",
    description: "Creating your personalized career roadmap",
  },
  {
    number: 5,
    name: "Action",
    description: "Implementing with expert guidance",
  },
  {
    number: 6,
    name: "Mastery",
    description: "Continuous growth and achievement",
  },
]

const tierComparison = [
  {
    feature: "1-on-1 Mentor Sessions",
    guidance: "4-6",
    planning: "8-12",
    mentorship: "16-24",
  },
  {
    feature: "Phases Covered",
    guidance: "1-2",
    planning: "1-5",
    mentorship: "1-6",
  },
  {
    feature: "Assessment Tools",
    guidance: "Basic Set",
    planning: "Full Suite",
    mentorship: "Full Suite + AI",
  },
  {
    feature: "Career Workbooks",
    guidance: "2 Core",
    planning: "All Included",
    mentorship: "All + Premium",
  },
  {
    feature: "Mentor Level",
    guidance: "Certified (L1)",
    planning: "Expert (L2)",
    mentorship: "Master (L3)",
  },
  {
    feature: "Email Support",
    guidance: "Standard",
    planning: "Priority",
    mentorship: "24/7 Priority",
  },
  {
    feature: "Progress Reports",
    guidance: "Monthly",
    planning: "Bi-weekly",
    mentorship: "Weekly",
  },
  {
    feature: "Alumni Network",
    guidance: "Basic Access",
    planning: "Full Access",
    mentorship: "VIP Access",
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProgramsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-cream-50 via-cream-100 to-purple-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
              <Sparkles className="h-3 w-3 mr-1" />
              Personalized Programs
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-forest-900 mb-6">
              Find Your Perfect{" "}
              <span className="text-purple-600">Career Program</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose from our specialized programs designed for different career
              stages. Each program combines assessments, mentoring, and
              actionable strategies for your unique journey.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span>100,000+ Professionals Mentored</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span>91% Achieve Clarity</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>18+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-forest-900 mb-4">
              Programs Tailored for Every Stage
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a program that matches your current career stage and goals.
              Each is designed with specific assessments and strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {segments.map((segment) => {
              const Icon = segment.icon
              return (
                <Card
                  key={segment.id}
                  className="group relative overflow-hidden border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-xl ${
                          segment.color === "purple"
                            ? "bg-purple-100"
                            : segment.color === "forest"
                              ? "bg-forest-100"
                              : segment.color === "gold"
                                ? "bg-amber-100"
                                : "bg-rose-100"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            segment.color === "purple"
                              ? "text-purple-600"
                              : segment.color === "forest"
                                ? "text-forest-700"
                                : segment.color === "gold"
                                  ? "text-amber-600"
                                  : "text-rose-600"
                          }`}
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {segment.subtitle}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mt-4 text-forest-900">
                      {segment.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {segment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Key Focus Areas
                      </p>
                      <ul className="space-y-1">
                        {segment.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">
                        Starting from
                      </p>
                      <p className="text-2xl font-bold text-forest-900">
                        {formatPrice(segment.pricing.guidance.price)}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full bg-forest-800 hover:bg-forest-900 text-cream-100 group-hover:bg-purple-600"
                    >
                      <Link href={segment.href}>
                        Explore Program
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6-Phase Journey */}
      <section className="py-16 md:py-24 bg-forest-800 text-cream-100">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-600 text-white hover:bg-purple-600">
              The 7D Methodology
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your 6-Phase Journey to Career Clarity
            </h2>
            <p className="text-cream-200 max-w-2xl mx-auto">
              Every program follows our proven methodology, with the number of
              phases covered depending on your chosen tier.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {phases.map((phase) => (
              <div key={phase.number} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-purple-600 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold">{phase.number}</span>
                </div>
                <h3 className="font-semibold mb-1">{phase.name}</h3>
                <p className="text-xs text-cream-300">{phase.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 bg-forest-700/50 rounded-lg p-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-cream-100 text-forest-800">Guidance</Badge>
                <span>Phases 1-2</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500 text-white">Planning</Badge>
                <span>Phases 1-5</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gold-400 text-forest-900">Mentorship</Badge>
                <span>All 6 Phases</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 md:py-24 bg-cream-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-forest-900 mb-4">
              Compare Package Tiers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All programs offer three tiers to match your commitment level and
              goals. Choose the depth of support that&apos;s right for you.
            </p>
          </div>

          <Tabs defaultValue="mid-career" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
              <TabsTrigger value="early-career">Early Career</TabsTrigger>
              <TabsTrigger value="mid-career">Mid-Career</TabsTrigger>
              <TabsTrigger value="senior">Senior</TabsTrigger>
              <TabsTrigger value="returning-women">Returning Women</TabsTrigger>
            </TabsList>

            {segments.map((segment) => (
              <TabsContent key={segment.id} value={segment.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Guidance Tier */}
                  <Card className="border-2">
                    <CardHeader className="text-center pb-4">
                      <Badge variant="outline" className="w-fit mx-auto mb-2">
                        Starter
                      </Badge>
                      <CardTitle className="text-xl">Guidance</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-forest-900">
                          {formatPrice(segment.pricing.guidance.price)}
                        </span>
                      </div>
                      <CardDescription>
                        {segment.pricing.guidance.sessions} sessions •{" "}
                        {segment.pricing.guidance.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Phases 1-2 Coverage
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Basic Assessment Tools
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />2 Core
                          Workbooks
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Certified Mentor (L1)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Email Support
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`${segment.href}?tier=guidance`}>
                          Get Started
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Planning Tier - Popular */}
                  <Card className="border-2 border-purple-500 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white">
                        Most Popular
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4">
                      <Badge
                        variant="outline"
                        className="w-fit mx-auto mb-2 border-purple-300 text-purple-700"
                      >
                        Advanced
                      </Badge>
                      <CardTitle className="text-xl">Planning</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-purple-600">
                          {formatPrice(segment.pricing.planning.price)}
                        </span>
                      </div>
                      <CardDescription>
                        {segment.pricing.planning.sessions} sessions •{" "}
                        {segment.pricing.planning.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Phases 1-5 Coverage
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Full Assessment Suite
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          All Career Workbooks
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Expert Mentor (L2)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Priority Support
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        asChild
                      >
                        <Link href={`${segment.href}?tier=planning`}>
                          Get Started
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Mentorship Tier */}
                  <Card className="border-2 border-gold-400">
                    <CardHeader className="text-center pb-4">
                      <Badge className="w-fit mx-auto mb-2 bg-gold-400 text-forest-900 hover:bg-gold-400">
                        Premium
                      </Badge>
                      <CardTitle className="text-xl">Mentorship</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-forest-900">
                          {formatPrice(segment.pricing.mentorship.price)}
                        </span>
                      </div>
                      <CardDescription>
                        {segment.pricing.mentorship.sessions} sessions •{" "}
                        {segment.pricing.mentorship.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          All 6 Phases
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Full Suite + AI Insights
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          All + Premium Content
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Master Mentor (L3)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          24/7 Priority Support
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-forest-800 hover:bg-forest-900 text-cream-100"
                        asChild
                      >
                        <Link href={`${segment.href}?tier=mentorship`}>
                          Get Started
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Feature Comparison Table */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-forest-900 mb-6 text-center">
              Detailed Feature Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-forest-200">
                    <th className="py-3 px-4 text-left font-semibold text-forest-900">
                      Feature
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-forest-900">
                      Guidance
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-purple-600">
                      Planning
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-forest-900">
                      Mentorship
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tierComparison.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-cream-50"}
                    >
                      <td className="py-3 px-4 text-sm font-medium">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-muted-foreground">
                        {row.guidance}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-purple-600 font-medium">
                        {row.planning}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-muted-foreground">
                        {row.mentorship}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not Sure Which Program Is Right for You?
            </h2>
            <p className="text-purple-100 text-lg mb-8">
              Book a free 30-minute consultation with our career advisors.
              We&apos;ll help you identify your needs and recommend the perfect
              program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-cream-100"
                asChild
              >
                <Link href="/contact">
                  Schedule Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/auth/register">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
