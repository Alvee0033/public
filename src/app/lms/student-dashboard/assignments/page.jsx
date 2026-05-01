"use client";

import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function Assignments() {
  const router = useRouter();
  const handleView = (id) => {
    const assignment = assignments.find((a) => a.id === id);
    if (!assignment) return;
    if (assignment.Submitted) {
      router.push(`/lms/student-dashboard/assignments/submission?id=${id}`);
    } else {
      router.push(`/lms/student-dashboard/assignments/view?id=${id}`);
    }
  };
  // Get user from Redux state
  const userData = useAppSelector((state) => state.auth.user);

  // Fetch student course assignments filtered by studentId
  const studentId = userData?.student_id;
  const getAssignments = async () => {
    if (!studentId) return [];
    const res = await axios.get(
      `/student-course-assignments?limit=1000&filter={"student": ${studentId}}`
    );
    return res?.data?.data || [];
  };

  const {
    data: assignmentsData = [],
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useSWR(
    studentId ? ["student-course-assignments", studentId] : null,
    getAssignments,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
    }
  );

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatTime = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Map API data to the expected format for the UI
  const assignments = useMemo(() => {
    if (
      !assignmentsData ||
      !Array.isArray(assignmentsData) ||
      assignmentsData.length === 0
    )
      return [];
    return assignmentsData.map((item) => {
      let status = "Not Started";
      if (item.is_completed) status = "Completed";
      else if (item.is_in_progress) status = "In Progress";
      return {
        id: item.id,
        title: item.title || "Untitled Assignment",
        course: item.course?.name || "General",
        dueDate: formatDate(item.due_date),
        dueTime: formatTime(item.due_date),
        status,
        totalScore: item.assignment_points || item.score || 0,
        earnScore: item.earn_score || 0,
        Submitted: item.submission_date || null,
      };
    });
  }, [assignmentsData]);

  // Pagination logic
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(assignments.length / PAGE_SIZE);

  const paginatedAssignments = assignments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Summary stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (a) => a.status === "Completed"
  ).length;
  const totalScore = assignments.reduce(
    (sum, a) => sum + (a.totalScore || 0),
    0
  );
  const totalEarnScore = assignments.reduce(
    (sum, a) => sum + (a.earnScore || 0),
    0
  );

  return (
    <div className="p-1 sm:p-4 md:p-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-2xl md:text-3xl text-gray-800 mb-2">
          Assignments
        </h1>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 mb-3 sm:mb-4">
          <div className="bg-white border rounded-lg px-3 py-3 sm:px-4 sm:py-4 flex flex-col items-start">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              Total Assignments
            </div>
            <div className="text-lg sm:text-2xl font-bold text-blue-700">
              {totalAssignments.toLocaleString()}
            </div>
          </div>
          <div className="bg-white border rounded-lg px-3 py-3 sm:px-4 sm:py-4 flex flex-col items-start">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              Completed
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {completedAssignments.toLocaleString()}
            </div>
          </div>
          <div className="bg-white border rounded-lg px-3 py-3 sm:px-4 sm:py-4 flex flex-col items-start">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              Total Score
            </div>
            <div className="text-lg sm:text-2xl font-bold text-blue-500">
              {totalScore.toLocaleString()}
            </div>
          </div>
          <div className="bg-white border rounded-lg px-3 py-3 sm:px-4 sm:py-4 flex flex-col items-start">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              Total Earn Score
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-500">
              {totalEarnScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-1 sm:p-4 md:p-6">
        <div className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] mb-2">
          Assignments
        </div>
        {assignmentsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-3">Loading assignments...</p>
          </div>
        ) : assignmentsError ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-medium mb-2">
              Failed to load assignments
            </div>
            <p className="text-gray-500">Please try again later.</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg font-medium mb-2">
              No assignments found
            </div>
            <p className="text-gray-500">You don't have any assignments yet.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[520px] sm:min-w-[700px] w-full border-separate border-spacing-y-2 text-[11px] sm:text-sm md:text-base">
              <thead>
                <tr className="text-[10px] sm:text-sm text-gray-500 bg-gray-50">
                  <th className="px-1 sm:px-4 py-2 text-left">Sl.</th>
                  <th className="px-1 sm:px-4 py-2 text-left">Task</th>
                  <th className="px-1 sm:px-4 py-2 text-left">Subject</th>
                  <th className="px-1 sm:px-4 py-2 text-left">
                    Due Date & Time
                  </th>
                  <th className="px-1 sm:px-4 py-2 text-left">Status</th>
                  <th className="px-1 sm:px-4 py-2 text-left">Total Score</th>
                  <th className="px-1 sm:px-4 py-2 text-left">Earn Score</th>
                  <th className="px-1 sm:px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-[11px] sm:text-sm">
                {paginatedAssignments.map((assignment, idx) => (
                  <tr
                    key={assignment.id}
                    className="bg-white hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <td className="px-1 sm:px-4 py-2 font-mono text-gray-500">
                      {String((currentPage - 1) * PAGE_SIZE + idx + 1).padStart(
                        2,
                        "0"
                      )}
                    </td>
                    <td className="px-1 sm:px-4 py-2 font-medium text-gray-900 break-words max-w-[100px] sm:max-w-[180px] md:max-w-[240px]">
                      {assignment.title}
                    </td>
                    <td className="px-1 sm:px-4 py-2 text-blue-600 underline cursor-pointer break-words max-w-[80px] sm:max-w-[140px] md:max-w-[200px]">
                      {assignment.course}
                    </td>
                    <td className="px-1 sm:px-4 py-2">
                      <div>{assignment.dueDate}</div>
                      <div className="text-[10px] sm:text-xs text-gray-400">
                        {assignment.dueTime}
                      </div>
                    </td>
                    <td className="px-1 sm:px-4 py-2">
                      {assignment.status === "Completed" ? (
                        <span className="inline-block px-2 sm:px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold">
                          Completed
                        </span>
                      ) : assignment.status === "In Progress" ? (
                        <span className="inline-block px-2 sm:px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] sm:text-xs font-semibold">
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-block px-2 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-semibold">
                          Not Started
                        </span>
                      )}
                    </td>
                    <td className="px-1 sm:px-4 py-2">
                      {assignment.totalScore}
                    </td>
                    <td className="px-1 sm:px-4 py-2">
                      {assignment.earnScore}
                    </td>
                    <td className="px-1 sm:px-4 py-2 flex gap-1 sm:gap-2 items-center">
                      <button
                        onClick={() => handleView(assignment.id)}
                        className="text-gray-500 hover:text-blue-600"
                        title="View"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination (dynamic) */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
              <div className="text-[10px] sm:text-sm text-gray-500">
                Showing{" "}
                {assignments.length === 0
                  ? 0
                  : (currentPage - 1) * PAGE_SIZE + 1}
                -{Math.min(currentPage * PAGE_SIZE, assignments.length)} from{" "}
                {assignments.length}
              </div>
              <div className="flex gap-1 mt-2 sm:mt-0">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg border text-[10px] sm:text-sm font-medium ${
                        n === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600 border-blue-200"
                      } hover:bg-blue-600 hover:text-white transition`}
                    >
                      {n}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
