"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export default function MultipleChoiceMultiple({
  question,
  answer = [],
  onAnswer,
}) {
  if (!question?.exam_question_details) return null;

  const toggleOption = (option) => {
    const newAnswer = answer.some((a) => a.id === option.id)
      ? answer.filter((a) => a.id !== option.id)
      : [...answer, { title: option.answer, id: option.id }];
  
    onAnswer(newAnswer);
  };
  

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {question.exam_question_details.map((option, index) => (
          <div key={option.id}>
            <label className="flex items-center gap-2 ">
              <input
                type="checkbox"
                checked={answer.some((a) => a.id === option.id)}
                onChange={() => toggleOption(option)}
                className="form-checkbox h-5 w-5 text-purple-600"/>

                <span className="text-gray-700">{option.answer}</span>
            </label>

            {Number(answer) === option.id && option.answer_hints && (
                  <p className="mt-2 text-sm text-gray-600">
                    Hint: {option.answer_hints}
                  </p>
                )}

         </div>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
