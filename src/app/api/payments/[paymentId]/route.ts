// ==========================================
// Get Payment Details API Route
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/payments/[paymentId]
 * Get payment details by payment ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { paymentId } = params;

    // Find payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        package: {
          select: {
            id: true,
            fullName: true,
            productName: true,
            packageName: true,
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
      return NextResponse.json(
        { error: "Not Found", message: "Payment not found" },
        { status: 404 }
      );
    }

    // Verify user owns this payment
    if (payment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden", message: "You don't have access to this payment" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: payment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get payment error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve payment details",
      },
      { status: 500 }
    );
  }
}
