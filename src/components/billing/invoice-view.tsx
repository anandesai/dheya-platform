"use client"

// Professional Invoice View Component
import { InvoiceWithDetails } from "@/lib/services/invoice.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

interface InvoiceViewProps {
  invoice: InvoiceWithDetails
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/pdf`)
      const data = await response.json()

      if (data.placeholder) {
        alert("PDF generation is not yet implemented. This is a placeholder.")
      } else {
        // In production, this would trigger an actual PDF download
        window.open(data.downloadUrl, '_blank')
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Failed to download invoice")
    }
  }

  const formatCurrency = (amountInPaise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amountInPaise / 100)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons - Hidden in print */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="space-y-6 pb-8">
          {/* Company Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-primary">Dheya Career Mentors</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Professional Career Guidance & Mentorship
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Bangalore, Karnataka, India</p>
                <p>Email: support@dheyacareers.com</p>
                <p>Phone: +91 XXX XXX XXXX</p>
                <p>GSTIN: XXXXXXXXXXXX</p>
              </div>
            </div>

            {/* Invoice Status */}
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold">{invoice.status}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Details */}
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">INVOICE TO</h3>
              <div className="space-y-1">
                <p className="font-semibold text-lg">{invoice.customerName}</p>
                <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
                {invoice.customerPhone && (
                  <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
                )}
                {invoice.customerAddress && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {invoice.customerAddress}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">INVOICE NUMBER</h3>
                <p className="font-mono text-lg font-semibold">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">ISSUE DATE</h3>
                <p className="text-sm">{format(new Date(invoice.issuedAt), 'dd MMM yyyy')}</p>
              </div>
              {invoice.paidAt && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">PAID DATE</h3>
                  <p className="text-sm">{format(new Date(invoice.paidAt), 'dd MMM yyyy')}</p>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Line Items */}
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold text-sm">DESCRIPTION</th>
                  <th className="text-right py-3 font-semibold text-sm">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">
                    <div>
                      <p className="font-semibold">{invoice.package.fullName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {invoice.package.productName} - {invoice.package.packageName} Package
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Payment ID: {invoice.payment.paymentId || invoice.payment.orderId}
                      </p>
                      {invoice.payment.method && (
                        <p className="text-xs text-muted-foreground">
                          Payment Method: {invoice.payment.method}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="text-right py-4 font-semibold">
                    {formatCurrency(invoice.subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount Breakdown */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({invoice.package.discountPercent}%)</span>
                <span className="font-medium">-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST ({invoice.taxRate}%)</span>
              <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg pt-2">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-primary">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Payment Received</span>
            </div>
            <p className="text-sm text-green-600">
              This invoice has been paid in full on {invoice.paidAt && format(new Date(invoice.paidAt), 'dd MMM yyyy, hh:mm a')}
            </p>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="font-semibold text-sm mb-2">NOTES</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <Separator />
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Thank you for choosing Dheya Career Mentors</p>
            <p className="mt-2">
              For any queries regarding this invoice, please contact us at support@dheyacareers.com
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
