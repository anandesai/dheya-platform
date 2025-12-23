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
  Crown,
  Check,
  ArrowRight,
  Sparkles,
  Gem,
  Briefcase,
  Building2,
  Users,
  Clock,
  Award,
  Star,
  ChevronRight,
  Lightbulb,
  TreePine,
  GraduationCap,
  HandHeart,
  Coins,
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
    price: 45000,
    originalPrice: 55000,
    sessions: 6,
    duration: "8 weeks",
    mentorLevel: "Senior Expert (L2)",
    phases: "1-2",
    features: [
      "6 one-on-one mentor sessions",
      "Wisdom Assets Portfolio",
      "Legacy Vision Canvas",
      "Financial Freedom Calculator",
      "2 Core Legacy Workbooks",
      "Email support",
      "Bi-weekly progress check-ins",
      "Senior network introductions",
    ],
    notIncluded: [
      "Board positioning support",
      "Platform building",
      "Ongoing mentorship",
    ],
  },
  {
    tier: "planning",
    name: "Planning",
    tagline: "Complete transformation",
    price: 85000,
    originalPrice: 100000,
    sessions: 12,
    duration: "16 weeks",
    mentorLevel: "Master Mentor (L3)",
    phases: "1-5",
    popular: true,
    features: [
      "12 one-on-one mentor sessions",
      "Full Assessment Suite",
      "All Legacy Workbooks",
      "Second Innings Strategy Map",
      "Board Positioning Toolkit",
      "Executive Profile Enhancement",
      "Strategic Network Building",
      "Speaking/Writing Support",
      "Weekly progress reports",
      "Priority support",
      "VIP network access",
    ],
    notIncluded: ["Extended executive partnership"],
  },
  {
    tier: "mentorship",
    name: "Mentorship",
    tagline: "Legacy partnership",
    price: 150000,
    originalPrice: 180000,
    sessions: 24,
    duration: "12 months",
    mentorLevel: "C-Suite Mentor (L4)",
    phases: "1-6",
    features: [
      "24 one-on-one mentor sessions",
      "Full Assessment Suite + AI Insights",
      "All Workbooks + Premium Content",
      "C-Suite Mentor Partnership",
      "Board Search Support",
      "Book/Thought Leadership Development",
      "Institution Building Guidance",
      "Family Wealth Transition Planning",
      "Bi-weekly executive sessions",
      "24/7 priority support",
      "Exclusive CXO network access",
      "24-month post-program support",
      "Annual legacy review sessions",
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
      {/* Hero Section */}
      <section className="section-cream section-padding">
        <div className="container-uplift">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="font-display bg-gold-100 text-gold-800 hover:bg-gold-100">
                  <Crown className="h-3 w-3 mr-1" />
                  SENIOR PROFESSIONALS (45+)
                </Badge>
              </div>
              <h1 className="text-display text-charcoal-900">
                DESIGN{" "}
                <span className="text-gold-600">LEGACY</span>
              </h1>
              <p className="text-lg md:text-xl font-body text-charcoal-600 max-w-xl">
                Transform your wealth of experience into lasting impact. Design
                your second innings with purpose - whether in corporate advisory,
                consulting, entrepreneurship, or giving back.
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
                  <Clock className="h-4 w-4 text-gold-600" />
                  <span>8 weeks to 12 months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold-600" />
                  <span>C-Suite Mentoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gold-600" />
                  <span>18+ Years Experience</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gold-200 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-4 bg-gold-300 rounded-full opacity-20" />
                <div className="absolute inset-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Crown className="h-16 w-16 text-gold-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-charcoal-900">
                      15,000+
                    </p>
                    <p className="text-micro text-charcoal-600">
                      Legacies designed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Paths Section */}
      <section className="section-charcoal section-padding text-cream-100">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-gold-400 text-charcoal-900 hover:bg-gold-400">
              <Sparkles className="h-3 w-3 mr-1" />
              SECOND INNINGS
            </Badge>
            <h2 className="heading-section text-cream-100 mb-4">
              Your Experience Opens Many Doors
            </h2>
            <p className="font-body text-cream-200">
              After decades of building expertise, you have multiple paths for
              a fulfilling second innings. Explore what resonates with you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {legacyPaths.map((path, index) => {
              const Icon = path.icon
              return (
                <Card
                  key={index}
                  variant="dark"
                  hover="lift"
                >
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-gold-400 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-charcoal-900" />
                    </div>
                    <CardTitle className="heading-card text-cream-100">
                      {path.name}
                    </CardTitle>
                    <CardDescription className="font-body text-cream-300">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-micro font-display text-cream-400 uppercase tracking-wider mb-2">
                      Opportunities
                    </p>
                    <ul className="space-y-1">
                      {path.opportunities.map((opp, oppIndex) => (
                        <li
                          key={oppIndex}
                          className="flex items-center gap-2 text-sm font-body text-cream-200"
                        >
                          <Check className="h-3 w-3 text-gold-400 flex-shrink-0" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
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
            <Badge className="font-display mb-4 bg-gold-100 text-gold-800">
              <Gem className="h-3 w-3 mr-1" />
              LEGACY TOOLS
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Frameworks Designed for Senior Leaders
            </h2>
            <p className="font-body text-charcoal-600">
              Our assessment tools are specifically crafted to help experienced
              professionals leverage their unique advantages for impactful second
              innings.
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
                      <div className="p-2 rounded-lg bg-gold-100 group-hover:bg-gold-200 transition-colors">
                        <Icon className="h-5 w-5 text-gold-700" />
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
      <section className="bg-white section-padding">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="font-display mb-4 bg-charcoal-100 text-charcoal-700">
              THE JOURNEY
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Your 6-Phase Legacy Design
            </h2>
            <p className="font-body text-charcoal-600">
              A thoughtful process to design a second innings that honors your
              experience and creates lasting impact.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className={`flex gap-4 p-6 rounded-lg border-2 ${
                  phase.tier === "guidance"
                    ? "bg-gold-50 border-gold-200"
                    : phase.tier === "planning"
                      ? "bg-charcoal-50 border-charcoal-200"
                      : "bg-purple-50 border-purple-200"
                }`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      phase.tier === "guidance"
                        ? "bg-gold-400 text-charcoal-900"
                        : phase.tier === "planning"
                          ? "bg-charcoal-700 text-cream-100"
                          : "bg-purple-600 text-white"
                    }`}
                  >
                    {phase.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="heading-card text-charcoal-900">
                      {phase.title}
                    </h3>
                    <Badge
                      className={`font-display ${
                        phase.tier === "guidance"
                          ? "bg-gold-400 text-charcoal-900"
                          : phase.tier === "planning"
                            ? "bg-charcoal-700 text-cream-100"
                            : "bg-purple-600 text-white"
                      }`}
                    >
                      {phase.tier === "guidance"
                        ? "GUIDANCE+"
                        : phase.tier === "planning"
                          ? "PLANNING+"
                          : "MENTORSHIP"}
                    </Badge>
                    <span className="text-micro text-charcoal-500">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="font-body text-charcoal-600 text-sm mb-3">
                    {phase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex}
                        className="text-micro font-body bg-white px-2 py-1 rounded border"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                {index < phases.length - 1 && (
                  <ChevronRight className="hidden md:block h-6 w-6 text-charcoal-500 self-center" />
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
            <Badge className="font-display mb-4 bg-gold-100 text-gold-800">
              CHOOSE YOUR PATH
            </Badge>
            <h2 className="heading-section text-charcoal-900 mb-4">
              Investment in Your Legacy
            </h2>
            <p className="font-body text-charcoal-600">
              Select the partnership level that matches your ambitions. All
              packages include access to our exclusive senior professional
              network.
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
                    ? "border-2 border-gold-500 shadow-lg"
                    : "border-2"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="font-display bg-gold-500 text-white">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <Badge
                    variant="outline"
                    className={`font-display w-fit mx-auto mb-2 ${
                      pkg.popular ? "border-gold-300 text-gold-700" : ""
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
                        pkg.popular ? "text-gold-600" : "text-charcoal-900"
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
                    <p className="text-micro font-display text-charcoal-500 uppercase tracking-wider mb-2">
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
                      <p className="text-micro font-body text-charcoal-600 mb-2">
                        Not included:
                      </p>
                      <ul className="space-y-1">
                        {pkg.notIncluded.map((item, index) => (
                          <li
                            key={index}
                            className="text-micro font-body text-charcoal-600 line-through"
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
                    size="lg"
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
                    <Link href={`/auth/register?program=senior&tier=${pkg.tier}`}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-micro font-body text-charcoal-600 mt-8">
            All prices are inclusive of GST. EMI options available.
            <br />
            100% satisfaction guarantee or full refund after first 2 sessions.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gold-500 text-charcoal-900">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-section mb-4">
              Success Stories from Senior Leaders
            </h2>
            <p className="font-body text-charcoal-700">
              Join the community of leaders who&apos;ve designed impactful
              second innings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                variant="light"
                hover="lift"
                className="bg-white/90 backdrop-blur-sm border-gold-200"
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-gold-500 text-gold-500"
                      />
                    ))}
                  </div>
                  <Badge className="font-display w-fit bg-charcoal-100 text-charcoal-700 text-micro">
                    {testimonial.previousRole}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-body text-charcoal-800 italic mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center">
                      <span className="text-sm font-bold text-charcoal-900">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-charcoal-900">
                        {testimonial.name}
                      </p>
                      <p className="text-micro text-charcoal-600">
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
                  <AccordionTrigger className="font-body text-left text-charcoal-900 hover:text-gold-600">
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
      <section className="section-purple section-padding text-cream-100">
        <div className="container-uplift">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-section text-cream-100 mb-4">
              Ready to Design Your Legacy?
            </h2>
            <p className="font-body text-cream-200 text-lg mb-8">
              Your experience is your greatest asset. Let&apos;s turn it into
              lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="uplift"
                asChild
              >
                <Link href="/auth/register?program=senior">
                  Start Your Journey
                  <Crown className="ml-2 h-4 w-4" />
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
