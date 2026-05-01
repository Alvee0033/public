'use client';
import Image from 'next/image';
import { useState } from 'react';
import BaseQuestion from './BaseQuestion';

export default function HotspotQuestion({ question, answer, onAnswer }) {
    const [showFeedback, setShowFeedback] = useState(false);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const isCorrect = isInCorrectArea(x, y, question.correctArea);
        onAnswer({ x, y, isCorrect });
        setShowFeedback(true);

        setTimeout(() => setShowFeedback(false), 1500);
    };

    const isInCorrectArea = (x, y, area) => {
        return x >= area.x &&
            x <= (area.x + area.width) &&
            y >= area.y &&
            y <= (area.y + area.height);
    };

    return (
        <BaseQuestion number={question.number} text={question.text}>
            <div className="space-y-4">
                <div
                    className="relative w-full h-[400px] cursor-pointer"
                    onClick={handleClick}
                >
                    <Image
                        src={question.image}
                        alt="Hotspot Question"
                        fill
                        className="object-contain rounded-lg"
                    />
                    {answer && (
                        <div
                            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 
                                ${answer.isCorrect ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`}
                            style={{ left: answer.x, top: answer.y }}
                        />
                    )}
                    {showFeedback && (
                        <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-white
                            ${answer?.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                            {answer?.isCorrect ? 'Correct!' : 'Try again'}
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-500">
                    Click on the image to select your answer
                </p>
            </div>
        </BaseQuestion>
    );
} 