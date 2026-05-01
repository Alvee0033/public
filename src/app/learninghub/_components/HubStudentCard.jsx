"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Award, Building2, CheckCircle2, GraduationCap, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { prefetchHubProfile } from "@/lib/hub-profile-cache";
import { cn } from "@/lib/utils";

export function HubStudentCard({ hub, highlight, onSelect, className, style }) {
  const router = useRouter();
  const detailHref = `/learninghub/${hub.id}`;
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          router.prefetch(detailHref);
          prefetchHubProfile(hub.id);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [detailHref, hub.id, router]);

  const warmNavigate = () => {
    prefetchHubProfile(hub.id);
  };

  const handleCardClick = (e) => {
    const el = e.target instanceof Element ? e.target : e.target.parentElement;
    if (el?.closest("a, button")) return;
    onSelect?.(hub.id);
  };

  const loc = [hub.city, hub.master_state?.name || hub.state_code, hub.master_country?.name || hub.country_code]
    .filter(Boolean)
    .join(", ");
  const isOpen = typeof hub.open_now === "boolean" ? hub.open_now : Boolean(hub.phone_number);
  const studentCount = Number(hub.student_count || 0);
  const tutorCount = Number(hub.tutor_count || 0);
  const rating = Number(hub.avg_rating || 0);
  const rankLabel = hub.city_rank_position || hub.country_rank_position;

  return (
    <div
      ref={cardRef}
      role="presentation"
      onClick={handleCardClick}
      onMouseEnter={warmNavigate}
      style={style}
      className={cn(
        "group relative flex w-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-[2rem] border transition-all duration-500",
        highlight
          ? "border-[var(--sp-blue)] bg-white ring-4 ring-[var(--sp-blue)]/5 shadow-[0_32px_64px_rgba(40,132,171,0.12)]"
          : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-[0_32px_64px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      {/* Cover Image Section */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        {hub.cover_image_url ? (
          <img
            src={hub.cover_image_url}
            alt=""
            loading="lazy"
            decodings="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Building2 className="h-12 w-12 text-slate-400" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating Badges */}
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5">
          {hub.featured && (
            <Badge className="border-0 bg-amber-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-950 shadow-lg">
              Featured
            </Badge>
          )}
          <Badge className="border-0 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-md">
            {hub.hub_class_label || "Hub"}
          </Badge>
        </div>

        {rankLabel && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
            <Award className="h-3 w-3 text-amber-400" />
            #{rankLabel}
          </div>
        )}
      </div>

      {/* Profile & Info Section */}
      <div className="relative flex flex-1 flex-col px-5 pb-6">
        <div className="relative z-20 -mt-6 flex items-end justify-between">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50">
              {hub.hub_logo_url ? (
                <img 
                  src={hub.hub_logo_url} 
                  alt="" 
                  loading="lazy"
                  decodings="async"
                  className="h-full w-full object-contain" 
                />
              ) : (
                <Building2 className="h-6 w-6 text-[var(--sp-blue)]" />
              )}
            </div>
          </div>
          <Badge
            className={cn(
              "mb-1 border-0 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider shadow-sm",
              isOpen ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
            )}
          >
            {isOpen ? "Open Now" : "Closed"}
          </Badge>
        </div>

        <div className="mt-4 flex-1">
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[var(--sp-ink)] transition-colors group-hover:text-[var(--sp-blue)]">
            {hub.hub_name}
          </h3>
          
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{loc || hub.address_line1 || "Location hidden"}</span>
          </div>

          {/* Minimal Stats Grid */}
          <div className="mt-6 grid grid-cols-3 items-center gap-4 border-y border-slate-50 py-4">
            <div className="text-center">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Students</span>
              <span className="mt-1 block text-sm font-bold text-slate-900">{studentCount.toLocaleString()}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Tutors</span>
              <span className="mt-1 block text-sm font-bold text-slate-900">{tutorCount.toLocaleString()}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Rating</span>
              <span className="mt-1 flex items-center justify-center gap-0.5 text-sm font-bold text-slate-900">
                {rating.toFixed(1)}
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {hub.services_offered?.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500 transition-colors group-hover:bg-sky-50 group-hover:text-[var(--sp-blue)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={detailHref}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-[var(--sp-blue)] hover:shadow-sky-100 group-hover:translate-y-0"
        >
          Explore Hub
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>

  );
}
