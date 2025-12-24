"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Star,
  Calendar,
  Filter,
  UserPlus,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

// Types
interface MentorData {
  id: string
  userId: string
  name: string
  email: string
  image: string | null
  level: "L1" | "L2" | "L3" | "L4"
  specializations: string[]
  bio: string | null
  yearsExperience: number | null
  totalMentees: number
  rating: number | null
  isActive: boolean
  bookingsCount: number
}

interface EligibleUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

const LEVELS = [
  { value: "L1", label: "L1 - Certified Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L2", label: "L2 - Expert Mentor", color: "bg-purple-100 text-purple-800" },
  { value: "L3", label: "L3 - Master Mentor", color: "bg-amber-100 text-amber-800" },
  { value: "L4", label: "L4 - Accredited Trainer", color: "bg-green-100 text-green-800" },
]

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career" },
  { value: "MID_CAREER", label: "Mid Career" },
  { value: "SENIOR", label: "Senior" },
  { value: "RETURNING_WOMEN", label: "Returning Women" },
]

export default function MentorsPage() {
  const [mentors, setMentors] = useState<MentorData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mentorToDelete, setMentorToDelete] = useState<MentorData | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [eligibleUsers, setEligibleUsers] = useState<EligibleUser[]>([])
  const [loadingEligible, setLoadingEligible] = useState(false)

  // Create form state
  const [newMentor, setNewMentor] = useState({
    userId: "",
    level: "L1",
    specializations: [] as string[],
    bio: "",
    yearsExperience: 0,
    linkedinUrl: "",
  })

  const fetchMentors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (levelFilter !== "all") params.set("level", levelFilter)
      if (statusFilter === "active") params.set("isActive", "true")
      if (statusFilter === "inactive") params.set("isActive", "false")
      if (searchQuery) params.set("search", searchQuery)

      const response = await fetch(`/api/admin/mentors?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch mentors")
      const data = await response.json()
      setMentors(data.mentors)
    } catch {
      toast.error("Failed to load mentors")
    } finally {
      setLoading(false)
    }
  }

  const fetchEligibleUsers = async () => {
    setLoadingEligible(true)
    try {
      const response = await fetch("/api/admin/mentors?eligible=true")
      if (!response.ok) throw new Error("Failed to fetch eligible users")
      const data = await response.json()
      setEligibleUsers(data.users)
    } catch {
      toast.error("Failed to load eligible users")
    } finally {
      setLoadingEligible(false)
    }
  }

  useEffect(() => {
    fetchMentors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelFilter, statusFilter])

  useEffect(() => {
    if (createDialogOpen) {
      fetchEligibleUsers()
    }
  }, [createDialogOpen])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMentors()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleToggleActive = async (mentor: MentorData) => {
    try {
      const response = await fetch(`/api/admin/mentors/${mentor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !mentor.isActive }),
      })
      if (!response.ok) throw new Error("Failed to update mentor")
      toast.success(mentor.isActive ? "Mentor deactivated" : "Mentor activated")
      fetchMentors()
    } catch {
      toast.error("Failed to update mentor")
    }
  }

  const handleDelete = async () => {
    if (!mentorToDelete) return
    try {
      const response = await fetch(`/api/admin/mentors/${mentorToDelete.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete mentor")
      }
      toast.success("Mentor deleted successfully")
      setDeleteDialogOpen(false)
      setMentorToDelete(null)
      fetchMentors()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete mentor")
    }
  }

  const handleCreate = async () => {
    if (!newMentor.userId) {
      toast.error("Please select a user")
      return
    }

    setCreating(true)
    try {
      const response = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMentor),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create mentor")
      }

      toast.success("Mentor created successfully")
      setCreateDialogOpen(false)
      setNewMentor({
        userId: "",
        level: "L1",
        specializations: [],
        bio: "",
        yearsExperience: 0,
        linkedinUrl: "",
      })
      fetchMentors()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create mentor")
    } finally {
      setCreating(false)
    }
  }

  const getLevelBadge = (level: string) => {
    const levelConfig = LEVELS.find((l) => l.value === level)
    return levelConfig ? (
      <Badge className={levelConfig.color}>{level}</Badge>
    ) : null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Stats
  const totalMentors = mentors.length
  const activeMentors = mentors.filter((m) => m.isActive).length
  const totalMentees = mentors.reduce((acc, m) => acc + m.totalMentees, 0)
  const avgRating = mentors.filter((m) => m.rating).length > 0
    ? (mentors.reduce((acc, m) => acc + (m.rating || 0), 0) / mentors.filter((m) => m.rating).length).toFixed(1)
    : "N/A"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mentors</h2>
          <p className="text-muted-foreground">
            Manage mentor profiles and assignments
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Mentor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMentors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMentors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMentees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mentor Directory</CardTitle>
          <CardDescription>
            {mentors.length} mentor{mentors.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || levelFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding your first mentor"}
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Mentor
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Specializations</TableHead>
                  <TableHead className="text-center">Experience</TableHead>
                  <TableHead className="text-center">Mentees</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={mentor.image || undefined} />
                          <AvatarFallback>{getInitials(mentor.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{mentor.name}</p>
                          <p className="text-xs text-muted-foreground">{mentor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(mentor.level)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {mentor.specializations.slice(0, 2).map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {SEGMENTS.find((s) => s.value === spec)?.label || spec}
                          </Badge>
                        ))}
                        {mentor.specializations.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.specializations.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {mentor.yearsExperience ? `${mentor.yearsExperience} yrs` : "—"}
                    </TableCell>
                    <TableCell className="text-center">{mentor.totalMentees}</TableCell>
                    <TableCell className="text-center">
                      {mentor.rating ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span>{mentor.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {mentor.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/mentors/${mentor.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(mentor)}>
                            {mentor.isActive ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setMentorToDelete(mentor)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mentor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{mentorToDelete?.name}&quot;? This action
              cannot be undone.
              {mentorToDelete?.bookingsCount && mentorToDelete.bookingsCount > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: This mentor has {mentorToDelete.bookingsCount} booking(s).
                  They must be completed or reassigned first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={mentorToDelete?.bookingsCount ? mentorToDelete.bookingsCount > 0 : false}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Mentor Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Mentor</DialogTitle>
            <DialogDescription>
              Create a new mentor profile by selecting a user and configuring their details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select User *</Label>
              {loadingEligible ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading eligible users...
                </div>
              ) : (
                <Select
                  value={newMentor.userId}
                  onValueChange={(value) => setNewMentor({ ...newMentor, userId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user to become a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleUsers.length === 0 ? (
                      <SelectItem value="" disabled>No eligible users found</SelectItem>
                    ) : (
                      eligibleUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email} ({user.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mentor Level *</Label>
                <Select
                  value={newMentor.level}
                  onValueChange={(value) => setNewMentor({ ...newMentor, level: value })}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={newMentor.yearsExperience}
                  onChange={(e) =>
                    setNewMentor({ ...newMentor, yearsExperience: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="grid grid-cols-2 gap-2">
                {SEGMENTS.map((segment) => (
                  <div key={segment.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={segment.value}
                      checked={newMentor.specializations.includes(segment.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewMentor({
                            ...newMentor,
                            specializations: [...newMentor.specializations, segment.value],
                          })
                        } else {
                          setNewMentor({
                            ...newMentor,
                            specializations: newMentor.specializations.filter((s) => s !== segment.value),
                          })
                        }
                      }}
                    />
                    <label htmlFor={segment.value} className="text-sm cursor-pointer">
                      {segment.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Brief description of the mentor's background and expertise..."
                value={newMentor.bio}
                onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={newMentor.linkedinUrl}
                onChange={(e) => setNewMentor({ ...newMentor, linkedinUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating || !newMentor.userId}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Mentor
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
