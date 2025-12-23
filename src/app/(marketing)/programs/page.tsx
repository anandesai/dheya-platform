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
    color: "sage",
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
      {/* Hero Section - Cream Background */}
      <section className="section-cream section-padding">
        <div className="container-uplift">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-micro text-purple-600 mb-4">
              Personalized Career Programs
            </p>
            <h1 className="text-display text-charcoal-900 mb-6">
              FIND YOUR PERFECT<br />
              <span className="text-purple-500">CAREER PROGRAM</span>
            </h1>
            <p className="text-body-lg text-charcoal-600 max-w-2xl mx-auto mb-10">
              Choose from our specialized programs designed for different career
              stages. Each program combines assessments, mentoring, and
              actionable strategies for your unique journey.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="font-body text-charcoal-700">100,000+ Professionals Mentored</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="font-body text-charcoal-700">91% Achieve Clarity</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="font-body text-charcoal-700">18+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Cards - White Background */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="text-center mb-12">
            <h2 className="heading-section text-charcoal-900 mb-4">
              Programs Tailored for Every Stage
            </h2>
            <p className="text-body text-charcoal-600 max-w-2xl mx-auto">
              Select a program that matches your current career stage and goals.
              Each is designed with specific assessments and strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {segments.map((segment) => {
              const Icon = segment.icon
              return (
                <Card
                  key={segment.id}
                  variant="light"
                  hover="lift"
                  className="group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-xl ${
                          segment.color === "purple"
                            ? "bg-purple-100"
                            : segment.color === "sage"
                              ? "bg-sage-100"
                              : segment.color === "gold"
                                ? "bg-amber-100"
                                : "bg-rose-100"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            segment.color === "purple"
                              ? "text-purple-600"
                              : segment.color === "sage"
                                ? "text-sage-600"
                                : segment.color === "gold"
                                  ? "text-amber-600"
                                  : "text-rose-600"
                          }`}
                        />
                      </div>
                      <Badge variant="outline" className="text-micro border-charcoal-300">
                        {segment.subtitle}
                      </Badge>
                    </div>
                    <CardTitle className="heading-card text-charcoal-900 mt-4">
                      {segment.name}
                    </CardTitle>
                    <CardDescription className="font-body text-sm leading-relaxed">
                      {segment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-micro text-charcoal-500 mb-3">
                        Key Focus Areas
                      </p>
                      <ul className="space-y-2">
                        {segment.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 font-body text-sm"
                          >
                            <Check className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <span className="text-charcoal-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-cream-200">
                      <p className="text-micro text-charcoal-500 mb-1">
                        Starting from
                      </p>
                      <p className="font-display text-2xl font-bold text-charcoal-900">
                        {formatPrice(segment.pricing.guidance.price)}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="uplift"
                      className="w-full"
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

      {/* 6-Phase Journey - Charcoal Section */}
      <section className="section-charcoal section-padding">
        <div className="container-uplift">
          <div className="text-center mb-12">
            <p className="text-micro text-purple-400 mb-4">
              The 7D Methodology
            </p>
            <h2 className="text-display-sm text-cream-50 mb-4">
              YOUR 6-PHASE JOURNEY<br />TO CAREER CLARITY
            </h2>
            <p className="font-body text-cream-300 max-w-2xl mx-auto">
              Every program follows our proven methodology, with the number of
              phases covered depending on your chosen tier.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {phases.map((phase) => (
              <div key={phase.number} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-500 flex items-center justify-center mb-4">
                  <span className="font-display text-2xl font-bold text-white">{phase.number}</span>
                </div>
                <h3 className="font-display font-semibold text-cream-50 mb-2">{phase.name}</h3>
                <p className="font-body text-xs text-cream-400">{phase.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 bg-charcoal-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-cream-100 text-charcoal-800 font-display">Guidance</Badge>
                <span className="font-body text-cream-200">Phases 1-2</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500 text-white font-display">Planning</Badge>
                <span className="font-body text-cream-200">Phases 1-5</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gold-400 text-charcoal-900 font-display">Mentorship</Badge>
                <span className="font-body text-cream-200">All 6 Phases</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison - Sage Section */}
      <section className="section-sage section-padding">
        <div className="container-uplift">
          <div className="text-center mb-12">
            <h2 className="heading-section text-charcoal-900 mb-4">
              Compare Package Tiers
            </h2>
            <p className="text-body text-charcoal-600 max-w-2xl mx-auto">
              All programs offer three tiers to match your commitment level and
              goals. Choose the depth of support that&apos;s right for you.
            </p>
          </div>

          <Tabs defaultValue="mid-career" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 bg-sage-200">
              <TabsTrigger value="early-career" className="font-display text-sm">Early Career</TabsTrigger>
              <TabsTrigger value="mid-career" className="font-display text-sm">Mid-Career</TabsTrigger>
              <TabsTrigger value="senior" className="font-display text-sm">Senior</TabsTrigger>
              <TabsTrigger value="returning-women" className="font-display text-sm">Returning Women</TabsTrigger>
            </TabsList>

            {segments.map((segment) => (
              <TabsContent key={segment.id} value={segment.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Guidance Tier */}
                  <Card variant="light" className="border-2">
                    <CardHeader className="text-center pb-4">
                      <Badge variant="outline" className="w-fit mx-auto mb-2 text-micro">
                        Starter
                      </Badge>
                      <CardTitle className="heading-card">Guidance</CardTitle>
                      <div className="mt-4">
                        <span className="font-display text-3xl font-bold text-charcoal-900">
                          {formatPrice(segment.pricing.guidance.price)}
                        </span>
                      </div>
                      <CardDescription className="font-body mt-2">
                        {segment.pricing.guidance.sessions} sessions •{" "}
                        {segment.pricing.guidance.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 font-body text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Phases 1-2 Coverage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Basic Assessment Tools</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">2 Core Workbooks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Certified Mentor (L1)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Email Support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="upliftOutline" className="w-full" asChild>
                        <Link href={`${segment.href}?tier=guidance`}>
                          Get Started
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Planning Tier - Popular */}
                  <Card variant="light" className="border-2 border-purple-500 relative shadow-lg">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white font-display">
                        Most Popular
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4">
                      <Badge
                        variant="outline"
                        className="w-fit mx-auto mb-2 text-micro border-purple-300 text-purple-700"
                      >
                        Advanced
                      </Badge>
                      <CardTitle className="heading-card">Planning</CardTitle>
                      <div className="mt-4">
                        <span className="font-display text-3xl font-bold text-purple-600">
                          {formatPrice(segment.pricing.planning.price)}
                        </span>
                      </div>
                      <CardDescription className="font-body mt-2">
                        {segment.pricing.planning.sessions} sessions •{" "}
                        {segment.pricing.planning.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 font-body text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Phases 1-5 Coverage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Full Assessment Suite</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">All Career Workbooks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Expert Mentor (L2)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Priority Support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="uplift" className="w-full" asChild>
                        <Link href={`${segment.href}?tier=planning`}>
                          Get Started
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Mentorship Tier */}
                  <Card variant="light" className="border-2 border-gold-400">
                    <CardHeader className="text-center pb-4">
                      <Badge className="w-fit mx-auto mb-2 bg-gold-400 text-charcoal-900 font-display hover:bg-gold-400">
                        Premium
                      </Badge>
                      <CardTitle className="heading-card">Mentorship</CardTitle>
                      <div className="mt-4">
                        <span className="font-display text-3xl font-bold text-charcoal-900">
                          {formatPrice(segment.pricing.mentorship.price)}
                        </span>
                      </div>
                      <CardDescription className="font-body mt-2">
                        {segment.pricing.mentorship.sessions} sessions •{" "}
                        {segment.pricing.mentorship.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 font-body text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">All 6 Phases</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Full Suite + AI Insights</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">All + Premium Content</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">Master Mentor (L3)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-500" />
                          <span className="text-charcoal-700">24/7 Priority Support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="dark" className="w-full" asChild>
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
            <h3 className="heading-card text-charcoal-900 mb-6 text-center">
              Detailed Feature Comparison
            </h3>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-cream-200">
                    <th className="py-4 px-6 text-left font-display font-semibold text-charcoal-900">
                      Feature
                    </th>
                    <th className="py-4 px-6 text-center font-display font-semibold text-charcoal-700">
                      Guidance
                    </th>
                    <th className="py-4 px-6 text-center font-display font-semibold text-purple-600">
                      Planning
                    </th>
                    <th className="py-4 px-6 text-center font-display font-semibold text-charcoal-700">
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
                      <td className="py-4 px-6 font-body text-sm font-medium text-charcoal-800">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 font-body text-sm text-center text-charcoal-600">
                        {row.guidance}
                      </td>
                      <td className="py-4 px-6 font-body text-sm text-center text-purple-600 font-medium">
                        {row.planning}
                      </td>
                      <td className="py-4 px-6 font-body text-sm text-center text-charcoal-600">
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

      {/* CTA Section - Purple */}
      <section className="section-purple section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-display-sm text-white mb-6">
              NOT SURE WHICH<br />PROGRAM IS RIGHT?
            </h2>
            <p className="font-body text-lg text-purple-100 mb-10">
              Book a free 30-minute consultation with our career advisors.
              We&apos;ll help you identify your needs and recommend the perfect
              program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-white text-purple-700 hover:bg-cream-100 font-display font-semibold"
                asChild
              >
                <Link href="/contact">
                  Schedule Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-display font-semibold"
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
