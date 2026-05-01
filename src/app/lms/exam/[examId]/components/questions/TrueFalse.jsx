'use client';

export default function TrueFalseQuestion({ question, answer, onAnswer }) {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">{question.number}</span>
                </span>
                <h3 className="text-lg font-medium text-gray-900">{question.text}</h3>
            </div>

            <div className="space-y-2 pl-9">
                {['True', 'False'].map((option, index) => (
                    <label
                        key={option}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer
                            ${answer === index ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={index}
                            checked={answer === index}
                            onChange={() => onAnswer(index)}
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-gray-900">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
} 