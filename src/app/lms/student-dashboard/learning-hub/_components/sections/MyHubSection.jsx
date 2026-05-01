"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function MyHubSection() {
  const { data, isLoading, error, summary, items } = useLearningHubSectionData("my-hub");

  return (
    <SectionShell
      title={data?.title || "My Hub"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No enrolled hubs"
      emptyDescription="You are not enrolled in any learning hub yet."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((hub) => (
          <article key={hub.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-slate-900">{hub.hub_name}</h4>
              {hub.is_primary && (
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  Primary
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {[hub.city, hub.state_code, hub.country_code].filter(Boolean).join(", ")}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-600">
              Class: {hub.hub_class_label || "N/A"} ({hub.hub_class_score ?? 0})
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

