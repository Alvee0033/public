"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function MyTutorsMentorsSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("my-tutors-mentors");

  return (
    <SectionShell
      title={data?.title || "My Tutors & Mentors"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No tutor or mentor updates"
      emptyDescription="Assigned tutor and mentor notifications will appear here."
    >
      <div className="space-y-3">
        {items.map((person, idx) => (
          <div key={person.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {(person.title || `M${idx + 1}`).slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">{person.title || "Tutor/Mentor update"}</p>
              <p className="mt-1 text-xs text-slate-500">{person.message || "No details provided."}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

