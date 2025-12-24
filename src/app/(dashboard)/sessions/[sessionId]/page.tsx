"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SessionNotes } from "@/components/sessions/session-notes"
import { SessionFeedback } from "@/components/sessions/session-feedback"
import {
  Calendar,
  Clock,
  Video,
  Star,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Edit,
  XCircle,
  CheckCircle,
  AlertCircle,
  CalendarX,
  FileText,
  User,
  PlayCircle,
} from "lucide-react"
import { toast } from "sonner"
import { format, formatDistanceToNow, isFuture, differenceInHours } from "date-fns"

interface SessionData {
  id: string
  scheduledAt: string
  duration: number
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  notes: string | null
  feedback: string | null
  rating: number | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  mentor: {
    id: string
    name: string
    email: string
    image: string | null
    level: string
  } | null
  package: {
    id: string
    name: string
  } | null
}

const STATUS_CONFIG = {
  SCHEDULED: {
    label: "Scheduled",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Calendar,
    description: "Your session is confirmed and scheduled",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Session confirmed by mentor",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: CheckCircle,
    description: "Session has been completed",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: XCircle,
    description: "This session has been cancelled",
  },
  NO_SHOW: {
    label: "No Show",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: CalendarX,
    description: "Participant did not attend",
  },
}

const LEVELS: Record<string, { label: string; color: string }> = {
  L1: { label: "Associate", color: "bg-blue-100 text-blue-800" },
  L2: { label: "Senior", color: "bg-green-100 text-green-800" },
  L3: { label: "Lead", color: "bg-purple-100 text-purple-800" },
  L4: { label: "Principal", color: "bg-amber-100 text-amber-800" },
}

export default function SessionDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState("")

  // Pre-session notes editing
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)

  // Feedback dialog
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  // Countdown timer for upcoming sessions
  useEffect(() => {
    if (!session || session.status !== "SCHEDULED" && session.status !== "CONFIRMED") {
      return
    }

    const updateCountdown = () => {
      const scheduledDate = new Date(session.scheduledAt)
      if (isFuture(scheduledDate)) {
        const hours = differenceInHours(scheduledDate, new Date())
        if (hours < 24) {
          setCountdown(formatDistanceToNow(scheduledDate, { addSuffix: true }))
        } else {
          setCountdown("")
        }
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [session])

  const fetchSession = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Session not found")
          router.push("/sessions")
          return
        }
        throw new Error("Failed to fetch session")
      }
      const data = await response.json()
      setSession(data.session)
      setNotesValue(data.session.notes || "")
      setFeedback(data.session.feedback || "")
      setRating(data.session.rating || 0)
    } catch (error) {
      console.error("Error fetching session:", error)
      toast.error("Failed to load session details")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!session) return

    setSavingNotes(true)
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesValue }),
      })

      if (!response.ok) {
        throw new Error("Failed to save notes")
      }

      toast.success("Notes saved successfully")
      setEditingNotes(false)
      fetchSession()
    } catch (error) {
      console.error("Error saving notes:", error)
      toast.error("Failed to save notes")
    } finally {
      setSavingNotes(false)
    }
  }

  const handleCancelSession = async () => {
    if (!session) return

    setCancelling(true)
    try {
      const response = await fetch(
        `/api/sessions/${sessionId}?reason=${encodeURIComponent(cancelReason)}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to cancel session")
      }

      toast.success("Session cancelled successfully")
      setCancelDialogOpen(false)
      fetchSession()
    } catch (error) {
      console.error("Error cancelling session:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel session"
      )
    } finally {
      setCancelling(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!session || rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setSubmittingFeedback(true)
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, rating }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      toast.success("Feedback submitted successfully")
      setFeedbackDialogOpen(false)
      fetchSession()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback")
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const openCancelDialog = () => {
    setCancelDialogOpen(true)
  }

  const openFeedbackDialog = () => {
    setFeedbackDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-charcoal-600 mb-4" />
        <h2 className="text-xl font-semibold font-display">Session not found</h2>
        <p className="text-charcoal-600 font-body mt-2">
          This session may have been deleted or you don&apos;t have access to it.
        </p>
        <Link href="/sessions" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </Link>
      </div>
    )
  }

  const scheduledDate = new Date(session.scheduledAt)
  const isScheduled = session.status === "SCHEDULED" || session.status === "CONFIRMED"
  const isCompleted = session.status === "COMPLETED"
  const isCancelled = session.status === "CANCELLED"
  const canJoin = isScheduled && isFuture(scheduledDate) && differenceInHours(scheduledDate, new Date()) < 1
  const statusConfig = STATUS_CONFIG[session.status]
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sessions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display text-charcoal-800">
              Session Details
            </h1>
            <p className="text-charcoal-600 font-body">
              {format(scheduledDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <Badge className={`${statusConfig.color} text-sm px-3 py-1`}>
          <StatusIcon className="h-4 w-4 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Countdown Timer (for upcoming sessions) */}
      {isScheduled && countdown && (
        <Card variant="light" className="border-purple-300 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold font-display text-charcoal-800">
                    Session starts {countdown}
                  </p>
                  <p className="text-sm text-charcoal-600 font-body">
                    Make sure you&apos;re ready to join
                  </p>
                </div>
              </div>
              {canJoin && (
                <Button className="bg-green-600 hover:bg-green-700 text-white" size="lg">
                  <Video className="h-5 w-5 mr-2" />
                  Join Meeting
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mentor Info */}
          {session.mentor && (
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display">Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={session.mentor.image || undefined} />
                    <AvatarFallback className="text-xl">
                      {session.mentor.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold font-display">
                      {session.mentor.name}
                    </h3>
                    <p className="text-sm text-charcoal-600 font-body">
                      {session.mentor.email}
                    </p>
                    <Badge className={`mt-2 ${LEVELS[session.mentor.level]?.color}`}>
                      {LEVELS[session.mentor.level]?.label} Mentor
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scheduled Session Details */}
          {isScheduled && (
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display">Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-charcoal-600 mt-0.5" />
                  <div>
                    <p className="font-medium font-display">Date & Time</p>
                    <p className="text-sm text-charcoal-600 font-body">
                      {format(scheduledDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-charcoal-600 font-body">
                      {format(scheduledDate, "h:mm a")} ({session.duration} minutes)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-charcoal-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium font-display">Pre-Session Notes</p>
                      {!editingNotes && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingNotes(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                    {editingNotes ? (
                      <div className="space-y-2">
                        <Textarea
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          placeholder="Add notes about what you'd like to discuss..."
                          rows={4}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveNotes}
                            disabled={savingNotes}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            {savingNotes ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Notes"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingNotes(false)
                              setNotesValue(session.notes || "")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-charcoal-600 font-body whitespace-pre-wrap">
                        {session.notes || "No notes added yet"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Session Summary */}
          {isCompleted && (
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display">Session Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-charcoal-600 mt-0.5" />
                  <div>
                    <p className="font-medium font-display">Completed On</p>
                    <p className="text-sm text-charcoal-600 font-body">
                      {format(scheduledDate, "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="text-sm text-charcoal-600 font-body">
                      Duration: {session.duration} minutes
                    </p>
                  </div>
                </div>

                <Separator />
                <SessionNotes
                  bookingId={session.id}
                  isEditable={false}
                  initialNotes={session.notes}
                />

                {session.rating && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium font-display">Your Rating</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= session.rating!
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {session.feedback && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-charcoal-600 mt-0.5" />
                      <div>
                        <p className="font-medium font-display">Your Feedback</p>
                        <p className="text-sm text-charcoal-600 font-body whitespace-pre-wrap mt-1">
                          {session.feedback}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {!session.rating ? (
                  <div className="mt-6">
                    <SessionFeedback
                      bookingId={session.id}
                      mentorName={session.mentor?.name || "Your mentor"}
                      onSubmitSuccess={() => {
                        toast.success("Feedback submitted successfully!")
                        fetchSession()
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      Thank you for your feedback!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cancelled Session Info */}
          {isCancelled && (
            <Card variant="light" className="border-gray-300">
              <CardHeader>
                <CardTitle className="font-display text-charcoal-800">
                  Cancellation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium font-display">Status</p>
                    <p className="text-sm text-charcoal-600 font-body">
                      This session was cancelled
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-charcoal-600 mt-0.5" />
                  <div>
                    <p className="font-medium font-display">Originally Scheduled</p>
                    <p className="text-sm text-charcoal-600 font-body">
                      {format(scheduledDate, "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card variant="light">
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isScheduled && (
                <>
                  {canJoin && (
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/sessions/book?reschedule=${sessionId}`)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={openCancelDialog}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Session
                  </Button>
                </>
              )}
              {isCompleted && (
                <>
                  {session.rating && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={openFeedbackDialog}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Feedback
                    </Button>
                  )}
                  <Link href="/sessions/book" className="block">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Next Session
                    </Button>
                  </Link>
                </>
              )}
              {isCancelled && (
                <Link href="/sessions/book" className="block">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Rebook Session
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Package Info */}
          {session.package && (
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display">Package</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-charcoal-600 mt-0.5" />
                  <div>
                    <p className="font-medium font-display">{session.package.name}</p>
                    <Link href="/dashboard" className="mt-2 inline-block">
                      <Button size="sm" variant="ghost" className="h-auto p-0 text-purple-600">
                        View Package Details →
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recording (placeholder for completed sessions) */}
          {isCompleted && (
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display">Recording</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 text-center">
                  <div>
                    <PlayCircle className="h-12 w-12 text-charcoal-600 mx-auto mb-2" />
                    <p className="text-sm text-charcoal-600 font-body">
                      Recording will be available soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
            <DialogDescription>
              Share your experience with {session.mentor?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="feedback">Your Feedback (optional)</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share what you found helpful or suggestions for improvement..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={submittingFeedback || rating === 0}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {submittingFeedback ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this session with{" "}
              {session.mentor?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cancelReason">Reason (optional)</Label>
            <Textarea
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Let us know why you're cancelling..."
              rows={3}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Session
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSession}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Session"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
