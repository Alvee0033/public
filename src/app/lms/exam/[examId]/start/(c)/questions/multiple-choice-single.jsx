"use client";

export default function MultipleChoiceSingle({ question, answer, onAnswer }) {
  if (!question?.exam_question_details) return null;

  const handleAnswerChange = (option) => {
    onAnswer({ title: option.answer, id: option.id });
  }

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {question.exam_question_details
          .sort((a, b) => a.display_sequence - b.display_sequence)
          .map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors
                ${
                  Number(answer) === option.id
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
              <div className="ml-3 flex-grow">
                <span className="text-gray-700">{option.answer}</span>

                {/* Answer Image if exists */}
                {option.answer_image_link && (
                  <img
                    src={option.answer_image_link}
                    alt={option.answer}
                    className="mt-2 max-h-40 rounded-md"
                  />
                )}

                {/* Hints - Only show if selected */}
                {Number(answer) === option.id && option.answer_hints && (
                  <p className="mt-2 text-sm text-gray-600">
                    Hint: {option.answer_hints}
                  </p>
                )}
              </div>
            </label>
          ))}
      </div>

      {/* Question Score */}
      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
