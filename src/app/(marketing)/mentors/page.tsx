"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Star, Users, Award, Filter, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PublicMentor {
  id: string
  name: string
  image: string | null
  level: "L1" | "L2" | "L3" | "L4"
  specializations: string[]
  bio: string | null
  yearsExperience: number | null
  rating: number | null
  totalMentees: number
}

const LEVELS = [
  { value: "L1", label: "Associate Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L2", label: "Senior Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L3", label: "Lead Mentor", color: "bg-gold-100 text-gold-800" },
  { value: "L4", label: "Principal Mentor", color: "bg-gold-100 text-gold-800" },
]

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career", description: "For professionals aged 22-30" },
  { value: "MID_CAREER", label: "Mid Career", description: "For professionals aged 30-45" },
  { value: "SENIOR", label: "Senior", description: "For professionals aged 45+" },
  { value: "RETURNING_WOMEN", label: "Returning Women", description: "For women re-entering workforce" },
]

export default function MentorsPage() {
  const [mentors, setMentors] = useState<PublicMentor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")

  useEffect(() => {
    fetchMentors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelFilter, segmentFilter])

  const fetchMentors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (levelFilter && levelFilter !== "all") params.set("level", levelFilter)
      if (segmentFilter && segmentFilter !== "all") params.set("specialization", segmentFilter)

      const response = await fetch(`/api/mentors?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch mentors")

      const data = await response.json()
      setMentors(data.mentors || [])
    } catch (error) {
      console.error("Error fetching mentors:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMentors = mentors.filter((mentor) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      mentor.name.toLowerCase().includes(searchLower) ||
      mentor.bio?.toLowerCase().includes(searchLower) ||
      mentor.specializations.some((s) => s.toLowerCase().includes(searchLower))
    )
  })

  const getLevelConfig = (level: string) => {
    return LEVELS.find((l) => l.value === level)
  }

  const getSegmentLabel = (segment: string) => {
    return SEGMENTS.find((s) => s.value === segment)?.label || segment
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Hero Section */}
      <section className="section-charcoal section-padding">
        <div className="container-uplift">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display text-white mb-6">
              Meet Our <span className="text-gold-400">Expert Mentors</span>
            </h1>
            <p className="text-body-lg text-cream-200 mb-12 max-w-2xl mx-auto">
              Our mentors bring decades of experience across industries. They&apos;re committed to
              helping you navigate your career journey with personalized guidance and proven frameworks.
            </p>

            {/* Stats - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-charcoal-600 pt-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-gold-400">50+</div>
                <div className="text-micro text-cream-300 mt-2">Expert Mentors</div>
              </div>
              <div className="text-center border-t md:border-t-0 md:border-l border-charcoal-600 pt-8 md:pt-0 md:pl-8">
                <div className="text-4xl md:text-5xl font-display font-bold text-gold-400">18+</div>
                <div className="text-micro text-cream-300 mt-2">Years Avg. Experience</div>
              </div>
              <div className="text-center border-t md:border-t-0 md:border-l border-charcoal-600 pt-8 md:pt-0 md:pl-8">
                <div className="text-4xl md:text-5xl font-display font-bold text-gold-400">100K+</div>
                <div className="text-micro text-cream-300 mt-2">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section - Sticky */}
      <section className="bg-white/80 backdrop-blur-md border-b border-cream-200 sticky top-0 z-40 shadow-sm">
        <div className="container-uplift py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-400" />
              <Input
                placeholder="Search mentors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-cream-50 border-cream-300 focus:border-purple-500 rounded-full h-10 transition-shadow focus:shadow-md"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex items-center gap-2 pr-2 border-r border-cream-200 mr-2 md:hidden">
                <Filter className="h-4 w-4 text-charcoal-500" />
              </div>
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-[160px] md:w-[180px] rounded-full border-cream-300 bg-white h-10">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {SEGMENTS.map((segment) => (
                    <SelectItem key={segment.value} value={segment.value}>
                      {segment.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[130px] md:w-[160px] rounded-full border-cream-300 bg-white h-10">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="section-cream section-padding-sm flex-1">
        <div className="container-uplift">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
              <p className="text-charcoal-500 font-body">Finding your perfect match...</p>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-cream-300">
              <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-charcoal-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal-800">No mentors found</h3>
              <p className="text-charcoal-500 mt-2 font-body max-w-sm mx-auto">
                We couldn&apos;t find any mentors matching your criteria. Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearch("")
                  setLevelFilter("all")
                  setSegmentFilter("all")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredMentors.map((mentor) => {
                const levelConfig = getLevelConfig(mentor.level)
                return (
                  <Card
                    key={mentor.id}
                    variant="light"
                    hover="lift"
                    className="overflow-hidden flex flex-col group h-full"
                  >
                    <div className="relative h-2 bg-gradient-to-r from-purple-500 to-sage-400" />
                    <CardHeader className="pb-4 pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md ring-1 ring-cream-200">
                          <AvatarImage src={mentor.image || undefined} alt={mentor.name} className="object-cover" />
                          <AvatarFallback className="text-xl bg-purple-50 text-purple-700 font-display font-bold">
                            {mentor.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 pt-1">
                          <CardTitle className="text-xl font-display text-charcoal-900 truncate group-hover:text-purple-600 transition-colors">
                            {mentor.name}
                          </CardTitle>
                          <div className="mt-2 text-charcoal-600">
                            {levelConfig && (
                              <Badge
                                variant="secondary"
                                className={`${levelConfig.color} border-0 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide`}
                              >
                                {levelConfig.label}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-2 flex-1 flex flex-col">
                      {/* Bio */}
                      <div className="flex-1">
                        {mentor.bio ? (
                          <p className="text-sm text-charcoal-600 line-clamp-3 font-body leading-relaxed">
                            {mentor.bio}
                          </p>
                        ) : (
                          <p className="text-sm text-charcoal-400 italic">No bio available</p>
                        )}

                        {/* Specializations */}
                        {mentor.specializations.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {mentor.specializations.slice(0, 3).map((spec) => (
                              <Badge key={spec} variant="outline" className="text-[10px] bg-cream-50/50 border-cream-200 text-charcoal-600">
                                {getSegmentLabel(spec)}
                              </Badge>
                            ))}
                            {mentor.specializations.length > 3 && (
                              <Badge variant="outline" className="text-[10px] border-dashed border-cream-300 text-charcoal-400">
                                +{mentor.specializations.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-cream-100 mt-auto">
                        <div className="flex items-center gap-4 text-xs font-medium text-charcoal-500">
                          {mentor.rating && (
                            <div className="flex items-center gap-1 text-charcoal-700">
                              <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                              <span>{mentor.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{mentor.totalMentees}</span>
                          </div>
                          {mentor.yearsExperience && (
                            <div className="flex items-center gap-1">
                              <Award className="h-3.5 w-3.5" />
                              <span>{mentor.yearsExperience}y</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/mentors/${mentor.id}`} className="block">
                        <Button variant="upliftOutline" className="w-full h-10 text-sm group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all duration-300">
                          View Profile
                          <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-purple section-padding">
        <div className="container-uplift text-center">
          <h2 className="text-display-sm text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-body-lg text-purple-100 mb-10 max-w-2xl mx-auto">
            Book a free consultation to discuss your career goals and find the perfect mentor
            match for your unique journey.
          </p>
          <Link href="/contact">
            <Button
              size="xl"
              className="bg-white text-purple-700 hover:bg-cream-50 border-2 border-transparent font-display font-semibold transition-transform hover:-translate-y-1"
            >
              Book Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
