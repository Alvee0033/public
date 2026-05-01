"use client";

import Loader from "@/components/shared/Loader";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { instance } from "@/lib/axios";
import { addAnswer } from "@/redux/features/answerSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { examStore } from "../utils/exam-store";
import ExamTimer from "./components/exam-timer";
import SubmitConfirmModal from "./components/submit-confirm-modal";
import ExamHeader from "./exam-header";
import QuestionCard from "./question-card";
import QuestionNavigator from "./question-navigator";

export default function ExamPageContent({ params }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintsVisibility, setHintsVisibility] = useState({});
  const [currentQuestionId, setCurrentQuestionId] = useState(0);

  const dispatch = useDispatch();
  const ans = useSelector((state) => state.answers);

  // Fetch exam data
  const {
    data: examData,
    isLoading,
    error,
  } = useSWR(`/exams/${params.examId}`, async () => {
    try {
      const res = await instance.get(`/exams/${params.examId}`);
      // Ensure we're getting the correct data structure
      const data = res.data?.data;
      if (!data) throw new Error("Invalid exam data");

      return {
        id: data.id,
        title: data.title || "Untitled Exam",
        description: data.description || "",
        duration: data.exam_duration_minutes || 60,
        exam_questions: Array.isArray(data.exam_questions)
          ? data.exam_questions
          : [],
        // Add other necessary fields
      };
    } catch (err) {
      console.error("Error fetching exam:", err);
      throw new Error(err.response?.data?.message || "Failed to load exam");
    }
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Failed to Load Exam
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!examData?.exam_questions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-yellow-600 mb-2">
            No Questions Available
          </h2>
          <p className="text-gray-600">This exam has no questions.</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer) => {
    dispatch(
      addAnswer({
        exam_id: parseInt(params.examId, 10),
        question_id: currentQuestionId,
        answers: Array.isArray(answer)
          ? answer.map((ans) => ({
            id: ans.id,
            ans: ans.title || ans.img || ans.content,
          }))
          : [
            {
              id: answer.id ? answer.id : 0,
              ans: answer.title || answer.img || answer.content || answer.url || answer,
            },
          ],
      })
    );

    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [currentQuestion]: answer,
      };

      // Save progress
      examStore.saveAnswer(params.examId, currentQuestion, answer);
      return newAnswers;
    });
  };

  const prepareSubmissionData = (answers, examQuestions, examId) => {
    // Map answers by question_id for quick lookup
    const answerMap = {};
    answers.forEach((answer) => {
      answerMap[answer.question_id] = answer;
    });

    // Build the payload for all questions
    return examQuestions.map((q) => {
      if (answerMap[q.id]) {
        // Use the provided answer
        return {
          exam_id: examId,
          question_id: q.id,
          answers: answerMap[q.id].answers.map((ans) => ({
            id: ans.id || 0,
            ans: ans.ans || "string",
          })),
        };
      } else {
        // Not attempted
        return {
          exam_id: examId,
          question_id: q.id,
          answers: [
            {
              id: 0,
              ans: "not attempted",
            },
          ],
        };
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const submissionData = prepareSubmissionData(
      ans.answers,
      examData.exam_questions,
      parseInt(params.examId, 10)
    );
    try {
      await instance.post(`/exam-report/submit`, submissionData);
      router.push(`/lms/student-dashboard/exam/${params.examId}/complete`);
      setIsSubmitting(false)
    } catch (error) {
      console.error("Failed to submit exam:", error);
      isSubmitting(false)
    }
  };

  // Toggle hints for current question
  const toggleHints = (questionIndex) => {
    setHintsVisibility((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto p-6 mb-20">
        <ExamHeader
          examData={examData}
          showHints={!!hintsVisibility[currentQuestion]}
          setShowHints={() => toggleHints(currentQuestion)}
          setShowConfirmSubmit={setShowConfirmSubmit}
          currentQuestion={currentQuestion}
          totalAnswered={Object.keys(answers).length}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
        <ExamTimer
          duration={examData?.exam_duration_minutes || 60}
          onTimeUp={() => setShowConfirmSubmit(true)}
        />
        <QuestionCard
          examData={examData}
          currentQuestion={currentQuestion}
          showHints={!!hintsVisibility[currentQuestion]}
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentQuestionId={setCurrentQuestionId}
          totalQuestions={examData?.exam_questions?.length}
        />
        <QuestionNavigator
          total={examData.exam_questions.length}
          current={currentQuestion}
          answered={Object.keys(answers)}
          onChange={setCurrentQuestion}
        />
        {showConfirmSubmit && (
          <SubmitConfirmModal
            examData={examData}
            answers={answers}
            isSubmitting={isSubmitting}
            onCancel={() => setShowConfirmSubmit(false)}
            onConfirm={handleSubmit}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
