export default function HubProfileLoading() {
  return (
    <div className="min-h-[50vh] bg-slate-50">
      <div className="mx-auto max-w-5xl p-1.5 sm:p-2">
        <div className="mb-2 h-10 animate-pulse rounded-lg bg-slate-200/80" />
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="h-36 animate-pulse bg-slate-200/70 sm:h-40" />
          <div className="grid gap-3 p-3 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-32 animate-pulse rounded-lg bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
