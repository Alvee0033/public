"use client";

import CourseList from "@/components/shared/CourseList";
import PageTitle from "@/components/shared/pageTitle";
import axios from "@/lib/axios";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

function RecommendedCoursesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;
    const [gradeFilter, setGradeFilter] = useState(() => {
        if (typeof window !== "undefined") {
            const storedGrade = localStorage.getItem("grade");
            return Number(storedGrade);
        };
    });
    const [examReportData, setExamReportData] = useState(null);
    const [isReportLoading, setIsReportLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    // First fetch the current user data to get student_id
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsUserLoading(true);
                const response = await axios.post('/auth/me');

                if (response.data && response.data.status === "SUCCESS") {
                    setUserData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load your profile data");
            } finally {
                setIsUserLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Then fetch exam report data once we have the student_id
    useEffect(() => {
        // Only proceed if we have user data with a student_id
        if (!userData || !userData.id) return;

        const fetchExamReport = async () => {
            try {
                setIsReportLoading(true);
                const response = await axios.get(`/exam-report/generate?student_id=${userData.id}`);

                if (response.data && response.data.status === "SUCCESS") {
                    setExamReportData(response.data.data);

                    // Use exam_id as the grade filter
                    // if (response.data.data?.exam_id) {
                    //     setGradeFilter(response.data.data.exam_id);
                    // }
                }
            } catch (error) {
                console.error("Error fetching exam report:", error);
                toast.error("Failed to load your assessment report");
            } finally {
                setIsReportLoading(false);
            }
        };

        fetchExamReport();
    }, [userData]);

    // Fetch courses based on grade filter
    const getCourses = async () => {
        const skip = (currentPage - 1) * pageSize;

        // Build filter object using exam_id as the master_k12_grade value
        const filter = {
            master_k12_grade: gradeFilter // gradeFilter is now set to the exam_id
            // master_k12_grade: 4 // gradeFilter is now set to the exam_id
        };

        const queryParams = new URLSearchParams({
            pagination: true,
            limit: pageSize,
            skip: skip,
            filter: JSON.stringify(filter)
        }).toString();

        try {
            const res = await axios.get(`/courses?${queryParams}`);
            return res?.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load recommended courses");
            throw error;
        }
    };

    const {
        data: coursesData,
        isLoading,
        error,
    } = useSWR(["recommended-courses", currentPage, gradeFilter], getCourses, {
        keepPreviousData: true,
    });

    // Combined loading state for user data and exam report
    const isLoadingData = isUserLoading || isReportLoading;

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Failed to load recommended courses
                    </h3>
                    <p className="text-gray-600">Please try again later</p>
                </div>
            </div>
        );
    }

    const courses = coursesData?.data || [];
    const totalItems = coursesData?.pagination?.total || 0;

    // Get user's full name for personalized greeting
    const userName = userData ? `${userData.first_name} ${userData.last_name}` : '';

    return (
        <>
            <PageTitle path="Learning Hub / Recommended" title="Recommended Courses" />
            <div className="container mx-auto px-4 py-12">
                {!isLoading && courses.length === 0 ? (
                    // No courses found message - minimal UI
                    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-gray-100 p-4 mb-4">
                            <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No courses found
                        </h3>
                        <p className="text-gray-500 max-w-md">
                            We couldn't find any courses matching your assessment criteria. Please try again later or take another assessment.
                        </p>
                    </div>
                ) : (
                    // Regular UI with course list
                    <>
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Courses Recommended For You
                                </h2>
                                <div className="flex items-center">
                                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                                    <span className="text-gray-600 font-medium">
                                        {isLoading ? 'Loading...' : `${totalItems} courses found`}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2">
                                These courses are tailored to your assessment results and learning goals
                            </p>
                        </div>

                        <CourseList
                            courses={courses}
                            isLoading={isLoading}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default RecommendedCoursesPage;
