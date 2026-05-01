"use client"
import { useCourse } from "@/app/lms/student-dashboard/course-player/[courseId]/CourseContext";
import axios from "@/lib/axios";
import { AlertCircle, ChevronDown, ChevronRight, Pause, Play, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

function getModulesWithLessons(course) {
    if (!course) return [];

    const modules = course.course?.course_modules || [];

    // Transform the data structure to match what CourseContents expects
    return modules.map(module => ({
        ...module,
        lessons: module.course_lessons || []
    }));
}

export default function CourseContents({
    modules = [],
    initialExpandedSection = null,
    onVideoSelect = () => { },
    course,
}) {
    const [expandedSections, setExpandedSections] = useState(initialExpandedSection ? [initialExpandedSection] : []);
    const [checkedItems, setCheckedItems] = useState(modules);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const { fetchVideoDetails, videoLoading, videoError, selectedVideo } = useCourse();

    // Update checkedItems when modules prop changes
    useEffect(() => {
        setCheckedItems(modules);
    }, [modules]);

    // Detect screen size on mount and window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleExpand = (title) => {
        setExpandedSections((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const handleCheckboxChange = (sectionTitle, itemIndex) => {
        setCheckedItems(prevCheckedItems => {
            const updatedData = prevCheckedItems.map((section) => {
                if (section.title === sectionTitle) {
                    if (section.lessons) {
                        const updatedLessons = section.lessons.map((lesson, idx) =>
                            idx === itemIndex ? { ...lesson, checked: !lesson.checked } : lesson
                        );
                        return { ...section, lessons: updatedLessons };
                    }
                }
                return section;
            });
            return updatedData;
        });
    };

    const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    const completedLessons = checkedItems.reduce(
        (sum, m) => sum + (m.lessons?.filter(l => l.checked).length || 0),
        0
    );
    const percentCompleted = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
    useEffect(() => {
        if (!course?.id || percentCompleted === undefined || percentCompleted === null) return;
        let isCancelled = false;
        async function updateCompletion() {
            try {
                const meRes = await axios.post('/auth/me');
                const studentId = meRes?.data?.data?.student_id;
                if (!studentId) return;
                const filter = encodeURIComponent(JSON.stringify({ student: studentId, course: course.id }));
                const enrollRes = await axios.get(`/student-course-enrollments?filter=${filter}`);
                const enrollment = Array.isArray(enrollRes?.data?.data) ? enrollRes.data.data[0] : null;
                if (!enrollment?.id) return;
                await axios.patch(`/student-course-enrollments/${enrollment.id}`, {
                    course_completion_percentage: percentCompleted
                });
            } catch (err) {
                if (isCancelled) return;
                console.error('Failed to update course completion:', err);
            }
        }
        updateCompletion();
        return () => {
            isCancelled = true;
        };
    }, [percentCompleted, course?.id]);

    const handlePlayPauseToggle = (sectionTitle, lessonIndex) => {
        const updatedData = checkedItems.map((section) => {
            if (section.title === sectionTitle && section.lessons) {
                const updatedLessons = section.lessons.map((lesson, idx) => {
                    if (idx === lessonIndex) {
                        return { ...lesson, playing: !lesson.playing };
                    }
                    return { ...lesson, playing: false };
                });
                return { ...section, lessons: updatedLessons };
            }
            return section;
        });
        setCheckedItems(updatedData);

        const section = updatedData.find(s => s.title === sectionTitle);
        if (section && section.lessons[lessonIndex].playing) {
            onVideoSelect(section.lessons[lessonIndex], sectionTitle, lessonIndex);
        }
    };

    const hasContent = Array.isArray(modules) && modules.length > 0 && modules.some(m => Array.isArray(m.lessons) && m.lessons.length > 0);

    if (!hasContent) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
                <AlertCircle className="w-8 h-8 mb-2" />
                <span className="text-sm text-gray-400">No course contents found</span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full md:max-w-[603px] lg:max-w-[750px] xl:max-w-[603px] mx-auto font-inter py-4 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold">Course Contents</h2>
                <div className="text-xs sm:text-sm text-green-600">{percentCompleted}% Completed</div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-white rounded-md border border-gray-200 mb-3 sm:mb-4">
                <div className="h-1.5 bg-gray-200 w-full rounded-md">
                    <div
                        className="h-1.5 bg-green-600 rounded-md"
                        style={{ width: `${percentCompleted}%` }}
                    />
                </div>
            </div>
            {/* Course sections */}
            <div className="space-y-2">
                {checkedItems.map((section, idx) => (
                    <div key={section.id || idx} className="border border-gray-200 rounded-md overflow-hidden">
                        {/* Section Header */}
                        <div
                            className="flex flex-col sm:flex-row justify-between sm:items-center px-3 sm:px-5 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 w-full"
                            onClick={() => toggleExpand(section.title)}
                            style={{
                                background: expandedSections.includes(section.title) ? "#F5F7FA" : "transparent",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-1 sm:mb-0 min-w-0 max-w-full">
                                <span className="flex-shrink-0">
                                    {expandedSections.includes(section.title) ? (
                                        <ChevronDown className="text-gray-500" size={isMobile ? 16 : 20} />
                                    ) : (
                                        <ChevronRight className="text-gray-500" size={isMobile ? 16 : 20} />
                                    )}
                                </span>
                                <span className="font-medium text-xs sm:text-sm text-[#2C60EB] truncate overflow-hidden flex-1 pr-2 max-w-[calc(100%-30px)]">
                                    {section.title}
                                </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1 sm:gap-2 pl-6 sm:pl-0 max-w-full">
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <PlayCircle size={isMobile ? 16 : 20} className="text-blue-600" />
                                    <span className="whitespace-nowrap">{section.lessons?.length || 0} lectures</span>
                                </div>
                                {/* Duration can be calculated or shown if available */}
                                {/* <div className="flex items-center gap-1 flex-shrink-0">
                                    <Clock3 size={isMobile ? 16 : 20} className="text-blue-600" />
                                    <span className="whitespace-nowrap">{section.duration || ""}</span>
                                </div> */}
                            </div>
                        </div>
                        {/* Lesson items */}
                        {expandedSections.includes(section.title) && section.lessons && (
                            <div className="bg-gray-50 border-t border-gray-100 w-full">
                                {section.lessons.map((lesson, lessonIdx) => (
                                    <div
                                        key={lesson.id || lessonIdx}
                                        className={`flex flex-col sm:flex-row sm:justify-between items-start sm:items-center 
                                            px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm border-b border-gray-100 last:border-b-0 
                                            ${lesson.playing ? "bg-red-50" : ""} w-full overflow-hidden`}
                                        onClick={async () => {
                                            if (lesson.master_video_library_id) {
                                                await fetchVideoDetails(lesson.master_video_library_id);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1 sm:mb-0 min-w-0 max-w-full sm:max-w-[60%]">
                                            <input
                                                type="checkbox"
                                                checked={lesson.checked || false}
                                                onChange={() => handleCheckboxChange(section.title, lessonIdx)}
                                                className="accent-blue-600 flex-shrink-0"
                                            />
                                            <span
                                                className={`${lesson.playing ? "font-medium" : ""} 
                                                    truncate overflow-ellipsis w-full`}
                                                style={{ cursor: lesson.master_video_library_id ? "pointer" : "default" }}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (lesson.master_video_library_id) {
                                                        await fetchVideoDetails(lesson.master_video_library_id);
                                                    }
                                                }}
                                            >
                                                {lessonIdx + 1}. {lesson.title}
                                            </span>
                                        </div>
                                        <div className="text-gray-600 text-xs flex items-center gap-2 pl-6 sm:pl-0 flex-shrink-0 flex-wrap">
                                            {lesson.duration && lesson.master_video_library_id && (
                                                <div
                                                    className="cursor-pointer text-black"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        await fetchVideoDetails(lesson.master_video_library_id);
                                                        handlePlayPauseToggle(section.title, lessonIdx);
                                                    }}
                                                >
                                                    {lesson.playing ? (
                                                        <Pause className="text-black" size={isMobile ? 16 : 18} />
                                                    ) : (
                                                        <Play className="text-black" size={isMobile ? 16 : 18} />
                                                    )}
                                                </div>
                                            )}
                                            {lesson.duration && (
                                                <span className="text-black whitespace-nowrap">{lesson.duration}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* Mobile-only controls */}
            {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-center">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        onClick={() => {
                            const allSections = checkedItems.map(section => section.title);
                            setExpandedSections(allSections);
                        }}
                    >
                        Expand All Sections
                    </button>
                </div>
            )}
        </div>
    );
}
