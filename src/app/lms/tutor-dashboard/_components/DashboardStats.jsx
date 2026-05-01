"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import StatusCard from "./StatusCard";


export default function DashboardStats() {
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
    const [loading, setLoading] = useState(true);

    // Get user data from Redux store
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Get tutor ID from Redux state instead of API call
                const tutorId = user?.tutor_id;
                if (!tutorId) {
                    console.warn("No tutor ID found in user data");
                    setLoading(false);
                    return;
                }

                const coursesRes = await axios.get(`/courses?filter=${encodeURIComponent(JSON.stringify({ primary_tutor: tutorId }))}`);
                setTotalCourses(Array.isArray(coursesRes.data?.data) ? coursesRes.data.data.length : 0);

                const sessionsRes = await axios.get(`/student-tutoring-sessions?limit=1000&filter=${encodeURIComponent(JSON.stringify({ tutor: tutorId }))}`);
                let sessions = Array.isArray(sessionsRes.data?.data) ? sessionsRes.data.data : [];
                sessions = sessions.filter(s => s.tutor && s.tutor.id === tutorId);
                setTotalSessions(sessions.length);

                const tutorStudents = await axios.get(`/tutor-students?filter=${encodeURIComponent(JSON.stringify({ tutor: tutorId }))}`);
                const totalStudents = Array.isArray(tutorStudents.data?.data) ? tutorStudents.data.data.length : 0;
                setTotalStudents(totalStudents);

                const tutorRating = await axios.get(`/tutors`);
                const ratingData = Array.isArray(tutorRating.data?.data) ? tutorRating.data.data.find(t => t.id === tutorId) : null;
                setTotalRating(ratingData ? ratingData.rating_score || 0 : 0);

            } catch (e) {
                console.error("Error fetching tutor stats:", e);
                setTotalCourses(0);
                setTotalSessions(0);
            } finally {
                setLoading(false);
            }
        }

        // Only fetch stats if user data is available
        if (user?.tutor_id) {
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [user?.tutor_id]); // Depend on tutor_id from user data

    return (
        <div className="flex gap-4 mb-2">
            <StatusCard title="Total Courses" data={loading ? "0" : totalCourses} />
            <StatusCard title="Total Sessions" data={loading ? "0" : totalSessions} />
            <StatusCard title="Total Students" data={loading ? "0" : totalStudents} />
            {/* <StatusCard title="Average Rating" data={loading ? "..." : totalRating.toFixed(1)} /> */}
        </div>
    );
}
