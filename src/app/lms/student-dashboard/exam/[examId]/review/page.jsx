"use client";

import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { AlertCircle, ArrowLeft, CheckCircle, Home, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ReviewAnswersPage({ params }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportRes = await axios.get(
          `/exam-report/student-answers?examId=${params.examId}`
        );
        setReportData(reportRes.data?.data || null);
      } catch (err) {
        setError(err.message || "Failed to load exam review");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.examId]);

  const downloadPDF = async () => {
    const element = pdfRef.current;
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`exam-review-${params.examId}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Couldn&apos;t load exam review
        </h2>
        <p className="text-gray-500 text-sm mb-2">{error || "Please try again later."}</p>
        <Button asChild>
          <Link href="/lms/student-dashboard" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" ref={pdfRef}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Review Answers
          </h1>
          <div className="flex gap-4">
            {/* <Button onClick={downloadPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button> */}
            <Button asChild variant="outline">
              <Link href={`/lms/student-dashboard/exam/${params.examId}/complete`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Summary
              </Link>
            </Button>
          </div>
        </div>

        {/* Exam Summary */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">{reportData.exam_title}</h2>
          <div className="flex flex-wrap gap-4 text-gray-700">
            <div>Total Questions: <span className="font-semibold">{reportData.total_questions}</span></div>
            <div>Correct: <span className="font-semibold text-green-600">{reportData.total_correct_answers}</span></div>
            <div>Wrong: <span className="font-semibold text-red-600">{reportData.total_wrong_answers}</span></div>
            <div>Points: <span className="font-semibold">{reportData.total_points_earned} / {reportData.maximum_points}</span></div>
            <div>Score: <span className="font-semibold">{reportData.percentage_score}%</span></div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {reportData.question_answers?.map((q, index) => (
            <div
              key={q.question_id + "-" + index}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    Q{index + 1}
                  </span>
                  <span className="text-sm text-gray-500 uppercase">
                    {q.question_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {q.is_correct ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm">
                      <XCircle className="w-4 h-4" />
                      Wrong
                    </span>
                  )}
                </div>
              </div>

              {/* Question Content */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {q.question}
                </h3>
                {/* Show answer explanation if available */}
                {q.answer_explanation && (
                  <div className="text-sm text-blue-700 mb-2">
                    <strong>Explanation:</strong> {q.answer_explanation}
                  </div>
                )}
              </div>

              {/* Submitted Answer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </h4>
                <div className="text-gray-600">
                  {q.student_answers && q.student_answers.length > 0 ? (
                    <div className="whitespace-pre-wrap">
                      {q.student_answers.map((ans, i) => (
                        <span key={i} className="inline-block mr-2">{ans.ans}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      No answer provided
                    </span>
                  )}
                </div>
              </div>

              {/* Actual Answers */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Correct Answer{q.actual_answers.length > 1 ? "s" : ""}:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {q.actual_answers.map((a, i) => (
                    <span
                      key={i}
                      className={`inline-block px-2 py-1 rounded text-sm ${a.is_right_answer
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {a.answer}
                    </span>
                  ))}
                </div>
              </div>

              {/* Question Score */}
              {typeof q.points_earned === "number" && (
                <div className="mt-4 text-sm text-gray-600">
                  Points Earned: {q.points_earned} / {q.question_score}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
