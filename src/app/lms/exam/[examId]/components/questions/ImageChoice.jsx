"use client";
import Image from "next/image";
import BaseQuestion from "./BaseQuestion";

export default function ImageChoice({ question, answer, onAnswer }) {
  return (
    <BaseQuestion number={question.number} text={question.text}>
      <div className="space-y-4">
        {/* Main Question Image */}
        {question?.image && (
          <div className="relative w-full h-64 mb-6">
            <Image
              src={question.image}
              alt="Question"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}

        {/* Image Options */}
        <div className="grid grid-cols-2 gap-4">
          {question?.options?.map((imageUrl, index) => (
            <label
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden
                                ${
                                  answer === index
                                    ? "ring-4 ring-purple-500"
                                    : "ring-1 ring-gray-200"
                                }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                checked={answer === index}
                onChange={() => onAnswer(index)}
                className="sr-only"
              />
              <div className="relative w-full h-48">
                <Image
                  src={imageUrl}
                  alt={`Option ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center
                                ${
                                  answer === index
                                    ? "bg-purple-500 bg-opacity-20"
                                    : "hover:bg-gray-500 hover:bg-opacity-10"
                                }`}
              >
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </BaseQuestion>
  );
}
