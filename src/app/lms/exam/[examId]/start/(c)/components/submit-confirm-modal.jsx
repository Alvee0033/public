"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  XCircle,
} from "lucide-react";

export default function SubmitConfirmModal({
  examData,
  answers,
  isSubmitting,
  onCancel,
  onConfirm,
}) {
  const totalQuestions = examData?.exam_questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Submit Exam</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>{answeredCount} questions answered</span>
          </div>

          {unansweredCount > 0 && (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <span>{unansweredCount} questions unanswered</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Confirm Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
