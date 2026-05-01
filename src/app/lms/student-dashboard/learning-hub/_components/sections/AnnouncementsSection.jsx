"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function AnnouncementsSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("announcements");

  return (
    <SectionShell
      title={data?.title || "Announcements"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No announcements"
      emptyDescription="Hub announcements will show up here."
    >
      <div className="space-y-3">
        {items.map((announcement) => (
          <article key={announcement.id} className="rounded-xl border-l-4 border-l-slate-800 border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-slate-900">{announcement.title}</p>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                {announcement.priority || "normal"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{announcement.message}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

