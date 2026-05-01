"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import WidgetCard from "./WidgetCard";

const DashboardWidgetDatas = () => {
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [sessionRatings, setSessionRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get user data from Redux store
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        async function fetchData() {
            try {
                // Get tutor ID from Redux state
                const tutorId = user?.tutor_id;
                if (!tutorId) return;
                const sessionsRes = await axios.get(`/student-tutoring-sessions?limit=1000`);
                let sessions = Array.isArray(sessionsRes.data?.data)
                    ? sessionsRes.data.data
                    : [];
                sessions = sessions.filter(session => {
                    let sessionTutorId = session.tutor;
                    if (sessionTutorId && typeof sessionTutorId === 'object') {
                        sessionTutorId = sessionTutorId._id || sessionTutorId.id || '';
                    }
                    return String(sessionTutorId) === String(tutorId);
                });

                // Fetch ratings
                const ratingsRes = await axios.get(`/student-tutoring-rating-by-students?limit=1000`);
                let ratings = Array.isArray(ratingsRes.data?.data)
                    ? ratingsRes.data.data
                    : [];
                // Filter ratings for this tutor (using tutor_id)
                ratings = ratings.filter(rating => String(rating.tutor_id) === String(tutorId));

                // Map session id to session for easy lookup (use id or student_tutoring_session_number)
                const sessionIdMap = {};
                sessions.forEach(session => {
                    const id = session._id || session.id || session.student_tutoring_session_number;
                    if (id) sessionIdMap[String(id)] = session;
                });

                // Prepare ratings with session info (use course_student_tutoring_session_id)
                const sessionRatingsData = ratings.map(rating => {
                    const sessionId = rating.course_student_tutoring_session_id;
                    const session = sessionIdMap[String(sessionId)] || {};
                    // Only include ratings for sessions where is_requested is false (or not present)
                    const isRequested = session.is_requested === true;
                    if ('is_requested' in session && isRequested) return null;
                    // Calculate average rating, normalize to 0-5 scale if needed
                    const ratingsArr = [
                        rating.tutor_knowledge_rating,
                        rating.tutor_engagement_rating,
                        rating.tutor_punctuality_rating,
                        rating.learning_goal_achievement_rating
                    ];
                    // Only count non-null/undefined values
                    let validRatings = ratingsArr.filter(r => typeof r === 'number' && !isNaN(r));
                    // If any value is above 5, assume scale is 0-100 and convert to 0-5
                    if (validRatings.some(r => r > 5)) {
                        validRatings = validRatings.map(r => r / 20);
                    }
                    const avgRating = validRatings.length > 0 ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length) : 0;
                    // Try to get session name or course name
                    let sessionName = session.name || session.title || (session.course_lesson && (session.course_lesson.name || session.course_lesson.title)) || '';
                    return {
                        date: session.class_date ? new Date(session.class_date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : '',
                        studentName: session.student?.full_name || '',
                        sessionName,
                        avgRating,
                        comment: rating.student_comments,
                    };
                }).filter(Boolean);

                // Upcoming sessions logic
                const now = new Date();
                const upcoming = sessions
                    .filter(session => {
                        if (!session.class_date) return false;
                        const classDate = new Date(session.class_date);
                        // Show sessions where is_requested is false as well
                        const isRequested = session.is_requested === true;
                        return !isNaN(classDate.getTime()) && classDate >= now && session.student?.full_name && (!('is_requested' in session) || !isRequested);
                    })
                    .sort((a, b) => new Date(a.class_date) - new Date(b.class_date))
                    .map(session => ({
                        date: new Date(session.class_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        studentName: session.student.full_name
                    }));

                setUpcomingSessions(upcoming);
                setSessionRatings(sessionRatingsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        
        if (user) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    return (
        <div className="w-full px-2 sm:px-4 md:px-8 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="w-full">
                <WidgetCard
                    title="My Upcoming Sessions"
                    data={
                        loading
                            ? "..."
                            : upcomingSessions
                    }
                    bgColor={"bg-gradient-to-tr from-white to-purple-500"}
                />
            </div>

            <div className="w-full">
                <WidgetCard
                    title="My Class Ratings"
                    data={
                        loading
                            ? "..."
                            : sessionRatings
                    }
                    bgColor={"bg-gradient-to-tr from-white to-yellow-500"}
                    renderItem={(item, idx) => (
                        <li key={idx} className="flex flex-col gap-1 bg-yellow-50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm hover:bg-yellow-100 transition-colors">
                            {item.sessionName && <span className="text-xs sm:text-sm text-gray-700 font-medium"><span className="mr-1 text-gray-500">Session:</span> <span className="font-normal text-gray-600">{item.sessionName}</span></span>}
                            <span className="text-xs sm:text-sm text-gray-700 font-medium"><span className="mr-1 text-gray-500">Student:</span> <span className="font-normal text-gray-600">{item.studentName}</span></span>
                            <span className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm text-gray-700 font-medium">Rating:</span>
                                <span className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill={i < Math.round(item.avgRating) ? '#facc15' : '#e5e7eb'}
                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                                        </svg>
                                    ))}
                                </span>
                                <span className="ml-1 text-xs sm:text-sm text-gray-700 font-semibold">{item.avgRating.toFixed(2)} / 5</span>
                            </span>
                            {item.comment && <span className="text-xs sm:text-sm text-gray-700 font-medium"><span className="mr-1 text-gray-500">Comment:</span> <span className="font-normal text-gray-600">{item.comment}</span></span>}
                        </li>
                    )}
                    listClassName="max-h-72 overflow-y-auto pr-2"
                />
            </div>
        </div>
    );
}

export default DashboardWidgetDatas;