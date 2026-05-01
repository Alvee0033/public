"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StripePaymentForm from "@/components/payment/StripePaymentForm";

const subscriptionPlans = {
  basic: {
    id: "basic",
    name: "Basic Plan",
    price: 29,
    description: "Perfect for getting started with personalized tutoring",
  },
  standard: {
    id: "standard", 
    name: "Standard Plan",
    price: 49,
    description: "Most popular choice for comprehensive learning support",
  },
  premium: {
    id: "premium",
    name: "Premium Plan", 
    price: 79,
    description: "Complete access to all educational resources",
  },
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const planId = searchParams?.get("plan");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (planId && subscriptionPlans[planId]) {
      setSelectedPlan(subscriptionPlans[planId]);
    }
  }, [planId]);

  const handlePaymentSuccess = () => {
    // Redirect to success page or dashboard
    window.location.href = "/payment-success";
  };

  const handlePaymentCancel = () => {
    // Redirect back to subscription selection
    window.location.href = "/subscription";
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <Link href="/subscription" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Link>
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Plan</h1>
              <p className="text-muted-foreground mb-4">
                The selected subscription plan is not valid.
              </p>
              <Link 
                href="/subscription"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Choose a Plan
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/subscription" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Link>
          
          <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Payment</h1>
          <p className="text-muted-foreground">
            You're subscribing to the {selectedPlan.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete your payment to start your ScholarPASS subscription
                </p>
              </CardHeader>
              <CardContent>
                <StripePaymentForm
                  courseId={null} // Not course-specific
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                  isMultiCourse={false}
                  totalAmount={selectedPlan.price}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-sm md:sticky md:top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{selectedPlan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPlan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${selectedPlan.price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>${selectedPlan.price}/month</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Cancel anytime</p>
                  <p>• 30-day money-back guarantee</p>
                  <p>• Secure payment processing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Need Help?</h4>
                <p className="text-sm text-blue-800">
                  If you have questions about billing or payment, you can{" "}
                  <a href="mailto:support@scholarpass.com" className="text-blue-600 hover:underline">
                    contact our support team
                  </a>{" "}
                  or{" "}
                  <a href="tel:+1-555-SCHOLAR" className="text-blue-600 hover:underline">
                    call us
                  </a>{" "}
                  for assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}