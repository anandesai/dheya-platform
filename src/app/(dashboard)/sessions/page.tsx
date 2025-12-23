"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Calendar,
  Clock,
  Plus,
  Star,
  Video,
  MessageSquare,
  Loader2,
  CalendarX,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { format, isPast, isFuture, isToday } from "date-fns"

interface Booking {
  id: string
  scheduledAt: string
  duration: number
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
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

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-800", icon: Calendar },
  CONFIRMED: { label: "Confirmed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
  NO_SHOW: { label: "No Show", color: "bg-orange-100 text-orange-800", icon: CalendarX },
}

const LEVELS: Record<string, { label: string; color: string }> = {
  L1: { label: "Associate", color: "bg-blue-100 text-blue-800" },
  L2: { label: "Senior", color: "bg-green-100 text-green-800" },
  L3: { label: "Lead", color: "bg-purple-100 text-purple-800" },
  L4: { label: "Principal", color: "bg-amber-100 text-amber-800" },
}

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Feedback dialog
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/bookings?type=${activeTab}`)
      if (!response.ok) throw new Error("Failed to fetch bookings")
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to load sessions")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!selectedBooking) return

    setCancelling(true)
    try {
      const response = await fetch(
        `/api/bookings/${selectedBooking.id}?reason=${encodeURIComponent(cancelReason)}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to cancel booking")
      }

      toast.success("Session cancelled successfully")
      setCancelDialogOpen(false)
      setSelectedBooking(null)
      setCancelReason("")
      fetchBookings()
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel session"
      )
    } finally {
      setCancelling(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!selectedBooking || rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setSubmittingFeedback(true)
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, rating }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      toast.success("Feedback submitted successfully")
      setFeedbackDialogOpen(false)
      setSelectedBooking(null)
      setFeedback("")
      setRating(0)
      fetchBookings()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback")
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const openFeedbackDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setFeedback(booking.feedback || "")
    setRating(booking.rating || 0)
    setFeedbackDialogOpen(true)
  }

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancelDialogOpen(true)
  }

  const upcomingBookings = bookings.filter(
    (b) => isFuture(new Date(b.scheduledAt)) && b.status !== "CANCELLED"
  )
  const pastBookings = bookings.filter(
    (b) => isPast(new Date(b.scheduledAt)) || b.status === "CANCELLED" || b.status === "COMPLETED"
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-charcoal-800">My Sessions</h1>
          <p className="text-charcoal-600 font-body">
            Manage your mentoring sessions
          </p>
        </div>
        <Link href="/sessions/book">
          <Button className="bg-purple-500 hover:bg-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Book Session
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="light">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-display text-charcoal-600 font-body">
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {upcomingBookings.length}
            </div>
          </CardContent>
        </Card>
        <Card variant="light">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-display text-charcoal-600 font-body">
              Completed Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pastBookings.filter((b) => b.status === "COMPLETED").length}
            </div>
          </CardContent>
        </Card>
        <Card variant="light">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-display text-charcoal-600 font-body">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <Card variant="light">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-charcoal-600 font-body mb-4" />
                <h3 className="text-lg font-medium font-display">No upcoming sessions</h3>
                <p className="text-charcoal-600 font-body mt-1">
                  Book a session with a mentor to get started
                </p>
                <Link href="/sessions/book" className="mt-4">
                  <Button className="bg-purple-500 hover:bg-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => {
                const scheduledDate = new Date(booking.scheduledAt)
                const isUpcoming = isToday(scheduledDate)

                return (
                  <Card
                    key={booking.id}
                    variant="light"
                    className={isUpcoming ? "border-purple-300 bg-purple-50" : ""}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.mentor.image || undefined} />
                            <AvatarFallback>
                              {booking.mentor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold font-display">{booking.mentor.name}</h3>
                            <Badge className={LEVELS[booking.mentor.level]?.color}>
                              {LEVELS[booking.mentor.level]?.label} Mentor
                            </Badge>
                            <div className="flex items-center gap-4 mt-2 text-sm text-charcoal-600 font-body">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(scheduledDate, "EEEE, MMM d")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(scheduledDate, "h:mm a")}
                              </div>
                            </div>
                            {booking.notes && (
                              <p className="text-sm text-charcoal-600 font-body mt-2 line-clamp-2">
                                {booking.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {isUpcoming && (
                            <Badge className="bg-purple-600 text-white">Today</Badge>
                          )}
                          <div className="flex gap-2">
                            {isUpcoming && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Video className="h-4 w-4 mr-1" />
                                Join
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openCancelDialog(booking)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : pastBookings.length === 0 ? (
            <Card variant="light">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-charcoal-600 font-body mb-4" />
                <h3 className="text-lg font-medium font-display">No past sessions</h3>
                <p className="text-charcoal-600 font-body">
                  Your completed sessions will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => {
                const scheduledDate = new Date(booking.scheduledAt)
                const statusConfig = STATUS_CONFIG[booking.status]
                const StatusIcon = statusConfig?.icon || Calendar

                return (
                  <Card key={booking.id} variant="light">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.mentor.image || undefined} />
                            <AvatarFallback>
                              {booking.mentor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold font-display">{booking.mentor.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={LEVELS[booking.mentor.level]?.color}>
                                {LEVELS[booking.mentor.level]?.label}
                              </Badge>
                              <Badge className={statusConfig?.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig?.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-charcoal-600 font-body">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(scheduledDate, "MMM d, yyyy")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(scheduledDate, "h:mm a")}
                              </div>
                            </div>
                            {booking.rating && (
                              <div className="flex items-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= booking.rating!
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {booking.status === "COMPLETED" && !booking.rating && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openFeedbackDialog(booking)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Leave Feedback
                            </Button>
                          )}
                          {booking.status === "COMPLETED" && booking.rating && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openFeedbackDialog(booking)}
                            >
                              Edit Feedback
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedBooking?.mentor.name}
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
              {selectedBooking?.mentor.name}?
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
              onClick={handleCancelBooking}
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
