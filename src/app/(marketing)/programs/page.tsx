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
    name: "The Unfair Advantage",
    subtitle: "Ages 22-30",
    description: "While your peers chase titles, you'll build an unfair advantage. Discover what makes you irreplaceable before the market decides for you.",
    icon: Rocket,
    href: "/programs/early-career",
    features: ["Your Hidden Superpower (most people never find it)", "Industry Trends Only Insiders Know", "Personal Brand That Opens Doors"],
    stat: "87% land dream roles within 6 months",
  },
  {
    id: "mid-career",
    name: "Break The Ceiling",
    subtitle: "Ages 30-45",
    description: "You've hit the wall. Good salary, zero excitement. The BBD trap (Bored But Dependent) is real—and it's killing your potential. Time to escape.",
    icon: Target,
    href: "/programs/mid-career",
    features: ["BBD Syndrome Diagnostic (it's not burnout)", "Passion Matrix Analysis", "Career Pivot Blueprint"],
    stat: "91% escape the BBD trap",
  },
  {
    id: "senior",
    name: "Design Your Legacy",
    subtitle: "Ages 45+",
    description: "You've built the career. Now what? Retirement isn't the answer—reinvention is. Transform 20+ years of wisdom into your most impactful chapter yet.",
    icon: Crown,
    href: "/programs/senior",
    features: ["Wisdom-to-Revenue Mapping", "Legacy Vision Workshop", "Financial Freedom Roadmap"],
    stat: "3x more fulfillment reported",
  },
  {
    id: "returning-women",
    name: "Your Comeback Story",
    subtitle: "Career Re-entry",
    description: "The gap isn't a weakness—it's a superpower you haven't learned to leverage. Come back stronger than you left, with roles that respect your reality.",
    icon: Heart,
    href: "/programs/returning-women",
    features: ["Confidence Reconstruction", "Skills Gap-to-Strength Flip", "Family-Friendly Role Matching"],
    stat: "94% re-enter within 4 months",
  },
]

export default function ProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8F0]">
      {/* Hero Section */}
      <section className="pt-24 pb-20 border-b border-charcoal-900/10">
        <div className="container-uplift text-center max-w-4xl mx-auto">
          <span className="font-headline font-bold text-xs uppercase tracking-widest text-purple-600 mb-6 block">Find Your Path</span>
          <h1 className="text-display text-charcoal-900 mb-8 leading-[0.85]">
            FOUR PROBLEMS. <br /> <span className="text-purple-600">FOUR SOLUTIONS.</span>
          </h1>
          <p className="font-body text-xl text-charcoal-700 leading-relaxed max-w-2xl mx-auto">
            Generic career advice fails because it ignores where you actually are. We built four distinct programs for four distinct realities. Find yours.
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
                      <Badge variant="outline" className="font-headline text-xs uppercase tracking-widest px-3 py-1 border-charcoal-900/20 text-charcoal-600">
                        {segment.subtitle}
                      </Badge>
                    </div>

                    <h3 className="font-headline font-bold text-3xl text-charcoal-900 mb-4 group-hover:text-purple-600 transition-colors uppercase">
                      {segment.name}
                    </h3>
                    <p className="font-body text-charcoal-600 mb-6 leading-relaxed min-h-[5rem]">
                      {segment.description}
                    </p>

                    {/* Success Stat */}
                    <div className="bg-[#C8D1A3]/30 px-4 py-3 mb-6 border-l-4 border-purple-600">
                      <p className="font-headline text-sm font-bold text-charcoal-900">{segment.stat}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {segment.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 font-body text-sm text-charcoal-700">
                          <Check className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center text-purple-600 font-headline font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
                      See If This Is You <ArrowRight className="ml-2 w-4 h-4" />
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
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-purple-600 mb-4 block">Choose Your Depth</span>
            <h2 className="text-display-sm text-charcoal-900 mb-6">HOW DEEP DO YOU WANT TO GO?</h2>
            <p className="font-body text-lg text-charcoal-600 max-w-2xl mx-auto">
              Quick clarity or complete transformation? Every program offers three intensities. Pick what fits your urgency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-transparent border-charcoal-900/10 shadow-none">
              <CardHeader>
                <p className="font-headline font-bold text-xs uppercase tracking-widest text-charcoal-500 mb-2">Fast Track</p>
                <CardTitle className="font-headline font-bold text-3xl text-charcoal-900">Clarity Sprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-sm text-charcoal-600 mb-6 min-h-[3rem]">
                  &quot;I need direction NOW.&quot; Get unstuck in weeks, not months.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-green-600" /> 2 Intensive Sessions</li>
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-green-600" /> Core Assessment Suite</li>
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-green-600" /> 2-3 Week Turnaround</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] uppercase font-bold px-3 py-1">Most Chosen</div>
              <CardHeader>
                <p className="font-headline font-bold text-xs uppercase tracking-widest text-purple-600 mb-2">Comprehensive</p>
                <CardTitle className="font-headline font-bold text-3xl text-charcoal-900">Full Blueprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-sm text-charcoal-600 mb-6 min-h-[3rem]">
                  &quot;I want a complete roadmap.&quot; Our recommended starting point for lasting change.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-purple-600" /> 5 Deep-Dive Sessions</li>
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-purple-600" /> Complete Assessment Suite</li>
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-purple-600" /> 6-Week Transformation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-charcoal-900 text-white border-transparent shadow-none">
              <CardHeader>
                <p className="font-headline font-bold text-xs uppercase tracking-widest text-[#C8D1A3] mb-2">Executive</p>
                <CardTitle className="font-headline font-bold text-3xl text-white">Total Partnership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-sm text-gray-300 mb-6 min-h-[3rem]">
                  &quot;I want a mentor in my corner.&quot; Year-long partnership for complete reinvention.
                </p>
                <ul className="space-y-3 mb-8 text-gray-300">
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-[#C8D1A3]" /> 12+ Monthly Sessions</li>
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-[#C8D1A3]" /> AI-Powered Insights</li>
                  <li className="flex items-center gap-2 text-sm font-body"><Check className="w-4 h-4 text-[#C8D1A3]" /> 12-Month Partnership</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal-900 py-32 text-center text-white">
        <div className="container-uplift">
          <span className="font-headline font-bold text-xs uppercase tracking-widest text-purple-400 mb-4 block">Still Deciding?</span>
          <h2 className="text-display-sm mb-8">LET&apos;S FIGURE IT OUT TOGETHER</h2>
          <p className="font-body text-xl max-w-2xl mx-auto mb-12 text-cream-300">
            30 minutes. Zero pressure. We&apos;ll help you identify which program fits your situation—or tell you honestly if none do.
          </p>
          <Button asChild className="rounded-full bg-purple-600 text-white hover:bg-purple-700 px-10 py-8 font-headline font-bold text-sm tracking-widest uppercase shadow-lg hover:shadow-xl transition-all">
            <Link href="/contact">Book Your Free Discovery Call →</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
