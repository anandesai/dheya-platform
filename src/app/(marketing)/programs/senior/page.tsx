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
  Crown,
  Check,
  ArrowRight,
  Sparkles,
  Gem,
  Briefcase,
  Building2,
  Star,
  Lightbulb,
  TreePine,
  GraduationCap,
  HandHeart,
  Coins,
  Heart,
  Compass,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const legacyPaths = [
  {
    name: "Corporate Advisory",
    icon: Building2,
    description:
      "Leverage your expertise as a board member, advisor, or consultant to growing companies",
    opportunities: [
      "Independent Director roles",
      "Advisory board positions",
      "Strategic consulting",
      "Industry mentorship",
    ],
  },
  {
    name: "Entrepreneurship",
    icon: Lightbulb,
    description:
      "Transform your experience into a business venture - consulting firm, startup, or portfolio career",
    opportunities: [
      "Consulting practice",
      "Industry-specific startup",
      "Franchise ownership",
      "Portfolio career",
    ],
  },
  {
    name: "Social Impact",
    icon: HandHeart,
    description:
      "Channel your wisdom into giving back through teaching, nonprofits, or social enterprises",
    opportunities: [
      "NGO leadership",
      "Academic teaching",
      "Social entrepreneurship",
      "Philanthropic strategy",
    ],
  },
  {
    name: "Legacy Building",
    icon: TreePine,
    description:
      "Create lasting impact through writing, thought leadership, or building institutions",
    opportunities: [
      "Book authorship",
      "Thought leadership",
      "Institution building",
      "Knowledge documentation",
    ],
  },
]

const assessmentTools = [
  {
    name: "Wisdom Assets Portfolio",
    description:
      "Inventory your accumulated knowledge, relationships, and experiences that form your unique legacy capital.",
    icon: Gem,
    phase: 1,
  },
  {
    name: "Legacy Vision Canvas",
    description:
      "Design your ideal legacy across multiple dimensions: professional, personal, family, and societal.",
    icon: Crown,
    phase: 1,
  },
  {
    name: "Financial Freedom Calculator",
    description:
      "Map your financial runway and understand what level of income you need in your second innings.",
    icon: Coins,
    phase: 2,
  },
  {
    name: "Second Innings Strategy Map",
    description:
      "Explore and evaluate multiple paths for your next chapter with structured decision frameworks.",
    icon: Briefcase,
    phase: 3,
  },
  {
    name: "Board Positioning Toolkit",
    description:
      "Prepare for board and advisory roles with governance training and positioning strategies.",
    icon: Building2,
    phase: 4,
  },
  {
    name: "Knowledge Transfer Framework",
    description:
      "Structure your expertise for teaching, writing, or mentoring the next generation.",
    icon: GraduationCap,
    phase: 5,
  },
]

const phases = [
  {
    number: 1,
    name: "Reflection",
    title: "Harvest Your Wisdom",
    description:
      "Take stock of your accomplishments, relationships, and accumulated wisdom. Define what legacy means to you.",
    tools: ["Wisdom Assets Portfolio", "Legacy Vision Canvas", "Life Review"],
    duration: "2 weeks",
    tier: "guidance",
  },
  {
    number: 2,
    name: "Assessment",
    title: "Understand Your Options",
    description:
      "Evaluate your financial position, energy levels, and life priorities to understand your runway and constraints.",
    tools: ["Financial Freedom Calculator", "Energy Audit", "Priority Mapping"],
    duration: "3 weeks",
    tier: "guidance",
  },
  {
    number: 3,
    name: "Exploration",
    title: "Map Your Possibilities",
    description:
      "Explore multiple second innings paths: corporate advisory, entrepreneurship, social impact, or creative pursuits.",
    tools: ["Second Innings Strategy", "Opportunity Mapping", "Stakeholder Analysis"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 4,
    name: "Strategy",
    title: "Design Your Path",
    description:
      "Create a detailed roadmap for your chosen direction with positioning, network building, and timeline.",
    tools: ["Board Positioning", "Personal Branding", "Transition Plan"],
    duration: "3 weeks",
    tier: "planning",
  },
  {
    number: 5,
    name: "Action",
    title: "Build Your Platform",
    description:
      "Execute your strategy with expert guidance - from board applications to consulting launches to book proposals.",
    tools: ["Knowledge Transfer", "Platform Building", "Network Activation"],
    duration: "4 weeks",
    tier: "planning",
  },
  {
    number: 6,
    name: "Legacy",
    title: "Sustain Your Impact",
    description:
      "Continue your growth with ongoing mentorship, course corrections, and celebration of achievements.",
    tools: ["Impact Tracking", "Legacy Reviews", "Continuous Growth"],
    duration: "Ongoing",
    tier: "mentorship",
  },
]

const packages = [
  {
    tier: "guidance",
    name: "Guidance",
    tagline: "Reflect & clarify",
    price: 11999,
    originalPrice: 15999,
    sessions: 2,
    duration: "2-3 weeks",
    mentorLevel: "Principal Career Mentor",
    phases: "1-2",
    features: [
      "6 one-on-one mentor sessions",
      "Life Realignment Assessment",
      "Expertise inventory",
      "Second innings options exploration",
      "Legacy Vision Canvas",
      "Financial Freedom Calculator",
      "Email support",
      "Bi-weekly progress check-ins",
    ],
    notIncluded: [
      "Consulting practice setup",
      "Board positioning",
      "Platform building",
      "Ongoing mentorship",
    ],
  },
  {
    tier: "planning",
    name: "Planning",
    tagline: "Complete transformation",
    price: 27999,
    originalPrice: 35999,
    sessions: "4-5",
    duration: "6 weeks",
    mentorLevel: "Executive Career Mentor",
    phases: "1-5",
    popular: true,
    features: [
      "12 one-on-one mentor sessions",
      "Second Innings Plan",
      "Consulting practice setup",
      "Board positioning",
      "Knowledge documentation",
      "Full Assessment Suite",
      "Executive Profile Enhancement",
      "Strategic Network Building",
      "Weekly progress reports",
      "Priority support",
    ],
    notIncluded: ["Extended executive partnership"],
  },
  {
    tier: "mentorship",
    name: "Mentorship",
    tagline: "Legacy partnership",
    price: 64999,
    originalPrice: 84999,
    sessions: "12-18",
    duration: "12 months",
    mentorLevel: "C-Suite Career Mentor",
    phases: "1-6",
    features: [
      "24 one-on-one mentor sessions",
      "Legacy project development",
      "Book/memoir facilitation",
      "Mentorship practice establishment",
      "Full Assessment Suite + AI Insights",
      "Board Search Support",
      "Family Wealth Transition Planning",
      "Bi-weekly executive sessions",
      "24/7 priority support",
      "Exclusive CXO network access",
    ],
    notIncluded: [],
  },
]

const testimonials = [
  {
    name: "Suresh Venkatraman",
    role: "Now: Board Director, 3 Listed Companies",
    previousRole: "Was: CEO, Fortune 500 India",
    image: "/testimonials/suresh.jpg",
    quote:
      "After 30 years in corporate leadership, I didn't know what came next. Dheya helped me see that my experience was valuable in a different way. Today I serve on three boards and finally have the balance I craved.",
    rating: 5,
  },
  {
    name: "Kavitha Ranganathan",
    role: "Now: Founder, Executive Coaching Firm",
    previousRole: "Was: CHRO, Tata Group Company",
    image: "/testimonials/kavitha.jpg",
    quote:
      "The Wisdom Assets exercise was transformative. I realized my decades of HR leadership could become a thriving consulting business. Within a year, I had 8 executive clients and complete schedule freedom.",
    rating: 5,
  },
  {
    name: "Prakash Menon",
    role: "Now: Author & Academic",
    previousRole: "Was: CFO, Multinational Corporation",
    image: "/testimonials/prakash.jpg",
    quote:
      "I always wanted to give back through teaching. The Design Legacy program helped me transition from CFO to visiting faculty at a top B-school. I also published my first book on corporate finance.",
    rating: 5,
  },
]

const faqs = [
  {
    question: "I'm not ready to retire. Is this program for me?",
    answer:
      "Absolutely! Design Legacy is not about retirement - it's about designing a meaningful second innings that could include advisory roles, consulting, entrepreneurship, or portfolio careers. Many participants continue working in new, more fulfilling ways.",
  },
  {
    question: "What's the typical profile of participants?",
    answer:
      "Our participants are typically senior professionals with 20+ years of experience, often at CXO or senior executive levels. They've achieved success but are looking for deeper meaning, more flexibility, or new challenges in their next chapter.",
  },
  {
    question: "How do you help with board positions?",
    answer:
      "Our Mentorship tier includes comprehensive board positioning support: governance training, board resume development, network introductions to board search firms, and guidance through the selection process. Many of our mentors are themselves experienced board directors.",
  },
  {
    question: "Can this program help me start a consulting practice?",
    answer:
      "Yes! Many of our participants transition into consulting or advisory roles. We help you package your expertise, develop your positioning, create your practice model, and build your initial client base through our extensive network.",
  },
  {
    question: "What if I want to give back through social impact work?",
    answer:
      "We fully support social impact transitions. Whether it's NGO board positions, founding a social enterprise, or transitioning to academia, we help you find meaningful ways to contribute while maintaining your lifestyle.",
  },
  {
    question: "Is my spouse/family involved in the process?",
    answer:
      "Our Mentorship tier includes a family alignment session because major life transitions affect everyone. We help you navigate conversations about financial changes, time allocation, and shared goals with your partner.",
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function SeniorPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Legacy & Wisdom (Gold/Charcoal) */}
      <section className="relative overflow-hidden bg-charcoal-950 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sun-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container-uplift relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sun-500/10 border border-sun-500/20 text-sun-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <Gem className="h-3 w-3" />
                Senior Professionals (45+)
              </div>
              <h1 className="text-display text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Design Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sun-400 to-amber-200">Living Legacy</span>
              </h1>
              <p className="text-xl text-charcoal-300 max-w-xl leading-relaxed">
                Your experience is your greatest asset. Transition from success to significance, and architect a &quot;Second Innings&quot; that defines your impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="xl"
                  className="bg-sun-500 text-charcoal-950 hover:bg-sun-400 font-bold shadow-xl shadow-sun-500/20"
                  asChild
                >
                  <Link href="#packages">
                    View Programs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Link href="/contact">Book Advisor Call</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-display font-bold text-white">100+</div>
                  <div className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mt-1">CXOs Mentored</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-white">20y+</div>
                  <div className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mt-1">Avg Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-white">4.9/5</div>
                  <div className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mt-1">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg">
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-sun-800/20 to-charcoal-800 rounded-[2.5rem] transform rotate-6 scale-95 opacity-80 border border-white/5"></div>
                <div className="absolute inset-0 bg-charcoal-900/80 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10"></div>
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
                    <Gem className="h-24 w-24 text-sun-500 mb-6 drop-shadow-[0_0_25px_rgba(250,204,21,0.2)]" />
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Legacy Architect</h3>
                    <p className="text-charcoal-400 font-medium">For leaders ready to define their next chapter.</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-6 top-1/4 bg-charcoal-900/90 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl animate-float-slow max-w-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sun-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                      <Briefcase className="w-4 h-4 text-sun-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Portfolio Career</div>
                      <div className="text-xs text-charcoal-400 mt-1">Board roles, consulting, & more.</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-charcoal-900/90 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl animate-float-delayed max-w-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                      <Heart className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Social Impact</div>
                      <div className="text-xs text-charcoal-400 mt-1">Give back with purpose.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Innings Section - Sophisticated */}
      <section className="section-padding bg-cream-50">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-100 text-charcoal-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Compass className="h-3 w-3" />
              The Next Chapter
            </div>
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Your <span className="text-sun-600">Second Innings</span> Options
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Retirement is an outdated concept. Today&apos;s leaders are curating a portfolio of high-impact engagements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {legacyPaths.map((option, index) => {
              const Icon = option.icon
              return (
                <Card
                  key={index}
                  className="group relative border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sun-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="text-center pt-10 pb-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-charcoal-50 group-hover:bg-sun-50 flex items-center justify-center mb-6 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-charcoal-600 group-hover:text-sun-600 transition-colors" />
                    </div>
                    <CardTitle className="text-2xl font-display font-bold text-charcoal-900 mb-3">
                      {option.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-10 px-8">
                    <p className="text-charcoal-600 leading-relaxed mb-6">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Assessment Tools Section */}
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sun-100 text-sun-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" />
              Executive Tools
            </div>
            <h2 className="text-display sm:text-5xl text-charcoal-900 mb-6">
              Legacy Frameworks
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Sophisticated tools to map your vast experience, values, and network into a cohesive strategy for your next phase.
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
              The Path To <span className="text-transparent bg-clip-text bg-gradient-to-r from-sun-400 to-amber-300">Significance</span>
            </h2>
            <p className="text-body-lg text-charcoal-300">
              A dignified, comprehensive process to architect your legacy and define your contribution.
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
                    phase.tier === 'planning' ? 'bg-purple-900 text-white border border-purple-700' :
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
                      phase.tier === 'planning' ? 'bg-purple-500/10 text-purple-200 border border-purple-500/20' :
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
                        <div className="w-1 h-1 rounded-full bg-sun-500/50"></div>
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
              Invest In Your Legacy
            </h2>
            <p className="text-body-lg text-charcoal-600">
              Select the level of strategic partnership you require.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.tier}
                className={`relative border-0 overflow-hidden flex flex-col h-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ${pkg.popular
                  ? "ring-4 ring-sun-500/30 scale-105 z-10"
                  : ""
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-sun-400 to-amber-500" />
                )}

                <CardHeader className="text-center pb-8 pt-10">
                  {pkg.popular && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-sun-100 text-sun-700 px-2 py-1 rounded">
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
                        <Check className="h-5 w-5 flex-shrink-0 text-sun-600" />
                        <span className="text-charcoal-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-8 pb-10 px-8">
                  <Button
                    className={`w-full h-12 text-base font-bold rounded-xl transition-all ${pkg.popular
                      ? "bg-sun-500 text-charcoal-900 hover:bg-sun-400 shadow-lg shadow-sun-500/30"
                      : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                      }`}
                    asChild
                  >
                    <Link href={`/auth/register?program=senior&tier=${pkg.tier}`}>
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
      <section className="relative py-24 bg-charcoal-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="container-uplift relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="h-3 w-3 text-sun-400 fill-sun-400" />
              Peer Reviews
            </div>
            <h2 className="text-display text-white mb-6">
              Voices of Experience
            </h2>
            <p className="text-body-lg text-charcoal-300">
              Hear from other senior leaders who have successfully navigated their transition.
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
                    Next: {testimonial.role.replace('Now: ', '')}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-charcoal-100 italic mb-8 min-h-[120px]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-12 h-12 rounded-full bg-sun-600 flex items-center justify-center font-bold text-charcoal-900 text-xl">
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
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-6 data-[state=open]:bg-cream-50 data-[state=open]:border-sun-200 transition-colors">
                  <AccordionTrigger className="text-left font-display font-medium text-lg text-charcoal-900 hover:text-sun-600 py-6">
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
          <div className="rounded-[2.5rem] bg-charcoal-950 p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sun-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-display text-white">
                Ready To Define <br /> Your Legacy?
              </h2>
              <p className="text-xl text-charcoal-300">
                Your wisdom is needed. Structure your next inning for maximum impact and fulfillment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="xl"
                  className="bg-sun-500 text-charcoal-950 hover:bg-sun-400 font-bold"
                  asChild
                >
                  <Link href="/auth/register?program=senior">
                    Start Your Legacy Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
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
