// ==========================================
// Payment Service - Razorpay Integration
// ==========================================

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, type Payment } from "@prisma/client";
import {
  PaymentError,
  type CreateOrderRequest,
  type RazorpayOrder,
  type PaymentOrder,
  type VerifyPaymentRequest,
  type PaymentVerificationResponse,
  type RazorpayPayment,
  type RefundRequest,
  type RazorpayRefund,
} from "@/lib/types/payment";

/**
 * Razorpay API configuration
 */
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_API_URL = "https://api.razorpay.com/v1";

/**
 * Validate Razorpay credentials
 */
function validateRazorpayConfig(): void {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new PaymentError(
      "Razorpay credentials not configured",
      "CONFIG_ERROR",
      { missing: !RAZORPAY_KEY_ID ? "RAZORPAY_KEY_ID" : "RAZORPAY_KEY_SECRET" }
    );
  }
}

/**
 * Get Razorpay API auth headers
 */
function getAuthHeaders(): HeadersInit {
  validateRazorpayConfig();
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  return {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };
}

/**
 * Create Razorpay order
 * @param request - Order creation request
 * @returns Created payment order
 */
export async function createOrder(
  request: CreateOrderRequest
): Promise<Payment> {
  try {
    validateRazorpayConfig();

    // Validate package exists
    const pkg = await prisma.package.findUnique({
      where: { id: request.packageId },
      select: {
        id: true,
        fullName: true,
        priceINR: true,
        discountPercent: true,
        segment: true,
        tier: true,
      },
    });

    if (!pkg) {
      throw new PaymentError("Package not found", "PACKAGE_NOT_FOUND", {
        packageId: request.packageId,
      });
    }

    // Calculate final amount (apply discount)
    const originalPrice = pkg.priceINR * 100; // Convert to paise
    const discountAmount = Math.floor((originalPrice * pkg.discountPercent) / 100);
    const finalAmount = originalPrice - discountAmount;

    // Generate receipt ID
    const receiptId = request.receipt || `rcpt_${Date.now()}_${request.packageId.slice(-8)}`;

    // Create Razorpay order
    const orderPayload = {
      amount: finalAmount,
      currency: request.currency || "INR",
      receipt: receiptId,
      notes: {
        packageId: request.packageId,
        userId: request.userId,
        packageName: pkg.fullName,
        segment: pkg.segment,
        tier: pkg.tier,
        ...request.notes,
      },
    };

    const response = await fetch(`${RAZORPAY_API_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new PaymentError(
        "Failed to create Razorpay order",
        "RAZORPAY_API_ERROR",
        error
      );
    }

    const razorpayOrder: RazorpayOrder = await response.json();

    // Store payment order in database
    const payment = await prisma.payment.create({
      data: {
        userId: request.userId,
        packageId: request.packageId,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        status: PaymentStatus.CREATED,
        receipt: razorpayOrder.receipt,
        notes: razorpayOrder.notes as Record<string, string>,
      },
    });

    return payment;
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError(
      "Failed to create payment order",
      "CREATE_ORDER_ERROR",
      error
    );
  }
}

/**
 * Verify Razorpay payment signature
 * @param request - Payment verification request
 * @returns Verification response with payment details
 */
export async function verifyPayment(
  request: VerifyPaymentRequest
): Promise<PaymentVerificationResponse> {
  try {
    validateRazorpayConfig();

    // Find payment in database
    const payment = await prisma.payment.findUnique({
      where: { orderId: request.orderId },
      include: {
        package: {
          select: {
            id: true,
            fullName: true,
            durationValue: true,
            durationType: true,
            totalSessions: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!payment) {
      return {
        success: false,
        verified: false,
        error: "Payment not found",
      };
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(`${request.orderId}|${request.paymentId}`)
      .digest("hex");

    const isValid = generatedSignature === request.signature;

    if (!isValid) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          notes: {
            ...(payment.notes as object),
            failureReason: "Invalid signature",
            verificationAttemptedAt: new Date().toISOString(),
          },
        },
      });

      return {
        success: false,
        verified: false,
        error: "Invalid payment signature",
      };
    }

    // Fetch payment details from Razorpay to get actual status
    const razorpayPayment = await getPaymentById(request.paymentId);

    // Update payment record with payment ID and status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentId: request.paymentId,
        status:
          razorpayPayment.status === "captured"
            ? PaymentStatus.CAPTURED
            : PaymentStatus.AUTHORIZED,
        notes: {
          ...(payment.notes as object),
          verifiedAt: new Date().toISOString(),
          paymentMethod: razorpayPayment.method,
          paymentEmail: razorpayPayment.email,
          paymentContact: razorpayPayment.contact,
        },
      },
    });

    // Activate user package only if payment is captured
    let userPackageId: string | undefined;
    if (razorpayPayment.status === "captured") {
      // Calculate expiry date
      const expiryDate = new Date();
      if (payment.package.durationType === "weeks") {
        expiryDate.setDate(expiryDate.getDate() + payment.package.durationValue * 7);
      } else if (payment.package.durationType === "months") {
        expiryDate.setMonth(expiryDate.getMonth() + payment.package.durationValue);
      } else if (payment.package.durationType === "years") {
        expiryDate.setFullYear(expiryDate.getFullYear() + payment.package.durationValue);
      }

      // Create or update user package
      const userPackage = await prisma.userPackage.upsert({
        where: {
          userId_packageId: {
            userId: payment.userId,
            packageId: payment.packageId,
          },
        },
        create: {
          userId: payment.userId,
          packageId: payment.packageId,
          status: "active",
          expiresAt: expiryDate,
          currentPhase: 1,
          sessionsUsed: 0,
          purchasedAt: new Date(),
        },
        update: {
          status: "active",
          expiresAt: expiryDate,
          currentPhase: 1,
          sessionsUsed: 0,
          purchasedAt: new Date(),
        },
      });

      userPackageId = userPackage.id;
    }

    return {
      success: true,
      verified: true,
      payment: updatedPayment,
      userPackageId,
    };
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError(
      "Failed to verify payment",
      "VERIFY_PAYMENT_ERROR",
      error
    );
  }
}

/**
 * Get payment details from Razorpay
 * @param paymentId - Razorpay payment ID
 * @returns Payment details
 */
export async function getPaymentById(paymentId: string): Promise<RazorpayPayment> {
  try {
    validateRazorpayConfig();

    const response = await fetch(`${RAZORPAY_API_URL}/payments/${paymentId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new PaymentError(
        "Failed to fetch payment details",
        "RAZORPAY_API_ERROR",
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError(
      "Failed to get payment details",
      "GET_PAYMENT_ERROR",
      error
    );
  }
}

/**
 * Refund payment
 * @param request - Refund request
 * @returns Refund details
 */
export async function refundPayment(
  request: RefundRequest
): Promise<RazorpayRefund> {
  try {
    validateRazorpayConfig();

    // Find payment in database
    const payment = await prisma.payment.findFirst({
      where: { paymentId: request.paymentId },
    });

    if (!payment) {
      throw new PaymentError("Payment not found", "PAYMENT_NOT_FOUND", {
        paymentId: request.paymentId,
      });
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new PaymentError(
        "Payment already refunded",
        "ALREADY_REFUNDED",
        { paymentId: request.paymentId }
      );
    }

    // Create refund via Razorpay API
    const refundPayload = {
      amount: request.amount, // Optional: partial refund
      notes: request.notes,
    };

    const response = await fetch(
      `${RAZORPAY_API_URL}/payments/${request.paymentId}/refund`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(refundPayload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new PaymentError(
        "Failed to process refund",
        "RAZORPAY_API_ERROR",
        error
      );
    }

    const refund: RazorpayRefund = await response.json();

    // Update payment status
    const newStatus =
      refund.amount === payment.amount
        ? PaymentStatus.REFUNDED
        : PaymentStatus.PARTIALLY_REFUNDED;

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        notes: {
          ...(payment.notes as object),
          refundId: refund.id,
          refundAmount: refund.amount,
          refundedAt: new Date().toISOString(),
        },
      },
    });

    // Deactivate user package if full refund
    if (newStatus === PaymentStatus.REFUNDED) {
      await prisma.userPackage.updateMany({
        where: {
          userId: payment.userId,
          packageId: payment.packageId,
          status: "active",
        },
        data: {
          status: "cancelled",
        },
      });
    }

    return refund;
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError(
      "Failed to process refund",
      "REFUND_ERROR",
      error
    );
  }
}

/**
 * Get payment by order ID
 * @param orderId - Razorpay order ID
 * @returns Payment order
 */
export async function getPaymentByOrderId(
  orderId: string
): Promise<PaymentOrder | null> {
  return await prisma.payment.findUnique({
    where: { orderId },
  });
}

/**
 * Get user's payment history
 * @param userId - User ID
 * @returns List of payments
 */
export async function getUserPayments(userId: string): Promise<PaymentOrder[]> {
  return await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get Razorpay public key for frontend
 * @returns Razorpay key ID
 */
export function getRazorpayKeyId(): string {
  validateRazorpayConfig();
  return RAZORPAY_KEY_ID!;
}
