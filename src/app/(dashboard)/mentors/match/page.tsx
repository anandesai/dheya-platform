"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sparkles,
  Star,
  Users,
  Award,
  Calendar,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MatchedMentor {
  id: string
  userId: string
  level: string
  specializations: string[]
  bio: string | null
  yearsExperience: number | null
  totalMentees: number
  rating: number | null
  matchScore: number
  matchReasons: string[]
  user: {
    firstName: string | null
    lastName: string | null
    email: string
    image: string | null
  }
  availability: Array<{
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
}

const LEVELS = [
  { value: "L1", label: "Certified Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L2", label: "Expert Mentor", color: "bg-green-100 text-green-800" },
  { value: "L3", label: "Master Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L4", label: "Accredited Trainer", color: "bg-amber-100 text-amber-800" },
]

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career" },
  { value: "MID_CAREER", label: "Mid Career" },
  { value: "SENIOR", label: "Senior" },
  { value: "RETURNING_WOMEN", label: "Returning Women" },
]

export default function MentorMatchingPage() {
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter() // Reserved for future navigation
  const [mentors, setMentors] = useState<MatchedMentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<MatchedMentor[]>([])
  const [loading, setLoading] = useState(true)
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [specializationFilter, setSpecializationFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("match")

  useEffect(() => {
    if (session?.user) {
      fetchMatchedMentors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    applyFiltersAndSort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentors, levelFilter, specializationFilter, sortBy])

  const fetchMatchedMentors = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/mentors/match")
      if (!response.ok) {
        throw new Error("Failed to fetch matched mentors")
      }

      const data = await response.json()
      setMentors(data.mentors || [])
    } catch (error) {
      console.error("Error fetching matched mentors:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...mentors]

    // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter((mentor) => mentor.level === levelFilter)
    }

    // Apply specialization filter
    if (specializationFilter !== "all") {
      filtered = filtered.filter((mentor) =>
        mentor.specializations.includes(specializationFilter)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match":
          return b.matchScore - a.matchScore
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "experience":
          return (b.yearsExperience || 0) - (a.yearsExperience || 0)
        default:
          return 0
      }
    })

    setFilteredMentors(filtered)
  }

  const getLevelConfig = (level: string) => {
    return LEVELS.find((l) => l.value === level)
  }

  const getSegmentLabel = (segment: string) => {
    return SEGMENTS.find((s) => s.value === segment)?.label || segment
  }

  const getMentorName = (mentor: MatchedMentor) => {
    const { firstName, lastName } = mentor.user
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return firstName || lastName || "Mentor"
  }

  const getMatchPercentage = (score: number) => {
    return Math.round(score)
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-gray-600"
  }

  const getMatchBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 60) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Powered by Smart Matching</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Mentor
            </h1>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto">
              We&apos;ve analyzed your profile, career goals, and package to match you with
              mentors who can guide you toward success.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter & Sort:</span>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match Score</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Matched Mentors Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Finding your perfect mentors...</p>
              </div>
            </div>
          ) : filteredMentors.length === 0 ? (
            <Card variant="light" className="max-w-2xl mx-auto">
              <CardContent className="py-16 text-center">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No mentors match your filters
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more mentors
                </p>
                <Button
                  variant="upliftOutline"
                  onClick={() => {
                    setLevelFilter("all")
                    setSpecializationFilter("all")
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredMentors.map((mentor) => {
                const levelConfig = getLevelConfig(mentor.level)
                const matchPercentage = getMatchPercentage(mentor.matchScore)
                const matchColor = getMatchColor(mentor.matchScore)
                const matchBadgeColor = getMatchBadgeColor(mentor.matchScore)

                return (
                  <Card
                    key={mentor.id}
                    variant="light"
                    hover="lift"
                    className="overflow-hidden"
                  >
                    <div className="md:flex">
                      {/* Left: Match Score Banner */}
                      <div className="bg-gradient-to-br from-purple-50 to-cream-50 md:w-48 flex md:flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-purple-100">
                        <div className="text-center">
                          <div className="mb-2">
                            <TrendingUp className={`h-8 w-8 mx-auto ${matchColor}`} />
                          </div>
                          <div className={`text-4xl font-bold ${matchColor} mb-1`}>
                            {matchPercentage}%
                          </div>
                          <Badge className={`${matchBadgeColor} border`}>
                            Match Score
                          </Badge>
                        </div>
                      </div>

                      {/* Right: Mentor Details */}
                      <div className="flex-1">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-20 w-20 border-2 border-purple-100">
                              <AvatarImage
                                src={mentor.user.image || undefined}
                                alt={getMentorName(mentor)}
                              />
                              <AvatarFallback className="text-2xl bg-purple-100 text-purple-700 font-semibold">
                                {getMentorName(mentor).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-2xl mb-2">
                                    {getMentorName(mentor)}
                                  </CardTitle>
                                  {levelConfig && (
                                    <Badge className={`${levelConfig.color} mb-3`}>
                                      {levelConfig.label}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Match Reasons */}
                              <div className="space-y-2 mb-4">
                                {mentor.matchReasons.map((reason, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-gray-700"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Bio */}
                          {mentor.bio && (
                            <p className="text-gray-700 leading-relaxed line-clamp-2">
                              {mentor.bio}
                            </p>
                          )}

                          {/* Specializations */}
                          {mentor.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {mentor.specializations.map((spec) => (
                                <Badge
                                  key={spec}
                                  variant="outline"
                                  className="bg-sage-50 border-sage-200 text-sage-800"
                                >
                                  {getSegmentLabel(spec)}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Stats & CTA */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              {mentor.rating && (
                                <div className="flex items-center gap-1.5">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span className="font-medium">
                                    {mentor.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-purple-600" />
                                <span>{mentor.totalMentees} mentees</span>
                              </div>
                              {mentor.yearsExperience && (
                                <div className="flex items-center gap-1.5">
                                  <Award className="h-4 w-4 text-purple-600" />
                                  <span>{mentor.yearsExperience} years</span>
                                </div>
                              )}
                              {mentor.availability.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4 text-green-600" />
                                  <span className="text-green-600 font-medium">
                                    Available
                                  </span>
                                </div>
                              )}
                            </div>

                            <Link href={`/sessions/book?mentorId=${mentor.id}`}>
                              <Button variant="uplift" size="lg" className="w-full sm:w-auto">
                                <Calendar className="h-4 w-4" />
                                Book Session
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* No matches info card */}
          {!loading && mentors.length === 0 && (
            <Card variant="sage" className="max-w-3xl mx-auto">
              <CardContent className="py-12 text-center">
                <Sparkles className="h-16 w-16 mx-auto text-purple-600 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Complete Your Profile to Get Matches
                </h3>
                <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                  Our smart matching algorithm needs a bit more information about you to find
                  the perfect mentors. Complete your profile and choose a package to unlock
                  personalized mentor recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/onboarding/profile">
                    <Button variant="uplift" size="lg">
                      Complete Profile
                    </Button>
                  </Link>
                  <Link href="/sessions">
                    <Button variant="upliftOutline" size="lg">
                      Browse All Mentors
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-sage-50 py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How Our Matching Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card variant="light" className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Segment Match</h3>
                  <p className="text-sm text-gray-600">
                    We match you with mentors who specialize in your career segment
                  </p>
                </CardContent>
              </Card>

              <Card variant="light" className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Level Match</h3>
                  <p className="text-sm text-gray-600">
                    Mentors are matched based on your package tier and needs
                  </p>
                </CardContent>
              </Card>

              <Card variant="light" className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Quality Rating</h3>
                  <p className="text-sm text-gray-600">
                    Highly rated mentors with proven track records rank higher
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
