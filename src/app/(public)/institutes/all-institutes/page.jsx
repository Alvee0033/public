"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ChevronRight,
  Navigation,
  Globe2,
  GraduationCap
} from "lucide-react";

const PAGE_SIZE = 12;

const INSTITUTE_TYPES = [
  { value: "", label: "All Types" },
  { value: "university", label: "University" },
  { value: "college", label: "College" },
  { value: "school", label: "School" },
  { value: "vocational", label: "Vocational" },
  { value: "coaching_center", label: "Coaching Center" },
];

const ACCREDITATION_STATUSES = [
  { value: "", label: "All Accreditations" },
  { value: "accredited", label: "Accredited" },
  { value: "unaccredited", label: "Unaccredited" },
  { value: "expired", label: "Expired" },
  { value: "unknown", label: "Unknown" },
];

function getNormalizedLogoUrl(logoUrl) {
  if (!logoUrl) return null;
  const normalized = String(logoUrl).trim();
  if (!normalized) return null;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  if (normalized.startsWith("//")) {
    return `https:${normalized}`;
  }
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(normalized)) {
    return `https://${normalized}`;
  }
  return null;
}

function getHostnameFromWebsite(websiteUrl) {
  if (!websiteUrl) return null;
  const trimmed = String(websiteUrl).trim();
  if (!trimmed) return null;
  const normalizedWebsite = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(normalizedWebsite).hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}

function getLogoSources(institute) {
  const directLogo = getNormalizedLogoUrl(institute?.logo_url);
  const hostname = getHostnameFromWebsite(institute?.website_url);
  const clearbitLogo = hostname ? `https://logo.clearbit.com/${hostname}` : null;
  const faviconLogo = hostname ? `https://icons.duckduckgo.com/ip3/${hostname}.ico` : null;

  return {
    primary: directLogo || clearbitLogo || faviconLogo,
    fallback: !directLogo && clearbitLogo ? faviconLogo : directLogo ? clearbitLogo : null,
    finalFallback: faviconLogo && faviconLogo !== directLogo && faviconLogo !== clearbitLogo ? faviconLogo : null,
  };
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
}

function getInitials(name) {
  return String(name || "Institute")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function InstitutesAllPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [institutes, setInstitutes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [countryCode, setCountryCode] = useState("");
  const [instituteType, setInstituteType] = useState("");
  const [accreditationStatus, setAccreditationStatus] = useState("");
  const [rankedOnly, setRankedOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("/institute-directory/public/institutes/countries", {
          params: { ranked_only: rankedOnly },
        });
        const payload = response?.data?.data ?? response?.data;
        setCountries(Array.isArray(payload) ? payload : []);
      } catch {
        setCountries([]);
      }
    };
    fetchCountries();
  }, [rankedOnly]);

  const fetchInstitutes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/institute-directory/public/institutes", {
        params: {
          page: currentPage,
          limit: PAGE_SIZE,
          search: search || undefined,
          country_code: countryCode || undefined,
          institute_type: instituteType || undefined,
          accreditation_status: accreditationStatus || undefined,
          ranked_only: rankedOnly,
        },
      });
      const payload = response?.data?.data ?? response?.data;
      setInstitutes(Array.isArray(payload?.items) ? payload.items : []);
      setTotal(Number(payload?.total || 0));
    } catch (error) {
      setInstitutes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, countryCode, instituteType, accreditationStatus, rankedOnly, currentPage]);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  const appliedFiltersCount = useMemo(
    () => [search, countryCode, instituteType, accreditationStatus].filter(Boolean).length,
    [search, countryCode, instituteType, accreditationStatus],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 relative overflow-hidden pb-20">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(134,101,170,.08) 0%, transparent 60%)," +
                        "radial-gradient(ellipse 50% 50% at 0% 100%, rgba(40,132,171,.08) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8 mt-4 flex w-full flex-col gap-3">
        <div className="flex flex-col items-center text-center justify-center gap-3 mb-2 mt-4">
           <Badge className="bg-[var(--sp-purple)]/5 text-[var(--sp-purple)] border-0 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ring-1 ring-[var(--sp-purple)]/10">
              Global Institute Directory
           </Badge>
           <h1 className="text-2xl md:text-4xl font-display font-black leading-tight text-[var(--sp-ink)] max-w-2xl tracking-tight">
              Explore World-Class <span className="text-[var(--sp-purple)]">Academic Excellence</span>
           </h1>
        </div>

        <div className="sticky top-4 z-50 flex flex-col items-center w-full">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center w-full max-w-6xl rounded-2xl border border-white/40 bg-white/80 backdrop-blur-3xl p-1 gap-1 shadow-[0_15px_40px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.03]">
            <div className="flex-1 min-w-0 relative group/field">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <Search className="h-4 w-4 text-[var(--sp-purple)]" />
               </div>
               <input
                 type="text"
                 value={search}
                 onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
                 placeholder="Find Institute..."
                 className="h-12 w-full rounded-xl border-0 bg-transparent pl-11 pr-4 text-xs font-bold text-slate-700 outline-none hover:bg-black/5 transition-all placeholder:text-slate-400"
               />
            </div>
            <div className="hidden lg:block w-px h-8 bg-slate-200/60 self-center" />
            <div className="flex-1 min-w-0 relative group/field">
               <Globe className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover/field:text-[var(--sp-purple)] transition-colors" />
               <select
                 value={countryCode}
                 onChange={(e) => {setCountryCode(e.target.value); setCurrentPage(1);}}
                 className="h-12 w-full appearance-none rounded-xl border-0 bg-transparent pl-10 pr-10 text-xs font-bold text-slate-700 outline-none hover:bg-black/5 transition-all text-ellipsis"
               >
                 <option value="">All Countries</option>
                 {countries.map((c) => (
                   <option key={c.country_code} value={c.country_code}>{c.country_code}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <ChevronRight className="h-3 w-3 text-slate-300 rotate-90" />
               </div>
            </div>
            <div className="hidden lg:block w-px h-8 bg-slate-200/60 self-center" />
            <div className="flex-1 min-w-0 relative group/field">
               <Building2 className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover/field:text-[var(--sp-purple)] transition-colors" />
               <select
                 value={instituteType}
                 onChange={(e) => {setInstituteType(e.target.value); setCurrentPage(1);}}
                 className="h-12 w-full appearance-none rounded-xl border-0 bg-transparent pl-10 pr-10 text-xs font-bold text-slate-700 outline-none hover:bg-black/5 transition-all text-ellipsis"
               >
                 {INSTITUTE_TYPES.map((t) => (
                   <option key={t.value} value={t.value}>{t.label}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <ChevronRight className="h-3 w-3 text-slate-300 rotate-90" />
               </div>
            </div>
            <div className="hidden lg:block w-px h-8 bg-slate-200/60 self-center" />
            <div className="flex-1 min-w-0 relative group/field">
               <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover/field:text-[var(--sp-purple)] transition-colors" />
               <select
                 value={accreditationStatus}
                 onChange={(e) => {setAccreditationStatus(e.target.value); setCurrentPage(1);}}
                 className="h-12 w-full appearance-none rounded-xl border-0 bg-transparent pl-10 pr-10 text-xs font-bold text-slate-700 outline-none hover:bg-black/5 transition-all text-ellipsis"
               >
                 {ACCREDITATION_STATUSES.map((t) => (
                   <option key={t.value} value={t.value}>{t.label}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <ChevronRight className="h-3 w-3 text-slate-300 rotate-90" />
               </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 px-2 py-1 lg:py-0 bg-slate-50/50 lg:bg-transparent rounded-xl lg:rounded-none mt-1 lg:mt-0">
               <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                    showFilters ? 'bg-[var(--sp-ink)] text-white shadow-lg' : 'text-slate-500 hover:bg-black/5 hover:text-black'
                  )}
               >
                  <SlidersHorizontal className="h-4 w-4" />
               </button>
               <button
                type="button"
                onClick={fetchInstitutes}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-10 bg-[var(--sp-purple)] rounded-xl px-8 text-[11px] font-black uppercase tracking-widest text-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#8665aa]/20"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
              {appliedFiltersCount > 0 && (
                <button
                  type="button"
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition-all"
                  onClick={() => {
                    setSearch(""); setCountryCode(""); setInstituteType(""); setAccreditationStatus(""); setRankedOnly(true); setCurrentPage(1);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 flex items-center gap-4 rounded-full border border-white/20 bg-white/70 backdrop-blur-2xl px-6 py-3 shadow-xl">
               <label className="flex cursor-pointer items-center gap-3">
                 <input
                   type="checkbox"
                   checked={rankedOnly}
                   onChange={(e) => {setRankedOnly(e.target.checked); setCurrentPage(1);}}
                   className="h-4 w-4 rounded-md border-slate-300 text-[var(--sp-purple)] focus:ring-[var(--sp-purple)]"
                 />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Show Global Ranked Only</span>
               </label>
               <div className="h-4 w-px bg-slate-200" />
               <span className="text-[10px] font-bold text-slate-400">Filtering through {total.toLocaleString()} records</span>
            </div>
          )}
        </div>

        <div className="mt-8 pb-20">
          {loading ? (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="h-[280px] animate-pulse rounded-3xl bg-white border border-slate-100 shadow-sm" />
              ))}
            </div>
          ) : institutes.length ? (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {institutes.map((institute, index) => {
                const bestRank = institute.global_rank_qs || institute.global_rank_the || null;
                const logoSources = getLogoSources(institute);
                return (
                  <div 
                    key={institute.institute_id} 
                    className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#E8EDF2] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer shadow-sm"
                    onClick={() => router.push(`/institutes/${institute.institute_id}`)}
                  >
                    <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gradient-to-tr from-[var(--sp-purple)] via-[#8665aa] to-[var(--sp-blue)] bg-[length:200%_200%]">
                       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150" />
                       <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                          {bestRank && (
                            <Badge className="border-0 bg-white/95 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-amber-600 shadow-lg ring-1 ring-black/5">
                              Rank #{bestRank}
                            </Badge>
                          )}
                          <Badge className="border-0 bg-[var(--sp-ink)]/90 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white shadow-lg">
                            {String(institute.institute_type || "institute").replace(/_/g, " ")}
                          </Badge>
                       </div>
                    </div>
                    <div className="relative -mt-6 mb-1 px-4 z-20">
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/80 backdrop-blur-xl p-1 shadow-[0_8px_20px_rgba(0,0,0,0.08)] ring-1 ring-white/50 transition-transform duration-500 group-hover:scale-110">
                        <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-black">
                          <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-white/20">
                            {getInitials(institute.canonical_name)}
                          </div>
                          {logoSources.primary ? (
                            <img
                              src={logoSources.primary}
                              alt=""
                              className="absolute inset-0 h-full w-full object-contain bg-white p-1"
                              loading="lazy"
                              onError={handleLogoLoadError}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col px-4 pb-4 z-10 relative bg-white">
                      <h3 className="line-clamp-2 break-words text-[0.96rem] font-black tracking-tight leading-snug text-[var(--sp-ink)] group-hover:text-[var(--sp-purple)] transition-colors mb-2">
                        {institute.canonical_name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--sp-muted)]/60 uppercase tracking-wider mb-4">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        <span className="line-clamp-1">{institute.state_city || institute.country_code || "Location unknown"}</span>
                      </div>
                      <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-slate-100">
                         <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">
                            <div className="flex items-center gap-1.5">
                               <Sparkles className="h-3 w-3 text-[var(--sp-purple)]" />
                               {institute.accreditation_status || "Standard"}
                            </div>
                            <div className="flex items-center gap-1.5 text-[var(--sp-blue)] bg-[var(--sp-blue)]/5 px-2 py-0.5 rounded-full">
                               <Globe className="h-2.5 w-2.5" />
                               {institute.country_code}
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <h3 className="text-xl font-black text-[var(--sp-ink)]">No results found</h3>
              <p className="mt-2 text-sm text-[var(--sp-muted)]">Try adjusting your filters.</p>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <Pagination>
                <PaginationContent className="bg-white/80 backdrop-blur-md rounded-full border border-slate-200 p-1 shadow-lg ring-1 ring-black/5">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={cn(
                        "cursor-pointer rounded-full h-10 px-4 text-[10px] font-black uppercase tracking-widest transition-all",
                        currentPage === 1 ? "pointer-events-none opacity-30" : "hover:bg-slate-100"
                      )}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={cn(
                        "cursor-pointer rounded-full h-10 px-4 text-[10px] font-black uppercase tracking-widest transition-all",
                        currentPage === totalPages ? "pointer-events-none opacity-30" : "hover:bg-slate-100"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
