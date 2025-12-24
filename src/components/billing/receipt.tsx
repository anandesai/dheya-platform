"use client"

// Compact Receipt Component for Payment Confirmations
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Download, Receipt as ReceiptIcon } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export interface ReceiptData {
  invoiceId?: string
  invoiceNumber?: string
  paymentId: string
  orderId: string
  packageName: string
  amount: number // Amount in paise
  status: string
  paidAt: Date
  method?: string
  customerName: string
  customerEmail: string
}

interface ReceiptProps {
  data: ReceiptData
  showActions?: boolean
  compact?: boolean
}

export function Receipt({ data, showActions = true, compact = false }: ReceiptProps) {
  const formatCurrency = (amountInPaise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amountInPaise / 100)
  }

  if (compact) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Payment Successful</h3>
              <p className="text-sm text-green-700 mt-1">
                Your payment of {formatCurrency(data.amount)} has been received
              </p>
              <div className="mt-3 space-y-1 text-xs text-green-600">
                <p>Transaction ID: {data.paymentId}</p>
                {data.invoiceNumber && <p>Invoice: {data.invoiceNumber}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center space-y-4 pb-4">
        <div className="mx-auto rounded-full bg-green-100 p-4 w-fit">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <CardTitle className="text-2xl text-green-900">Payment Successful!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount */}
        <div className="text-center py-4 bg-primary/5 rounded-lg">
          <p className="text-sm text-muted-foreground">Amount Paid</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {formatCurrency(data.amount)}
          </p>
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Package</span>
            <span className="font-medium text-right">{data.packageName}</span>
          </div>

          {data.invoiceNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Invoice Number</span>
              <span className="font-mono font-medium">{data.invoiceNumber}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs">{data.paymentId}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{data.orderId}</span>
          </div>

          {data.method && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">{data.method}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date & Time</span>
            <span className="font-medium">
              {format(new Date(data.paidAt), 'dd MMM yyyy, hh:mm a')}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              {data.status}
            </span>
          </div>
        </div>

        <Separator />

        {/* Customer Details */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Billing Details</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{data.customerName}</p>
            <p>{data.customerEmail}</p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <>
            <Separator />
            <div className="space-y-2">
              {data.invoiceId && (
                <Button asChild className="w-full" variant="default">
                  <Link href={`/billing/invoice/${data.invoiceId}`}>
                    <ReceiptIcon className="h-4 w-4 mr-2" />
                    View Full Invoice
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </>
        )}

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>A copy of this receipt has been sent to {data.customerEmail}</p>
          <p className="mt-2">
            For support, contact us at support@dheyacareers.com
          </p>
        </div>
      </CardContent>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </Card>
  )
}

// Example Usage Component
export function ReceiptExample() {
  const sampleData: ReceiptData = {
    invoiceId: "clxxxx",
    invoiceNumber: "INV-2024-00001",
    paymentId: "pay_abc123",
    orderId: "order_xyz789",
    packageName: "Destination Mastery - Planning",
    amount: 2999500, // ₹29,995.00 in paise
    status: "Completed",
    paidAt: new Date(),
    method: "UPI",
    customerName: "John Doe",
    customerEmail: "john@example.com"
  }

  return <Receipt data={sampleData} />
}
