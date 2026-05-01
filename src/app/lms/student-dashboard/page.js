"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import Loader from "@/components/shared/Loader";
import TopAnnouncement from "@/components/top/TopAnnouncement";

const Stats = dynamic(() => import("./dashboard/stats"), {
  loading: () => <PanelSkeleton className="min-h-[180px]" />,
});
const ScheduleWidget = dynamic(() => import("./dashboard/ScheduleWidget"), {
  loading: () => <PanelSkeleton className="min-h-[520px]" />,
});
const LearningGoals = dynamic(() => import("./dashboard/LearningGoals"), {
  loading: () => <PanelSkeleton className="min-h-[300px]" />,
});
const RecommendedCourses = dynamic(() => import("./dashboard/RecommendedCourses"), {
  loading: () => <PanelSkeleton className="min-h-[320px]" />,
});
const AssignedTutors = dynamic(() => import("./dashboard/AssignedTutors"), {
  loading: () => <PanelSkeleton className="min-h-[320px]" />,
});
const CoursesInProgress = dynamic(() => import("./dashboard/CoursesInProgress"), {
  loading: () => <PanelSkeleton className="min-h-[340px]" />,
});
const Assignments = dynamic(() => import("./dashboard/assignments"), {
  loading: () => <PanelSkeleton className="min-h-[260px]" />,
});
const Guardians = dynamic(() => import("./dashboard/guardians"), {
  loading: () => <PanelSkeleton className="min-h-[240px]" />,
});
const GroupSession = dynamic(() => import("./dashboard/groupSession"), {
  loading: () => <PanelSkeleton className="min-h-[240px]" />,
});

function PanelSkeleton({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [showStats, setShowStats] = useState(true);

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <TopAnnouncement className="mt-2" />


      <section className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <ScheduleWidget />

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setShowStats((value) => !value)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={showStats}
              aria-controls="student-dashboard-stats"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">Quick progress</p>
                <p className="mt-1 text-xs text-slate-500">
                  Live totals for courses, sessions, exams, and ScholarPASS balance.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showStats ? "rotate-180" : ""}`}
                />
              </span>
            </button>
            {showStats && (
              <div id="student-dashboard-stats" className="border-t border-slate-100 px-5 py-5">
                <Stats />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <AssignedTutors />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <LearningGoals />
        <RecommendedCourses />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <CoursesInProgress />
        <Assignments />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Guardians />
        <GroupSession />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">All student tools</p>
            <p className="mt-1 text-xs text-slate-500">
              Move into the full dashboard modules when you need detail beyond the overview.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Link
              href="/lms/student-dashboard/my-courses"
              className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
            >
              My Courses
            </Link>
            <Link
              href="/lms/student-dashboard/exam"
              className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
            >
              Exams
            </Link>
            <Link
              href="/lms/student-dashboard/assignments"
              className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
            >
              Assignments
            </Link>
            <Link
              href="/learninghub"
              className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
            >
              LearningHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
