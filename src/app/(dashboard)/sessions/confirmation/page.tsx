"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Loader2,
  Download,
  ExternalLink,
  CalendarDays,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  generateGoogleCalendarUrl,
  downloadICalFile,
} from "@/lib/calendar-utils"

interface BookingDetails {
  id: string
  scheduledAt: Date
  duration: number
  sessionNumber: number
  status: string
  notes: string | null
  meetingUrl: string | null
  mentor: {
    id: string
    name: string
    image: string | null
    level: string
  }
}

const LEVELS: Record<string, { label: string; color: string }> = {
  L1: { label: "Associate", color: "bg-blue-100 text-blue-800" },
  L2: { label: "Senior", color: "bg-green-100 text-green-800" },
  L3: { label: "Lead", color: "bg-purple-100 text-purple-800" },
  L4: { label: "Principal", color: "bg-amber-100 text-amber-800" },
}

export default function BookingConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    if (!bookingId) {
      toast.error("No booking ID provided")
      router.push("/sessions")
      return
    }

    fetchBookingDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId])

  const fetchBookingDetails = async () => {
    if (!bookingId) return

    try {
      const response = await fetch(`/api/bookings/${bookingId}`)
      if (!response.ok) throw new Error("Failed to fetch booking details")

      const data = await response.json()
      setBooking({
        ...data.booking,
        scheduledAt: new Date(data.booking.scheduledAt),
      })

      // Send confirmation email in background
      sendConfirmationEmail(data.booking)
    } catch (error) {
      console.error("Error fetching booking:", error)
      toast.error("Failed to load booking details")
      router.push("/sessions")
    } finally {
      setLoading(false)
    }
  }

  const sendConfirmationEmail = async (bookingData: BookingDetails) => {
    try {
      setSendingEmail(true)
      const response = await fetch("/api/notifications/booking-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.id,
          recipientEmail: "user@example.com", // Will be replaced with actual user email
          recipientName: "User", // Will be replaced with actual user name
          mentorName: bookingData.mentor.name,
          scheduledAt: bookingData.scheduledAt.toISOString(),
          duration: bookingData.duration,
          meetingUrl: bookingData.meetingUrl,
          notes: bookingData.notes,
        }),
      })

      if (!response.ok) {
        console.error("Failed to send confirmation email")
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error)
    } finally {
      setSendingEmail(false)
    }
  }

  const handleGoogleCalendar = () => {
    if (!booking) return
    const url = generateGoogleCalendarUrl(booking)
    window.open(url, "_blank")
    toast.success("Opening Google Calendar...")
  }

  const handleDownloadICalendar = () => {
    if (!booking) return
    downloadICalFile(booking)
    toast.success("Calendar file downloaded!")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!booking) {
    return null
  }

  const endTime = new Date(booking.scheduledAt.getTime() + booking.duration * 60000)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Animation Header */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-charcoal-800">
            Your Session is Booked!
          </h1>
          <p className="text-lg text-charcoal-600 font-body">
            Get ready to take your career to the next level
          </p>
        </div>
      </div>

      {/* Session Details Card */}
      <Card
        variant="light"
        className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg animate-in slide-in-from-bottom-8 duration-700 delay-300"
      >
        <CardHeader className="border-b border-purple-100">
          <CardTitle className="font-display text-purple-900 flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Session Details
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Mentor Info */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-purple-100">
            <Avatar className="h-16 w-16 border-2 border-purple-200">
              <AvatarImage src={booking.mentor.image || undefined} />
              <AvatarFallback className="bg-purple-100 text-purple-700 text-lg font-semibold">
                {booking.mentor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-charcoal-600 font-body" />
                <span className="text-sm text-charcoal-600 font-body font-medium">
                  Your Mentor
                </span>
              </div>
              <h3 className="text-xl font-semibold font-display text-charcoal-900">
                {booking.mentor.name}
              </h3>
              <Badge className={`mt-1 ${LEVELS[booking.mentor.level]?.color || "bg-gray-100"}`}>
                {LEVELS[booking.mentor.level]?.label || booking.mentor.level} Mentor
              </Badge>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-charcoal-600 font-body">Date</span>
              </div>
              <p className="text-lg font-semibold text-charcoal-900">
                {format(booking.scheduledAt, "EEEE")}
              </p>
              <p className="text-base text-charcoal-700">
                {format(booking.scheduledAt, "MMMM d, yyyy")}
              </p>
            </div>

            {/* Time */}
            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-charcoal-600 font-body">Time</span>
              </div>
              <p className="text-lg font-semibold text-charcoal-900">
                {format(booking.scheduledAt, "h:mm a")}
              </p>
              <p className="text-base text-charcoal-700">
                {booking.duration} minutes ({format(endTime, "h:mm a")})
              </p>
            </div>
          </div>

          {/* Session Number */}
          <div className="p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium mb-1">Session Progress</p>
            <p className="text-2xl font-bold text-purple-900">
              Session #{booking.sessionNumber}
            </p>
          </div>

          {/* Notes (if any) */}
          {booking.notes && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-900 mb-2">Your Notes</p>
              <p className="text-sm text-amber-800 leading-relaxed">{booking.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add to Calendar Section */}
      <Card
        variant="light"
        className="bg-gradient-to-br from-blue-50 to-white border-blue-200 animate-in slide-in-from-bottom-8 duration-700 delay-400"
      >
        <CardHeader>
          <CardTitle className="font-display text-blue-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add to Your Calendar
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-charcoal-600 font-body">
            Don&apos;t miss your session! Add it to your calendar to receive reminders.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGoogleCalendar}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Google Calendar
            </Button>

            <Button
              onClick={handleDownloadICalendar}
              variant="outline"
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download iCal
            </Button>
          </div>

          <p className="text-xs text-charcoal-600 font-body text-center">
            iCal files work with Apple Calendar, Outlook, and most calendar apps
          </p>
        </CardContent>
      </Card>

      {/* Preparation Tips */}
      <Card
        variant="light"
        className="bg-gradient-to-br from-green-50 to-white border-green-200 animate-in slide-in-from-bottom-8 duration-700 delay-500"
      >
        <CardHeader>
          <CardTitle className="font-display text-green-900">
            Preparing for Your Session
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="space-y-3 text-charcoal-700 font-body">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Review your career goals and questions beforehand</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Find a quiet space with a stable internet connection</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Test your audio and video settings 5 minutes early</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Have a notebook ready to capture key insights</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
        <Button
          onClick={() => router.push("/sessions")}
          variant="outline"
          size="lg"
          className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          View All Sessions
        </Button>

        <Button
          onClick={() => router.push("/dashboard")}
          size="lg"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          Back to Dashboard
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Confirmation Email Status (hidden but active) */}
      {sendingEmail && (
        <p className="text-xs text-center text-charcoal-600 font-body">
          Sending confirmation email...
        </p>
      )}
    </div>
  )
}
