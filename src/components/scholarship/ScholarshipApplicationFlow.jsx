"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Import form steps
import StudentInfoStep from "@/components/scholarship/StudentInfoStep";
import GuardianInfoStep from "@/components/scholarship/GuardianInfoStep";
import LearningGoalStep from "@/components/scholarship/LearningGoalStep";
import CourseSelectionStep from "@/components/scholarship/CourseSelectionStep";
import AcademicSupportStep from "@/components/scholarship/AcademicSupportStep";
import FinancialInfoStep from "@/components/scholarship/FinancialInfoStep";
import ApplicationEssayStep from "@/components/scholarship/ApplicationEssayStep";
import SuccessStep from "@/components/scholarship/SuccessStep";

const steps = [
  {
    id: 1,
    title: "Student Information",
    description: "Basic student details",
    component: StudentInfoStep,
  },
  {
    id: 2,
    title: "Guardian Information",
    description: "Parent/Guardian details",
    component: GuardianInfoStep,
  },
  {
    id: 3,
    title: "Learning Goals",
    description: "Educational objectives",
    component: LearningGoalStep,
  },
  {
    id: 4,
    title: "Course Selection",
    description: "Choose your courses",
    component: CourseSelectionStep,
  },
  {
    id: 5,
    title: "Academic Support",
    description: "Support requirements",
    component: AcademicSupportStep,
  },
  {
    id: 6,
    title: "Financial Information",
    description: "Financial background",
    component: FinancialInfoStep,
  },
  {
    id: 7,
    title: "Application Essay",
    description: "Personal statements",
    component: ApplicationEssayStep,
  },
  {
    id: 8,
    title: "Success",
    description: "Application complete",
    component: SuccessStep,
  },
];

export default function ScholarshipApplicationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // This will be handled by the SuccessStep component
    console.log("Application completed:", formData);
  };

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentComponent = currentStepData?.component;

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">ScholarPASS Application</h1>
              <p className="text-muted-foreground mt-2">
                Apply for unlimited K-12 tutoring, coding & robotics scholarships
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</div>
              <div className="text-lg font-semibold">{currentStepData?.title}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Start</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                  step.id === currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : completedSteps.has(step.id)
                    ? "bg-green-50 text-green-700 border-green-200"
                    : step.id < currentStep
                    ? "bg-muted text-muted-foreground border-muted"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1">
                  {completedSteps.has(step.id) ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-xs text-center font-medium">{step.title}</div>
                <div className="text-xs text-center opacity-75">{step.description}</div>
              </div>
            ))}
          </div>

          {/* Mobile Step Navigation */}
          <div className="md:hidden mb-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Step {currentStep} of {steps.length}</span>
              <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="mb-8">
          {CurrentComponent && (
            <CurrentComponent
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onPrev={currentStep > 1 ? handlePrev : null}
              onFinish={handleFinish}
            />
          )}
        </div>

        {/* Help Section */}
        {currentStep < steps.length && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Need Help?</h4>
                  <p className="text-sm text-blue-800">
                    If you have questions about this step, you can{" "}
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
        )}
      </div>
    </div>
  );
}