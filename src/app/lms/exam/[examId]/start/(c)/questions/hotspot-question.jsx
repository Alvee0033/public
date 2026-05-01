"use client";

export default function HotspotQuestion({ question, answer = [], onAnswer }) {
  if (!question?.exam_question_details) return null;

  const handleClick = (x, y) => {
    // Add the clicked coordinates to the answer array
    const newCoordinate = { x, y };
    onAnswer([...answer, newCoordinate]);
  };

  const removeCoordinate = (index) => {
    const newAnswer = answer.filter((_, i) => i !== index);
    onAnswer(newAnswer);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="space-y-4">
        {/* Image with clickable areas */}
        <div className="relative">
          {question.answer_image_link && (
            <img
              src={question.answer_image_link}
              alt={question.question}
              className="w-full rounded-lg"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                handleClick(x, y);
              }}
            />
          )}

          {/* Show markers for clicked points */}
          {answer.map((point, index) => (
            <div
              key={index}
              className="absolute w-6 h-6 -ml-3 -mt-3 bg-purple-500 rounded-full opacity-50 cursor-pointer"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={() => removeCoordinate(index)}
            />
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
