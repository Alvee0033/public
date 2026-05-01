"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function ScholarshipSupportSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("scholarship-support");

  return (
    <SectionShell
      title={data?.title || "Scholarship Support"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No scholarship stats"
      emptyDescription="Scholarship wallet information will be shown here."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Wallet Balance</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            ${items[0]?.wallet_balance_usd ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Credit Received</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            ${items[0]?.credit_received_usd ?? 0}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

