"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Home,
  ExternalLink,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { instance } from "@/lib/axios";
import {
  getLearningHubSection,
  learningHubOverview,
  learningHubSections,
} from "../_lib/hub-sections";
import { learningHubSectionComponents } from "./sections";

async function fetchLearningHubs() {
  const response = await instance.get("/learning-hub?page=1&limit=6", {
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
    phone: hub.contact_number || hub.phone || "",
  }));
}

function SectionCard({ section, index }) {
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/lms/student-dashboard/learning-hub/${section.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10"
      >
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-sky-100/50 blur-lg transition-all group-hover:bg-sky-200/60" />
            <div className="relative rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-3.5 text-white shadow-lg shadow-sky-200 transition-transform group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="rounded-full bg-slate-50 p-2 text-slate-300 transition-colors group-hover:bg-sky-50 group-hover:text-sky-500">
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600/80">
            {section.eyebrow}
          </p>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
            {section.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2">
            {section.description}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-1.5">
            {section.highlights.slice(0, 1).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                <Sparkles className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function LearningHubWorkspace({ sectionSlug = null }) {
  const activeSection =
    (sectionSlug ? getLearningHubSection(sectionSlug) : null) ?? learningHubOverview;
  const ActiveSectionComponent = learningHubSectionComponents[activeSection.slug] ?? null;
  const isOverview = activeSection.slug === "overview";
  const user = useAppSelector((state) => state.auth.user);
  const { data: hubs = [], isLoading } = useSWR(
    isOverview ? "student-learning-hub-directory-preview" : null,
    fetchLearningHubs,
    {
      dedupingInterval: 120000,
      revalidateOnFocus: false,
    },
  );

  const firstName =
    user?.first_name ||
    user?.full_name?.split(" ")?.[0] ||
    user?.name?.split(" ")?.[0] ||
    "Student";
  if (isOverview) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 pb-20 px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Learning Hub</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {firstName}, choose your workspace.
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Open one module at a time from your Learning Hub sections.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {learningHubSections.map((item, idx) => (
            <SectionCard key={item.slug} section={item} index={idx} />
          ))}
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Nearby hubs</h3>
            <Link href="/learninghub" className="text-xs font-semibold text-sky-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ) : hubs.length > 0 ? (
              <div className="text-sm text-slate-600">{hubs.length} hubs available near you.</div>
            ) : (
              <div className="text-sm text-slate-500">No nearby hubs found.</div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/lms/student-dashboard/learning-hub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Learning Hub</p>
            <h2 className="text-lg font-bold text-slate-900">{activeSection.title}</h2>
          </div>
        </div>
        {activeSection.actionHref ? (
          <Link
            href={activeSection.actionHref}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Home className="h-3.5 w-3.5" />
            {activeSection.actionLabel}
          </Link>
        ) : (
          <Link
            href="/lms/student-dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Dashboard
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection.slug}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {ActiveSectionComponent ? <ActiveSectionComponent /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
