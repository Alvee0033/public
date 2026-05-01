"use client";

export default function DragDrop({ question, answer = {}, onAnswer }) {
  if (!question?.exam_question_details) return null;

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const newAnswer = { ...answer, [draggedId]: targetId };
    onAnswer(newAnswer);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Draggable Items */}
        <div className="space-y-4">
          {question.exam_question_details
            .sort((a, b) => a.display_sequence - b.display_sequence)
            .map((option) => (
              <div
                key={option.id}
                draggable
                onDragStart={(e) => handleDragStart(e, option.id)}
                className="p-4 bg-white border-2 border-gray-200 rounded-lg cursor-move"
              >
                {option.answer}
              </div>
            ))}
        </div>

        {/* Drop Zones */}
        <div className="space-y-4">
          {question.exam_question_details
            .sort((a, b) => a.display_sequence - b.display_sequence)
            .map((target) => (
              <div
                key={target.id}
                onDrop={(e) => handleDrop(e, target.id)}
                onDragOver={handleDragOver}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[60px]"
              >
                {answer[target.id] && (
                  <div className="p-2 bg-purple-50 rounded">
                    {
                      question.exam_question_details.find(
                        (opt) => opt.id === answer[target.id]
                      )?.answer
                    }
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
