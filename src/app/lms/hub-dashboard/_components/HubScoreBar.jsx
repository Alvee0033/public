export function HubScoreBar({ score, max = 150, showLabel = true }) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  const color =
    pct >= 80
      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
      : pct >= 50
        ? "bg-gradient-to-r from-amber-400 to-amber-500"
        : "bg-gradient-to-r from-red-400 to-red-500";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500 font-medium">Hub Class Score</span>
          <span className="font-bold text-slate-800">
            {score}
            <span className="text-slate-400 font-normal">/{max}</span>
          </span>
        </div>
      )}
      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs mt-1 text-slate-400">
          <span>0</span>
          <span className="text-slate-500">{pct}%</span>
          <span>150</span>
        </div>
      )}
    </div>
  );
}
