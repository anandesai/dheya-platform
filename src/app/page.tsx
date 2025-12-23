import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  Compass,
  Award,
  Star,
  TrendingUp,
  Heart,
  Quote,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      {/* Navigation - Uplift Style */}
      <header className="sticky top-0 z-50 w-full bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/80">
        <div className="container-uplift flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold tracking-tight text-charcoal-900">Dheya</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/programs" className="text-micro text-charcoal-700 hover:text-purple-600 transition-colors">
              Programs
            </Link>
            <Link href="/mentors" className="text-micro text-charcoal-700 hover:text-purple-600 transition-colors">
              Mentors
            </Link>
            <Link href="/about" className="text-micro text-charcoal-700 hover:text-purple-600 transition-colors">
              About Us
            </Link>
            <Link href="/auth/login" className="text-micro text-charcoal-700 hover:text-purple-600 transition-colors">
              Login
            </Link>
            <Button asChild variant="uplift" size="lg">
              <Link href="/auth/register">Tell Us About You</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Uplift Style */}
        <section className="section-cream section-padding">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-display text-charcoal-900">
                    WE MENTOR<br />
                    <span className="text-purple-500">CAREERS</span>
                  </h1>
                  <p className="text-body-lg text-charcoal-700 max-w-xl">
                    Transform your career journey with India&apos;s premier career mentoring platform.
                    We&apos;ve been where you are — and we&apos;ll guide you where you want to go.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="uplift" size="xl">
                    <Link href="/auth/register">
                      Tell Us About You <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="upliftOutline" size="lg">
                    <Link href="#testimonials">What Professionals Say</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-[4/3] rounded-2xl bg-sage-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-sage-400">
                    <Users className="h-32 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals - Horizontal Stats */}
        <section className="py-8 bg-white border-y border-cream-200">
          <div className="container-uplift">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="font-display text-4xl md:text-5xl font-extrabold text-charcoal-900">18+</p>
                <p className="text-micro text-charcoal-600">Years of Excellence</p>
              </div>
              <div className="space-y-1">
                <p className="font-display text-4xl md:text-5xl font-extrabold text-charcoal-900">100K+</p>
                <p className="text-micro text-charcoal-600">Professionals Mentored</p>
              </div>
              <div className="space-y-1">
                <p className="font-display text-4xl md:text-5xl font-extrabold text-charcoal-900">91%</p>
                <p className="text-micro text-charcoal-600">Career Clarity Rate</p>
              </div>
              <div className="space-y-1">
                <p className="font-display text-4xl md:text-5xl font-extrabold text-charcoal-900">95%</p>
                <p className="text-micro text-charcoal-600">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Carousel */}
        <section id="testimonials" className="section-cream section-padding-sm">
          <div className="container-uplift">
            <p className="text-micro text-charcoal-600 mb-8">Trusted by founders of high-growth careers</p>
            <Card variant="light" className="max-w-3xl p-8 md:p-12">
              <div className="flex items-start gap-6">
                <div className="hidden md:flex w-20 h-20 rounded-full bg-sage-200 items-center justify-center flex-shrink-0">
                  <Quote className="h-8 w-8 text-sage-600" />
                </div>
                <div className="space-y-4">
                  <p className="text-body-lg text-charcoal-800 italic">
                    &ldquo;Dheya helped me transition from engineering to product management.
                    The BBD assessment revealed blind spots I never knew I had.
                    Within 6 months, I landed my dream role.&rdquo;
                  </p>
                  <div>
                    <p className="font-display font-semibold text-charcoal-900">Priya Sharma</p>
                    <p className="font-body text-sm text-charcoal-600">Product Manager, Tech Startup</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Empathy Block - Sage Background */}
        <section className="section-sage section-padding">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-body-lg text-charcoal-700">
                  Feeling stuck in your career? Wondering if there&apos;s more to your professional life
                  than the daily grind? Unsure which path will lead to fulfillment?
                </p>
                <p className="text-body-lg text-charcoal-700">
                  You&apos;re not alone. Thousands of professionals face these same crossroads.
                  They need someone who understands. Someone who&apos;s been there.
                </p>
                <p className="text-display-sm text-charcoal-900 pt-4">
                  WE WILL.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-sage-200 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-sage-400">
                    <Compass className="h-24 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Card - Dark Section */}
        <section className="section-cream section-padding">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-micro text-purple-600">Our Signature Approach</p>
                <h2 className="heading-section text-charcoal-900">
                  We empower you to become the professional your career needs —
                  and the person you want to be.
                </h2>
                <p className="text-body text-charcoal-700">
                  Through our proven 6-phase methodology, personalized assessments,
                  and expert mentorship, we help you discover clarity and take decisive action.
                </p>
              </div>
              <Card variant="dark" className="p-8 md:p-10">
                <div className="space-y-6">
                  <p className="text-micro text-purple-400">The Dheya Method</p>
                  <h3 className="heading-card text-cream-50">Career Transformation Program</h3>
                  <ul className="space-y-3 text-cream-200 font-body">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span>Decision Making & Clarity</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span>Leadership & Communication</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span>Work-Life Integration</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span>Strategic Career Planning</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span>Personalized Action Roadmap</span>
                    </li>
                  </ul>
                  <Button asChild variant="uplift" className="w-full mt-4">
                    <Link href="/programs">Explore Programs</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Beliefs - Sage Section */}
        <section className="section-sage section-padding">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="space-y-4">
                <p className="text-micro text-charcoal-600">Core Belief</p>
                <h2 className="heading-section text-charcoal-900">
                  Career transformation starts from within
                </h2>
                <p className="text-body text-charcoal-700">
                  True career change requires working on both the inner game
                  (mindset, values, clarity) and the outer game (skills, strategy, execution).
                </p>
              </div>
              <Card variant="light" className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="heading-card text-charcoal-900">Inner Game</h3>
                  <ul className="space-y-2 text-body text-charcoal-700">
                    <li>• Self-awareness & values clarity</li>
                    <li>• Confidence & resilience building</li>
                    <li>• Purpose & meaning discovery</li>
                    <li>• Limiting beliefs transformation</li>
                  </ul>
                </div>
              </Card>
              <Card variant="light" className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="heading-card text-charcoal-900">Outer Game</h3>
                  <ul className="space-y-2 text-body text-charcoal-700">
                    <li>• Career strategy & planning</li>
                    <li>• Skills development & positioning</li>
                    <li>• Network & opportunity creation</li>
                    <li>• Action execution & accountability</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Segment Cards */}
        <section className="section-cream section-padding">
          <div className="container-uplift">
            <div className="text-center mb-12">
              <p className="text-micro text-purple-600 mb-4">Programs by Career Stage</p>
              <h2 className="heading-section text-charcoal-900 mb-4">
                Choose Your Path
              </h2>
              <p className="text-body text-charcoal-600 max-w-2xl mx-auto">
                Tailored programs designed for where you are in your career journey
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="light" hover="lift" className="p-6 cursor-pointer group">
                <Link href="/programs/early-career" className="block space-y-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="h-7 w-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="heading-card text-charcoal-900">Early Career</h3>
                    <p className="text-micro text-charcoal-500 mt-1">Ages 22-30</p>
                  </div>
                  <p className="text-body text-charcoal-600">
                    Build a strong foundation with Develop Advantage
                  </p>
                  <span className="text-purple-600 font-display font-semibold text-sm group-hover:underline inline-flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </Card>

              <Card variant="light" hover="lift" className="p-6 cursor-pointer group border-purple-200 bg-purple-50/30">
                <Link href="/programs/mid-career" className="block space-y-4">
                  <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center group-hover:bg-purple-300 transition-colors">
                    <Target className="h-7 w-7 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="heading-card text-charcoal-900">Mid-Career</h3>
                    <p className="text-micro text-charcoal-500 mt-1">Ages 30-45</p>
                  </div>
                  <p className="text-body text-charcoal-600">
                    Navigate complexity with Destination Mastery
                  </p>
                  <span className="text-purple-600 font-display font-semibold text-sm inline-flex items-center gap-2">
                    Most Popular <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                  </span>
                </Link>
              </Card>

              <Card variant="light" hover="lift" className="p-6 cursor-pointer group">
                <Link href="/programs/senior" className="block space-y-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Award className="h-7 w-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="heading-card text-charcoal-900">Senior</h3>
                    <p className="text-micro text-charcoal-500 mt-1">Ages 45+</p>
                  </div>
                  <p className="text-body text-charcoal-600">
                    Design your legacy with Design Legacy
                  </p>
                  <span className="text-purple-600 font-display font-semibold text-sm group-hover:underline inline-flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </Card>

              <Card variant="light" hover="lift" className="p-6 cursor-pointer group">
                <Link href="/programs/returning-women" className="block space-y-4">
                  <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <Heart className="h-7 w-7 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="heading-card text-charcoal-900">Returning Women</h3>
                    <p className="text-micro text-charcoal-500 mt-1">Career Restart</p>
                  </div>
                  <p className="text-body text-charcoal-600">
                    Restart with confidence through Rise Again
                  </p>
                  <span className="text-purple-600 font-display font-semibold text-sm group-hover:underline inline-flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="section-cream section-padding border-t border-cream-200">
          <div className="container-uplift">
            <div className="text-center mb-12">
              <h2 className="heading-section text-charcoal-900 mb-4">
                We&apos;ve Been Through It All
              </h2>
              <p className="text-body text-charcoal-600 max-w-2xl mx-auto">
                Our mentors aren&apos;t just coaches — they&apos;ve walked the path you&apos;re on
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card variant="light" className="p-8">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-xl bg-sage-200 flex-shrink-0 flex items-center justify-center">
                    <Users className="h-10 w-10 text-sage-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="heading-card text-charcoal-900">Mentor Name</h3>
                    <p className="text-micro text-purple-600">Founder & Lead Mentor</p>
                    <p className="text-body text-charcoal-600">
                      18+ years guiding professionals through career transformations.
                    </p>
                  </div>
                </div>
              </Card>
              <Card variant="light" className="p-8">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-xl bg-sage-200 flex-shrink-0 flex items-center justify-center">
                    <Users className="h-10 w-10 text-sage-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="heading-card text-charcoal-900">Mentor Name</h3>
                    <p className="text-micro text-purple-600">Senior Career Mentor</p>
                    <p className="text-body text-charcoal-600">
                      Specialist in mid-career transitions and leadership development.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Value Pillars */}
        <section className="section-cream section-padding-sm border-t border-cream-200">
          <div className="container-uplift">
            <div className="grid md:grid-cols-3 gap-8">
              <Card variant="light" hover="lift" className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="heading-card text-charcoal-900 mb-2">Empathy</h3>
                <p className="text-body text-charcoal-600">
                  We understand your struggles because we&apos;ve faced them ourselves.
                </p>
              </Card>
              <Card variant="light" hover="lift" className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="heading-card text-charcoal-900 mb-2">Experience</h3>
                <p className="text-body text-charcoal-600">
                  18+ years and 100,000+ careers transformed — we know what works.
                </p>
              </Card>
              <Card variant="light" hover="lift" className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="heading-card text-charcoal-900 mb-2">Availability</h3>
                <p className="text-body text-charcoal-600">
                  Your mentor is there when you need them, not just during sessions.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-cream section-padding border-t border-cream-200">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-3 gap-12">
              <div>
                <h2 className="heading-section text-charcoal-900">FAQs</h2>
              </div>
              <div className="lg:col-span-2">
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="item-1" className="border-b border-cream-300 pb-4">
                    <AccordionTrigger className="font-display font-semibold text-charcoal-900 text-left hover:no-underline">
                      How is Dheya different from other career coaching?
                    </AccordionTrigger>
                    <AccordionContent className="text-body text-charcoal-600 pt-4">
                      Dheya combines 18+ years of career mentoring expertise with scientifically-validated
                      assessments like CLIQI and BBD Syndrome detection. Our structured 6-phase approach
                      ensures measurable outcomes, not just advice.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b border-cream-300 pb-4">
                    <AccordionTrigger className="font-display font-semibold text-charcoal-900 text-left hover:no-underline">
                      What is the BBD Syndrome Assessment?
                    </AccordionTrigger>
                    <AccordionContent className="text-body text-charcoal-600 pt-4">
                      BBD (Bored, Burned-out, Dissatisfied) Syndrome is a framework we developed to identify
                      the root causes of career dissatisfaction. The assessment helps pinpoint exactly where
                      intervention is needed.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b border-cream-300 pb-4">
                    <AccordionTrigger className="font-display font-semibold text-charcoal-900 text-left hover:no-underline">
                      How long does the program take?
                    </AccordionTrigger>
                    <AccordionContent className="text-body text-charcoal-600 pt-4">
                      Program duration varies by package tier. Guidance tier is self-paced, Planning tier
                      typically takes 8-12 weeks, and Mentorship tier runs 16-24 weeks with ongoing support.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-b border-cream-300 pb-4">
                    <AccordionTrigger className="font-display font-semibold text-charcoal-900 text-left hover:no-underline">
                      Can I switch career segments after starting?
                    </AccordionTrigger>
                    <AccordionContent className="text-body text-charcoal-600 pt-4">
                      Yes! If your assessment reveals a different career stage fit, our mentors will help
                      you transition to the most appropriate program seamlessly.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner - Purple */}
        <section className="section-purple section-padding">
          <div className="container-uplift text-center">
            <h2 className="text-display-sm text-white mb-4">
              READY FOR A CAREER TRANSFORMATION?
            </h2>
            <p className="text-body-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Join 100,000+ professionals who have achieved career clarity and fulfillment with Dheya.
            </p>
            <Button asChild size="xl" className="bg-white text-purple-600 hover:bg-cream-100 rounded-full font-display font-semibold shadow-lg">
              <Link href="/auth/register">
                Tell Us About You <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer - Compact Cream Style */}
      <footer className="bg-cream-50 border-t border-cream-200 py-12">
        <div className="container-uplift">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <span className="font-display text-2xl font-bold text-charcoal-900">Dheya</span>
            </div>
            <nav className="flex flex-wrap gap-6 text-micro text-charcoal-600">
              <Link href="/programs" className="hover:text-purple-600 transition-colors">Programs</Link>
              <Link href="/mentors" className="hover:text-purple-600 transition-colors">Mentors</Link>
              <Link href="/about" className="hover:text-purple-600 transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-cream-200 text-center">
            <p className="text-sm text-charcoal-500">
              &copy; {new Date().getFullYear()} Dheya Career Mentors. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
