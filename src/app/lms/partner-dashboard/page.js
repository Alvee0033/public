"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/lib/axios";
import {
  Building2,
  Plus,
  Star,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url) =>
  axios.get(url).then((r) => r?.data?.data ?? r?.data ?? []);

// ─── Status badge helpers ────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active: { label: "Active", variant: "default", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  pending: { label: "Pending Review", variant: "secondary", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  suspended: { label: "Suspended", variant: "outline", icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

function HubStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Hub Score Bar ───────────────────────────────────────────────────────────

function ScoreBar({ score, max = 150 }) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  const color = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Hub Class Score</span>
        <span className="font-semibold text-gray-800">{score}/{max}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200">
        <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Hub Card ────────────────────────────────────────────────────────────────

function HubCard({ hub }) {
  const isRejected = hub.status === "rejected";
  const isPending = hub.status === "pending";

  return (
    <Card className={`border ${STATUS_CONFIG[hub.status]?.bg ?? "bg-white"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{hub.hub_name}</CardTitle>
            <CardDescription className="truncate">
              {[hub.city, hub.state_code, hub.country_code].filter(Boolean).join(", ") || hub.address_line1 || "—"}
            </CardDescription>
          </div>
          <HubStatusBadge status={hub.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {hub.status === "active" && (
          <ScoreBar score={hub.hub_class_score ?? 0} />
        )}

        {isPending && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            ⏳ Under review — our team will process your hub within <strong>72 hours</strong>.
          </div>
        )}

        {isRejected && hub.rejection_reason && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            <strong>Reason:</strong> {hub.rejection_reason}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {hub.student_count ?? 0} students
          </span>
          {hub.hub_class_label && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {hub.hub_class_label}
            </span>
          )}
          {hub.services_offered?.length > 0 && (
            <span>{hub.services_offered.slice(0, 2).join(", ")}{hub.services_offered.length > 2 ? "…" : ""}</span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          {isRejected && (
            <Link href={`/learninghubs/register`}>
              <Button size="sm" variant="outline" className="text-xs h-7 border-red-300 text-red-600 hover:bg-red-50">
                Edit &amp; Resubmit
              </Button>
            </Link>
          )}
          {hub.status === "active" && (
            <HubScoreButton hubId={hub.id} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function HubScoreButton({ hubId }) {
  const [open, setOpen] = useState(false);
  const { data: scoreData, isLoading } = useSWR(
    open ? `/learning-hub/${hubId}/score` : null,
    fetcher
  );

  return (
    <div>
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-7"
        onClick={() => setOpen(!open)}
      >
        {open ? "Hide Score" : "View Score Breakdown"}
      </Button>
      {open && (
        <div className="mt-3 border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-3 text-xs text-gray-400">Loading score data…</div>
          ) : scoreData?.breakdown ? (
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Signal</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Earned</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Max</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Note</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(scoreData.breakdown).map(([key, val]) => (
                  <tr key={key} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-3 py-2 capitalize text-gray-700">{key.replace(/_/g, " ")}</td>
                    <td className="px-3 py-2 text-center font-semibold text-gray-800">{val.earned}</td>
                    <td className="px-3 py-2 text-center text-gray-500">{val.max}</td>
                    <td className="px-3 py-2 text-gray-500">{val.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-3 text-xs text-gray-400">No breakdown available.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── My Hubs Tab ─────────────────────────────────────────────────────────────

function MyHubsTab() {
  const { data: hubs = [], isLoading, error, mutate } = useSWR(
    "/learning-hub/my-hubs",
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
        <RefreshCw className="w-4 h-4 animate-spin" />
        Loading your hubs…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-gray-500">Failed to load hubs. Please refresh.</p>
        <Button variant="outline" size="sm" onClick={() => mutate()}>Retry</Button>
      </div>
    );
  }

  const hubList = Array.isArray(hubs) ? hubs : [];

  if (hubList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">No hubs registered yet</p>
          <p className="text-xs text-gray-400">Register your first hub to appear in the directory.</p>
        </div>
        <Link href="/learninghubs/register">
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Register a Hub
          </Button>
        </Link>
      </div>
    );
  }

  const active = hubList.filter((h) => h.status === "active").length;
  const pending = hubList.filter((h) => h.status === "pending").length;
  const rejected = hubList.filter((h) => h.status === "rejected").length;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs">
          {active > 0 && <span className="text-green-600 font-medium">{active} active</span>}
          {pending > 0 && <span className="text-amber-600 font-medium">{pending} pending</span>}
          {rejected > 0 && <span className="text-red-500 font-medium">{rejected} rejected</span>}
        </div>
        <Link href="/learninghubs/register">
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs h-8">
            <Plus className="w-3.5 h-3.5" />
            Register Hub
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hubList.map((hub) => (
          <HubCard key={hub.id} hub={hub} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function PartnerDashboard() {
  const { data: user } = useSWR("/me", fetcher);

  const displayName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email
    : "Partner";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col h-16 pt-6 px-8">
        <h1 className="text-xl font-semibold">Partner Dashboard</h1>
        <h3 className="text-sm font-medium text-muted-foreground">
          Welcome back{displayName ? `, ${displayName}` : ""}.
        </h3>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Tabs defaultValue="my-hubs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-hubs">My Hubs</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* My Hubs tab — live API data */}
          <TabsContent value="my-hubs">
            <MyHubsTab />
          </TabsContent>

          {/* Overview tab — general partner stats (to be expanded later) */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Hubs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-800">—</p>
                  <p className="text-xs text-muted-foreground mt-1">See My Hubs tab</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Hub Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/hub-directory-page" className="text-blue-600 hover:underline text-sm">
                    Browse public directory →
                  </Link>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Register New Hub</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/learninghubs/register" className="text-green-600 hover:underline text-sm">
                    Start hub registration →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
