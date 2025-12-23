import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Heart,
  Target,
  Compass,
  Award,
  Users,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Sparkles,
} from "lucide-react"

export default function AboutPage() {
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
            <Link href="/about" className="text-micro text-purple-600 font-semibold transition-colors">
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
        {/* Hero Section */}
        <section className="section-cream section-padding">
          <div className="container-uplift">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-micro text-purple-600">Who We Are</p>
              <h1 className="text-display text-charcoal-900">
                ABOUT DHEYA
              </h1>
              <p className="text-body-lg text-charcoal-700 max-w-3xl mx-auto">
                For 18 years, we&apos;ve been guiding professionals to discover their true calling
                and build careers aligned with their deepest values and aspirations.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
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

        {/* Our Story Section */}
        <section className="section-cream section-padding">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-micro text-purple-600">Our Journey</p>
                <h2 className="heading-section text-charcoal-900">
                  18 Years of Career Transformation
                </h2>
                <div className="space-y-4 text-body text-charcoal-700">
                  <p>
                    Dheya was born from a simple observation: talented professionals were stuck
                    in careers that didn&apos;t align with their true potential. They were successful
                    on paper but unfulfilled in reality.
                  </p>
                  <p>
                    We realized that traditional career counseling focused on external factors —
                    skills, opportunities, market trends. But the real transformation happens when
                    you align your career with your inner purpose.
                  </p>
                  <p>
                    Over 18 years and 100,000+ mentoring relationships later, we&apos;ve refined our approach
                    into a science-backed methodology that addresses both the inner game (purpose, values, clarity)
                    and the outer game (strategy, skills, execution).
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-sage-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-sage-400">
                    <Compass className="h-32 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy - Sage Background */}
        <section className="section-sage section-padding">
          <div className="container-uplift">
            <div className="text-center mb-12">
              <p className="text-micro text-charcoal-600 mb-4">Core Philosophy</p>
              <h2 className="heading-section text-charcoal-900 mb-4">
                Rooted in Dharma
              </h2>
              <p className="text-body-lg text-charcoal-700 max-w-3xl mx-auto">
                Our approach is grounded in the ancient concept of <span className="font-semibold">Dharma</span> —
                finding one&apos;s true calling and living in alignment with it. We believe every professional
                has a unique purpose that, when discovered, transforms not just their career but their entire life.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card variant="light" className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="heading-card text-charcoal-900 mb-2">Inner Clarity</h3>
                <p className="text-body text-charcoal-600">
                  Understanding your values, strengths, and purpose is the foundation of career fulfillment.
                </p>
              </Card>

              <Card variant="light" className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="heading-card text-charcoal-900 mb-2">Strategic Action</h3>
                <p className="text-body text-charcoal-600">
                  Clarity without action is just philosophy. We help you create and execute strategic plans.
                </p>
              </Card>

              <Card variant="light" className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="heading-card text-charcoal-900 mb-2">Holistic Growth</h3>
                <p className="text-body text-charcoal-600">
                  Career transformation impacts all areas of life — relationships, health, happiness.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* The 7D Model - Dark Card Section */}
        <section className="section-cream section-padding">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-micro text-purple-600">Our Methodology</p>
                <h2 className="heading-section text-charcoal-900">
                  The 7D Career Transformation Model
                </h2>
                <p className="text-body text-charcoal-700">
                  Our proprietary framework guides you through seven distinct phases,
                  each building upon the last to create lasting career transformation.
                </p>
              </div>

              <Card variant="dark" className="p-8 md:p-10">
                <div className="space-y-6">
                  <h3 className="heading-card text-cream-50 mb-6">The 7 Phases</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-white">1</span>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-cream-50 mb-1">Discover</h4>
                        <p className="text-sm text-cream-200">Uncover your core values, strengths, and aspirations</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-white">2</span>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-cream-50 mb-1">Define</h4>
                        <p className="text-sm text-cream-200">Clarify your career vision and define success</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-white">3</span>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-cream-50 mb-1">Design</h4>
                        <p className="text-sm text-cream-200">Create a strategic roadmap for your journey</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-white">4</span>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-cream-50 mb-1">Develop</h4>
                        <p className="text-sm text-cream-200">Build the skills and capabilities you need</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-white">5</span>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-cream-50 mb-1">Deliver</h4>
                        <p className="text-sm text-cream-200">Execute your plan with accountability and support</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-white">6</span>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-cream-50 mb-1">Drive</h4>
                        <p className="text-sm text-cream-200">Sustain momentum and navigate challenges</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-white">7</span>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-cream-50 mb-1">Destiny</h4>
                        <p className="text-sm text-cream-200">Arrive at your Dharma — your true calling</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="section-sage section-padding">
          <div className="container-uplift">
            <div className="text-center mb-12">
              <h2 className="heading-section text-charcoal-900 mb-4">
                What Makes Us Different
              </h2>
              <p className="text-body text-charcoal-700 max-w-2xl mx-auto">
                We&apos;re not just career coaches. We&apos;re career transformation specialists
                with a proven methodology and deep commitment to your success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="light" className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-900">Evidence-Based Approach</h3>
                  <p className="text-body text-charcoal-600">
                    Scientifically validated assessments like CLIQI and BBD Syndrome ensure accurate diagnosis
                  </p>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-900">Experienced Mentors</h3>
                  <p className="text-body text-charcoal-600">
                    Our team has walked the path — we&apos;ve navigated career transitions ourselves
                  </p>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-900">Structured Methodology</h3>
                  <p className="text-body text-charcoal-600">
                    The 7D Model provides clear milestones and measurable outcomes
                  </p>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-900">Holistic Focus</h3>
                  <p className="text-body text-charcoal-600">
                    We address both inner game (mindset, values) and outer game (strategy, skills)
                  </p>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-900">Personalized Guidance</h3>
                  <p className="text-body text-charcoal-600">
                    Every program is customized to your unique situation and aspirations
                  </p>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-900">Proven Track Record</h3>
                  <p className="text-body text-charcoal-600">
                    91% career clarity rate and 95% satisfaction across 100,000+ mentoring relationships
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="section-cream section-padding">
          <div className="container-uplift">
            <div className="text-center mb-12">
              <p className="text-micro text-purple-600 mb-4">Meet Our Team</p>
              <h2 className="heading-section text-charcoal-900 mb-4">
                Led by Experience, Driven by Purpose
              </h2>
              <p className="text-body text-charcoal-700 max-w-2xl mx-auto">
                Our mentors aren&apos;t just experts — they&apos;ve lived through the career challenges
                you&apos;re facing and emerged with wisdom to share.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card variant="light" className="p-8">
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-xl bg-sage-200 flex items-center justify-center mx-auto">
                    <Users className="h-12 w-12 text-sage-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="heading-card text-charcoal-900">Founder Name</h3>
                    <p className="text-micro text-purple-600 mt-1">Founder & Chief Mentor</p>
                  </div>
                  <p className="text-body text-charcoal-600 text-center">
                    18+ years pioneering career mentoring in India. Former corporate executive
                    turned career transformation specialist.
                  </p>
                </div>
              </Card>

              <Card variant="light" className="p-8">
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-xl bg-sage-200 flex items-center justify-center mx-auto">
                    <Award className="h-12 w-12 text-sage-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="heading-card text-charcoal-900">Senior Mentor</h3>
                    <p className="text-micro text-purple-600 mt-1">Leadership Development</p>
                  </div>
                  <p className="text-body text-charcoal-600 text-center">
                    Specialist in mid-career transitions and leadership development.
                    12+ years guiding professionals to senior roles.
                  </p>
                </div>
              </Card>

              <Card variant="light" className="p-8">
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-xl bg-sage-200 flex items-center justify-center mx-auto">
                    <Compass className="h-12 w-12 text-sage-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="heading-card text-charcoal-900">Career Strategist</h3>
                    <p className="text-micro text-purple-600 mt-1">Career Design & Planning</p>
                  </div>
                  <p className="text-body text-charcoal-600 text-center">
                    Expert in career strategy and planning. Helps professionals
                    design careers aligned with their values.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Banner - Purple */}
        <section className="section-purple section-padding">
          <div className="container-uplift text-center">
            <h2 className="text-display-sm text-white mb-4">
              READY TO DISCOVER YOUR DHARMA?
            </h2>
            <p className="text-body-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Join 100,000+ professionals who have found career clarity and fulfillment with Dheya.
              Let&apos;s begin your transformation today.
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
