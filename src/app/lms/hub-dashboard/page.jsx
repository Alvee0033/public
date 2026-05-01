"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  AlertCircle,
  BookOpen,
  GraduationCap,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { hubDashboardFetcher as fetcher } from "./_components/hub-dashboard-fetcher";
import { HubDashboardSkeleton } from "./_components/HubDashboardSkeleton";
import { HubOverviewTab } from "./_components/HubOverviewTab";
import { HubScoreTab } from "./_components/HubScoreTab";
import { HubGrowthTab } from "./_components/HubGrowthTab";
import { HubComingSoon } from "./_components/HubComingSoon";
import { HubEnrollmentRequestsTab } from "./_components/HubEnrollmentRequestsTab";
import { HubStudentsTab } from "./_components/HubStudentsTab";

function HubDashboardInner() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";

  const {
    data: hubs,
    isLoading: hubsLoading,
    error: hubsError,
    mutate,
  } = useSWR("/learning-hub/my-hubs", fetcher);

  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const hubList = Array.isArray(hubs) ? hubs : [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/40">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {hubsLoading ? (
          <HubDashboardSkeleton />
        ) : hubsError ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/50 py-16 px-6 text-center"
            role="alert"
          >
            <AlertCircle
              className="mx-auto mb-3 h-10 w-10 text-red-400"
              aria-hidden
            />
            <p className="text-sm font-medium text-slate-800">
              We couldn&apos;t load your hubs.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => mutate()}
              className="mt-4 text-sm font-semibold text-blue-600 underline hover:text-blue-700"
            >
              Retry
            </button>
          </div>
        ) : activeTab === "overview" ? (
          <HubOverviewTab hubs={hubList} user={user} />
        ) : activeTab === "score" ? (
          <HubScoreTab hubs={hubList} />
        ) : activeTab === "growth" ? (
          <HubGrowthTab hubs={hubList} mutate={mutate} />
        ) : activeTab === "enrollment-requests" ? (
          <HubEnrollmentRequestsTab hubs={hubList} />
        ) : activeTab === "students" ? (
          <HubStudentsTab hubs={hubList} />
        ) : activeTab === "tutors" ? (
          <HubComingSoon
            icon={GraduationCap}
            title="Manage Tutors"
            description="Invite and manage tutors working at your hubs."
            bullets={[
              "Invite tutors by email",
              "Approve tutor applications",
              "Assign subjects and schedule",
              "View tutor performance metrics",
            ]}
          />
        ) : activeTab === "courses" ? (
          <HubComingSoon
            icon={BookOpen}
            title="Manage Courses"
            description="Link courses from the Institute Directory to your hub."
            bullets={[
              "Connect existing courses to your hub",
              "Set pricing and enrollment caps",
              "Track enrollments and completions",
            ]}
          />
        ) : activeTab === "wallet" ? (
          <HubComingSoon
            icon={Wallet}
            title="Scholarship Wallet"
            description="Manage scholarship credits and disburse funds to students."
            bullets={[
              "View available scholarship credits",
              "Disburse credits to eligible students",
              "Track scholarship utilisation",
              "ESG reporting integration",
            ]}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function HubDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-slate-50/40">
          <RefreshCw className="h-7 w-7 animate-spin text-blue-600" aria-hidden />
        </div>
      }
    >
      <HubDashboardInner />
    </Suspense>
  );
}
