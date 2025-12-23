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
  Heart,
  Check,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Calendar,
  Clock,
  Award,
  Star,
  ChevronRight,
  Target,
  Briefcase,
  Laptop,
  Network,
  MessageCircle,
  TrendingUp,
  HandHeart,
  Flower2,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const commonConcerns = [
  {
    name: "Skills Gap Anxiety",
    icon: Laptop,
    description:
      "Worried that technology and industry have moved on while you were away",
    solution:
      "We assess your current skills vs. market needs and create a focused upskilling plan",
  },
  {
    name: "Confidence Erosion",
    icon: Shield,
    description:
      "Years away from work have diminished your professional confidence",
    solution:
      "Structured confidence rebuilding through small wins and supportive mentorship",
  },
  {
    name: "Relevance Doubt",
    icon: Target,
    description:
      "Questioning if employers will value someone who's been out of the workforce",
    solution:
      "Learn to position your career break as a strength with transferable skills",
  },
  {
    name: "Flexibility Concerns",
    icon: Calendar,
    description:
      "Need work that accommodates ongoing family responsibilities",
    solution:
      "Explore flexible work options, remote roles, and family-friendly employers",
  },
]

const assessmentTools = [
  {
    name: "Confidence Rebuilder",
    description:
      "A structured program to restore your professional self-belief through achievable milestones.",
    icon: Shield,
    phase: 1,
  },
  {
    name: "Skills Gap Analyzer",
    description:
      "Identify exactly which skills need updating and create a focused learning plan.",
    icon: Laptop,
    phase: 1,
  },
  {
    name: "Market Re-entry Mapper",
    description:
      "Discover companies and roles that actively welcome returning professionals.",
    icon: Target,
    phase: 2,
  },
  {
    name: "Flexible Work Navigator",
    description:
      "Explore part-time, remote, freelance, and returnship opportunities that fit your life.",
    icon: Briefcase,
    phase: 3,
  },
  {
    name: "Support Network Builder",
    description:
      "Connect with other returning women and build your professional community.",
    icon: Network,
    phase: 4,
  },
  {
    name: "Interview Confidence Kit",
    description:
      "Practice addressing career gaps positively and showcasing your evolved strengths.",
    icon: MessageCircle,
    phase: 5,
  },
]

const phases = [
  {
    number: 1,
    name: "Reconnect",
    title: "Rebuild Your Foundation",
    description:
      "Reconnect with your professional identity, assess your current skills, and rebuild confidence step by step.",
    tools: ["Confidence Rebuilder", "Skills Assessment", "Identity Refresh"],
    duration: "2 weeks",
    tier: "guidance",
  },
  {
    number: 2,
    name: "Reassess",
    title: "Understand the Landscape",
    description:
      "Learn how the job market has evolved, identify returning-friendly employers, and clarify your goals.",
    tools: ["Market Mapping", "Skills Gap Analysis", "Goal Clarity"],
    duration: "2 weeks",
    tier: "guidance",
  },
  {
    number: 3,
    name: "Reskill",
    title: "Bridge the Gaps",
    description:
      "Update critical skills through targeted learning. Focus on what matters most for your re-entry.",
    tools: ["Learning Plan", "Tech Upskilling", "Industry Update"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 4,
    name: "Rebuild",
    title: "Restore Your Network",
    description:
      "Reconnect with old contacts, build new relationships, and join supportive communities.",
    tools: ["Network Strategy", "LinkedIn Revival", "Community Building"],
    duration: "2 weeks",
    tier: "planning",
  },
  {
    number: 5,
    name: "Re-enter",
    title: "Launch Your Comeback",
    description:
      "Apply strategically with polished materials and confidence. Navigate interviews with grace.",
    tools: ["Resume Refresh", "Interview Prep", "Negotiation Support"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 6,
    name: "Thrive",
    title: "Sustain Your Success",
    description:
      "Navigate your new role with ongoing support, work-life balance strategies, and continued growth.",
    tools: ["Onboarding Support", "Work-Life Balance", "Career Growth"],
    duration: "Ongoing",
    tier: "mentorship",
  },
]

const packages = [
  {
    tier: "guidance",
    name: "Guidance",
    tagline: "Reconnect & clarify",
    price: 25000,
    originalPrice: 32000,
    sessions: 6,
    duration: "8 weeks",
    mentorLevel: "Women Career Mentor (L1)",
    phases: "1-2",
    features: [
      "6 one-on-one mentor sessions",
      "Confidence Rebuilder Program",
      "Skills Gap Assessment",
      "Market Landscape Overview",
      "2 Core Career Workbooks",
      "Email support",
      "Bi-weekly check-ins",
      "Women's network access",
    ],
    notIncluded: [
      "Reskilling support",
      "Interview preparation",
      "Ongoing mentorship",
    ],
  },
  {
    tier: "planning",
    name: "Planning",
    tagline: "Complete re-entry program",
    price: 45000,
    originalPrice: 55000,
    sessions: 10,
    duration: "12 weeks",
    mentorLevel: "Senior Women Mentor (L2)",
    phases: "1-5",
    popular: true,
    features: [
      "10 one-on-one mentor sessions",
      "Full Assessment Suite",
      "All Career Workbooks",
      "Customized Reskilling Plan",
      "LinkedIn Profile Revival",
      "Resume Transformation",
      "Interview Preparation",
      "Network Building Support",
      "Returnship & Flexible Role Access",
      "Priority email support",
      "Full alumni network access",
    ],
    notIncluded: ["Extended career partnership"],
  },
  {
    tier: "mentorship",
    name: "Mentorship",
    tagline: "Sustained success partner",
    price: 75000,
    originalPrice: 90000,
    sessions: 18,
    duration: "6 months",
    mentorLevel: "Executive Women Mentor (L3)",
    phases: "1-6",
    features: [
      "18 one-on-one mentor sessions",
      "Full Assessment Suite + AI Insights",
      "All Workbooks + Premium Content",
      "Comprehensive Reskilling Support",
      "Executive Coaching Sessions",
      "Personal Branding Development",
      "Multiple Interview Rehearsals",
      "Salary Negotiation Coaching",
      "First 90 Days Onboarding Support",
      "Work-Life Balance Coaching",
      "24/7 priority support",
      "VIP women's network access",
      "12-month post-placement support",
    ],
    notIncluded: [],
  },
]

const successPathways = [
  {
    name: "Corporate Returnships",
    description:
      "Paid programs designed specifically for returning professionals, offered by leading companies",
    companies: ["Tata Group", "Infosys", "IBM", "Goldman Sachs", "P&G"],
  },
  {
    name: "Flexible & Remote Roles",
    description:
      "Full-time positions with flexibility - remote work, hybrid models, or flexible hours",
    companies: ["Cisco", "Salesforce", "Adobe", "Flipkart", "Freshworks"],
  },
  {
    name: "Part-Time & Consulting",
    description:
      "Structured part-time positions or consulting arrangements for gradual re-entry",
    companies: ["Deloitte", "PwC", "McKinsey", "BCG", "Bain"],
  },
  {
    name: "Entrepreneurship",
    description:
      "Start your own venture or freelance practice leveraging your experience",
    companies: ["Your Own Business", "Freelance", "Consulting", "E-commerce"],
  },
]

const testimonials = [
  {
    name: "Priyanka Mehta",
    role: "Now: Senior Product Manager at Swiggy",
    previousRole: "Was: 5-year career break for childcare",
    image: "/testimonials/priyanka.jpg",
    quote:
      "After 5 years away, I thought my product career was over. Dheya helped me see my break as an asset - I had become a better problem solver! Within 4 months, I was back at a senior level.",
    rating: 5,
  },
  {
    name: "Deepa Krishnan",
    role: "Now: VP Finance at Razorpay",
    previousRole: "Was: 7-year break, feeling lost",
    image: "/testimonials/deepa.jpg",
    quote:
      "The confidence rebuilding program changed everything. I went from doubting if anyone would hire me to negotiating an executive position. The women's network was incredibly supportive.",
    rating: 5,
  },
  {
    name: "Anita Sharma",
    role: "Now: Founder, EdTech Startup",
    previousRole: "Was: 8-year break, considering part-time",
    image: "/testimonials/anita.jpg",
    quote:
      "I initially wanted a part-time job. But through the program, I discovered I wanted to start my own EdTech company. My mentor helped me see that my teaching experience plus my corporate background was perfect for this.",
    rating: 5,
  },
]

const faqs = [
  {
    question: "How long a career break is too long?",
    answer:
      "There's no such thing as 'too long.' We've helped women return successfully after breaks of 10+ years. The key is positioning your break strategically and demonstrating your continued relevance. Employers increasingly value the unique perspectives that career returners bring.",
  },
  {
    question: "Will I need to start at a lower level than before?",
    answer:
      "Not necessarily. Many women return at similar or even higher levels, especially through returnship programs or with proper positioning. We help you identify opportunities that value your experience and negotiate appropriate compensation.",
  },
  {
    question: "I'm not tech-savvy. Is that a problem?",
    answer:
      "We specifically address technology anxiety in our program. Our Skills Gap Analyzer identifies exactly what you need to learn (often less than you think!), and we provide focused, manageable upskilling plans. You'll feel current and confident.",
  },
  {
    question: "Can I return part-time or with flexible hours?",
    answer:
      "Absolutely! We specialize in identifying flexible opportunities - remote positions, part-time roles, consulting arrangements, and family-friendly employers. Many returning women prefer gradual re-entry, and we fully support that.",
  },
  {
    question: "What if I want to change careers entirely?",
    answer:
      "Many returning women use this as an opportunity for career reinvention. Your break may have revealed new passions or your previous field may have changed. We help you explore new directions while leveraging transferable skills.",
  },
  {
    question: "Is there a community of other returning women?",
    answer:
      "Yes! Our women's alumni network connects you with thousands of other returning professionals. You'll find peer support, mentorship opportunities, job referrals, and lasting friendships with women who understand your journey.",
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ReturningWomenPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-cream section-padding overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.08),transparent_50%)]" />
        <div className="container-uplift relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="font-display bg-rose-100 text-rose-700 hover:bg-rose-100">
                  <Heart className="h-3 w-3 mr-1" />
                  Returning Women Professionals
                </Badge>
              </div>
              <h1 className="text-display text-charcoal-900">
                RESTART &{" "}
                <span className="text-rose-600">RISE</span>
              </h1>
              <p className="text-lg md:text-xl font-body text-charcoal-600 max-w-xl">
                Your career break was a chapter, not the end of your story.
                Confidently re-enter the workforce, rebuild your skills, and find
                opportunities that fit your life.
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
                  <Clock className="h-4 w-4 text-rose-600" />
                  <span>8 weeks to 6 months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-rose-600" />
                  <span>Women-only Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-rose-600" />
                  <span>88% Successful Re-entry</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-rose-200 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-4 bg-rose-300 rounded-full opacity-20" />
                <div className="absolute inset-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Flower2 className="h-16 w-16 text-rose-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-charcoal-900">
                      10,000+
                    </p>
                    <p className="text-micro text-charcoal-500">
                      Women restarted careers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Concerns Section */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-rose-100 text-rose-700">
              <HandHeart className="h-3 w-3 mr-1" />
              We Understand
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Your Concerns Are Valid. We Have Solutions.
            </h2>
            <p className="font-body text-charcoal-600">
              After years away from work, it&apos;s natural to have doubts. Our
              program addresses each concern systematically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {commonConcerns.map((concern, index) => {
              const Icon = concern.icon
              return (
                <Card
                  key={index}
                  variant="light"
                  hover="lift"
                  className="group border-2 hover:border-rose-200"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-rose-100 group-hover:bg-rose-200 transition-colors">
                        <Icon className="h-6 w-6 text-rose-600" />
                      </div>
                      <div>
                        <CardTitle className="heading-card">{concern.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {concern.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 bg-rose-50 p-3 rounded-lg">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-body text-charcoal-700">
                        <span className="font-medium">Our solution: </span>
                        {concern.solution}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Pathways Section */}
      <section className="section-charcoal section-padding text-white">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-white text-rose-600 hover:bg-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Multiple Pathways
            </Badge>
            <h2 className="heading-section mb-4">
              Choose Your Re-entry Path
            </h2>
            <p className="font-body text-charcoal-100">
              There&apos;s no single way back. We help you explore options and
              find what fits your life best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {successPathways.map((pathway, index) => (
              <Card
                key={index}
                variant="dark"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              >
                <CardHeader>
                  <CardTitle className="heading-card text-white">
                    {pathway.name}
                  </CardTitle>
                  <CardDescription className="text-charcoal-100">
                    {pathway.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-micro text-charcoal-200 uppercase tracking-wider mb-2">
                    Examples
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {pathway.companies.slice(0, 4).map((company, compIndex) => (
                      <span
                        key={compIndex}
                        className="text-xs bg-white/20 px-2 py-1 rounded"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Tools Section */}
      <section className="section-cream section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-rose-100 text-rose-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Designed for You
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Tools Created Specifically for Returning Women
            </h2>
            <p className="font-body text-charcoal-600">
              Our assessment tools address the unique challenges of re-entering
              the workforce after a career break.
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
                      <div className="p-2 rounded-lg bg-rose-100 group-hover:bg-rose-200 transition-colors">
                        <Icon className="h-5 w-5 text-rose-600" />
                      </div>
                      <Badge variant="outline" className="font-display text-xs">
                        Phase {tool.phase}
                      </Badge>
                    </div>
                    <CardTitle className="heading-card mt-3">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-body text-charcoal-600">
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
      <section className="section-charcoal section-padding text-white">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-rose-500 text-white hover:bg-rose-500">
              Your Journey
            </Badge>
            <h2 className="heading-section mb-4">
              Your 6-Phase Comeback Story
            </h2>
            <p className="font-body text-charcoal-100">
              A supportive, step-by-step process designed to rebuild your
              confidence and launch your return.
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
                      ? "bg-rose-600/20 border border-rose-500/30"
                      : "bg-purple-600/20 border border-purple-500/30"
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center font-bold text-lg">
                    {phase.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="heading-card">{phase.title}</h3>
                    <Badge
                      className={`font-display ${
                        phase.tier === "guidance"
                          ? "bg-white text-charcoal-800"
                          : phase.tier === "planning"
                            ? "bg-rose-500 text-white"
                            : "bg-purple-500 text-white"
                      }`}
                    >
                      {phase.tier === "guidance"
                        ? "Guidance+"
                        : phase.tier === "planning"
                          ? "Planning+"
                          : "Mentorship"}
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
                        className="text-xs bg-charcoal-900/50 px-2 py-1 rounded"
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
      <section id="packages" className="section-cream section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-rose-100 text-rose-700">
              Choose Your Path
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Investment in Your Comeback
            </h2>
            <p className="font-body text-charcoal-600">
              Select the level of support that matches your needs. All packages
              include access to our supportive women&apos;s community.
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
                    ? "border-2 border-rose-500 shadow-lg"
                    : "border-2"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="font-display bg-rose-600 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <Badge
                    variant="outline"
                    className={`font-display w-fit mx-auto mb-2 ${
                      pkg.popular ? "border-rose-300 text-rose-700" : ""
                    }`}
                  >
                    {pkg.tagline}
                  </Badge>
                  <CardTitle className="heading-card">{pkg.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-micro text-charcoal-600 line-through">
                      {formatPrice(pkg.originalPrice)}
                    </span>
                    <span
                      className={`text-4xl font-bold block ${
                        pkg.popular ? "text-rose-600" : "text-charcoal-900"
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
                    <p className="text-micro text-charcoal-500 uppercase tracking-wider mb-2">
                      What&apos;s Included
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm font-body"
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
                    <Link href={`/auth/register?program=returning-women&tier=${pkg.tier}`}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-micro text-charcoal-500 mt-8">
            All prices are inclusive of GST. EMI options available.
            <br />
            100% satisfaction guarantee or full refund after first 2 sessions.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-charcoal section-padding text-white">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-section mb-4">
              Comeback Success Stories
            </h2>
            <p className="font-body text-charcoal-100">
              Real stories from real women who restarted their careers with
              confidence
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
                  <Badge className="font-display w-fit bg-white/20 text-white text-xs">
                    {testimonial.previousRole}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-body text-charcoal-50 italic mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-400 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-micro text-charcoal-200">
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
              <Badge className="font-display mb-4 bg-charcoal-200 text-charcoal-800">FAQ</Badge>
              <h2 className="heading-section text-charcoal-900 mb-4">
                Common Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-charcoal-900 hover:text-rose-600">
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
      <section className="section-purple section-padding text-white">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-section mb-4">
              Ready to Write Your Comeback Story?
            </h2>
            <p className="font-body text-purple-100 text-lg mb-8">
              Your career break doesn&apos;t define you - your comeback will.
              Join thousands of women who&apos;ve successfully restarted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="dark"
                asChild
              >
                <Link href="/auth/register?program=returning-women">
                  Start Your Comeback
                  <Heart className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="upliftOutline"
                className="border-white text-white hover:bg-white/10"
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
