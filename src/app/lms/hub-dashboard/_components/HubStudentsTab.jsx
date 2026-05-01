"use client";

import Link from "next/link";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, RefreshCw, Search, UserRound, Users } from "lucide-react";
import { hubDashboardFetcher as fetcher } from "./hub-dashboard-fetcher";
import { HubSelector } from "./HubSelector";
import { HubStatusBadge } from "./HubStatusBadge";

const STUDENT_STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "approved", label: "Approved" },
  { id: "pending", label: "Pending" },
  { id: "waitlist", label: "Waitlist" },
  { id: "rejected", label: "Rejected" },
];

export function HubStudentsTab({ hubs }) {
  const searchParams = useSearchParams();
  const queryHubId = searchParams.get("hubId");
  const availableHubs = Array.isArray(hubs) ? hubs : [];
  const [selectedHubId, setSelectedHubId] = useState(
    availableHubs[0]?.id ? String(availableHubs[0].id) : "",
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (queryHubId && availableHubs.some((hub) => String(hub.id) === String(queryHubId))) {
      setSelectedHubId(String(queryHubId));
      return;
    }
    if (!selectedHubId && availableHubs[0]?.id) {
      setSelectedHubId(String(availableHubs[0].id));
    }
  }, [availableHubs, selectedHubId, queryHubId]);

  const url = useMemo(() => {
    if (!selectedHubId) return null;
    const params = new URLSearchParams();
    params.set("limit", "50");
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (query.trim()) params.set("q", query.trim());
    return `/learning-hub/${selectedHubId}/students?${params.toString()}`;
  }, [query, selectedHubId, statusFilter]);

  const { data, isLoading } = useSWR(url, fetcher);
  const payload =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data.items || data.counts ? data : data.data ?? data)
      : {};
  const students = Array.isArray(payload?.items) ? payload.items : [];
  const counts = payload?.counts ?? {};

  if (availableHubs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Users className="h-6 w-6 text-slate-400" aria-hidden />
        </div>
        <p className="text-sm font-semibold text-slate-900">No hubs available</p>
        <p className="mt-1 text-xs text-slate-500">
          Student management opens when at least one hub is available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Section</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage enrolled learners, track status, and monitor learning progress.
          </p>
        </div>
        <HubSelector
          hubs={availableHubs}
          selectedHubId={selectedHubId}
          onSelect={setSelectedHubId}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StudentStat title="Approved" value={counts.approved ?? 0} />
        <StudentStat title="Pending" value={counts.pending ?? 0} />
        <StudentStat title="Waitlist" value={counts.waitlist ?? 0} />
        <StudentStat title="Rejected" value={counts.rejected ?? 0} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search student by name or email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-300"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {STUDENT_STATUS_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStatusFilter(option.id)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest ${
                    statusFilter === option.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-slate-500">
              <RefreshCw className="h-4 w-4 animate-spin" aria-hidden />
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-900">No students found</p>
              <p className="mt-1 text-xs text-slate-500">
                Approved and pending requests, plus active enrollments, will appear here.
              </p>
            </div>
          ) : (
            students.map((student) => {
              const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();
              const status = String(student?.status ?? "").toLowerCase();
              return (
                <article
                  key={`${student.student_user_id}-${student.latest_request_id}`}
                  className="px-4 py-3"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <UserRound className="h-4 w-4 text-slate-500" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{fullName || "Student"}</p>
                        <p className="truncate text-xs text-slate-500">{student.email || "No email"}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Last request {student.requested_at ? new Date(student.requested_at).toLocaleString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <MetricChip label="Courses" value={Number(student.course_count ?? 0)} compact />
                      <MetricChip label="Progress" value={`${Number(student.avg_completion ?? 0)}%`} compact />
                      <div className="rounded-lg border border-slate-200 px-2.5 py-1.5">
                        <HubStatusBadge status={student.status} />
                      </div>
                      <Link
                        href={`/lms/hub-dashboard/students/${student.student_user_id}?hubId=${selectedHubId}&status=${status}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 hover:bg-blue-100"
                      >
                        View
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function StudentStat({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{Number(value ?? 0)}</p>
    </div>
  );
}

function MetricChip({ label, value, compact = false }) {
  if (compact) {
    return (
      <div className="rounded-lg border border-slate-200 px-2.5 py-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xs font-bold text-slate-900">{value}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
