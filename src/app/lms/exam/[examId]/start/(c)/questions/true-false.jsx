"use client";

export default function TrueFalse({ question, answer, onAnswer }) {
  if (!question?.exam_question_details) return null;

  const handleAnswerChange = (option) => {
    onAnswer({ title: option.label, id: option.id });
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="space-y-4">
        {[
          { id: 1, value: true, label: "True" },
          { id: 0, value: false, label: "False" },
        ].map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors
              ${
                Number(answer?.id) === option.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={answer?.id === option.id}
              onChange={() => handleAnswerChange(option)}
              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
