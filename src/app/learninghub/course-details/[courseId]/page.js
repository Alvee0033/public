"use client";

import CourseSidebar from "@/components/shared/CourseSidebar";
import axios from "@/lib/axios";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import CurriculamTab from "./CurriculamTab";
import InstituteTab from "./InstituteTab";
import InstructorTab from "./InstructorTab";
import OverlayContent from "./OverlayContent";
import OverviewTab from "./OverviewTab";
import ScholarPassOverviewTab from "./ScholarPassOverviewTab";

function CourseDetails() {
  const router = useRouter();
  const { courseId } = useParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const getCourseDetails = async () => {
    const res = await axios.get(`/courses/${courseId}`);
    return res?.data?.data;
  };

  const {
    data: course,
    isLoading,
    error,
  } = useSWR(`course-${courseId}`, getCourseDetails);

  // Prefetch related data used by tabs so individual tab components
  // don't need to fetch on mount (avoids requests on tab switch).
  const { data: allCourses, error: allCoursesError } = useSWR(
    // fetch the full courses list once
    course ? `all-courses` : null,
    async () => {
      const res = await axios.get(`/courses`);
      return res?.data?.data;
    }
  );

  const { data: instituteData } = useSWR(
    course?.institute_id ? `institute-${course.institute_id}` : null,
    async () => {
      const res = await axios.get(`/learning-hub/${course.institute_id}`);
      return res?.data?.data || res?.data || null;
    }
  );

  const { data: instructorData } = useSWR(
    course?.primary_tutor_id ? `tutor-${course.primary_tutor_id}` : null,
    async () => {
      const res = await axios.get(`/tutors/${course.primary_tutor_id}`);
      // API sometimes nests under data.data for tutor
      return res?.data?.data || res?.data;
    }
  );

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Course not found
          </h3>
          <p className="text-gray-500 text-sm">
            We couldn&apos;t find the course you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse mb-10 ">
        <div className="h-[400px] bg-gray-200 rounded-lg mb-8 animate-pulse" />
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="space-y-4 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${course?.image})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        {/* Content */}
        <OverlayContent course={course} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              {String(course?.name || "").trim() ===
              "ScholarPASS K12 Bundle" ? (
                <ScholarPassOverviewTab
                  course={course}
                  allCourses={allCourses}
                />
              ) : (
                <OverviewTab course={course} />
              )}
            </div>

            {/* Curriculum Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Curriculum</h2>
              <CurriculamTab course_modules={course?.course_modules} />
            </div>

            {/* Instructor Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor</h2>
              <InstructorTab course={course} instructor={instructorData} />
            </div>

            {/* Institute Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Institute</h2>
              <InstituteTab course={course} institute={instituteData} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto">
            <CourseSidebar course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
