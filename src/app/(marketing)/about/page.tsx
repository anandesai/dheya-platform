import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8F0]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-32 border-b border-charcoal-900/10">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <p className="font-headline text-xs uppercase tracking-widest text-purple-600">The Story Behind Dheya</p>
                <h1 className="text-display text-charcoal-900 leading-[0.85]">
                  WE EXIST BECAUSE <br /> <span className="text-purple-600">CONFUSION SHOULDN&apos;T.</span>
                </h1>
                <p className="font-body text-xl text-charcoal-700 leading-relaxed max-w-xl">
                  For 18 years, we&apos;ve watched brilliant professionals stay stuck in careers that drain them. Not because they lack talent—but because no one taught them how to <strong>see clearly</strong>.
                </p>
                <p className="font-body text-lg text-charcoal-600 leading-relaxed max-w-xl">
                  We built Dheya to fix that. Evidence-based assessments. Mentors who&apos;ve been there. A methodology refined over 100,000+ transformations. This isn&apos;t coaching. It&apos;s clarity engineering.
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
                <h3 className="text-6xl font-headline font-bold text-charcoal-900">18+</h3>
                <p className="font-headline text-xs uppercase tracking-widest mt-2 text-charcoal-600">Years Doing This</p>
              </div>
              <div>
                <h3 className="text-6xl font-headline font-bold text-charcoal-900">100K+</h3>
                <p className="font-headline text-xs uppercase tracking-widest mt-2 text-charcoal-600">Careers Transformed</p>
              </div>
              <div>
                <h3 className="text-6xl font-headline font-bold text-purple-600">91%</h3>
                <p className="font-headline text-xs uppercase tracking-widest mt-2 text-charcoal-600">Achieve Clarity</p>
              </div>
              <div>
                <h3 className="text-6xl font-headline font-bold text-charcoal-900">4.9★</h3>
                <p className="font-headline text-xs uppercase tracking-widest mt-2 text-charcoal-600">Mentee Ratings</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem We Solve */}
        <section className="bg-charcoal-900 py-32 border-y border-charcoal-900">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <p className="font-headline text-xs uppercase tracking-widest text-purple-400 mb-4">The Problem</p>
                <h2 className="text-display-sm text-cream-100 mb-8">MOST CAREER ADVICE IS GARBAGE.</h2>
                <div className="space-y-4 font-body text-lg text-cream-300 leading-relaxed">
                  <p>&quot;Follow your passion.&quot; <em>Vague.</em></p>
                  <p>&quot;Network more.&quot; <em>Generic.</em></p>
                  <p>&quot;Update your LinkedIn.&quot; <em>Surface-level.</em></p>
                  <p className="text-cream-100 font-medium pt-4">
                    None of this addresses the real question keeping you up at night: <strong>&quot;Am I on the right path?&quot;</strong>
                  </p>
                </div>
              </div>
              <div className="bg-purple-600 p-10 rounded-sm">
                <p className="font-headline text-xs uppercase tracking-widest text-purple-200 mb-4">Our Answer</p>
                <h3 className="font-headline text-3xl text-white mb-6">Clarity through evidence. Direction through mentorship.</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-purple-100">
                    <CheckCircle className="h-5 w-5 mt-1 text-white" />
                    <span>Proprietary assessments that reveal what you can&apos;t see</span>
                  </li>
                  <li className="flex items-start gap-3 text-purple-100">
                    <CheckCircle className="h-5 w-5 mt-1 text-white" />
                    <span>Mentors matched to your specific challenges</span>
                  </li>
                  <li className="flex items-start gap-3 text-purple-100">
                    <CheckCircle className="h-5 w-5 mt-1 text-white" />
                    <span>A roadmap designed for YOUR journey, not someone else&apos;s</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy - Sage Block */}
        <section className="bg-[#C8D1A3] py-32 border-y border-charcoal-900">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <p className="font-headline text-xs uppercase tracking-widest text-charcoal-700 mb-4">Our Philosophy</p>
                <h2 className="text-display-sm text-charcoal-900 mb-8">ROOTED IN DHARMA</h2>
                <p className="font-body text-xl text-charcoal-800 leading-relaxed mb-6">
                  <strong>Dheya</strong> means &quot;goal&quot; or &quot;purpose&quot; in Sanskrit. It comes from <em>Dharma</em>—the ancient understanding that each person has a unique calling.
                </p>
                <p className="font-body text-lg text-charcoal-700 leading-relaxed">
                  We&apos;re not here to give you a job. We&apos;re here to help you find work that matters—to you, to your family, to the world. When purpose aligns with profession, everything changes.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="bg-[#FDF8F0] p-8 border border-charcoal-900/10">
                  <h3 className="font-headline font-bold text-2xl mb-2">First, Know Thyself</h3>
                  <p className="font-body text-charcoal-700">You can&apos;t navigate to a destination you haven&apos;t defined. Self-discovery isn&apos;t optional—it&apos;s the foundation.</p>
                </div>
                <div className="bg-[#FDF8F0] p-8 border border-charcoal-900/10">
                  <h3 className="font-headline font-bold text-2xl mb-2">Then, Act Deliberately</h3>
                  <p className="font-body text-charcoal-700">Insight without action is just philosophy. We don&apos;t stop at awareness—we build execution plans that work.</p>
                </div>
                <div className="bg-[#FDF8F0] p-8 border border-charcoal-900/10">
                  <h3 className="font-headline font-bold text-2xl mb-2">Transform Holistically</h3>
                  <p className="font-body text-charcoal-700">Career clarity ripples outward. Our mentees report improvements in relationships, health, and life satisfaction.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-32 bg-[#FDF8F0]">
          <div className="container-uplift">
            <div className="text-center mb-16">
              <p className="font-headline text-xs uppercase tracking-widest text-purple-600 mb-4">Who&apos;s Behind This</p>
              <h2 className="text-display-sm text-charcoal-900">THE ARCHITECTS</h2>
              <p className="font-body text-lg text-charcoal-600 mt-4 max-w-2xl mx-auto">
                Not consultants. Not theorists. Practitioners who&apos;ve navigated their own career crossroads—and helped thousands do the same.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] bg-charcoal-100 relative mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src="/images/mentor-1.jpg" alt="Founder" fill className="object-cover" />
                </div>
                <h3 className="font-headline font-bold text-2xl uppercase">Dr. Anjali Gupta</h3>
                <p className="font-body text-purple-600 font-medium">Chief Mentor & Founder</p>
                <p className="font-body text-charcoal-600 text-sm mt-2">20+ years in organizational psychology. Built Dheya from scratch in 2005.</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] bg-charcoal-100 relative mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src="/images/mentor-2.jpg" alt="mentor" fill className="object-cover" />
                </div>
                <h3 className="font-headline font-bold text-2xl uppercase">Rahul Verma</h3>
                <p className="font-body text-purple-600 font-medium">Head of Strategy</p>
                <p className="font-body text-charcoal-600 text-sm mt-2">Ex-McKinsey. Left consulting to help people find meaning over money.</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] bg-charcoal-100 relative mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src="/images/mentor-3.jpg" alt="mentor" fill className="object-cover" />
                </div>
                <h3 className="font-headline font-bold text-2xl uppercase">Sneha Patel</h3>
                <p className="font-body text-purple-600 font-medium">Director of Learning</p>
                <p className="font-body text-charcoal-600 text-sm mt-2">Designed the 6D Framework. Trained 500+ certified Dheya mentors.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-purple-600 py-32 text-center text-white">
          <div className="container-uplift">
            <h2 className="text-display-sm mb-4">READY TO SEE CLEARLY?</h2>
            <p className="font-body text-xl max-w-2xl mx-auto mb-8 text-purple-100">
              100,000+ professionals found their path. Now it&apos;s your turn. One conversation could change everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="rounded-full bg-white text-purple-600 hover:bg-cream-100 px-10 py-8 font-headline font-bold text-sm tracking-widest uppercase shadow-lg">
                <Link href="/auth/register">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white text-white hover:bg-white/10 px-10 py-8 font-headline font-bold text-sm tracking-widest uppercase">
                <Link href="/contact">Book Free Discovery Call</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
