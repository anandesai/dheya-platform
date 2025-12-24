
// import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
import {
    Compass,
    Target,
    Globe,
    Fingerprint
} from "lucide-react"

export const metadata = {
    title: "Philosophy | Uplift Founders",
    description: "Discover our identity-first approach to career development.",
}

export default function PhilosophyPage() {
    return (
        <div className="bg-[#FDF8F0] min-h-screen">
            {/* Hero Section */}
            <section className="pt-20 pb-32 border-b border-charcoal-900/10">
                <div className="container-uplift text-center max-w-4xl mx-auto">
                    <span className="font-display font-bold text-xs uppercase tracking-widest text-purple-600 mb-6 block">The Methodology</span>
                    <h1 className="text-display text-charcoal-900 mb-8 leading-[0.85]">
                        IDENTITY FIRST <br /> DEVELOPMENT
                    </h1>
                    <p className="font-body text-xl text-charcoal-700 leading-relaxed">
                        Most career advice asks &quot;What can you do?&quot; We ask <span className="font-bold">&quot;Who are you?&quot;</span>. We integrate ancient wisdom with modern neuroscience to help you discover not just a job, but your <span className="italic">Dharma</span>.
                    </p>
                </div>
            </section>

            {/* 5-95 Rule */}
            <section className="py-32 bg-[#F7EFE5]">
                <div className="container-uplift">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-display-sm text-charcoal-900 mb-8">THE 5-95 RULE</h2>
                            <p className="font-body text-lg text-charcoal-700 leading-relaxed mb-6">
                                We challenge the assumption of traditional education. Only <span className="font-bold">5%</span> of meaningful development comes from classrooms. The remaining <span className="font-bold">95%</span> comes from the world.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-white p-6 border border-charcoal-900/10 w-1/2">
                                    <span className="block text-4xl font-display font-bold text-charcoal-300">5%</span>
                                    <span className="text-xs uppercase tracking-widest font-bold">Classroom</span>
                                </div>
                                <div className="bg-[#5D5FEF] text-white p-6 w-1/2">
                                    <span className="block text-4xl font-display font-bold text-white">95%</span>
                                    <span className="text-xs uppercase tracking-widest font-bold">Real World</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-square bg-charcoal-900 rounded-full flex items-center justify-center p-12">
                            <Globe className="w-32 h-32 text-white opacity-20" />
                            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TriFit Confluence */}
            <section className="py-32 bg-[#FDF8F0]">
                <div className="container-uplift">
                    <div className="text-center mb-16">
                        <h2 className="text-display-sm text-charcoal-900">TRIFIT CONFLUENCE™</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="border border-charcoal-900/10 p-8 hover:bg-[#C8D1A3] transition-colors duration-500 group">
                            <Fingerprint className="w-8 h-8 text-charcoal-900 mb-6" />
                            <h3 className="font-display font-bold text-xl uppercase mb-2">Swabhava</h3>
                            <p className="font-body text-charcoal-600 group-hover:text-charcoal-900">Your authentic self. Innate talents and personality.</p>
                        </div>
                        <div className="border border-charcoal-900/10 p-8 bg-charcoal-900 text-white transform md:-translate-y-8">
                            <Globe className="w-8 h-8 text-white mb-6" />
                            <h3 className="font-display font-bold text-xl uppercase mb-2">Dharma</h3>
                            <p className="font-body text-gray-300">Your role in the world. Contribution to society.</p>
                        </div>
                        <div className="border border-charcoal-900/10 p-8 hover:bg-[#C8D1A3] transition-colors duration-500 group">
                            <Target className="w-8 h-8 text-charcoal-900 mb-6" />
                            <h3 className="font-display font-bold text-xl uppercase mb-2">Artha</h3>
                            <p className="font-body text-charcoal-600 group-hover:text-charcoal-900">Your aspirations. Financial goals and lifestyle.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Total Growth Compass */}
            <section className="py-32 bg-[#C8D1A3] border-y border-charcoal-900">
                <div className="container-uplift">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-display-sm text-charcoal-900 mb-8">TOTAL GROWTH COMPASS™</h2>
                            <p className="font-body text-xl text-charcoal-800 leading-relaxed mb-8">
                                Success isn&apos;t just about career. It&apos;s about balance. We ensure you develop across four interconnected dimensions.
                            </p>
                            <ul className="space-y-4 font-display font-bold text-charcoal-900 uppercase text-sm tracking-widest">
                                <li className="flex items-center gap-4"><div className="w-2 h-2 bg-charcoal-900 rounded-full"></div> Behavioral Excellence</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-2 bg-charcoal-900 rounded-full"></div> Career Mastery</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-2 bg-charcoal-900 rounded-full"></div> Knowledge Wisdom</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-2 bg-charcoal-900 rounded-full"></div> Life Balance</li>
                            </ul>
                        </div>
                        <div className="relative aspect-square">
                            <div className="absolute inset-0 bg-[#FDF8F0] rounded-full border border-charcoal-900/20 p-20">
                                <Compass className="w-full h-full text-charcoal-900 stroke-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7D Mentoring Model */}
            <section className="py-32 bg-[#FDF8F0]">
                <div className="container-uplift">
                    <h2 className="text-display-sm text-charcoal-900 mb-16 text-center">THE 7D JOURNEY</h2>

                    <div className="space-y-0 border-l border-charcoal-900 ml-4 md:ml-1/2 md:border-l-0 md:relative">
                        {/* Center Line for Desktop */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-charcoal-900"></div>

                        {[
                            { num: "01", title: "Discover", desc: "Uncover your authentic self" },
                            { num: "02", title: "Direction", desc: "Define your path" },
                            { num: "03", title: "Dream", desc: "Visualize your ideal future" },
                            { num: "04", title: "Drive", desc: "Build motivation" },
                            { num: "05", title: "Design", desc: "Create your roadmap" },
                            { num: "06", title: "Develop", desc: "Execute learning" },
                            { num: "07", title: "Destination", desc: "Achieve alignment" }
                        ].map((step, i) => (
                            <div key={i} className={`flex md:items-center mb-12 relative ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className="w-12 h-12 bg-charcoal-900 text-white font-display font-bold flex items-center justify-center rounded-full absolute left-0 md:left-1/2 md:-translate-x-1/2 -ml-6 border-4 border-[#FDF8F0] z-10">
                                    {step.num}
                                </div>
                                <div className="pl-12 md:pl-0 md:w-1/2 md:px-12">
                                    <div className={`md:text-${i % 2 === 0 ? 'right' : 'left'}`}>
                                        <h3 className="font-display font-bold text-2xl uppercase">{step.title}</h3>
                                        <p className="font-body text-charcoal-600">{step.desc}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block md:w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-charcoal-900 py-32 text-center text-white">
                <div className="container-uplift">
                    <h2 className="text-display-sm mb-8">START YOUR JOURNEY</h2>
                    <p className="font-body text-xl max-w-2xl mx-auto mb-12 text-white/70">
                        Stop guessing. Start building a career built on your unique identity.
                    </p>
                    <Button asChild className="rounded-full bg-[#5D5FEF] text-white hover:bg-purple-600 px-10 py-8 font-display font-bold text-sm tracking-widest uppercase">
                        <Link href="/auth/register">Begin Assessment</Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
