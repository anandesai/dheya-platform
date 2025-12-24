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
import {
  Target,
  Check,
  ArrowRight,
  Sparkles,
  Heart,
  Brain,
  Scale,
  TrendingUp,
  Star,
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
    price: 16999,
    originalPrice: 21999,
    sessions: 2,
    duration: "2-3 weeks",
    mentorLevel: "Senior Career Mentor (L1)",
    phases: "1-2",
    features: [
      "6 one-on-one mentor sessions",
      "Career Satisfaction Assessment",
      "Mid-life values realignment",
      "Pivot mapping",
      "BBD Syndrome Assessment",
      "Work Values Alignment Tool",
      "Email support",
      "Bi-weekly progress check-ins",
    ],
    notIncluded: [
      "Phased Transition Plan",
      "Skill bridging",
      "Board positioning",
      "Ongoing mentorship",
    ],
  },
  {
    tier: "planning",
    name: "Planning",
    tagline: "Complete transformation",
    price: 32999,
    originalPrice: 42999,
    sessions: "4-5",
    duration: "6 weeks",
    mentorLevel: "Principal Career Mentor (L2)",
    phases: "1-5",
    popular: true,
    features: [
      "12 one-on-one mentor sessions",
      "Phased Transition Plan",
      "Skill bridging",
      "Portfolio career design",
      "Board positioning",
      "Full Assessment Suite",
      "Career Redesign Framework",
      "Executive Resume & LinkedIn",
      "Strategic Network Building",
      "Weekly progress reports",
    ],
    notIncluded: ["Extended executive coaching"],
  },
  {
    tier: "mentorship",
    name: "Mentorship",
    tagline: "Ultimate career partner",
    price: 79999,
    originalPrice: 110000,
    sessions: "12-18",
    duration: "12 months",
    mentorLevel: "Executive Career Mentor (L3)",
    phases: "1-6",
    features: [
      "24 one-on-one mentor sessions",
      "Full transformation support",
      "Executive coaching",
      "Second career launch",
      "Thought leadership",
      "Board-Level Networking Support",
      "Salary Negotiation Coaching",
      "Leadership Development Track",
      "24/7 priority support",
      "VIP alumni network access",
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
      {/* Hero Section - Majestic & Commanding */}
      <section className="relative overflow-hidden bg-charcoal-900 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.05]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sun-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container-uplift relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <Target className="h-3 w-3" />
                Mid-Career (30-45)
              </div>
              <h1 className="text-display text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Master Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sun-400">Destination</span>
              </h1>
              <p className="text-xl text-charcoal-200 max-w-xl leading-relaxed">
                Break through the plateau. Overcome the Bored-Burned-Dissatisfied cycle and design a career that honors your experience and ambition.
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
                <Button size="xl" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Link href="/contact">Book Strategy Session</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-display font-bold text-white">50k+</div>
                  <div className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mt-1">Lives Impacted</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-white">91%</div>
                  <div className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mt-1">Clarity Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-white">4.9/5</div>
                  <div className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mt-1">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg">
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-charcoal-800 rounded-[2.5rem] transform rotate-6 scale-95 opacity-80 border border-white/10"></div>
                <div className="absolute inset-0 bg-charcoal-800/80 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-sun-500/5"></div>
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-[url('/images/pattern-overlay.png')] opacity-60">
                    <Target className="h-24 w-24 text-sun-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Destination Mastery</h3>
                    <p className="text-charcoal-300 font-medium">Strategic intervention for high-stakes career transitions.</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-6 top-1/4 bg-white p-4 rounded-xl shadow-xl animate-float-slow max-w-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center mt-1">
                      <Flame className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-charcoal-900">Break Burnout</div>
                      <div className="text-xs text-charcoal-500 mt-1">Reclaim your energy and passion.</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-white p-4 rounded-xl shadow-xl animate-float-delayed max-w-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center mt-1">
                      <Compass className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-charcoal-900">Find Direction</div>
                      <div className="text-xs text-charcoal-500 mt-1">Pivot with precision and confidence.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BBD Syndrome Section - Educational & Empathic */}
      <section className="section-padding bg-cream-50">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest mb-6">
              <AlertTriangle className="h-3 w-3" />
              The Diagnosis
            </div>
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Feeling <span className="text-red-600">Stuck?</span>
            </h2>
            <p className="text-body-lg text-charcoal-600">
              The &quot;BBD Syndrome&quot; affects 73% of mid-career professionals. Identifying your specific blocker is the first step to freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bbdSymptoms.map((symptom, index) => {
              const Icon = symptom.icon
              return (
                <Card
                  key={index}
                  className="group relative border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="text-center pt-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 group-hover:bg-red-50 flex items-center justify-center mb-4 transition-colors">
                      <Icon className="h-8 w-8 text-charcoal-700 group-hover:text-red-500 transition-colors" />
                    </div>
                    <CardTitle className="text-2xl font-display font-bold text-charcoal-900">
                      {symptom.name}
                    </CardTitle>
                    <CardDescription className="text-charcoal-600 font-medium">
                      {symptom.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <div className="bg-cream-50 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-3 text-center">
                        Symptoms
                      </p>
                      <ul className="space-y-2">
                        {symptom.signs.map((sign, signIndex) => (
                          <li
                            key={signIndex}
                            className="flex items-start gap-2 text-sm text-charcoal-600"
                          >
                            <Check className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{sign}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-16 p-8 bg-white border border-purple-100 rounded-3xl shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h4 className="text-xl font-display font-bold text-charcoal-900 mb-2">Unsure which one you are?</h4>
                <p className="text-charcoal-600">Take our 2-minute diagnostic quiz to find out.</p>
              </div>
              <Button
                variant="uplift"
                asChild
                className="flex-shrink-0"
              >
                <Link href="/auth/register?quiz=bbd">
                  Take Free BBD Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Tools Section */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sun-100 text-sun-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" />
              Advanced Tools
            </div>
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Strategic Frameworks
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Mid-career transitions require more than just a resume update. Our proprietary tools help you evaluate complex trade-offs and design sustainable moves.
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
                  <div className="h-full p-8 rounded-3xl bg-cream-50 hover:bg-white border border-transparent hover:border-sun-200 hover:shadow-xl hover:shadow-sun-500/5 transition-all duration-300">
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
      <section className="section-charcoal section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>

        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-display text-white mb-6">
              The Protocol For <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sun-400">Mastery</span>
            </h2>
            <p className="text-body-lg text-charcoal-200">
              A rigorous, executive-level process designed to dismantle blockers and systematically build your ideal career state.
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
                  <div className="absolute left-10 top-20 bottom-0 w-px bg-white/10 hidden md:block group-hover:bg-sun-500/50 transition-colors"></div>
                )}

                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shadow-lg transition-transform group-hover:scale-110 ${phase.tier === 'guidance' ? 'bg-charcoal-700 text-white border border-white/20' :
                    phase.tier === 'planning' ? 'bg-purple-600 text-white border border-purple-400' :
                      'bg-sun-500 text-charcoal-900 border border-sun-300'
                    }`}>
                    {phase.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-display font-bold text-white">
                      {phase.title}
                    </h3>
                    <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${phase.tier === 'guidance' ? 'bg-white/10 text-charcoal-200' :
                      phase.tier === 'planning' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/30' :
                        'bg-sun-500/20 text-sun-300 border border-sun-500/30'
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
                        <div className="w-1 h-1 rounded-full bg-charcoal-500"></div>
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
      <section id="packages" className="relative py-24 bg-cream-50 overflow-hidden">
        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Invest In Your Transformation
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Select the depth of support that matches your ambition.
              The cost of inaction is far greater than the investment in clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.tier}
                className={`relative border-0 overflow-hidden flex flex-col h-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ${pkg.popular
                  ? "ring-4 ring-purple-500/30 scale-105 z-10"
                  : ""
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 to-purple-700" />
                )}

                <CardHeader className="text-center pb-8 pt-10">
                  {pkg.popular && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      Best Value
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
                        <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-charcoal-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-8 pb-10 px-8">
                  <Button
                    className={`w-full h-12 text-base font-bold rounded-xl transition-all ${pkg.popular
                      ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30"
                      : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                      }`}
                    asChild
                  >
                    <Link href={`/auth/register?program=mid-career&tier=${pkg.tier}`}>
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
      <section className="relative py-24 bg-charcoal-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="h-3 w-3 text-sun-400 fill-sun-400" />
              Reviews
            </div>
            <h2 className="text-display text-white mb-6">
              Redefined Careers
            </h2>
            <p className="text-body-lg text-charcoal-200">
              Hear from professionals who refused to settle for boredom or burnout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-xl hover:bg-white/10 transition-all duration-300"
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
                  <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wide text-charcoal-300">
                    Was: {testimonial.previousRole.replace('Was: ', '')}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-charcoal-100 italic mb-8 min-h-[120px]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-12 h-12 rounded-full bg-charcoal-700 flex items-center justify-center font-bold text-white text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-bold text-white">{testimonial.name}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
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
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-6 data-[state=open]:bg-cream-50 data-[state=open]:border-charcoal-200 transition-colors">
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
          <div className="rounded-[2.5rem] bg-charcoal-900 p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sun-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-display text-white">
                Stop Settling For <br /> &quot;Good Enough&quot;
              </h2>
              <p className="text-xl text-charcoal-200">
                Your best years are ahead of you. Design a career that challenges, fulfills, and rewards you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="xl"
                  className="bg-white text-charcoal-900 hover:bg-cream-50 font-bold"
                  asChild
                >
                  <Link href="/auth/register?program=mid-career">
                    Design Your Future
                    <ArrowRight className="ml-2 h-5 w-5" />
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
