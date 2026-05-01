"use client";

import SectionStatsGrid from "./SectionStatsGrid";
import SectionEmptyState from "./SectionEmptyState";

export default function SectionShell({
  title,
  summary,
  isLoading,
  error,
  items,
  emptyTitle,
  emptyDescription,
  children,
}) {
  if (isLoading) {
    return <div className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-slate-50" />;
  }

  return (
    <div className="space-y-6">
      <SectionStatsGrid stats={summary?.stats || []} />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <div className="mt-5">
          {!error && Array.isArray(items) && items.length > 0 ? (
            children
          ) : (
            <SectionEmptyState
              title={emptyTitle}
              description={emptyDescription}
            />
          )}
        </div>
      </section>
    </div>
  );
}

