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

export default function BookSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedMentorId = searchParams.get("mentorId")

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

  // Step 3: Confirmation
  const [notes, setNotes] = useState("")

  useEffect(() => {
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
    if (selectedMentor && selectedDate) {
      fetchAvailableSlots()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMentor, selectedDate])

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
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create booking")
      }

      toast.success("Session booked successfully!")
      router.push("/sessions")
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/sessions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-display text-charcoal-800">Book a Session</h1>
          <p className="text-charcoal-600 font-body">
            Schedule a mentoring session with one of our experts
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                step === s.id
                  ? "bg-purple-500 text-white"
                  : step > s.id
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
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
                className={`w-12 h-0.5 mx-2 ${
                  step > s.id ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card variant="light">
        <CardContent className="pt-6">
          {/* Step 1: Select Mentor */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-600 font-body" />
                  <Input
                    placeholder="Search mentors..."
                    value={mentorSearch}
                    onChange={(e) => setMentorSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger className="w-[200px]">
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
                <p className="text-center text-charcoal-600 font-body py-12">
                  No mentors found
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredMentors.map((mentor) => (
                    <Card
                      key={mentor.id}
                      variant="light"
                      className={`cursor-pointer transition-all ${
                        selectedMentor?.id === mentor.id
                          ? "ring-2 ring-purple-500 bg-purple-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedMentor(mentor)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={mentor.image || undefined} />
                            <AvatarFallback>
                              {mentor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium font-display truncate">{mentor.name}</h3>
                              {mentor.rating && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span>{mentor.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <Badge className={LEVELS[mentor.level]?.color || "bg-gray-100"}>
                              {LEVELS[mentor.level]?.label || mentor.level}
                            </Badge>
                            {mentor.bio && (
                              <p className="text-sm text-charcoal-600 font-body mt-2 line-clamp-2">
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
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedMentor.image || undefined} />
                  <AvatarFallback>
                    {selectedMentor.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedMentor.name}</p>
                  <Badge className={LEVELS[selectedMentor.level]?.color}>
                    {LEVELS[selectedMentor.level]?.label}
                  </Badge>
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

              <div className="grid gap-6 md:grid-cols-2">
                {/* Calendar */}
                <div>
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <Label className="mb-2 block">Select Time</Label>
                  {!selectedDate ? (
                    <p className="text-charcoal-600 font-body text-sm">
                      Please select a date first
                    </p>
                  ) : loadingSlots ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-charcoal-600 font-body text-sm">
                      No available slots for this date
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={
                            selectedTime === slot.time
                              ? "bg-purple-500 hover:bg-purple-600"
                              : ""
                          }
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm Booking */}
          {step === 3 && selectedMentor && selectedDate && selectedTime && (
            <div className="space-y-6">
              <Card variant="light" className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="font-display text-green-800">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={selectedMentor.image || undefined} />
                      <AvatarFallback>
                        {selectedMentor.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{selectedMentor.name}</p>
                      <Badge className={LEVELS[selectedMentor.level]?.color}>
                        {LEVELS[selectedMentor.level]?.label} Mentor
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-charcoal-600 font-body">Date</p>
                        <p className="font-medium">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-charcoal-600 font-body">Time</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="notes">Notes for the mentor (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any topics you'd like to discuss or questions you have..."
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleBooking}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking...
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
