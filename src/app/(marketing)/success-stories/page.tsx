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
    quote: "I was making ₹45L but waking up dreading Monday. The BBD assessment told me what I couldn't see: I wasn't burned out—I was misaligned. 8 months later, I'm VP at a company I actually believe in. Same industry, completely different life.",
    transformation: {
      before: "₹45L salary, zero joy, considering quitting tech entirely",
      after: "VP at mission-driven startup, excited about Mondays again"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "2",
    name: "Anita Mehta",
    role: "Product Manager",
    segment: "RETURNING_WOMEN",
    quote: "10 years as a homemaker. Every recruiter said my gap was 'too long.' My mentor said it proved I could manage chaos. 6 months later, I'm leading product at a Fortune 500. Turns out, running a household IS project management.",
    transformation: {
      before: "10 years out, convinced I was unemployable",
      after: "Product Manager at Fortune 500, outperforming 'continuous' careers"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    role: "Executive Coach & Consultant",
    segment: "SENIOR",
    quote: "At 50, everyone said 'slow down.' Dheya said 'what's your legacy?' Now I coach 50+ executives a year. I make less money than my banking days—and feel richer than I ever did.",
    transformation: {
      before: "Senior banker counting days to retirement",
      after: "Executive coach, impacting more lives than 25 years of corporate"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "4",
    name: "Karthik Menon",
    role: "Engineering Manager",
    segment: "EARLY_CAREER",
    quote: "I was job-hopping every 18 months chasing 20% salary bumps. CLIQI showed me I was running FROM something, not TO something. Now I lead a team at a company I'll probably never leave. The money followed when I stopped chasing it.",
    transformation: {
      before: "Serial job-hopper, 4 companies in 5 years, zero direction",
      after: "Engineering Manager, 2 years in, promoted twice"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "5",
    name: "Sneha Desai",
    role: "Marketing Director",
    segment: "MID_CAREER",
    quote: "On paper, I was crushing it. Awards, promotions, corner office. Inside, I felt like a fraud. My mentor helped me see I was living someone else's definition of success. Now I run marketing for a nonprofit—half the salary, ten times the meaning.",
    transformation: {
      before: "Award-winning marketer, privately miserable",
      after: "Marketing Director at social impact org, genuinely fulfilled"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "6",
    name: "Deepika Iyer",
    role: "UX Research Lead",
    segment: "RETURNING_WOMEN",
    quote: "7 years out. Figma didn't exist when I left. I was terrified the industry had passed me by. Dheya's program didn't just update my skills—it helped me see that empathy (which motherhood amplified) is my superpower. Now I lead UX research for products millions use.",
    transformation: {
      before: "7 years out, tech stack completely outdated",
      after: "UX Research Lead, using 'mom skills' as competitive advantage"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "7",
    name: "Vikram Singh",
    role: "Startup Founder",
    segment: "SENIOR",
    quote: "25 years in banking. Golden handcuffs everyone warned me about. At 48, I walked away from the corner office, raised seed funding for a fintech, and work harder than ever. Difference? Now I'm building something that's mine.",
    transformation: {
      before: "Banking VP, great title, felt like a cog",
      after: "Fintech founder, raised ₹2Cr, building legacy"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "8",
    name: "Arjun Nair",
    role: "Data Scientist",
    segment: "EARLY_CAREER",
    quote: "I picked data science because LinkedIn said it was hot. Hated every day. CLIQI revealed I'm wired for impact, not algorithms. Now I do climate modeling. Same skills, completely different purpose. Turns out context is everything.",
    transformation: {
      before: "Trendy job title, existential crisis at 25",
      after: "Data Scientist at climate tech, work that matters"
    },
    rating: 5,
    year: 2024
  },
  {
    id: "9",
    name: "Meera Krishnan",
    role: "Operations Director",
    segment: "MID_CAREER",
    quote: "Great at execution, terrible at politics. Kept getting passed over for promotion. My mentor didn't teach me to play games—she showed me how to make my work visible without selling out. Director in 18 months, integrity intact.",
    transformation: {
      before: "Best performer, worst politician, stuck for 4 years",
      after: "Operations Director, promoted for substance not showmanship"
    },
    rating: 5,
    year: 2023
  },
  {
    id: "10",
    name: "Lakshmi Ramesh",
    role: "HR Business Partner",
    segment: "RETURNING_WOMEN",
    quote: "12 years out. I'd forgotten who I was professionally. My mentor made me list everything I'd done as a mother: conflict resolution, resource allocation, stakeholder management. She helped me see I'd been doing HR all along. Just unpaid.",
    transformation: {
      before: "12 years 'just' a mom, zero professional confidence",
      after: "HR Business Partner, using life experience as credential"
    },
    rating: 5,
    year: 2024
  }
]

const STATS = [
  { value: "100K+", label: "Transformations & Counting", icon: TrendingUp },
  { value: "91%", label: "Find Their Path", icon: Award },
  { value: "4.9★", label: "Average Rating", icon: Star },
  { value: "18+", label: "Years of Proof", icon: Users }
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
      {/* Hero Section - Emotional & Warm */}
      <section className="relative bg-cream-50 overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-sun-50 opacity-70"></div>
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>

        <div className="container-uplift relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 backdrop-blur-sm border border-purple-200 px-4 py-1.5 text-xs font-bold text-purple-700 uppercase tracking-widest mb-8 shadow-sm">
              <Heart className="h-3 w-3 fill-purple-700" />
              <span>Proof, Not Promises</span>
            </div>
            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal-900 mb-8 tracking-tight">
              They Were <span className="text-purple-600">Skeptical Too</span>
            </h1>
            <p className="font-body text-xl text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
              Before-and-after stories from people who thought career clarity was a myth. Spoiler: it&apos;s not. These are real transformations from real professionals—complete with their doubts, struggles, and breakthroughs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - Floating Cards */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container-uplift">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-premium bg-white/80 backdrop-blur-xl p-6 rounded-2xl text-center border-white/60 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-display font-bold text-charcoal-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filter Tabs - Premium Pills */}
      <section className="sticky top-0 z-30 py-6 bg-cream-50/95 backdrop-blur-md border-b border-purple-100 transition-all">
        <div className="container-uplift">
          <Tabs value={activeSegment} onValueChange={setActiveSegment} className="w-full">
            <TabsList className="flex h-auto p-1.5 bg-white/50 border border-white/50 rounded-full shadow-sm w-full md:w-fit mx-auto overflow-x-auto justify-start md:justify-center">
              {SEGMENTS.map((segment) => (
                <TabsTrigger
                  key={segment.value}
                  value={segment.value}
                  className="rounded-full px-6 py-2.5 text-sm font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap text-charcoal-600"
                >
                  {segment.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-cream section-padding">
        <div className="container-uplift">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => {
              const segmentConfig = getSegmentConfig(testimonial.segment)
              return (
                <Card
                  key={testimonial.id}
                  className="group border-0 bg-transparent shadow-none h-full"
                >
                  <div className="glass-premium rounded-3xl p-8 h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 bg-white/60">
                    <CardHeader className="p-0 pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 border-2 border-white/80 shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-white text-purple-700 font-bold font-display text-lg">
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg font-display font-bold text-charcoal-900 group-hover:text-purple-700 transition-colors">
                              {testimonial.name}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-charcoal-500">
                              {testimonial.role}
                            </CardDescription>
                          </div>
                        </div>
                        <Quote className="h-8 w-8 text-purple-200 fill-purple-50" />
                      </div>
                      {segmentConfig && (
                        <Badge
                          variant="secondary"
                          className={`${segmentConfig.color} bg-opacity-10 text-opacity-100 border-0 px-3 py-1 font-bold text-[10px] uppercase tracking-wider`}
                          style={{ color: 'var(--charcoal-900)' }} // Fallback for contrast
                        >
                          {segmentConfig.label}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col space-y-6">
                      {/* Star Rating */}
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-sun-400 text-sun-400" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="font-body text-base text-charcoal-700 leading-relaxed italic flex-1 relative">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>

                      {/* Transformation Summary */}
                      <div className="space-y-3 pt-6 border-t border-purple-100">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100/50">
                          <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 mt-1.5" />
                          <div>
                            <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Before</div>
                            <p className="text-xs font-medium text-charcoal-600 leading-snug">{testimonial.transformation.before}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50/50 border border-green-100/50">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                          <div>
                            <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-0.5">After</div>
                            <p className="text-xs font-medium text-charcoal-600 leading-snug">{testimonial.transformation.after}</p>
                          </div>
                        </div>
                      </div>

                      {/* Year Badge */}
                      <div className="text-xs font-medium text-charcoal-400 pt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Transformed in {testimonial.year}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Video - Cinematic Dark Theme */}
      <section className="bg-charcoal-900 py-24 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container-uplift relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-colors cursor-default">
                <Play className="h-3 w-3 fill-white" />
                <span>Featured Story</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                From Burnout to <br />
                <span className="text-gradient-gold">VP of Technology</span>
              </h2>
              <p className="font-body text-xl text-charcoal-200 leading-relaxed">
                After 12 years in technology, Priya was ready to quit her career.
                Discover how Dheya&apos;s diagnostic assessments and personalized mentoring
                helped her rediscover her passion.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">8 Mo.</div>
                  <div className="text-xs text-charcoal-400 uppercase tracking-wider font-bold">Transformation</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">3X</div>
                  <div className="text-xs text-charcoal-400 uppercase tracking-wider font-bold">Salary Growth</div>
                </div>
              </div>

            </div>

            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-purple-600 rounded-[2rem] blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative aspect-video bg-charcoal-800 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-900/80 to-transparent z-10" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30 shadow-2xl">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-6 w-6 text-purple-600 ml-1 fill-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-lg">
                      <AvatarFallback className="bg-purple-600 text-white font-bold text-xl">
                        P
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-display font-bold text-white text-lg">Priya Sharma</div>
                      <div className="text-sm font-medium text-purple-300">VP of Technology</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simple & Clean */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-uplift text-center max-w-4xl">
          <h2 className="font-headline text-4xl sm:text-5xl font-bold text-cream-100 mb-6">
            Your Story Could Be <span className="text-purple-400">Next</span>
          </h2>
          <p className="text-xl text-cream-300 mb-10 max-w-2xl mx-auto">
            Every transformation on this page started with the same doubt you&apos;re feeling right now. The only difference? They took the first step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 font-headline font-bold uppercase tracking-wider shadow-lg"
            >
              <Link href="/auth/register">
                Write Your Chapter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream-100 text-cream-100 hover:bg-cream-100 hover:text-charcoal-900 px-10 py-6 font-headline font-bold uppercase tracking-wider"
            >
              <Link href="/contact">Talk To Us First</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
