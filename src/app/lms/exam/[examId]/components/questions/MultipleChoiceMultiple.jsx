'use client';
import BaseQuestion from './BaseQuestion';

export default function MultipleChoiceMultiple({ question, answer = [], onAnswer }) {
    const handleChange = (index) => {
        const newAnswer = answer.includes(index)
            ? answer.filter(i => i !== index)
            : [...answer, index];
        onAnswer(newAnswer);
    };

    return (
        <BaseQuestion number={question.number} text={question.text}>
            <div className="space-y-2">
                {question.options.map((option, index) => (
                    <label
                        key={index}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${answer.includes(index)
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <input
                            type="checkbox"
                            name={`question-${question.id}`}
                            value={index}
                            checked={answer.includes(index)}
                            onChange={() => handleChange(index)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-3 text-gray-900">{option}</span>
                    </label>
                ))}
            </div>
        </BaseQuestion>
    );
} 