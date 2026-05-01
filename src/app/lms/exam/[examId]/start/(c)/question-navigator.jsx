"use client";

export default function QuestionNavigator({ total, current, answered, onChange }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="max-w-5xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => onChange(current - 1)}
                        disabled={current === 0}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: total }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => onChange(i)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                                    ${current === i ? "bg-purple-600 text-white" : ""}
                                    ${answered.includes(i.toString())
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"}
                                    ${current === i && answered.includes(i.toString())
                                        ? "bg-purple-600 text-white"
                                        : ""}
                                `}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => onChange(current + 1)}
                        disabled={current === total - 1}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
} 