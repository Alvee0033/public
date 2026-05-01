"use client";

export default function SectionEmptyState({ title = "No records found", description = "Nothing to show yet." }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
      <p className="text-base font-bold text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

