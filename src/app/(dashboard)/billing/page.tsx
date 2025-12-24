import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getUserSubscription,
  getUsageStats,
  getBillingHistory,
} from "@/lib/services/subscription.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CreditCard,
  Download,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Package,
  Activity,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Billing & Subscription | Dheya Career Mentors",
  description: "Manage your subscription and billing details",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
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

function getStatusIcon(status: string) {
  switch (status) {
    case "paid":
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "failed":
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const subscription = await getUserSubscription(session.user.id)
  const usageStats = await getUsageStats(session.user.id)
  const billingHistory = await getBillingHistory(session.user.id)

  if (!subscription) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-forest-800 mb-2">
            No Active Subscription
          </h2>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have an active subscription. Browse our programs to get started.
          </p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/programs">
              Explore Programs
              <ArrowUpRight className="ml-2 h-5 w-5" />
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
        <h1 className="text-3xl font-bold text-forest-800 mb-2">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription, view usage, and access billing history
        </p>
      </div>

      {/* Current Plan Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan Details Card */}
        <Card variant="light" hover="lift">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl mb-1">Current Plan</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              <Badge className={getTierColor(subscription.tier)}>
                {subscription.tier}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-forest-800 mb-1">
                {subscription.packageName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {subscription.segment.replace("_", " ")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sessions Used</span>
                <span className="font-medium">
                  {subscription.sessionsUsed} / {subscription.totalSessions}
                </span>
              </div>
              <Progress
                value={(subscription.sessionsUsed / subscription.totalSessions) * 100}
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Phase</p>
                <p className="text-lg font-semibold text-forest-800">
                  Phase {subscription.currentPhase}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Expires In</p>
                <p className="text-lg font-semibold text-forest-800">
                  {subscription.daysRemaining !== null
                    ? `${subscription.daysRemaining} days`
                    : "Never"}
                </p>
              </div>
            </div>

            {subscription.expiresAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Calendar className="h-4 w-4" />
                <span>Renews on {formatDate(subscription.expiresAt)}</span>
              </div>
            )}

            {subscription.canUpgrade && (
              <Button
                asChild
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              >
                <Link href="/billing/upgrade">
                  Upgrade to {subscription.nextTier}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Usage Stats Card */}
        <Card variant="light" hover="lift">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl mb-1">Usage & Progress</CardTitle>
                <CardDescription>Track your journey progress</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{usageStats.overallProgress}%</span>
              </div>
              <Progress value={usageStats.overallProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Tools Completed
                  </p>
                  <p className="text-2xl font-bold text-forest-800">
                    {usageStats.toolsCompleted}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {usageStats.totalToolsAccessible} available
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Tools In Progress
                  </p>
                  <p className="text-lg font-semibold text-purple-600">
                    {usageStats.toolsInProgress}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Phases Completed
                  </p>
                  <p className="text-2xl font-bold text-forest-800">
                    {usageStats.phasesCompleted}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {usageStats.totalPhases} total
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">On Track</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Section - Placeholder */}
      <Card variant="light">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-1">Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Payment gateway integration coming soon
            </p>
            <Button variant="outline" disabled>
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card variant="light">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-1">Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {billingHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No billing history available
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {transaction.packageName}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          <span className="capitalize text-sm">
                            {transaction.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.invoiceUrl ? (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <Link href={transaction.invoiceUrl} target="_blank">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not available
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card variant="sage">
        <CardContent className="py-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-forest-800 mb-1">
                Need Help with Billing?
              </h3>
              <p className="text-sm text-muted-foreground">
                Our support team is here to assist you with any billing questions
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
