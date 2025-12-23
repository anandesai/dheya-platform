"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  TrendingUp,
  Award,
  Users,
  Heart,
  ArrowRight,
  Quote,
  Play,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

interface Testimonial {
  id: string
  name: string
  role: string
  segment: "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN"
  quote: string
  transformation: {
    before: string
    after: string
  }
  rating: number
  year: number
}

const SEGMENTS = [
  { value: "ALL", label: "All Stories", color: "bg-purple-500" },
  { value: "EARLY_CAREER", label: "Early Career", color: "bg-purple-600" },
  { value: "MID_CAREER", label: "Mid-Career", color: "bg-forest-800" },
  { value: "SENIOR", label: "Senior", color: "bg-gold-500" },
  { value: "RETURNING_WOMEN", label: "Returning Women", color: "bg-purple-500" },
]

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "VP of Technology",
    segment: "MID_CAREER",
    quote: "I was stuck in the BBD syndrome—bored, burned out, and disillusioned with my career. Dheya's diagnostic assessments revealed patterns I'd been blind to for years. My mentor helped me rediscover my purpose, and within 8 months, I transitioned into a role that genuinely excites me every day.",
    transformation: {
      before: "Burned out senior engineer, considering leaving tech entirely",
      after: "VP of Technology at innovative startup, energized and fulfilled"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "2",
    name: "Anita Mehta",
    role: "Product Manager",
    segment: "RETURNING_WOMEN",
    quote: "After 10 years as a homemaker, I was terrified to re-enter the workforce. The world had changed so much. My Dheya mentor didn't just teach me new skills—she believed in me when I couldn't believe in myself. Today, I'm leading product initiatives at a major tech company.",
    transformation: {
      before: "10-year career gap, zero confidence, outdated skills",
      after: "Senior Product Manager, leading cross-functional teams"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    role: "Executive Coach & Consultant",
    segment: "SENIOR",
    quote: "At 50, I thought my best years were behind me. Corporate life felt empty. Dheya's 7D methodology helped me design a second innings that truly matters. Now I'm an executive coach, helping others navigate their careers with the wisdom I've gained.",
    transformation: {
      before: "Unfulfilled corporate executive, counting years to retirement",
      after: "Thriving executive coach, helping 50+ leaders annually"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "4",
    name: "Karthik Menon",
    role: "Engineering Manager",
    segment: "EARLY_CAREER",
    quote: "As a 26-year-old engineer, I was chasing promotions without understanding my long-term direction. The CLIQI diagnostic framework gave me clarity on my strengths and helped me chart a deliberate path. I'm now managing a team at a company whose mission aligns with my values.",
    transformation: {
      before: "Directionless software engineer, job-hopping for money",
      after: "Engineering Manager at mission-driven company"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "5",
    name: "Sneha Desai",
    role: "Marketing Director",
    segment: "MID_CAREER",
    quote: "I'd built a successful career, but felt completely disconnected from my work. The assessments revealed I was optimizing for the wrong metrics—external validation instead of internal fulfillment. My mentor helped me pivot into a role where I make real impact.",
    transformation: {
      before: "Successful but unfulfilled marketing manager",
      after: "Marketing Director at social impact organization"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "6",
    name: "Deepika Iyer",
    role: "UX Research Lead",
    segment: "RETURNING_WOMEN",
    quote: "Seven years away from my design career felt like an eternity. The tech industry had evolved dramatically. Dheya's structured re-entry program helped me update my skills systematically while building my confidence. I'm now leading UX research for a major product line.",
    transformation: {
      before: "7-year career break, overwhelmed by industry changes",
      after: "UX Research Lead, driving product strategy"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "7",
    name: "Vikram Singh",
    role: "Startup Founder",
    segment: "SENIOR",
    quote: "After 25 years in corporate banking, I had domain expertise but zero entrepreneurial experience. My mentor helped me channel my financial knowledge into building a fintech startup. At 48, I'm finally doing work that matters to me.",
    transformation: {
      before: "Banking executive feeling trapped in corporate life",
      after: "Fintech founder, raised seed funding"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "8",
    name: "Arjun Nair",
    role: "Data Scientist",
    segment: "EARLY_CAREER",
    quote: "I was pursuing data science because it was 'hot,' not because I loved it. The career clarity sessions helped me discover my real passion lies in sustainability. I've since transitioned to climate tech and wake up excited about my work.",
    transformation: {
      before: "Miserable data analyst in finance, following trends",
      after: "Data Scientist at climate tech startup, mission-aligned"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "9",
    name: "Meera Krishnan",
    role: "Operations Director",
    segment: "MID_CAREER",
    quote: "I was great at execution but had hit a ceiling. The leadership assessments revealed gaps in strategic thinking. My mentor created a personalized development plan that helped me transition from manager to director level in 18 months.",
    transformation: {
      before: "Stuck mid-level manager, unclear growth path",
      after: "Operations Director, leading strategic initiatives"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "10",
    name: "Lakshmi Ramesh",
    role: "HR Business Partner",
    segment: "RETURNING_WOMEN",
    quote: "After 12 years focused on family, I'd lost professional identity. Dheya's program didn't just update my skills—it helped me rebuild my professional confidence from the ground up. Now I'm shaping HR strategy at a growing company.",
    transformation: {
      before: "12-year career gap, lost professional identity",
      after: "Senior HR Business Partner, strategic role"
    },
    rating: 5,
    year: 2024
  }
]

const STATS = [
  { value: "2,847", label: "Careers Transformed", icon: TrendingUp },
  { value: "91%", label: "Career Clarity Achieved", icon: Award },
  { value: "4.9/5", label: "Average Satisfaction", icon: Star },
  { value: "100K+", label: "Lives Impacted", icon: Users }
]

export default function SuccessStoriesPage() {
  const [activeSegment, setActiveSegment] = useState("ALL")

  const filteredTestimonials = activeSegment === "ALL"
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.segment === activeSegment)

  const getSegmentConfig = (segment: string) => {
    return SEGMENTS.find(s => s.value === segment)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-cream-100 overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm text-purple-700 mb-6">
              <Heart className="h-4 w-4" />
              <span>Real People. Real Transformations.</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-800 mb-6">
              SUCCESS STORIES
            </h1>
            <p className="font-body text-lg sm:text-xl text-charcoal-600 max-w-2xl mx-auto">
              Discover how professionals across career stages found clarity, purpose, and
              fulfillment through Dheya&apos;s evidence-based mentoring approach.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-600 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="space-y-2">
                  <Icon className="h-8 w-8 mx-auto text-purple-200" />
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-purple-100">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-cream-200 py-8 sticky top-0 z-10 border-b border-cream-300">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Tabs value={activeSegment} onValueChange={setActiveSegment} className="w-full">
            <TabsList className="inline-flex h-auto p-1 bg-white rounded-full shadow-sm w-full justify-start overflow-x-auto">
              {SEGMENTS.map((segment) => (
                <TabsTrigger
                  key={segment.value}
                  value={segment.value}
                  className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white whitespace-nowrap"
                >
                  {segment.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => {
              const segmentConfig = getSegmentConfig(testimonial.segment)
              return (
                <Card
                  key={testimonial.id}
                  variant="light"
                  hover="lift"
                  className="flex flex-col"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 bg-purple-100">
                          <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-display text-charcoal-800">
                            {testimonial.name}
                          </CardTitle>
                          <CardDescription className="text-sm font-body text-charcoal-600">
                            {testimonial.role}
                          </CardDescription>
                        </div>
                      </div>
                      <Quote className="h-6 w-6 text-purple-200" />
                    </div>
                    {segmentConfig && (
                      <Badge
                        variant="outline"
                        className="w-fit border-purple-200 text-purple-700 bg-purple-50"
                      >
                        {segmentConfig.label}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col space-y-4">
                    {/* Star Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="font-body text-sm text-charcoal-600 leading-relaxed italic flex-1">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Transformation Summary */}
                    <div className="space-y-2 pt-4 border-t border-cream-200">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-charcoal-800 mb-1">Before</div>
                          <p className="text-xs text-charcoal-600">{testimonial.transformation.before}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-charcoal-800 mb-1">After</div>
                          <p className="text-xs text-charcoal-600">{testimonial.transformation.after}</p>
                        </div>
                      </div>
                    </div>

                    {/* Year Badge */}
                    <div className="text-xs text-charcoal-500 pt-2">
                      Transformed in {testimonial.year}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Video Testimonial Section */}
      <section className="bg-forest-800 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-600/20 px-4 py-1.5 text-sm text-purple-300">
                <Play className="h-4 w-4" />
                <span>Featured Story</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
                Watch Priya&apos;s Journey from Burnout to Purpose
              </h2>
              <p className="font-body text-lg text-cream-200">
                After 12 years in technology, Priya was ready to quit her career.
                Discover how Dheya&apos;s diagnostic assessments and personalized mentoring
                helped her rediscover her passion and achieve VP-level leadership.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-cream-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>8-month transformation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>From burnout to thriving</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>VP-level promotion</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-video bg-charcoal-800 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play className="h-10 w-10 text-purple-600 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal-900/90 to-transparent">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarFallback className="bg-purple-600 text-white font-semibold">
                      P
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">Priya Sharma</div>
                    <div className="text-sm text-cream-200">VP of Technology</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="font-body text-lg text-purple-100 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who&apos;ve transformed their careers with
            Dheya&apos;s evidence-based mentoring. Your journey to clarity starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-cream-100 px-8 font-semibold"
            >
              <Link href="/auth/register">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 font-semibold"
            >
              <Link href="/programs">Explore Programs</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-purple-100 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span>Free career assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span>No commitment required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span>Evidence-based approach</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
