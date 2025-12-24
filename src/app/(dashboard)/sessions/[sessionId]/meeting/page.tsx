"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Video,
  Mic,
  Phone,
  Monitor,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MeetingDetails {
  booking: {
    id: string
    sessionNumber: number
    scheduledAt: string
    duration: number
    notes: string | null
    status: string
    meetingUrl: string | null
  }
  user: {
    name: string
    email: string
  }
  mentor: {
    name: string
    email: string
  }
  package: {
    name: string
  }
}

export default function MeetingRoomPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReady, setIsReady] = useState(false) // Used for future UI state
  const [checklistComplete, setChecklistComplete] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)

  // Pre-meeting checklist state
  const [checklist, setChecklist] = useState({
    audio: false,
    video: false,
    goals: false,
  })

  // Fetch meeting details
  useEffect(() => {
    async function fetchMeetingDetails() {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/meeting`)
        if (!response.ok) {
          throw new Error("Failed to fetch meeting details")
        }
        const data = await response.json()
        setMeetingDetails(data)
        setIsReady(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMeetingDetails()
  }, [sessionId])

  // Session timer
  useEffect(() => {
    if (!sessionStarted) return

    const interval = setInterval(() => {
      setSessionDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStarted])

  // Format duration
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Handle checklist updates
  const updateChecklist = (item: keyof typeof checklist) => {
    setChecklist((prev) => {
      const updated = { ...prev, [item]: !prev[item] }
      setChecklistComplete(Object.values(updated).every(Boolean))
      return updated
    })
  }

  // Start meeting
  const handleStartMeeting = () => {
    if (!meetingDetails?.booking.meetingUrl) return
    setSessionStarted(true)
    // Open meeting in iframe or new window
    window.open(meetingDetails.booking.meetingUrl, "_blank")
  }

  // End session
  const handleEndSession = async () => {
    if (!confirm("Are you sure you want to end this session?")) return

    try {
      await fetch(`/api/sessions/${sessionId}/complete`, {
        method: "POST",
      })
      router.push(`/sessions/${sessionId}/feedback`)
    } catch (err) {
      console.error("Failed to end session:", err)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading meeting room...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !meetingDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Unable to Load Meeting</h2>
              <p className="text-muted-foreground mb-4">
                {error || "Meeting details could not be found"}
              </p>
              <Button onClick={() => router.push("/sessions")}>Return to Sessions</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pre-meeting checklist
  if (!sessionStarted && !checklistComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="text-center">
                <Video className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Pre-Meeting Checklist</h1>
                <p className="text-muted-foreground">
                  Complete these steps before joining your session
                </p>
              </div>

              <Separator />

              {/* Session Information */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Session</span>
                  <span className="text-sm font-medium">
                    #{meetingDetails.booking.sessionNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mentor</span>
                  <span className="text-sm font-medium">{meetingDetails.mentor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">
                    {meetingDetails.booking.duration} minutes
                  </span>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                <button
                  onClick={() => updateChecklist("audio")}
                  className="w-full flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="mt-0.5">
                    {checklist.audio ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      <h3 className="font-medium">Check Audio</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Test your microphone and speakers to ensure clear communication
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => updateChecklist("video")}
                  className="w-full flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="mt-0.5">
                    {checklist.video ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <h3 className="font-medium">Check Video</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verify your camera is working and positioned correctly
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => updateChecklist("goals")}
                  className="w-full flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="mt-0.5">
                    {checklist.goals ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <h3 className="font-medium">Review Session Goals</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {meetingDetails.booking.notes || "Prepare your topics and questions"}
                    </p>
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => router.push("/sessions")} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleStartMeeting}
                  disabled={!checklistComplete}
                  className="flex-1"
                >
                  Join Meeting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Meeting room interface
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="default">Session #{meetingDetails.booking.sessionNumber}</Badge>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatDuration(sessionDuration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <>
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Hide Info
                </>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Show Info
                </>
              )}
            </Button>
            <Button variant="destructive" onClick={handleEndSession}>
              <Phone className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Meeting Frame */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 p-6">
          <Card className="w-full h-full max-w-5xl">
            <CardContent className="h-full flex flex-col items-center justify-center p-8">
              <Monitor className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Meeting Window</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Your meeting has been opened in a new window. If it didn&apos;t open automatically,
                click the button below.
              </p>
              <Button onClick={handleStartMeeting} variant="outline">
                Reopen Meeting Window
              </Button>

              <Alert className="mt-8 max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Keep this tab open during your session. When you&apos;re finished, click &quot;End
                  Session&quot; above.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Participants */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {meetingDetails.mentor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {meetingDetails.mentor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Mentor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {meetingDetails.user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{meetingDetails.user.name}</p>
                      <p className="text-xs text-muted-foreground">You</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Session Info */}
              <div>
                <h3 className="font-semibold mb-3">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Program</span>
                    <span className="font-medium text-right">{meetingDetails.package.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{meetingDetails.booking.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled</span>
                    <span className="font-medium">
                      {new Date(meetingDetails.booking.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Session Notes */}
              {meetingDetails.booking.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Session Goals</h3>
                    <p className="text-sm text-muted-foreground">
                      {meetingDetails.booking.notes}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Quick Tips */}
              <div>
                <h3 className="font-semibold mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Mute when not speaking</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use headphones for better audio</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Take notes during the session</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ask questions freely</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
