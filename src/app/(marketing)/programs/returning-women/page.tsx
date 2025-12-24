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
  Star,
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
    price: 13999,
    originalPrice: 17999,
    sessions: 2,
    duration: "2-3 weeks",
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
    price: 26999,
    originalPrice: 34999,
    sessions: "4-5",
    duration: "6 weeks",
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
    price: 64999,
    originalPrice: 84999,
    sessions: "12-18",
    duration: "12 months",
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
      {/* Hero Section - Restart & Rise (Rose/Charcoal) */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-200/30 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container-uplift relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <Heart className="h-3 w-3 fill-rose-700" />
                Returning Professionals
              </div>
              <h1 className="text-display text-5xl lg:text-7xl font-bold text-charcoal-900 tracking-tight leading-[1.1]">
                Restart & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">Rise Stronger</span>
              </h1>
              <p className="text-xl text-charcoal-600 max-w-xl leading-relaxed">
                Your career break is a chapter, not the end. Re-enter the workforce with confidence, updated skills, and a community that believes in you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="xl"
                  className="bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-xl shadow-rose-600/20"
                  asChild
                >
                  <Link href="#packages">
                    View Programs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild className="border-charcoal-200 text-charcoal-900 hover:bg-charcoal-50 bg-white">
                  <Link href="/contact">Free Consultation</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-8 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="font-bold text-charcoal-900">8 Weeks</div>
                    <div className="text-xs text-charcoal-500">To Re-launch</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="font-bold text-charcoal-900">Women-Only</div>
                    <div className="text-xs text-charcoal-500">Community Access</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg">
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-purple-200 rounded-[2.5rem] transform -rotate-6 scale-95 opacity-80 border border-white/50"></div>
                <div className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-rose-100">
                  <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-[0.02]"></div>
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-rose-50/50 to-white">
                    <Flower2 className="h-24 w-24 text-rose-500 mb-6 drop-shadow-[0_10px_20px_rgba(244,63,94,0.3)]" />
                    <h3 className="text-2xl font-display font-bold text-charcoal-900 mb-2">10,000+</h3>
                    <p className="text-charcoal-500 font-medium">Careers Restarted Successfully</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-6 top-1/4 bg-white/90 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-xl animate-float-slow max-w-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <TrendingUp className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-charcoal-900">88% Rate</div>
                      <div className="text-xs text-charcoal-500 mt-1">Successful Placement</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-white/90 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-xl animate-float-delayed max-w-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-charcoal-900">Returnships</div>
                      <div className="text-xs text-charcoal-500 mt-1">Partner Network</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Concerns Section - Empathy First */}
      <section className="bg-cream-50 section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-widest mb-6">
              <HandHeart className="h-3 w-3" />
              We Understand The Journey
            </div>
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Your Doubts Are <span className="text-rose-600">Valid</span>.<br /> But So Is Your Talent.
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Returning to work is emotional and challenging. We tackle the psychological and practical barriers head-on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonConcerns.map((concern, index) => {
              const Icon = concern.icon
              return (
                <Card
                  key={index}
                  className="group relative border-0 bg-white shadow-lg p-2 rounded-[2rem] hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-8 pb-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center mb-6 transition-colors duration-300">
                      <Icon className="h-7 w-7 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-charcoal-900 mb-2">
                      {concern.name}
                    </h3>
                    <p className="text-charcoal-500 mb-6 text-sm">{concern.description}</p>
                  </div>
                  <div className="bg-rose-50/50 rounded-3xl p-6 mx-2 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-green-100 mt-1">
                        <Check className="h-3 w-3 text-green-700 stroke-[3px]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-rose-700 uppercase tracking-wide block mb-1">Our Solution</span>
                        <p className="text-charcoal-800 font-medium text-sm leading-relaxed">{concern.solution}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Pathways Section - Dark Premium */}
      <section className="section-charcoal section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <TrendingUp className="h-3 w-3" />
              Modern Options
            </div>
            <h2 className="text-display sm:text-5xl text-white mb-6">
              Multiple Paths To Re-entry
            </h2>
            <p className="text-body-lg text-charcoal-300">
              The workplace has evolved. Discover flexible ways to restart your career that fit your new lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successPathways.map((pathway, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-display font-bold text-white mb-2">
                    {pathway.name}
                  </CardTitle>
                  <CardDescription className="text-charcoal-300 text-sm leading-relaxed">
                    {pathway.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-px w-full bg-white/10 mb-4"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 mb-3">
                    Who Hires Like This
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pathway.companies.slice(0, 4).map((company, compIndex) => (
                      <span
                        key={compIndex}
                        className="text-[10px] font-medium bg-rose-500/20 text-rose-200 border border-rose-500/30 px-2 py-1.5 rounded"
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
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" />
              Specialized Toolkit
            </div>
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Tools For Your Comeback
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Our proprietary frameworks are designed specifically to bridge the gap between your past experience and future potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessmentTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <Card
                  key={index}
                  className="group border-0 shadow-none bg-transparent"
                >
                  <div className="h-full p-8 rounded-3xl bg-cream-50 hover:bg-white border border-transparent hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-charcoal-800" />
                    </div>
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-500 bg-charcoal-100 px-2 py-1 rounded-lg">
                        Phase {tool.phase}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-charcoal-900 mb-3">{tool.name}</h3>
                    <p className="text-charcoal-600 leading-relaxed text-sm">
                      {tool.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6-Phase Journey Section */}
      <section className="bg-charcoal-950 section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-display sm:text-5xl text-white mb-6">
              Your 6-Step Return Roadmap
            </h2>
            <p className="text-body-lg text-charcoal-300">
              Structured to eliminate overwhelm. We take it one phase at a time, celebrating every win.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className="group relative flex flex-col md:flex-row gap-6 p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                {/* Connector Line */}
                {index < phases.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-0 w-px bg-white/10 hidden md:block group-hover:bg-rose-500/50 transition-colors"></div>
                )}

                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shadow-lg transition-transform group-hover:scale-110 ${phase.tier === 'guidance' ? 'bg-charcoal-700 text-white border border-white/20' :
                    phase.tier === 'planning' ? 'bg-rose-600 text-white border border-rose-500' :
                      'bg-purple-600 text-white border border-purple-500'
                    }`}>
                    {phase.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-display font-bold text-white">{phase.title}</h3>
                    <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${phase.tier === 'guidance' ? 'bg-white/10 text-charcoal-200' :
                      phase.tier === 'planning' ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30' :
                        'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                      }`}>
                      {phase.tier === "guidance" ? "Guidance+" : phase.tier === "planning" ? "Planning+" : "Mentorship"}
                    </div>
                    <span className="text-xs text-charcoal-400 font-medium uppercase tracking-wider border-l border-white/10 pl-3">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-charcoal-300 text-base mb-4 max-w-2xl">
                    {phase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-black/20 border border-white/10 text-charcoal-300"
                      >
                        <div className="w-1 h-1 rounded-full bg-rose-500/50"></div>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="relative py-24 bg-cream-50 overflow-hidden">
        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Invest In Your Comeback
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Select the level of support that matches your ambition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.tier}
                className={`relative border-0 overflow-hidden flex flex-col h-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ${pkg.popular
                  ? "ring-4 ring-rose-500/30 scale-105 z-10"
                  : ""
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-400 to-purple-500" />
                )}

                <CardHeader className="text-center pb-8 pt-10">
                  {pkg.popular && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-rose-100 text-rose-700 px-2 py-1 rounded">
                      Recommended
                    </span>
                  )}
                  <div className={`text-sm font-bold uppercase tracking-widest mb-2 text-charcoal-500`}>
                    {pkg.tagline}
                  </div>
                  <CardTitle className="text-3xl font-display font-bold text-charcoal-900">
                    {pkg.name}
                  </CardTitle>
                  <div className="mt-6 flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-charcoal-900">
                      {formatPrice(pkg.price)}
                    </span>
                    <span className="text-sm line-through text-charcoal-400">
                      {formatPrice(pkg.originalPrice)}
                    </span>
                  </div>
                  <div className="mt-4 text-sm font-medium text-charcoal-600">
                    {pkg.duration} • {pkg.sessions} Sessions
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 px-8">
                  <div className="w-full h-px bg-charcoal-100" />
                  <ul className="space-y-4">
                    {pkg.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check className="h-5 w-5 flex-shrink-0 text-rose-600" />
                        <span className="text-charcoal-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-8 pb-10 px-8">
                  <Button
                    className={`w-full h-12 text-base font-bold rounded-xl transition-all ${pkg.popular
                      ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30"
                      : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                      }`}
                    asChild
                  >
                    <Link href={`/auth/register?program=returning-women&tier=${pkg.tier}`}>
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-charcoal-400 text-sm mt-12 opacity-80">
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
