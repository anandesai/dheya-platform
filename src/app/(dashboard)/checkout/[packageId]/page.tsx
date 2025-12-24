// ==========================================
// Checkout Page - Razorpay Integration
// ==========================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import type { CheckoutSession } from "@/lib/types/payment";

/**
 * Razorpay type declaration
 */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface CheckoutPageProps {
  params: {
    packageId: string;
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutSession | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      toast.error("Failed to load payment gateway. Please refresh the page.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch package details
  useEffect(() => {
    async function fetchPackageDetails() {
      try {
        const response = await fetch(`/api/packages/${params.packageId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch package details");
        }

        const { data: pkg } = await response.json();

        // Calculate pricing
        const originalPrice = pkg.priceINR;
        const discountPercent = pkg.discountPercent || 0;
        const discountAmount = Math.floor((originalPrice * discountPercent) / 100);
        const finalPrice = originalPrice - discountAmount;

        setCheckoutData({
          packageId: pkg.id,
          packageName: pkg.fullName,
          originalPrice,
          discountPercent,
          discountAmount,
          finalPrice,
          currency: "INR",
          features: pkg.features || [],
          durationValue: pkg.durationValue,
          durationType: pkg.durationType,
          totalSessions: pkg.totalSessions,
        });
      } catch (error) {
        console.error("Error fetching package:", error);
        toast.error("Failed to load package details");
        router.push("/dashboard/packages");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchPackageDetails();
    } else if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/checkout/${params.packageId}`);
    }
  }, [params.packageId, status, router]);

  /**
   * Handle Razorpay checkout
   */
  async function handleCheckout() {
    if (!razorpayLoaded) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    if (!checkoutData || !session?.user) {
      toast.error("Unable to process payment. Please try again.");
      return;
    }

    setProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: checkoutData.packageId,
          notes: {
            packageName: checkoutData.packageName,
            userEmail: session.user.email,
          },
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.message || "Failed to create order");
      }

      const { data: orderData } = await orderResponse.json();

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Dheya Career Mentors",
        description: checkoutData.packageName,
        image: "/logo.png", // Update with actual logo path
        order_id: orderData.orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // Verify payment
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success && verifyData.verified) {
              toast.success("Payment successful! Your package is now active.");
              router.push(`/dashboard/confirmation?payment=${verifyData.data.paymentId}`);
            } else {
              toast.error(verifyData.error || "Payment verification failed");
              setProcessing(false);
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
        prefill: {
          name: session.user.firstName ? `${session.user.firstName} ${session.user.lastName || ""}`.trim() : session.user.email,
          email: session.user.email || "",
        },
        notes: {
          packageId: checkoutData.packageId,
          packageName: checkoutData.packageName,
        },
        theme: {
          color: "#7C3AED", // Uplift purple color
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setProcessing(false);
    }
  }

  // Loading state
  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No checkout data
  if (!checkoutData) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
        <p className="text-muted-foreground">
          Review your order and proceed to payment
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {checkoutData.packageName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Package Details */}
              <div>
                <h3 className="font-semibold mb-2">Package Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {checkoutData.durationValue} {checkoutData.durationType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sessions</span>
                    <span className="font-medium">{checkoutData.totalSessions}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-2">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {checkoutData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Price</span>
                  <span>₹{checkoutData.originalPrice.toLocaleString()}</span>
                </div>

                {checkoutData.discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      Discount ({checkoutData.discountPercent}%)
                    </span>
                    <span>-₹{checkoutData.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{checkoutData.finalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure Payment via Razorpay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>256-bit SSL Encryption</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={processing || !razorpayLoaded}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${checkoutData.finalPrice.toLocaleString()}`
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-4 space-y-2 text-xs text-muted-foreground text-center">
            <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
            <p>All prices are in Indian Rupees (INR)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
