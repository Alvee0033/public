"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, HelpCircle } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function PreTestHeader({
  examData,
  showHints,
  setShowHints,
  setShowConfirmSubmit,
  currentQuestion,
  totalAnswered,
  handleSubmit,
  isSubmitting,
}) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b mb-6">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {examData?.title || "Loading pre-test..."}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {examData?.exam_duration_minutes} minutes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Hints Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHints(!showHints)}
            className={`flex items-center gap-2 ${
              showHints ? "bg-purple-50 text-purple-700" : ""
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Show Hints
          </Button>

          {/* Submit Button */}
          <Button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit Pre-Test"}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-purple-600 transition-all duration-300"
          style={{
            width: `${
              (totalAnswered / examData?.exam_questions?.length) * 100
            }%`,
          }}
        />
      </div>
    </div>
  );
}
