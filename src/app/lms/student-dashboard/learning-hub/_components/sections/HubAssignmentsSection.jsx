"use client";

import SectionShell from "./shared/SectionShell";
import { useLearningHubSectionData } from "./shared/useLearningHubSectionData";

export default function HubAssignmentsSection() {
  const { data, isLoading, error, summary, items } =
    useLearningHubSectionData("assignments");

  return (
    <SectionShell
      title={data?.title || "Hub Assignments"}
      summary={summary}
      isLoading={isLoading}
      error={error}
      items={items}
      emptyTitle="No assignments yet"
      emptyDescription="New assignments will be listed here."
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Points</th>
              <th className="pb-3">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((assignment) => (
              <tr key={assignment.id}>
                <td className="py-3 font-semibold text-slate-700">{assignment.title}</td>
                <td className="py-3 text-slate-600">{assignment.assignment_points ?? 0}</td>
                <td className="py-3 text-slate-600">
                  {assignment.due_date ? new Date(assignment.due_date).toLocaleString() : "TBD"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

