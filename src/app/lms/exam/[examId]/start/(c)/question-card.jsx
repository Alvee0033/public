"use client";

import { HelpCircle } from "lucide-react";
import { Inter } from "next/font/google";
import { renderQuestion } from "../utils/render-question";
import { use } from "react";
import { useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function QuestionCard({
  examData,
  currentQuestion,
  showHints,
  answers,
  handleAnswer,
  totalQuestions,
  setCurrentQuestionId,
}) {

  const question = examData?.exam_questions?.[currentQuestion];

  useEffect(() => {
    setCurrentQuestionId(question.id);
  }, [question.id, setCurrentQuestionId]);
  if (!question) {return null}



  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          {showHints && question.answer_hints && (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">{question.answer_hints}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {renderQuestion(question, currentQuestion, answers, handleAnswer)}
      </div>

      {/* Show hints at bottom if available */}
      {showHints && question.answer_explanation && (
        <div className="px-6 pb-6">
          <div className="flex items-start gap-2 text-gray-600 bg-purple-50 p-4 rounded-lg">
            <HelpCircle className="w-5 h-5 mt-0.5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900 mb-1">Explanation:</p>
              <p className="text-sm">{question.answer_explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
