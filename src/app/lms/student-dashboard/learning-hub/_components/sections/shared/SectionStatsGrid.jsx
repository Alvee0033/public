"use client";

export default function SectionStatsGrid({ stats = [] }) {
  if (!stats.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{stat.value ?? 0}</p>
        </div>
      ))}
    </div>
  );
}

