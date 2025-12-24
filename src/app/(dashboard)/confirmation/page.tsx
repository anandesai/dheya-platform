// ==========================================
// Payment Confirmation Page
// ==========================================

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  package: {
    fullName: string;
    productName: string;
    durationValue: number;
    durationType: string;
    totalSessions: number;
  };
}

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment");

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!paymentId) {
        router.push("/dashboard");
        return;
      }

      try {
        const response = await fetch(`/api/payments/${paymentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }

        const { data } = await response.json();
        setPayment(data);
      } catch (error) {
        console.error("Error fetching payment:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentDetails();
  }, [paymentId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  const amountPaid = payment.amount / 100; // Convert paise to rupees

  return (
    <div className="container max-w-2xl py-8">
      {/* Success Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Your package has been activated and is ready to use
        </p>
      </div>

      {/* Payment Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
          <CardDescription>Transaction ID: {payment.orderId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Package Information */}
          <div>
            <h3 className="font-semibold mb-2">Package Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium">{payment.package.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {payment.package.durationValue} {payment.package.durationType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sessions</span>
                <span className="font-medium">{payment.package.totalSessions}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold mb-2">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-medium text-lg">
                  ₹{amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Date</span>
                <span className="font-medium">
                  {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-green-600">
                  {payment.status}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/invoices">View All Invoices</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s Next?</CardTitle>
          <CardDescription>Get started with your mentorship journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              1
            </div>
            <div>
              <p className="font-medium">Complete Your Profile</p>
              <p className="text-sm text-muted-foreground">
                Add your details and career goals to personalize your experience
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              2
            </div>
            <div>
              <p className="font-medium">Take Assessment Tools</p>
              <p className="text-sm text-muted-foreground">
                Complete diagnostic assessments to build your career roadmap
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              3
            </div>
            <div>
              <p className="font-medium">Book Your First Session</p>
              <p className="text-sm text-muted-foreground">
                Schedule a mentorship session with your assigned mentor
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Support Message */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Need help getting started?{" "}
        <Link href="/support" className="text-primary hover:underline">
          Contact Support
        </Link>
      </p>
    </div>
  );
}
