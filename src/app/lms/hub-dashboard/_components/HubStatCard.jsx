export function HubStatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="w-5 h-5" aria-hidden />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-0.5 tracking-tight">
        {value}
      </div>
      <div className="text-sm font-medium text-slate-600">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}
