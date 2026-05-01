'use client';

import Button from '@/components/shared/buttons/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import axios from '@/lib/axios';
import { CalendarIcon, CheckCircle, CircleIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import useSWR from 'swr';

export default function Page() {
  const { studentId } = useParams();
  const [error, setError] = useState(null);
  // Add states for deletion functionality
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmFor, setShowConfirmFor] = useState(null);

  // Get user data from Redux state instead of /me API
  const userData = useAppSelector((state) => state.auth.user);

  // Extract the student_id from the user data
  const studentIdToUse = userData?.student_id;

  // Fetch learning goals using the student_id
  const {
    data: goalsData = [],
    error: goalsError,
    isLoading: goalsLoading,
    mutate: refreshGoals,
  } = useSWR(
    studentIdToUse ? ['student-learning-goals', studentIdToUse] : null,
    async () => {
      try {
        const res = await axios.get(
          `/student-learning-goals?pagination=true&filter=${JSON.stringify({
            student: studentIdToUse,
          })}`
        );
        return res.data.data;
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch learning goals'
        );
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      onError: (err) => {
        setError(
          err.response?.data?.message || 'Failed to fetch learning goals'
        );
      },
    }
  );

  // Handle API errors
  if (error || goalsError) {
    // Minimal error UI with Lucide AlertCircle icon
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          {/* Lucide AlertCircle icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
          <span className="font-semibold text-base">Something went wrong</span>
        </div>
        <div className="text-sm text-gray-500 text-center max-w-xs">
          {error ||
            goalsError?.message ||
            'An error occurred'}
        </div>
      </div>
    );
  }

  // Show loading state while data is being fetched
  if (!userData) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Function to get color based on progress
  const getProgressColor = (progress) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Function to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Add delete handler
  const handleDelete = async (goalId) => {
    setDeletingId(goalId);
    try {
      await axios.delete(`/student-learning-goals/${goalId}`);
      toast.success('Learning goal deleted successfully.');
      refreshGoals(); // Refresh the goals list
    } catch (err) {
      toast.error('Failed to delete. Please try again.');
      console.error('Error deleting goal:', err);
    } finally {
      setDeletingId(null);
      setShowConfirmFor(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      {/* Header section with responsive design */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-[#5f2ded] bg-clip-text text-transparent">
          {userData?.first_name}&apos;s Learning Goals
        </h1>
        <Link
          href="/lms/student-dashboard/learning-goals/add"
          className="inline-block w-full sm:w-auto"
        >
          <div className="flex items-center justify-center gap-2">
            {/* <svg
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
            </svg> */}
            <Button className=" border-none rounded-md">
              <span>+</span> Add New Learning Goal
            </Button>
          </div>
        </Link>
      </div>

      {/* Goals grid with responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {goalsLoading ? (
          // Loading skeletons with responsive design
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-xl shadow-md p-6"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-full mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
                </div>
              </div>
            ))
        ) : goalsData.length > 0 ? (
          goalsData?.map((goal) => (
            <Card
              key={goal.id}
              className="overflow-hidden rounded-xl shadow-lg border-0 transition-all duration-300 hover:shadow-xl relative"
            >
              {/* Delete button - moved to top-right of card with more spacing */}
              <button
                onClick={() => setShowConfirmFor(goal.id)}
                disabled={deletingId === goal.id}
                className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors z-10"
                title="Delete this goal"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Confirmation Modal - no changes needed */}
              {showConfirmFor === goal.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Delete Learning Goal?
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Are you sure you want to delete this learning goal? This
                      action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowConfirmFor(null)}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        disabled={deletingId === goal.id}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        disabled={deletingId === goal.id}
                      >
                        {deletingId === goal.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <CardHeader className="pb-2">
                {/* Status badge - redesigned layout */}
                <div className="flex flex-col gap-2">
                  {/* Title with more right padding to avoid overlap with delete button */}
                  <div className="flex-1 pr-8">
                    <h2 className="text-xl font-semibold text-gray-800 leading-tight line-clamp-1">
                      {goal.goal_title}
                    </h2>
                  </div>

                  {/* Status badge moved below title */}
                  <span
                    className={`inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      goal.is_achieved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {goal.is_achieved ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <CircleIcon className="w-3 h-3 mr-1" />
                    )}
                    {goal.is_achieved ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                {/* Description with line clamp */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                  {goal.description || ''}
                </p>

                {/* Due date */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                  <span>Due: {formatDate(goal.target_completion_date)}</span>
                </div>

                {/* Progress section */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span
                      className={`font-medium ${
                        goal.progress_percentage >= 75
                          ? 'text-green-600'
                          : goal.progress_percentage >= 50
                          ? 'text-blue-600'
                          : goal.progress_percentage >= 25
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {goal.progress_percentage || 0}%
                    </span>
                  </div>

                  {/* Custom styled progress bar */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(
                        goal.progress_percentage
                      )} transition-all duration-500 rounded-full`}
                      style={{ width: `${goal.progress_percentage || 0}%` }}
                    />
                  </div>
                </div>
              </CardContent>

              {/* <CardFooter className="pt-2 border-t bg-gray-50">
                <div className="flex justify-end items-center w-full">
                  <Link
                    href={`/lms/student-dashboard/learning-goals/${goal.id}`}
                    className="w-full"
                  >
                    <button
                      className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                        goal.is_achieved
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-[#5f2ded] hover:from-blue-700 hover:to-[#4f1ecd] text-white'
                      }`}
                    >
                      {goal.is_achieved ? 'View Details' : 'Continue'}
                    </button>
                  </Link>
                </div>
              </CardFooter> */}
            </Card>
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-center items-center bg-white rounded-xl shadow-md p-10">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              No learning goals yet
            </p>
            <p className="text-gray-500 mb-6 text-center">
              Start by adding your first learning goal to track your progress
            </p>
            <Link href="/lms/student-dashboard/learning-goals/add">
              <button className="bg-gradient-to-r from-blue-600 to-[#5f2ded] text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
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
                Create Learning Goal
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
