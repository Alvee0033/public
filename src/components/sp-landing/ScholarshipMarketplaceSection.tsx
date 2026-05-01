"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search, ArrowRight, Trophy, Calendar, DollarSign,
  GraduationCap, Sparkles, TrendingUp,
} from "lucide-react";
import Link from "next/link";

const TABS = ["All", "STEM", "Arts", "Sports", "Needs-Based"];

type ProgramCard = {
  id: number | string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  match: number;
  tags: string[];
  image: string;
  color: string;
  colorLight: string;
};

function pickColor(index: number) {
  const palette = [
    { color: "var(--sp-blue)", colorLight: "var(--sp-blue-light)" },
    { color: "var(--sp-purple)", colorLight: "var(--sp-purple-light)" },
    { color: "var(--sp-orange)", colorLight: "var(--sp-orange-light)" },
  ];
  return palette[index % palette.length];
}

function mapProgramToCard(item: any, index: number): ProgramCard {
  const institute = item?.institute?.canonical_name || item?.institute?.match_key || "Verified Institute";
  const match = Math.max(70, Math.min(99, Number(item?.confidence_score || 85)));
  const dept = String(item?.department || "General").trim();
  const degree = String(item?.degree_level || "").replace(/_/g, " ");
  const tags = [dept, degree || "Program"].filter(Boolean).slice(0, 2);
  const { color, colorLight } = pickColor(index);
  const rawLogo = String(item?.institute?.logo_url || "").trim();
  const logo = rawLogo.startsWith("http://") || rawLogo.startsWith("https://")
    ? rawLogo
    : rawLogo.startsWith("/")
      ? `http://localhost:4050${rawLogo}`
      : "/images/logo/scholarpass-logo.png";

  return {
    id: item?.id || `program-${index}`,
    title: item?.name || "Untitled Program",
    provider: institute,
    amount: item?.tuition_text || "Funding info on request",
    deadline: item?.application_deadline || "Open intake",
    category: dept || "General",
    match,
    tags,
    image: logo,
    color,
    colorLight,
  };
}

async function fetchEduMarketPrograms() {
  const attempts = [
    { status: "approved", limit: 60 },
    { status: "published", limit: 60 },
    { limit: 60 },
  ];

  for (const params of attempts) {
    try {
      const qs = new URLSearchParams({
        page: "1",
        ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
      });
      const res = await fetch(`/api/v1/program-aggregation/program-records?${qs.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      const payload = json?.data || json;
      const items = Array.isArray(payload?.items) ? payload.items : [];
      if (items.length > 0) return items;
    } catch {
      // try next fallback query
    }
  }
  return [];
}

export default function ScholarshipMarketplaceSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState<ProgramCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const items = await fetchEduMarketPrograms();
        const ranked = (Array.isArray(items) ? items : [])
          .filter((item) => item?.id && item?.name)
          .sort((a, b) => Number(b?.confidence_score || 0) - Number(a?.confidence_score || 0))
          .slice(0, 3)
          .map(mapProgramToCard);
        if (mounted) setCards(ranked);
      } catch {
        if (mounted) setCards([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleCards = useMemo(() => {
    const safeCards = Array.isArray(cards) ? cards : [];
    const q = searchTerm.trim().toLowerCase();
    return safeCards.filter((item) => {
      const safeTags = Array.isArray(item?.tags) ? item.tags : [];
      const tabOk =
        activeTab === "all" ||
        String(item?.category || "").toLowerCase().includes(activeTab) ||
        safeTags.some((t) => String(t || "").toLowerCase().includes(activeTab));
      const searchOk =
        !q ||
        String(item?.title || "").toLowerCase().includes(q) ||
        String(item?.provider || "").toLowerCase().includes(q) ||
        String(item?.category || "").toLowerCase().includes(q) ||
        safeTags.some((t) => String(t || "").toLowerCase().includes(q));
      return tabOk && searchOk;
    });
  }, [cards, activeTab, searchTerm]);

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container">

        {/* ── Header row ──────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-white"
                style={{ background: "var(--sp-orange)" }}
              >
                <TrendingUp className="w-3 h-3" />
                Marketplace
              </span>
            </div>
            <h2 className="section-title">
              Curated Fundings.{" "}
              <span className="gradient-sp-text">Matched by AI.</span>
            </h2>
            <p className="text-[14px] leading-relaxed max-w-md" style={{ color: "var(--sp-muted)" }}>
              Thousands of verified opportunities tailored to your unique profile.
            </p>
          </div>

          {/* Tab filters */}
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((tab) => {
              const active = activeTab === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                  style={
                    active
                      ? { background: "var(--sp-blue)", color: "#fff" }
                      : { background: "var(--sp-blue-light)", color: "var(--sp-blue-deep)" }
                  }
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Search bar ──────────────────────────────────────────── */}
        <div className="relative mb-10 max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--sp-light)" }}
          />
          <input
            type="text"
            className="w-full pl-11 pr-36 h-11 bg-[#F8FAFC] border rounded-xl text-[13px] text-[#0F1A24] placeholder:text-[#94A3B8] focus:outline-none transition-all"
            style={{ borderColor: "var(--sp-border)" }}
            placeholder="Search by keyword, provider, or major…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--sp-blue)"; e.currentTarget.style.background = "#fff"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--sp-border)"; e.currentTarget.style.background = "#F8FAFC"; }}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-4 rounded-lg text-[11px] font-bold text-white uppercase tracking-wide"
            style={{ background: "var(--sp-blue)" }}
          >
            Find Matches
          </button>
        </div>

        {/* ── Cards grid ──────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? [] : (Array.isArray(visibleCards) ? visibleCards : [])).map((item, idx) => (
            <div
              key={item.id}
              className="sp-card flex flex-col overflow-hidden group"
              style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both` }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-contain bg-white p-4 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/logo/scholarpass-logo.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Match badge */}
                <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" style={{ color: item.color }} />
                  <span className="text-[10px] font-bold" style={{ color: "var(--sp-ink)" }}>
                    {item.match}% Match
                  </span>
                </div>

                {/* Category */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide"
                    style={{ background: item.color }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-grow gap-3.5">
                <div>
                  <h3
                    className="text-[15px] font-bold leading-snug mb-0.5 transition-colors"
                    style={{ color: "var(--sp-ink)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = item.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sp-ink)")}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[12px] font-medium" style={{ color: "var(--sp-light)" }}>
                    {item.provider}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: item.colorLight }}
                    >
                      <DollarSign className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--sp-light)" }}>Amount</div>
                      <div className="text-[13px] font-bold" style={{ color: "var(--sp-ink)" }}>{item.amount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F8FAFC]">
                      <Calendar className="w-3.5 h-3.5" style={{ color: "var(--sp-muted)" }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--sp-light)" }}>Deadline</div>
                      <div className="text-[13px] font-bold" style={{ color: "var(--sp-ink)" }}>{item.deadline}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(item?.tags) ? item.tags : []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide border"
                      style={{
                        background: item.colorLight,
                        color: item.color,
                        borderColor: `${item.color}30`,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Apply CTA */}
                <div className="mt-auto pt-1">
                  <Link
                    href={`/courses/program/${item.id}`}
                    className="w-full h-9 rounded-lg text-[12px] font-semibold text-white flex items-center justify-center gap-2 group/btn transition-all"
                    style={{ background: item.color }}
                  >
                    View Program
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && visibleCards.length === 0 ? (
          <div className="mt-6 text-center text-sm" style={{ color: "var(--sp-muted)" }}>
            No real matched programs found for this filter.
          </div>
        ) : null}

        {/* Footer nudge */}
        <div className="mt-10 text-center">
          <p className="text-[13px]" style={{ color: "var(--sp-light)" }}>
            Can&apos;t find what you&apos;re looking for?{" "}
            <button
              className="font-semibold hover:underline"
              style={{ color: "var(--sp-blue)" }}
            >
              Talk to our AI Counselors
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
