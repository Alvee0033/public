"use client";

import Link from "next/link";
import useSWR from "swr";
import { ArrowRight, Compass, MapPin, Sparkles } from "lucide-react";
import { instance } from "@/lib/axios";

const fetchLearningHubs = async () => {
  const response = await instance.get("/learning-hub?page=1&limit=4", {
    skipErrorLog: true,
    suppressErrorStatuses: [401, 403, 404],
  });
  const raw = response?.data?.data ?? response?.data ?? [];
  const items = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.items)
      ? raw.items
      : [];

  return items.map((hub, index) => ({
    id: hub.id ?? `hub-${index + 1}`,
    name: hub.hub_name || hub.name || "Learning Hub",
    city: hub.city || hub.master_city?.name || "",
    state: hub.state_code || hub.master_state?.name || "",
    country: hub.country_code || hub.master_country?.name || "",
    type: hub.hub_class_label || "Learning Hub",
    services: Array.isArray(hub.services_offered) ? hub.services_offered : [],
    score: Number(hub.hub_class_score ?? 0),
    status: hub.status || "active",
  }));
};

export default function LearningHubWidget() {
  const { data: hubs = [], isLoading, error } = useSWR(
    "student-dashboard-learning-hubs",
    fetchLearningHubs,
    {
      dedupingInterval: 120000,
      revalidateOnFocus: false,
    },
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Learning Hubs</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Explore nearby hub spaces, local support, and community-led learning access.
          </p>
        </div>
        <div className="rounded-xl bg-sky-50 p-2 text-sky-700">
          <Compass className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-100 p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          ))
        ) : error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Learning Hub data is unavailable right now.
          </div>
        ) : hubs.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            No hubs surfaced yet. Open the directory to browse the wider network.
          </div>
        ) : (
          hubs.map((hub) => (
            <div
              key={hub.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-sky-200 hover:bg-sky-50/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{hub.name}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {[hub.city, hub.state, hub.country].filter(Boolean).join(", ") || "Location pending"}
                    </span>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  {hub.type}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(hub.services.length > 0 ? hub.services.slice(0, 2) : ["Local tutoring"]).map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
                  >
                    {service}
                  </span>
                ))}
                {hub.score > 0 && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Hub Score {hub.score}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link
          href="/learninghub"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Browse Directory
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/learninghub/course-list"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          Hub Courses
          <Sparkles className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
