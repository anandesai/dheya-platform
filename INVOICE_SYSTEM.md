# Invoice and Receipt System Documentation

## Overview

Complete invoice and receipt system for the Dheya Career Mentors Platform with professional billing documents, automated invoice generation, and payment tracking.

## System Components

### 1. Database Schema (`prisma/schema.prisma`)

#### Payment Model
- Tracks all payment transactions via Razorpay
- Stores payment IDs, order IDs, and verification signatures
- Supports multiple payment statuses: PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED
- Links to User and Package models

#### Invoice Model
- Professional invoice records with unique invoice numbers
- Format: `INV-YYYY-NNNNN` (e.g., INV-2024-00001)
- Comprehensive billing details: customer info, amount breakdown, tax calculation
- Automatic GST calculation at 18%
- PDF storage support
- One-to-one relationship with Payment

### 2. Invoice Service (`src/lib/services/invoice.service.ts`)

Comprehensive service for invoice management:

#### Key Features
- **Automatic Invoice Generation**: Creates invoice from completed payment
- **Unique Invoice Numbers**: Sequential numbering per year
- **Tax Calculation**: Automatic 18% GST calculation
- **Amount Breakdown**: Subtotal, discount, tax, and total
- **User Invoices**: Retrieve all invoices for a user
- **Invoice Statistics**: Get spending summaries

#### Main Methods

```typescript
// Generate invoice from payment ID
invoiceService.generateInvoice(paymentId: string): Promise<InvoiceWithDetails>

// Get invoice by ID
invoiceService.getInvoiceById(invoiceId: string): Promise<InvoiceWithDetails | null>

// Get invoice by invoice number
invoiceService.getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceWithDetails | null>

// Get all user invoices
invoiceService.getUserInvoices(userId: string): Promise<InvoiceSummary[]>

// Generate PDF (placeholder - requires implementation)
invoiceService.generateInvoicePDF(invoiceId: string): Promise<string>

// Get user invoice statistics
invoiceService.getUserInvoiceStats(userId: string): Promise<Stats>

// Format amount helper
invoiceService.formatAmount(amountInPaise: number): string
```

#### Invoice Number Generation
- Format: `INV-YYYY-NNNNN`
- Example: `INV-2024-00001`
- Automatically increments per year
- 5-digit zero-padded sequence

#### Tax Calculation
- GST Rate: 18%
- Calculation:
  ```
  Subtotal = Package Price - Discount
  Tax Amount = Subtotal × 18%
  Total = Subtotal + Tax Amount
  ```

### 3. API Routes

#### GET `/api/invoices/[invoiceId]`
Fetch invoice details with authentication

**Response:**
```json
{
  "id": "clxxxx",
  "invoiceNumber": "INV-2024-00001",
  "customerName": "John Doe",
  "totalAmount": 2360800,
  "package": {...},
  "payment": {...}
}
```

#### GET `/api/invoices/[invoiceId]/pdf`
Generate and download PDF (placeholder implementation)

**Current Response:**
```json
{
  "message": "PDF generation is not yet implemented",
  "invoiceId": "clxxxx",
  "invoiceNumber": "INV-2024-00001",
  "placeholder": true
}
```

**Future Implementation:**
- Generate PDF using PDFKit, Puppeteer, or react-pdf
- Store in cloud storage (S3, etc.)
- Return as downloadable file

### 4. Invoice Page (`/billing/invoice/[invoiceId]`)

Professional invoice display with:

#### Features
- **Company Branding**: Dheya Career Mentors header
- **Customer Details**: Name, email, phone, address
- **Invoice Information**: Number, dates, status
- **Line Items**: Package details with pricing
- **Amount Breakdown**: Subtotal, discount, GST, total
- **Payment Status**: Visual confirmation of payment
- **Print Support**: Print-optimized layout
- **PDF Download**: Download invoice as PDF (placeholder)

#### Actions
- Print invoice
- Download PDF
- Professional layout for printing

#### Security
- User authentication required
- Users can only view their own invoices
- Server-side authorization checks

### 5. Receipt Component (`/src/components/billing/receipt.tsx`)

Compact payment confirmation component:

#### Two Variants

**Full Receipt (default):**
- Complete transaction details
- Amount breakdown
- Customer information
- Print and download actions
- Link to full invoice

**Compact Receipt:**
- Quick confirmation
- Essential transaction info
- Minimal design for embedded use

#### Usage Examples

```tsx
// Full receipt
<Receipt
  data={receiptData}
  showActions={true}
/>

// Compact receipt for success page
<Receipt
  data={receiptData}
  compact={true}
/>

// Receipt without actions
<Receipt
  data={receiptData}
  showActions={false}
/>
```

## Integration Guide

### 1. After Payment Completion

When a payment is completed via Razorpay webhook:

```typescript
import { invoiceService } from "@/lib/services/invoice.service"

// In your payment webhook handler
async function handlePaymentSuccess(payment) {
  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: PaymentStatus.COMPLETED }
  })

  // Generate invoice
  const invoice = await invoiceService.generateInvoice(payment.id)

  // Optional: Send email with invoice
  await sendInvoiceEmail(invoice)

  return invoice
}
```

### 2. Payment Success Page

Display receipt after successful payment:

```tsx
import { Receipt } from "@/components/billing/receipt"

export default function PaymentSuccessPage() {
  const receiptData = {
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    paymentId: payment.paymentId,
    orderId: payment.orderId,
    packageName: pkg.fullName,
    amount: payment.amount,
    status: "Completed",
    paidAt: payment.updatedAt,
    method: payment.method,
    customerName: user.name,
    customerEmail: user.email
  }

  return (
    <div>
      <Receipt data={receiptData} />
    </div>
  )
}
```

### 3. User Invoice List

Display all user invoices:

```tsx
import { invoiceService } from "@/lib/services/invoice.service"

async function InvoiceListPage() {
  const invoices = await invoiceService.getUserInvoices(userId)

  return (
    <div>
      {invoices.map(invoice => (
        <Link
          key={invoice.id}
          href={`/billing/invoice/${invoice.id}`}
        >
          {invoice.invoiceNumber} - {invoice.packageName}
          <span>{invoiceService.formatAmount(invoice.totalAmount)}</span>
        </Link>
      ))}
    </div>
  )
}
```

## Amount Handling

All amounts are stored in **paise** (smallest currency unit):

```typescript
// Convert rupees to paise for storage
const priceInPaise = priceInRupees * 100

// Convert paise to rupees for display
const priceInRupees = priceInPaise / 100

// Use formatting helper
const formatted = invoiceService.formatAmount(priceInPaise)
// Output: "₹29,995.00"
```

## Data Flow

```
Payment Completed
    ↓
Generate Invoice (invoiceService.generateInvoice)
    ↓
Invoice Stored in Database
    ↓
Invoice Number Generated (INV-YYYY-NNNNN)
    ↓
Display Receipt to User
    ↓
User Can View/Download Full Invoice
```

## Database Migration

After adding the Payment and Invoice models, run:

```bash
npx prisma migrate dev --name add_invoice_system
npx prisma generate
```

## Future Enhancements

### 1. PDF Generation
Implement actual PDF generation using:
- **PDFKit**: Node.js PDF generation library
- **Puppeteer**: Headless Chrome for HTML to PDF
- **react-pdf**: React-based PDF generation

### 2. Email Integration
- Send invoice via email after payment
- Automated receipt delivery
- Invoice reminders for pending payments

### 3. Invoice Templates
- Multiple invoice designs
- Customizable branding
- Region-specific formats (India vs International)

### 4. Bulk Operations
- Bulk invoice generation
- Batch PDF downloads
- CSV export of all invoices

### 5. Advanced Features
- Credit notes for refunds
- Partial payment tracking
- Recurring invoice generation
- Multi-currency support

## Security Considerations

1. **Authentication**: All invoice routes require user authentication
2. **Authorization**: Users can only access their own invoices
3. **Data Validation**: Input validation on all service methods
4. **SQL Injection**: Prisma ORM protects against SQL injection
5. **XSS Protection**: React automatically escapes content

## Testing

### Test Invoice Generation

```typescript
// Create test payment
const payment = await prisma.payment.create({
  data: {
    userId: "user_id",
    packageId: "package_id",
    orderId: "test_order_123",
    amount: 2999500, // ₹29,995
    status: PaymentStatus.COMPLETED
  }
})

// Generate invoice
const invoice = await invoiceService.generateInvoice(payment.id)

console.log(invoice.invoiceNumber) // INV-2024-00001
console.log(invoiceService.formatAmount(invoice.totalAmount)) // ₹35,394.10
```

## Support

For questions or issues with the invoice system:
- Email: support@dheyacareers.com
- Documentation: This file
- Service Code: `/src/lib/services/invoice.service.ts`

---

**Created**: December 2024
**Version**: 1.0.0
**Status**: Production Ready (PDF generation pending)
