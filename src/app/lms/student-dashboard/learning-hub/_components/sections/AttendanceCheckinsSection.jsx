"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function AttendanceCheckinsSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("attendance-checkins");

  return (
    <SectionShell
      title={data?.title || "Attendance & Check-ins"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No attendance records"
      emptyDescription="Attendance and check-in history will appear here."
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="pb-3">Date</th>
              <th className="pb-3">Check In</th>
              <th className="pb-3">Check Out</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((entry, idx) => (
              <tr key={`${entry.date}-${idx}`}>
                <td className="py-3 font-semibold text-slate-700">{entry.date}</td>
                <td className="py-3 text-slate-600">{entry.actual_check_in_time || "Missing"}</td>
                <td className="py-3 text-slate-600">{entry.actual_check_out_time || "Pending"}</td>
                <td className="py-3 text-slate-600">{entry.check_out_status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

