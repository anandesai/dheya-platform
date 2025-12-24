// ==========================================
// Create Razorpay Order API Route
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrder } from "@/lib/services/payment.service";
import { PaymentError } from "@/lib/types/payment";
import { z } from "zod";

/**
 * Request validation schema
 */
const createOrderSchema = z.object({
  packageId: z.string().min(1, "Package ID is required"),
  notes: z.record(z.string(), z.string()).optional(),
});

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for package purchase
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
    const validation = createOrderSchema.safeParse(body);

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

    const { packageId, notes } = validation.data;

    // Create Razorpay order
    const payment = await createOrder({
      packageId,
      userId: session.user.id,
      amount: 0, // Will be calculated from package price
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: {
          orderId: payment.orderId,
          amount: payment.amount,
          currency: payment.currency,
          paymentId: payment.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    if (error instanceof PaymentError) {
      const statusCode =
        error.code === "PACKAGE_NOT_FOUND"
          ? 404
          : error.code === "CONFIG_ERROR"
          ? 500
          : 400;

      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
          details: error.details,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create order. Please try again.",
      },
      { status: 500 }
    );
  }
}
