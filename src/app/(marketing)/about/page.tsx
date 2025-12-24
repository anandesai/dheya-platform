import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import {
//   ArrowRight,
//   Heart,
//   Target,
//   Compass,
//   Award,
//   Users,
//   TrendingUp,
//   Lightbulb,
//   CheckCircle,
//   Sparkles,
// } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8F0]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-32 border-b border-charcoal-900/10">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h1 className="text-display text-charcoal-900 leading-[0.85]">
                  WE IGNITE <br /> DESTINIES.
                </h1>
                <p className="font-body text-xl text-charcoal-700 leading-relaxed max-w-xl">
                  For 18 years, we&apos;ve fueled a quiet revolution. One where &quot;work&quot; isn&apos;t a burden, but a joyful expression of your true self.
                </p>
              </div>
              <div className="relative aspect-[4/3] bg-charcoal-900 rounded-sm overflow-hidden">
                <div className="absolute inset-0 bg-gray-200">
                  <Image src="/images/about-hero.jpg" alt="About Hero" fill className="object-cover opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats - Minimalist */}
        <section className="py-20">
          <div className="container-uplift">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 border-t border-charcoal-900 pt-12">
              <div>
                <h3 className="text-6xl font-display font-bold text-charcoal-900">18+</h3>
                <p className="font-display text-xs uppercase tracking-widest mt-2">Years of Excellence</p>
              </div>
              <div>
                <h3 className="text-6xl font-display font-bold text-charcoal-900">100K+</h3>
                <p className="font-display text-xs uppercase tracking-widest mt-2">Lives Impacted</p>
              </div>
              <div>
                <h3 className="text-6xl font-display font-bold text-charcoal-900">91%</h3>
                <p className="font-display text-xs uppercase tracking-widest mt-2">Clarity Rate</p>
              </div>
              <div>
                <h3 className="text-6xl font-display font-bold text-charcoal-900">95%</h3>
                <p className="font-display text-xs uppercase tracking-widest mt-2">Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy - Sage Block */}
        <section className="bg-[#C8D1A3] py-32 border-y border-charcoal-900">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <h2 className="text-display-sm text-charcoal-900 mb-8">ROOTED IN DHARMA</h2>
                <p className="font-body text-xl text-charcoal-800 leading-relaxed">
                  Our approach is grounded in the ancient concept of <span className="font-bold">Dharma</span> — finding one&apos;s true calling and living in alignment with it. We believe every professional has a unique purpose.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="bg-[#FDF8F0] p-8 border border-charcoal-900/10">
                  <h3 className="font-display font-bold text-2xl mb-2">Inner Clarity</h3>
                  <p className="font-body text-charcoal-700">Understanding your values, strengths, and purpose is the foundation.</p>
                </div>
                <div className="bg-[#FDF8F0] p-8 border border-charcoal-900/10">
                  <h3 className="font-display font-bold text-2xl mb-2">Strategic Action</h3>
                  <p className="font-body text-charcoal-700">Clarity without action is just philosophy. We help you execute.</p>
                </div>
                <div className="bg-[#FDF8F0] p-8 border border-charcoal-900/10">
                  <h3 className="font-display font-bold text-2xl mb-2">Holistic Growth</h3>
                  <p className="font-body text-charcoal-700">Transformation impacts all areas — relationships, health, happiness.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-32 bg-[#FDF8F0]">
          <div className="container-uplift">
            <h2 className="text-display-sm text-charcoal-900 mb-16 text-center">THE ARCHITECTS</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] bg-charcoal-100 relative mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src="/images/mentor-1.jpg" alt="Founder" fill className="object-cover" />
                </div>
                <h3 className="font-display font-bold text-2xl uppercase">Dr. Anjali Gupta</h3>
                <p className="font-body text-charcoal-600">Chief Mentor</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] bg-charcoal-100 relative mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src="/images/mentor-2.jpg" alt=" mentor" fill className="object-cover" />
                </div>
                <h3 className="font-display font-bold text-2xl uppercase">Rahul Verma</h3>
                <p className="font-body text-charcoal-600">Senior Strategist</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] bg-charcoal-100 relative mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src="/images/mentor-3.jpg" alt="mentor" fill className="object-cover" />
                </div>
                <h3 className="font-display font-bold text-2xl uppercase">Sneha Patel</h3>
                <p className="font-body text-charcoal-600">Head of Learning</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#5D5FEF] py-32 text-center text-white">
          <div className="container-uplift">
            <h2 className="text-display-sm mb-8">READY TO ALIGN?</h2>
            <p className="font-body text-xl max-w-2xl mx-auto mb-12 text-white/90">
              Join 100,000+ professionals who have found career clarity and fulfillment.
            </p>
            <Button asChild className="rounded-full bg-white text-purple-600 hover:bg-cream-100 px-10 py-8 font-display font-bold text-sm tracking-widest uppercase">
              <Link href="/auth/register">Tell Us About You</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
