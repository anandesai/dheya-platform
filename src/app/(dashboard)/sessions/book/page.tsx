"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Star,
  Loader2,
  Check,
  Search,
  Package,
  Sunrise,
  Sun,
  Moon,
  Globe,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface Mentor {
  id: string
  name: string
  image: string | null
  level: string
  specializations: string[]
  bio: string | null
  rating: number | null
  yearsExperience: number | null
}

interface TimeSlot {
  time: string
  available: boolean
}

interface UserPackage {
  id: string
  packageName: string
  totalSessions: number
  usedSessions: number
  remainingSessions: number
  sessionDuration: number
}

const STEPS = [
  { id: 1, name: "Select Mentor", icon: User },
  { id: 2, name: "Choose Date & Time", icon: CalendarIcon },
  { id: 3, name: "Confirm Booking", icon: Check },
]

const LEVELS: Record<string, { label: string; color: string }> = {
  L1: { label: "Associate", color: "bg-blue-100 text-blue-800" },
  L2: { label: "Senior", color: "bg-green-100 text-green-800" },
  L3: { label: "Lead", color: "bg-purple-100 text-purple-800" },
  L4: { label: "Principal", color: "bg-amber-100 text-amber-800" },
}

const TIME_PERIODS = [
  { id: 'morning', label: 'Morning', icon: Sunrise, hours: [6, 7, 8, 9, 10, 11] },
  { id: 'afternoon', label: 'Afternoon', icon: Sun, hours: [12, 13, 14, 15, 16, 17] },
  { id: 'evening', label: 'Evening', icon: Moon, hours: [18, 19, 20, 21, 22] },
]

export default function BookSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedMentorId = searchParams.get("mentorId")

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // User package info
  const [userPackage, setUserPackage] = useState<UserPackage | null>(null)
  const [loadingPackage, setLoadingPackage] = useState(true)

  // Step 1: Mentor selection
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [mentorSearch, setMentorSearch] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState<string>("all")

  // Step 2: Date & Time selection
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [loadingDates, setLoadingDates] = useState(false)

  // Step 3: Confirmation
  const [notes, setNotes] = useState("")

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  useEffect(() => {
    fetchUserPackage()
    fetchMentors()
  }, [])

  useEffect(() => {
    if (preselectedMentorId && mentors.length > 0) {
      const mentor = mentors.find((m) => m.id === preselectedMentorId)
      if (mentor) {
        setSelectedMentor(mentor)
        setStep(2)
      }
    }
  }, [preselectedMentorId, mentors])

  useEffect(() => {
    if (selectedMentor) {
      fetchAvailableDates()
    }
  }, [selectedMentor])

  useEffect(() => {
    if (selectedMentor && selectedDate) {
      fetchAvailableSlots()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMentor, selectedDate])

  const fetchUserPackage = async () => {
    setLoadingPackage(true)
    try {
      const response = await fetch("/api/user/package")
      if (!response.ok) throw new Error("Failed to fetch package")
      const data = await response.json()
      setUserPackage(data.package || null)
    } catch (error) {
      console.error("Error fetching package:", error)
      // Don't show error toast - package might not exist yet
    } finally {
      setLoadingPackage(false)
    }
  }

  const fetchMentors = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/mentors")
      if (!response.ok) throw new Error("Failed to fetch mentors")
      const data = await response.json()
      setMentors(data.mentors || [])
    } catch (error) {
      console.error("Error fetching mentors:", error)
      toast.error("Failed to load mentors")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableDates = async () => {
    if (!selectedMentor) return

    setLoadingDates(true)
    try {
      const response = await fetch(`/api/mentors/${selectedMentor.id}/available-dates`)
      if (!response.ok) throw new Error("Failed to fetch available dates")
      const data = await response.json()
      setAvailableDates((data.dates || []).map((d: string) => new Date(d)))
    } catch (error) {
      console.error("Error fetching available dates:", error)
      setAvailableDates([])
    } finally {
      setLoadingDates(false)
    }
  }

  const fetchAvailableSlots = async () => {
    if (!selectedMentor || !selectedDate) return

    setLoadingSlots(true)
    setSelectedTime(null)
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const response = await fetch(
        `/api/mentors/${selectedMentor.id}/slots?date=${dateStr}`
      )
      if (!response.ok) throw new Error("Failed to fetch slots")
      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (error) {
      console.error("Error fetching slots:", error)
      toast.error("Failed to load available time slots")
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime) {
      toast.error("Please complete all required fields")
      return
    }

    if (!userPackage) {
      toast.error("No active package found. Please purchase a package first.")
      return
    }

    if (userPackage.remainingSessions <= 0) {
      toast.error("No remaining sessions in your package.")
      return
    }

    setSubmitting(true)
    try {
      const scheduledAt = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":").map(Number)
      scheduledAt.setHours(hours, minutes, 0, 0)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          scheduledAt: scheduledAt.toISOString(),
          notes: notes || undefined,
          packageId: userPackage.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create booking")
      }

      const data = await response.json()
      toast.success("Session booked successfully!")
      router.push(`/sessions/confirmation?bookingId=${data.booking.id}`)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to book session"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      !mentorSearch ||
      mentor.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      mentor.bio?.toLowerCase().includes(mentorSearch.toLowerCase())

    const matchesSpecialization =
      specializationFilter === "all" ||
      mentor.specializations.includes(specializationFilter)

    return matchesSearch && matchesSpecialization
  })

  const getSlotsByPeriod = (periodId: string) => {
    const period = TIME_PERIODS.find(p => p.id === periodId)
    if (!period) return []

    return availableSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0])
      return period.hours.includes(hour)
    })
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedMentor !== null
      case 2:
        return selectedDate !== undefined && selectedTime !== null
      case 3:
        return true
      default:
        return false
    }
  }

  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      availableDate =>
        availableDate.getDate() === date.getDate() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getFullYear() === date.getFullYear()
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/sessions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-display text-charcoal-800">Book a Session</h1>
          <p className="text-charcoal-600 font-body">
            Schedule a mentoring session with one of our experts
          </p>
        </div>
        {userPackage && !loadingPackage && (
          <Card variant="sage" className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-forest-700" />
              <div>
                <p className="text-xs text-charcoal-600 font-body">Package</p>
                <p className="font-semibold text-sm font-display">
                  {userPackage.remainingSessions} of {userPackage.totalSessions} sessions left
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                step === s.id
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : step > s.id
                  ? "bg-green-100 text-green-700"
                  : "bg-sage-100 text-charcoal-600"
              }`}
            >
              {step > s.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium hidden sm:inline">{s.name}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 transition-all ${
                  step > s.id ? "bg-green-400" : "bg-sage-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card variant="light" className="shadow-md">
        <CardContent className="pt-6">
          {/* Step 1: Select Mentor */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-600" />
                  <Input
                    placeholder="Search mentors by name or expertise..."
                    value={mentorSearch}
                    onChange={(e) => setMentorSearch(e.target.value)}
                    className="pl-10 font-body"
                  />
                </div>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger className="w-[200px] font-body">
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    <SelectItem value="EARLY_CAREER">Early Career</SelectItem>
                    <SelectItem value="MID_CAREER">Mid Career</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                    <SelectItem value="RETURNING_WOMEN">Returning Women</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : filteredMentors.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-charcoal-400 mb-3" />
                  <p className="text-charcoal-600 font-body">
                    No mentors found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredMentors.map((mentor) => (
                    <Card
                      key={mentor.id}
                      variant="light"
                      hover="lift"
                      className={`cursor-pointer transition-all ${
                        selectedMentor?.id === mentor.id
                          ? "ring-2 ring-purple-500 bg-purple-50/50 shadow-lg shadow-purple-500/20"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedMentor(mentor)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-14 w-14 ring-2 ring-cream-200">
                            <AvatarImage src={mentor.image || undefined} />
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-display">
                              {mentor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold font-display truncate text-charcoal-800">
                                {mentor.name}
                              </h3>
                              {mentor.rating && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                  <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={LEVELS[mentor.level]?.color || "bg-gray-100"}>
                                {LEVELS[mentor.level]?.label || mentor.level}
                              </Badge>
                              {mentor.yearsExperience && (
                                <span className="text-xs text-charcoal-600 font-body">
                                  {mentor.yearsExperience}+ years
                                </span>
                              )}
                            </div>
                            {mentor.bio && (
                              <p className="text-sm text-charcoal-600 font-body line-clamp-2 leading-relaxed">
                                {mentor.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose Date & Time */}
          {step === 2 && selectedMentor && (
            <div className="space-y-6">
              {/* Selected Mentor Summary */}
              <Card variant="sage" className="border-sage-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-sage-300">
                      <AvatarImage src={selectedMentor.image || undefined} />
                      <AvatarFallback className="bg-forest-100 text-forest-700 font-display">
                        {selectedMentor.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold font-display text-charcoal-800">
                        {selectedMentor.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={LEVELS[selectedMentor.level]?.color}>
                          {LEVELS[selectedMentor.level]?.label}
                        </Badge>
                        {userPackage && (
                          <span className="text-sm text-charcoal-600 font-body">
                            • {userPackage.sessionDuration} min session
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => setStep(1)}
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Session Info */}
              {userPackage && (
                <div className="flex items-start gap-3 p-4 bg-cream-100 rounded-lg border border-cream-300">
                  <Info className="h-5 w-5 text-forest-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm font-display text-charcoal-800 mb-1">
                      Booking Session {userPackage.usedSessions + 1} of {userPackage.totalSessions}
                    </p>
                    <p className="text-sm text-charcoal-600 font-body">
                      {userPackage.remainingSessions - 1} sessions will remain after this booking
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
                {/* Calendar */}
                <div>
                  <Label className="mb-3 block text-base font-display text-charcoal-800">
                    Select Date
                  </Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const isPast = date < new Date()
                      const isSunday = date.getDay() === 0
                      const isAvailable = loadingDates ? true : isDateAvailable(date)
                      return isPast || isSunday || !isAvailable
                    }}
                    modifiers={{
                      available: availableDates,
                    }}
                    modifiersClassNames={{
                      available: "bg-green-50 text-green-700 font-semibold",
                    }}
                    className="rounded-lg border-2 border-cream-200 bg-white shadow-sm"
                  />
                  <div className="mt-3 flex items-center gap-2 text-xs text-charcoal-600 font-body">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Timezone: {userTimezone}</span>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <Label className="mb-3 block text-base font-display text-charcoal-800">
                    Select Time
                  </Label>
                  {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <CalendarIcon className="h-12 w-12 text-charcoal-400 mb-3" />
                      <p className="text-charcoal-600 font-body">
                        Please select a date to view available time slots
                      </p>
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Clock className="h-12 w-12 text-charcoal-400 mb-3" />
                      <p className="text-charcoal-600 font-body">
                        No available slots for this date
                      </p>
                      <p className="text-sm text-charcoal-500 font-body mt-1">
                        Try selecting a different date
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {TIME_PERIODS.map((period) => {
                        const slots = getSlotsByPeriod(period.id)
                        if (slots.length === 0) return null

                        return (
                          <div key={period.id}>
                            <div className="flex items-center gap-2 mb-3">
                              <period.icon className="h-4 w-4 text-charcoal-600" />
                              <h4 className="text-sm font-semibold font-display text-charcoal-700">
                                {period.label}
                              </h4>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {slots.map((slot) => (
                                <Button
                                  key={slot.time}
                                  variant={selectedTime === slot.time ? "default" : "outline"}
                                  size="sm"
                                  disabled={!slot.available}
                                  onClick={() => setSelectedTime(slot.time)}
                                  className={
                                    selectedTime === slot.time
                                      ? "bg-purple-500 hover:bg-purple-600 shadow-md shadow-purple-500/30"
                                      : "hover:border-purple-300 hover:bg-purple-50"
                                  }
                                >
                                  <Clock className="h-3 w-3 mr-1.5" />
                                  {slot.time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm Booking */}
          {step === 3 && selectedMentor && selectedDate && selectedTime && (
            <div className="space-y-6">
              <Card variant="sage" className="border-green-300 bg-green-50">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-forest-700 flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mentor Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-green-300">
                      <AvatarImage src={selectedMentor.image || undefined} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-display text-lg">
                        {selectedMentor.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg font-display text-charcoal-800">
                        {selectedMentor.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={LEVELS[selectedMentor.level]?.color}>
                          {LEVELS[selectedMentor.level]?.label} Mentor
                        </Badge>
                        {selectedMentor.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{selectedMentor.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid gap-4 sm:grid-cols-2 p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-600 font-body">Date</p>
                        <p className="font-medium font-display text-charcoal-800">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-600 font-body">Time</p>
                        <p className="font-medium font-display text-charcoal-800">
                          {selectedTime}
                          {userPackage && (
                            <span className="text-sm text-charcoal-600 ml-1">
                              ({userPackage.sessionDuration} min)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {userPackage && (
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Package className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                          <p className="text-xs text-charcoal-600 font-body">Session</p>
                          <p className="font-medium font-display text-charcoal-800">
                            {userPackage.usedSessions + 1} of {userPackage.totalSessions}
                            <span className="text-sm text-charcoal-600 ml-1">
                              ({userPackage.remainingSessions - 1} remaining after)
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Globe className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-600 font-body">Timezone</p>
                        <p className="font-medium font-display text-charcoal-800 text-sm">
                          {userTimezone}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Section */}
              <div>
                <Label htmlFor="notes" className="text-base font-display text-charcoal-800 mb-2 block">
                  Notes for the mentor (optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any topics you'd like to discuss, specific questions, or goals for this session..."
                  rows={4}
                  className="font-body resize-none"
                />
                <p className="text-xs text-charcoal-500 font-body mt-2">
                  Your mentor will review these notes before the session to better prepare
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="font-body"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30 font-body"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleBooking}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30 font-body"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking Session...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirm Booking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
