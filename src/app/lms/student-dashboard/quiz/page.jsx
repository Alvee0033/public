"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useMemo } from "react";
import useSWR from "swr";

export default function QuizPage() {
  // Format date function that was missing
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get user from Redux state instead of /me API
  const userData = useAppSelector((state) => state.auth.user);

  // Fetch quiz data using the correct endpoint
  const getQuizzes = async () => {
    if (!userData?.student_id) return [];
    const res = await axios.get("/student-quizzes");
    // Filter quizzes by student_id from /me
    const allQuizzes = res?.data?.data || [];
    return allQuizzes.filter((q) => q.student_id === userData.student_id);
  };

  const {
    data: quizzesData = [],
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useSWR(
    userData?.student_id ? ["student-quizzes", userData.student_id] : null,
    getQuizzes
  );

  const quizzes = useMemo(() => {
    if (!quizzesData || !Array.isArray(quizzesData) || quizzesData.length === 0)
      return [];

    return quizzesData.map((item) => {
      // Get course name (safely) based on response structure
      let courseName = "Course";
      if (typeof item.course === "object" && item.course && item.course.name) {
        courseName = item.course.name;
      } else if (typeof item.course === "string") {
        courseName = item.course;
      }

      // Determine status - this might need to be updated based on actual API structure
      const isCompleted = item.is_completed || false;

      return {
        id: item.id,
        title: item.title || "Untitled Quiz",
        description: item.description || "",
        course: courseName,
        dueDate: formatDate(item.due_date),
        assignDate: formatDate(item.assign_date),
        // For these fields, adjust based on what's actually in the API response
        duration: item.duration_minutes
          ? `${item.duration_minutes} minutes`
          : item.duration
          ? `${item.duration} minutes`
          : "No time limit",
        questions: item.number_of_questions || item.question_count || "N/A",
        status: isCompleted ? "completed" : "pending",
        score: item.score || item.quiz_points || null,
        // Additional fields that might be useful
        studentId: item.student_id,
        courseId: item.course_id,
        lessonId: item.course_lesson_id,
        quizId: item.course_lesson_quiz_id,
        tutorId: item.assigned_by_tutor_id,
        employeeId: item.approved_by_employee_id,
      };
    });
  }, [quizzesData]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E]">
          My Quizzes
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizzesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-3">Loading quizzes...</p>
            </div>
          ) : quizzesError ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg font-medium mb-2">
                Failed to load quizzes
              </div>
              <p className="text-gray-500">Please try again later.</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg font-medium mb-2">
                No quizzes found
              </div>
              <p className="text-gray-500">You don't have any quizzes yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {quiz.course}
                        </p>
                        {quiz.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                      <span className="flex-shrink-0 flex items-center ml-2">
                        {quiz.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mt-4">
                      {quiz.dueDate && quiz.dueDate !== "TBD" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Due Date:
                          </span>
                          <span>{quiz.dueDate}</span>
                        </div>
                      )}

                      {quiz.duration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <span>{quiz.duration}</span>
                        </div>
                      )}

                      {quiz.questions && quiz.questions !== "N/A" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Questions:
                          </span>
                          <span>{quiz.questions}</span>
                        </div>
                      )}

                      {quiz.score !== null && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Score:</span>
                          <span>{quiz.score}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-center">
                      <Button
                        className="hover:scale-105 text-white rounded-l px-3 py-2 w-full border-none sm:py-4"
                        style={{
                          background:
                            "linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)",
                        }}
                        variant={
                          quiz.status === "completed" ? "outline" : "default"
                        }
                      >
                        {quiz.status === "completed"
                          ? "View Results"
                          : "Start Quiz"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
