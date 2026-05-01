"use client";

import Button from "@/components/shared/buttons/Button";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { formatRelative, subDays } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

// Updated CourseCard component to match the enrolled courses data structure
function CourseCard({ enrollment }) {
  const course = enrollment.course;

  // Calculate progress percentage
  const progress = course?.progress || 0;

  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 50) return "bg-[var(--secondaryColor)]";
    return "bg-[var(--primaryColor)]";
  };

  // Determine remaining lessons text
  const getLessonsLeft = () => {
    const totalLessons =
      (course?.number_of_book_lessons || 0) +
      (course?.number_of_video_lessons || 0) +
      (course?.number_of_live_tutors_lessons || 0);

    // Calculate completed lessons based on progress
    const completedLessons = Math.floor(totalLessons * (progress / 100));
    const remainingLessons = totalLessons - completedLessons;

    return `${remainingLessons} Lesson${
      remainingLessons !== 1 ? "s" : ""
    } Left`;
  };

  return (
    <Link href={`/lms/student-dashboard/course-player/${enrollment.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col border border-gray-100">
        {/* Course Image */}
        <div className="h-48 relative">
          {course?.image ? (
            <Image
              src={course?.image}
              alt={course?.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                ></path>
              </svg>
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="p-4 flex-1 flex flex-col">
          {enrollment?.course?.course_category?.name && (
            <span className="text-[var(--secondaryColor)] text-sm font-medium">
              {enrollment?.course?.course_category?.name}
            </span>
          )}

          <h3 className="text-[var(--primaryColor)] font-semibold mt-2 mb-3 line-clamp-2">
            {course?.name}
          </h3>

          <div className="mt-auto">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span
                  className={`${
                    progress >= 50 ? "text-green-600" : "text-gray-600"
                  } font-medium`}
                >
                  {progress}%
                </span>
              </div>

              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor()} rounded-full`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="text-sm text-gray-600 block mt-1">
                {getLessonsLeft()}
              </span>

              <div className="text-xs text-gray-500 mt-2">
                Enrolled:{" "}
                {enrollment?.enrollment_date
                  ? formatRelative(
                      subDays(new Date(enrollment?.enrollment_date), 0),
                      new Date()
                    )
                  : "Recently"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CoursesInProgress() {
  const { user } = useAppSelector((state) => state.auth);

  // Normalize roles safely
  const roleNames = [];
  if (Array.isArray(user?.roles)) {
    user.roles.forEach((r) => {
      if (typeof r === "string") roleNames.push(r.toUpperCase());
      else if (r?.name) roleNames.push(r.name.toUpperCase());
    });
  }
  if (Array.isArray(user?.app_user_roles)) {
    user.app_user_roles.forEach((r) => {
      const n = r?.role?.name;
      if (n) roleNames.push(n.toUpperCase());
    });
  }
  if (user?.primary_role?.name)
    roleNames.push(user.primary_role.name.toUpperCase());

  const isStudent = roleNames.some((r) => r === "STUDENT" || r === "GUARDIAN");

  const shouldFetch = isStudent && user?.student_id;

  const {
    data: enrolledCourses = [],
    error,
    isLoading,
  } = useSWR(
    shouldFetch ? ["dashboard-enrolled-courses", user.student_id] : null,
    async () => {
      const res = await axios.get(
        `/student-course-enrollments?limit=3&filter=${JSON.stringify({
          student: user?.student_id,
        })}`
      );
      return res?.data?.data || [];
    }
  );

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[var(--primaryColor)] mb-6">
          Courses in Progress
        </h2>
        <div className="text-sm text-gray-500">Loading user...</div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[var(--primaryColor)] mb-6">
          Courses in Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 animate-pulse w-1/4 mb-3" />
                <div className="h-6 bg-gray-200 animate-pulse mb-4" />
                <div className="h-4 bg-gray-200 animate-pulse w-full mb-2" />
                <div className="h-2 bg-gray-200 animate-pulse w-full mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[var(--primaryColor)] mb-6">
          Courses in Progress
        </h2>
        <div className="border border-[var(--secondaryColor)]/20 rounded-lg p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-[var(--secondaryColor)]/10 p-3 rounded-full flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--secondaryColor)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                We couldn't load your courses
              </h3>
              <p className="text-gray-600 mb-4">
                There was an issue connecting to our course library. This could
                be due to your internet connection or temporary server
                maintenance.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[var(--primaryColor)] text-white rounded-md hover:bg-[var(--primaryColor)]/90 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Page
                </button>
                <Link href="/learninghub/course-list">
                  <button className="px-4 py-2 border border-[var(--secondaryColor)] text-[var(--secondaryColor)] rounded-md hover:bg-[var(--secondaryColor)]/5 transition-colors text-sm font-medium">
                    Browse All Courses
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No courses found
  if (!enrolledCourses || enrolledCourses?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[var(--primaryColor)] mb-6">
          Courses in Progress
        </h2>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            You are not enrolled in any courses yet
          </p>
          <Link href="/learninghub/course-list">
            <Button className="inline-block px-4 py-2 bg-[var(--primaryColor)] text-white rounded-md transition-colors border-none hover:bg-[var(--primaryColor)]">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--primaryColor)]">
          Courses in Progress
        </h2>
        {enrolledCourses?.length > 0 && (
          <Link
            href="/lms/student-dashboard/my-courses"
            className="text-[var(--secondaryColor)] hover:text-[var(--primaryColor)] text-xs sm:text-sm font-medium"
          >
            <Button className="border-none rounded-md px-3 py-1.5 text-xs sm:text-sm min-h-0 h-auto">
              View All
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.slice(0, 3).map((enrollment) => (
          <CourseCard key={enrollment?.id} enrollment={enrollment} />
        ))}
      </div>
    </div>
  );
}
