"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Star,
    Linkedin,
    Award,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Quote,
} from "lucide-react"

interface Review {
    id: string
    rating: number
    comment: string
    createdAt: string
    user: {
        firstName: string | null
        lastName: string | null
    }
}

interface MentorProfile {
    id: string
    user: {
        firstName: string | null
        lastName: string | null
        image: string | null
    }
    level: string
    specializations: string[]
    certifications: string[]
    bio: string | null
    yearsExperience: number | null
    linkedinUrl: string | null
    totalMentees: number
    rating: number | null
    reviews: Review[]
}

const LEVELS: Record<string, { label: string; color: string; description: string }> = {
    L1: { label: "Associate Mentor", color: "bg-blue-100 text-blue-800", description: "Certified to guide early career professionals." },
    L2: { label: "Senior Mentor", color: "bg-green-100 text-green-800", description: "Expert in mid-career transitions and growth." },
    L3: { label: "Lead Mentor", color: "bg-purple-100 text-purple-800", description: "Master mentor for leadership and complex scenarios." },
    L4: { label: "Principal Mentor", color: "bg-amber-100 text-amber-800", description: "Industry veteran training other mentors." },
}

export default function MentorProfilePage({ params }: { params: { id: string } }) {
    const [mentor, setMentor] = useState<MentorProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetchMentor()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id])

    const fetchMentor = async () => {
        try {
            const response = await fetch(`/api/mentors/${params.id}`)
            if (response.status === 404) {
                notFound()
            }
            if (!response.ok) throw new Error("Failed to fetch mentor")

            const data = await response.json()
            setMentor(data.mentor)
        } catch (err) {
            console.error(err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-50">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        )
    }

    if (error || !mentor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50">
                <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-4">Mentor Not Found</h2>
                <Button asChild variant="outline">
                    <Link href="/mentors">Back to Mentors</Link>
                </Button>
            </div>
        )
    }

    const levelConfig = LEVELS[mentor.level] || LEVELS.L1
    const fullName = [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ")

    return (
        <div className="min-h-screen bg-cream-50 pb-20">
            {/* Header Background */}
            <div className="h-64 bg-charcoal-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 to-purple-900 opacity-90" />
                <div className="container-uplift h-full flex items-center relative z-10">
                    <Link href="/mentors" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors mb-auto pt-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Mentors
                    </Link>
                </div>
            </div>

            <div className="container-uplift -mt-32 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1">
                        <Card variant="light" className="sticky top-24 border-t-4 border-t-purple-500 shadow-xl">
                            <CardContent className="pt-8 text-center">
                                <div className="relative inline-block">
                                    <Avatar className="w-32 h-32 border-4 border-white shadow-md mx-auto mb-4">
                                        <AvatarImage src={mentor.user.image || undefined} alt={fullName} />
                                        <AvatarFallback className="text-3xl bg-purple-100 text-purple-700 font-display font-bold">
                                            {fullName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Badge className="absolute bottom-2 right-0 bg-gold-400 text-charcoal-900 border-2 border-white">
                                        {mentor.rating?.toFixed(1) || "New"} <Star className="w-3 h-3 ml-1 fill-charcoal-900" />
                                    </Badge>
                                </div>

                                <h1 className="text-2xl font-display font-bold text-charcoal-900 mb-1">{fullName}</h1>
                                <p className="text-purple-600 font-medium mb-4">{levelConfig.label}</p>

                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                    {mentor.specializations.map(spec => (
                                        <Badge key={spec} variant="outline" className="bg-cream-50 text-charcoal-600 border-cream-300">
                                            {spec.replace("_", " ")}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-cream-200 mb-6">
                                    <div>
                                        <div className="text-2xl font-bold font-display text-charcoal-800">{mentor.yearsExperience}+</div>
                                        <div className="text-xs text-charcoal-500 uppercase tracking-wider">Years Exp</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold font-display text-charcoal-800">{mentor.totalMentees}</div>
                                        <div className="text-xs text-charcoal-500 uppercase tracking-wider">Mentees</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full font-bold shadow-md" size="lg" variant="uplift" asChild>
                                        <Link href={`/contact?mentor=${mentor.id}`}>
                                            Book Free Consultation
                                        </Link>
                                    </Button>
                                    <Button className="w-full" variant="outline" asChild>
                                        <Link href={`/sessions/book?mentorId=${mentor.id}`}>
                                            Book Session (Clients)
                                        </Link>
                                    </Button>
                                </div>

                                {mentor.linkedinUrl && (
                                    <div className="mt-6 pt-6 border-t border-cream-200">
                                        <Link href={mentor.linkedinUrl} target="_blank" className="text-charcoal-500 hover:text-blue-600 transition-colors inline-flex items-center gap-2">
                                            <Linkedin className="w-4 h-4" />
                                            <span className="text-sm">View LinkedIn Profile</span>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Section */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-cream-200">
                            <h2 className="text-xl font-display font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                                <UserCardIcon className="w-5 h-5 text-purple-500" />
                                About Me
                            </h2>
                            <div className="prose prose-charcoal max-w-none font-body text-charcoal-600">
                                <p className="whitespace-pre-line leading-relaxed">{mentor.bio || "No biography available."}</p>
                            </div>
                        </div>

                        {/* Expertise & Certifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-200">
                                <h3 className="font-display font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-gold-500" />
                                    Certifications
                                </h3>
                                <ul className="space-y-3">
                                    {mentor.certifications && mentor.certifications.length > 0 ? (
                                        mentor.certifications.map((cert, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-charcoal-700">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                <span>{cert}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-charcoal-400 italic text-sm">No certifications listed</li>
                                    )}
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-200">
                                <h3 className="font-display font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-purple-500" />
                                    Mentor Level
                                </h3>
                                <Badge className={`${levelConfig.color} border-0 mb-3 px-3 py-1 text-sm`}>
                                    {levelConfig.label}
                                </Badge>
                                <p className="text-sm text-charcoal-600 font-body leading-relaxed">
                                    {levelConfig.description}
                                </p>
                            </div>
                        </div>

                        {/* User Reviews */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-cream-200">
                            <h2 className="text-xl font-display font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                                <Quote className="w-5 h-5 text-purple-500" />
                                Mentee Reviews
                            </h2>

                            <div className="space-y-6">
                                {mentor.reviews && mentor.reviews.length > 0 ? (
                                    mentor.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-cream-100 last:border-0 pb-6 last:pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="bg-sage-100 text-sage-700 text-xs">
                                                            {review.user.firstName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-charcoal-800 text-sm">
                                                        {review.user.firstName} {review.user.lastName}
                                                    </span>
                                                </div>
                                                <div className="flex text-gold-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-gold-400" : "text-cream-300 fill-cream-300"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-charcoal-600 text-sm font-body italic">
                                                &ldquo;{review.comment}&rdquo;
                                            </p>
                                            <p className="text-xs text-charcoal-400 mt-2">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-charcoal-400 bg-cream-50 rounded-lg">
                                        No reviews yet. Be the first to review!
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function UserCardIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        </svg>
    )
}
