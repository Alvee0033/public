"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function ContinueLearningSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("continue-learning");

  return (
    <SectionShell
      title={data?.title || "Continue Learning"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No active learning"
      emptyDescription="Enroll in a course to continue learning."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((course) => (
          <div key={course.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-900">{course.course_name || "Course"}</p>
            <p className="mt-2 text-xs text-slate-500">
              Enrolled: {course.enrolled_at ? new Date(course.enrolled_at).toLocaleDateString() : "N/A"}
            </p>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-sky-500"
                style={{ width: `${Math.max(0, Math.min(100, Number(course.completion_percentage || 0)))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

