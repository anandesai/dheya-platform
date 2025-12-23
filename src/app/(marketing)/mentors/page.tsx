"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search, Star, Users, Award, Filter, Loader2, Calendar } from "lucide-react"
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
  { value: "L1", label: "Associate Mentor", color: "bg-blue-100 text-blue-800" },
  { value: "L2", label: "Senior Mentor", color: "bg-green-100 text-green-800" },
  { value: "L3", label: "Lead Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L4", label: "Principal Mentor", color: "bg-amber-100 text-amber-800" },
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
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-forest-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-gold-400">Expert Mentors</span>
            </h1>
            <p className="text-lg text-cream-200 mb-8">
              Our mentors bring decades of experience across industries. They&apos;re committed to
              helping you navigate your career journey with personalized guidance and proven frameworks.
            </p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400">50+</div>
                <div className="text-sm text-cream-200">Expert Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400">18+</div>
                <div className="text-sm text-cream-200">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400">100K+</div>
                <div className="text-sm text-cream-200">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors by name or expertise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden md:inline">Filter by:</span>
              </div>
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[160px]">
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-forest-800">No mentors found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMentors.map((mentor) => {
                const levelConfig = getLevelConfig(mentor.level)
                return (
                  <Card
                    key={mentor.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={mentor.image || undefined} alt={mentor.name} />
                          <AvatarFallback className="text-lg bg-purple-100 text-purple-700">
                            {mentor.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{mentor.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {levelConfig && (
                              <Badge className={levelConfig.color}>{levelConfig.label}</Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Bio */}
                      {mentor.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {mentor.bio}
                        </p>
                      )}

                      {/* Specializations */}
                      {mentor.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {mentor.specializations.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {getSegmentLabel(spec)}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {mentor.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span>{mentor.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{mentor.totalMentees} mentees</span>
                          </div>
                          {mentor.yearsExperience && (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              <span>{mentor.yearsExperience}y exp</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/mentors/${mentor.id}`}>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          View Profile
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
      <section className="bg-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your career goals and find the perfect mentor
            match for your unique journey.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-cream-100"
            >
              Book Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
