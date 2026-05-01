"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { ArrowLeft, Building2, Globe, MapPin, CalendarClock, Languages, CheckCircle2, ExternalLink, ShieldCheck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDegreeLabel(value = "") {
  const text = String(value || "").replace(/_/g, " ").trim();
  if (!text) return "Program";
  return text.replace(/\b\w/g, (m) => m.toUpperCase());
}

function parsePayload(payload) {
  if (!payload || typeof payload !== "object") return [];
  return Object.entries(payload)
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
    .slice(0, 20);
}

function getHostnameFromUrl(input = "") {
  const text = String(input || "").trim();
  if (!text) return null;
  const normalized = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    return new URL(normalized).hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}

function normalizeLogoUrl(logoUrl = "") {
  const text = String(logoUrl || "").trim();
  if (!text) return null;
  if (/^https?:\/\//i.test(text)) return text;
  if (text.startsWith("//")) return `https:${text}`;
  return null;
}

function getLogoSources(record) {
  const direct = normalizeLogoUrl(record?.institute?.logo_url || "");
  const sourceHost = getHostnameFromUrl(record?.source_url || record?.institute?.website_url || "");
  const favicon = sourceHost ? `https://icons.duckduckgo.com/ip3/${sourceHost}.ico` : null;
  const clearbit = sourceHost ? `https://logo.clearbit.com/${sourceHost}` : null;
  return {
    primary: direct || favicon || clearbit,
    fallback: direct ? favicon : clearbit,
    finalFallback: clearbit,
  };
}

function initialsFromInstitute(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "IN";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
}

export default function ProgramDetailsPage() {
  const params = useParams();
  const programId = params?.programId;

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchRecord = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/program-aggregation/program-records/${programId}`, {
          skipErrorLog: true,
        });
        const item = response?.data?.data || null;
        if (mounted) setRecord(item);
      } catch {
        if (mounted) {
          setError("Failed to load program details.");
          setRecord(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (programId) fetchRecord();
    return () => {
      mounted = false;
    };
  }, [programId]);

  const metaRows = useMemo(() => {
    if (!record) return [];
    return [
      ["Degree Level", formatDegreeLabel(record.degree_level)],
      ["Department", record.department || "N/A"],
      ["Delivery Mode", record.delivery_mode || "N/A"],
      ["Duration", record.duration_text || "N/A"],
      ["Tuition", record.tuition_text || "N/A"],
      ["Language", record.language || "N/A"],
      ["Application Deadline", record.application_deadline || "N/A"],
      ["Campus / Location", record.campus_or_location || "N/A"],
      ["Confidence Score", `${record.confidence_score ?? 0}%`],
      ["Status", record.status || "N/A"],
    ];
  }, [record]);

  const payloadRows = useMemo(() => parsePayload(record?.extraction_payload_json), [record]);
  const logo = useMemo(() => getLogoSources(record), [record]);
  const instituteName = record?.institute?.canonical_name || "Unknown Institute";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to EduMarket
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center font-semibold text-slate-500">
            Loading program details...
          </div>
        ) : error || !record ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 font-semibold">
            {error || "Program not found."}
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-[0_15px_40px_rgba(2,8,23,0.05)]">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-lg font-black text-slate-700">{initialsFromInstitute(instituteName)}</span>
                    {logo.primary ? (
                      <img
                        src={logo.primary}
                        alt={`${instituteName} logo`}
                        className="absolute inset-0 h-full w-full object-contain bg-white p-2"
                        onError={(event) => {
                          const image = event.currentTarget;
                          const step = Number(image.dataset.step || "0");
                          if (step === 0 && logo.fallback) {
                            image.dataset.step = "1";
                            image.src = logo.fallback;
                            return;
                          }
                          if (step <= 1 && logo.finalFallback && image.src !== logo.finalFallback) {
                            image.dataset.step = "2";
                            image.src = logo.finalFallback;
                            return;
                          }
                          image.style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">{formatDegreeLabel(record.degree_level)}</Badge>
                      <Badge variant="outline" className="border-slate-300 text-slate-700 inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        {record.status}
                      </Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{record.name}</h1>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p className="inline-flex items-center gap-2"><Building2 className="h-4 w-4" />{instituteName}</p>
                      <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{record?.campus_or_location || record?.institute?.country_code || "Location Unknown"}</p>
                      {record.source_url ? (
                        <a
                          href={record.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 break-all text-indigo-700 hover:text-indigo-800"
                        >
                          <Globe className="h-4 w-4" />
                          {record.source_url}
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 min-w-[260px]">
                  {[
                    { label: "Confidence", value: `${record.confidence_score ?? 0}%`, icon: CheckCircle2 },
                    { label: "Tuition", value: record.tuition_text || "Contact", icon: Wallet },
                    { label: "Duration", value: record.duration_text || "Flexible", icon: CalendarClock },
                    { label: "Language", value: record.language || "Not listed", icon: Languages },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="inline-flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <stat.icon className="h-3.5 w-3.5" />
                        {stat.label}
                      </div>
                      <div className="mt-1.5 text-sm font-black text-slate-900 break-words">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Program Details</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metaRows.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1 leading-relaxed">{String(value)}</p>
                  </div>
                ))}
              </div>
            </section>

            {payloadRows.length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Extracted Insights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {payloadRows.map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-slate-100 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">{String(key).replace(/_/g, " ")}</p>
                      <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap break-words">{typeof value === "string" ? value : JSON.stringify(value)}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Apply Through Official Source</h3>
                <p className="text-sm text-slate-600 mt-1">Use the institute page for up-to-date admission steps, documents, and deadlines.</p>
              </div>
              {record.source_url ? (
                <a href={record.source_url} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-indigo-700 hover:bg-indigo-800 inline-flex items-center gap-2">
                    Open Program Source
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Button disabled>No source URL</Button>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
