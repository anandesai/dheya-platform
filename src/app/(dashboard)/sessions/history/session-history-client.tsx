"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SessionNotes } from "@/components/sessions/session-notes"
import {
  Calendar,
  Clock,
  User,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react"

interface SessionData {
  id: string
  scheduledAt: string
  duration: number
  status: string
  notes: string | null
  feedback: string | null
  rating: number | null
  mentor: {
    id: string
    name: string
    image: string | null
    level: string
  }
}

export function SessionHistoryClient() {
  const [sessions, setSessions] = React.useState<SessionData[]>([])
  const [filteredSessions, setFilteredSessions] = React.useState<SessionData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dateRange, setDateRange] = React.useState<"all" | "month" | "quarter" | "year">("all")
  const [expandedSessions, setExpandedSessions] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    fetchSessions()
  }, [])

  React.useEffect(() => {
    filterSessions()
  }, [sessions, searchQuery, dateRange])

  const fetchSessions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bookings?type=past")
      if (!response.ok) throw new Error("Failed to fetch sessions")

      const data = await response.json()
      setSessions(data.bookings || [])
    } catch (error) {
      console.error("Error fetching sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSessions = () => {
    let filtered = sessions

    // Filter by search query (mentor name)
    if (searchQuery) {
      filtered = filtered.filter((session) =>
        session.mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (dateRange) {
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          cutoffDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter(
        (session) => new Date(session.scheduledAt) >= cutoffDate
      )
    }

    setFilteredSessions(filtered)
  }

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev)
      if (next.has(sessionId)) {
        next.delete(sessionId)
      } else {
        next.add(sessionId)
      }
      return next
    })
  }

  const exportNotes = () => {
    const notesText = filteredSessions
      .map((session) => {
        const date = new Date(session.scheduledAt).toLocaleDateString()
        return `
Session with ${session.mentor.name}
Date: ${date}
Duration: ${session.duration} minutes
Rating: ${session.rating ? "⭐".repeat(session.rating) : "Not rated"}

Notes:
${session.notes || "No notes"}

---
        `.trim()
      })
      .join("\n\n")

    const blob = new Blob([notesText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `session-notes-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString))
  }

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="space-y-6">
          <div className="h-10 w-64 bg-cream-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-cream-200 rounded animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-cream-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          Session History
        </h1>
        <p className="mt-2 text-charcoal-600">
          View your past mentoring sessions and notes
        </p>
      </div>

      {/* Filters and Search */}
      <Card variant="light">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by mentor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus-visible:ring-purple-500"
              />
            </div>

            {/* Date Range Filter */}
            <div className="flex gap-2">
              <Button
                variant={dateRange === "all" ? "uplift" : "outline"}
                size="sm"
                onClick={() => setDateRange("all")}
              >
                All Time
              </Button>
              <Button
                variant={dateRange === "month" ? "uplift" : "outline"}
                size="sm"
                onClick={() => setDateRange("month")}
              >
                Last Month
              </Button>
              <Button
                variant={dateRange === "quarter" ? "uplift" : "outline"}
                size="sm"
                onClick={() => setDateRange("quarter")}
              >
                Last Quarter
              </Button>
              <Button
                variant={dateRange === "year" ? "uplift" : "outline"}
                size="sm"
                onClick={() => setDateRange("year")}
              >
                Last Year
              </Button>
            </div>

            {/* Export Button */}
            <Button
              variant="upliftOutline"
              size="sm"
              onClick={exportNotes}
              disabled={filteredSessions.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="light">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-3xl font-bold text-purple-600">
                {filteredSessions.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="light">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Hours of Mentoring</p>
              <p className="text-3xl font-bold text-purple-600">
                {(filteredSessions.reduce((acc, s) => acc + s.duration, 0) / 60).toFixed(1)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="light">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-3xl font-bold text-purple-600">
                {filteredSessions.filter((s) => s.rating).length > 0
                  ? (
                      filteredSessions
                        .filter((s) => s.rating)
                        .reduce((acc, s) => acc + (s.rating || 0), 0) /
                      filteredSessions.filter((s) => s.rating).length
                    ).toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card variant="light">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-charcoal-800 mb-2">
                  No sessions found
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || dateRange !== "all"
                    ? "Try adjusting your filters"
                    : "You haven't completed any sessions yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} variant="light" hover="lift">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSession(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        {session.mentor.image ? (
                          <img
                            src={session.mentor.image}
                            alt={session.mentor.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {session.mentor.name}
                        </CardTitle>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(session.scheduledAt)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(session.scheduledAt)} • {session.duration} min
                          </span>
                          {session.rating && (
                            <span className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                              <Star className="h-3 w-3 fill-purple-600" />
                              {session.rating}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {session.notes && !expandedSessions.has(session.id) && (
                      <p className="text-sm text-muted-foreground line-clamp-2 ml-[52px]">
                        {session.notes}
                      </p>
                    )}
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {expandedSessions.has(session.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {expandedSessions.has(session.id) && (
                <CardContent className="pt-0">
                  <SessionNotes
                    bookingId={session.id}
                    isEditable={false}
                    initialNotes={session.notes}
                  />
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
