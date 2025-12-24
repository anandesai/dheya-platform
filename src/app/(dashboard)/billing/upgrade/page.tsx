import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getUserSubscription,
  getUpgradeOptions,
} from "@/lib/services/subscription.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Target,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Upgrade Subscription | Dheya Career Mentors",
  description: "Upgrade your subscription to unlock more features",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getTierColor(tier: string): string {
  switch (tier) {
    case "GUIDANCE":
      return "bg-purple-100 text-purple-700 border-purple-200"
    case "PLANNING":
      return "bg-forest-100 text-forest-700 border-forest-200"
    case "MENTORSHIP":
      return "bg-gold-100 text-gold-700 border-gold-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

function getTierDescription(tier: string): string {
  switch (tier) {
    case "GUIDANCE":
      return "Foundation for career clarity"
    case "PLANNING":
      return "Comprehensive career planning"
    case "MENTORSHIP":
      return "Professional mentorship & execution"
    default:
      return ""
  }
}

export default async function UpgradePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const currentSubscription = await getUserSubscription(session.user.id)
  const upgradeOptions = await getUpgradeOptions(session.user.id)

  if (!currentSubscription) {
    redirect("/billing")
  }

  if (!currentSubscription.canUpgrade) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center py-16">
          <Award className="h-16 w-16 text-gold-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-forest-800 mb-2">
            You&apos;re on the Best Plan!
          </h2>
          <p className="text-muted-foreground mb-6">
            You&apos;re already enjoying our premium {currentSubscription.tier} tier.
          </p>
          <Button asChild variant="outline">
            <Link href="/billing">
              Back to Billing
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Page Header */}
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/billing">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Billing
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-forest-800 mb-2">
          Upgrade Your Subscription
        </h1>
        <p className="text-muted-foreground">
          Unlock additional phases, tools, and mentorship sessions
        </p>
      </div>

      {/* Current vs Upgrade Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan */}
        <Card variant="light">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <Badge variant="outline" className="text-muted-foreground">
                Current Plan
              </Badge>
              <Badge className={getTierColor(currentSubscription.tier)}>
                {currentSubscription.tier}
              </Badge>
            </div>
            <CardTitle className="text-xl">
              {currentSubscription.packageName}
            </CardTitle>
            <CardDescription>
              {getTierDescription(currentSubscription.tier)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground">Your Investment:</span>
              <span className="text-sm font-medium">Paid</span>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{currentSubscription.totalSessions} mentoring sessions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span>Access to {currentSubscription.currentPhase} phases</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {currentSubscription.tier === "GUIDANCE" ? "L1" :
                   currentSubscription.tier === "PLANNING" ? "L2" : "L3"} Certified Mentor
                </span>
              </div>
            </div>

            <Separator />

            <div className="bg-cream-100 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-forest-800">Your Progress</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Sessions Used: {currentSubscription.sessionsUsed} / {currentSubscription.totalSessions}</p>
                <p>Current Phase: {currentSubscription.currentPhase}</p>
                <p>Days Remaining: {currentSubscription.daysRemaining || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        {upgradeOptions.map((option) => {
          const priceDifference = option.priceINR - (option.priceINR * option.discountPercent / 100)
          const featuresCount = (option.features as string[])?.length || 0

          return (
            <Card
              key={option.id}
              variant="light"
              hover="glow"
              className="border-2 border-purple-200 relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-gold-500" />
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-purple-600 text-white">
                    Recommended Upgrade
                  </Badge>
                  <Badge className={getTierColor(option.tier)}>
                    {option.tier}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{option.fullName}</CardTitle>
                <CardDescription>
                  {getTierDescription(option.tier)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-forest-800">
                      {formatCurrency(priceDifference)}
                    </span>
                    {option.discountPercent > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(option.priceINR)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For {option.durationValue} {option.durationType}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">
                      {option.totalSessions} mentoring sessions
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">
                      {option.packagePhases.length} phases included
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">
                      {option.mentorLevel} Expert Mentor
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-forest-800">
                    What&apos;s Included:
                  </p>
                  <div className="space-y-1.5">
                    {(option.features as string[] || []).slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {featuresCount > 4 && (
                      <p className="text-xs text-muted-foreground pl-6">
                        + {featuresCount - 4} more features
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                >
                  <Link href={`/checkout?upgrade=${option.id}`}>
                    Upgrade Now
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Prorated credit will be applied from your current plan
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Benefits of Upgrading */}
      <Card variant="sage">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-forest-700" />
            Why Upgrade?
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-forest-800 mb-2">More Phases</h4>
            <p className="text-sm text-muted-foreground">
              Access advanced phases with deeper tools and frameworks for comprehensive career transformation
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-forest-800 mb-2">Expert Mentors</h4>
            <p className="text-sm text-muted-foreground">
              Work with higher-level mentors who bring extensive experience and specialized expertise
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-forest-800 mb-2">Extended Support</h4>
            <p className="text-sm text-muted-foreground">
              More sessions mean sustained guidance throughout your entire career journey
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prorated Pricing Notice */}
      <Card variant="light" className="border-purple-200">
        <CardContent className="py-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-forest-800 mb-1">
                Prorated Pricing Information
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                When you upgrade, we&apos;ll credit the remaining value from your current
                subscription toward your new plan. You&apos;ll only pay the difference.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Your unused sessions carry over to the upgraded plan</li>
                <li>Current phase progress is maintained</li>
                <li>
                  Billing period extends by {currentSubscription.daysRemaining || 0} days
                  plus new subscription duration
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support CTA */}
      <div className="text-center py-8 bg-cream-100 rounded-xl">
        <h3 className="text-lg font-semibold text-forest-800 mb-2">
          Have Questions About Upgrading?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our team is here to help you choose the right plan for your career goals
        </p>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
