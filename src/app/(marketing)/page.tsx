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
    tagline: "The Unfair Advantage",
    description: "Stop playing career roulette. Build the clarity your peers lack—and watch opportunities find you.",
    color: "bg-purple-600",
    href: "/programs/early-career",
  },
  {
    title: "Mid-Career",
    age: "30-45 years",
    tagline: "Escape The Trap",
    description: "Bored. Burned out. Disillusioned. Sound familiar? There's a way out—and it starts with one conversation.",
    color: "bg-charcoal-800",
    href: "/programs/mid-career",
  },
  {
    title: "Senior Leaders",
    age: "45+ years",
    tagline: "Your Second Act",
    description: "Retirement is a myth. Your best work? It's still ahead. Design the legacy you'll be proud of.",
    color: "bg-sage-600",
    href: "/programs/senior",
  },
  {
    title: "Returning Women",
    age: "Career Re-entry",
    tagline: "The Comeback",
    description: "Your gap isn't a weakness—it's proof of resilience. The corporate world needs exactly what you bring.",
    color: "bg-purple-500",
    href: "/programs/returning-women",
  },
]

const trustSignals = [
  { value: "18+", label: "Years Transforming Careers" },
  { value: "100K+", label: "Lives Changed Forever" },
  { value: "91%", label: "Achieve Career Clarity" },
  { value: "4.9★", label: "From Happy Mentees" },
]

const coreBeliefs = [
  {
    icon: Heart,
    title: "Career Is Life",
    description:
      "8 hours a day. 40+ years of work. This isn't a footnote—it's the story of your life. We help you write one worth reading.",
  },
  {
    icon: Compass,
    title: "Clarity, Then Courage",
    description:
      "Most people jump first and think later. We flip the script. Deep self-discovery first. Bold action second. Zero regrets.",
  },
  {
    icon: Target,
    title: "Data Over Hunches",
    description:
      "Gut feelings are unreliable. Our CLIQI diagnostic reveals what you can't see—the patterns driving your career decisions.",
  },
  {
    icon: Users,
    title: "Mentors, Not Motivators",
    description:
      "We don't do pep talks. Our mentors have walked the path you're on. They guide, challenge, and hold you accountable.",
  },
]

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "Uncover the hidden patterns shaping your career—and the blind spots holding you back",
  },
  {
    number: "02",
    title: "Diagnosis",
    description: "Get a data-driven snapshot of where you are vs. where you could be",
  },
  {
    number: "03",
    title: "Design",
    description: "Build your personal roadmap—no generic templates, only what works for YOU",
  },
  {
    number: "04",
    title: "Development",
    description: "Close the gap between your current skills and your dream role",
  },
  {
    number: "05",
    title: "Direction",
    description: "Execute with a mentor who's been there, done that, and won't let you quit",
  },
  {
    number: "06",
    title: "Destination",
    description: "Arrive at the career you deserve—and wonder why you waited so long",
  },
]

const testimonials = [
  {
    quote:
      "I was making ₹45L but miserable. Within 6 months, I found a role that pays more AND makes me excited to wake up. The BBD assessment was a mirror I needed.",
    name: "Priya Sharma",
    role: "VP, Technology",
    segment: "Mid-Career",
  },
  {
    quote:
      "10 years away from corporate. Convinced I was unemployable. My mentor helped me land a role at a Fortune 500—at 42. This stuff actually works.",
    name: "Anita Mehta",
    role: "Product Manager",
    segment: "Returning Women",
  },
  {
    quote:
      "Everyone said 'slow down' at 50. Dheya said 'level up.' Now I run an executive coaching practice and impact more lives than my 25 years in corporate ever did.",
    name: "Rajesh Kumar",
    role: "Executive Coach",
    segment: "Senior",
  },
]

const faqs = [
  {
    question: "Why should I trust Dheya over other career coaches?",
    answer:
      "Simple: we've done this 100,000+ times. We use proprietary assessments (CLIQI, BBD) built on 18 years of research. We don't do motivational fluff—every recommendation is backed by data specific to YOUR situation. And our 91% clarity rate isn't marketing; it's measured.",
  },
  {
    question: "What exactly is BBD Syndrome?",
    answer:
      "Bored. Burned out. Disillusioned. It's not just stress—it's a specific pattern that traps mid-career professionals. Our BBD assessment identifies which type you have and prescribes targeted interventions. Most career coaches would give you generic 'take a vacation' advice. We diagnose the root cause.",
  },
  {
    question: "6-12 months sounds like a long time. Why?",
    answer:
      "Because quick fixes don't stick. We've seen it: professionals who jump to a 'dream job' only to feel stuck again in 18 months. Our process builds lasting clarity. You'll make decisions you won't regret a decade from now. That's worth a few months of focused work.",
  },
  {
    question: "How do you match me with a mentor?",
    answer:
      "After your assessment, we recommend 2-3 mentors who specialize in your segment, challenges, and industry. You'll meet them before committing. No algorithms—just humans who've walked your path and actually get what you're facing.",
  },
  {
    question: "I'm not sure if I'm ready. What should I do?",
    answer:
      "That uncertainty? It's exactly why you should book a free discovery call. In 30 minutes, you'll know if this is right for you—no sales pressure, no commitment. But we should warn you: most people who 'wait until ready' are still waiting years later.",
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
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm text-purple-700 font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Trusted by 100,000+ professionals since 2005</span>
              </div>
              <h1 className="heading-display text-charcoal-900">
                YOUR CAREER
                <br />
                <span className="text-purple-600">DESERVES BETTER</span>
              </h1>
              <p className="text-body text-charcoal-600 max-w-lg text-lg leading-relaxed">
                Stuck. Confused. Going through the motions. <strong>That&apos;s not your career—that&apos;s a holding pattern.</strong> 91% of our mentees break free and find clarity within 6 months. You could be next.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href="/auth/register">
                    Get Unstuck Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-charcoal-300 hover:bg-charcoal-50">
                  <Link href="/programs">Find Your Program</Link>
                </Button>
              </div>
              <p className="text-sm text-charcoal-500 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-sage-500" />
                Free discovery call. No credit card. No pressure.
              </p>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/50 to-cream-200/50 rounded-3xl" />
              <div className="relative bg-charcoal-900 text-cream-100 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <div className="text-7xl font-bold mb-4 text-purple-400">91%</div>
                <div className="text-xl font-medium mb-2">
                  Find Career Clarity
                </div>
                <div className="text-cream-300 text-sm leading-relaxed">
                  Not a vague promise. A measured outcome. Within 6 months, 9 out of 10 mentees know exactly where they&apos;re going—and how to get there.
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
            <h2 className="heading-section text-charcoal-900 mb-4">
              Which One Are You?
            </h2>
            <p className="text-body text-charcoal-600 max-w-2xl mx-auto text-lg">
              Your career stage isn&apos;t just an age bracket—it&apos;s a specific set of challenges. Find yours. Fix it. Move forward.
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
                    className="group-hover:bg-cream-200 w-full font-medium"
                  >
                    <Link href={segment.href}>
                      See If This Is You
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
      <section className="bg-charcoal-900 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-cream-100 mb-4">
              The Dheya Difference
            </h2>
            <p className="text-body text-cream-300 max-w-2xl mx-auto text-lg">
              We&apos;re not another career coach. We&apos;re a research-backed methodology. Here&apos;s why that matters.
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
            <h2 className="heading-section text-charcoal-900 mb-4">
              How We Get You There
            </h2>
            <p className="text-body text-charcoal-600 max-w-2xl mx-auto text-lg">
              The 6D Framework. Not theory—a battle-tested system refined over 100,000+ career transformations.
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
              They Were Where You Are
            </h2>
            <p className="text-body text-purple-100 max-w-2xl mx-auto text-lg">
              Skeptical? They were too. Here&apos;s what happened when they stopped waiting and started acting.
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
            <h2 className="heading-section text-charcoal-900 mb-4">
              Still On The Fence?
            </h2>
            <p className="text-body text-charcoal-600 text-lg">
              We get it. Career decisions are big. Here are the questions everyone asks before they start.
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
      <section className="bg-charcoal-900 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="heading-section text-cream-100 mb-4">
            Your Future Self Is Watching
          </h2>
          <p className="text-body text-cream-300 max-w-2xl mx-auto mb-8 text-lg">
            A year from now, you&apos;ll wish you started today. The discovery call is free. The insight could change everything. What are you waiting for?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/auth/register">
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream-100 text-cream-100 hover:bg-cream-100 hover:text-charcoal-900"
            >
              <Link href="/contact">Book Free Discovery Call</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-cream-300 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-sage-400" />
              <span>30-min clarity session</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-sage-400" />
              <span>Zero commitment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-sage-400" />
              <span>Walk away with insight either way</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
