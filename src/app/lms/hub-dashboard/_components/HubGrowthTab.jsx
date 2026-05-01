"use client";
import { instance } from "@/lib/axios";
import Link from "next/link";
import useSWR from "swr";
import {
  Award,
  Building2,
  CheckCircle,
  Compass,
  Globe,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { hubDashboardFetcher as fetcher } from "./hub-dashboard-fetcher";
import { INSTITUTE_COUNTRY_OPTIONS } from "./institute-country-options";
import { HubSelector } from "./HubSelector";
import { HubStatusBadge } from "./HubStatusBadge";

export function HubGrowthTab({ hubs, mutate }) {
  const activeHubs = (Array.isArray(hubs) ? hubs : []).filter((hub) => hub.status === "active");
  const [selectedHubId, setSelectedHubId] = useState(
    activeHubs[0]?.id ? String(activeHubs[0].id) : ""
  );
  const [instituteQuery, setInstituteQuery] = useState("");
  const [instituteTierFilter, setInstituteTierFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [partnershipType, setPartnershipType] = useState("referral_partner");
  const [operatorNotes, setOperatorNotes] = useState("");
  const [expansionTier, setExpansionTier] = useState("local_spotlight");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const deferredQuery = useDeferredValue(instituteQuery.trim());

  useEffect(() => {
    if (!selectedHubId && activeHubs[0]?.id) {
      setSelectedHubId(String(activeHubs[0].id));
    }
  }, [activeHubs, selectedHubId]);

  const { data: rankData, mutate: mutateRank } = useSWR(
    selectedHubId ? `/learning-hub/${selectedHubId}/rank` : null,
    fetcher
  );
  const { data: linkData, mutate: mutateLinks } = useSWR(
    selectedHubId ? `/learning-hub/${selectedHubId}/institute-links` : null,
    fetcher
  );
  const { data: expansionData, mutate: mutateExpansion } = useSWR(
    selectedHubId ? `/learning-hub/${selectedHubId}/expansion-applications` : null,
    fetcher
  );
  const { data: instituteResults, isLoading: instituteLoading, isValidating: instituteValidating } = useSWR(
    deferredQuery.length >= 2
      ? `/institute-directory/admin/institutes?status=published&search=${encodeURIComponent(
          deferredQuery
        )}&limit=20${instituteTierFilter ? `&tier=${encodeURIComponent(instituteTierFilter)}` : ""}${
          countryFilter.trim() ? `&country_code=${encodeURIComponent(countryFilter.trim().toUpperCase())}` : ""
        }`
      : null,
    fetcher
  );

  const selectedRank = rankData?.data ?? rankData ?? null;
  const selectedLinks = linkData?.items ?? linkData?.data?.items ?? [];
  const selectedApplications = expansionData?.items ?? expansionData?.data?.items ?? [];
  const instituteItems = instituteResults?.items ?? instituteResults?.data?.items ?? [];
  const currentRank = Number(selectedRank?.hub_rank_score ?? 0);
  const latestExpansionApplication = selectedApplications[0] ?? null;
  const existingSelectedLink = selectedInstitute?.institute_id
    ? selectedLinks.find(
        (link) =>
          String(link.institute_id) === String(selectedInstitute.institute_id) &&
          String(link.partnership_type) === String(partnershipType) &&
          ["pending", "approved"].includes(String(link.status || "").toLowerCase()),
      ) ?? null
    : null;

  const reviewCounts = selectedLinks.reduce(
    (acc, link) => {
      const status = String(link.status || "pending");
      if (acc[status] !== undefined) acc[status] += 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, suspended: 0 }
  );

  const clearSelectedInstitute = () => {
    setSelectedInstitute(null);
    setInstituteQuery("");
  };

  const submitLink = async () => {
    if (!selectedHubId || !selectedInstitute?.institute_id) return;

    if (existingSelectedLink) {
      const statusLabel =
        String(existingSelectedLink.status || "pending")
          .replace(/_/g, " ")
          .toLowerCase();
      setMessage(
        `A ${statusLabel} ${partnershipType.replace(/_/g, " ")} request already exists for ${selectedInstitute.canonical_name}.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await instance.post(
        `/learning-hub/${selectedHubId}/institute-links`,
        {
          institute_id: selectedInstitute.institute_id,
          partnership_type: partnershipType,
          operator_notes: operatorNotes || undefined,
        },
        {
          suppressErrorStatuses: [409],
        },
      );
      setMessage("Institute partnership request submitted.");
      setOperatorNotes("");
      clearSelectedInstitute();
      mutateLinks();
      mutateRank();
      mutate();
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Failed to submit institute partnership request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitExpansion = async () => {
    if (!selectedHubId) return;
    setSubmitting(true);
    try {
      const response = await instance.post(`/learning-hub/${selectedHubId}/expansion-applications`, {
        requested_tier: expansionTier,
      });
      const payload = response?.data?.data ?? response?.data;
      setMessage("Expansion application submitted. Redirecting to subscription checkout...");
      mutateExpansion();
      mutateRank();
      if (payload?.id) {
        await startExpansionCheckout(payload);
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to submit expansion application.");
    } finally {
      setSubmitting(false);
    }
  };

  const startExpansionCheckout = async (application) => {
    if (!selectedHubId || !application?.id) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const successUrl = `${origin}/lms/hub-dashboard?tab=growth&hubId=${selectedHubId}&expansionPaid=1&applicationId=${application.id}`;
    const cancelUrl = `${origin}/lms/hub-dashboard?tab=growth&hubId=${selectedHubId}&expansionCanceled=1&applicationId=${application.id}`;

    const response = await instance.post(
      `/learning-hub/${selectedHubId}/expansion-applications/${application.id}/checkout-session`,
      {
        success_url: successUrl,
        cancel_url: cancelUrl,
      },
    );

    const payload = response?.data?.data ?? response?.data;
    if (!payload?.url) {
      throw new Error("Stripe checkout URL missing from server response.");
    }

    window.location.href = payload.url;
  };

  if (activeHubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-base font-bold text-gray-700">No active hubs yet</p>
        <p className="text-sm text-gray-400">
          Institute partnerships become available once a hub is approved.
        </p>
      </div>
    );
  }

  const tiers = [
    { id: "local_spotlight", label: "Local Spotlight", threshold: 60, cost: 99, perk: "Top 3 City Search Placement", icon: MapPin },
    { id: "regional_leader", label: "Regional Leader", threshold: 75, cost: 299, perk: "State-wide Email Campaigns", icon: Compass },
    { id: "national_showcase", label: "National Showcase", threshold: 88, cost: 599, perk: "Country Homepage Feature", icon: Globe },
    { id: "elite_hub", label: "Elite Access", threshold: 95, cost: 999, perk: "Global Showcase & 2nd Hub Rights", icon: Award },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Institute Partnerships</h1>
          <p className="text-gray-500 text-sm mt-1">
            Request institute links, monitor approvals, and manage expansion eligibility.
          </p>
        </div>
        <HubSelector hubs={activeHubs} selectedHubId={selectedHubId} onSelect={setSelectedHubId} />
      </div>

      {message ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                Search Institutes
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  value={instituteQuery}
                  onChange={(e) => setInstituteQuery(e.target.value)}
                  placeholder="Search university name..."
                  className="flex-1 bg-transparent text-sm font-semibold outline-none"
                />
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 border border-gray-200 min-w-[190px]">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full bg-transparent text-[11px] font-bold tracking-wider text-gray-700 outline-none appearance-none"
                    aria-label="Filter institutes by country"
                  >
                    {INSTITUTE_COUNTRY_OPTIONS.map((option) => (
                      <option key={option.value || "all"} value={option.value}>
                        {option.value ? `${option.label} (${option.value})` : option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {instituteLoading || instituteValidating ? (
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                ) : null}
              </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "", label: "All Tiers" },
                    { value: "1", label: "Tier 1" },
                    { value: "2", label: "Tier 2" },
                  { value: "3", label: "Tier 3" },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setInstituteTierFilter(option.value)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
                      instituteTierFilter === option.value
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

              {deferredQuery.length > 0 && deferredQuery.length < 2 ? (
                <p className="text-xs text-gray-400">Type at least 2 characters to search.</p>
              ) : null}

              {deferredQuery.length >= 2 ? (
                <div className="rounded-2xl border border-gray-200 overflow-hidden">
                  {instituteItems.length > 0 ? (
                    <div className="max-h-[28rem] overflow-y-auto divide-y divide-gray-100">
                      {instituteItems.map((item) => (
                        <div
                          key={item.institute_id}
                          className={`px-4 py-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4 ${
                            selectedInstitute?.institute_id === item.institute_id ? "bg-blue-50" : "bg-white"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-gray-900">
                                {item.canonical_name}
                              </p>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                {String(item.country_code || "N/A").toUpperCase()}
                              </span>
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                                Tier {item.tier}
                              </span>
                            </div>
                            <div className="mt-2 text-[11px] text-gray-500">
                              {[item.state_city, item.accreditation_body].filter(Boolean).join(" • ") || "Location pending"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              href={`/institutes/${item.institute_id}`}
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50"
                            >
                              View University Details
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedInstitute(item);
                                setInstituteQuery(item.canonical_name);
                              }}
                              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-[11px] font-bold uppercase tracking-widest ${
                                selectedInstitute?.institute_id === item.institute_id
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-900 text-white hover:bg-black"
                              }`}
                            >
                              {selectedInstitute?.institute_id === item.institute_id ? "Selected" : "Select"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-400">
                      No institute matches found.
                    </div>
                  )}
                </div>
              ) : null}

              {selectedInstitute ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                        Selected Institute
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {selectedInstitute.canonical_name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <span>{String(selectedInstitute.country_code || "N/A").toUpperCase()}</span>
                        <span>Tier {selectedInstitute.tier || "—"}</span>
                        <span>{String(selectedInstitute.accreditation_status || "unknown").replace(/_/g, " ")}</span>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      {[
                        {
                          id: "referral_partner",
                          label: "Referral Partner",
                          helper: "Send students to the institute and earn referral commission.",
                        },
                        {
                          id: "delivery_partner",
                          label: "Delivery Partner",
                          helper: "Deliver institute courses locally through your hub.",
                        },
                        {
                          id: "scholarship_partner",
                          label: "Scholarship Partner",
                          helper: "Distribute scholarships through the hub network.",
                        },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setPartnershipType(type.id)}
                          className={`rounded-xl border px-4 py-3 text-left ${
                            partnershipType === type.id
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "bg-white text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          <p className="text-xs font-bold uppercase tracking-wider">{type.label}</p>
                          <p className="mt-1 text-[11px] text-gray-400">{type.helper}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">Request Notes</p>
                    <textarea
                      value={operatorNotes}
                      onChange={(e) => setOperatorNotes(e.target.value)}
                      placeholder="Add proof of collaboration, agreement notes, or program delivery context..."
                      className="flex-1 w-full rounded-xl border p-3 text-xs font-medium outline-none focus:border-blue-300"
                    />
                    <div className="mt-4 rounded-xl bg-gray-900 px-4 py-3 text-[11px] font-medium text-white/80">
                      Partnerships team will review access before this institute appears publicly on your hub.
                    </div>
                    {existingSelectedLink ? (
                      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] font-medium text-amber-800">
                        This {partnershipType.replace(/_/g, " ")} request is already{" "}
                        {String(existingSelectedLink.status || "pending").replace(/_/g, " ").toLowerCase()} for this institute.
                      </div>
                    ) : null}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={clearSelectedInstitute}
                        className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={submitLink}
                        disabled={submitting || !!existingSelectedLink}
                        className="flex-1 h-11 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-black transition-all disabled:opacity-50"
                      >
                        {existingSelectedLink ? "Already Requested" : "Request Partnership"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Expansion</h3>
            </div>
            <div className="p-6 space-y-3">
              {tiers.map((tier) => {
                const locked = currentRank < tier.threshold;
                const isSelected = expansionTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => !locked && setExpansionTier(tier.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      isSelected ? "border-orange-500 bg-orange-50/30" : "border-gray-50 hover:border-gray-200"
                    } ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                        <tier.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left font-bold">
                        <p className={`text-xs ${isSelected ? "text-orange-700" : "text-gray-700"}`}>{tier.label}</p>
                        <p className="text-[9px] text-gray-400 uppercase">
                          {locked ? `Min ${tier.threshold} Score Required` : `$${tier.cost}/month — ${tier.perk}`}
                        </p>
                      </div>
                    </div>
                    {isSelected ? <CheckCircle className="w-5 h-5 text-orange-500" /> : null}
                  </button>
                );
              })}
              <button
                onClick={submitExpansion}
                disabled={submitting}
                className="mt-2 w-full h-12 bg-orange-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-orange-700 transition-all disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Apply"}
              </button>

              {latestExpansionApplication ? (
                <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                        Latest Application
                      </p>
                      <p className="mt-1 text-sm font-black text-gray-900">
                        {String(latestExpansionApplication.requested_tier || "")
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-gray-500">
                        ${latestExpansionApplication.price_usd}/month
                      </p>
                    </div>
                    <HubStatusBadge status={latestExpansionApplication.status} />
                  </div>
                  {latestExpansionApplication.status !== "rejected" ? (
                    <button
                      onClick={() => startExpansionCheckout(latestExpansionApplication)}
                      className="mt-4 w-full h-10 rounded-xl border border-orange-200 bg-white text-[11px] font-bold uppercase tracking-widest text-orange-700 hover:bg-orange-100"
                    >
                      Pay Subscription
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Partnership Review</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Pending Review</p>
                  <p className="mt-2 text-2xl font-black text-amber-900">{reviewCounts.pending}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Approved</p>
                  <p className="mt-2 text-2xl font-black text-emerald-900">{reviewCounts.approved}</p>
                </div>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">Rejected</p>
                  <p className="mt-2 text-2xl font-black text-red-900">{reviewCounts.rejected}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Suspended</p>
                  <p className="mt-2 text-2xl font-black text-gray-900">{reviewCounts.suspended}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50/70">
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Latest Requests</p>
                </div>
                {selectedLinks.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {selectedLinks.slice(0, 4).map((link) => (
                      <div key={link.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-gray-900">
                            {link.institute?.canonical_name || "Partner Institute"}
                          </p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {String(link.partnership_type || "").replace(/_/g, " ")}
                          </p>
                        </div>
                        <HubStatusBadge status={link.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-xs font-bold text-gray-400">
                    No partnership requests yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
