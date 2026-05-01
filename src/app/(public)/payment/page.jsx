"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import useSWR from "swr";
import axios from "@/lib/axios";

// Custom components
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { CardPaymentForm } from "@/components/payment/CardPaymentForm";
import { TestCardInfo } from "@/components/payment/TestCardInfo";
import { AlternativePaymentMethods } from "@/components/payment/AlternativePaymentMethods";
import { usePaymentForm } from "@/hooks/usePaymentForm";

import { toast } from "sonner";

export default function PaymentPage() {
    const router = useRouter();
    
    // SWR fetcher function
    const fetcher = (url) => axios.get(url).then(res => res?.data?.data || []);
    
    // Fetch countries using SWR
    const { data: countries = [], isLoading: countriesLoading, error: countriesError } = useSWR("/master-countries", fetcher);
    
    const {
        paymentMethod,
        formData,
        errors,
        isLoading,
        touched,
        isCardPayment,
        setPaymentMethod,
        handleCardNumberChange,
        handleExpiryChange,
        handleSecurityCodeChange,
        handleCountryChange,
        handleFieldBlur,
        handleSubmit,
    } = usePaymentForm();

    /**
     * Handles payment form submission
     */
    const onSubmit = async (paymentData) => {
        try {
            // Simulate payment processing
            console.log('Processing payment:', paymentData);
            
            // In a real app, you would call your payment API here
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Handle successful payment
            toast.success('Payment successful!');
            router.push('/payment/success');
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Payment failed. Please try again.');
            throw error;
        }
    };

    /**
     * Handles pay now button click
     */
    const handlePayNow = async () => {
        const success = await handleSubmit(onSubmit);
        if (!success) {
            console.log('Form validation failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-lg">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Complete Your Payment
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Payment Method Selection */}
                        <PaymentMethodSelector
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            disabled={isLoading}
                        />

                        {/* Secure Checkout Badge */}
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            <Lock className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-600">
                                Secure, fast checkout with Link
                            </span>
                            <button 
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="More information about secure checkout"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2L13 9l7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
                                </svg>
                            </button>
                        </div>

                        {/* Card Payment Form */}
                        {isCardPayment && (
                            <CardPaymentForm
                                formData={formData}
                                errors={errors}
                                touched={touched}
                                countries={countries}
                                countriesLoading={countriesLoading}
                                onCardNumberChange={handleCardNumberChange}
                                onExpiryChange={handleExpiryChange}
                                onSecurityCodeChange={handleSecurityCodeChange}
                                onCountryChange={handleCountryChange}
                                onFieldBlur={handleFieldBlur}
                                disabled={isLoading}
                            />
                        )}

                        {/* Test Card Information */}
                        {/* {isCardPayment && (
                            <TestCardInfo isVisible={true} />
                        )} */}

                        {/* Alternative Payment Methods */}
                        <AlternativePaymentMethods paymentMethod={paymentMethod} />

                        {/* <Separator /> */}

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-black hover:bg-violet-800 text-white disabled:opacity-50 bg-violet-500"
                                onClick={handlePayNow}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Pay Now'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

