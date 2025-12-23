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
  Check,
  ArrowRight,
  Sparkles,
  Target,
  Compass,
  Lightbulb,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Award,
  Star,
  ChevronRight,
  BookOpen,
  BrainCircuit,
  Briefcase,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const assessmentTools = [
  {
    name: "Identity Discovery Assessment",
    description:
      "Uncover your core values, strengths, and unique professional identity through guided self-reflection.",
    icon: BrainCircuit,
    phase: 1,
  },
  {
    name: "Interest Inventory (Holland Codes)",
    description:
      "Identify your career interests and match them with suitable career paths and industries.",
    icon: Compass,
    phase: 1,
  },
  {
    name: "Possibility Matrix",
    description:
      "Map your interests against market opportunities to find your ideal career sweet spot.",
    icon: Target,
    phase: 2,
  },
  {
    name: "Industry Trend Analysis",
    description:
      "Understand which industries are growing and how your skills align with future opportunities.",
    icon: TrendingUp,
    phase: 3,
  },
  {
    name: "Personal Brand Builder",
    description:
      "Create a compelling professional narrative that sets you apart in the job market.",
    icon: Lightbulb,
    phase: 4,
  },
  {
    name: "Career Action Planner",
    description:
      "Develop a concrete, timeline-based plan for achieving your career goals.",
    icon: Calendar,
    phase: 5,
  },
]

const phases = [
  {
    number: 1,
    name: "Diagnosis",
    title: "Know Yourself",
    description:
      "Deep dive into your personality, values, strengths, and what truly drives you. This foundation shapes everything.",
    tools: ["Identity Discovery", "Personality Assessment", "Values Clarification"],
    duration: "2 weeks",
    tier: "guidance",
  },
  {
    number: 2,
    name: "Clarity",
    title: "Find Your Direction",
    description:
      "Connect your self-understanding to potential career paths. Explore options you might not have considered.",
    tools: ["Interest Inventory", "Skills Mapping", "Career Matching"],
    duration: "2 weeks",
    tier: "guidance",
  },
  {
    number: 3,
    name: "Exploration",
    title: "Research & Discover",
    description:
      "Investigate industries, roles, and companies. Understand market realities and growth opportunities.",
    tools: ["Industry Analysis", "Role Research", "Informational Interviews"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 4,
    name: "Strategy",
    title: "Plan Your Path",
    description:
      "Create your personalized career roadmap with clear milestones, skill gaps to fill, and action steps.",
    tools: ["Personal Branding", "Resume Building", "Career Roadmap"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 5,
    name: "Action",
    title: "Execute with Confidence",
    description:
      "Put your plan into motion with expert guidance. Practice interviews, build networks, and apply strategically.",
    tools: ["Interview Prep", "Network Building", "Job Search Strategy"],
    duration: "4 weeks",
    tier: "planning",
  },
  {
    number: 6,
    name: "Mastery",
    title: "Ongoing Growth",
    description:
      "Continue your development with regular check-ins, course corrections, and celebration of wins.",
    tools: ["Progress Reviews", "Skill Development", "Mentor Sessions"],
    duration: "Ongoing",
    tier: "mentorship",
  },
]

const packages = [
  {
    tier: "guidance",
    name: "Guidance",
    tagline: "Start with clarity",
    price: 25000,
    originalPrice: 32000,
    sessions: 4,
    duration: "6 weeks",
    mentorLevel: "Certified Mentor (L1)",
    phases: "1-2",
    features: [
      "4 one-on-one mentor sessions",
      "Identity Discovery Assessment",
      "Interest Inventory Analysis",
      "2 Core Career Workbooks",
      "Email support",
      "Monthly progress check-ins",
      "Basic alumni network access",
    ],
    notIncluded: [
      "Industry deep-dives",
      "Personal branding support",
      "Interview preparation",
      "Priority support",
    ],
  },
  {
    tier: "planning",
    name: "Planning",
    tagline: "Most popular choice",
    price: 45000,
    originalPrice: 55000,
    sessions: 8,
    duration: "12 weeks",
    mentorLevel: "Expert Mentor (L2)",
    phases: "1-5",
    popular: true,
    features: [
      "8 one-on-one mentor sessions",
      "Full Assessment Suite",
      "All Career Workbooks",
      "Industry Trend Analysis",
      "Personal Brand Development",
      "Resume & LinkedIn Optimization",
      "Interview Preparation",
      "Bi-weekly progress reports",
      "Priority email support",
      "Full alumni network access",
    ],
    notIncluded: ["Ongoing mentorship", "24/7 support"],
  },
  {
    tier: "mentorship",
    name: "Mentorship",
    tagline: "Complete transformation",
    price: 75000,
    originalPrice: 90000,
    sessions: 16,
    duration: "6 months",
    mentorLevel: "Master Mentor (L3)",
    phases: "1-6",
    features: [
      "16 one-on-one mentor sessions",
      "Full Assessment Suite + AI Insights",
      "All Workbooks + Premium Content",
      "Comprehensive Industry Research",
      "Advanced Personal Branding",
      "Multiple Interview Rehearsals",
      "Job Offer Negotiation Support",
      "Weekly progress sessions",
      "24/7 priority support",
      "VIP alumni network access",
      "1-year post-program check-ins",
    ],
    notIncluded: [],
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Product Manager at Microsoft",
    image: "/testimonials/priya.jpg",
    quote:
      "I was confused between tech and consulting after my MBA. The Develop Advantage program helped me discover my true calling in product management. Within 6 months, I landed my dream role!",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    role: "Data Analyst at Amazon",
    image: "/testimonials/arjun.jpg",
    quote:
      "As a fresh graduate, I had no idea what career path to choose. The assessments and mentor guidance gave me clarity I never had before. The personal branding module was a game-changer.",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "UX Designer at Flipkart",
    image: "/testimonials/sneha.jpg",
    quote:
      "The Possibility Matrix helped me realize that my art background could translate into a UX career. My mentor guided me through the skill-building process, and now I&apos;m living my dream!",
    rating: 5,
  },
]

const faqs = [
  {
    question: "Who is this program designed for?",
    answer:
      "The Develop Advantage program is designed for early career professionals aged 22-30, including recent graduates, those in their first 1-5 years of work, and young professionals seeking career direction or considering a change early in their journey.",
  },
  {
    question: "How are mentors matched with participants?",
    answer:
      "We match you with mentors based on your career interests, industry preferences, and personality type. Our matching algorithm considers the mentor's expertise and your specific goals to ensure the best fit for your journey.",
  },
  {
    question: "Can I switch between package tiers after starting?",
    answer:
      "Yes! You can upgrade your package at any time by paying the difference. Many participants start with Guidance and upgrade to Planning once they see the value of the process.",
  },
  {
    question: "What if I'm not satisfied with the program?",
    answer:
      "We offer a satisfaction guarantee. If you're not happy after your first two sessions, we'll refund your full payment. We're confident in our methodology because we've seen it transform thousands of careers.",
  },
  {
    question: "How long does it typically take to see results?",
    answer:
      "Most participants report feeling significantly more clarity within the first 3-4 weeks. Tangible career outcomes (job offers, promotions, successful pivots) typically happen within 3-6 months depending on your starting point and commitment.",
  },
  {
    question: "Is this program suitable if I already have a job?",
    answer:
      "Absolutely! Many participants are employed but feel unfulfilled or unsure about their path. The program helps you gain clarity on whether to grow in your current role, pivot internally, or make an external move.",
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function EarlyCareerPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-cream section-padding">
        <div className="container-uplift">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="font-display bg-purple-100 text-purple-700 hover:bg-purple-100">
                  <Rocket className="h-3 w-3 mr-1" />
                  EARLY CAREER (22-30)
                </Badge>
              </div>
              <h1 className="text-display text-charcoal-900">
                DEVELOP{" "}
                <span className="text-purple-600">ADVANTAGE</span>
              </h1>
              <p className="font-body text-charcoal-600 text-lg md:text-xl max-w-xl">
                Launch your career with clarity and confidence. Discover your
                unique strengths, explore endless possibilities, and create a
                roadmap for lasting success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="uplift"
                  asChild
                >
                  <Link href="#packages">
                    View Packages
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="upliftOutline" asChild>
                  <Link href="/contact">Book Free Consultation</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 pt-4 text-micro text-charcoal-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>6 weeks to 6 months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>1-on-1 Mentoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>91% Success Rate</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-purple-200 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-4 bg-purple-300 rounded-full opacity-20" />
                <div className="absolute inset-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Rocket className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-charcoal-900">
                      25,000+
                    </p>
                    <p className="text-micro text-charcoal-500">
                      Early careers launched
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-charcoal-100 text-charcoal-700">
              IS THIS YOU?
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              This Program Is Perfect If You&apos;re...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Recent Graduate",
                description:
                  "Just finished college and unsure which career path to pursue among many options",
                icon: BookOpen,
              },
              {
                title: "Early in Career",
                description:
                  "1-5 years into your career but questioning if this is the right path for you",
                icon: Briefcase,
              },
              {
                title: "Seeking Direction",
                description:
                  "Know you have potential but struggling to find where you truly belong",
                icon: Compass,
              },
              {
                title: "Ready for Growth",
                description:
                  "Motivated to build a successful career but need a strategic roadmap",
                icon: TrendingUp,
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} variant="light" hover="lift" className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="heading-card">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-charcoal-600 text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Assessment Tools Section */}
      <section className="section-sage section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-purple-100 text-purple-700">
              <Sparkles className="h-3 w-3 mr-1" />
              PROPRIETARY TOOLS
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Assessment Tools Designed for Early Career Success
            </h2>
            <p className="font-body text-charcoal-600">
              Our scientifically-validated assessments have helped over 25,000
              young professionals find their ideal career paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {assessmentTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <Card
                  key={index}
                  variant="light"
                  hover="lift"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                        <Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <Badge variant="outline" className="font-display text-xs">
                        PHASE {tool.phase}
                      </Badge>
                    </div>
                    <CardTitle className="heading-card mt-3">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-charcoal-600 text-sm">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6-Phase Journey Section */}
      <section className="section-charcoal section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-purple-600 text-white hover:bg-purple-600">
              THE JOURNEY
            </Badge>
            <h2 className="heading-section text-white mb-4">
              Your 6-Phase Transformation
            </h2>
            <p className="font-body text-charcoal-200">
              Each phase builds on the previous one, creating a comprehensive
              foundation for career success.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className={`flex gap-4 p-6 rounded-lg ${
                  phase.tier === "guidance"
                    ? "bg-charcoal-700/50"
                    : phase.tier === "planning"
                      ? "bg-purple-600/20 border border-purple-500/30"
                      : "bg-gold-400/10 border border-gold-400/30"
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg text-white">
                    {phase.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="heading-card text-white">{phase.title}</h3>
                    <Badge
                      className={`font-display ${
                        phase.tier === "guidance"
                          ? "bg-cream-100 text-charcoal-800"
                          : phase.tier === "planning"
                            ? "bg-purple-500 text-white"
                            : "bg-gold-400 text-charcoal-900"
                      }`}
                    >
                      {phase.tier === "guidance"
                        ? "GUIDANCE+"
                        : phase.tier === "planning"
                          ? "PLANNING+"
                          : "MENTORSHIP"}
                    </Badge>
                    <span className="text-micro text-charcoal-300">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="font-body text-charcoal-200 text-sm mb-3">
                    {phase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex}
                        className="text-micro bg-charcoal-900/50 px-2 py-1 rounded text-charcoal-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                {index < phases.length - 1 && (
                  <ChevronRight className="hidden md:block h-6 w-6 text-charcoal-400 self-center" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="section-sage section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-purple-100 text-purple-700">
              CHOOSE YOUR PATH
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Investment in Your Future
            </h2>
            <p className="font-body text-charcoal-600">
              Select the level of support that matches your goals and
              commitment. All packages come with our satisfaction guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.tier}
                variant="light"
                hover="lift"
                className={`relative ${
                  pkg.popular
                    ? "border-2 border-purple-500 shadow-lg"
                    : "border-2"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="font-display bg-purple-600 text-white">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <Badge
                    variant="outline"
                    className={`font-display w-fit mx-auto mb-2 ${
                      pkg.popular
                        ? "border-purple-300 text-purple-700"
                        : ""
                    }`}
                  >
                    {pkg.tagline}
                  </Badge>
                  <CardTitle className="heading-card">{pkg.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-micro text-charcoal-500 line-through">
                      {formatPrice(pkg.originalPrice)}
                    </span>
                    <span
                      className={`text-4xl font-bold block ${
                        pkg.popular ? "text-purple-600" : "text-charcoal-900"
                      }`}
                    >
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                  <CardDescription className="font-body mt-2">
                    {pkg.sessions} sessions • {pkg.duration}
                    <br />
                    Phases {pkg.phases} • {pkg.mentorLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-micro font-semibold text-charcoal-500 uppercase tracking-wider mb-2">
                      What&apos;s Included
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 font-body text-charcoal-600 text-sm"
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {pkg.notIncluded.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-micro text-charcoal-500 mb-2">
                        Not included:
                      </p>
                      <ul className="space-y-1">
                        {pkg.notIncluded.map((item, index) => (
                          <li
                            key={index}
                            className="text-micro text-charcoal-500 line-through"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={
                      pkg.popular
                        ? "uplift"
                        : pkg.tier === "mentorship"
                          ? "dark"
                          : "upliftOutline"
                    }
                    asChild
                  >
                    <Link href={`/auth/register?program=early-career&tier=${pkg.tier}`}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center font-body text-charcoal-600 text-sm mt-8">
            All prices are inclusive of GST. EMI options available.
            <br />
            100% satisfaction guarantee or full refund after first 2 sessions.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-purple section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-section text-white mb-4">
              Success Stories from Early Career Professionals
            </h2>
            <p className="font-body text-purple-100">
              Join thousands who&apos;ve transformed their careers with Develop
              Advantage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                variant="dark"
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-sm text-purple-50 italic mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{testimonial.name}</p>
                      <p className="text-micro text-purple-200">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="font-display mb-4 bg-cream-200 text-charcoal-800">FAQ</Badge>
              <h2 className="heading-section text-charcoal-900 mb-4">
                Common Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-body text-charcoal-900 hover:text-purple-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-charcoal-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-charcoal section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-section text-white mb-4">
              Ready to Launch Your Career?
            </h2>
            <p className="font-body text-charcoal-200 text-lg mb-8">
              Take the first step towards a fulfilling career. Book a free
              consultation or start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="uplift"
                asChild
              >
                <Link href="/auth/register?program=early-career">
                  Start Your Journey
                  <Rocket className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-white text-charcoal-900 hover:bg-white/90"
                asChild
              >
                <Link href="/contact">Talk to an Advisor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
