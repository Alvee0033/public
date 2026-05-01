"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getStripe } from "@/lib/stripe";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";

const fetcher = async (url) => {
  const response = await axios.post(url, {
    price: 100, // Amount in dollars
    course_id: 1,
  });
  return response.data;
};

function StripePaymentForm({ onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
   const [showPaymentForm, setShowPaymentForm] = useState(false);

    async function handlePaymentSuccess() {
    setPaymentSuccess(true);
    try {
      try {
        const canPurchaseMultipleTimes =
          String(course?.name || "").trim() === "ScholarPASS K12 Bundle";
        const result = await checkCourseEnrollment(courseId);
        // If already enrolled and the course is not allowed to be purchased multiple times,
        // short-circuit and redirect. Otherwise (e.g. ScholarPass bundle), continue.
        if (result.enrolled && !canPurchaseMultipleTimes) {
          setEnrollmentSuccess(true);
          setTimeout(() => {
            redirectBasedOnRole();
          }, 2000);
          return;
        }
      } catch {
        setEnrollmentError(
          "Failed to check enrollment status. Please try again later."
        );
        return;
      }
      const userResponse = await axios.post("/auth/me");
      const primaryRole =
        userResponse.data.data.primary_role.name.toLowerCase();
      if (primaryRole === "student") {
        await axios.post("/edumarket/enrollments/confirm", {
          course_id: parseInt(courseId),
        });
      } else if (primaryRole === "guardian") {
        // Validate that a student is selected for guardians
        if (!selectedStudentId) {
          setEnrollmentError(
            "Please select a student to enroll in this course."
          );
          return;
        }

        const payload = {
          course_id: parseInt(courseId),
          student_id: parseInt(selectedStudentId),
        };

        await axios.post("/stripe/guardian-enroll", payload);
      }

      // Send bundle course selections if this is a bundle purchase
      // Only proceed if bundle data exists and hasn't been processed yet
      const bundleData = localStorage.getItem("scholarpass_bundle");
      const bundleProcessed = localStorage.getItem(
        "scholarpass_bundle_processed"
      );

      if (bundleData && bundleProcessed !== "true") {
        try {
          const parsedBundleData = JSON.parse(bundleData);
          console.log(
            "Sending bundle selections to backend:",
            parsedBundleData
          );

          // Send the bundle data to the backend
          await axios.post("/bundle-selected-course", parsedBundleData);

          // Mark as processed to prevent duplicate submission
          localStorage.setItem("scholarpass_bundle_processed", "true");
          console.log(
            "Bundle selections successfully sent and marked as processed"
          );
        } catch (bundleError) {
          console.error(
            "Failed to submit bundle course selections:",
            bundleError
          );
        }
      }

      setEnrollmentSuccess(true);
      setTimeout(() => {
        redirectBasedOnRole();
      }, 2000);
    } catch (err) {
      setEnrollmentError(
        err.response?.data?.message || "Failed to create enrollment"
      );
      setTimeout(() => {
        redirectBasedOnRole();
      }, 5000);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError("");

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-result`,
        },
      });

      if (error) {
        setPaymentError(error.message);
      }
    } catch (e) {
      setPaymentError("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-lg">
        {/* <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PaymentElement />
          {paymentError && (
            <div className="text-sm text-red-500">{paymentError}</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Complete Payment"}
          </Button>
        </CardFooter> */}
        <CardContent>
          <StripePaymentForm
            courseId={12}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentForm(false)}
          />
        </CardContent>
      </Card>
    </form>
  );
}

export default function PaymentForm({ onBack }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { data, error, isLoading } = useSWR(
    "stripe/create-payment-intent",
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Failed to load payment options</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue="card"
        className="grid grid-cols-2 gap-4"
        onValueChange={setPaymentMethod}
      >
        <div>
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <CreditCard className="mb-3 h-6 w-6" />
            Credit Card
          </Label>
        </div>
        <div>
          <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
          <Label
            htmlFor="bank"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Landmark className="mb-3 h-6 w-6" />
            Bank Transfer
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === "card" && (
        <Elements
          stripe={getStripe()}
          options={{ clientSecret: data.clientSecret }}
        >
          <StripePaymentForm onBack={onBack} />
        </Elements>
      )}

      {paymentMethod === "bank" && (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Please transfer the amount to:</p>
              <div className="rounded-lg bg-muted p-4">
                <p>Bank: Example Bank</p>
                <p>Account Name: ScholarPASS</p>
                <p>Account Number: XXXX-XXXX-XXXX</p>
                <p>Routing Number: XXXXXX</p>
                <p>Reference: Your Order ID</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={() => (window.location.href = "/payment-result")}>
              I&apos;ve Made the Transfer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
