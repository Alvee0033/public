"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export default function MultipleChoiceImage({
  question,
  answer = "",
  onAnswer,
}) {
  if (!question?.exam_question_details) return null;

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {question.exam_question_details.map((option, index) => (
          <div
            key={index}
            className={cn(
              "relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:opacity-90",
              answer === option.id
                ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onAnswer(option.id)}
          >
            <Image
              src={option.answer_image_url}
              alt={`Option ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      answer === option.id
                        ? "bg-accent-brand border-accent-brand"
                        : "border-white"
                    )}
                  >
                    {answer === option.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-white font-medium">
                    Option {index + 1}
                  </span>
                </div>
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
