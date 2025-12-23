"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Check, X, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PackagePhase {
  phaseNumber: number
  phaseName: string
  isIncluded: boolean
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
  priceINR?: number
  totalSessions: number
  mentorLevel?: string
  durationValue?: number
  durationType?: string
  sessionFrequency?: string
  packagePhases?: PackagePhase[]
  _count?: {
    userPackages: number
    packagePhases: number
    packageToolAccess: number
  }
}

interface PackageComparisonProps {
  packages: PackageData[]
  segment?: string
}

const SEGMENTS = [
  { value: "EARLY_CAREER", label: "Early Career", product: "Develop Advantage" },
  { value: "MID_CAREER", label: "Mid Career", product: "Destination Mastery" },
  { value: "SENIOR", label: "Senior", product: "Design Legacy" },
  { value: "RETURNING_WOMEN", label: "Returning Women", product: "Career Restart" },
]

const TIERS = [
  { value: "GUIDANCE", label: "Guidance", color: "bg-blue-100 text-blue-800" },
  { value: "PLANNING", label: "Planning", color: "bg-purple-100 text-purple-800" },
  { value: "MENTORSHIP", label: "Mentorship", color: "bg-amber-100 text-amber-800" },
]

const TIER_ORDER = ["GUIDANCE", "PLANNING", "MENTORSHIP"]

export function PackageComparison({ packages, segment: initialSegment }: PackageComparisonProps) {
  const [selectedSegment, setSelectedSegment] = useState(initialSegment || "MID_CAREER")

  // Filter packages by selected segment
  const segmentPackages = packages
    .filter((p) => p.segment === selectedSegment)
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))

  // Get segment info
  const segmentInfo = SEGMENTS.find((s) => s.value === selectedSegment)

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

  // Get all unique phases across packages
  const getAllPhases = () => {
    const phases = new Map<number, string>()
    segmentPackages.forEach((pkg) => {
      pkg.packagePhases?.forEach((phase) => {
        if (!phases.has(phase.phaseNumber)) {
          phases.set(phase.phaseNumber, phase.phaseName)
        }
      })
    })
    return Array.from(phases.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([num, name]) => ({ phaseNumber: num, phaseName: name }))
  }

  const allPhases = getAllPhases()

  // Check if phase is included in package
  const isPhaseIncluded = (pkg: PackageData, phaseNumber: number) => {
    return pkg.packagePhases?.some((p) => p.phaseNumber === phaseNumber && p.isIncluded)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Package Comparison</CardTitle>
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-[200px]">
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
        {segmentInfo && (
          <p className="text-sm text-muted-foreground">
            {segmentInfo.product} - Compare tiers for {segmentInfo.label} professionals
          </p>
        )}
      </CardHeader>
      <CardContent>
        {segmentPackages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No packages found for this segment
            </p>
            <Link href="/admin/packages?action=quick-generate">
              <Button>Quick Generate Packages</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {segmentPackages.map((pkg) => (
                    <TableHead key={pkg.id} className="text-center min-w-[180px]">
                      <div className="flex flex-col items-center gap-2">
                        {getTierBadge(pkg.tier)}
                        <span className="text-lg font-bold">
                          {formatPrice(pkg.price || pkg.priceINR || 0)}
                        </span>
                        {pkg.isPublished ? (
                          <Badge className="bg-green-100 text-green-800" variant="outline">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Basic Info */}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={segmentPackages.length + 1} className="font-semibold">
                    Session Details
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Sessions</TableCell>
                  {segmentPackages.map((pkg) => (
                    <TableCell key={pkg.id} className="text-center font-medium">
                      {pkg.totalSessions}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Session Frequency</TableCell>
                  {segmentPackages.map((pkg) => (
                    <TableCell key={pkg.id} className="text-center">
                      {pkg.sessionFrequency || "—"}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Duration</TableCell>
                  {segmentPackages.map((pkg) => (
                    <TableCell key={pkg.id} className="text-center">
                      {pkg.durationValue && pkg.durationType
                        ? `${pkg.durationValue} ${pkg.durationType}`
                        : "—"}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Mentor Level</TableCell>
                  {segmentPackages.map((pkg) => (
                    <TableCell key={pkg.id} className="text-center">
                      <Badge variant="outline">{pkg.mentorLevel || "L1"}</Badge>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Phases */}
                {allPhases.length > 0 && (
                  <>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={segmentPackages.length + 1} className="font-semibold">
                        Included Phases
                      </TableCell>
                    </TableRow>
                    {allPhases.map((phase) => (
                      <TableRow key={phase.phaseNumber}>
                        <TableCell>
                          Phase {phase.phaseNumber}: {phase.phaseName}
                        </TableCell>
                        {segmentPackages.map((pkg) => (
                          <TableCell key={pkg.id} className="text-center">
                            {isPhaseIncluded(pkg, phase.phaseNumber) ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                )}

                {/* Stats */}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={segmentPackages.length + 1} className="font-semibold">
                    Usage Stats
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Active Users</TableCell>
                  {segmentPackages.map((pkg) => (
                    <TableCell key={pkg.id} className="text-center font-medium">
                      {pkg._count?.userPackages || 0}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Tools Configured</TableCell>
                  {segmentPackages.map((pkg) => (
                    <TableCell key={pkg.id} className="text-center">
                      {pkg._count?.packageToolAccess || 0}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Actions */}
                <TableRow>
                  <TableCell></TableCell>
                  {segmentPackages.map((pkg) => (
                    <TableCell key={pkg.id} className="text-center">
                      <Link href={`/admin/packages/${pkg.id}`}>
                        <Button variant="outline" size="sm">
                          Edit Package
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
