"use client";

import Loader from "@/components/shared/Loader";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import axios from "@/lib/axios";
import { addAnswer } from "@/redux/features/answerSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { preTestStore } from "../utils/pre-test-store";
import ExamTimer from "./components/exam-timer";
import SubmitConfirmModal from "./components/submit-confirm-modal";
import PreTestHeader from "./pre-test-header";
import QuestionCard from "./question-card";
import QuestionNavigator from "./question-navigator";

export default function PreTestPageContent({ params }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintsVisibility, setHintsVisibility] = useState({});
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [examStartTime] = useState(new Date());

  const dispatch = useDispatch();
  const ans = useSelector((state) => state.answers);
  const userId = useSelector((state) => state.user.userId);

  // Fetch pre-test data
  const {
    data: examData,
    isLoading,
    error,
  } = useSWR(`/course-exams/pre-test-${params.courseId}`, async () => {
    try {
      // Fetch course-exams/pre-test with filter
      const response = await axios.get(
        `/course-exams/pre-test?filter=${JSON.stringify({ course: parseInt(params.courseId) })}`
      );

      if (response.data?.status === "SUCCESS" && response.data?.data?.length > 0) {
        const preTest = response.data.data[0];

        // Check if we have an exam_id to fetch the full exam details
        if (preTest.exam_id || preTest.exam?.id) {
          const examId = preTest.exam_id || preTest.exam.id;

          // Fetch the complete exam with questions
          const examResponse = await axios.get(`/exams/${examId}`);

          if (examResponse.data?.data) {
            const fullExamData = examResponse.data.data;

            // Fetch question details for each question
            const questionsWithDetails = await Promise.all(
              (fullExamData.exam_questions || []).map(async (question) => {
                try {
                  // Fetch question details for this question
                  const detailsResponse = await axios.get(
                    `/exam-question-details?filter=${JSON.stringify({ exam_question: question.id })}`
                  );
                  
                  return {
                    ...question,
                    exam_question_details: detailsResponse.data?.data || [],
                  };
                } catch (err) {
                  console.error(`Error fetching details for question ${question.id}:`, err);
                  // Return question without details if fetch fails
                  return {
                    ...question,
                    exam_question_details: [],
                  };
                }
              })
            );

            return {
              id: fullExamData.id,
              title: preTest.title || fullExamData.title || "Pre-Test",
              description: preTest.description || fullExamData.description || "",
              exam_duration_minutes: fullExamData.exam_duration_minutes || 60,
              exam_questions: questionsWithDetails,
              total_score: fullExamData.total_score,
              passing_score: fullExamData.passing_score,
            };
          } else {
            throw new Error("Failed to fetch exam details");
          }
        } else {
          throw new Error("No exam ID found for this pre-test");
        }
      } else {
        throw new Error("No pre-test found for this course");
      }
    } catch (err) {
      console.error("Error fetching pre-test:", err);
      throw new Error(err.response?.data?.message || err.message || "Failed to load pre-test");
    }
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Failed to Load Pre-Test
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
          <p className="text-gray-600">This pre-test has no questions.</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer) => {
    dispatch(
      addAnswer({
        exam_id: parseInt(examData.id, 10),
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
      preTestStore.saveAnswer(params.courseId, currentQuestion, answer);
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate exam duration in minutes
    const examEndTime = new Date();
    const durationInMinutes = Math.round((examEndTime - examStartTime) / 1000 / 60);
    
    // Map answers by question_id for quick lookup
    const answerMap = {};
    ans.answers.forEach((answer) => {
      answerMap[answer.question_id] = answer;
    });
    
    // Calculate statistics
    let numberOfCorrectAnswers = 0;
    let totalObtainedMarks = 0;
    const numberOfQuestionsAnswered = Object.keys(answers).length;
    
    // Build detailed exam report with question-by-question results
    const detailedReport = examData.exam_questions.map((question) => {
      const studentAnswer = answerMap[question.id];
      const isAnswered = !!studentAnswer && 
                        studentAnswer.answers.length > 0 && 
                        studentAnswer.answers[0].ans !== "not attempted";
      
      let isCorrect = false;
      let marksObtained = 0;
      
      if (isAnswered && question.exam_question_details?.length > 0) {
        // Get the correct answer(s) from exam_question_details
        const correctAnswers = question.exam_question_details
          .filter(detail => detail.is_correct)
          .map(detail => detail.id);
        
        // Check if student's answer is correct
        const studentAnswerIds = studentAnswer.answers.map(ans => ans.id);
        
        // For multiple choice questions, check if all correct answers are selected
        if (correctAnswers.length > 0) {
          isCorrect = correctAnswers.length === studentAnswerIds.length &&
                      correctAnswers.every(id => studentAnswerIds.includes(id));
          
          if (isCorrect) {
            numberOfCorrectAnswers++;
            marksObtained = question.question_marks || 0;
            totalObtainedMarks += marksObtained;
          }
        }
      }
      
      return {
        question_id: question.id,
        question_text: question.question_title || question.question || "",
        student_answer: isAnswered ? studentAnswer.answers.map(a => a.ans).join(", ") : "Not attempted",
        is_correct: isCorrect,
        marks_obtained: marksObtained,
        total_marks: question.question_marks || 0
      };
    });
    
    // Calculate exam score percentage
    const totalMarks = examData.total_score || 
                       examData.exam_questions.reduce((sum, q) => sum + (q.question_marks || 0), 0);
    const examScore = totalMarks > 0 ? Math.round((totalObtainedMarks / totalMarks) * 100) : 0;
    
    // Prepare submission data for /student-exam-results
    const submissionData = {
      exam_date_time: examStartTime.toISOString(),
      student_number_of_correct_answers: numberOfCorrectAnswers,
      student_number_of_questions_answered: numberOfQuestionsAnswered,
      exam_score: examScore,
      student_exam_duration: durationInMinutes,
      total_obtained_marks: totalObtainedMarks.toString(),
      student_exam_report: JSON.stringify(detailedReport),
      student: userId || 0,
      student_exam: parseInt(examData.id, 10),
      graded_by_tutor: 0,
      student_exam_details_course_recommendations: []
    };
    
    try {
      await axios.post(`/student-exam-results`, submissionData);
      router.push(`/lms/student-dashboard/course-player/${params.courseId}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Failed to submit pre-test:", error);
      alert("Failed to submit exam. Please try again.");
      setIsSubmitting(false);
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
        <PreTestHeader
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
