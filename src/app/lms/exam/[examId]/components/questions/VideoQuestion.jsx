'use client';
import BaseQuestion from './BaseQuestion';

export default function VideoQuestion({ question, answer, onAnswer }) {
    return (
        <BaseQuestion number={question.number} text={question.text}>
            <div className="space-y-6">
                {/* Video Player */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                        src={question.videoUrl}
                        controls
                        className="w-full h-full"
                        poster="/video-placeholder.jpg"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Options */}
                <div className="space-y-2">
                    {question.options.map((option, index) => (
                        <label
                            key={index}
                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
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
        </BaseQuestion>
    );
} 