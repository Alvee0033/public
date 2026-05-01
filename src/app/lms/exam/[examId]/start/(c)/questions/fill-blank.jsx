"use client";

export default function FillBlank({ question, answer = "", onAnswer }) {
  if (!question?.exam_question_details) return null;

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={answer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
