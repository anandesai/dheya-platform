// ==========================================
// Payment Types - Razorpay Integration
// ==========================================

import type { Payment, PaymentStatus as PrismaPaymentStatus } from "@prisma/client";

// Re-export Prisma's PaymentStatus for convenience
export type PaymentStatus = PrismaPaymentStatus;

/**
 * Razorpay order creation request
 */
export interface CreateOrderRequest {
  packageId: string;
  userId: string;
  amount: number; // Amount in paise
  currency?: string; // Default: INR
  receipt?: string; // Optional receipt ID
  notes?: Record<string, string>; // Optional metadata
}

/**
 * Razorpay order creation response
 */
export interface RazorpayOrder {
  id: string; // Razorpay order ID
  entity: "order";
  amount: number; // Amount in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string | null;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, string>;
  created_at: number; // Unix timestamp
}

/**
 * Payment order stored in database
 * Using Prisma's Payment type for consistency
 */
export type PaymentOrder = Payment;

/**
 * Payment verification request from frontend
 */
export interface VerifyPaymentRequest {
  orderId: string; // Razorpay order ID
  paymentId: string; // Razorpay payment ID
  signature: string; // Razorpay signature
}

/**
 * Payment verification response
 */
export interface PaymentVerificationResponse {
  success: boolean;
  verified: boolean;
  payment?: PaymentOrder;
  error?: string;
  userPackageId?: string; // ID of activated user package
}

/**
 * Razorpay payment details
 */
export interface RazorpayPayment {
  id: string;
  entity: "payment";
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  method: string; // card, netbanking, wallet, upi, etc.
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: Record<string, string>;
  fee: number | null;
  tax: number | null;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_step: string | null;
  error_reason: string | null;
  created_at: number;
}

/**
 * Refund request
 */
export interface RefundRequest {
  paymentId: string;
  amount?: number; // Amount in paise (optional for partial refund)
  notes?: Record<string, string>;
}

/**
 * Razorpay refund response
 */
export interface RazorpayRefund {
  id: string;
  entity: "refund";
  amount: number;
  currency: string;
  payment_id: string;
  notes: Record<string, string>;
  receipt: string | null;
  acquirer_data: {
    arn: string | null;
  };
  created_at: number;
  batch_id: string | null;
  status: "pending" | "processed" | "failed";
  speed_processed: string;
  speed_requested: string;
}

/**
 * Invoice details
 */
export interface Invoice {
  id: string;
  paymentId: string;
  userId: string;
  packageId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  generatedAt: Date;
  pdfUrl?: string;
}

/**
 * Checkout session data
 */
export interface CheckoutSession {
  packageId: string;
  packageName: string;
  originalPrice: number; // in INR
  discountPercent: number;
  discountAmount: number; // in INR
  finalPrice: number; // in INR
  currency: string;
  features: string[];
  durationValue: number;
  durationType: string;
  totalSessions: number;
}

/**
 * Razorpay checkout options for frontend
 */
export interface RazorpayCheckoutOptions {
  key: string; // Razorpay key ID
  amount: number; // Amount in paise
  currency: string;
  name: string; // Business name
  description: string;
  image?: string; // Company logo URL
  order_id: string; // Razorpay order ID
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

/**
 * Payment error types
 */
export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

/**
 * Payment webhook event
 */
export interface PaymentWebhookEvent {
  entity: "event";
  account_id: string;
  event: string; // payment.captured, payment.failed, refund.created, etc.
  contains: string[];
  payload: {
    payment: {
      entity: RazorpayPayment;
    };
  };
  created_at: number;
}

/**
 * Payment analytics data
 */
export interface PaymentAnalytics {
  totalRevenue: number;
  totalPayments: number;
  successRate: number;
  averageOrderValue: number;
  paymentsByStatus: Record<PaymentStatus, number>;
  paymentsByMethod: Record<string, number>;
  revenueByPackage: Record<string, number>;
}
