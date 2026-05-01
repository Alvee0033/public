import { HubStatCard } from "./HubStatCard";
import { HubCard } from "./HubCard";
import { Building2, PlusCircle, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export function HubOverviewTab({ hubs, user }) {
  const hubList = Array.isArray(hubs) ? hubs : [];
  const active = hubList.filter((h) => h.status === "active");
  const totalStudents = hubList.reduce((s, h) => s + (h.student_count ?? 0), 0);
  const avgScore =
    active.length > 0
      ? Math.round(
          active.reduce((s, h) => s + (h.hub_class_score ?? 0), 0) /
            active.length
        )
      : 0;

  const displayName =
    user
      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
        user.email
      : "Partner";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Here&apos;s how your hubs are performing today.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <HubStatCard
          label="Total Hubs"
          value={hubList.length}
          icon={Building2}
          color="bg-blue-100 text-blue-600"
          sub={`${active.length} active`}
        />
        <HubStatCard
          label="Total Students"
          value={totalStudents}
          icon={Users}
          color="bg-emerald-100 text-emerald-600"
        />
        <HubStatCard
          label="Avg Hub Score"
          value={`${avgScore}/150`}
          icon={Star}
          color="bg-amber-100 text-amber-600"
          sub="across active hubs"
        />
        <HubStatCard
          label="Avg Rating"
          value={
            active.length > 0
              ? (
                  active.reduce((s, h) => s + Number(h.avg_rating ?? 0), 0) /
                  active.length
                ).toFixed(1)
              : "—"
          }
          icon={TrendingUp}
          color="bg-violet-100 text-violet-600"
          sub="out of 5.0"
        />
      </div>

      {hubList.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6"
          role="status"
        >
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="w-8 h-8 text-slate-300" aria-hidden />
          </div>
          <div className="text-center max-w-md">
            <p className="text-base font-semibold text-slate-800 mb-1">
              No hubs registered yet
            </p>
            <p className="text-sm text-slate-600">
              Register your first hub to start appearing in the directory and
              unlock scores and partnerships.
            </p>
          </div>
          <Link
            href="/learninghubs/register"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" aria-hidden />
            Register a Hub
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Your Hubs
            </h2>
            <Link
              href="/learninghubs/register"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <PlusCircle className="w-4 h-4" aria-hidden />
              Add Hub
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hubList.map((hub) => (
              <HubCard key={hub.id} hub={hub} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
