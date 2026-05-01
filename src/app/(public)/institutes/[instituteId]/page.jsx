"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  ShieldCheck,
  Trophy,
  GraduationCap,
  Users,
  Calendar,
  Sparkles,
  Search,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

function getNormalizedLogoUrl(logoUrl) {
  if (!logoUrl) return null;
  const normalized = String(logoUrl).trim();
  if (!normalized) return null;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) return normalized;
  if (normalized.startsWith("//")) return `https:${normalized}`;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(normalized)) return `https://${normalized}`;
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

export default function InstituteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchId = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/institute-directory/public/institutes/${params.instituteId}`);
        setInstitute(res?.data?.data ?? res?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.instituteId) fetchId();
  }, [params.instituteId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--sp-purple)] border-t-transparent" />
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading High-Density Profile...</p>
        </div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="h-20 w-20 mb-8 rounded-[2rem] bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-inner">
           <Search className="h-10 w-10 opacity-20" />
        </div>
        <h2 className="text-2xl font-black text-[var(--sp-ink)]">Profile Not Found</h2>
        <p className="mt-2 text-slate-500 max-w-sm">The institution you are looking for may have been delisted or its verification has expired.</p>
        <Button variant="outline" className="mt-8 rounded-full border-2" onClick={() => router.push("/institutes")}>Back to Directory</Button>
      </div>
    );
  }

  const logoSources = getLogoSources(institute);
  const bestRank = institute.global_rank_qs || institute.global_rank_the || null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 relative overflow-hidden pb-32">
       {/* Background Wash */}
       <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(134,101,170,.05) 0%, transparent 60%)," +
                          "radial-gradient(ellipse 50% 50% at 0% 100%, rgba(40,132,171,.05) 0%, transparent 60%)",
            }}
          />
       </div>

       {/* Top Navigation Bar */}
       <div className="sticky top-0 z-[60] w-full bg-white/70 backdrop-blur-3xl border-b border-slate-200/50 px-6 h-16 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => router.push("/institutes")} 
            className="flex items-center gap-2 group text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--sp-purple)] transition-colors"
          >
             <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
             Back to Explorer
          </button>
          
          <div className="flex items-center gap-4">
             <Button className="h-9 px-6 pb-0.5 rounded-full bg-[var(--sp-purple)] text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[var(--sp-purple)]/20 hover:scale-105 active:scale-95 transition-all">
                Check Eligibility
             </Button>
          </div>
       </div>

       <div className="container relative z-10 mx-auto px-4 lg:px-12 mt-8 flex w-full flex-col gap-8">
          
          {/* Stunning Luxury Hero Profile */}
          <div className="relative w-full overflow-hidden rounded-[4rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-12 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-20">
             <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(134,101,170,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(40,132,171,0.12),_transparent_35%)]" />
             
             <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20 text-center lg:text-left">
                {/* Floating Super-Logo */}
                <div className="relative group">
                   <div className="h-32 w-32 overflow-hidden rounded-[3rem] bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.10)] ring-1 ring-slate-200 transition-transform duration-500 group-hover:scale-105 lg:h-48 lg:w-48">
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-100 via-white to-slate-50 shadow-inner">
                        <div className="absolute inset-0 flex items-center justify-center text-5xl lg:text-7xl font-black text-slate-300">
                          {getInitials(institute.canonical_name)}
                        </div>
                        {logoSources.primary ? (
                          <img
                            src={logoSources.primary}
                            alt=""
                            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform group-hover:scale-110"
                            data-logo-step="0"
                            data-logo-fallback={logoSources.fallback || ""}
                            data-logo-final-fallback={logoSources.finalFallback || ""}
                            onError={handleLogoLoadError}
                          />
                        ) : null}
                      </div>
                   </div>
                   {bestRank && (
                     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-5 py-2 text-[10px] font-black uppercase tracking-[.2em] text-slate-900 shadow-xl ring-4 ring-white lg:left-full lg:-translate-x-3/4">
                        Ranked #{bestRank}
                     </div>
                   )}
                </div>

                <div className="flex-1 flex flex-col gap-6">
                   <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                         <Badge className="border-0 bg-[var(--sp-purple)]/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--sp-purple)] ring-1 ring-[var(--sp-purple)]/15">
                            {institute.institute_type?.replace(/_/g, " ") || "Institution"}
                         </Badge>
                         <Badge className="border-0 bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-200">
                            Verified Status
                         </Badge>
                      </div>

                      <h1 className="text-4xl font-display font-black leading-tight tracking-tight text-[var(--sp-ink)] lg:text-6xl">
                         {institute.canonical_name}
                      </h1>

                      <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 lg:justify-start">
                         <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[var(--sp-purple)]" />
                            {institute.city}, {institute.state_code || institute.country_code}
                         </div>
                         <div className="hidden sm:flex items-center gap-2">
                            <Globe className="h-4 w-4 text-[var(--sp-blue)]" />
                            {institute.website_url ? String(institute.website_url).replace(/^https?:\/\/(www\.)?/, "") : "Internal Network"}
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {[
                        { label: 'Accreditation', value: institute.accreditation_status || 'Accredited', icon: ShieldCheck, color: 'text-emerald-400' },
                        { label: 'World Ranking', value: bestRank ? `#${bestRank}` : 'Unranked', icon: Trophy, color: 'text-amber-400' },
                        { label: 'Students', value: '15,000+', icon: Users, color: 'text-sky-400' },
                        { label: 'Scholarships', value: '45 Active', icon: GraduationCap, color: 'text-purple-400' },
                      ].map((stat, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50">
                           <stat.icon className={cn("h-5 w-5 mb-3", stat.color)} />
                           <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                           <div className="mt-1 text-sm font-black text-[var(--sp-ink)]">{stat.value}</div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Detailed View Split */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
             
             {/* Main Content Area */}
             <div className="space-y-12">
                
                {/* About Section */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-1 bg-[var(--sp-purple)] rounded-full" />
                      <h2 className="text-2xl font-black text-[var(--sp-ink)]">About the Institution</h2>
                   </div>
                   <div className="text-base text-slate-600 leading-relaxed space-y-4 font-medium opacity-90">
                      <p>
                         {institute.canonical_name} is a premier educational institution recognized globally for its commitment to academic excellence and research innovation. Located in {institute.city}, it provides a diverse array of programs across multiple disciplines.
                      </p>
                      <p>
                         As a certified member of the ScholarPASS directory, this institution meets our highest standards for accreditation, student success metrics, and global compliance.
                      </p>
                   </div>
                </section>

                {/* Statistics & Insights */}
                <section className="grid md:grid-cols-2 gap-6">
                   <div className="rounded-[2.5rem] bg-white p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="h-12 w-12 rounded-2xl bg-[var(--sp-purple-light)]/20 flex items-center justify-center text-[var(--sp-purple)] mb-6">
                         <Sparkles className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-black text-[var(--sp-ink)] mb-4">International Focus</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                         One of the top-tier institutions for international students, offering specialized support for visa processing, housing, and career placement globally.
                      </p>
                   </div>
                   <div className="rounded-[2.5rem] bg-white p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6">
                         <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-black text-[var(--sp-ink)] mb-4">Program Catalog</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                         Features an extensive catalog of over 200+ undergraduate and postgraduate programs, including high-demand STEM and Management tracks.
                      </p>
                   </div>
                </section>
             </div>

             {/* Sidebar Area */}
             <div className="space-y-8">
                
                {/* Interaction Card */}
                <div className="group relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                   <div className="absolute right-0 top-0 p-4 opacity-[0.06]">
                      <Building2 className="h-32 w-32 text-[var(--sp-purple)]" />
                   </div>
                   <div className="relative space-y-6">
                      <div className="space-y-2">
                         <h3 className="text-2xl font-black leading-tight text-[var(--sp-ink)]">Start Your <br /> Application</h3>
                         <p className="text-sm leading-relaxed text-slate-500">Let our expert counselors guide you through the admission process for {institute.canonical_name}.</p>
                      </div>
                      
                      <div className="space-y-3">
                         <Button className="h-14 w-full rounded-2xl bg-[var(--sp-purple)] text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[var(--sp-purple)]/20 transition-all hover:bg-[var(--sp-purple-deep)]">
                            Apply Direct via Pass
                         </Button>
                         <Button variant="outline" className="h-14 w-full rounded-2xl border-2 border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-700 transition-all hover:bg-slate-50">
                            Request Counseling
                         </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-6">
                         <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Global Code</span>
                            <span className="text-xs font-mono text-[var(--sp-ink)]">{institute.institute_id?.split('-')[0]}</span>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Access Key</span>
                            <span className="text-xs font-mono text-[var(--sp-ink)]">DIR-{bestRank || '99'}</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Contact Micro Panel */}
                <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sp-purple)]">Contact Essentials</h4>
                   <div className="space-y-4">
                      {institute.website_url && (
                        <a href={institute.website_url} target="_blank" className="flex items-center gap-4 group hover:bg-slate-50 p-3 -m-3 rounded-2xl transition-all">
                           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:text-[var(--sp-purple)] group-hover:bg-white shadow group-hover:shadow-md transition-all">
                              <ExternalLink className="h-4 w-4" />
                           </div>
                           <div className="flex-1">
                              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Official Site</div>
                              <div className="text-xs font-black truncate text-[var(--sp-ink)]">{String(institute.website_url).replace(/^https?:\/\/(www\.)?/, "")}</div>
                           </div>
                        </a>
                      )}
                      <div className="flex items-center gap-4 p-3 -m-3 rounded-2xl cursor-default">
                         <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <Mail className="h-4 w-4" />
                         </div>
                         <div className="flex-1">
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inquiry Channel</div>
                            <div className="text-xs font-black text-slate-600">Verified by ScholarPASS</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
