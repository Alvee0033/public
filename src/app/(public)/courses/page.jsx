"use client";

import { useEffect, useMemo, useState } from "react";
import Link from 'next/link'
import { Search, Star, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from '@/lib/axios'

function initialsFromInstitute(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "ED";
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
}

function getNormalizedLogoUrl(logoUrl = "") {
  const normalized = String(logoUrl || "").trim();
  if (!normalized) return null;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) return normalized;
  if (normalized.startsWith("//")) return `https:${normalized}`;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(normalized)) return `https://${normalized}`;
  return null;
}

function getHostnameFromWebsite(websiteUrl = "") {
  const trimmed = String(websiteUrl || "").trim();
  if (!trimmed) return null;
  const normalizedWebsite = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(normalizedWebsite).hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}

function getLogoSources(instituteLogoUrl = "", websiteUrl = "") {
  const directLogo = getNormalizedLogoUrl(instituteLogoUrl);
  const hostname = getHostnameFromWebsite(websiteUrl);
  const faviconLogo = hostname ? `https://icons.duckduckgo.com/ip3/${hostname}.ico` : null;
  const clearbitLogo = hostname ? `https://logo.clearbit.com/${hostname}` : null;

  return {
    // Faster: direct -> favicon -> clearbit
    primary: directLogo || faviconLogo || clearbitLogo,
    fallback: !directLogo && faviconLogo ? clearbitLogo : directLogo ? faviconLogo : null,
    finalFallback:
      clearbitLogo && clearbitLogo !== directLogo && clearbitLogo !== faviconLogo
        ? clearbitLogo
        : null,
  };
}

function handleLogoLoad(event) {
  const image = event.currentTarget;
  const fallbackText = image.parentElement?.querySelector("[data-logo-initials]");
  if (fallbackText) fallbackText.style.opacity = "0";
}

function handleLogoLoadError(event) {
  const image = event.currentTarget;
  const currentStep = Number(image.dataset.logoStep || "0");
  const fallback = image.dataset.logoFallback;
  const finalFallback = image.dataset.logoFinalFallback;

  if (currentStep === 0 && fallback) {
    image.dataset.logoStep = "1";
    image.src = fallback;
    return;
  }

  if (currentStep <= 1 && finalFallback) {
    image.dataset.logoStep = "2";
    image.src = finalFallback;
    return;
  }

  image.style.display = "none";
  const fallbackText = image.parentElement?.querySelector("[data-logo-initials]");
  if (fallbackText) fallbackText.style.opacity = "1";
}

function formatDegreeLabel(value = "") {
  const text = String(value || "").replace(/_/g, " ").trim();
  if (!text) return "Program";
  return text.replace(/\b\w/g, (m) => m.toUpperCase());
}

function mapProgramToCard(item) {
  const instituteName = item?.institute?.canonical_name || item?.institute?.match_key || "Partner Institute";
  const degree = formatDegreeLabel(item?.degree_level);
  const category = item?.department || degree;

  return {
    id: item.id,
    title: item?.name || "Untitled Program",
    institute: instituteName,
    instituteLogo: item?.institute?.logo_url || null,
    category,
    level: degree,
    duration: item?.duration_text || "Flexible",
    deliveryMode: item?.delivery_mode || "on-campus",
    rating: Number((item?.confidence_score || 0) / 20).toFixed(1),
    confidence: item?.confidence_score || 0,
    tuitionText: item?.tuition_text || "Contact institute",
    sourceUrl: item?.source_url || item?.institute?.website_url || "#",
  };
}

export default function CoursesPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [degree, setDegree] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");

  useEffect(() => {
    let mounted = true;
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/program-aggregation/program-records', {
          params: {
            page: 1,
            limit: 100,
            status: 'approved',
          },
          skipErrorLog: true,
        });

        const payload = response?.data?.data;
        const items = Array.isArray(payload?.items) ? payload.items : [];
        if (mounted) setRecords(items.map(mapProgramToCard));
      } catch {
        if (mounted) setRecords([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPrograms();
    return () => {
      mounted = false;
    };
  }, []);

  const degreeOptions = useMemo(() => {
    const unique = Array.from(new Set(records.map((r) => r.level).filter(Boolean)));
    return unique.slice(0, 20);
  }, [records]);

  const visibleCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = records.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.institute.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesDegree = degree === "all" || item.level === degree;
      return matchesSearch && matchesDegree;
    });

    if (sortBy === "confidence") {
      result = result.sort((a, b) => b.confidence - a.confidence);
    } else if (sortBy === "title") {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [records, search, degree, sortBy]);

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-14 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-900 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white h-4 w-4" />
              </div>
              <span className="text-lg font-black text-indigo-950 tracking-tighter uppercase">EduMarket</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/matching-profile">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-lg h-9 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100/50">
                  Get Matched
                </Button>
              </Link>
            </div>
          </div>

          <div className="py-3 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                placeholder="Search real university programs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl h-11 pl-12 pr-4 text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/5 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={degree} onValueChange={setDegree}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-600 text-[10px] px-4 w-full md:w-44 focus:ring-4 focus:ring-indigo-600/5">
                  <SelectValue placeholder="Degree" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="all">All Degrees</SelectItem>
                  {degreeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-600 text-[10px] px-4 w-full md:w-36 focus:ring-4 focus:ring-indigo-600/5">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="confidence">Highest Confidence</SelectItem>
                  <SelectItem value="title">A-Z Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Live Program Opportunities</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {loading ? 'Loading…' : `${visibleCourses.length} approved programs available`}
              </p>
            </div>
          </div>

          {!loading && visibleCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-10 text-center text-slate-500 font-semibold">
              No programs found for this filter.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCourses.map((course, index) => (
                <div key={course.id} className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-100 p-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem]">
                    {(() => {
                      const logo = getLogoSources(course.instituteLogo, course.sourceUrl);
                      return (
                        <div className="w-full h-full bg-white relative flex items-center justify-center">
                          <div
                            data-logo-initials
                            className="absolute inset-0 flex items-center justify-center text-xl font-black text-slate-700 transition-opacity duration-150"
                            style={{ opacity: 1 }}
                          >
                            {initialsFromInstitute(course.institute)}
                          </div>
                          {logo.primary ? (
                            <img
                              src={logo.primary}
                              alt={`${course.institute} logo`}
                              className="w-full h-full object-contain bg-white p-6 group-hover:scale-105 transition-transform duration-700"
                              loading={index < 6 ? "eager" : "lazy"}
                              fetchPriority={index < 6 ? "high" : "auto"}
                              decoding="async"
                              data-logo-step="0"
                              data-logo-fallback={logo.fallback || ""}
                              data-logo-final-fallback={logo.finalFallback || ""}
                              onLoad={handleLogoLoad}
                              onError={handleLogoLoadError}
                            />
                          ) : null}
                        </div>
                      );
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <Badge className="bg-white/95 backdrop-blur text-indigo-900 border-none font-black text-[8px] uppercase tracking-widest px-2 py-1 rounded-md">
                        {course.level}
                      </Badge>
                      <div className="bg-amber-400 text-indigo-950 text-[9px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5 fill-indigo-950" />
                        {course.confidence}%
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{course.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[9px] font-black text-slate-900">{course.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{course.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-tighter line-clamp-1">{course.institute}</p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400">{course.duration}</span>
                        <span className="text-sm font-black text-slate-900 leading-none mt-1 line-clamp-1">{course.tuitionText}</span>
                      </div>
                      <Link
                        href={`/courses/program/${course.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-indigo-600 text-white h-9 px-4 text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        View Program
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
