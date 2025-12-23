"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Plus,
  Search,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Package,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import { QuickGenerateDialog } from "@/components/admin/quick-generate-dialog"
import { PackageComparison } from "@/components/admin/package-comparison"
import { BulkPricingManager } from "@/components/admin/bulk-pricing-manager"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutList, DollarSign, GitCompare } from "lucide-react"

// Types
interface PackageData {
  id: string
  code: string
  tier: "GUIDANCE" | "PLANNING" | "MENTORSHIP"
  segment: "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN"
  productName: string
  packageName: string
  fullName: string
  description: string | null
  isActive: boolean
  isPublished: boolean
  price: number
  totalSessions: number
  _count?: {
    userPackages: number
    packagePhases: number
    packageToolAccess: number
  }
}

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career" },
  { value: "MID_CAREER", label: "Mid Career" },
  { value: "SENIOR", label: "Senior" },
  { value: "RETURNING_WOMEN", label: "Returning Women" },
]

const TIERS = [
  { value: "GUIDANCE", label: "Guidance", color: "bg-blue-100 text-blue-800" },
  { value: "PLANNING", label: "Planning", color: "bg-purple-100 text-purple-800" },
  { value: "MENTORSHIP", label: "Mentorship", color: "bg-amber-100 text-amber-800" },
]

export default function PackagesPage() {
  const searchParams = useSearchParams()
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<PackageData | null>(null)
  const [quickGenerateOpen, setQuickGenerateOpen] = useState(
    searchParams.get("action") === "quick-generate"
  )
  const [viewMode, setViewMode] = useState<"list" | "compare" | "pricing">("list")

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (segmentFilter !== "all") params.set("segment", segmentFilter)
      if (tierFilter !== "all") params.set("tier", tierFilter)
      if (statusFilter === "active") params.set("isActive", "true")
      if (statusFilter === "inactive") params.set("isActive", "false")
      if (statusFilter === "published") params.set("isPublished", "true")
      if (statusFilter === "draft") params.set("isPublished", "false")

      const response = await fetch(`/api/admin/packages?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch packages")
      const data = await response.json()
      setPackages(data)
    } catch {
      toast.error("Failed to load packages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentFilter, tierFilter, statusFilter])

  const handlePublish = async (pkg: PackageData) => {
    try {
      const response = await fetch(`/api/admin/packages/${pkg.id}/publish`, {
        method: pkg.isPublished ? "DELETE" : "POST",
      })
      if (!response.ok) throw new Error("Failed to update package")
      toast.success(pkg.isPublished ? "Package unpublished" : "Package published")
      fetchPackages()
    } catch {
      toast.error("Failed to update package")
    }
  }

  const handleClone = async (pkg: PackageData) => {
    try {
      const response = await fetch(`/api/admin/packages/${pkg.id}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCode: `${pkg.code}-copy` }),
      })
      if (!response.ok) throw new Error("Failed to clone package")
      toast.success("Package cloned successfully")
      fetchPackages()
    } catch {
      toast.error("Failed to clone package")
    }
  }

  const handleDelete = async () => {
    if (!packageToDelete) return
    try {
      const response = await fetch(`/api/admin/packages/${packageToDelete.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete package")
      }
      toast.success("Package deleted successfully")
      setDeleteDialogOpen(false)
      setPackageToDelete(null)
      fetchPackages()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete package")
    }
  }

  const filteredPackages = packages.filter((pkg) =>
    pkg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTierBadge = (tier: string) => {
    const tierConfig = TIERS.find((t) => t.value === tier)
    return tierConfig ? (
      <Badge className={tierConfig.color}>{tierConfig.label}</Badge>
    ) : null
  }

  const getSegmentLabel = (segment: string) => {
    return SEGMENTS.find((s) => s.value === segment)?.label || segment
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Packages</h2>
          <p className="text-muted-foreground">
            Manage your package offerings and configurations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList>
              <TabsTrigger value="list">
                <LayoutList className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="compare">
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <DollarSign className="h-4 w-4 mr-2" />
                Pricing
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={() => setQuickGenerateOpen(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Quick Generate
          </Button>
          <Link href="/admin/packages/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Package
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                {SEGMENTS.map((seg) => (
                  <SelectItem key={seg.value} value={seg.value}>
                    {seg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {TIERS.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label}
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Content */}
      {viewMode === "compare" ? (
        <PackageComparison packages={packages} segment={segmentFilter !== "all" ? segmentFilter : undefined} />
      ) : viewMode === "pricing" ? (
        <BulkPricingManager packages={packages} onUpdate={fetchPackages} />
      ) : loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPackages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No packages found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || segmentFilter !== "all" || tierFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first package"}
            </p>
            <Link href="/admin/packages/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Package
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{pkg.fullName}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {pkg.code}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClone(pkg)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePublish(pkg)}>
                        {pkg.isPublished ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setPackageToDelete(pkg)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getTierBadge(pkg.tier)}
                  <Badge variant="outline">{getSegmentLabel(pkg.segment)}</Badge>
                  {pkg.isPublished ? (
                    <Badge className="bg-green-100 text-green-800">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {pkg.description || "No description provided"}
                </p>
                <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                  <div>
                    <p className="text-lg font-semibold">{pkg._count?.packagePhases || 0}</p>
                    <p className="text-xs text-muted-foreground">Phases</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{pkg._count?.packageToolAccess || 0}</p>
                    <p className="text-xs text-muted-foreground">Tools</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{pkg._count?.userPackages || 0}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(pkg.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pkg.totalSessions} sessions
                    </p>
                  </div>
                  <Link href={`/admin/packages/${pkg.id}`}>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{packageToDelete?.fullName}&quot;? This action
              cannot be undone.
              {packageToDelete?._count?.userPackages && packageToDelete._count.userPackages > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: This package has {packageToDelete._count.userPackages} active
                  user(s). You must reassign them before deleting.
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
              disabled={
                packageToDelete?._count?.userPackages
                  ? packageToDelete._count.userPackages > 0
                  : false
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Generate Dialog */}
      <QuickGenerateDialog
        open={quickGenerateOpen}
        onOpenChange={setQuickGenerateOpen}
        onSuccess={fetchPackages}
      />
    </div>
  )
}
