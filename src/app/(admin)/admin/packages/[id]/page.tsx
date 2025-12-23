"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Settings,
  Layers,
  Wrench,
  Loader2,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { PhaseSelector } from "@/components/admin/phase-selector"
import { ToolAccessConfig } from "@/components/admin/tool-access-config"

interface PackagePhase {
  id: string
  phaseNumber: number
  isIncluded: boolean
  customName: string | null
}

interface PackageToolAccess {
  id: string
  toolId: string
  accessLevel: "FULL" | "VIEW_ONLY" | "TEASER" | "LOCKED"
  teaserConfig: Record<string, unknown> | null
  lockedMessage: string | null
  tool: {
    id: string
    code: string
    name: string
    category: string
  }
}

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
  packagePhases: PackagePhase[]
  packageToolAccess: PackageToolAccess[]
}

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career" },
  { value: "MID_CAREER", label: "Mid Career" },
  { value: "SENIOR", label: "Senior" },
  { value: "RETURNING_WOMEN", label: "Returning Women" },
]

const TIERS = [
  { value: "GUIDANCE", label: "Guidance" },
  { value: "PLANNING", label: "Planning" },
  { value: "MENTORSHIP", label: "Mentorship" },
]

export default function PackageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === "new"

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [autoConfiguring, setAutoConfiguring] = useState(false)

  const [formData, setFormData] = useState<{
    code: string
    tier: "GUIDANCE" | "PLANNING" | "MENTORSHIP"
    segment: "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN"
    productName: string
    packageName: string
    description: string
    price: number
    totalSessions: number
    isActive: boolean
  }>({
    code: "",
    tier: "GUIDANCE",
    segment: "EARLY_CAREER",
    productName: "",
    packageName: "",
    description: "",
    price: 4999,
    totalSessions: 2,
    isActive: true,
  })

  const [phases, setPhases] = useState<PackagePhase[]>([])
  const [toolAccess, setToolAccess] = useState<PackageToolAccess[]>([])
  const [isPublished, setIsPublished] = useState(false)

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/admin/packages/${id}`)
      if (!response.ok) throw new Error("Failed to fetch package")
      const data: PackageData = await response.json()

      setFormData({
        code: data.code,
        tier: data.tier,
        segment: data.segment,
        productName: data.productName,
        packageName: data.packageName,
        description: data.description || "",
        price: data.price,
        totalSessions: data.totalSessions,
        isActive: data.isActive,
      })
      setPhases(data.packagePhases)
      setToolAccess(data.packageToolAccess)
      setIsPublished(data.isPublished)
    } catch {
      toast.error("Failed to load package")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isNew) {
      fetchPackage()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = isNew ? "/api/admin/packages" : `/api/admin/packages/${id}`
      const method = isNew ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phases: phases.map((p) => ({
            phaseNumber: p.phaseNumber,
            isIncluded: p.isIncluded,
            customName: p.customName,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save package")
      }

      const savedPackage = await response.json()
      toast.success(isNew ? "Package created successfully" : "Package saved successfully")

      if (isNew) {
        router.push(`/admin/packages/${savedPackage.id}`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save package")
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    try {
      const response = await fetch(`/api/admin/packages/${id}/publish`, {
        method: isPublished ? "DELETE" : "POST",
      })
      if (!response.ok) throw new Error("Failed to update publish status")
      setIsPublished(!isPublished)
      toast.success(isPublished ? "Package unpublished" : "Package published")
    } catch {
      toast.error("Failed to update publish status")
    }
  }

  const handleAutoConfigureTools = async () => {
    setAutoConfiguring(true)
    try {
      const response = await fetch(`/api/admin/packages/${id}/auto-configure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enableTeaserMode: true }),
      })
      if (!response.ok) throw new Error("Failed to auto-configure tools")
      const data = await response.json()
      setToolAccess(data.packageToolAccess)
      toast.success("Tools auto-configured successfully")
    } catch {
      toast.error("Failed to auto-configure tools")
    } finally {
      setAutoConfiguring(false)
    }
  }

  const generateCode = () => {
    const tierCode = formData.tier.substring(0, 3).toLowerCase()
    const segmentCode = formData.segment.split("_").map((w) => w[0]).join("").toLowerCase()
    const productCode = formData.productName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toLowerCase()
    return `${productCode}-${segmentCode}-${tierCode}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/packages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isNew ? "Create Package" : formData.productName + " " + formData.packageName}
            </h2>
            <p className="text-muted-foreground">
              {isNew
                ? "Configure a new package offering"
                : `Code: ${formData.code}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button
              variant="outline"
              onClick={handlePublish}
            >
              {isPublished ? (
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
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status badges */}
      {!isNew && (
        <div className="flex items-center gap-2">
          <Badge
            className={
              formData.tier === "GUIDANCE"
                ? "bg-blue-100 text-blue-800"
                : formData.tier === "PLANNING"
                ? "bg-purple-100 text-purple-800"
                : "bg-amber-100 text-amber-800"
            }
          >
            {formData.tier}
          </Badge>
          <Badge variant="outline">
            {SEGMENTS.find((s) => s.value === formData.segment)?.label}
          </Badge>
          {isPublished ? (
            <Badge className="bg-green-100 text-green-800">Published</Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
          {formData.isActive ? (
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          ) : (
            <Badge variant="destructive">Inactive</Badge>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">
            <Settings className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="phases" disabled={isNew}>
            <Layers className="h-4 w-4 mr-2" />
            Phases
          </TabsTrigger>
          <TabsTrigger value="tools" disabled={isNew}>
            <Wrench className="h-4 w-4 mr-2" />
            Tool Access
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the package identity and classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="segment">Target Segment *</Label>
                  <Select
                    value={formData.segment}
                    onValueChange={(value) =>
                      setFormData({ ...formData, segment: value as typeof formData.segment })
                    }
                  >
                    <SelectTrigger id="segment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEGMENTS.map((seg) => (
                        <SelectItem key={seg.value} value={seg.value}>
                          {seg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier">Package Tier *</Label>
                  <Select
                    value={formData.tier}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tier: value as typeof formData.tier })
                    }
                  >
                    <SelectTrigger id="tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Career Clarity"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name *</Label>
                  <Input
                    id="packageName"
                    placeholder="e.g., Guidance, Planning"
                    value={formData.packageName}
                    onChange={(e) =>
                      setFormData({ ...formData, packageName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="code">Package Code *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      placeholder="unique-package-code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, code: generateCode() })}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for this package (lowercase, hyphens allowed)
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this package offers..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Sessions</CardTitle>
              <CardDescription>
                Set the package price and included sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessions">Total Sessions *</Label>
                  <Input
                    id="sessions"
                    type="number"
                    min={0}
                    value={formData.totalSessions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalSessions: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Control package availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Package is active and can be assigned to users
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phases Tab */}
        <TabsContent value="phases">
          <PhaseSelector
            tier={formData.tier}
            phases={phases}
            onPhasesChange={setPhases}
          />
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tool Access Configuration</CardTitle>
                  <CardDescription>
                    Configure which tools are accessible and at what level
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={handleAutoConfigureTools}
                  disabled={autoConfiguring}
                >
                  {autoConfiguring ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Configuring...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-Configure
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ToolAccessConfig
                segment={formData.segment}
                includedPhases={phases.filter((p) => p.isIncluded).map((p) => p.phaseNumber)}
                toolAccess={toolAccess}
                onToolAccessChange={setToolAccess}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
