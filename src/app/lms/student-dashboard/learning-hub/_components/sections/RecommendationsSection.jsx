"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function RecommendationsSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("recommendations");

  return (
    <SectionShell
      title={data?.title || "Recommendations"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No recommendations yet"
      emptyDescription="Recommended courses and next steps will appear here."
    >
      <div className="space-y-3">
        {items.map((rec, idx) => (
          <div key={rec.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {idx + 1}
            </span>
            <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">{rec.title}</p>
            <p className="mt-1 text-xs text-slate-500">Mode: {rec.delivery_mode || "N/A"}</p>
            <p className="mt-1 text-xs font-semibold text-slate-700">${rec.price_usd ?? 0}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

