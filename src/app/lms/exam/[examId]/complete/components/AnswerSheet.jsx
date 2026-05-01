'use client';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AnswerSheet({ answers, questions }) {
    const getQuestionTypeLabel = (type) => {
        const labels = {
            'multiple-choice-single': 'MCQ - Single',
            'multiple-choice-multiple': 'MCQ - Multiple',
            'true-false': 'True/False',
            'fill-blank': 'Fill in the Blank',
            'code-writing': 'Code',
            'image-choice': 'Image Based',
            'video-question': 'Video',
            'hotspot': 'Hotspot',
            'drag-drop': 'Drag & Drop'
        };
        return labels[type] || type;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Question and Answer Review</h2>
            </div>

            <div className="divide-y">
                {questions.map((question, index) => (
                    <div key={index} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {getQuestionTypeLabel(question.type)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    answered in {answers[index]?.timeSpent || 0} seconds
                                </span>
                                {answers[index]?.isCorrect ? (
                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                ) : (
                                    <XCircleIcon className="w-6 h-6 text-red-500" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900">Question:</h4>
                                <p className="mt-1 text-gray-600">{question.text}</p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">Your Answer:</h4>
                                <div className="mt-1 text-gray-600">
                                    {answers[index]?.answer || 'Not answered'}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">Correct Answer:</h4>
                                <div className="mt-1 text-gray-600">
                                    {question.correctAnswer}
                                </div>
                            </div>

                            {question.explanation && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-900">Explanation:</h4>
                                    <p className="mt-1 text-blue-700">{question.explanation}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 