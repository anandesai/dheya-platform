"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Clock, Calendar, Share2, ArrowRight } from "lucide-react"

import { RESOURCES } from "@/lib/data/resources"

export default function ArticlePage({ params }: { params: { id: string } }) {
    const article = RESOURCES.find(r => r.id === params.id)

    if (!article) {
        return notFound()
    }

    return (
        <div className="min-h-screen section-cream pb-20">
            {/* Article Hero */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-charcoal-900">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="container-uplift">
                        <div className="max-w-3xl">
                            <Link
                                href="/resources"
                                className="inline-flex items-center text-cream-200 hover:text-white mb-6 transition-colors font-body text-sm"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Resources
                            </Link>
                            <div className="flex flex-wrap gap-4 items-center mb-6">
                                <Badge className="bg-purple-500 text-white border-none">
                                    {article.category}
                                </Badge>
                                <div className="flex items-center text-cream-200 text-sm font-body">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {article.readTime} Read
                                </div>
                                <div className="flex items-center text-cream-200 text-sm font-body">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {article.date}
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                                {article.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-lg text-cream-100 font-body italic">
                                    By {article.author}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-uplift mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-cream-200">
                            <p className="font-body text-xl text-charcoal-600 mb-8 italic border-l-4 border-purple-500 pl-6 py-2">
                                {article.excerpt}
                            </p>

                            <div
                                className="prose prose-lg prose-charcoal max-w-none font-body text-charcoal-700"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            <div className="mt-12 pt-8 border-t border-cream-200 flex justify-between items-center">
                                <div className="font-display font-bold text-charcoal-900">
                                    Share this article
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Assessment CTA */}
                        <Card variant="light" className="bg-charcoal-900 border-none text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 blur-[80px] opacity-20" />
                            <CardHeader>
                                <CardTitle className="font-display text-2xl mb-2 text-white">Know Where You Stand</CardTitle>
                                <CardDescription className="text-cream-200">
                                    Are you experiencing BBD? Take our 2-minute assessment to find out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-white text-charcoal-900 hover:bg-cream-100 font-bold" asChild>
                                    <Link href="/assessments/bbd">
                                        Take Free Assessment <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Articles */}
                        <div className="bg-white rounded-xl border border-cream-200 p-6">
                            <h3 className="font-display font-bold text-charcoal-900 mb-4">Related Reading</h3>
                            <div className="space-y-4">
                                {RESOURCES.filter(r => r.id !== article.id).slice(0, 3).map(related => (
                                    <Link key={related.id} href={`/resources/${related.id}`} className="block group">
                                        <h4 className="font-body font-bold text-charcoal-800 group-hover:text-purple-600 transition-colors">
                                            {related.title}
                                        </h4>
                                        <p className="text-xs text-charcoal-500 mt-1">{related.readTime} Read</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
