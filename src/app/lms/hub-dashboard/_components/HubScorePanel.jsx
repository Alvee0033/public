"use client";

import useSWR from "swr";
import { hubDashboardFetcher as fetcher } from "./hub-dashboard-fetcher";
import {
  ArrowUpRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export function HubScorePanel({ hub }) {
  const { data: scoreData, isLoading, error } = useSWR(
    `/learning-hub/${hub.id}/score`,
    fetcher
  );

  const pct = Math.min(
    100,
    Math.round(((hub.hub_class_score ?? 0) / 150) * 100)
  );
  const tier =
    pct >= 93
      ? { label: "Class 150", color: "text-purple-600", next: null }
      : pct >= 73
        ? {
            label: "Gold",
            color: "text-yellow-600",
            next: "Class 150 requires 140+/150",
          }
        : pct >= 53
          ? {
              label: "Silver",
              color: "text-slate-500",
              next: "Gold requires 110+/150",
            }
          : pct >= 33
            ? {
                label: "Bronze",
                color: "text-orange-600",
                next: "Silver requires 80+/150",
              }
            : {
                label: "Starter",
                color: "text-slate-500",
                next: "Bronze requires 50+/150",
              };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{hub.hub_name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {[hub.city, hub.country_code].filter(Boolean).join(", ") || ""}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {hub.hub_class_score ?? 0}
              <span className="text-lg text-slate-300 font-semibold">/150</span>
            </div>
            <span className={`text-sm font-bold ${tier.color}`}>
              {tier.label}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${
                pct >= 80
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                  : pct >= 50
                    ? "bg-gradient-to-r from-amber-400 to-orange-400"
                    : "bg-gradient-to-r from-red-400 to-rose-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 uppercase tracking-wide">
            <span>0 — Starter</span>
            <span>50 — Bronze</span>
            <span>80 — Silver</span>
            <span>110 — Gold</span>
            <span>140 — Class 150</span>
          </div>
        </div>

        {tier.next && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs text-blue-800 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            Next milestone: {tier.next}
          </div>
        )}
      </div>

      <div className="p-6">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" aria-hidden />
          Score Breakdown &amp; Improvement Tips
        </h4>

        {isLoading ? (
          <div className="space-y-3 py-2" aria-busy="true">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 rounded-lg bg-slate-100 animate-pulse"
              />
            ))}
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              Loading breakdown…
            </p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            Could not load score breakdown. Refresh the page or try again
            later.
          </div>
        ) : scoreData?.breakdown ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Signal
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Earned
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Max
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    How to improve
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(scoreData.breakdown).map(([key, val]) => {
                  const earned = val.earned ?? 0;
                  const max = val.max ?? 1;
                  const ratio = earned / max;
                  const rowColor =
                    ratio === 1
                      ? "bg-emerald-50/60"
                      : ratio >= 0.5
                        ? "bg-amber-50/60"
                        : "bg-red-50/40";
                  const scoreColor =
                    ratio === 1
                      ? "text-emerald-700"
                      : ratio >= 0.5
                        ? "text-amber-700"
                        : "text-red-600";
                  return (
                    <tr
                      key={key}
                      className={`border-b border-slate-50 last:border-0 ${rowColor}`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-700 capitalize">
                        {key.replace(/_/g, " ")}
                      </td>
                      <td
                        className={`px-4 py-3 text-center font-bold ${scoreColor}`}
                      >
                        {earned}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-400 font-medium">
                        {max}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {val.note ??
                          (ratio === 1 ? "✓ Max points earned" : "—")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-6 text-sm text-slate-500 text-center">
            No breakdown data available yet.
          </div>
        )}
      </div>
    </div>
  );
}
