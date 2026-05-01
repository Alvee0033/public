"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const HubStudentLeafletMap = dynamic(() => import("./HubStudentLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-2 h-7 w-7 animate-spin rounded-full border-2 border-[var(--sp-blue)] border-t-transparent" />
        <p className="text-xs text-slate-600">Loading map…</p>
      </div>
    </div>
  ),
});

function mapFrameClass(variant) {
  if (variant === "expanded") {
    return "h-[min(72vh,760px)] min-h-[420px] w-full rounded-[2.5rem]";
  }
  return "h-[min(65vh,640px)] min-h-[400px] w-full rounded-[2.5rem]";
}

function outerShellClass(variant) {
  return "relative w-full overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/50 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(15,23,42,0.15)]";
}

export function HubStudentMap({
  data,
  loading,
  error,
  searchQuery = "",
  selectedHubId,
  onSelectHub,
  variant = "compact",
}) {
  const frame = mapFrameClass(variant);
  const features = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const source = data?.features || [];
    if (!query) return source;
    return source.filter((feature) => {
      const props = feature?.properties || {};
      return [props.name, props.city, props.stateCode, props.countryCode]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [data, searchQuery]);
  const showSelectionChip = Boolean(selectedHubId) && features.length > 1;

  if (error) {
    return (
      <div className={outerShellClass(variant)}>
        <div
          className={`flex items-center justify-center rounded-lg border border-red-200 bg-red-50 ${frame}`}
        >
          <p className="px-2 text-center text-xs text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={outerShellClass(variant)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1100] h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1100] h-20 bg-[linear-gradient(0deg,rgba(15,23,42,0.16),rgba(15,23,42,0))]" />
      {loading ? (
        <div className={`flex items-center justify-center bg-slate-50 ${frame}`}>
          <div className="flex flex-col items-center justify-center bg-slate-50">
            <div className="mx-auto mb-2 h-7 w-7 animate-spin rounded-full border-2 border-[var(--sp-blue)] border-t-transparent" />
            <p className="text-xs text-slate-600">Loading map…</p>
          </div>
        </div>
      ) : (
        <div className={`relative ${frame}`}>
          <div className="h-full w-full overflow-hidden rounded-[2.5rem]">
            <HubStudentLeafletMap
              key={variant}
              features={features}
              selectedHubId={selectedHubId}
              onSelectHub={onSelectHub}
            />
          </div>
          {showSelectionChip ? (
            <div className="pointer-events-none absolute bottom-6 left-6 z-[1200] max-w-[calc(100%-3rem)] rounded-2xl border border-white/40 bg-white/80 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 sm:max-w-[18rem]">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500/80">Selected Hub</p>
              <p className="line-clamp-1 text-base font-bold text-slate-900">
                {features.find((feature) => feature?.properties?.id === selectedHubId)?.properties?.name ||
                  "Pinned Location"}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
