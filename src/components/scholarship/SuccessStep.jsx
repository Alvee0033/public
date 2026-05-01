"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Download, Share2 } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

export default function SuccessStep({ formData, onFinish }) {
  const handleFinish = () => {
    // Navigate to subscription page using Next.js router
    window.location.href = "/subscription";
  };

  const submitScholarshipApplication = async () => {
    try {
      // Get user data from localStorage or context
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      const studentId = user?.student_id || user?.id;

      if (!studentId) {
        console.error("No student ID found");
        return;
      }

      // Submit scholarship application using the real API
      const payload = {
        student: Number(studentId),
        scholarship: 1, // Default scholarship ID - you may want to make this dynamic
        student_application_essay: JSON.stringify(formData), // Store all form data as essay
        application_date: new Date().toISOString(),
        scholarship_application_status: 1, // Pending status
        tuition_fee_or_cash_scholarship: true,
      };

      const response = await axios.post("/scholarship-student-applications", payload);
      console.log("Scholarship application submitted:", response.data);
      
    } catch (error) {
      console.error("Error submitting scholarship application:", error);
    }
  };

  // Submit application when component mounts
  useEffect(() => {
    submitScholarshipApplication();
  }, []);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-700">Application Submitted Successfully!</CardTitle>
        <p className="text-muted-foreground">
          Thank you for applying to the ScholarPASS Scholarship program.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600" />
              Your application will be reviewed by our scholarship committee
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600" />
              You'll receive an email confirmation within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600" />
              Review process takes 5-7 business days
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600" />
              Selected candidates will be contacted for next steps
            </li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3">Application Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-purple-800">Student Name:</p>
              <p className="text-purple-700">
                {formData.studentInfo?.firstName} {formData.studentInfo?.lastName}
              </p>
            </div>
            <div>
              <p className="font-medium text-purple-800">Grade Level:</p>
              <p className="text-purple-700">{formData.studentInfo?.gradeLevel}</p>
            </div>
            <div>
              <p className="font-medium text-purple-800">Selected Courses:</p>
              <p className="text-purple-700">
                {formData.courseSelection?.selectedCourses?.length || 0} courses selected
              </p>
            </div>
            <div>
              <p className="font-medium text-purple-800">Application ID:</p>
              <p className="text-purple-700 font-mono">SP-{Date.now().toString().slice(-8)}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-orange-900 mb-3">Continue Your Journey</h3>
          <p className="text-orange-800 mb-4 text-sm">
            While we review your scholarship application, you can start exploring our subscription plans 
            to begin your learning journey immediately.
          </p>
          <Button 
            onClick={handleFinish}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            View Subscription Plans
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Application Copy
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share with Guardian
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help? Contact us at <a href="mailto:support@scholarpass.com" className="text-blue-600 hover:underline">support@scholarpass.com</a></p>
          <p>or call <a href="tel:+1-555-SCHOLAR" className="text-blue-600 hover:underline">+1-555-SCHOLAR</a></p>
        </div>
      </CardContent>
    </Card>
  );
}