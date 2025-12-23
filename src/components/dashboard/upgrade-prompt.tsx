"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Sparkles, Zap, Crown } from "lucide-react"
import { PackageTier } from "@prisma/client"
import { cn } from "@/lib/utils"

// ==========================================
// TYPES
// ==========================================

interface Package {
  tier: PackageTier
  name: string
  price: number
  originalPrice?: number
  duration: string
  sessions: number
  phases: number[]
  features: string[]
  popular?: boolean
}

interface UpgradePromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTier?: PackageTier
  recommendedTier?: PackageTier
  onSelectPackage?: (tier: PackageTier) => void
  packages?: Package[]
}

// ==========================================
// DEFAULT PACKAGES
// ==========================================

const DEFAULT_PACKAGES: Package[] = [
  {
    tier: PackageTier.GUIDANCE,
    name: "Guidance",
    price: 16999,
    duration: "4-6 weeks",
    sessions: 2,
    phases: [1, 2],
    features: [
      "Complete Phase 1-2 tools",
      "2 mentor sessions",
      "Basic career assessment",
      "Email support"
    ]
  },
  {
    tier: PackageTier.PLANNING,
    name: "Planning",
    price: 32999,
    duration: "1-2 years",
    sessions: 6,
    phases: [1, 2, 3, 4, 5],
    features: [
      "Complete Phase 1-5 tools",
      "4-6 mentor sessions",
      "Life review & planning",
      "Transition roadmap",
      "Priority support"
    ],
    popular: true
  },
  {
    tier: PackageTier.MENTORSHIP,
    name: "Mentorship",
    price: 79999,
    duration: "5-7 years",
    sessions: 18,
    phases: [1, 2, 3, 4, 5, 6],
    features: [
      "Complete Phase 1-6 tools",
      "15-18 mentor sessions",
      "Executive coaching",
      "Crisis support",
      "Quarterly reviews",
      "VIP support"
    ]
  }
]

// ==========================================
// COMPONENT
// ==========================================

export function UpgradePrompt({
  open,
  onOpenChange,
  currentTier = PackageTier.GUIDANCE,
  recommendedTier,
  onSelectPackage,
  packages = DEFAULT_PACKAGES
}: UpgradePromptProps) {
  const [selectedTier, setSelectedTier] = useState<PackageTier | null>(recommendedTier || null)

  const getTierIcon = (tier: PackageTier) => {
    switch (tier) {
      case PackageTier.GUIDANCE:
        return <Sparkles className="w-5 h-5" />
      case PackageTier.PLANNING:
        return <Zap className="w-5 h-5" />
      case PackageTier.MENTORSHIP:
        return <Crown className="w-5 h-5" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const isCurrentPackage = (tier: PackageTier) => tier === currentTier
  const isUpgrade = (tier: PackageTier) => {
    const tierOrder = { GUIDANCE: 0, PLANNING: 1, MENTORSHIP: 2 }
    return tierOrder[tier] > tierOrder[currentTier]
  }

  const handleSelectPackage = () => {
    if (selectedTier) {
      onSelectPackage?.(selectedTier)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Upgrade Your Journey</DialogTitle>
          <DialogDescription>
            Unlock more tools and get extended mentor support to accelerate your career transformation
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {packages.map((pkg) => {
            const isCurrent = isCurrentPackage(pkg.tier)
            const canUpgrade = isUpgrade(pkg.tier)
            const isSelected = selectedTier === pkg.tier

            return (
              <Card
                key={pkg.tier}
                variant="light"
                className={cn(
                  "relative cursor-pointer transition-all duration-200",
                  isSelected && "ring-2 ring-primary",
                  pkg.popular && "border-primary",
                  isCurrent && "opacity-60 cursor-not-allowed",
                  canUpgrade && "hover:shadow-lg"
                )}
                onClick={() => canUpgrade && setSelectedTier(pkg.tier)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="outline">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2 pt-6">
                  <div className="mx-auto mb-2 p-2 bg-muted rounded-full w-fit">
                    {getTierIcon(pkg.tier)}
                  </div>
                  <CardTitle className="font-display">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.duration}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold">{formatPrice(pkg.price)}</span>
                    {pkg.originalPrice && (
                      <span className="text-sm text-charcoal-600 font-body line-through ml-2">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-center gap-4 text-sm text-charcoal-600 font-body">
                    <span>{pkg.sessions} sessions</span>
                    <span>Phases 1-{Math.max(...pkg.phases)}</span>
                  </div>

                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isSelected ? "default" : "outline"}
                    disabled={isCurrent || !canUpgrade}
                  >
                    {isCurrent ? "Current Plan" : canUpgrade ? "Select" : "N/A"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedTier && (
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelectPackage}>
              Upgrade to {packages.find(p => p.tier === selectedTier)?.name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// INLINE UPGRADE BANNER
// ==========================================

interface UpgradeBannerProps {
  currentTier?: PackageTier
  message?: string
  onUpgrade?: () => void
  className?: string
}

export function UpgradeBanner({
  currentTier = PackageTier.GUIDANCE,
  message,
  onUpgrade,
  className
}: UpgradeBannerProps) {
  const nextTier = currentTier === PackageTier.GUIDANCE
    ? PackageTier.PLANNING
    : PackageTier.MENTORSHIP

  const defaultMessage = currentTier === PackageTier.GUIDANCE
    ? "Unlock Phase 3-5 tools and get extended mentorship"
    : "Get full implementation support and crisis management"

  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 flex items-center justify-between",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium font-display">Ready for more?</p>
          <p className="text-sm text-charcoal-600 font-body">{message || defaultMessage}</p>
        </div>
      </div>
      <Button onClick={onUpgrade}>
        Upgrade to {nextTier === PackageTier.PLANNING ? "Planning" : "Mentorship"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
