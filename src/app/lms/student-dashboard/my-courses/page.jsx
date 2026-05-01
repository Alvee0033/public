"use client";

import { courseNotFound } from "@/assets/images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { instance } from "@/lib/axios";
import parseHtml from "@/lib/parseHtml";
import { useAppSelector } from "@/redux/hooks";
import { formatRelative, subDays } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function EnrolledCourses() {
  // Get user from Redux state (which comes from localStorage)
  const user = useAppSelector((state) => state.auth.user);
  const [manualEnrollments, setManualEnrollments] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState(null);

  // Manual fetch as fallback if SWR doesn't trigger
  useEffect(() => {
    if (user?.student_id) {
      setManualLoading(true);
      instance.get('/student-course-enrollments', {
        params: {
          limit: 100,
          filter: JSON.stringify({ student: user.student_id })
        }
      })
        .then(res => {
          console.log('[manual-fetch] Got enrollments:', res?.data?.data?.length || 0);
          setManualEnrollments(res?.data?.data || []);
          setManualLoading(false);
        })
        .catch(err => {
          console.error('[manual-fetch] Error:', err);
          setManualError(err.message);
          setManualLoading(false);
        });
    }
  }, [user?.student_id]);

  // Check if user is a student based on roles
  const isStudent = user && Array.isArray(user?.roles) &&
    user.roles.some(role => typeof role === 'string' && role.toLowerCase() === 'student');

  // SWR fetch
  const { data: enrolledCourses, isLoading, error } = useSWR(
    isStudent && user?.student_id ? ['my-courses', user.student_id] : null,
    async () => {
      console.debug('[swr] Fetching courses for student:', user.student_id);
      try {
        // Direct URL construction to match working implementation
        const url = `/student-course-enrollments?limit=100&filter=${encodeURIComponent(JSON.stringify({ student: user.student_id }))}`;
        const res = await instance.get(url);
        console.debug('[swr] Got response:', res?.data?.data?.length || 0, 'courses');
        return res?.data?.data || [];
      } catch (err) {
        console.error('[swr] Error fetching courses:', err);
        throw err;
      }
    },
    { revalidateOnMount: true, dedupingInterval: 0 }
  );

  // Use manual fetch results if SWR doesn't return data
  const coursesToDisplay = enrolledCourses || manualEnrollments;
  const isLoadingAny = isLoading || manualLoading;
  const errorAny = error || manualError;

  // Debug logging
  useEffect(() => {
    if (isStudent && user?.student_id) {
      console.log('[debug] Student ID:', user.student_id);
      console.log('[debug] SWR courses:', enrolledCourses?.length || 0);
      console.log('[debug] Manual courses:', manualEnrollments?.length || 0);
    }
  }, [isStudent, user, enrolledCourses, manualEnrollments]);

  if (errorAny && (!coursesToDisplay || coursesToDisplay.length < 1)) {
    return (
      <div className="p-8">
        <h1>Error loading courses: {errorAny?.toString()}</h1>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoadingAny) {
    return (
      <div className="p-4 sm:p-6 md:p-8 w-full max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!coursesToDisplay || coursesToDisplay.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-8 w-full max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">My Courses</h1>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">You are not enrolled in any courses yet</h2>
          <p className="text-gray-600 mb-6">Browse our course catalog to find courses that interest you</p>
          <Button>
            <Link href="/learninghub/course-list">
              Browse Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">My Enrolled Courses</h1>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {coursesToDisplay.map((item, i) => (
          <CourseCard course={item} key={i} />
        ))}
      </div>
    </div>
  );
}

const CourseCard = ({ course }) => {
  // Log structure to debug issues
  useEffect(() => {
    console.debug('[course-card] Course data structure:', {
      hasNestedCourse: !!course?.course,
      id: course?.id || course?.course?.id,
      name: course?.name || course?.course?.name,
    });
  }, [course]);

  // Extract course data safely
  const courseData = course?.course || course;

  const { data: category, error, isLoading } = useSWR(
    // Fix: Use the direct course_category_id if it exists, otherwise check nested path
    [courseData?.course_category_id || null],
    async (id) => {
      if (!id) return null;
      const res = await instance.get(`/course-categories/${id}`);
      return res?.data?.data;
    }
  );

  const courseName = courseData?.name;
  const courseImage = courseData?.image;
  const courseDescription = courseData?.description;
  const courseId = courseData?.id;

  return (
    <Link href={`/lms/student-dashboard/course-player/${courseId}`} className="block w-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full w-full">
        <div className="aspect-video w-full overflow-hidden relative">
          <Image
            src={courseImage || courseNotFound}
            alt={courseName || "Course"}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{category?.name || "Uncategorized"}</Badge>
          </div>
          <CardTitle className="line-clamp-2">{courseName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {courseData?.instructor || ""}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {courseDescription ? parseHtml(courseDescription) : ''}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{course?.course_completion_percentage || 0}%</span>
              </div>
              <Progress value={course?.course_completion_percentage || 0} />
            </div>
            <div className="text-xs text-gray-500 capitalize">
              Enrolled: {course?.enrollment_date ? formatRelative(subDays(new Date(course?.enrollment_date), 0), new Date()) : 'Recently'}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};