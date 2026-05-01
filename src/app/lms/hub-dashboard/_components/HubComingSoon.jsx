import { CheckCircle } from "lucide-react";

export function HubComingSoon({ icon: Icon, title, description, bullets }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-600 text-sm mt-1">{description}</p>
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm p-10 flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
          <Icon className="w-8 h-8 text-blue-500" aria-hidden />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800 mb-2">Coming Soon</p>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            This feature is in development and will be available in a future
            release.
          </p>
        </div>
        {bullets?.length > 0 && (
          <ul className="text-sm text-slate-600 space-y-2 text-left w-full max-w-sm">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle
                  className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                  aria-hidden
                />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
