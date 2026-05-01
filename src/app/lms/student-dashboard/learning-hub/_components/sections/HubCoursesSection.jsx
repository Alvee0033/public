"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function HubCoursesSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("hub-courses");

  return (
    <SectionShell
      title={data?.title || "Hub Courses"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No courses found"
      emptyDescription="Hub course catalog will appear here."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((course) => (
          <div key={course.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-900">{course.title}</p>
            <p className="mt-1 text-xs text-slate-500">Price: ${course.price_usd ?? 0}</p>
            {course.scholarship_eligible && (
              <span className="mt-2 inline-flex rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold text-violet-700">
                Scholarship Eligible
              </span>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

