"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/lib/axios";
import {
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { SelectValue } from "@radix-ui/react-select";
import { format } from "date-fns";
import {
  CheckCircleIcon,
  Loader2,
} from "lucide-react";
import { Inter, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import ExamPagination from "./components/exam-pagination";
import ExamCard from "./components/ExamCard";
import ExamRulesModal from "./components/ExamRulesModel";
import TakenExamCard from "./components/TakenExamCard";
import { ClipboardList, CheckCircle } from 'lucide-react';

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function StudentExamPage() {
  // States first
  const [showStartModal, setShowStartModal] = useState(null);
  const router = useRouter();
  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [allExams, setAllExams] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [takenExams, setTakenExams] = useState([])


  // Get user from Redux state instead of /me API
  const student = useAppSelector((state) => state.auth.user);

  // useEffect(()=>{
  // },[authToken])

  // Helper functions next
  const getActiveExams = (exams) => {
    const now = new Date();
    return exams.filter((exam) => {
      // First condition: exam is not taken yet
      const notTaken = exam.is_taken === false;

      // Second condition: exam has a future scheduled date if available
      const hasScheduledDate = exam.schedule_exam_date_time !== null;
      const isFutureExam = hasScheduledDate ?
        new Date(exam.schedule_exam_date_time) > now :
        true; // If no date, consider it upcoming

      return notTaken && (hasScheduledDate ? isFutureExam : true);
    });
  };

  const getFilteredExams = (exams, examTypeFilter) => {
    const now = new Date();
    return exams.filter((exam) => {
      // Normalize: prefer exam.exam if present, else exam itself
      const e = exam.exam || exam;
      if (examTypeFilter === "onsite") {
        const startDate = new Date(e?.start_date_time);
        const endDate = new Date(e?.end_date_time);
        return (
          e &&
          (e.remote_or_onsite === false || e.remote_or_onsite === "false") &&
          now >= startDate &&
          now <= endDate
        );
      } else if (examTypeFilter === "remote") {
        return e && (e.remote_or_onsite === true || e.remote_or_onsite === "true");
      } else if (examTypeFilter === "practice") {
        return e && (e.is_Exercise_Practice_Exam === true || e.is_Exercise_Practice_Exam === "true");
      }
      return true;
    });
  };

  const getAvailableExams = (exams) => {
    const now = new Date();
    return exams.filter((exam) => {
      const startDate = new Date(exam.start_date_time);
      const endDate = new Date(exam.end_date_time);
      return now >= startDate && now <= endDate;
    });
  };

  useEffect(() => {
    const fetchExams = async () => {
      if (!student?.student_id) return;
      try {
        setLoading(true);
        const taken = await axios.get(`/exams/taken-exam/${student.id}`);
        const response = await axios.get(`/student-exams?pagination=true&limit=100&is_active=true&is_Game_Or_Exam=false&is_published=true`);
        if (response.data?.status === "SUCCESS") {
          const allExams = response.data.data || [];
          const filteredByStudent = allExams.filter(
            exam =>
              exam.student_id === student.student_id ||
              (exam.student && exam.student.id === student.student_id)
          );
          setAllExams(filteredByStudent);
          // Don't filter by examTypeFilter here!
        }
        if (taken.data?.status === "SUCCESS") {
          setTakenExams(taken.data.data);
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError(err.message || "Failed to load exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [student?.student_id]);

  // Get filtered exams first
  const filteredExams = getFilteredExams(allExams, examTypeFilter);


  // Then paginate the filtered results
  const totalPages = Math.ceil(filteredExams.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageExams = filteredExams.slice(startIndex, endIndex);

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    } catch (err) {
      return "Invalid Date";
    }
  };

  const getExamStatus = (exam) => {
    try {
      const now = new Date()
      const start = exam.exam_started_at ? new Date(exam.exam_started_at) : null
      const end = exam.exam_ended_at ? new Date(exam.exam_ended_at) : null

      if (exam.is_taken) return { label: "Completed", class: "bg-green-100 text-green-800" }
      if (!start || !end) return { label: "Unknown", class: "bg-gray-100 text-gray-800" }
      if (now < start) return { label: "Upcoming", class: "bg-yellow-100 text-yellow-800" }
      if (now >= start && now <= end) return { label: "Available", class: "bg-blue-100 text-blue-800" }
      if (now > end && !exam.is_taken) return { label: "Expired", class: "bg-red-100 text-red-800" }
      return { label: "Unknown", class: "bg-gray-100 text-gray-800" }
    } catch (err) {
      return { label: "Unknown", class: "bg-gray-100 text-gray-800" }
    }
  };

  const calculateRemainingTime = (examDate) => {
    try {
      const diff = new Date(examDate) - new Date();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return `${days} days`;
      }
      return `${hours} hours`;
    } catch (err) {
      return "Unknown";
    }
  };

  const getScoreColor = (score) => {
    try {
      const numScore = Number(score);
      if (numScore >= 90) return "text-green-600";
      if (numScore >= 75) return "text-blue-600";
      if (numScore >= 60) return "text-yellow-600";
      return "text-red-600";
    } catch (err) {
      return "text-gray-600";
    }
  };

  const getAverageScore = () => {
    try {
      // Filter for completed (taken) exams with valid points
      const completedExams = allExams.filter(exam =>
        exam.is_taken === true &&
        (exam.exam_points !== null && exam.exam_points !== undefined)
      );

      if (!completedExams || completedExams.length === 0) return 0;

      // Calculate total points
      const totalPoints = completedExams.reduce((sum, exam) => {
        return sum + Number(exam.exam_points || 0);
      }, 0);

      // Return the average, rounded to nearest integer
      return Math.round(totalPoints / completedExams.length);
    } catch (err) {
      console.error("Error calculating average score:", err);
      return 0;
    }
  };

  const canStartExam = (exam) => {
    const now = new Date();
    if (exam?.flexible_timing) {
      return now <= new Date(exam?.due_date);
    }
    const scheduleTime = new Date(exam?.start_date_time);
    const dueTime = new Date(exam?.due_date);
    return now >= scheduleTime && now <= dueTime;
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }


  return (
    <div className={`w-full p-6 bg-gray-50 min-h-screen`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-2" />,
            title: "Total Exams",
            value: allExams.length,
            valueColor: "text-gray-800", // Changed from text-gray-900
          },
          {
            icon: <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />,
            title: "Upcoming",
            value: getActiveExams(allExams).length,
            valueColor: "text-gray-800", // Changed from text-purple-600
          },
          {
            icon: <CheckCircleIcon className="h-5 w-5 text-gray-600 mr-2" />,
            title: "Completed",
            value: allExams.filter(exam => exam.is_taken === true).length,
            valueColor: "text-gray-800", // Changed from text-green-600
          },
          {
            icon: <ChartBarIcon className="h-5 w-5 text-gray-600 mr-2" />,
            title: "Average Score",
            value: `${getAverageScore()}%`,
            valueColor: "text-gray-800", // Changed from dynamic color
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-center items-start h-full">
            <div className="flex items-center">
              {stat.icon}
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            </div>
            <p className={`text-2xl font-bold mt-2 ${stat.valueColor}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="h-14 bg-white rounded-lg shadow flex gap-2 my-10 p-1 border border-gray-200">
          <TabsTrigger
            value="active"
            className="flex items-center gap-2 text-base px-6 py-2 font-semibold rounded-md transition-all duration-200
      text-gray-800
      hover:bg-primaryColor hover:text-white
      data-[state=active]:bg-primaryColor data-[state=active]:text-white
      focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
          >
            <ClipboardList className="w-5 h-5" />
            Active Exams
          </TabsTrigger>
          <TabsTrigger
            value="taken"
            className="flex items-center gap-2 text-base px-6 py-2 font-semibold rounded-md transition-all duration-200
      text-gray-800
      hover:bg-secondaryColor hover:text-white
      data-[state=active]:bg-secondaryColor data-[state=active]:text-white
      focus:ring-2 focus:ring-secondaryColor focus:ring-offset-2"
          >
            <CheckCircle className="w-5 h-5" />
            Taken Exams
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`${poppins.className} text-2xl font-bold text-gray-800`}
              >
                Active Exams
              </h2>
              <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                <SelectTrigger className="w-[180px] bg-gray-100 hover:bg-primaryColor hover:text-white transition-all duration-300 ease-in-out shadow-md focus:ring-2 focus:ring-primaryColor focus:ring-offset-2">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-primaryColor hover:text-white data-[state=checked]:bg-primaryColor data-[state=checked]:text-white transition-colors"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    value="remote"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-secondaryColor hover:text-white data-[state=checked]:bg-secondaryColor data-[state=checked]:text-white transition-colors"
                  >
                    Remote
                  </SelectItem>
                  <SelectItem
                    value="onsite"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-primaryColor hover:text-white data-[state=checked]:bg-primaryColor data-[state=checked]:text-white transition-colors"
                  >
                    On-site
                  </SelectItem>
                  <SelectItem
                    value="practice"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-secondaryColor hover:text-white data-[state=checked]:bg-secondaryColor data-[state=checked]:text-white transition-colors"
                  >
                    Practice
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exam Cards */}
            <div className="grid grid-cols-1 gap-4">
              {currentPageExams
                .filter(
                  exam =>
                    (exam.student_id === student?.student_id ||
                      exam.student?.id === student?.student_id) &&
                    exam.is_taken === false // Only show not taken
                )
                .map((exam, key) => (
                  <ExamCard exam={exam} key={key} setShowStartModal={setShowStartModal} />
                ))}
            </div>

            {/* Empty State */}
            {currentPageExams.filter(
              exam =>
                (exam.student_id === student?.student_id ||
                  exam.student?.id === student?.student_id) &&
                exam.is_taken === false
            ).length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500">No exams available</p>
                </div>
              )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 border-t pt-8">
                <div className="flex flex-col items-center gap-4">
                  <ExamPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredExams.length)} of{" "}
                    {filteredExams.length} exams
                  </p>
                </div>
              </div>
            )}
          </section>
        </TabsContent>
        <TabsContent value="taken">
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`${poppins.className} text-2xl font-bold text-gray-800`}
              >
                Taken Exams
              </h2>
              <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                <SelectTrigger className="w-[180px] bg-gray-100 hover:bg-primaryColor hover:text-white transition-all duration-300 ease-in-out shadow-md focus:ring-2 focus:ring-primaryColor focus:ring-offset-2">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-primaryColor hover:text-white data-[state=checked]:bg-primaryColor data-[state=checked]:text-white transition-colors"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    value="remote"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-secondaryColor hover:text-white data-[state=checked]:bg-secondaryColor data-[state=checked]:text-white transition-colors"
                  >
                    Remote
                  </SelectItem>
                  <SelectItem
                    value="onsite"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-primaryColor hover:text-white data-[state=checked]:bg-primaryColor data-[state=checked]:text-white transition-colors"
                  >
                    On-site
                  </SelectItem>
                  <SelectItem
                    value="practice"
                    className="px-4 py-2 rounded-md cursor-pointer text-gray-800 hover:bg-secondaryColor hover:text-white data-[state=checked]:bg-secondaryColor data-[state=checked]:text-white transition-colors"
                  >
                    Practice
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exam Cards */}
            <div className="grid grid-cols-1 gap-4">
              {currentPageExams
                .filter(
                  exam =>
                    (exam.student_id === student?.student_id ||
                      exam.student?.id === student?.student_id) &&
                    exam.is_taken === true // Only show taken
                )
                .map((exam, key) => (
                  <TakenExamCard exam={exam} key={key} setShowStartModal={setShowStartModal} />
                ))}
            </div>

            {/* Empty State */}
            {currentPageExams.filter(
              exam =>
                (exam.student_id === student?.student_id ||
                  exam.student?.id === student?.student_id) &&
                exam.is_taken === true
            ).length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500">No exams available</p>
                </div>
              )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 border-t pt-8">
                <div className="flex flex-col items-center gap-4">
                  <ExamPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredExams.length)} of{" "}
                    {filteredExams.length} exams
                  </p>
                </div>
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>

      {/* Active Exams */}


      {/* Start Exam Modal */}
      {showStartModal && (
        <ExamRulesModal
          onClose={() => setShowStartModal(false)}
          showStartModal={showStartModal}
        />
      )}

      {/* Loading State */}
      {isPageLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      )}
    </div>
  );
}
