'use client';
import { BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function CourseRecommendations({ recommendations }) {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                    Recommended Learning Path
                </h2>
                <p className="mt-1 text-gray-500">
                    Based on your exam performance, we recommend the following courses and modules
                </p>
            </div>

            <div className="divide-y">
                {recommendations.map((course, index) => (
                    <div key={index} className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <BookOpenIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {course.title}
                                </h3>
                                <p className="mt-1 text-gray-500">{course.description}</p>

                                {/* Modules */}
                                <div className="mt-4 space-y-3">
                                    {course.modules.map((module, mIndex) => (
                                        <div key={mIndex} className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900">
                                                {module.title}
                                            </h4>

                                            {/* Lessons */}
                                            <div className="mt-2 space-y-2">
                                                {module.lessons.map((lesson, lIndex) => (
                                                    <div
                                                        key={lIndex}
                                                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <span className="text-sm text-gray-600">
                                                            {lesson.title}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <span>{lesson.duration}</span>
                                                            <ChevronRightIcon className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 