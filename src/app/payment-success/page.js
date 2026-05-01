"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Download, Calendar } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <p className="text-muted-foreground">
              Welcome to ScholarPASS! Your subscription is now active.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  Access your dashboard to start learning
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  Browse available courses and tutoring sessions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  Schedule your first 1-on-1 tutoring session
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                  Explore coding bootcamps and STEM labs
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Your Subscription Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-800">Plan:</p>
                  <p className="text-blue-700">ScholarPASS Subscription</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Billing:</p>
                  <p className="text-blue-700">Monthly</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Start Date:</p>
                  <p className="text-blue-700">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Next Billing:</p>
                  <p className="text-blue-700">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/lms/student-dashboard" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3">
                💡 Pro Tips to Get Started
              </h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• Complete your profile to get personalized recommendations</li>
                <li>• Take the learning assessment to find your level</li>
                <li>• Join our community forums to connect with other students</li>
                <li>• Schedule a welcome call with our academic advisors</li>
              </ul>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-6">
              <p>
                Questions about your subscription?{" "}
                <a href="mailto:support@scholarpass.com" className="text-primary hover:underline">
                  Contact Support
                </a>
              </p>
              <p className="mt-2">
                Thank you for choosing ScholarPASS for your educational journey!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}