'use client';

export default function QuestionNavigator({ total, current, answered, onChange }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">
                        Question Navigator ({answered.length}/{total} Answered)
                    </h3>
                    <div className="flex gap-2 text-xs">
                        <span className="flex items-center">
                            <span className="w-3 h-3 bg-purple-600 rounded-full mr-1"></span>
                            Current
                        </span>
                        <span className="flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                            Answered
                        </span>
                        <span className="flex items-center">
                            <span className="w-3 h-3 bg-gray-200 rounded-full mr-1"></span>
                            Unanswered
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-10 gap-2">
                    {Array.from({ length: total }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => onChange(i)}
                            className={`p-2 rounded-lg text-sm font-medium
                                ${i === current ? 'bg-purple-600 text-white' :
                                    answered.includes(i.toString()) ? 'bg-green-500 text-white' :
                                        'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 