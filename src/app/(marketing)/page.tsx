import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArrowRight,
  Compass,
  Target,
  Heart,
  Users,
  Star,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Award,
  Brain,
  Lightbulb,
} from "lucide-react"

const segments = [
  {
    title: "Early Career",
    age: "22-30 years",
    tagline: "Develop Advantage",
    description: "Navigate your first career transitions with clarity and purpose.",
    color: "bg-purple-600",
    href: "/programs/early-career",
  },
  {
    title: "Mid-Career",
    age: "30-45 years",
    tagline: "Destination Mastery",
    description: "Overcome BBD syndrome and find renewed purpose in your work.",
    color: "bg-forest-800",
    href: "/programs/mid-career",
  },
  {
    title: "Senior",
    age: "45+ years",
    tagline: "Design Legacy",
    description: "Craft your second innings and create lasting impact.",
    color: "bg-gold-500",
    href: "/programs/senior",
  },
  {
    title: "Returning Women",
    age: "Career Re-entry",
    tagline: "Reclaim Confidence",
    description: "Re-enter the workforce with confidence and relevant skills.",
    color: "bg-purple-500",
    href: "/programs/returning-women",
  },
]

const trustSignals = [
  { value: "18+", label: "Years of Excellence" },
  { value: "100K+", label: "Professionals Mentored" },
  { value: "91%", label: "Clarity Achievement Rate" },
  { value: "4.9/5", label: "Client Satisfaction" },
]

const coreBeliefs = [
  {
    icon: Heart,
    title: "Career = Life",
    description:
      "Your career isn't separate from your life—it's the vehicle through which you express your gifts to the world.",
  },
  {
    icon: Compass,
    title: "Clarity Before Action",
    description:
      "We believe in thorough self-discovery before making any career decisions. Understanding precedes transformation.",
  },
  {
    icon: Target,
    title: "Evidence-Based Approach",
    description:
      "Our CLIQI diagnostic and proprietary assessments provide measurable insights, not generic advice.",
  },
  {
    icon: Users,
    title: "Mentorship Over Advice",
    description:
      "Our mentors walk alongside you through your journey—they don't just point you in a direction.",
  },
]

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "Deep self-assessment to understand your unique patterns",
  },
  {
    number: "02",
    title: "Diagnosis",
    description: "Evidence-based analysis using CLIQI framework",
  },
  {
    number: "03",
    title: "Design",
    description: "Create your personalized career roadmap",
  },
  {
    number: "04",
    title: "Development",
    description: "Build skills and fill capability gaps",
  },
  {
    number: "05",
    title: "Direction",
    description: "Execute your plan with mentor guidance",
  },
  {
    number: "06",
    title: "Destination",
    description: "Achieve your career transformation goals",
  },
]

const testimonials = [
  {
    quote:
      "Dheya helped me overcome my BBD syndrome and find genuine joy in my work again. The assessments revealed patterns I'd been blind to for years.",
    name: "Priya Sharma",
    role: "VP, Technology",
    segment: "Mid-Career",
  },
  {
    quote:
      "After 10 years as a homemaker, I was terrified to re-enter the workforce. My mentor didn't just guide me—she believed in me when I couldn't.",
    name: "Anita Mehta",
    role: "Product Manager",
    segment: "Returning Women",
  },
  {
    quote:
      "At 50, I thought my best years were behind me. Dheya showed me how to design a second innings that truly matters.",
    name: "Rajesh Kumar",
    role: "Executive Coach",
    segment: "Senior",
  },
]

const faqs = [
  {
    question: "How is Dheya different from other career coaching services?",
    answer:
      "Dheya uses a research-backed 7D methodology with proprietary assessments like CLIQI and BBD diagnostics. We don't offer generic advice—we provide evidence-based insights specific to your life stage and challenges, delivered through long-term mentorship rather than one-off consultations.",
  },
  {
    question: "What is the BBD Syndrome Assessment?",
    answer:
      "BBD (Bored, Burned out, Disillusioned) Syndrome affects many mid-career professionals. Our assessment diagnoses the specific patterns affecting you and provides targeted interventions, not generic wellness tips.",
  },
  {
    question: "How long does the mentoring program typically last?",
    answer:
      "Our comprehensive programs span 6-12 months, because meaningful career transformation requires time. Each phase builds on the previous, ensuring sustainable change rather than quick fixes that don't last.",
  },
  {
    question: "Can I choose my own mentor?",
    answer:
      "Yes! After your initial assessment, we match you with mentors who specialize in your segment and challenges. You can meet potential mentors before committing to ensure the right fit.",
  },
  {
    question: "What if I'm not sure which program is right for me?",
    answer:
      "Book a free discovery call. We'll help you understand which segment and package best fits your situation, with no pressure to commit.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Uplift Style */}
      <section className="relative bg-cream-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm text-purple-700">
                <Sparkles className="h-4 w-4" />
                <span>India&apos;s #1 Career Mentoring Platform</span>
              </div>
              <h1 className="heading-display text-forest-800">
                WE MENTOR
                <br />
                <span className="text-purple-600">CAREERS</span>
              </h1>
              <p className="text-body text-muted-foreground max-w-lg">
                From confusion to clarity. From stuck to unstoppable. Join
                100,000+ professionals who transformed their careers with
                Dheya&apos;s evidence-based mentoring approach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  <Link href="/auth/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/programs">Explore Programs</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/50 to-cream-200/50 rounded-3xl" />
              <div className="relative bg-forest-800 text-cream-100 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-6xl font-bold mb-4">91%</div>
                <div className="text-xl font-medium mb-2">
                  Career Clarity Achieved
                </div>
                <div className="text-cream-200 text-sm">
                  Our mentees report significant improvement in career direction
                  and satisfaction within 6 months.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Bar */}
      <section className="bg-forest-800 py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {trustSignals.map((signal) => (
              <div key={signal.label}>
                <div className="text-3xl md:text-4xl font-bold text-gold-400">
                  {signal.value}
                </div>
                <div className="text-sm text-cream-200 mt-1">{signal.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segment Selector */}
      <section className="bg-cream-200 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-forest-800 mb-4">
              Where Are You in Your Career?
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Choose your path. Each program is designed for the unique
              challenges and opportunities of your career stage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {segments.map((segment) => (
              <Card
                key={segment.title}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 ${segment.color}`} />
                <CardContent className="pt-8 pb-6">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    {segment.age}
                  </div>
                  <h3 className="text-xl font-bold text-forest-800 mb-1">
                    {segment.title}
                  </h3>
                  <div className="text-sm font-medium text-purple-600 mb-3">
                    {segment.tagline}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {segment.description}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="group-hover:bg-cream-200 w-full"
                  >
                    <Link href={segment.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Beliefs - Dark Section */}
      <section className="bg-forest-800 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-cream-100 mb-4">
              What We Believe
            </h2>
            <p className="text-body text-cream-200 max-w-2xl mx-auto">
              Our philosophy shapes everything we do—from how we assess you to
              how we mentor you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreBeliefs.map((belief) => {
              const Icon = belief.icon
              return (
                <div key={belief.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-cream-100 mb-2">
                    {belief.title}
                  </h3>
                  <p className="text-sm text-cream-200">{belief.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7D Process Overview */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-forest-800 mb-4">
              The 7D Methodology
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Our proven 6-phase journey takes you from where you are to where
              you want to be—with evidence-based guidance at every step.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-5xl font-bold text-purple-100 absolute top-4 right-4">
                  {step.number}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    {index === 0 && <Compass className="h-6 w-6 text-purple-600" />}
                    {index === 1 && <Brain className="h-6 w-6 text-purple-600" />}
                    {index === 2 && <Lightbulb className="h-6 w-6 text-purple-600" />}
                    {index === 3 && <TrendingUp className="h-6 w-6 text-purple-600" />}
                    {index === 4 && <Target className="h-6 w-6 text-purple-600" />}
                    {index === 5 && <Award className="h-6 w-6 text-purple-600" />}
                  </div>
                  <h3 className="text-lg font-bold text-forest-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-purple-600 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-white mb-4">
              Success Stories
            </h2>
            <p className="text-body text-purple-100 max-w-2xl mx-auto">
              Real transformations from real professionals across career stages.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-gold-400 text-gold-400"
                      />
                    ))}
                  </div>
                  <p className="text-white mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-purple-200">
                        {testimonial.role} • {testimonial.segment}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-cream-200 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-forest-800 mb-4">
              Common Questions
            </h2>
            <p className="text-body text-muted-foreground">
              Everything you need to know before starting your journey.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white mb-3 rounded-lg px-6 border-0 shadow-sm"
              >
                <AccordionTrigger className="text-left font-medium text-forest-800 hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-forest-800 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="heading-section text-cream-100 mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-body text-cream-200 max-w-2xl mx-auto mb-8">
            Book a free discovery call to understand which program is right for
            you. No pressure, just clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream-100 text-cream-100 hover:bg-cream-100 hover:text-forest-800"
            >
              <Link href="/contact">Book Discovery Call</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 text-cream-200 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Free 30-min consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No commitment required</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
