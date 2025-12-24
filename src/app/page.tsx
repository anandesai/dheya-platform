import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8F0]">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-32 overflow-hidden border-b border-charcoal-900/10">
          <div className="container-uplift relative">
            <div className="max-w-[90%]">
              <h1 className="text-display text-charcoal-900 mb-8 leading-[0.85]">
                WE UPLIFT <br />
                FOUNDERS
              </h1>
              <p className="font-body text-xl md:text-2xl text-charcoal-700 max-w-2xl italic leading-relaxed mb-12">
                Helping founders to GROW through uncertainty & MAXIMIZE their impact.
              </p>
              <Button asChild className="btn-pill text-lg px-10 py-8 h-auto">
                <Link href="/auth/register">Tell Us About You</Link>
              </Button>
            </div>

            {/* Floating Image 1 */}
            <div className="absolute top-0 right-0 w-[500px] h-[400px] hidden lg:block">
              <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-500">
                <Image src="/images/hero-team.jpg" alt="Team" fill className="object-cover rounded-sm" priority />
              </div>
            </div>

            {/* Floating Image 2 */}
            <div className="absolute bottom-10 right-20 w-[300px] h-[300px] hidden lg:block z-10">
              <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-500 border-8 border-[#FDF8F0]">
                <Image src="/images/hero-meeting.jpg" alt="Meeting" fill className="object-cover rounded-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section - Card Style */}
        <section className="py-20 bg-transparent">
          <div className="container-uplift">
            <div className="bg-[#EFEAE4] border border-charcoal-900 rounded-xl p-12 relative">
              <div className="absolute -left-3 top-10 h-16 w-1 bg-charcoal-900"></div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden relative border-2 border-charcoal-900 flex-shrink-0">
                    <Image src="/images/founder-avatar.jpg" alt="Founder" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-body italic text-lg text-charcoal-800 mb-4">
                      &ldquo;The best decision I made for my company was finding a mentor who had walked the path before. Dheya connected me to that wisdom.&rdquo;
                    </p>
                    <p className="font-display font-bold uppercase tracking-wider text-xs">
                      — Priya Sharma, Founder of TechFlow
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-display font-bold uppercase leading-none text-right text-charcoal-900">
                    TRUSTED BY <br /> FOUNDERS OF <br /> HIGH-GROWTH <br /> STARTUPS
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition - Video/Image Split */}
        <section className="py-20 bg-[#D8DDBF] border-y border-charcoal-900">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <p className="font-body text-charcoal-800 text-2xl leading-relaxed">
                  Building a successful company can feel like a rollercoaster ride. Compassion alone won&apos;t get you there.
                </p>
                <h2 className="text-6xl font-display font-bold uppercase text-charcoal-900">
                  WE WILL.
                </h2>
              </div>
              <div className="relative aspect-video bg-charcoal-900 rounded-sm overflow-hidden group cursor-pointer border-4 border-charcoal-900/10">
                <Image src="/images/video-thumbnail.jpg" alt="Video" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                    <Play className="fill-white text-white ml-2 h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Toggle Section */}
        <section className="py-32 bg-[#FDF8F0]">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <h2 className="text-display-sm text-charcoal-900 mb-8 leading-[0.9]">
                  WE EMPOWER YOU TO BECOME THE FOUNDER YOUR COMPANY NEEDS TO SCALE FASTER
                </h2>
              </div>
              <div className="lg:col-span-7">
                <div className="bg-charcoal-900 text-[#FDF8F0] rounded-xl p-10 min-h-[500px] flex flex-col shadow-2xl shadow-charcoal-900/20">
                  <div className="flex justify-between items-center mb-12 border-b border-white/20 pb-6">
                    <span className="font-display font-bold text-2xl">Shaky Founders</span>
                    <div className="w-12 h-6 bg-white/20 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-8 flex-1">
                    <div className="grid grid-cols-12 gap-4 items-start border-b border-white/10 pb-8">
                      <span className="col-span-4 font-display font-bold uppercase text-sm tracking-widest text-white/60">Lack of Clarity</span>
                      <p className="col-span-8 font-body text-lg text-white/90">
                        Unclear vision causes confusion within the team and wasted resources.
                      </p>
                    </div>
                    <div className="grid grid-cols-12 gap-4 items-start border-b border-white/10 pb-8">
                      <span className="col-span-4 font-display font-bold uppercase text-sm tracking-widest text-white/60">Poor Leadership</span>
                      <p className="col-span-8 font-body text-lg text-white/90">
                        Inability to delegate and empower leads to burnout and bottlenecking.
                      </p>
                    </div>
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <span className="col-span-4 font-display font-bold uppercase text-sm tracking-widest text-white/60">Isolation</span>
                      <p className="col-span-8 font-body text-lg text-white/90">
                        Struggling alone without a support system or guidance network.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Beliefs - Sage Split */}
        <section className="py-32 bg-[#C8D1A3] border-y border-charcoal-900">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-2 gap-20">
              <div className="space-y-8">
                <h2 className="text-display-sm text-charcoal-900">CORE <br /> BELIEF</h2>
              </div>
              <div className="space-y-8">
                <p className="font-body text-xl italic text-charcoal-800 max-w-xl">
                  Deep self-awareness (<span className="font-bold not-italic">Inner Game</span>) coupled with a bold vision and clear strategy (<span className="font-bold not-italic">Outer Game</span>) are the foundation for lasting growth.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mt-20 relative">
              {/* Center Divider/Graphic */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center z-10 w-32">
                <div className="w-16 h-16 rounded-full border border-charcoal-900 flex items-center justify-center bg-[#C8D1A3]">
                  <div className="w-2 h-2 rounded-full bg-charcoal-900"></div>
                </div>
                <div className="h-full w-px bg-charcoal-900/20 absolute -z-10"></div>
              </div>

              <div className="border border-charcoal-900/30 p-10 rounded-sm hover:bg-[#C8D1A3]/50 transition-colors">
                <div className="mb-8">
                  <span className="font-display font-bold uppercase text-xs tracking-widest border border-charcoal-900 px-2 py-1 rounded-full">The Inner Game</span>
                </div>
                <h3 className="font-body text-3xl mb-6">How can we unlock your full potential?</h3>
                <ul className="space-y-3 font-body text-sm text-charcoal-700">
                  <li>• Overcome Imposter Syndrome</li>
                  <li>• Clarify Personal Values & Vision</li>
                  <li>• Build Emotional Resilience</li>
                </ul>
              </div>

              <div className="border border-charcoal-900/30 p-10 rounded-sm hover:bg-[#C8D1A3]/50 transition-colors">
                <div className="mb-8">
                  <span className="font-display font-bold uppercase text-xs tracking-widest border border-charcoal-900 px-2 py-1 rounded-full">The Outer Game</span>
                </div>
                <h3 className="font-body text-3xl mb-6">How can we grow the business?</h3>
                <ul className="space-y-3 font-body text-sm text-charcoal-700">
                  <li>• Strategic Planning & Execution</li>
                  <li>• Team Building & Culture</li>
                  <li>• Fundraising & Financial Modeling</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-16">
              <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white px-10 py-8 font-display font-bold text-sm tracking-widest uppercase">
                Tell us about you
              </Button>
            </div>
          </div>
        </section>

        {/* Team / Mentors Section */}
        <section className="py-32 bg-[#FDF8F0]">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <h2 className="text-6xl font-display font-bold uppercase leading-[0.85] text-charcoal-900">
                  WE&apos;VE <br /> BEEN <br /> THROUGH <br /> IT <br /> ALL
                </h2>
              </div>
              <div className="lg:col-span-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4 text-center group cursor-pointer">
                    <div className="aspect-[3/4] bg-gray-200 relative grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                      <Image src="/images/mentor-1.jpg" alt="Mentor" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold uppercase tracking-wider text-sm">Rahul Verma</h4>
                      <p className="font-display text-xs text-charcoal-500 uppercase tracking-widest">CEO, TechFlow</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-center mt-16 md:mt-0 group cursor-pointer">
                    <div className="aspect-[3/4] bg-gray-200 relative grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                      <Image src="/images/mentor-2.jpg" alt="Mentor" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold uppercase tracking-wider text-sm">Priya Sharma</h4>
                      <p className="font-display text-xs text-charcoal-500 uppercase tracking-widest">Founder, GreenEarth</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-16 border-t border-charcoal-900/10 pt-16">
                  <div className="text-center space-y-4 p-6 bg-[#F7EFE5]">
                    <div className="text-2xl">♡</div>
                    <h4 className="font-body font-bold text-lg">Empathy</h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed font-body">Weve been in your shoes and understand the pressure.</p>
                  </div>
                  <div className="text-center space-y-4 p-6 bg-[#F7EFE5]">
                    <div className="text-2xl">⚡</div>
                    <h4 className="font-body font-bold text-lg">Experience</h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed font-body">Decades of building and scaling successful companies.</p>
                  </div>
                  <div className="text-center space-y-4 p-6 bg-[#F7EFE5]">
                    <div className="text-2xl">☺</div>
                    <h4 className="font-body font-bold text-lg">Availability</h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed font-body">Always just a message away when you need us.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Clean Accordion */}
        <section className="py-20 bg-[#F7EFE5]">
          <div className="container-uplift">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-3">
                <h2 className="text-5xl font-display font-bold uppercase text-charcoal-900">FAQS</h2>
              </div>
              <div className="lg:col-span-9">
                <Accordion type="single" collapsible className="space-y-0 border-t border-charcoal-900">
                  {[
                    "What is your mentorship model?",
                    "Who do you usually work with?",
                    "Why should I need professional coaching as a founder?",
                    "How long does it take?",
                    "Do you have scheduling flexibility?",
                    "Is everything confidential?"
                  ].map((q, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-b border-charcoal-900 px-4">
                      <AccordionTrigger className="font-display font-semibold text-sm uppercase tracking-wider py-6 hover:no-underline hover:text-purple-600">
                        {q}
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-lg pb-6 text-charcoal-700">
                        We believe in a holistic approach. It varies based on individual needs, but typically involves a mix of strategic planning and personal development sessions.
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Purple Block */}
        <section className="py-32 bg-[#5D5FEF] text-white">
          <div className="container-uplift text-center">
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase leading-[0.85] mb-8">
              READY <br /> FOR AN UPLIFT?
            </h2>
            <p className="font-body text-xl text-white/80 max-w-2xl mx-auto mb-12">
              We&apos;re on a mission to make scaling a company smoother by empowering founders to become extraordinary leaders.
            </p>
            <Button asChild className="rounded-full bg-charcoal-900 text-white px-10 py-8 font-display font-bold text-sm tracking-widest uppercase hover:bg-charcoal-800 transition-colors">
              <Link href="/auth/register">Tell Us About You</Link>
            </Button>

            <div className="mt-20 relative h-[300px] w-full max-w-4xl mx-auto overflow-hidden rounded-xl">
              <Image src="/images/cta-team.jpg" alt="Team" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-[#5D5FEF]/20 mix-blend-multiply"></div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
