
"use client";

// Skeleton loader for dashboard client
function TutorDashboardClientSkeleton() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-8 w-1/3 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-200 rounded" />
        </div>
    );
}
// Keep scheduledTasks in sync with tutorSessions for calendar views
// (This must come after imports)
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { addDays, addMonths, addWeeks, addYears, endOfWeek, format, startOfWeek, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from "@/redux/hooks";
import CalendarTabs from "./_components/CalendarTabs";
import SidebarTabs from "./_components/SidebarTabs";

// Constants
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea'];
const REVENUE_DATA = [
    { month: "Jan", courses: 1200, mentorship: 800 },
    { month: "Feb", courses: 1500, mentorship: 900 },
    { month: "Mar", courses: 1700, mentorship: 1100 },
    { month: "Apr", courses: 1400, mentorship: 950 },
    { month: "May", courses: 1800, mentorship: 1200 },
    { month: "Jun", courses: 2000, mentorship: 1300 },
];
const TRENDS = {
    revenue: 12,
    students: 8,
    rating: 2,
    completion: 3
};



export default function TutorDashboardClient() {
    // All hooks must be declared at the top, only once each
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeView, setActiveView] = useState("month");
    const [activeTab, setActiveTab] = useState("sessions");
    const [draggingTask, setDraggingTask] = useState(null);

    // Get user data from Redux store
    const user = useAppSelector((state) => state.auth.user);
    const [scheduledTasks, setScheduledTasks] = useState([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingDrop, setPendingDrop] = useState(null); // { session, newDate }
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [lessonsLoading, setLessonsLoading] = useState(false);
    const [assignmentsLoading, setAssignmentsLoading] = useState(false);
    const [tutorSessions, setTutorSessions] = useState([]);
    const [tutorLessons, setTutorLessons] = useState([]);
    const [tutorAssignments, setTutorAssignments] = useState([]);

    // Data fetching effect (fixes infinite loading)
    useEffect(() => {
        async function fetchData() {
            try {
                // Get tutor ID from Redux state
                const tutorId = user?.tutor_id;
                if (!tutorId) throw new Error("Tutor ID not found");

                // Fetch courses
                const coursesRes = await axios.get(`/courses?filter=${encodeURIComponent(JSON.stringify({ primary_tutor: tutorId }))}`);
                setCourses(Array.isArray(coursesRes.data?.data) ? coursesRes.data.data : []);

                // Fetch sessions for sidebar
                setSessionsLoading(true);
                try {
                    const sessionsRes = await axios.get(`/student-tutoring-sessions?limit=1000&filter=${encodeURIComponent(JSON.stringify({ tutor: tutorId }))}`);
                    let sessions = Array.isArray(sessionsRes.data?.data) ? sessionsRes.data.data : [];
                    sessions = sessions.filter(s => s.tutor && s.tutor.id === tutorId);
                    setTutorSessions(sessions);
                    setScheduledTasks(sessions); // Pass sessions to calendar
                } catch (sessionErr) {
                    setTutorSessions([]);
                    setScheduledTasks([]);
                    console.error("Failed to fetch sessions:", sessionErr);
                } finally {
                    setSessionsLoading(false);
                }
            } catch (error) {
                setCourses([]);
                setTutorSessions([]);
                setScheduledTasks([]);
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
    if (loading) return <TutorDashboardClientSkeleton />;
    // Navigation handlers
    const handlePrevious = () => {
        switch (activeView) {
            case "day": setSelectedDate(subDays(selectedDate, 1)); break;
            case "week": setSelectedDate(subWeeks(selectedDate, 1)); break;
            case "month": setSelectedDate(subMonths(selectedDate, 1)); break;
            case "year": setSelectedDate(subYears(selectedDate, 1)); break;
            default: break;
        }
    };
    const handleNext = () => {
        switch (activeView) {
            case "day": setSelectedDate(addDays(selectedDate, 1)); break;
            case "week": setSelectedDate(addWeeks(selectedDate, 1)); break;
            case "month": setSelectedDate(addMonths(selectedDate, 1)); break;
            case "year": setSelectedDate(addYears(selectedDate, 1)); break;
            default: break;
        }
    };
    const handleDragStart = (task) => {
        setDraggingTask(task);
        // Close mobile sidebar when dragging starts for better UX
        setIsMobileSidebarOpen(false);
    };
    const handleDragOver = (e) => e.preventDefault();
    // Enhanced handleDrop for month view drag-and-drop
    const handleDrop = (timeSlot, date = selectedDate) => {
        if (!draggingTask) return;
        setPendingDrop({ session: draggingTask, newDate: date });
        setShowConfirmModal(true);
    };

    // Confirm and send PATCH request
    const handleConfirmDrop = async () => {
        if (!pendingDrop) return;
        const { session, newDate } = pendingDrop;
        try {
            // Set new date and time (default to 9:00-10:00 for month view)
            const start = new Date(newDate);
            start.setHours(9, 0, 0, 0);
            const end = new Date(newDate);
            end.setHours(10, 0, 0, 0);
            const payload = {
                class_date: start.toISOString(),
                class_start_time: start.toISOString(),
                class_end_time: end.toISOString(),
                is_requested: true,
            };
            await axios.patch(`/student-tutoring-sessions/${session.id}`, payload);
            // Optionally, refresh sessions
            setShowConfirmModal(false);
            setDraggingTask(null);
            setPendingDrop(null);
            // Refetch sessions to update UI
            if (typeof window !== 'undefined') window.location.reload();
        } catch (err) {
            alert("Failed to update session. Please try again.");
            setShowConfirmModal(false);
            setDraggingTask(null);
            setPendingDrop(null);
        }
    };
    const getHeaderText = () => {
        switch (activeView) {
            case "day": return format(selectedDate, "EEEE, MMMM d, yyyy");
            case "week": {
                const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
                const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
                return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")} `;
            }
            case "month": return format(selectedDate, "MMMM yyyy");
            case "year": return format(selectedDate, "yyyy");
            default: return format(selectedDate, "EEEE, MMMM d, yyyy");
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen w-full bg-gray-50 border border-gray-200">
                {/* Header */}
                <header className="flex flex-wrap items-center justify-between p-3 bg-white border-b shadow-sm gap-y-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Mobile Sidebar Toggle */}
                        <button 
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors sm:hidden"
                            aria-label="Toggle sidebar"
                        >
                            {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <button onClick={handlePrevious} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" aria-label="Previous">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={() => setSelectedDate(new Date())} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" aria-label="Today">
                            <CalendarIcon className="h-5 w-5" />
                        </button>
                        <button onClick={handleNext} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" aria-label="Next">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <h1 className="text-base sm:text-lg font-medium ml-2 truncate">{getHeaderText()}</h1>
                    </div>
                    {/* You can add tutor info here if needed */}
                </header>
                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Mobile Overlay */}
                    {isMobileSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                            onClick={() => setIsMobileSidebarOpen(false)}
                        />
                    )}
                    
                    {/* Sidebar */}
                    <div className={`
                        fixed sm:relative inset-y-0 left-0 z-50 w-80 bg-white border-r overflow-hidden flex flex-col
                        transform transition-transform duration-300 ease-in-out sm:transform-none
                        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
                        sm:w-80 sm:flex
                    `}>
                        {/* Mobile Close Button - Only visible on mobile */}
                        <div className="flex items-center justify-between p-3 border-b sm:hidden">
                            <h2 className="text-lg font-semibold">Sessions & Tasks</h2>
                            <button 
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                aria-label="Close sidebar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <SidebarTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            sessionsLoading={sessionsLoading}
                            lessonsLoading={lessonsLoading}
                            assignmentsLoading={assignmentsLoading}
                            tutorSessions={tutorSessions}
                            tutorLessons={tutorLessons}
                            tutorAssignments={tutorAssignments}
                            handleDragStart={handleDragStart}
                        />
                    </div>
                    
                    {/* Calendar Area */}
                    <div className="flex-1 flex flex-col bg-white min-w-0">
                        <CalendarTabs
                            activeView={activeView}
                            setActiveView={setActiveView}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            scheduledTasks={scheduledTasks}
                            handleDragOver={handleDragOver}
                            handleDrop={handleDrop}
                        />
                    </div>
                </div>
            </div>
            {/* Confirmation Modal for Drag-and-Drop */}
            <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to send for a request to update the date?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will update the session date and time. Do you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowConfirmModal(false);
                            setDraggingTask(null);
                            setPendingDrop(null);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDrop}>Yes, update</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
