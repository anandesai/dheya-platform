"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Clock } from "lucide-react"

import { RESOURCES } from "@/lib/data/resources"

export default function ResourcesPage() {
    return (
        <div className="min-h-screen section-cream">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-charcoal-900">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/images/hero.png"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container-uplift relative z-10 text-center">
                    <Badge className="bg-purple-500 text-white mb-6">Knowledge Hub</Badge>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
                        Insights for Your <span className="text-purple-400">Next Chapter</span>
                    </h1>
                    <p className="text-lg md:text-xl text-cream-100 max-w-2xl mx-auto font-body leading-relaxed">
                        Curated articles, guides, and frameworks to help you navigate mid-career transitions, leadership challenges, and personal growth.
                    </p>
                </div>
            </section>

            {/* Featured Articles Grid */}
            <section className="py-20">
                <div className="container-uplift space-y-12">

                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="heading-section text-charcoal-900">Latest Articles</h2>
                            <p className="text-charcoal-600 font-body text-lg mt-2">Expert perspectives on career and life.</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            {["All", "Career Transition", "Strategy", "Wellness"].map((cat) => (
                                <Button key={cat} variant={cat === "All" ? "uplift" : "outline"} size="sm" className="rounded-full">
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {RESOURCES.map((resource) => (
                            <Card key={resource.id} variant="light" hover="lift" className="flex flex-col h-full overflow-hidden border-cream-200">
                                <div className="relative h-48 w-full bg-charcoal-100">
                                    <Image
                                        src={resource.image}
                                        alt={resource.title}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/90 text-charcoal-900 backdrop-blur-sm font-bold shadow-sm">
                                            {resource.category}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-2 font-display uppercase tracking-widest">
                                        <Clock className="w-3 h-3" />
                                        {resource.readTime} Read
                                    </div>
                                    <CardTitle className="font-display text-xl font-bold text-charcoal-900 leading-tight">
                                        {resource.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <CardDescription className="text-charcoal-600 font-body mb-6 line-clamp-3">
                                        {resource.excerpt}
                                    </CardDescription>
                                    <Link href={`/resources/${resource.id}`} className="inline-flex items-center text-purple-600 font-bold hover:text-purple-700 transition-colors group">
                                        Read Article
                                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="bg-sage-100 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-display font-bold text-charcoal-900 mb-4">Ready to go deeper?</h2>
                        <p className="text-charcoal-700 font-body mb-8 max-w-2xl mx-auto">
                            Our mentorship programs provide personalized guidance based on these frameworks.
                            Start by assessing your current state.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/assessments/bbd">
                                <Button variant="uplift" size="lg">Take BBD Assessment</Button>
                            </Link>
                            <Link href="/programs">
                                <Button variant="outline" size="lg" className="bg-white border-white text-charcoal-900 hover:bg-cream-50">Explore Programs</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
