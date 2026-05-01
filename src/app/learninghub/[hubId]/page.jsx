"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import {
  ArrowLeft,
  MapPin,
  Star,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Mail,
  Phone,
  Globe,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCachedHub, setCachedHub } from "@/lib/hub-profile-cache";
import { HubProfileLocationMap } from "../_components/HubProfileLocationMap";

const ENROLL_STATUS_META = {
  pending: { label: "Request pending", className: "border-amber-200 bg-amber-50 text-amber-700" },
  waitlist: { label: "Waitlisted", className: "border-sky-200 bg-sky-50 text-sky-700" },
  approved: { label: "Enrolled", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", className: "border-rose-200 bg-rose-50 text-rose-700" },
};

export default function HubProfilePage() {
  const params = useParams();
  const hubId = params?.hubId;
  const initial = hubId ? getCachedHub(hubId) : null;
  const [hub, setHub] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [enrollStatusLoading, setEnrollStatusLoading] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState("");
  const [enrollRequestState, setEnrollRequestState] = useState({
    status: "not_requested",
    canApply: false,
    isPrimary: false,
  });

  useLayoutEffect(() => {
    if (!hubId) return;
    const cached = getCachedHub(hubId);
    if (cached) {
      setHub(cached);
      setLoading(false);
      setError("");
    } else {
      setHub(null);
      setLoading(true);
      setError("");
    }
  }, [hubId]);

  useEffect(() => {
    if (!hubId) return;
    if (getCachedHub(hubId)) return;
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`/learning-hub/${hubId}`);
        const data = res?.data?.data ?? res?.data;
        if (data) setCachedHub(hubId, data);
        if (mounted) setHub(data);
      } catch (e) {
        if (mounted) {
          setError(e?.response?.data?.message || "Hub not found or unavailable.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hubId]);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const token = localStorage.getItem("auth-token");
        const userData = localStorage.getItem("user");
        setIsAuthenticated(!!(token && userData));
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    if (!authChecked || !hub?.id) return;
    if (!isAuthenticated) {
      setEnrollRequestState({
        status: "not_requested",
        canApply: false,
        isPrimary: false,
      });
      setEnrollStatus("");
      return;
    }

    let mounted = true;
    setEnrollStatusLoading(true);
    (async () => {
      try {
        const res = await axios.get(
          `/learning-hub/${hub.id}/enroll-request/status`,
          {
            skipErrorLog: true,
            suppressErrorStatuses: [401, 404],
          },
        );
        const data = res?.data?.data ?? res?.data ?? {};
        if (!mounted) return;
        setEnrollRequestState({
          status: data.status || "not_requested",
          canApply: Boolean(data.can_apply),
          isPrimary: Boolean(data.is_primary),
        });
        setEnrollStatus(data.message || "");
      } catch {
        if (mounted) {
          setEnrollRequestState({
            status: "not_requested",
            canApply: true,
            isPrimary: false,
          });
          setEnrollStatus("");
        }
      } finally {
        if (mounted) setEnrollStatusLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authChecked, isAuthenticated, hub?.id]);

  const loc = hub
    ? [hub.city, hub.master_state?.name || hub.state_code, hub.master_country?.name || hub.country_code]
        .filter(Boolean)
        .join(", ")
    : "";

  const hasCoords =
    hub?.latitude != null &&
    hub?.longitude != null &&
    Number.isFinite(Number(hub.latitude)) &&
    Number.isFinite(Number(hub.longitude));

  const handleEnrollRequest = async () => {
    if (
      !hub?.id ||
      !isAuthenticated ||
      enrollSubmitting ||
      !enrollRequestState.canApply
    ) {
      return;
    }
    setEnrollSubmitting(true);
    setEnrollStatus("");
    try {
      const res = await axios.post(
        `/learning-hub/${hub.id}/enroll-request`,
        {},
        {
          suppressErrorStatuses: [409],
        },
      );
      const message =
        res?.data?.message ||
        "Enrollment request submitted and sent for hub review.";
      setEnrollRequestState({
        status: "pending",
        canApply: false,
        isPrimary: false,
      });
      setEnrollStatus(message);
    } catch (e) {
      if (e?.response?.status === 409) {
        setEnrollRequestState({
          status: "pending",
          canApply: false,
          isPrimary: false,
        });
        setEnrollStatus(
          "Enrollment request already submitted. Please wait for hub review.",
        );
        return;
      }
      setEnrollStatus(
        e?.response?.data?.message ||
          "Unable to submit enrollment right now. Please try again.",
      );
    } finally {
      setEnrollSubmitting(false);
    }
  };

  const enrollMeta = ENROLL_STATUS_META[enrollRequestState.status] || null;
  const enrollButtonLabel = enrollSubmitting
    ? "Submitting..."
    : enrollStatusLoading
      ? "Checking..."
      : enrollRequestState.status === "approved"
        ? "Enrolled"
        : enrollRequestState.status === "pending"
          ? "Request Pending"
          : enrollRequestState.status === "waitlist"
            ? "Waitlisted"
            : enrollRequestState.status === "rejected"
              ? "Apply Again"
              : "Enroll";

  const googleMapsExternal = hasCoords
    ? `https://www.google.com/maps?q=${Number(hub.latitude)},${Number(hub.longitude)}&z=14`
    : null;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-slate-50">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--sp-blue)] border-t-transparent" />
      </div>
    );
  }

  if (error || !hub) {
    return (
      <div className="mx-auto max-w-md px-3 py-12 text-center">
        <p className="text-sm text-red-600">{error || "Hub unavailable."}</p>
        <Button asChild size="sm" className="mt-4 h-8 bg-[var(--sp-blue)] text-xs text-white">
          <Link href="/learninghub">Back to directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-1.5 py-1 sm:px-2 sm:py-1.5">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5 rounded-md border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/90 px-2 py-1.5 shadow-sm">
          <Link
            href="/learninghub"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--sp-blue)] hover:underline"
          >
            <ArrowLeft className="h-3 w-3 shrink-0" />
            HubOS directory
          </Link>
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-500">#{hub.id}</span>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="relative h-28 w-full bg-slate-100 sm:h-32">
            {hub.hub_logo_url ? (
              <Image src={hub.hub_logo_url} alt="" fill className="object-cover" priority />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Sparkles className="h-12 w-12 text-slate-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5">
              <div className="flex flex-wrap items-center gap-1">
                <Badge className="h-4 border-amber-200 bg-amber-50 px-1 py-0 text-[9px] text-amber-900">
                  {hub.hub_class_label}
                </Badge>
                {hub.featured ? (
                  <Badge variant="secondary" className="h-4 px-1 py-0 text-[9px]">
                    Featured
                  </Badge>
                ) : null}
                {hub.featured_city_rank ? (
                  <Badge className="h-4 bg-emerald-100 px-1 py-0 text-[9px] text-emerald-800">
                    Featured Hub
                  </Badge>
                ) : null}
              </div>
              <h1 className="mt-1 text-base font-bold leading-snug tracking-tight text-white sm:text-lg">{hub.hub_name}</h1>
              <p className="mt-0.5 flex items-start gap-1 text-[10px] leading-snug text-slate-200">
                <MapPin className="mt-0.5 h-2.5 w-2.5 shrink-0" />
                <span className="line-clamp-2">{loc || hub.address_line1}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-2 p-2 lg:grid-cols-3 lg:gap-3">
            <div className="space-y-2 lg:col-span-2">
              <section className="rounded-md border border-slate-200 bg-slate-50/50 p-2">
                <h2 className="text-[9px] font-bold uppercase tracking-wide text-slate-500">About</h2>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-700">
                  {hub.hub_description ||
                    "This LearningHub offers local programs. Contact the hub for schedules and scholarships."}
                </p>
              </section>

              <section className="grid gap-1.5 sm:grid-cols-3">
                <div className="rounded-md border border-slate-200 p-2">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[10px] font-semibold">Hub Rank</span>
                  </div>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {hub.hub_rank_score ?? 0}
                    <span className="text-[10px] text-slate-400">/100</span>
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-2">
                  <div className="text-[10px] font-semibold text-slate-500">City rank</div>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {hub.city_rank_position ?? "—"}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-2">
                  <div className="text-[10px] font-semibold text-slate-500">Country rank</div>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {hub.country_rank_position ?? "—"}
                  </p>
                </div>
              </section>

              {Array.isArray(hub.partner_institutes) && hub.partner_institutes.length > 0 ? (
                <section className="rounded-md border border-slate-200 p-2">
                  <h2 className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Partner Institutes</h2>
                  <div className="mt-2 grid gap-2">
                    {hub.partner_institutes.map((partner, index) => {
                      const institute = partner?.institute ?? partner;
                      return (
                        <div
                          key={`${institute?.institute_id ?? index}`}
                          className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5"
                        >
                          <div className="text-[11px] font-semibold text-slate-800">
                            {institute?.canonical_name ?? "Partner Institute"}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {partner.partnership_type} · {institute?.country_code} · {institute?.tier}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {Array.isArray(hub.partner_programs) && hub.partner_programs.length > 0 ? (
                <section className="rounded-md border border-slate-200 p-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Institute-Linked Programs
                    </h2>
                    <span className="text-[9px] text-slate-400">
                      {hub.partner_programs.length} published programs
                    </span>
                  </div>
                  <div className="mt-2 grid gap-2">
                    {hub.partner_programs.slice(0, 8).map((program, index) => (
                      <div
                        key={`${program?.id ?? index}`}
                        className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[11px] font-semibold text-slate-800">
                              {program?.name ?? "Program"}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {[
                                program?.institute_name,
                                program?.degree_level,
                                program?.delivery_mode,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </div>
                          </div>
                          {program?.confidence_score ? (
                            <div className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 ring-1 ring-slate-200">
                              {program.confidence_score}
                            </div>
                          ) : null}
                        </div>
                        {(program?.tuition_text || program?.application_deadline) ? (
                          <div className="mt-1 text-[10px] text-slate-500">
                            {[program?.tuition_text, program?.application_deadline]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1">
                  <h2 className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Location</h2>
                  {googleMapsExternal ? (
                    <a
                      href={googleMapsExternal}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] font-semibold text-[var(--sp-blue)] hover:underline"
                    >
                      Google Maps
                    </a>
                  ) : null}
                </div>
                <div className="p-1.5">
                  <HubProfileLocationMap hub={hub} />
                </div>
              </section>

              <section className="rounded-md border border-slate-200 p-2">
                <h2 className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Photos</h2>
                <div className="mt-1.5 grid grid-cols-3 gap-1">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-slate-100 ring-1 ring-slate-200">
                    {hub.hub_logo_url ? (
                      <Image src={hub.hub_logo_url} alt="" fill className="object-cover" sizes="120px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-400">Logo</div>
                    )}
                  </div>
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex aspect-[4/3] items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-[10px] text-slate-400"
                    >
                      +{i}
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-1.5 sm:grid-cols-2">
                <div className="rounded-md border border-slate-200 p-2">
                  <div className="flex items-center gap-1 text-slate-500">
                    <GraduationCap className="h-3.5 w-3.5 text-violet-600" />
                    <span className="text-[10px] font-semibold">Tutors</span>
                  </div>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">{hub.tutor_count ?? 0}</p>
                  <p className="text-[9px] text-slate-500">Network</p>
                </div>
                <div className="rounded-md border border-slate-200 p-2">
                  <div className="flex items-center gap-1 text-slate-500">
                    <BookOpen className="h-3.5 w-3.5 text-[var(--sp-blue)]" />
                    <span className="text-[10px] font-semibold">Courses</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-600">ScholarPASS catalog</p>
                  <Button asChild size="sm" variant="outline" className="mt-1.5 h-6 border-slate-200 px-2 text-[10px]">
                    <Link href="/learninghub/course-list">Browse</Link>
                  </Button>
                </div>
              </section>

              <section className="rounded-md border border-slate-200 p-2">
                <h2 className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Reviews</h2>
                <div className="mt-1 flex items-center gap-1.5">
                  <Star className="h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-lg font-bold leading-none text-slate-900">
                      {(Number(hub.avg_rating) || 0).toFixed(1)}
                      <span className="text-xs font-normal text-slate-500"> /5</span>
                    </p>
                    <p className="text-[9px] text-slate-500">Aggregate</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-1.5">
              <div className="rounded-md border border-emerald-200 bg-emerald-50/80 p-2">
                <div className="flex items-center gap-1 text-emerald-800">
                  <Award className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-[10px] font-bold">Scholarships</span>
                </div>
                <p className="mt-0.5 text-[10px] leading-snug text-emerald-900/90">
                  Varies by program — apply via ScholarPASS or contact the hub.
                </p>
              </div>

              <div className="rounded-md border border-slate-200 p-2">
                <h3 className="text-[10px] font-bold text-slate-900">Services</h3>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {(hub.services_offered?.length ? hub.services_offered : ["Programs"]).map((s) => (
                    <span key={s} className="rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 space-y-0.5 text-[10px] text-slate-700">
                  {hub.email ? (
                    <a href={`mailto:${hub.email}`} className="flex items-center gap-1 hover:text-[var(--sp-blue)]">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{hub.email}</span>
                    </a>
                  ) : null}
                  {hub.phone_number ? (
                    <a href={`tel:${hub.phone_number}`} className="flex items-center gap-1 hover:text-[var(--sp-blue)]">
                      <Phone className="h-3 w-3 shrink-0" />
                      {hub.phone_number}
                    </a>
                  ) : null}
                  {hub.website_url ? (
                    <a
                      href={hub.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-[var(--sp-blue)]"
                    >
                      <Globe className="h-3 w-3 shrink-0" />
                      Website
                    </a>
                  ) : null}
                </div>
              </div>

              <div
                id="enroll"
                className="rounded-lg border border-amber-200 bg-gradient-to-b from-amber-50 to-amber-50/70 p-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-amber-950">Enroll</h3>
                  {enrollMeta ? (
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${enrollMeta.className}`}>
                      {enrollMeta.label}
                    </span>
                  ) : null}
                </div>
                {!authChecked ? (
                  <p className="mt-1 text-[11px] text-amber-900/80">Checking session…</p>
                ) : isAuthenticated ? (
                  <>
                    <p className="mt-1 text-[11px] leading-relaxed text-amber-900/90">
                      Submit your enrollment request. The hub team will review it in their dashboard.
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button
                        onClick={handleEnrollRequest}
                        disabled={
                          enrollSubmitting ||
                          enrollStatusLoading ||
                          !enrollRequestState.canApply
                        }
                        className="h-9 w-full bg-[var(--sp-blue)] px-3 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {enrollButtonLabel}
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-9 w-full border-amber-300 bg-white/80 px-3 text-xs font-semibold text-amber-900 hover:bg-white"
                      >
                        <Link href="/lms/student-dashboard/learning-hub/my-hub">
                          Open My Hub
                        </Link>
                      </Button>
                    </div>
                    {enrollStatus ? (
                      <p className="mt-2 text-[11px] leading-relaxed text-amber-900/90">
                        {enrollStatus}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-[11px] leading-relaxed text-amber-900/90">
                      Sign in to submit enrollment. Requests go to hub review.
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button
                        asChild
                        className="h-9 w-full bg-[var(--sp-blue)] px-3 text-xs font-semibold text-white"
                      >
                        <Link href={`/login?next=/learninghub/${hub.id}`}>Login</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-9 w-full border-amber-300 bg-white/80 px-3 text-xs font-semibold text-amber-900 hover:bg-white"
                      >
                        <Link href="/register?role=student">Create account</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
