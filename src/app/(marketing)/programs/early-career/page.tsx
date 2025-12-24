"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Rocket,
  Check,
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Compass,
  Lightbulb,
  TrendingUp,
  Users,
  Calendar,
  Star,
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
    price: 13999,
    originalPrice: 17999,
    sessions: 2,
    duration: "2-3 weeks",
    mentorLevel: "Certified Career Mentor (L1)",
    phases: "1-2",
    features: [
      "4 one-on-one mentor sessions",
      "Career Fitness Check",
      "TriFit validation",
      "Stay vs pivot framework",
      "MBA ROI analysis",
      "Identity Discovery Assessment",
      "Email support",
      "Monthly progress check-ins",
    ],
    notIncluded: [
      "2-year development plan",
      "Strategic networking",
      "Interview preparation",
      "Priority support",
    ],
  },
  {
    tier: "planning",
    name: "Planning",
    tagline: "Most popular choice",
    price: 26999,
    originalPrice: 34999,
    sessions: "4-5",
    duration: "6 weeks",
    mentorLevel: "Senior Career Mentor (L2)",
    phases: "1-5",
    popular: true,
    features: [
      "8 one-on-one mentor sessions",
      "2-year development plan",
      "Executive education recommendations",
      "Strategic networking",
      "Personal branding",
      "Full Assessment Suite",
      "Resume & LinkedIn Optimization",
      "Interview Preparation",
      "Bi-weekly progress reports",
      "Priority email support",
    ],
    notIncluded: ["Ongoing mentorship", "24/7 support"],
  },
  {
    tier: "mentorship",
    name: "Mentorship",
    tagline: "Complete transformation",
    price: 64999,
    originalPrice: 84999,
    sessions: "12-18",
    duration: "12 months",
    mentorLevel: "Industry Expert Mentor (L3)",
    phases: "1-6",
    features: [
      "16 one-on-one mentor sessions",
      "Leadership development",
      "Executive presence",
      "Strategic moves guidance",
      "Entrepreneurship exploration",
      "Full Assessment Suite + AI Insights",
      "Comprehensive Industry Research",
      "Multiple Interview Rehearsals",
      "Job Offer Negotiation Support",
      "Weekly progress sessions",
      "24/7 priority support",
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
      {/* Hero Section - Fresh & Dynamic */}
      <section className="relative overflow-hidden bg-cream-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sun-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container-uplift relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <Rocket className="h-3 w-3" />
                Early Career (22-30)
              </div>
              <h1 className="text-display text-5xl lg:text-7xl font-bold text-charcoal-900 tracking-tight leading-[1.1]">
                Launch Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-sun-500">Dream Career</span>
              </h1>
              <p className="text-xl text-charcoal-600 max-w-xl leading-relaxed">
                Stop guessing and start thriving. Discover your unique strengths,
                explore future-proof paths, and build a roadmap for acceleratred success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="xl"
                  variant="uplift"
                  asChild
                  className="shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
                >
                  <Link href="#packages">
                    View Programs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="upliftOutline" asChild className="bg-white/80 backdrop-blur-sm">
                  <Link href="/contact">Book Free Consultation</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-charcoal-100">
                <div>
                  <div className="text-3xl font-display font-bold text-charcoal-900">25k+</div>
                  <div className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mt-1">Careers Launched</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-charcoal-900">91%</div>
                  <div className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mt-1">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-charcoal-900">4.9/5</div>
                  <div className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mt-1">Mentee Rating</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg">
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-sun-50 rounded-[2.5rem] transform rotate-6 scale-95 opacity-50"></div>
                <div className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-sun-500/5"></div>
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-[url('/images/pattern-overlay.png')] opacity-60">
                    <Rocket className="h-24 w-24 text-purple-600 mb-6 drop-shadow-lg" />
                    <h3 className="text-2xl font-display font-bold text-charcoal-900 mb-4">The Launchpad</h3>
                    <p className="text-charcoal-600 font-medium">Systematic framework to go from confusion to clarity in 6 weeks.</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-6 top-1/4glass-premium p-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50 animate-float-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal-500 uppercase">Clarity Score</div>
                      <div className="text-lg font-bold text-charcoal-900">98%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 glass-premium p-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal-500 uppercase">Expert Mentors</div>
                      <div className="text-lg font-bold text-charcoal-900">500+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="bg-cream-50 section-padding relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Made For The  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-sun-500">Ambitious</span>
            </h2>
            <p className="text-body-lg text-charcoal-600">
              The early years define your career trajectory. If you&apos;re ready to accelerate your growth, this is your launchpad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Recent Graduate",
                description: "Just finished college and unsure which career path to pursue among many options",
                icon: BookOpen,
                color: "purple"
              },
              {
                title: "Early in Career",
                description: "1-5 years into your career but questioning if this is the right path for you",
                icon: Briefcase,
                color: "sun"
              },
              {
                title: "Seeking Direction",
                description: "Know you have potential but struggling to find where you truly belong",
                icon: Compass,
                color: "purple"
              },
              {
                title: "Ready for Growth",
                description: "Motivated to build a successful career but need a strategic roadmap",
                icon: TrendingUp,
                color: "sun"
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="group relative border-0 bg-white shadow-md hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 ${index % 2 === 0 ? "bg-purple-500" : "bg-sun-500"}`}></div>
                  <CardHeader className="text-center pt-8">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${index % 2 === 0 ? "bg-purple-50 text-purple-600" : "bg-sun-50 text-sun-600"}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-display font-bold text-charcoal-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-8">
                    <p className="text-charcoal-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Assessment Tools Section - Scientific & Clean */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sun-100 text-sun-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" />
              Proprietary Tools
            </div>
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Precision Engineering For <br /> <span className="text-purple-600">Your Career</span>
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Our scientifically-validated assessments have helped over 25,000
              young professionals find their ideal career paths.
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
                  <div className="h-full p-8 rounded-3xl bg-cream-50 hover:bg-white border border-transparent hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-purple-600" />
                    </div>
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                        Phase {tool.phase}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-charcoal-900 mb-3">{tool.name}</h3>
                    <p className="text-charcoal-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6-Phase Journey Section - Interactive & Bold */}
      <section className="section-charcoal section-padding relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-purple-600 rounded-full mix-blend-overlay filter blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-sun-500 rounded-full mix-blend-overlay filter blur-[120px]"></div>
        </div>

        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-display text-white mb-6">
              The Path To <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sun-400">Advantage</span>
            </h2>
            <p className="text-body-lg text-charcoal-200">
              No generic advice. A systematic, science-backed process that
              uncovers who you are and where you truly belong.
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
                  <div className="absolute left-12 top-20 bottom-0 w-px bg-white/10 hidden md:block group-hover:bg-purple-500/50 transition-colors"></div>
                )}

                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-bold shadow-lg transition-transform group-hover:scale-110 ${phase.tier === 'guidance' ? 'bg-white text-charcoal-900 border-2 border-white' :
                    phase.tier === 'planning' ? 'bg-purple-600 text-white border-2 border-purple-400' :
                      'bg-gradient-to-br from-sun-400 to-sun-600 text-charcoal-900 border-2 border-sun-300'
                    }`}>
                    {phase.number}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-display font-bold text-white">{phase.title}</h3>
                    <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${phase.tier === 'guidance' ? 'bg-white/20 text-white' :
                      phase.tier === 'planning' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/30' :
                        'bg-sun-500/20 text-sun-300 border border-sun-500/30'
                      }`}>
                      {phase.tier === "guidance" ? "Guidance+" : phase.tier === "planning" ? "Planning+" : "Mentorship"}
                    </div>
                    <span className="text-xs text-charcoal-400 font-medium uppercase tracking-wider border-l border-white/10 pl-3">
                      {phase.duration}
                    </span>
                  </div>

                  <p className="text-lg text-charcoal-200 mb-6 max-w-3xl">
                    {phase.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-charcoal-300 group-hover:border-white/20 transition-colors"
                      >
                        <div className="w-1 h-1 rounded-full bg-purple-400"></div>
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

      {/* Packages Section - Premium Cards */}
      <section id="packages" className="relative py-24 bg-charcoal-900 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sun-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-display text-white mb-6">
              Invest In Your Future
            </h2>
            <p className="text-body-lg text-charcoal-200">
              Select the level of support that matches your goals.
              The ROI of a well-planned career is limitless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.tier}
                className={`relative border-0 overflow-hidden flex flex-col h-full ${pkg.popular
                  ? "bg-white text-charcoal-900 ring-4 ring-purple-500/50 shadow-2xl scale-105 z-10"
                  : "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/15 transition-colors"
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 to-sun-500" />
                )}

                <CardHeader className="text-center pb-8 pt-10">
                  {pkg.popular && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      Best Value
                    </span>
                  )}
                  <div className={`text-sm font-bold uppercase tracking-widest mb-2 ${pkg.popular ? "text-purple-600" : "text-charcoal-400"}`}>
                    {pkg.tagline}
                  </div>
                  <CardTitle className={`text-3xl font-display font-bold ${pkg.popular ? "text-charcoal-900" : "text-white"}`}>
                    {pkg.name}
                  </CardTitle>
                  <div className="mt-6 flex items-baseline justify-center gap-2">
                    <span className={`text-4xl font-bold ${pkg.popular ? "text-charcoal-900" : "text-white"}`}>
                      {formatPrice(pkg.price)}
                    </span>
                    <span className={`text-sm line-through ${pkg.popular ? "text-charcoal-400" : "text-charcoal-500"}`}>
                      {formatPrice(pkg.originalPrice)}
                    </span>
                  </div>
                  <div className={`mt-4 text-sm font-medium ${pkg.popular ? "text-charcoal-600" : "text-charcoal-300"}`}>
                    {pkg.duration} • {pkg.sessions} Sessions
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className={`w-full h-px ${pkg.popular ? "bg-charcoal-100" : "bg-white/10"}`} />
                  <ul className="space-y-4">
                    {pkg.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check className={`h-5 w-5 flex-shrink-0 ${pkg.popular ? "text-green-600" : "text-green-400"}`} />
                        <span className={pkg.popular ? "text-charcoal-700" : "text-charcoal-200"}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-8 pb-10">
                  <Button
                    className={`w-full h-12 text-base font-bold rounded-xl transition-all ${pkg.popular
                      ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30"
                      : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    asChild
                  >
                    <Link href={`/auth/register?program=early-career&tier=${pkg.tier}`}>
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

      {/* Testimonials Section - Glass Cards */}
      <section className="relative py-24 bg-gradient-to-b from-purple-700 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <Heart className="h-3 w-3 text-pink-400 fill-pink-400" />
              Real Stories
            </div>
            <h2 className="text-display text-white mb-6">
              Don&apos;t Just Take Our Word For It
            </h2>
            <p className="text-body-lg text-purple-100">
              Join thousands who&apos;ve transformed their confusion into confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-xl hover:bg-white/15 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-sun-400 text-sun-400"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-purple-50 italic mb-8 min-h-[100px]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-sun-400 p-[2px]">
                      <div className="w-full h-full rounded-full bg-charcoal-800 flex items-center justify-center overflow-hidden">
                        {/* Placeholder for image if needed, or initials */}
                        <span className="text-lg font-bold text-white">{testimonial.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-display font-bold text-white">{testimonial.name}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-purple-200">
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

      {/* FAQ & CTA Section */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-display text-charcoal-900 mb-6">
                Common Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-6 data-[state=open]:bg-cream-50 data-[state=open]:border-purple-200 transition-colors">
                  <AccordionTrigger className="text-left font-display font-medium text-lg text-charcoal-900 hover:text-purple-600 py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-charcoal-600 text-base pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Final CTA */}
          <div className="rounded-[2.5rem] bg-gradient-to-r from-purple-700 to-charcoal-900 p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sun-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-display text-white">
                Ready To Launch <br /> Your Purposeful Career?
              </h2>
              <p className="text-xl text-purple-100">
                Don&apos;t let another month pass feeling stuck. Take the first step towards a fulfilling career today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="xl"
                  className="bg-white text-purple-900 hover:bg-cream-50 font-bold"
                  asChild
                >
                  <Link href="/auth/register?program=early-career">
                    Start Your Journey Now
                    <Rocket className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/contact">Talk to an Advisor</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
