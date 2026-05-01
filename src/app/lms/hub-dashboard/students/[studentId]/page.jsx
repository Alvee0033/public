"use client";

import Link from "next/link";
import useSWR from "swr";
import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Phone, RefreshCw, UserRound } from "lucide-react";
import { hubDashboardFetcher as fetcher } from "../../_components/hub-dashboard-fetcher";
import { HubStatusBadge } from "../../_components/HubStatusBadge";

function normalizePayload(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  if (data.items || data.counts || data.total != null) return data;
  return data.data ?? data;
}

function formatDateTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
}

function formatDateYyyyMmDdToMmDdYyyy(value) {
  if (!value) return "N/A";
  const s = String(value).slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return "N/A";
  return `${m[2]}/${m[3]}/${m[1]}`;
}

function yesNo(value) {
  if (value == null) return "N/A";
  return value ? "Yes" : "No";
}

export default function HubStudentDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const studentId = String(params?.studentId ?? "");
  const queryHubId = searchParams.get("hubId");

  const { data: hubsData, isLoading: hubsLoading } = useSWR("/learning-hub/my-hubs", fetcher);
  const hubsPayload = normalizePayload(hubsData);
  const hubs = Array.isArray(hubsData)
    ? hubsData
    : Array.isArray(hubsPayload?.items)
      ? hubsPayload.items
      : [];

  const selectedHubId = useMemo(() => {
    // Trust hubId from URL first so details load immediately on direct navigation.
    if (queryHubId) return String(queryHubId);
    if (hubs[0]?.id) return String(hubs[0].id);
    return "";
  }, [hubs, queryHubId]);

  const detailsUrl = useMemo(() => {
    if (!selectedHubId || !studentId) return null;
    return `/learning-hub/${selectedHubId}/students/${studentId}/profile`;
  }, [selectedHubId, studentId]);
  const { data, isLoading } = useSWR(detailsUrl, fetcher);
  const payload = normalizePayload(data);
  const student = payload?.student ?? null;
  const latestRequest = payload?.latest_request ?? null;
  const matchingProfile = payload?.matching_profile ?? null;

  const backHref = selectedHubId
    ? `/lms/hub-dashboard?tab=students&hubId=${selectedHubId}`
    : "/lms/hub-dashboard?tab=students";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Student Section
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {hubsLoading || isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden />
            Loading student details...
          </div>
        ) : !student ? (
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900">Student not found</h1>
            <p className="text-sm text-slate-500">
              This student was not found in the selected hub.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <UserRound className="h-5 w-5 text-slate-600" aria-hidden />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900">
                    {`${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() || "Student"}
                  </h1>
                  <div className="mt-1 space-y-1">
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400" aria-hidden />
                      {student.email || "No email"}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400" aria-hidden />
                      {student.phone_number || "No phone"}
                    </p>
                  </div>
                </div>
              </div>
              <HubStatusBadge status={latestRequest?.status || "pending"} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailStat label="Student ID" value={student.student_user_id} />
              <DetailStat label="Request ID" value={latestRequest?.id ?? "N/A"} />
              <DetailStat label="Request Status" value={latestRequest?.status ?? "N/A"} />
              <DetailStat label="Scholarship Support" value={yesNo(matchingProfile?.needs_scholarship)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <DetailBlock title="Enrollment Timeline">
                <InfoRow label="Requested At" value={formatDateTime(latestRequest?.created_at)} />
                <InfoRow label="Reviewed At" value={formatDateTime(latestRequest?.reviewed_at)} />
              </DetailBlock>

              <DetailBlock title="Review Notes">
                <InfoRow label="Request Note" value={latestRequest?.note || "N/A"} />
                <InfoRow label="Review Note" value={latestRequest?.review_note || "N/A"} />
              </DetailBlock>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <DetailBlock title="Matching Profile: About You">
                <InfoRow label="Gender" value={matchingProfile?.gender || "N/A"} />
                <InfoRow label="GPA" value={matchingProfile?.gpa ?? "N/A"} />
                <InfoRow label="Income Bracket" value={matchingProfile?.income_bracket || "N/A"} />
                <InfoRow
                  label="Preferred Course Level"
                  value={matchingProfile?.preferred_course_level || "N/A"}
                />
                <InfoRow
                  label="Preferred Delivery Mode"
                  value={matchingProfile?.preferred_delivery_mode || "N/A"}
                />
                <InfoRow
                  label="Desired Start Date"
                  value={formatDateYyyyMmDdToMmDdYyyy(matchingProfile?.desired_start_date)}
                />
              </DetailBlock>

              <DetailBlock title="Matching Profile: Location & Budget">
                <InfoRow
                  label="Preferred Country ID"
                  value={matchingProfile?.preferred_country_id ?? "N/A"}
                />
                <InfoRow
                  label="Preferred State ID"
                  value={matchingProfile?.preferred_state_id ?? "N/A"}
                />
                <InfoRow label="Min Budget" value={matchingProfile?.min_budget ?? "N/A"} />
                <InfoRow label="Max Budget" value={matchingProfile?.max_budget ?? "N/A"} />
                <InfoRow
                  label="Budget Currency"
                  value={matchingProfile?.budget_currency_code || "N/A"}
                />
              </DetailBlock>
            </div>

            <div className="grid gap-4">
              <DetailBlock title="Matching Profile: Preferences">
                <InfoRow
                  label="Preferred Subject Areas"
                  value={matchingProfile?.preferred_subject_areas_text || "N/A"}
                />
                <InfoRow
                  label="Preferred Institute Types"
                  value={matchingProfile?.preferred_institute_types_text || "N/A"}
                />
              </DetailBlock>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}
