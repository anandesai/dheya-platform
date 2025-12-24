// Invoice Management Service - Generate and manage invoices
import { prisma } from "@/lib/prisma"
import { PaymentStatus } from "@prisma/client"

// ==========================================
// TYPES
// ==========================================

export interface InvoiceWithDetails {
  id: string
  invoiceNumber: string
  userId: string
  paymentId: string
  packageId: string

  // Customer details
  customerName: string
  customerEmail: string
  customerPhone: string | null
  customerAddress: string | null

  // Amount breakdown
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  totalAmount: number

  // Status
  status: string
  issuedAt: Date
  dueDate: Date | null
  paidAt: Date | null
  pdfUrl: string | null
  notes: string | null

  createdAt: Date
  updatedAt: Date

  // Relations
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    phone: string | null
  }
  payment: {
    id: string
    orderId: string
    paymentId: string | null
    amount: number
    status: PaymentStatus
    method: string | null
    createdAt: Date
  }
  package: {
    id: string
    code: string
    fullName: string
    productName: string
    packageName: string
    priceINR: number
    discountPercent: number
  }
}

export interface CreateInvoiceInput {
  userId: string
  paymentId: string
  packageId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: string
  notes?: string
}

export interface InvoiceSummary {
  id: string
  invoiceNumber: string
  packageName: string
  totalAmount: number
  status: string
  issuedAt: Date
  paidAt: Date | null
}

// ==========================================
// INVOICE SERVICE
// ==========================================

export class InvoiceService {
  private readonly GST_RATE = 18 // 18% GST

  /**
   * Generate invoice number in format INV-YYYY-NNNNN
   */
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const prefix = `INV-${year}-`

    // Get the latest invoice for this year
    const latestInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: prefix
        }
      },
      orderBy: {
        invoiceNumber: 'desc'
      }
    })

    let sequence = 1
    if (latestInvoice) {
      const lastNumber = latestInvoice.invoiceNumber.split('-')[2]
      sequence = parseInt(lastNumber, 10) + 1
    }

    // Pad sequence to 5 digits
    const paddedSequence = sequence.toString().padStart(5, '0')
    return `${prefix}${paddedSequence}`
  }

  /**
   * Calculate invoice amounts with tax
   */
  private calculateAmounts(packagePrice: number, discountPercent: number = 0) {
    // Convert rupees to paise
    const priceInPaise = packagePrice * 100

    // Calculate discount
    const discountAmount = Math.round((priceInPaise * discountPercent) / 100)
    const subtotal = priceInPaise - discountAmount

    // Calculate GST
    const taxAmount = Math.round((subtotal * this.GST_RATE) / 100)
    const totalAmount = subtotal + taxAmount

    return {
      subtotal,
      taxRate: this.GST_RATE,
      taxAmount,
      discountAmount,
      totalAmount
    }
  }

  /**
   * Generate invoice from payment
   */
  async generateInvoice(paymentId: string): Promise<InvoiceWithDetails> {
    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        package: {
          select: {
            id: true,
            code: true,
            fullName: true,
            productName: true,
            packageName: true,
            priceINR: true,
            discountPercent: true
          }
        }
      }
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    if (payment.status !== PaymentStatus.CAPTURED) {
      throw new Error('Cannot generate invoice for incomplete payment')
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { paymentId }
    })

    if (existingInvoice) {
      return this.getInvoiceById(existingInvoice.id) as Promise<InvoiceWithDetails>
    }

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber()

    // Calculate amounts
    const amounts = this.calculateAmounts(
      payment.package.priceINR,
      payment.package.discountPercent
    )

    // Create customer name
    const customerName = payment.user.firstName && payment.user.lastName
      ? `${payment.user.firstName} ${payment.user.lastName}`
      : payment.user.email

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: payment.userId,
        paymentId: payment.id,
        packageId: payment.packageId,

        customerName,
        customerEmail: payment.user.email,
        customerPhone: payment.user.phone,

        subtotal: amounts.subtotal,
        taxRate: amounts.taxRate,
        taxAmount: amounts.taxAmount,
        discountAmount: amounts.discountAmount,
        totalAmount: amounts.totalAmount,

        status: 'PAID',
        issuedAt: new Date(),
        paidAt: payment.updatedAt
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        payment: {
          select: {
            id: true,
            orderId: true,
            paymentId: true,
            amount: true,
            status: true,
            createdAt: true
          }
        },
        package: {
          select: {
            id: true,
            code: true,
            fullName: true,
            productName: true,
            packageName: true,
            priceINR: true,
            discountPercent: true
          }
        }
      }
    })

    return invoice as unknown as InvoiceWithDetails
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId: string): Promise<InvoiceWithDetails | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        payment: {
          select: {
            id: true,
            orderId: true,
            paymentId: true,
            amount: true,
            status: true,
            createdAt: true
          }
        },
        package: {
          select: {
            id: true,
            code: true,
            fullName: true,
            productName: true,
            packageName: true,
            priceINR: true,
            discountPercent: true
          }
        }
      }
    })

    return invoice as unknown as InvoiceWithDetails | null
  }

  /**
   * Get invoice by invoice number
   */
  async getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceWithDetails | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        payment: {
          select: {
            id: true,
            orderId: true,
            paymentId: true,
            amount: true,
            status: true,
            createdAt: true
          }
        },
        package: {
          select: {
            id: true,
            code: true,
            fullName: true,
            productName: true,
            packageName: true,
            priceINR: true,
            discountPercent: true
          }
        }
      }
    })

    return invoice as unknown as InvoiceWithDetails | null
  }

  /**
   * Get all invoices for a user
   */
  async getUserInvoices(userId: string): Promise<InvoiceSummary[]> {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        status: true,
        issuedAt: true,
        paidAt: true,
        package: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    return invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      packageName: inv.package.fullName,
      totalAmount: inv.totalAmount,
      status: inv.status,
      issuedAt: inv.issuedAt,
      paidAt: inv.paidAt
    }))
  }

  /**
   * Generate PDF for invoice (placeholder)
   * TODO: Implement actual PDF generation using libraries like PDFKit or Puppeteer
   */
  async generateInvoicePDF(invoiceId: string): Promise<string> {
    const invoice = await this.getInvoiceById(invoiceId)

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    // Placeholder: In a real implementation, this would generate a PDF
    // using libraries like PDFKit, Puppeteer, or react-pdf

    // For now, return a placeholder URL
    const pdfUrl = `/api/invoices/${invoiceId}/pdf`

    // Update invoice with PDF URL
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { pdfUrl }
    })

    return pdfUrl
  }

  /**
   * Format amount in paise to rupees with currency
   */
  formatAmount(amountInPaise: number): string {
    const amountInRupees = amountInPaise / 100
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amountInRupees)
  }

  /**
   * Get invoice statistics for a user
   */
  async getUserInvoiceStats(userId: string) {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      select: {
        totalAmount: true,
        status: true
      }
    })

    const totalPaid = invoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.totalAmount, 0)

    return {
      totalInvoices: invoices.length,
      totalPaid: this.formatAmount(totalPaid),
      totalPaidRaw: totalPaid
    }
  }
}

// Export singleton instance
export const invoiceService = new InvoiceService()
