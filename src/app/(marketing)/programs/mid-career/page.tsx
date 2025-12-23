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
  Target,
  Check,
  ArrowRight,
  Sparkles,
  Heart,
  Brain,
  Scale,
  TrendingUp,
  Users,
  Clock,
  Award,
  Star,
  ChevronRight,
  Flame,
  Battery,
  AlertTriangle,
  Compass,
  BarChart3,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const bbdSymptoms = [
  {
    name: "Bored",
    icon: Battery,
    description:
      "Feeling unchallenged, going through the motions, no excitement about work",
    signs: [
      "Dreading Monday mornings",
      "Watching the clock constantly",
      "Lost passion for your work",
      "Feeling like you're on autopilot",
    ],
  },
  {
    name: "Burned Out",
    icon: Flame,
    description:
      "Exhausted, overwhelmed, struggling to maintain energy and motivation",
    signs: [
      "Constant fatigue despite rest",
      "Difficulty concentrating",
      "Irritability and cynicism",
      "Physical symptoms of stress",
    ],
  },
  {
    name: "Dissatisfied",
    icon: AlertTriangle,
    description:
      "Unfulfilled, questioning your career choices, seeking more meaning",
    signs: [
      "Questioning your career choices",
      "Feeling undervalued",
      "Seeking more meaningful work",
      "Comparing yourself to peers",
    ],
  },
]

const assessmentTools = [
  {
    name: "BBD Syndrome Assessment",
    description:
      "Our proprietary 25-question assessment identifies your specific BBD profile and severity level.",
    icon: Brain,
    phase: 1,
  },
  {
    name: "Work Values Alignment",
    description:
      "Discover your core work values and measure how well your current role aligns with them.",
    icon: Heart,
    phase: 1,
  },
  {
    name: "Knowledge-Passion Matrix",
    description:
      "Plot your skills on a 2x2 matrix to identify where to focus your career energy.",
    icon: BarChart3,
    phase: 2,
  },
  {
    name: "Life Stage Integration",
    description:
      "Map your career against your life priorities to create sustainable success.",
    icon: Scale,
    phase: 2,
  },
  {
    name: "Career Redesign Framework",
    description:
      "Systematically evaluate internal growth, pivot, or exit strategies.",
    icon: Compass,
    phase: 3,
  },
  {
    name: "CLIQI Diagnostic",
    description:
      "Measure your Career Life Intelligence Quotient across 5 key dimensions.",
    icon: TrendingUp,
    phase: 4,
  },
]

const phases = [
  {
    number: 1,
    name: "Diagnosis",
    title: "Understand Your BBD",
    description:
      "Identify your specific BBD syndrome patterns and root causes through comprehensive assessment.",
    tools: ["BBD Assessment", "Values Alignment", "Life History Review"],
    duration: "2 weeks",
    tier: "guidance",
  },
  {
    number: 2,
    name: "Clarity",
    title: "Rediscover Your Core",
    description:
      "Reconnect with your authentic values, passions, and what truly drives satisfaction in work.",
    tools: ["Knowledge-Passion Matrix", "Life Stage Mapping", "Priority Calibration"],
    duration: "3 weeks",
    tier: "guidance",
  },
  {
    number: 3,
    name: "Exploration",
    title: "Map Your Options",
    description:
      "Explore possibilities: grow in place, pivot internally, or make an external move.",
    tools: ["Career Redesign Framework", "Industry Analysis", "Opportunity Mapping"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 4,
    name: "Strategy",
    title: "Design Your Destination",
    description:
      "Create a detailed roadmap for your career transformation with clear milestones.",
    tools: ["CLIQI Diagnostic", "Strategic Career Plan", "Skill Gap Analysis"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 5,
    name: "Action",
    title: "Execute Your Plan",
    description:
      "Implement your strategy with expert guidance, stakeholder management, and progress tracking.",
    tools: ["Execution Support", "Network Building", "Transition Management"],
    duration: "4 weeks",
    tier: "planning",
  },
  {
    number: 6,
    name: "Mastery",
    title: "Sustain Your Success",
    description:
      "Maintain momentum with ongoing mentorship, course corrections, and continuous growth.",
    tools: ["Progress Reviews", "Executive Coaching", "Career Optimization"],
    duration: "Ongoing",
    tier: "mentorship",
  },
]

const packages = [
  {
    tier: "guidance",
    name: "Guidance",
    tagline: "Diagnose & clarify",
    price: 35000,
    originalPrice: 45000,
    sessions: 6,
    duration: "8 weeks",
    mentorLevel: "Certified Mentor (L1)",
    phases: "1-2",
    features: [
      "6 one-on-one mentor sessions",
      "BBD Syndrome Assessment",
      "Work Values Alignment Tool",
      "Knowledge-Passion Matrix",
      "2 Core Career Workbooks",
      "Email support",
      "Bi-weekly progress check-ins",
      "Basic alumni network access",
    ],
    notIncluded: [
      "Career redesign strategy",
      "Executive networking",
      "Transition support",
      "Ongoing mentorship",
    ],
  },
  {
    tier: "planning",
    name: "Planning",
    tagline: "Complete transformation",
    price: 65000,
    originalPrice: 80000,
    sessions: 12,
    duration: "16 weeks",
    mentorLevel: "Expert Mentor (L2)",
    phases: "1-5",
    popular: true,
    features: [
      "12 one-on-one mentor sessions",
      "Full Assessment Suite",
      "All Career Workbooks",
      "Career Redesign Framework",
      "CLIQI Diagnostic (Pre & Post)",
      "Executive Resume & LinkedIn",
      "Stakeholder Management Plan",
      "Strategic Network Building",
      "Weekly progress reports",
      "Priority email support",
      "Full alumni network access",
    ],
    notIncluded: ["Extended executive coaching"],
  },
  {
    tier: "mentorship",
    name: "Mentorship",
    tagline: "Ultimate career partner",
    price: 110000,
    originalPrice: 135000,
    sessions: 24,
    duration: "9 months",
    mentorLevel: "Master Mentor (L3)",
    phases: "1-6",
    features: [
      "24 one-on-one mentor sessions",
      "Full Assessment Suite + AI Insights",
      "All Workbooks + Premium Content",
      "Executive Coaching Sessions",
      "Board-Level Networking Support",
      "Salary Negotiation Coaching",
      "Leadership Development Track",
      "Bi-weekly executive sessions",
      "24/7 priority support",
      "VIP alumni network access",
      "18-month post-program support",
      "Spouse/partner alignment session",
    ],
    notIncluded: [],
  },
]

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "VP Engineering at Swiggy",
    previousRole: "Was: Senior Manager at Infosys",
    image: "/testimonials/rajesh.jpg",
    quote:
      "I was burned out after 15 years at Infosys. The BBD assessment revealed patterns I couldn't see myself. Within 9 months, I made the move to Swiggy at VP level - a role I didn't think was possible.",
    rating: 5,
  },
  {
    name: "Meera Nair",
    role: "Chief People Officer at OYO",
    previousRole: "Was: HR Director feeling stuck",
    image: "/testimonials/meera.jpg",
    quote:
      "The Knowledge-Passion Matrix was a revelation. I realized I was skilled but not passionate about my specialization. Dheya helped me pivot from compensation to people strategy, and the rest is history.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Entrepreneur (Founded EdTech startup)",
    previousRole: "Was: Senior Consultant at Deloitte",
    image: "/testimonials/vikram.jpg",
    quote:
      "I thought entrepreneurship was a distant dream. The career redesign framework helped me see it was actually the logical next step. My mentor guided me through the transition with precision.",
    rating: 5,
  },
]

const faqs = [
  {
    question: "What exactly is the BBD Syndrome?",
    answer:
      "BBD stands for Bored, Burned out, and Dissatisfied - the three most common career pain points experienced by mid-career professionals. Our proprietary assessment helps identify which combination affects you most and provides targeted strategies for each.",
  },
  {
    question: "I'm a senior executive. Is this program still relevant?",
    answer:
      "Absolutely. Our Planning and Mentorship tiers are specifically designed for senior professionals. Our Master Mentors (L3) are former C-suite executives and board members who understand the unique challenges at your level.",
  },
  {
    question: "How is this different from executive coaching?",
    answer:
      "While executive coaching focuses on leadership skills and performance, Destination Mastery addresses the fundamental question of career direction. We combine assessment tools, strategic planning, and mentorship to help you redesign your career path, not just improve in your current role.",
  },
  {
    question: "Can I do this while still employed?",
    answer:
      "Yes, most participants are employed throughout the program. Sessions are scheduled around your work commitments, and we specifically help you navigate the transition while managing stakeholder expectations.",
  },
  {
    question: "What if I decide I want to stay in my current role?",
    answer:
      "That's a valid outcome! Many participants discover that with the right adjustments, their current role can be fulfilling. We help you implement changes - whether that's redesigning your role, negotiating new responsibilities, or finding renewed purpose in your existing work.",
  },
  {
    question: "How confidential is this process?",
    answer:
      "Completely confidential. We never share participant information, and many of our clients are exploring options their current employers don't know about. Your privacy is paramount throughout the process.",
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function MidCareerPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-forest-50 via-cream-50 to-forest-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(26,71,42,0.08),transparent_50%)]" />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="bg-forest-100 text-forest-700 hover:bg-forest-100">
                  <Target className="h-3 w-3 mr-1" />
                  Mid-Career (30-45)
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-forest-900">
                Destination{" "}
                <span className="text-forest-600">Mastery</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Break through career plateaus and rediscover your passion.
                Overcome the Bored-Burned-Dissatisfied syndrome and design your
                ideal career destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-forest-700 hover:bg-forest-800 text-cream-100"
                  asChild
                >
                  <Link href="#packages">
                    View Packages
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Book Free Consultation</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-forest-600" />
                  <span>8 weeks to 9 months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-forest-600" />
                  <span>Expert 1-on-1 Mentoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-forest-600" />
                  <span>91% Career Clarity Rate</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-forest-200 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-4 bg-forest-300 rounded-full opacity-20" />
                <div className="absolute inset-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Target className="h-16 w-16 text-forest-700 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-forest-900">
                      50,000+
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Careers transformed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BBD Syndrome Section */}
      <section className="py-16 md:py-24 bg-forest-800 text-cream-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="mb-4 bg-cream-100 text-forest-800 hover:bg-cream-100">
              <AlertTriangle className="h-3 w-3 mr-1" />
              The BBD Syndrome
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Are You Bored, Burned Out, or Dissatisfied?
            </h2>
            <p className="text-cream-200">
              These three career pain points affect 73% of mid-career
              professionals. Identify your pattern to find the right solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bbdSymptoms.map((symptom, index) => {
              const Icon = symptom.icon
              return (
                <Card
                  key={index}
                  className="bg-forest-700/50 border-forest-600 text-cream-100"
                >
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-cream-100 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-forest-800" />
                    </div>
                    <CardTitle className="text-xl text-cream-100">
                      {symptom.name}
                    </CardTitle>
                    <CardDescription className="text-cream-300">
                      {symptom.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-cream-400 uppercase tracking-wider mb-2">
                      Common Signs
                    </p>
                    <ul className="space-y-2">
                      {symptom.signs.map((sign, signIndex) => (
                        <li
                          key={signIndex}
                          className="flex items-start gap-2 text-sm text-cream-200"
                        >
                          <Check className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-cream-200 mb-4">
              Not sure which one applies to you? Take our free BBD quiz.
            </p>
            <Button
              variant="outline"
              className="border-cream-200 text-cream-100 hover:bg-cream-100/10"
              asChild
            >
              <Link href="/auth/register?quiz=bbd">
                Take Free BBD Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Assessment Tools Section */}
      <section className="py-16 md:py-24 bg-cream-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="mb-4 bg-forest-100 text-forest-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Proprietary Tools
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              Assessment Tools Built for Mid-Career Professionals
            </h2>
            <p className="text-muted-foreground">
              Our tools are specifically designed to address the unique
              challenges of mid-career transitions, validated across 50,000+
              professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {assessmentTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-forest-100 group-hover:bg-forest-200 transition-colors">
                        <Icon className="h-5 w-5 text-forest-700" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Phase {tool.phase}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
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
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700">
              The Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              Your 6-Phase Career Transformation
            </h2>
            <p className="text-muted-foreground">
              A systematic approach to redesigning your career, with each phase
              building on the insights from the previous one.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className={`flex gap-4 p-6 rounded-lg border-2 ${
                  phase.tier === "guidance"
                    ? "bg-cream-50 border-cream-200"
                    : phase.tier === "planning"
                      ? "bg-forest-50 border-forest-200"
                      : "bg-purple-50 border-purple-200"
                }`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      phase.tier === "guidance"
                        ? "bg-cream-200 text-forest-800"
                        : phase.tier === "planning"
                          ? "bg-forest-700 text-cream-100"
                          : "bg-purple-600 text-white"
                    }`}
                  >
                    {phase.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-forest-900">
                      {phase.title}
                    </h3>
                    <Badge
                      className={
                        phase.tier === "guidance"
                          ? "bg-cream-200 text-forest-800"
                          : phase.tier === "planning"
                            ? "bg-forest-700 text-cream-100"
                            : "bg-purple-600 text-white"
                      }
                    >
                      {phase.tier === "guidance"
                        ? "Guidance+"
                        : phase.tier === "planning"
                          ? "Planning+"
                          : "Mentorship"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {phase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex}
                        className="text-xs bg-white px-2 py-1 rounded border"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                {index < phases.length - 1 && (
                  <ChevronRight className="hidden md:block h-6 w-6 text-muted-foreground self-center" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 md:py-24 bg-cream-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="mb-4 bg-forest-100 text-forest-700">
              Choose Your Path
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              Investment in Your Transformation
            </h2>
            <p className="text-muted-foreground">
              Select the depth of support that matches your transformation
              goals. All packages include our satisfaction guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.tier}
                className={`relative ${
                  pkg.popular
                    ? "border-2 border-forest-600 shadow-lg"
                    : "border-2"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-forest-700 text-cream-100">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <Badge
                    variant="outline"
                    className={`w-fit mx-auto mb-2 ${
                      pkg.popular ? "border-forest-300 text-forest-700" : ""
                    }`}
                  >
                    {pkg.tagline}
                  </Badge>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(pkg.originalPrice)}
                    </span>
                    <span
                      className={`text-4xl font-bold block ${
                        pkg.popular ? "text-forest-700" : "text-forest-900"
                      }`}
                    >
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {pkg.sessions} sessions • {pkg.duration}
                    <br />
                    Phases {pkg.phases} • {pkg.mentorLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      What&apos;s Included
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {pkg.notIncluded.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        Not included:
                      </p>
                      <ul className="space-y-1">
                        {pkg.notIncluded.map((item, index) => (
                          <li
                            key={index}
                            className="text-xs text-muted-foreground line-through"
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
                    className={`w-full ${
                      pkg.popular
                        ? "bg-forest-700 hover:bg-forest-800 text-cream-100"
                        : pkg.tier === "mentorship"
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : ""
                    }`}
                    variant={
                      pkg.popular || pkg.tier === "mentorship"
                        ? "default"
                        : "outline"
                    }
                    asChild
                  >
                    <Link href={`/auth/register?program=mid-career&tier=${pkg.tier}`}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All prices are inclusive of GST. EMI options available.
            <br />
            100% satisfaction guarantee or full refund after first 2 sessions.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-forest-700 text-cream-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories from Mid-Career Professionals
            </h2>
            <p className="text-cream-200">
              Join thousands who&apos;ve overcome their BBD syndrome and found
              career fulfillment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
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
                  <Badge className="w-fit bg-cream-100/20 text-cream-100 text-xs">
                    {testimonial.previousRole}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-cream-100 italic mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-forest-500 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-cream-300">
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
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-cream-200 text-forest-800">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
                Common Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-forest-900 hover:text-forest-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-forest-800 to-forest-900 text-cream-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Master Your Destination?
            </h2>
            <p className="text-cream-200 text-lg mb-8">
              Don&apos;t let BBD syndrome hold you back. Take the first step
              toward a fulfilling career today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-cream-100 text-forest-800 hover:bg-cream-200"
                asChild
              >
                <Link href="/auth/register?program=mid-career">
                  Start Your Transformation
                  <Target className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cream-200 text-cream-100 hover:bg-cream-100/10"
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
