"use client";
import axios from "@/lib/axios";
import {
  AcademicCapIcon,
  ArrowRightCircleIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Inter, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function ExamListPage() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
      
        const response = await axios.get("/exams");
        

        if (!response.data) {
          throw new Error("No data received");
        }
        const examsData = response.data?.data;
    
        setExams(examsData);
      } catch (err) {
        console.error("Error details:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
        });
        setError(
          err?.response?.data?.message || err?.message || "Failed to load exams"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    } catch (err) {
      return "Invalid Date";
    }
  };

  const handleStartExam = (examId) => {
    router.push(`/exam/${examId}/questions`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-gray-600">Loading exams...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <DocumentTextIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Exams
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`${poppins.className} text-2xl font-bold text-gray-900 mb-2`}
          >
            Available Exams
          </h1>
          <p className={`${inter.className} text-gray-600`}>
            Select an exam to start or view details
          </p>
        </div>

        {/* Exams Grid */}
        <div className="grid gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl shadow-sm p-6 relative border-l-4 border-purple-500"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  {/* Exam Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <h2
                      className={`${poppins.className} text-xl font-semibold text-gray-900`}
                    >
                      {exam.title}
                    </h2>
                    <span className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                      {exam.exam_code}
                    </span>
                  </div>

                  {/* Exam Description */}
                  <p className={`${inter.className} text-gray-600 mb-4`}>
                    {exam.description?.replace(/<[^>]*>/g, "")}
                  </p>

                  {/* Exam Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Duration: {exam.exam_duration_minutes} Minutes
                      </span>
                    </div>

                    {/* Questions */}
                    <div className="flex items-center gap-2">
                      <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Questions: {exam.total_questions_to_appear}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2">
                      <ChartBarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Pass Score: {exam.passing_score}/{exam.total_score}
                      </span>
                    </div>

                    {/* Location Type */}
                    <div className="flex items-center gap-2">
                      {exam.remote_or_onsite ? (
                        <ComputerDesktopIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">
                        {exam.remote_or_onsite ? "Remote Exam" : "On-site Exam"}
                      </span>
                    </div>

                    {/* Location (if onsite) */}
                    {!exam.remote_or_onsite &&
                      exam.onsite_exam_location_address && (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {exam.onsite_exam_location_address}
                          </span>
                        </div>
                      )}

                    {/* Time Window */}
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDateTime(exam.start_date_time)} -{" "}
                        {formatDateTime(exam.end_date_time)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="absolute top-6 right-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  Start Exam
                  <ArrowRightCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {exams.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3
                className={`${poppins.className} text-lg font-medium text-gray-900 mb-2`}
              >
                No Exams Available
              </h3>
              <p className="text-gray-600">
                There are currently no exams available for you to take.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
