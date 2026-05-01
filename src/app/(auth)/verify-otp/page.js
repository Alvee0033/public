"use client";

import logo from "@/assets/icons/admin_logo.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { requestLoginOTP, verifyLoginOTP } from "@/lib/auth";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export default function VerifyOTP() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const email = params.get("email");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please try again");
      router.push("/login");
      return;
    }

    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Update form value
    form.setValue("otp", newOtpValues.join(""));

    // If all digits are filled, automatically verify
    if (value !== "" && index === 5) {
      const completeOtp = newOtpValues.join("");
      if (completeOtp.length === 6) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otpValues[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d*$/.test(pastedData)) return;

    const newOtpValues = [...otpValues];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtpValues[index] = char;
    });
    setOtpValues(newOtpValues);
    form.setValue("otp", newOtpValues.join(""));

    // If we have a complete OTP after paste, verify it
    if (pastedData.length === 6) {
      form.handleSubmit(onSubmit)();
    } else {
      // Focus last filled input or first empty input
      const lastFilledIndex = Math.max(Math.min(pastedData.length - 1, 5), 0);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const onSubmit = async (values) => {
    if (!email) {
      toast.error("Email not found. Please try again");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      await verifyLoginOTP(email, values.otp, dispatch);
      router.push(params.get("redirect") || "/");
    } catch (error) {
      // Reset OTP fields on error
      setOtpValues(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || !canResend) {
      return;
    }

    try {
      setSubmitting(true);
      await requestLoginOTP(email);
      setOtpValues(Array(6).fill(""));
      inputRefs.current[0]?.focus();

      // Reset timer
      setTimeLeft(600);
      setCanResend(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Format time left into minutes and seconds
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg">
      <CardHeader className="text-center py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
        <div className="flex justify-center mb-4">
          <Image
            src={logo}
            alt="ScholarPASS Logo"
            width={64}
            height={64}
            className="rounded-lg"
          />
        </div>
        <CardTitle className="text-3xl font-bold text-white">
          Check your Email
        </CardTitle>
        <CardDescription className="text-white/90">
          Enter the code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 justify-between">
                      {otpValues.map((value, index) => (
                        <Input
                          key={index}
                          ref={(element) => {
                            inputRefs.current[index] = element;
                          }}
                          type="text"
                          maxLength={1}
                          value={value}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className="w-12 h-12 text-center text-2xl bg-gray-50 p-0"
                          disabled={submitting}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={submitting || !canResend}
                className={`text-sm ${
                  canResend
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {canResend
                  ? "Resend verification code"
                  : `Resend available in ${formatTimeLeft()}`}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
