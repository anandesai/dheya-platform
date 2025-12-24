"use client"

// Invoice List Component for User Dashboard
import { InvoiceSummary } from "@/lib/services/invoice.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface InvoiceListProps {
  invoices: InvoiceSummary[]
  emptyMessage?: string
}

export function InvoiceList({ invoices, emptyMessage }: InvoiceListProps) {
  const formatCurrency = (amountInPaise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amountInPaise / 100)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PAID: "default",
      SENT: "secondary",
      OVERDUE: "destructive",
      DRAFT: "outline",
      CANCELLED: "outline"
    }

    return (
      <Badge variant={variants[status] || "outline"}>
        {status}
      </Badge>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Invoices Yet</h3>
          <p className="text-muted-foreground">
            {emptyMessage || "Your invoices will appear here after you make a purchase."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">
                      {invoice.packageName}
                    </h4>
                    {getStatusBadge(invoice.status)}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    Invoice #{invoice.invoiceNumber}
                  </p>

                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      Issued: {format(new Date(invoice.issuedAt), 'dd MMM yyyy')}
                    </span>
                    {invoice.paidAt && (
                      <span>
                        Paid: {format(new Date(invoice.paidAt), 'dd MMM yyyy')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {formatCurrency(invoice.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/billing/invoice/${invoice.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.open(`/api/invoices/${invoice.id}/pdf`, '_blank')
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton for invoice list
export function InvoiceListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-full bg-muted h-10 w-10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Example usage page component
export function InvoiceListPageExample() {
  // In a real implementation, fetch this from your API
  const sampleInvoices: InvoiceSummary[] = [
    {
      id: "invoice_1",
      invoiceNumber: "INV-2024-00003",
      packageName: "Destination Mastery - Mentorship",
      totalAmount: 5899500, // ₹58,995
      status: "PAID",
      issuedAt: new Date("2024-12-01"),
      paidAt: new Date("2024-12-01")
    },
    {
      id: "invoice_2",
      invoiceNumber: "INV-2024-00002",
      packageName: "Destination Mastery - Planning",
      totalAmount: 2999500, // ₹29,995
      status: "PAID",
      issuedAt: new Date("2024-11-15"),
      paidAt: new Date("2024-11-15")
    }
  ]

  return <InvoiceList invoices={sampleInvoices} />
}
