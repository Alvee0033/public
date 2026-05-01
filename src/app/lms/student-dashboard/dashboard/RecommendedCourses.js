"use client";
import Button from "@/components/shared/buttons/Button";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import {
  AlertCircle,
  Clock,
  GraduationCap,
  Play,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

export default function RecommendedCourses() {
  const router = useRouter();
  
  // Get user from Redux state instead of localStorage
  const localUser = useAppSelector((state) => state.auth.user);

  // (categories not needed) - removed unused categories fetch

  // --- Reference logic for recommended courses ---
  const [gradeFilter, setGradeFilter] = useState(() => {
    if (typeof window !== "undefined") {
      const storedGrade = localStorage.getItem("grade");
      return Number(storedGrade);
    }
  });
  const [isReportLoading, setIsReportLoading] = useState(true);
  // Learning goals state
  const [learningGoals, setLearningGoals] = useState(null);
  // Extracted IDs and detailed goal state
  const [learningGoalCourseIds, setLearningGoalCourseIds] = useState([]);
  // Fetched course objects (from /courses/{id})
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [isFetchingCourseDetails, setIsFetchingCourseDetails] = useState(false);

  // User is now from Redux state - no need for localStorage loading

  // Fetch exam report and set grade filter; use localUser if available
  useEffect(() => {
    const studentId = localUser?.student_id || localUser?.id;
    if (!studentId) return;
    const fetchExamReport = async () => {
      try {
        setIsReportLoading(true);
        const response = await axios.get(
          `/exam-report/generate?student_id=${studentId}`
        );
      } catch (error) {
        console.error("Error fetching exam report:", error);
      } finally {
        setIsReportLoading(false);
      }
    };
    fetchExamReport();
  }, [localUser]);

  // Fetch student learning goals
  const fetchLearningGoals = async (studentId = 4) => {
    try {
      // Build filter query param
      const filter = { student: studentId };
      const query = `?filter=${encodeURIComponent(JSON.stringify(filter))}`;
      const res = await axios.get(`/student-learning-goals${query}`);
      if (res?.data) {
        setLearningGoals(res.data);
        console.log("fetchLearningGoals response:", res.data);
        return res.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching learning goals:", err);
      setLearningGoals(null);
      return null;
    }
  };

  // Call fetchLearningGoals when we have localUser (or fallback to 4)
  useEffect(() => {
    const id = localUser?.student_id || localUser?.id || 4;
    fetchLearningGoals(id);
  }, [localUser]);

  // Given the list response, extract ids and fetch details for each
  const fetchAllGoalDetails = async (listResponse) => {
    if (!listResponse || !Array.isArray(listResponse.data)) return;
    // The list response contains minimal items with ids; fetch course ids directly from the list records
    const courseIds = (listResponse.data || [])
      .map((item) => item.course_id || item.course?.id)
      .filter(Boolean);
    setLearningGoalCourseIds(courseIds);
    console.log("learningGoalCourseIds:", courseIds);
  };

  // When learningGoals is set, trigger fetching detailed records
  useEffect(() => {
    if (!learningGoals) return;
    fetchAllGoalDetails(learningGoals);
  }, [learningGoals]);

  // Fetch single course by id (returns course data or null)
  const fetchCourseById = useCallback(async (courseId) => {
    try {
      const res = await axios.get(`/courses/${courseId}`);
      // Res shape: { status, data, message }
      return res?.data?.data || null;
    } catch (err) {
      console.error(`Error fetching course ${courseId}:`, err?.response || err);
      return null;
    }
  }, []);

  // Given an array of course ids, fetch each course one-by-one (sequential)
  const fetchCoursesSequentially = useCallback(async (ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    setIsFetchingCourseDetails(true);
    const uniqueIds = Array.from(new Set(ids));
    const results = [];
    for (const id of uniqueIds) {
      const course = await fetchCourseById(id);
      if (course) {
        // Normalize to only the required fields
        const normalized = {
          id: course.id,
          name: course.name,
          regular_price: course.regular_price,
          discounted_price: course.discounted_price,
          discounted_percentage: course.discounted_percentage,
          discounted_amount: course.discounted_amount,
          is_trending_course: course.is_trending_course,
          image: course.image,
          course_category: { name: course.course_category?.name || "" },
          institute: { name: course.institute?.name || "" },
          short_description: course.short_description || null,
          description: course.description || null,
        };
        results.push(normalized);
      }
    }
    setFetchedCourses(results);
    setIsFetchingCourseDetails(false);
    console.log("Fetched courses:", results);
    return results;
  }, [fetchCourseById]);

  // When course ids (from learning goals) are available, fetch full course objects
  useEffect(() => {
    if (!learningGoalCourseIds || learningGoalCourseIds.length === 0) return;
    fetchCoursesSequentially(learningGoalCourseIds);
  }, [learningGoalCourseIds, fetchCoursesSequentially]);

  // We only need loading flags from report; user loaded from localStorage
  const isLoadingData = isReportLoading;

  // Handle course exploration/navigation
  const handleExplore = (courseId) => {
    router.push(`/learninghub/course-details/${courseId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="w-5 h-5 text-[var(--primaryColor)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h2 className="text-[var(--primaryColor)] font-bold">
          RECOMMENDED COURSES
        </h2>
      </div>

      {/* <div className="mb-6">
        <h3 className="text-2xl font-bold text-[var(--secondaryColor)]">
          Recommended Courses
        </h3>
        <p className="text-gray-500">
          Explore these selected courses to enhance your skills
        </p>
      </div> */}

      {isLoadingData ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-5">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-3" />
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isFetchingCourseDetails ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-3" />
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-8 bg-gray-200 rounded animate-pulse mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : fetchedCourses && fetchedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {fetchedCourses.map((course) => {
            const discounted = course.discounted_price;
            return (
              <div
                key={course.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={course.image || "/images/placeholder.jpg"}
                    alt={course.name}
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  {course.is_trending_course ? (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-medium">
                      Trending
                    </span>
                  ) : null}
                </div>

                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {course.name}
                  </h4>
                  <div className="text-xs text-gray-500 mb-3">
                    {course.course_category?.name} • {course.institute?.name}
                  </div>

                  <div className="mb-3 text-sm text-gray-700">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primaryColor)]/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-[var(--primaryColor)]" />
                        </div>
                        <span className="text-sm text-gray-600">
                          60 × 1:1 Tutoring Sessions
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primaryColor)]/10 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-[var(--primaryColor)]" />
                        </div>
                        <span className="text-sm text-gray-600">
                          60 × Group Tutoring Sessions
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primaryColor)]/10 flex items-center justify-center">
                          <Play className="w-5 h-5 text-[var(--primaryColor)]" />
                        </div>
                        <span className="text-sm text-gray-600">
                          Unlimited Self-Learning Lessons
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primaryColor)]/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-[var(--primaryColor)]" />
                        </div>
                        <span className="text-sm text-gray-600">
                          40 × STEM &amp; Robotics Lab Sessions
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primaryColor)]/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-[var(--primaryColor)]" />
                        </div>
                        <span className="text-sm text-gray-600">
                          Instant Tutoring Available
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {discounted ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            ${course.regular_price}
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            ${course.discounted_price}
                          </span>
                        </div>
                      ) : (
                        <div className="text-xl font-semibold text-gray-900">
                          ${course.regular_price}
                        </div>
                      )}
                      {course.discounted_percentage ? (
                        <div className="text-xs text-green-600">
                          {course.discounted_percentage}% off
                        </div>
                      ) : null}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExplore(course.id)}
                        className="px-3 py-1 bg-[var(--primaryColor)] text-white rounded text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // No courses available
        <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Courses Available
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are currently no courses available. Check back later as our
            course catalog is regularly updated.
          </p>
        </div>
      )}

      <div className="mt-6 text-center flex justify-center">
        <Link
          href="/learninghub/recommended-courses"
          className="w-[95%] inline-block text-white"
        >
          <Button
            className="w-full rounded-sm flex items-center justify-center py-2"
            isFullWidth={true}
          >
            Explore More Courses
          </Button>
        </Link>
      </div>
    </div>
  );
}
