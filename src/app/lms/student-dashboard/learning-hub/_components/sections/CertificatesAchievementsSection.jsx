"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function CertificatesAchievementsSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("certificates-achievements");

  return (
    <SectionShell
      title={data?.title || "Certificates & Achievements"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No certificates yet"
      emptyDescription="Completed courses and achievements will appear here."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((cert) => (
          <div key={cert.id} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
              Completed
            </span>
            <p className="text-sm font-bold text-slate-900">{cert.course_name || "Achievement"}</p>
            <p className="mt-1 text-xs text-slate-500">
              Completed: {cert.completed_at ? new Date(cert.completed_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

