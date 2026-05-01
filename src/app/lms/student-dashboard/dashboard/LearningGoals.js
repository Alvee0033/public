"use client";
import Button from "@/components/shared/buttons/Button";
import axios from "@/lib/axios";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { useAppSelector } from "@/redux/hooks";

function GoalCard({ goal, grades, onDelete }) {
  // Get grade name from grade ID
  const getGradeName = (gradeId) => {
    if (!gradeId || !grades || grades.length === 0) return "Not specified";

    const grade = grades.find((g) => g.id === gradeId);
    return grade ? grade.grade_level : "Not specified";
  };

  const gradeId = goal.master_k12_grade_id;
  const hasGrade = gradeId !== null && gradeId !== undefined;

  const progressPercentage = goal.progress_percentage || 0;

  // Get appropriate color based on progress
  const getProgressColor = () => {
    if (progressPercentage < 25) return "bg-[var(--secondaryColor)]";
    if (progressPercentage < 50) return "bg-yellow-500";
    if (progressPercentage < 75) return "bg-[var(--primaryColor)]/70";
    return "bg-[var(--primaryColor)]";
  };

  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/student-learning-goals/${goal.id}`);
      toast.success("Learning goal deleted successfully.");
      if (onDelete) onDelete(goal.id);
    } catch (err) {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[var(--primaryColor)]/5 to-[var(--secondaryColor)]/10 rounded-lg border border-[var(--primaryColor)]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        {/* Header section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-[var(--primaryColor)] font-semibold text-lg">
                {goal.goal_title}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  goal.is_achieved
                    ? "bg-[var(--primaryColor)]/10 text-[var(--primaryColor)] border border-[var(--primaryColor)]/30"
                    : "bg-[var(--secondaryColor)]/10 text-[var(--secondaryColor)] border border-[var(--secondaryColor)]/30"
                }`}
              >
                {goal.is_achieved ? "✓ Completed" : "● Open"}
              </span>
            </div>
          </div>
          {/* Delete Button */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="ml-2 text-[var(--secondaryColor)] hover:text-[var(--primaryColor)] text-xs border border-[var(--secondaryColor)]/20 bg-[var(--secondaryColor)]/10 rounded px-2 py-1 transition disabled:opacity-50"
            title="Delete this goal"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
              <h4 className="font-semibold text-gray-900 mb-2">
                Delete Learning Goal?
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to delete this learning goal? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details section */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {goal.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-xs text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">Grade:</span>
              <span
                className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-md ${
                  hasGrade
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "bg-gray-50 text-gray-600 border border-gray-100"
                } text-xs font-medium`}
              >
                {hasGrade ? getGradeName(gradeId) : "Not specified"}
              </span>
            </div>

            <div className="flex items-center text-xs text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">Due:</span>
              <span className="ml-1">
                {goal.target_completion_date
                  ? new Date(goal.target_completion_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>

          {goal.course && (
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-medium">Course:</span>
              <span className="ml-1 truncate">{goal.course.name}</span>
            </div>
          )}
        </div>

        {/* Progress section */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
            <span className="text-[var(--primaryColor)]">Progress</span>
            <span
              className={`${
                progressPercentage >= 50
                  ? "text-[var(--primaryColor)]"
                  : "text-[var(--secondaryColor)]"
              }`}
            >
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-300 rounded-full`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearningGoals() {
  const [error, setError] = useState(null);
  const [localGoals, setLocalGoals] = useState(null);

  // Fetch K12 grades
  const { data: k12Grades = [], isLoading: isLoadingGrades } = useSWR(
    "/master-k12-grades",
    async () => {
      try {
        const response = await axios.get("/master-k12-grades");
        return response.data.data;
      } catch (error) {
        return [];
      }
    }
  );

  // Get user data from Redux state
  const userData = useAppSelector((state) => state.auth.user);

  // Fetch learning goals using student_id from userData
  const {
    data: goalsData = [],
    error: goalsError,
    isLoading: goalsLoading,
  } = useSWR(
    userData?.student_id
      ? ["student-learning-goals", userData.student_id]
      : null,
    async () => {
      try {
        const res = await axios.get(
          `/student-learning-goals?limit=4&filter=${JSON.stringify({
            student: userData.student_id,
          })}`
        );
        return res.data.data;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch learning goals"
        );
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      onError: (err) => {
        setError(
          err.response?.data?.message || "Failed to fetch learning goals"
        );
      },
    }
  );

  // Count open goals
  const openGoalsCount = goalsData.filter((goal) => !goal.is_achieved).length;

  // Determine if all data is loading
  const isAllDataLoading = goalsLoading || isLoadingGrades;

  // Use local state for goals if any deletion happens, otherwise use SWR data
  const goals = localGoals !== null ? localGoals : goalsData;

  // Handler to remove a goal from the list after deletion
  const handleDeleteGoal = (id) => {
    setLocalGoals((prev) => (prev || goalsData).filter((g) => g.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[var(--primaryColor)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <h2 className="text-[var(--primaryColor)] font-bold">
            MY LEARNING GOALS {openGoalsCount > 0 ? `- ${openGoalsCount}` : ""}
          </h2>
        </div>
        <div className="flex items-center">
          <Link href="/lms/student-dashboard/learning-goals/add">
            <Button
              className="inline-flex items-center gap-2 
      px-2 py-1 text-sm
      md:px-4 md:py-2 md:text-base
      bg-[var(--secondaryColor)] text-white rounded-md transition-colors duration-200 border-none hover:bg-[var(--primaryColor)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New
            </Button>
          </Link>
        </div>
      </div>

      {error || goalsError ? (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {error || goalsError?.message || "Failed to fetch learning goals"}
          </span>
        </div>
      ) : isAllDataLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              grades={k12Grades}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No learning goals set yet.</p>
          <p className="text-gray-400 mt-2">
            Click &quot;New Learning Goal&quot; or &quot;Add from template&quot;
            to get started.
          </p>
        </div>
      )}
    </div>
  );
}
