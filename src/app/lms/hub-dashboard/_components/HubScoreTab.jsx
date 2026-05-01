import { HubScorePanel } from "./HubScorePanel";
import { Star } from "lucide-react";

export function HubScoreTab({ hubs }) {
  const activeHubs = (Array.isArray(hubs) ? hubs : []).filter(
    (h) => h.status === "active"
  );

  if (activeHubs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-4 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6"
        role="status"
      >
        <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
          <Star className="w-7 h-7 text-slate-300" aria-hidden />
        </div>
        <div className="max-w-md">
          <p className="text-base font-semibold text-slate-800">
            No active hubs yet
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Hub Class scores appear once a hub is approved. Complete
            registration or check your email for updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Hub Class Scores
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Track your score (0–150) and see what to improve next.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          {
            label: "Starter",
            range: "0–49",
            color: "bg-slate-100 text-slate-700 border-slate-200",
          },
          {
            label: "Bronze",
            range: "50–79",
            color: "bg-orange-50 text-orange-800 border-orange-200",
          },
          {
            label: "Silver",
            range: "80–109",
            color: "bg-slate-50 text-slate-700 border-slate-200",
          },
          {
            label: "Gold",
            range: "110–139",
            color: "bg-yellow-50 text-yellow-800 border-yellow-200",
          },
          {
            label: "Class 150",
            range: "140–150",
            color: "bg-purple-50 text-purple-800 border-purple-200",
          },
        ].map((tier) => (
          <div
            key={tier.label}
            className={`rounded-xl border px-2 py-2.5 text-center ${tier.color}`}
          >
            <div className="text-[10px] font-bold sm:text-xs">{tier.label}</div>
            <div className="text-[10px] opacity-80 mt-0.5">{tier.range}</div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {activeHubs.map((hub) => (
          <HubScorePanel key={hub.id} hub={hub} />
        ))}
      </div>
    </div>
  );
}
