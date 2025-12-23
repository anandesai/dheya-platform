"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Video,
  ArrowRight,
  Plus,
  User,
} from "lucide-react"

interface Session {
  id: string
  mentorName: string
  mentorLevel: string
  date: string
  time: string
  duration: string
  type: "video" | "phone" | "in-person"
  status: "upcoming" | "completed" | "cancelled"
}

const sessions: Session[] = [
  {
    id: "1",
    mentorName: "Rajesh Kumar",
    mentorLevel: "Principal Mentor",
    date: "Dec 26, 2024",
    time: "10:00 AM",
    duration: "45 min",
    type: "video",
    status: "upcoming",
  },
  {
    id: "2",
    mentorName: "Priya Sharma",
    mentorLevel: "Senior Mentor",
    date: "Jan 2, 2025",
    time: "3:00 PM",
    duration: "60 min",
    type: "video",
    status: "upcoming",
  },
]

export function UpcomingSessions() {
  return (
    <Card variant="light">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-display">Upcoming Sessions</CardTitle>
            <CardDescription>
              Your scheduled mentor sessions
            </CardDescription>
          </div>
          <Link href="/sessions">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-cream-200 hover:border-purple-300 transition-colors"
              >
                {/* Mentor avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-500" />
                  </div>
                </div>

                {/* Session details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium font-display text-charcoal-800 truncate">
                      {session.mentorName}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {session.mentorLevel}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-charcoal-600 font-body">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {session.time} ({session.duration})
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      Video Call
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex-shrink-0">
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                    Join
                  </Button>
                </div>
              </div>
            ))}

            {/* Book new session */}
            <Link href="/sessions/book">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Book New Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-cream-400" />
            </div>
            <h4 className="font-medium font-display text-charcoal-800 mb-2">
              No Upcoming Sessions
            </h4>
            <p className="text-sm text-charcoal-600 font-body mb-4">
              Schedule your first mentor session to get started
            </p>
            <Link href="/sessions/book">
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Plus className="mr-2 h-4 w-4" />
                Book Your First Session
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
