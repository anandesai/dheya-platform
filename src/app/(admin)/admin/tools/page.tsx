"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Eye,
  FileText,
  ClipboardList,
  Lightbulb,
  BarChart3,
  Dumbbell,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react"

// Tool types and mock data
type ToolCategory = "assessment" | "workbook" | "framework" | "report" | "exercise"
type UserSegment = "early_career" | "mid_career" | "senior" | "returning_women"
type ToolStatus = "draft" | "active" | "archived"

interface Tool {
  id: string
  code: string
  name: string
  category: ToolCategory
  segments: UserSegment[]
  phase: number
  questionsCount: number
  estimatedTime: number
  status: ToolStatus
  completionRate: number
  createdAt: string
  updatedAt: string
}

const categoryIcons: Record<ToolCategory, React.ElementType> = {
  assessment: ClipboardList,
  workbook: FileText,
  framework: Lightbulb,
  report: BarChart3,
  exercise: Dumbbell,
}

const categoryColors: Record<ToolCategory, string> = {
  assessment: "bg-purple-100 text-purple-700",
  workbook: "bg-blue-100 text-blue-700",
  framework: "bg-amber-100 text-amber-700",
  report: "bg-green-100 text-green-700",
  exercise: "bg-pink-100 text-pink-700",
}

const segmentIcons: Record<UserSegment, React.ElementType> = {
  early_career: GraduationCap,
  mid_career: Briefcase,
  senior: Users,
  returning_women: Heart,
}

const segmentLabels: Record<UserSegment, string> = {
  early_career: "Early Career",
  mid_career: "Mid-Career",
  senior: "Senior",
  returning_women: "Returning Women",
}

const statusColors: Record<ToolStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  archived: "bg-red-100 text-red-700",
}

// Mock data - in production, this would come from the API
const mockTools: Tool[] = [
  {
    id: "1",
    code: "BBD-001",
    name: "BBD Syndrome Assessment",
    category: "assessment",
    segments: ["mid_career"],
    phase: 1,
    questionsCount: 22,
    estimatedTime: 15,
    status: "active",
    completionRate: 87,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "2",
    code: "WV-001",
    name: "Work Values Assessment",
    category: "assessment",
    segments: ["early_career", "mid_career", "senior", "returning_women"],
    phase: 2,
    questionsCount: 32,
    estimatedTime: 20,
    status: "active",
    completionRate: 92,
    createdAt: "2024-01-20",
    updatedAt: "2024-03-15",
  },
  {
    id: "3",
    code: "CLIQI-001",
    name: "CLIQI Diagnostic",
    category: "assessment",
    segments: ["early_career", "mid_career", "senior", "returning_women"],
    phase: 1,
    questionsCount: 25,
    estimatedTime: 15,
    status: "active",
    completionRate: 95,
    createdAt: "2024-01-10",
    updatedAt: "2024-03-20",
  },
  {
    id: "4",
    code: "KPM-001",
    name: "Knowledge-Passion Matrix",
    category: "framework",
    segments: ["mid_career", "senior"],
    phase: 2,
    questionsCount: 0,
    estimatedTime: 25,
    status: "active",
    completionRate: 78,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-05",
  },
  {
    id: "5",
    code: "LST-001",
    name: "Life Stage Timeline",
    category: "workbook",
    segments: ["mid_career", "senior"],
    phase: 3,
    questionsCount: 10,
    estimatedTime: 30,
    status: "active",
    completionRate: 65,
    createdAt: "2024-02-10",
    updatedAt: "2024-03-01",
  },
  {
    id: "6",
    code: "PM-001",
    name: "Possibility Matrix",
    category: "framework",
    segments: ["early_career"],
    phase: 2,
    questionsCount: 8,
    estimatedTime: 20,
    status: "active",
    completionRate: 82,
    createdAt: "2024-02-15",
    updatedAt: "2024-02-28",
  },
  {
    id: "7",
    code: "WA-001",
    name: "Wisdom Assets Portfolio",
    category: "workbook",
    segments: ["senior"],
    phase: 3,
    questionsCount: 15,
    estimatedTime: 35,
    status: "draft",
    completionRate: 0,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-15",
  },
  {
    id: "8",
    code: "RR-001",
    name: "Re-entry Readiness Assessment",
    category: "assessment",
    segments: ["returning_women"],
    phase: 1,
    questionsCount: 28,
    estimatedTime: 18,
    status: "draft",
    completionRate: 0,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-12",
  },
]

export default function ToolsLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTools, setSelectedTools] = useState<string[]>([])

  // Filter tools
  const filteredTools = useMemo(() => {
    return mockTools.filter((tool) => {
      const matchesSearch =
        searchQuery === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.code.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        categoryFilter === "all" || tool.category === categoryFilter
      const matchesSegment =
        segmentFilter === "all" ||
        tool.segments.includes(segmentFilter as UserSegment)
      const matchesStatus =
        statusFilter === "all" || tool.status === statusFilter
      return matchesSearch && matchesCategory && matchesSegment && matchesStatus
    })
  }, [searchQuery, categoryFilter, segmentFilter, statusFilter])

  // Stats
  const stats = useMemo(() => {
    return {
      total: mockTools.length,
      active: mockTools.filter((t) => t.status === "active").length,
      draft: mockTools.filter((t) => t.status === "draft").length,
      assessments: mockTools.filter((t) => t.category === "assessment").length,
    }
  }, [])

  const toggleToolSelection = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    )
  }

  const toggleAllSelection = () => {
    if (selectedTools.length === filteredTools.length) {
      setSelectedTools([])
    } else {
      setSelectedTools(filteredTools.map((t) => t.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tools Library</h1>
          <p className="text-muted-foreground">
            Manage assessments, workbooks, and frameworks
          </p>
        </div>
        <Link href="/admin/tools/new">
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create Tool
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tools</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.assessments}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="workbook">Workbook</SelectItem>
                <SelectItem value="framework">Framework</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="early_career">Early Career</SelectItem>
                <SelectItem value="mid_career">Mid-Career</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="returning_women">Returning Women</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTools.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700">
                {selectedTools.length} tool(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Change Status
                </Button>
                <Button size="sm" variant="outline">
                  Assign to Segment
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tools Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedTools.length === filteredTools.length &&
                      filteredTools.length > 0
                    }
                    onCheckedChange={toggleAllSelection}
                  />
                </TableHead>
                <TableHead>Tool</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Segments</TableHead>
                <TableHead className="text-center">Phase</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead className="text-center">Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Completion</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => {
                const CategoryIcon = categoryIcons[tool.category]
                return (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTools.includes(tool.id)}
                        onCheckedChange={() => toggleToolSelection(tool.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${categoryColors[tool.category]}`}
                        >
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tool.code}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={categoryColors[tool.category]}
                      >
                        {tool.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {tool.segments.slice(0, 2).map((segment) => {
                          const SegmentIcon = segmentIcons[segment]
                          return (
                            <div
                              key={segment}
                              className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center"
                              title={segmentLabels[segment]}
                            >
                              <SegmentIcon className="h-3 w-3 text-gray-600" />
                            </div>
                          )
                        })}
                        {tool.segments.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                            +{tool.segments.length - 2}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">P{tool.phase}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {tool.questionsCount > 0 ? tool.questionsCount : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {tool.estimatedTime}m
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[tool.status]}>
                        {tool.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {tool.status === "active" ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${tool.completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {tool.completionRate}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/tools/${tool.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tools found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or create a new tool.
              </p>
              <Link href="/admin/tools/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tool
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
