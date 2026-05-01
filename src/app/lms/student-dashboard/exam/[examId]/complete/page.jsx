"use client";

import { examStore } from "@/app/lms/exam/[examId]/start/utils/exam-store";
import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios";
import {
  CheckCircle,
  Clock,
  FileText,
  Home,
  ListChecks,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateCorrectPoints} from "./calculatePoints";
import { set } from "date-fns";


export default function ExamCompletePage({ params }) {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [points,setpoints]=useState(0)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get stored exam data
        const storedData = examStore.getExamProgress(params.examId);

        // Fetch exam details
        const response = await instance.get(`/exams/${params.examId}`);
        const examDetails = response.data?.data;

        const res=await instance.get(`/exam-report/generate?examId=${examDetails.id}`)
        const examReport = res.data?.data;
        if (!examReport) throw new Error("Something went wrong, please refresh the page.");
        setpoints(examReport)
        setExamData({
          ...examDetails,
          answers: storedData.answers,
          submittedAt: storedData.submittedAt,
        });


      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err.message || "Failed to load exam results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [params.examId]);




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
          <span>Loading results...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Failed to Load Results
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/lms/student-dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Exam Submitted Successfully
          </h1>
          <p className="text-gray-600">
            Your exam has been submitted and is being processed.
          </p>
        </div>

        {/* Exam Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Exam Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <p>Your points:</p>
              <p>{points.exam_points}</p>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FileText className="w-5 h-5" />
              <span>{examData?.title}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ListChecks className="w-5 h-5" />
              <span>
                {Object.keys(examData?.answers || {}).length} of{" "}
                {examData?.exam_questions?.length} questions answered
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>
                Submitted at: {new Date(examData?.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/lms/student-dashboard/exam" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={`/lms/student-dashboard/exam/${params.examId}/review`}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Review Answers
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
