"use client";

export default function WriteDescriptive({ question, answer = "", onAnswer }) {
  if (!question?.exam_question_details) return null;

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="space-y-4">
        <textarea
          value={answer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Write your detailed answer here..."
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          rows={8}
        />
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
