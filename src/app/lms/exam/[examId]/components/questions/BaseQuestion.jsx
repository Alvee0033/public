'use client';

export default function BaseQuestion({ number, text, children }) {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">{number}</span>
                </span>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{text}</h3>
                </div>
            </div>
            <div className="pl-9">
                {children}
            </div>
        </div>
    );
} 