"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, Loader2, Percent, IndianRupee, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface PackageData {
  id: string
  code: string
  tier: "GUIDANCE" | "PLANNING" | "MENTORSHIP"
  segment: "EARLY_CAREER" | "MID_CAREER" | "SENIOR" | "RETURNING_WOMEN"
  productName: string
  packageName: string
  fullName: string
  price: number
  priceINR?: number
  discountPercent?: number
  isPublished: boolean
}

interface BulkPricingManagerProps {
  packages: PackageData[]
  onUpdate: () => void
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

export function BulkPricingManager({ packages, onUpdate }: BulkPricingManagerProps) {
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({})
  const [editedDiscounts, setEditedDiscounts] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [adjustType, setAdjustType] = useState<"percentage" | "fixed">("percentage")
  const [adjustValue, setAdjustValue] = useState<number>(0)
  const [adjustScope, setAdjustScope] = useState<string>("all")

  // Initialize edited prices from packages
  useEffect(() => {
    const prices: Record<string, number> = {}
    const discounts: Record<string, number> = {}
    packages.forEach((pkg) => {
      prices[pkg.id] = pkg.price || pkg.priceINR || 0
      discounts[pkg.id] = pkg.discountPercent || 0
    })
    setEditedPrices(prices)
    setEditedDiscounts(discounts)
  }, [packages])

  // Check for changes
  const hasChanges = () => {
    return packages.some((pkg) => {
      const originalPrice = pkg.price || pkg.priceINR || 0
      const originalDiscount = pkg.discountPercent || 0
      return (
        editedPrices[pkg.id] !== originalPrice ||
        editedDiscounts[pkg.id] !== originalDiscount
      )
    })
  }

  // Get tier badge
  const getTierBadge = (tier: string) => {
    const tierConfig = TIERS.find((t) => t.value === tier)
    return tierConfig ? (
      <Badge className={tierConfig.color}>{tierConfig.label}</Badge>
    ) : null
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate effective price after discount
  const getEffectivePrice = (id: string) => {
    const price = editedPrices[id] || 0
    const discount = editedDiscounts[id] || 0
    return price - (price * discount) / 100
  }

  // Handle bulk adjustment
  const handleBulkAdjust = () => {
    const newPrices = { ...editedPrices }

    packages.forEach((pkg) => {
      // Check scope
      if (adjustScope !== "all") {
        const [type, value] = adjustScope.split(":")
        if (type === "segment" && pkg.segment !== value) return
        if (type === "tier" && pkg.tier !== value) return
      }

      const currentPrice = newPrices[pkg.id] || 0

      if (adjustType === "percentage") {
        const change = (currentPrice * adjustValue) / 100
        newPrices[pkg.id] = Math.round(currentPrice + change)
      } else {
        newPrices[pkg.id] = Math.round(currentPrice + adjustValue)
      }

      // Ensure price doesn't go below 0
      if (newPrices[pkg.id] < 0) newPrices[pkg.id] = 0
    })

    setEditedPrices(newPrices)
    setAdjustDialogOpen(false)
    toast.success("Prices adjusted (not saved yet)")
  }

  // Save all changes
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const updates = packages
        .filter((pkg) => {
          const originalPrice = pkg.price || pkg.priceINR || 0
          const originalDiscount = pkg.discountPercent || 0
          return (
            editedPrices[pkg.id] !== originalPrice ||
            editedDiscounts[pkg.id] !== originalDiscount
          )
        })
        .map((pkg) => ({
          id: pkg.id,
          priceINR: editedPrices[pkg.id],
          discountPercent: editedDiscounts[pkg.id],
        }))

      if (updates.length === 0) {
        toast.info("No changes to save")
        return
      }

      // Update each package
      const results = await Promise.all(
        updates.map((update) =>
          fetch(`/api/admin/packages/${update.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              priceINR: update.priceINR,
              discountPercent: update.discountPercent,
            }),
          })
        )
      )

      const failed = results.filter((r) => !r.ok).length
      if (failed > 0) {
        toast.error(`${failed} package(s) failed to update`)
      } else {
        toast.success(`${updates.length} package(s) updated successfully`)
        onUpdate()
      }
    } catch {
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  // Group packages by segment for better organization
  const groupedPackages = SEGMENTS.map((segment) => ({
    ...segment,
    packages: packages
      .filter((p) => p.segment === segment.value)
      .sort((a, b) => {
        const tierOrder = ["GUIDANCE", "PLANNING", "MENTORSHIP"]
        return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
      }),
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bulk Pricing Management</CardTitle>
            <CardDescription>
              Update prices and discounts across all packages
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setAdjustDialogOpen(true)}>
              <Percent className="h-4 w-4 mr-2" />
              Bulk Adjust
            </Button>
            <Button onClick={handleSaveAll} disabled={saving || !hasChanges()}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasChanges() && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              You have unsaved changes. Click &quot;Save All Changes&quot; to apply.
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Package</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Base Price (₹)</TableHead>
                <TableHead className="text-right w-[100px]">Discount %</TableHead>
                <TableHead className="text-right">Effective Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedPackages.map((group) => (
                <>
                  {group.packages.length > 0 && (
                    <TableRow key={group.value} className="bg-muted/50">
                      <TableCell colSpan={6} className="font-semibold">
                        {group.label}
                      </TableCell>
                    </TableRow>
                  )}
                  {group.packages.map((pkg) => {
                    const originalPrice = pkg.price || pkg.priceINR || 0
                    const originalDiscount = pkg.discountPercent || 0
                    const priceChanged = editedPrices[pkg.id] !== originalPrice
                    const discountChanged = editedDiscounts[pkg.id] !== originalDiscount

                    return (
                      <TableRow key={pkg.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{pkg.packageName}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {pkg.code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getTierBadge(pkg.tier)}</TableCell>
                        <TableCell>
                          {pkg.isPublished ? (
                            <Badge className="bg-green-100 text-green-800">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                            <Input
                              type="number"
                              className={`w-[120px] text-right ${
                                priceChanged ? "border-amber-500 bg-amber-50" : ""
                              }`}
                              value={editedPrices[pkg.id] || 0}
                              onChange={(e) =>
                                setEditedPrices({
                                  ...editedPrices,
                                  [pkg.id]: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            className={`w-[80px] text-right ${
                              discountChanged ? "border-amber-500 bg-amber-50" : ""
                            }`}
                            min={0}
                            max={100}
                            value={editedDiscounts[pkg.id] || 0}
                            onChange={(e) =>
                              setEditedDiscounts({
                                ...editedDiscounts,
                                [pkg.id]: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(getEffectivePrice(pkg.id))}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Bulk Adjust Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Price Adjustment</DialogTitle>
            <DialogDescription>
              Apply a price change to multiple packages at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Apply to</Label>
              <Select value={adjustScope} onValueChange={setAdjustScope}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  <SelectItem value="segment:EARLY_CAREER">
                    Early Career Only
                  </SelectItem>
                  <SelectItem value="segment:MID_CAREER">Mid Career Only</SelectItem>
                  <SelectItem value="segment:SENIOR">Senior Only</SelectItem>
                  <SelectItem value="segment:RETURNING_WOMEN">
                    Returning Women Only
                  </SelectItem>
                  <SelectItem value="tier:GUIDANCE">Guidance Tier Only</SelectItem>
                  <SelectItem value="tier:PLANNING">Planning Tier Only</SelectItem>
                  <SelectItem value="tier:MENTORSHIP">
                    Mentorship Tier Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select
                value={adjustType}
                onValueChange={(v) => setAdjustType(v as "percentage" | "fixed")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Change</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                {adjustType === "percentage" ? "Percentage" : "Amount"} (use negative
                to decrease)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={adjustValue}
                  onChange={(e) => setAdjustValue(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
                <span className="text-muted-foreground">
                  {adjustType === "percentage" ? "%" : "₹"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAdjust}>Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
