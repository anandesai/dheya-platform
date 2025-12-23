"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Save,
  Loader2,
  Star,
  Users,
  Calendar,
  Clock,
  Award,
  Linkedin,
  Mail,
  Phone,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

interface MentorDetail {
  id: string
  userId: string
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    image: string | null
    phone: string | null
  }
  level: "L1" | "L2" | "L3" | "L4"
  specializations: string[]
  certifications: string[]
  bio: string | null
  yearsExperience: number | null
  linkedinUrl: string | null
  isActive: boolean
  totalMentees: number
  rating: number | null
  availability: AvailabilitySlot[]
  stats: {
    totalBookings: number
    upcomingBookings: number
    completedBookings: number
    averageRating: number | null
  }
  recentBookings: RecentBooking[]
}

interface AvailabilitySlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isRecurring: boolean
}

interface RecentBooking {
  id: string
  scheduledAt: string
  status: string
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  }
}

const LEVELS = [
  { value: "L1", label: "Level 1 - Associate Mentor", color: "bg-blue-100 text-blue-800" },
  { value: "L2", label: "Level 2 - Senior Mentor", color: "bg-green-100 text-green-800" },
  { value: "L3", label: "Level 3 - Lead Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L4", label: "Level 4 - Principal Mentor", color: "bg-amber-100 text-amber-800" },
]

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career" },
  { value: "MID_CAREER", label: "Mid Career" },
  { value: "SENIOR", label: "Senior" },
  { value: "RETURNING_WOMEN", label: "Returning Women" },
]

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function MentorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const mentorId = params.mentorId as string

  const [mentor, setMentor] = useState<MentorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Form state
  const [formData, setFormData] = useState({
    level: "L1" as "L1" | "L2" | "L3" | "L4",
    specializations: [] as string[],
    certifications: [] as string[],
    bio: "",
    yearsExperience: 0,
    linkedinUrl: "",
    isActive: true,
  })

  // Availability state
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    isRecurring: true,
  })

  // Certifications input
  const [newCertification, setNewCertification] = useState("")

  useEffect(() => {
    fetchMentor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorId])

  const fetchMentor = async () => {
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Mentor not found")
          router.push("/admin/mentors")
          return
        }
        throw new Error("Failed to fetch mentor")
      }

      const data = await response.json()
      setMentor(data.mentor)
      setFormData({
        level: data.mentor.level,
        specializations: data.mentor.specializations || [],
        certifications: data.mentor.certifications || [],
        bio: data.mentor.bio || "",
        yearsExperience: data.mentor.yearsExperience || 0,
        linkedinUrl: data.mentor.linkedinUrl || "",
        isActive: data.mentor.isActive,
      })
      setAvailability(data.mentor.availability || [])
    } catch (error) {
      console.error("Error fetching mentor:", error)
      toast.error("Failed to load mentor details")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update mentor")
      }

      toast.success("Mentor updated successfully")
      fetchMentor()
    } catch (error) {
      console.error("Error updating mentor:", error)
      toast.error("Failed to update mentor")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !formData.isActive }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
      toast.success(`Mentor ${formData.isActive ? "deactivated" : "activated"}`)
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleSpecializationToggle = (segment: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(segment)
        ? prev.specializations.filter((s) => s !== segment)
        : [...prev.specializations, segment],
    }))
  }

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }))
      setNewCertification("")
    }
  }

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const handleAddAvailability = async () => {
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability: [...availability, newSlot],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add availability")
      }

      toast.success("Availability slot added")
      fetchMentor()
    } catch (error) {
      console.error("Error adding availability:", error)
      toast.error("Failed to add availability slot")
    }
  }

  const handleRemoveAvailability = async (slotId: string) => {
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability: availability.filter((slot) => slot.id !== slotId),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove availability")
      }

      toast.success("Availability slot removed")
      fetchMentor()
    } catch (error) {
      console.error("Error removing availability:", error)
      toast.error("Failed to remove availability slot")
    }
  }

  const getLevelBadge = (level: string) => {
    const config = LEVELS.find((l) => l.value === level)
    return config ? (
      <Badge className={config.color}>{config.label}</Badge>
    ) : (
      <Badge variant="secondary">{level}</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      NO_SHOW: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.replace("_", " ")}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!mentor) {
    return null
  }

  const mentorName =
    [mentor.user.firstName, mentor.user.lastName].filter(Boolean).join(" ") ||
    mentor.user.email

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/mentors")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mentor.user.image || undefined} alt={mentorName} />
              <AvatarFallback className="text-lg">
                {mentorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-forest-800">{mentorName}</h1>
              <div className="flex items-center gap-2 mt-1">
                {getLevelBadge(mentor.level)}
                {formData.isActive ? (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Switch checked={formData.isActive} onCheckedChange={handleToggleActive} />
            <span className="text-sm text-muted-foreground">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentor.totalMentees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentor.stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {mentor.stats?.upcomingBookings || 0} upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentor.yearsExperience || 0} years</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {mentor.rating ? mentor.rating.toFixed(1) : "N/A"}
              {mentor.rating && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{mentor.user.email}</span>
                </div>
                {mentor.user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{mentor.user.phone}</span>
                  </div>
                )}
                {formData.linkedinUrl && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                <div className="pt-4">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Level & Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Level & Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Mentor Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        level: value as "L1" | "L2" | "L3" | "L4",
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        yearsExperience: parseInt(e.target.value) || 0,
                      }))
                    }
                    min={0}
                    max={50}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
              <CardDescription>
                Select the user segments this mentor specializes in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {SEGMENTS.map((segment) => (
                  <div
                    key={segment.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={segment.value}
                      checked={formData.specializations.includes(segment.value)}
                      onCheckedChange={() => handleSpecializationToggle(segment.value)}
                    />
                    <label
                      htmlFor={segment.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {segment.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Add mentor certifications and credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Enter certification name..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddCertification()}
                />
                <Button onClick={handleAddCertification} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {cert}
                    <button
                      onClick={() => handleRemoveCertification(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
                {formData.certifications.length === 0 && (
                  <p className="text-sm text-muted-foreground">No certifications added</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
              <CardDescription>A brief description of the mentor</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Write a brief biography..."
                rows={4}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Availability Slot</CardTitle>
              <CardDescription>Set regular availability for booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <Label>Day</Label>
                  <Select
                    value={newSlot.dayOfWeek.toString()}
                    onValueChange={(value) =>
                      setNewSlot((prev) => ({ ...prev, dayOfWeek: parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={newSlot.isRecurring}
                      onCheckedChange={(checked) =>
                        setNewSlot((prev) => ({ ...prev, isRecurring: checked === true }))
                      }
                    />
                    <label htmlFor="recurring" className="text-sm">
                      Recurring
                    </label>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddAvailability}>Add Slot</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Availability</CardTitle>
            </CardHeader>
            <CardContent>
              {availability.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No availability slots configured
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Recurring</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availability.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell className="font-medium">
                          {DAYS[slot.dayOfWeek]}
                        </TableCell>
                        <TableCell>{slot.startTime}</TableCell>
                        <TableCell>{slot.endTime}</TableCell>
                        <TableCell>
                          {slot.isRecurring ? (
                            <Badge className="bg-green-100 text-green-800">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAvailability(slot.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest mentoring sessions with this mentor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mentor.recentBookings?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No bookings yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mentee</TableHead>
                      <TableHead>Scheduled At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentor.recentBookings?.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {[booking.user.firstName, booking.user.lastName]
                                .filter(Boolean)
                                .join(" ") || booking.user.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDate(booking.scheduledAt)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
