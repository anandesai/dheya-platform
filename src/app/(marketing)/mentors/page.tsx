"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle } from "@/components/ui/card"
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
import { Search, Star, Users, Award, Loader2 } from "lucide-react"
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
  { value: "L3", label: "Lead Mentor", color: "bg-sage-100 text-sage-800" },
  { value: "L4", label: "Principal Mentor", color: "bg-charcoal-900 text-white" },
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
    <div className="min-h-screen bg-[#FDF8F0] flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 border-b border-charcoal-900/10">
        <div className="container-uplift relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-charcoal-200 text-charcoal-900 text-xs font-bold uppercase tracking-widest mb-8">
            <Star className="w-3 h-3 fill-purple-600 text-purple-600" />
            World-Class Guidance
          </div>
          <h1 className="text-display text-charcoal-900 mb-8 leading-[0.85]">
            MASTER YOUR CRAFT WITH <br />
            <span className="text-[#5D5FEF]">INDUSTRY LEGENDS</span>
          </h1>
          <p className="text-body-lg text-charcoal-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with mentors who have walked the path you wish to take.
            Gain access to decades of wisdom, personalized strategies, and the
            network you need to accelerate your career.
          </p>

          {/* Stats - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl border border-charcoal-900/10">
              <div className="text-5xl font-display font-bold text-charcoal-900">50+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mt-2">Expert Mentors</div>
            </div>
            <div className="bg-white p-8 rounded-xl border border-charcoal-900/10">
              <div className="text-5xl font-display font-bold text-charcoal-900">18+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mt-2">Years Avg. Experience</div>
            </div>
            <div className="bg-white p-8 rounded-xl border border-charcoal-900/10">
              <div className="text-5xl font-display font-bold text-charcoal-900">100K+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mt-2">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-40 transition-all duration-300 pointer-events-none bg-[#FDF8F0]/80 backdrop-blur-md border-b border-charcoal-900/5">
        <div className="container-uplift py-4 pointer-events-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-500" />
              <Input
                placeholder="Search mentors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 bg-white border-charcoal-200 focus:border-purple-600 focus:ring-purple-200 rounded-full h-12 text-charcoal-800"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 px-1 scrollbar-hide">
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-[180px] rounded-full bg-white border-charcoal-200 hover:border-purple-400 h-12 text-charcoal-700 font-medium">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-charcoal-100 shadow-xl bg-white">
                  <SelectItem value="all">All Specializations</SelectItem>
                  {SEGMENTS.map((segment) => (
                    <SelectItem key={segment.value} value={segment.value}>
                      {segment.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[160px] rounded-full bg-white border-charcoal-200 hover:border-purple-400 h-12 text-charcoal-700 font-medium">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-charcoal-100 shadow-xl bg-white">
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
      <section className="py-20 flex-1">
        <div className="container-uplift">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
              <p className="text-charcoal-500 font-body">Finding your perfect match...</p>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-charcoal-300">
              <div className="w-16 h-16 bg-[#FDF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-charcoal-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal-800">No mentors found</h3>
              <p className="text-charcoal-500 mt-2 font-body max-w-sm mx-auto">
                We couldn&apos;t find any mentors matching your criteria. Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
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
            <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredMentors.map((mentor) => {
                const levelConfig = getLevelConfig(mentor.level)
                return (
                  <Card
                    key={mentor.id}
                    className="group relative border border-charcoal-900/10 bg-white rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-200 transition-all duration-300"
                  >
                    <div className="p-8 h-full flex flex-col relative">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="relative">
                          <Avatar className="h-20 w-20 border-2 border-charcoal-100">
                            <AvatarImage src={mentor.image || undefined} alt={mentor.name} className="object-cover" />
                            <AvatarFallback className="text-2xl bg-[#FDF8F0] text-purple-700 font-display font-bold">
                              {mentor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {levelConfig && (
                            <Badge
                              className={`absolute -bottom-2 -right-2 text-[10px] px-2 py-0.5 border border-white shadow-sm ${levelConfig.color}`}
                            >
                              {levelConfig.label}
                            </Badge>
                          )}
                        </div>
                        <div className="pt-2">
                          <CardTitle className="text-xl font-display font-bold text-charcoal-900 group-hover:text-purple-700 transition-colors uppercase">
                            {mentor.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-xs font-bold text-charcoal-500 mt-1 uppercase tracking-wider">
                            <Award className="w-3 h-3" />
                            <span>
                              {getSegmentLabel(mentor.specializations[0] || "Mentor")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="min-h-[80px] mb-6">
                        {mentor.bio ? (
                          <p className="text-sm text-charcoal-600 line-clamp-3 font-body leading-relaxed">
                            {mentor.bio}
                          </p>
                        ) : (
                          <p className="text-sm text-charcoal-400 italic">No bio available</p>
                        )}
                      </div>

                      {/* Skills Pills */}
                      {mentor.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {mentor.specializations.slice(0, 3).map((spec) => (
                            <span key={spec} className="px-2.5 py-1 rounded-md bg-[#FDF8F0] border border-charcoal-100 text-charcoal-600 text-xs font-semibold uppercase tracking-wide">
                              {getSegmentLabel(spec)}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-6 border-t border-charcoal-100 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-charcoal-900 font-bold font-display">
                            <span className="text-lg">{mentor.totalMentees}</span>
                            <span className="text-xs font-medium text-charcoal-500 uppercase tracking-wide">Mentees</span>
                          </div>
                          {mentor.rating && (
                            <div className="flex items-center gap-1 text-xs font-medium text-charcoal-500">
                              <Star className="w-3 h-3 fill-sage-400 text-sage-400" />
                              {mentor.rating.toFixed(1)} Rating
                            </div>
                          )}
                        </div>
                        <Link href={`/mentors/${mentor.id}`}>
                          <Button size="sm" className="rounded-full px-5 bg-charcoal-900 text-white hover:bg-purple-600 transition-colors uppercase font-bold text-xs tracking-wider">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#5D5FEF] py-32 text-center text-white">
        <div className="container-uplift relative z-10 text-center">
          <h2 className="text-display mb-8 text-white">
            EXPERT GUIDANCE <br />
            IS A CLICK AWAY
          </h2>
          <p className="text-xl font-body text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t navigate your career alone. Book a free discovery call to discuss your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
              <Button
                size="xl"
                className="bg-white text-purple-900 hover:bg-white/90 font-display font-bold px-10 py-8 text-sm uppercase tracking-widest rounded-full"
              >
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
