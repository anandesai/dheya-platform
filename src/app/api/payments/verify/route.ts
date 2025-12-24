// ==========================================
// Verify Razorpay Payment API Route
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyPayment } from "@/lib/services/payment.service";
import { PaymentError } from "@/lib/types/payment";
import { z } from "zod";

/**
 * Request validation schema
 */
const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  paymentId: z.string().min(1, "Payment ID is required"),
  signature: z.string().min(1, "Signature is required"),
});

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature and activate package
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = verifyPaymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: validation.error.issues[0].message,
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { orderId, paymentId, signature } = validation.data;

    // Verify payment signature
    const result = await verifyPayment({
      orderId,
      paymentId,
      signature,
    });

    if (!result.success || !result.verified) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: result.error || "Payment verification failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        verified: true,
        message: "Payment verified successfully",
        data: {
          paymentId: result.payment?.id,
          userPackageId: result.userPackageId,
          packageActivated: !!result.userPackageId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);

    if (error instanceof PaymentError) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: error.code,
          message: error.message,
          details: error.details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: "Internal Server Error",
        message: "Failed to verify payment. Please contact support.",
      },
      { status: 500 }
    );
  }
}
