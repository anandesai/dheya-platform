"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  Target,
  Crown,
  Heart,
  Check,
  ArrowRight,
} from "lucide-react"

const segments = [
  {
    id: "early-career",
    name: "Develop Advantage",
    subtitle: "Early Career (22-30)",
    description: "Launch your career with clarity and confidence. Discover your unique strengths.",
    icon: Rocket,
    href: "/programs/early-career",
    features: ["Identity Discovery", "Trend Analysis", "Personal Branding"],
  },
  {
    id: "mid-career",
    name: "Destination Mastery",
    subtitle: "Mid Career (30-45)",
    description: "Break through plateaus. Overcome stagnation and design your ideal career destination.",
    icon: Target,
    href: "/programs/mid-career",
    features: ["BBD Syndrome Fix", "Passion Matrix", "Career Redesign"],
  },
  {
    id: "senior",
    name: "Design Legacy",
    subtitle: "Senior Professionals (45+)",
    description: "Transform your wealth of experience into lasting impact. Design your second innings.",
    icon: Crown,
    href: "/programs/senior",
    features: ["Wisdom Assets", "Legacy Vision", "Financial Freedom"],
  },
  {
    id: "returning-women",
    name: "Restart & Rise",
    subtitle: "Returning Women",
    description: "Confidently re-enter the workforce. Rebuild skills and find opportunities that fit your life.",
    icon: Heart,
    href: "/programs/returning-women",
    features: ["Confidence Rebuilding", "Skills Gap Analysis", "Market Re-entry"],
  },
]

export default function ProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8F0]">
      {/* Hero Section */}
      <section className="pt-24 pb-20 border-b border-charcoal-900/10">
        <div className="container-uplift text-center max-w-4xl mx-auto">
          <span className="font-display font-bold text-xs uppercase tracking-widest text-purple-600 mb-6 block">Our Programs</span>
          <h1 className="text-display text-charcoal-900 mb-8 leading-[0.85]">
            ARCHITECT YOUR <br /> LEGACY
          </h1>
          <p className="font-body text-xl text-charcoal-700 leading-relaxed max-w-2xl mx-auto">
            You are not just choosing a program. You are choosing your future self.
            Select the path that speaks to your current reality.
          </p>
        </div>
      </section>

      {/* Program Segments */}
      <section className="py-24 bg-[#F7EFE5]">
        <div className="container-uplift">
          <div className="grid md:grid-cols-2 gap-8">
            {segments.map((segment) => {
              const Icon = segment.icon
              return (
                <Link key={segment.id} href={segment.href} className="group block">
                  <div className="bg-[#FDF8F0] p-10 h-full border border-charcoal-900/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 bg-charcoal-900 text-white flex items-center justify-center rounded-none group-hover:bg-purple-600 transition-colors">
                        <Icon className="w-8 h-8" />
                      </div>
                      <Badge variant="outline" className="font-display text-xs uppercase tracking-widest px-3 py-1 border-charcoal-900/20 text-charcoal-600">
                        {segment.subtitle}
                      </Badge>
                    </div>

                    <h3 className="font-display font-bold text-3xl text-charcoal-900 mb-4 group-hover:text-purple-600 transition-colors">
                      {segment.name}
                    </h3>
                    <p className="font-body text-charcoal-600 mb-8 leading-relaxed h-[4.5rem]">
                      {segment.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {segment.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 font-display text-sm font-semibold text-charcoal-700 uppercase tracking-wide">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center text-purple-600 font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
                      Explore Program <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Section (Simplified for Overview) */}
      <section className="py-24 bg-[#FDF8F0]">
        <div className="container-uplift">
          <div className="text-center mb-16">
            <h2 className="text-display-sm text-charcoal-900 mb-6">FLEXIBLE TIERS</h2>
            <p className="font-body text-charcoal-600 max-w-2xl mx-auto">
              Every program serves three levels of depth. Choose your intensity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-transparent border-charcoal-900/10 shadow-none">
              <CardHeader>
                <p className="font-display font-bold text-xs uppercase tracking-widest text-charcoal-500 mb-2">Level 1</p>
                <CardTitle className="font-display font-bold text-3xl text-charcoal-900">Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-sm text-charcoal-600 mb-6 min-h-[3rem]">
                  Foundational clarity. Best for getting unstuck quickly.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" /> 2 Sessions</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" /> Basic Assessment</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" /> 2-3 Weeks</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] uppercase font-bold px-3 py-1">Popular</div>
              <CardHeader>
                <p className="font-display font-bold text-xs uppercase tracking-widest text-purple-600 mb-2">Level 2</p>
                <CardTitle className="font-display font-bold text-3xl text-charcoal-900">Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-sm text-charcoal-600 mb-6 min-h-[3rem]">
                  Comprehensive strategy. Our recommended starting point.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-purple-600" /> 5 Sessions</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-purple-600" /> Full Suite</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-purple-600" /> 6 Weeks</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-charcoal-900 text-white border-transparent shadow-none">
              <CardHeader>
                <p className="font-display font-bold text-xs uppercase tracking-widest text-[#C8D1A3] mb-2">Level 3</p>
                <CardTitle className="font-display font-bold text-3xl text-white">Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-sm text-gray-300 mb-6 min-h-[3rem]">
                  Ongoing partnership for sustained transformation.
                </p>
                <ul className="space-y-3 mb-8 text-gray-300">
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-[#C8D1A3]" /> 12+ Sessions</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-[#C8D1A3]" /> AI Insights</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-[#C8D1A3]" /> 12 Months</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal-900 py-32 text-center text-white">
        <div className="container-uplift">
          <h2 className="text-display-sm mb-8">NOT SURE WHICH PATH?</h2>
          <p className="font-body text-xl max-w-2xl mx-auto mb-12 text-white/70">
            Book a free synthesis call. No pitch, just clarity.
          </p>
          <Button asChild className="rounded-full bg-[#5D5FEF] text-white hover:bg-purple-600 px-10 py-8 font-display font-bold text-sm tracking-widest uppercase">
            <Link href="/contact">Book Free Call</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
