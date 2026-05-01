"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, Users, Globe } from "lucide-react";
import axios from "@/lib/axios";

interface Institute {
  id: string;
  name: string;
  type: string;
  courses: number;
}

const GLOBAL_STATS = [
  { label: "Global Schools",      val: "500+",  icon: Globe },
  { label: "Verified Partners",   val: "100%",  icon: ShieldCheck },
  { label: "Student Placements",  val: "150K+", icon: Users },
];

export default function InstitutesMarketplaceSection() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function fetchInstitutes() {
      try {
        const res = await axios.get("/learning-hub", { params: { limit: 8, page: 1 } });
        const rawData = res?.data?.data;
        const hubs    = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.items) ? rawData.items : [];

        const items = hubs.slice(0, 4).map((hub: any) => ({
          id:      String(hub.id || ""),
          name:    hub.hub_name || hub.name || "Learning Hub",
          type:    hub.hub_class_label || "Learning Hub",
          courses: Array.isArray(hub.services_offered) ? hub.services_offered.length : 0,
        }));

        setInstitutes(items.filter((i: Institute) => i.id));
      } catch {
        setInstitutes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInstitutes();
  }, []);

  return (
    <section
      className="section-py relative overflow-hidden"
      style={{ background: "var(--sp-off)" }}
    >
      <div className="container">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "var(--sp-blue-light)", color: "var(--sp-navy)" }}
            >
              <Building2 className="w-3 h-3" aria-hidden="true" />
              Institutes Network
            </span>
            <h2 className="section-title">
              Top Tier{" "}
              <span style={{ color: "var(--sp-blue)" }}>Educational Partners.</span>
            </h2>
            <p className="section-sub mt-2">
              Connect with schools, colleges, and training centers across the globe. Streamlined admissions and scholarship tracking.
            </p>
          </div>

          <Link
            href="/institutes"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-[13.5px] font-bold border-2 transition-all flex-shrink-0"
            style={{ borderColor: "var(--sp-ink)", color: "var(--sp-ink)", background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-ink)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--sp-ink)"; }}
          >
            Browse All Institutes
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14" role="list" aria-label="Partner institutes">
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-56 bg-white rounded-xl border animate-pulse" style={{ borderColor: "var(--sp-border)" }} role="listitem" />
              ))
            : institutes.map((inst, i) => (
                <article
                  key={inst.id}
                  className="group flex flex-col items-center text-center p-7 bg-white rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{ borderColor: "var(--sp-border)", animationDelay: `${i * 60}ms` }}
                  role="listitem"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border transition-all duration-300 group-hover:border-[var(--sp-blue)] group-hover:text-[var(--sp-blue)]"
                    style={{ background: "var(--sp-off)", borderColor: "var(--sp-border)", color: "var(--sp-muted)" }}
                    aria-hidden="true"
                  >
                    <Building2 className="w-7 h-7" />
                  </div>

                  <h3 className="text-[14.5px] font-bold mb-1 line-clamp-2 group-hover:text-[var(--sp-blue)] transition-colors" style={{ color: "var(--sp-ink)" }}>
                    {inst.name}
                  </h3>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest mb-4"
                    style={{ color: "var(--sp-light)" }}
                  >
                    {inst.type}
                  </span>

                  <div className="w-full pt-4 border-t grid grid-cols-2 gap-4 mb-5" style={{ borderColor: "var(--sp-border)" }}>
                    <div>
                      <div className="text-[1.125rem] font-extrabold" style={{ color: "var(--sp-ink)" }}>{inst.courses || 12}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--sp-light)" }}>Courses</div>
                    </div>
                    <div>
                      <div className="text-[1.125rem] font-extrabold" style={{ color: "var(--sp-ink)" }}>48</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--sp-light)" }}>Scholars</div>
                    </div>
                  </div>

                  <Link
                    href={`/institutes/${inst.id}`}
                    className="w-full h-9 rounded-lg text-[12px] font-bold border transition-all inline-flex items-center justify-center"
                    style={{ borderColor: "var(--sp-border)", color: "var(--sp-blue)", background: "var(--sp-blue-light)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-blue)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-blue-light)"; e.currentTarget.style.color = "var(--sp-blue)"; }}
                  >
                    View Profile
                  </Link>
                </article>
              ))
          }
        </div>

        {/* Global stats strip */}
        <div
          className="flex flex-wrap justify-center gap-10 lg:gap-20 py-6 rounded-2xl border"
          style={{ background: "white", borderColor: "var(--sp-border)" }}
          aria-label="Global statistics"
        >
          {GLOBAL_STATS.map(({ label, val, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{ background: "var(--sp-off)", borderColor: "var(--sp-border)", color: "var(--sp-blue)" }}
                aria-hidden="true"
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[1.1875rem] font-extrabold tracking-tight" style={{ color: "var(--sp-ink)" }}>{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
