"use client";

import logo from "@/assets/icons/admin_logo.png";
import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { instance } from "@/lib/axios";
import { generateSecurityStamp } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    otp: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function ResetPasswordForm() {
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState('email'); // email -> otp -> password
    const [email, setEmail] = useState('');
    const params = useSearchParams();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            otp: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleGetResetCode = async (email) => {
        setSubmitting(true);
        try {
            await instance.post("/request-reset", { email });
            setEmail(email);
            setStep('otp');
            toast.success("Reset code sent to your email!");
        } catch (error) {
            toast.error("Failed to send reset code. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyOTP = async (otp) => {
        setSubmitting(true);
        try {
            await instance.post("/verify-otp", { email, otp });
            setStep('password');
            toast.success("OTP verified successfully!");
        } catch (error) {
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const onSubmit = async (values) => {
        if (step === 'email') {
            await handleGetResetCode(values.email);
            // return;
            setStep('otp');
        }

        if (step === 'otp') {
            await handleVerifyOTP(values.otp);
            // return;
            setStep('password');
        }

        setSubmitting(true);
        try {
            await instance.post("/reset-password", {
                email,
                password: values.password,
                security_stamp: generateSecurityStamp(),
            });

            window.location.href = "/login";
            toast.success("Password reset successfully! Please login with your new password.");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error("Invalid request. Please try again.");
                } else if (error.response.status === 404) {
                    toast.error("Invalid or expired reset token.");
                } else if (error.response.status === 500) {
                    toast.error("Server error. Please try again later.");
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            } else if (error.request) {
                toast.error("No response from server. Please check your network.");
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
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
                    Reset Password
                </CardTitle>
                <CardDescription className="text-white/90">
                    {step === 'email' && "Enter your email to receive a reset code"}
                    {step === 'otp' && "Enter the reset code sent to your email"}
                    {step === 'password' && "Enter your new password"}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            type="email"
                                            disabled={step !== 'email'}
                                            {...field}
                                            className="bg-gray-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {step === 'otp' && (
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reset Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter reset code"
                                                {...field}
                                                className="bg-gray-50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {step === 'password' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter new password"
                                                    type="password"
                                                    {...field}
                                                    className="bg-gray-50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Confirm new password"
                                                    type="password"
                                                    {...field}
                                                    className="bg-gray-50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            {submitting ? "Processing..." : (
                                step === 'email' ? "Get Reset Code" :
                                    step === 'otp' ? "Verify Code" :
                                        "Reset Password"
                            )}
                        </Button>

                        <div className="flex justify-center text-sm">
                            <Link
                                href="/login"
                                variant="link"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </div>
    );
}
