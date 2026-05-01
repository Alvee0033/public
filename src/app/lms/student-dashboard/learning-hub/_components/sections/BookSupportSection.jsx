"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function BookSupportSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("book-support");

  return (
    <SectionShell
      title={data?.title || "Book Support"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No support threads"
      emptyDescription="Support requests and updates will appear here."
    >
      <div className="space-y-3">
        {items.map((support) => (
          <div key={support.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-slate-900">{support.title || "Support update"}</p>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                Open
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600">{support.message || "No message available."}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

