"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function UpcomingHubSessionsSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("upcoming-sessions");

  return (
    <SectionShell
      title={data?.title || "Upcoming Hub Sessions"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No upcoming sessions"
      emptyDescription="Upcoming sessions will appear here."
    >
      <div className="space-y-0">
        {items.map((session, idx) => (
          <div key={`${session.title}-${idx}`} className="relative border-l border-slate-200 pl-6 pb-6">
            <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-sky-500" />
            <p className="text-sm font-bold text-slate-900">{session.title || "Session"}</p>
            <p className="mt-1 text-xs text-slate-500">
              Starts {session.starts_at ? new Date(session.starts_at).toLocaleString() : "TBD"}
            </p>
            <p className="text-xs text-slate-500">
              Ends {session.ends_at ? new Date(session.ends_at).toLocaleString() : "TBD"}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

