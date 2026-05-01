"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export default function MultipleImagesMultiple({
  question,
  answer = [],
  onAnswer,
}) {
  if (!question?.exam_question_details) return null;

  const toggleOption = (option) => {
    const newAnswer = answer.some((a) => a.id === option.id)
      ? answer.filter((a) => a.id !== option.id)
      : [...answer, { img: option.answer_image_link, id: option.id }];

    onAnswer(newAnswer);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {question.exam_question_details.map((option, index) => (
          <div
            key={index}
            className={cn(
              "group relative rounded-xl overflow-hidden cursor-pointer transition-all",
              answer.some((a) => a.id === option.id)
                ? "ring-2 ring-purple-600 ring-offset-2"
                : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
            )}
            onClick={() => toggleOption(option)}
          >
            <div className="relative w-full" style={{ height: "400px" }}>
              <Image
                src={option.answer_image_link}
                alt={option.answer || `Option ${index + 1}`}
                fill
                className="object-contain bg-white"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 group-hover:opacity-100 transition-opacity">
              <div className="w-full p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                      answer.some((a) => a.id === option.id)
                        ? "bg-accent-brand border-accent-brand"
                        : "border-white group-hover:border-purple-200"
                    )}
                  >
                    {answer.some((a) => a.id === option.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white font-medium">
                    {option.answer || `Option ${index + 1}`}
                  </span>
                </div>
                {answer.some((a) => a.id === option.id) && option.answer_hints && (
                  <p className="mt-2 text-white/90 text-sm">
                    Hint: {option.answer_hints}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
