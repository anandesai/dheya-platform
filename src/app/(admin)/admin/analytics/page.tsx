"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import {
  Users,
  Package,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  Loader2,
  BarChart3,
  PieChart,
} from "lucide-react"

interface DashboardData {
  users: {
    total: number
    newThisMonth: number
    active: number
    growthRate: number
    bySegment: { segment: string; count: number }[]
  }
  packages: {
    totalPurchases: number
    revenueBySegment: { segment: string; revenue: number }[]
  }
  assessments: {
    total: number
    thisMonth: number
    completionRate: number
  }
  mentors: {
    total: number
    active: number
    avgRating: number | null
  }
  bookings: {
    total: number
    thisMonth: number
    completed: number
    completionRate: number
  }
}

interface ToolAnalytics {
  id: string
  code: string
  name: string
  category: string
  totalStarts: number
  totalCompletions: number
  completionRate: number
}

interface MentorAnalytics {
  id: string
  name: string
  level: string
  isActive: boolean
  totalBookings: number
  completedSessions: number
  totalMentees: number
  rating: number | null
  utilization: number
}

const SEGMENT_LABELS: Record<string, string> = {
  EARLY_CAREER: "Early Career",
  MID_CAREER: "Mid Career",
  SENIOR: "Senior",
  RETURNING_WOMEN: "Returning Women",
}

const SEGMENT_COLORS: Record<string, string> = {
  EARLY_CAREER: "bg-blue-500",
  MID_CAREER: "bg-purple-500",
  SENIOR: "bg-amber-500",
  RETURNING_WOMEN: "bg-green-500",
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [toolsData, setToolsData] = useState<ToolAnalytics[]>([])
  const [mentorsData, setMentorsData] = useState<MentorAnalytics[]>([])
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  useEffect(() => {
    if (activeTab === "tools") {
      fetchToolsData()
    } else if (activeTab === "mentors") {
      fetchMentorsData()
    }
  }, [activeTab])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/analytics?type=dashboard")
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchToolsData = async () => {
    try {
      const response = await fetch("/api/admin/analytics?type=tools")
      if (!response.ok) throw new Error("Failed to fetch tools analytics")
      const data = await response.json()
      setToolsData(data.tools || [])
    } catch (error) {
      console.error("Error fetching tools analytics:", error)
    }
  }

  const fetchMentorsData = async () => {
    try {
      const response = await fetch("/api/admin/analytics?type=mentors")
      if (!response.ok) throw new Error("Failed to fetch mentors analytics")
      const data = await response.json()
      setMentorsData(data.mentors || [])
    } catch (error) {
      console.error("Error fetching mentors analytics:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalRevenue =
    dashboardData?.packages.revenueBySegment.reduce(
      (sum, s) => sum + s.revenue,
      0
    ) || 0

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-800">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Platform performance and insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.users.total || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {dashboardData?.users.growthRate !== undefined && (
                <>
                  {dashboardData.users.growthRate >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span
                    className={
                      dashboardData.users.growthRate >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {dashboardData.users.growthRate}%
                  </span>
                  <span className="ml-1">vs last month</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.packages.totalPurchases || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalRevenue)} total revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.assessments.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.assessments.completionRate || 0}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.bookings.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.bookings.completionRate || 0}% completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tools">Assessments</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Users by Segment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Users by Segment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.users.bySegment.map((segment) => {
                    const percentage = dashboardData.users.total > 0
                      ? Math.round((segment.count / dashboardData.users.total) * 100)
                      : 0
                    return (
                      <div key={segment.segment} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{SEGMENT_LABELS[segment.segment] || segment.segment}</span>
                          <span className="font-medium">
                            {segment.count} ({percentage}%)
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Segment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue by Segment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.packages.revenueBySegment.map((segment) => {
                    const percentage = totalRevenue > 0
                      ? Math.round((segment.revenue / totalRevenue) * 100)
                      : 0
                    return (
                      <div key={segment.segment} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{SEGMENT_LABELS[segment.segment] || segment.segment}</span>
                          <span className="font-medium">
                            {formatCurrency(segment.revenue)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground w-10">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mentor Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Mentor Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboardData?.mentors.total || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Mentors</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData?.mentors.active || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Mentors</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
                    {dashboardData?.mentors.avgRating?.toFixed(1) || "N/A"}
                    {dashboardData?.mentors.avgRating && (
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardData?.bookings.thisMonth || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Sessions This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Users This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.users.newThisMonth || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.users.active || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active in the last 7 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.users.total
                    ? Math.round(
                        (dashboardData.users.active / dashboardData.users.total) * 100
                      )
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Distribution by Segment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {dashboardData?.users.bySegment.map((segment) => (
                  <div
                    key={segment.segment}
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          SEGMENT_COLORS[segment.segment] || "bg-gray-400"
                        }`}
                      />
                      <span className="font-medium text-sm">
                        {SEGMENT_LABELS[segment.segment] || segment.segment}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{segment.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Performance</CardTitle>
              <CardDescription>
                Completion rates and usage statistics for all assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Started</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                    <TableHead className="text-right">Completion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toolsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading...</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    toolsData.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {tool.code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tool.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{tool.totalStarts}</TableCell>
                        <TableCell className="text-right">
                          {tool.totalCompletions}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress
                              value={tool.completionRate}
                              className="w-16 h-2"
                            />
                            <span className="text-sm w-10">{tool.completionRate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentors Tab */}
        <TabsContent value="mentors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Performance</CardTitle>
              <CardDescription>
                Individual mentor statistics and utilization rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Sessions</TableHead>
                    <TableHead className="text-right">Mentees</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentorsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading...</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    mentorsData.map((mentor) => (
                      <TableRow key={mentor.id}>
                        <TableCell className="font-medium">{mentor.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{mentor.level}</Badge>
                        </TableCell>
                        <TableCell>
                          {mentor.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {mentor.completedSessions}/{mentor.totalBookings}
                        </TableCell>
                        <TableCell className="text-right">{mentor.totalMentees}</TableCell>
                        <TableCell className="text-right">
                          {mentor.rating ? (
                            <div className="flex items-center justify-end gap-1">
                              <span>{mentor.rating.toFixed(1)}</span>
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress
                              value={mentor.utilization}
                              className="w-16 h-2"
                            />
                            <span className="text-sm w-10">{mentor.utilization}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
