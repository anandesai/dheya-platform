"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface QuickGenerateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career", description: "0-3 years experience" },
  { value: "MID_CAREER", label: "Mid Career", description: "4-10 years experience" },
  { value: "SENIOR", label: "Senior", description: "10+ years experience" },
  { value: "RETURNING_WOMEN", label: "Returning Women", description: "Career re-entry" },
]

const TIERS = [
  {
    tier: "GUIDANCE",
    name: "Guidance",
    phases: [1, 2],
    sessions: 2,
    basePrice: 4999,
    color: "bg-blue-100 text-blue-800",
    description: "Self-paced assessments with basic career clarity tools",
  },
  {
    tier: "PLANNING",
    name: "Planning",
    phases: [1, 2, 3, 4, 5],
    sessions: 5,
    basePrice: 14999,
    color: "bg-purple-100 text-purple-800",
    description: "Complete assessment suite with personalized career roadmap",
  },
  {
    tier: "MENTORSHIP",
    name: "Mentorship",
    phases: [1, 2, 3, 4, 5, 6, 7],
    sessions: 10,
    basePrice: 29999,
    color: "bg-amber-100 text-amber-800",
    description: "Full journey with dedicated mentor support and ongoing guidance",
  },
]

export function QuickGenerateDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuickGenerateDialogProps) {
  const [segment, setSegment] = useState<string>("")
  const [productName, setProductName] = useState("")
  const [enableTeaserMode, setEnableTeaserMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!segment || !productName) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    setCreated([])

    try {
      const response = await fetch("/api/admin/packages/quick-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segment,
          productName,
          enableTeaserMode,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate packages")
      }

      const packages = await response.json()
      setCreated(packages.map((p: { tier: string }) => p.tier))
      toast.success(`Successfully created ${packages.length} packages`)

      // Wait a moment then close
      setTimeout(() => {
        onOpenChange(false)
        onSuccess()
        // Reset form
        setSegment("")
        setProductName("")
        setCreated([])
      }, 1500)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate packages")
    } finally {
      setLoading(false)
    }
  }

  const getSelectedSegmentLabel = () => {
    return SEGMENTS.find((s) => s.value === segment)?.label || "Select segment"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Generate Packages
          </DialogTitle>
          <DialogDescription>
            Generate all three package tiers (Guidance, Planning, Mentorship) for a
            segment with one click. Each package will be pre-configured with the
            appropriate phases and tool access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Segment Selection */}
          <div className="space-y-2">
            <Label htmlFor="segment">Target Segment *</Label>
            <Select value={segment} onValueChange={setSegment}>
              <SelectTrigger id="segment">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                {SEGMENTS.map((seg) => (
                  <SelectItem key={seg.value} value={seg.value}>
                    <div className="flex flex-col">
                      <span>{seg.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {seg.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              placeholder="e.g., Career Clarity, Career Transition"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This will be used to generate package names like &quot;{productName || "Career Clarity"}{" "}
              Guidance&quot;
            </p>
          </div>

          {/* Teaser Mode Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="teaserMode"
              checked={enableTeaserMode}
              onCheckedChange={(checked) => setEnableTeaserMode(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="teaserMode" className="cursor-pointer">
                Enable teaser mode for locked tools
              </Label>
              <p className="text-xs text-muted-foreground">
                Users can preview 3 questions from locked assessments before upgrading
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <Label>Packages to be created:</Label>
            <div className="grid gap-3">
              {TIERS.map((tier) => (
                <Card
                  key={tier.tier}
                  className={created.includes(tier.tier) ? "border-green-500" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {created.includes(tier.tier) ? (
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500">
                              {tier.name[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {productName || "Product"} {tier.name}
                            </p>
                            <Badge className={tier.color}>{tier.name}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tier.description}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Phases: {tier.phases.join(", ")}</span>
                            <span>{tier.sessions} sessions</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(tier.basePrice)}
                        </p>
                        {segment && (
                          <p className="text-xs text-muted-foreground">
                            {getSelectedSegmentLabel()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !segment || !productName}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate All Packages
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
