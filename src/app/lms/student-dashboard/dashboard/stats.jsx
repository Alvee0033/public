"use client";

import { Card, CardContent } from "@/components/ui/card";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { BookOpen, ClipboardCheck, FileText, Video } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

// --- Add these imports ---
import {
  getUpcomingSessions,
  getUpcomingExams,
  useStudentExams,
  useStudentTutoringSessions,
  fetchTutoringSessionsForStudent,
} from "./_context/ScheduleContext";

export default function Stats() {
  // Get user from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const studentId = user?.student_id;
  
  const [mounted, setMounted] = useState(false);

  // Lightweight skeleton component
  const Skeleton = ({ variant = "line", className = "" }) => {
    if (variant === "circle") {
      return (
        <div
          className={`h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
        />
      );
    }

    return (
      <div
        className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${className} animate-pulse`}
      />
    );
  };

  useEffect(() => {
    // trigger mount animation
    const t = setTimeout(() => setMounted(true), 20);
    return () => {
      clearTimeout(t);
      setMounted(false);
    };
  }, []);

  // Student details with SWR (stale-while-revalidate)
  const {
    data: studentData,
    error: studentError,
    isValidating: studentLoading,
  } = useSWR(
    studentId ? ["student", studentId] : null,
    async () => {
      const res = await axios.get(`/students/${studentId}`);
      return res.data;
    },
    { dedupingInterval: 60000, revalidateOnFocus: true }
  );
  // User already defined at component level from Redux
  const collectedRoles = [];
  if (Array.isArray(user?.roles)) {
    user.roles.forEach((r) => {
      if (typeof r === "string") collectedRoles.push(r.toUpperCase());
      else if (r?.name) collectedRoles.push(r.name.toUpperCase());
    });
  }
  if (Array.isArray(user?.app_user_roles)) {
    user.app_user_roles.forEach((r) => {
      const n = r?.role?.name;
      if (n) collectedRoles.push(n.toUpperCase());
    });
  }
  if (user?.primary_role?.name)
    collectedRoles.push(user.primary_role.name.toUpperCase());

  const isStudent =
    collectedRoles.includes("STUDENT") || collectedRoles.includes("GUARDIAN");

  // --- Get sessions from context ---
  const { sessions: allSessions, loading: sessionsLoading } =
    useStudentTutoringSessions();
  const upcomingSessions = getUpcomingSessions(allSessions);

  const exams = useStudentExams();

  // Tutoring sessions for stats with SWR and caching
  const {
    data: tutoringSessionsForStats = [],
    error: tutoringError,
    isValidating: tutoringLoading,
  } = useSWR(
    studentId ? ["tutoringSessionsForStats", studentId] : null,
    async () => await fetchTutoringSessionsForStudent(studentId, 1000),
    { dedupingInterval: 60000, revalidateOnFocus: true }
  );

  const {
    data: enrolledCourses,
    isLoading,
    error: swrError,
  } = useSWR(
    isStudent && user?.student_id ? ["my-courses", user.student_id] : null,
    async () => {
      const res = await axios.get(
        `/student-course-enrollments?limit=1000&filter=${JSON.stringify({
          student: user?.student_id,
        })}`
      );
      return res?.data?.data || [];
    }
  );

  const anyError = studentError || tutoringError || swrError;
  const isLoadingAny =
    studentLoading || tutoringLoading || isLoading || sessionsLoading;

  // (Student fetching handled above by SWR)

  // Calculate statistics based on the API data
  const calculateStats = () => {
    if (!studentData || !studentData.data) {
      return [
        {
          title: "Courses Enrolled",
          value: "0",
          icon: BookOpen,
          bgColor: "bg-[var(--primaryColor)]/10",
          iconColor: "text-[var(--primaryColor)]",
          borderColor: "border-[var(--primaryColor)]/20",
        },
        {
          title: "Tutoring Sessions",
          value: "0",
          icon: Video,
          bgColor: "bg-[var(--secondaryColor)]/10",
          iconColor: "text-[var(--secondaryColor)]",
          borderColor: "border-[var(--secondaryColor)]/20",
        },
        {
          title: "ScholarPASS",
          value: "$0",
          icon: FileText,
          bgColor: "bg-[var(--primaryColor)]/10",
          iconColor: "text-[var(--primaryColor)]",
          borderColor: "border-[var(--primaryColor)]/20",
        },
        {
          title: "Exams",
          value: "0",
          icon: ClipboardCheck,
          bgColor: "bg-[var(--secondaryColor)]/10",
          iconColor: "text-[var(--secondaryColor)]",
          borderColor: "border-[var(--secondaryColor)]/20",
        },
      ];
    }

    const studentsArray = Array.isArray(studentData.data)
      ? studentData.data
      : studentData.data
      ? [studentData.data]
      : [];

    let totalCoursesEnrolled = 0;
    let totalScholarPass = 0;

    studentsArray.forEach((student) => {
      if (student.courses_enrolled) {
        totalCoursesEnrolled += student.courses_enrolled;
      }
      if (student.scholar_pass_amount) {
        totalScholarPass += student.scholar_pass_amount;
      }
    });

    // Prefer server-fetched sessions for stats (we fetched with limit=1000). If not available, fall back to context sessions.
    const sessionsSource =
      Array.isArray(tutoringSessionsForStats) &&
      tutoringSessionsForStats.length > 0
        ? tutoringSessionsForStats
        : allSessions;

    const upcomingCount =
      tutoringLoading || sessionsLoading
        ? null
        : getUpcomingSessions(sessionsSource).length;

    // Get upcoming exams count instead of total exams count
    const upcomingExamsCount = exams.loading
      ? null
      : Array.isArray(exams.data)
      ? getUpcomingExams(exams.data).length
      : 0;

    return [
      {
        title: "Courses Enrolled",
        value: Array.isArray(enrolledCourses) ? enrolledCourses.length : 0,
        icon: BookOpen,
        bgColor: "bg-[var(--primaryColor)]/10",
        iconColor: "text-[var(--primaryColor)]",
        borderColor: "border-[var(--primaryColor)]/20",
      },
      {
        title: "Tutoring Sessions",
        value:
          tutoringLoading || sessionsLoading || studentLoading ? (
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            upcomingCount
          ),
        icon: Video,
        bgColor: "bg-[var(--secondaryColor)]/10",
        iconColor: "text-[var(--secondaryColor)]",
        borderColor: "border-[var(--secondaryColor)]/20",
      },
      {
        title: "SchoarPASS",
        value: totalScholarPass > 0 ? `$${totalScholarPass}` : "$0",
        icon: FileText,
        bgColor: "bg-[var(--primaryColor)]/10",
        iconColor: "text-[var(--primaryColor)]",
        borderColor: "border-[var(--primaryColor)]/20",
      },
      {
        title: "Exams",
        value: exams.loading ? (
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          upcomingExamsCount
        ),
        icon: ClipboardCheck,
        bgColor: "bg-[var(--secondaryColor)]/10",
        iconColor: "text-[var(--secondaryColor)]",
        borderColor: "border-[var(--secondaryColor)]/20",
      },
    ];
  };

  const stats = calculateStats();

  return (
    <div
      className={`space-y-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {anyError && (
        <div className="p-4 bg-[var(--secondaryColor)]/10 text-[var(--secondaryColor)] rounded-md">
          {String(anyError)}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="h-full w-full">
            <Card
              className={`overflow-hidden border shadow-sm h-full w-full flex flex-col ${stat.borderColor}`}
            >
              <CardContent className="px-6 py-6 flex-1 flex flex-col">
                <div className="w-full flex items-start justify-between min-h-[64px]">
                  <div
                    className={`rounded-full ${stat.bgColor} ${stat.borderColor} border p-2 flex-shrink-0 text-[var(--primaryColor)]`}
                    aria-hidden
                  >
                    {isLoadingAny ? (
                      <Skeleton variant="circle" />
                    ) : (
                      <stat.icon className="h-5 w-5 text-current" />
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {isLoadingAny ? (
                      <Skeleton className="w-20 h-6" />
                    ) : (
                      <p className="font-inter font-medium text-[24px] leading-8 tracking-[0.005em] text-[var(--secondaryColor)]">
                        {stat.value}
                      </p>
                    )}
                  </div>
                </div>

                {/* Spacer pushes the title to the bottom */}
                <div className="mt-auto text-left">
                  {isLoadingAny ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    <h3 className="font-inter font-medium text-[16px] leading-6 tracking-[0.005em] text-[var(--primaryColor)]">
                      {stat.title}
                    </h3>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
