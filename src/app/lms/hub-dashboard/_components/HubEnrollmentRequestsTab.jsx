"use client";

import { instance } from "@/lib/axios";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock3, RefreshCw, Search, UserCheck, Users } from "lucide-react";
import { hubDashboardFetcher as fetcher } from "./hub-dashboard-fetcher";
import { HubSelector } from "./HubSelector";
import { HubStatusBadge } from "./HubStatusBadge";

const STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
];

export function HubEnrollmentRequestsTab({ hubs }) {
  const searchParams = useSearchParams();
  const queryHubId = searchParams.get("hubId");
  const activeHubs = (Array.isArray(hubs) ? hubs : []).filter((hub) => hub.status === "active");
  const [selectedHubId, setSelectedHubId] = useState(
    activeHubs[0]?.id ? String(activeHubs[0].id) : "",
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (queryHubId && activeHubs.some((hub) => String(hub.id) === String(queryHubId))) {
      setSelectedHubId(String(queryHubId));
      return;
    }
    if (!selectedHubId && activeHubs[0]?.id) {
      setSelectedHubId(String(activeHubs[0].id));
    }
  }, [activeHubs, selectedHubId, queryHubId]);

  const requestUrl = useMemo(() => {
    if (!selectedHubId) return null;
    const params = new URLSearchParams();
    params.set("limit", "200");
    return `/learning-hub/${selectedHubId}/enrollment-requests?${params.toString()}`;
  }, [selectedHubId]);

  const { data, isLoading, mutate } = useSWR(requestUrl, fetcher);
  const payload =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data.items || data.counts ? data : data.data ?? data)
      : {};
  const allItems = Array.isArray(payload?.items) ? payload.items : [];

  const items = useMemo(() => {
    const queryText = query.trim().toLowerCase();
    return allItems.filter((request) => {
      const requestStatus = String(request?.status ?? "").toLowerCase();
      const fullName = `${request?.first_name ?? ""} ${request?.last_name ?? ""}`.trim().toLowerCase();
      const email = String(request?.email ?? "").toLowerCase();

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "pending" && requestStatus === "pending") ||
        (statusFilter === "approved" && requestStatus === "approved");

      if (!statusMatch) return false;
      if (!queryText) return true;
      return fullName.includes(queryText) || email.includes(queryText);
    });
  }, [allItems, query, statusFilter]);

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    for (const request of allItems) {
      const status = String(request?.status ?? "").toLowerCase();
      if (status === "pending") pending += 1;
      if (status === "approved") approved += 1;
    }
    return {
      all: allItems.length,
      pending,
      approved,
    };
  }, [allItems]);

  const handleReviewAction = async (request, status) => {
    const requestId = request?.id;
    const requestHubId = request?.hub_id ? String(request.hub_id) : selectedHubId;
    if (!requestHubId || !requestId) return;
    setActionLoadingId(requestId);
    setMessage("");
    try {
      await instance.patch(
        `/learning-hub/${requestHubId}/enrollment-requests/${requestId}/status`,
        { status },
      );
      setMessage(`Request moved to ${status}.`);
      await mutate();
      if (status === "approved") {
        window.location.href = `/lms/hub-dashboard?tab=students&hubId=${requestHubId}`;
        return;
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.message;
      setMessage(apiMessage || "Failed to update request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (activeHubs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Users className="h-6 w-6 text-slate-400" aria-hidden />
        </div>
        <p className="text-sm font-semibold text-slate-900">No active hubs available</p>
        <p className="mt-1 text-xs text-slate-500">
          Enrollment review opens when at least one hub is active.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Enrollment Requests</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review student enrollment requests and update status.
          </p>
        </div>
        <HubSelector
          hubs={activeHubs}
          selectedHubId={selectedHubId}
          onSelect={setSelectedHubId}
        />
      </div>

      {message ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} title="All" value={counts.all ?? 0} />
        <StatCard icon={Clock3} title="Pending" value={counts.pending ?? 0} />
        <StatCard icon={UserCheck} title="Approved" value={counts.approved ?? 0} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by student name or email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-300"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
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
              Loading requests...
            </div>
          ) : items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-900">No enrollment requests found</p>
              <p className="mt-1 text-xs text-slate-500">
                Try another filter or wait for new student requests.
              </p>
            </div>
          ) : (
            items.map((request) => {
              const fullName = `${request.first_name ?? ""} ${request.last_name ?? ""}`.trim();
              const isBusy = actionLoadingId === request.id;
              const normalizedStatus = String(request?.status ?? "").toLowerCase();
              return (
                <article key={request.id} className="px-5 py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">
                        {fullName || "Student"}
                      </p>
                      <p className="text-xs text-slate-500">{request.email || "No email"}</p>
                      <p className="text-[11px] text-slate-400">
                        Requested {request.created_at ? new Date(request.created_at).toLocaleString() : "N/A"}
                      </p>
                      {request.note ? (
                        <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          {request.note}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-start gap-2 lg:items-end">
                      <HubStatusBadge status={request.status} />
                      <div className="flex flex-wrap gap-2">
                        <ActionButton
                          label="Approve"
                          disabled={isBusy || normalizedStatus === "approved"}
                          onClick={() => handleReviewAction(request, "approved")}
                          tone="approve"
                        />
                        <ActionButton
                          label="Reject"
                          disabled={isBusy || normalizedStatus === "rejected"}
                          onClick={() => handleReviewAction(request, "rejected")}
                          tone="reject"
                        />
                      </div>
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

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
        <Icon className="h-4 w-4 text-slate-400" aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-black text-slate-900">{Number(value ?? 0)}</p>
    </div>
  );
}

function ActionButton({ label, onClick, disabled, tone }) {
  const toneClass =
    tone === "approve"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider disabled:opacity-50 ${toneClass}`}
    >
      {label}
    </button>
  );
}
