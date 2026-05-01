'use client';
import BaseQuestion from './BaseQuestion';

export default function FillBlank({ question, answer = '', onAnswer }) {
    return (
        <BaseQuestion number={question.number} text={question.text}>
            <div className="mt-4">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => onAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                />
            </div>
        </BaseQuestion>
    );
} 