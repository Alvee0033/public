'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnswerSheet from './components/AnswerSheet';
import CourseRecommendations from './components/CourseRecommendations';

export default function ExamComplete({ params, searchParams }) {
    const [results, setResults] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch exam results and recommendations
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/exams/${params.examId}/results`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Failed to fetch results:', error);
            }
        };

        fetchResults();
    }, [params.examId]);

    if (!results) return <div>Loading results...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Score Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Total Score</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {results.score}%
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Questions</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {results.correctAnswers}/{results.totalQuestions}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Time Spent</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {results.timeSpent}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <div className="text-2xl font-bold text-green-600">
                        {results.score >= 60 ? 'Passed' : 'Failed'}
                    </div>
                </div>
            </div>

            {/* Answer Sheet */}
            <div className="mb-8">
                <AnswerSheet
                    answers={results.answers}
                    questions={results.questions}
                />
            </div>

            {/* Course Recommendations */}
            <div>
                <CourseRecommendations
                    recommendations={results.recommendations}
                />
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => router.push('/student/exam')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                    Back to Exams
                </button>
            </div>
        </div>
    );
} 