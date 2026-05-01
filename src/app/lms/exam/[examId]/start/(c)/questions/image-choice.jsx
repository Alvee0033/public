"use client";

export default function ImageChoice({ question, answer, onAnswer }) {
  if (!question?.exam_question_details) return null;
  const handleAnswerChange = (option) => {
    onAnswer({ img: option.answer_image_link, id: option.id });
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.exam_question_details
          .sort((a, b) => a.display_sequence - b.display_sequence)
          .map((option) => (
            <label
              key={option.id}
              className={`relative flex flex-col cursor-pointer rounded-lg overflow-hidden
                ${
                  Number(answer) === option.id
                    ? "ring-2 ring-purple-600"
                    : "ring-1 ring-gray-200 hover:ring-gray-300"
                }`}
            >
              {option.answer_image_link && (
                <img
                  src={option.answer_image_link}
                  alt={option.answer}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 bg-white">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={answer?.id === option.id}
                  onChange={() => handleAnswerChange(option)}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="ml-3 text-gray-700">{option.answer}</span>
              </div>
            </label>
          ))}
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
