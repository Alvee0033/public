"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

/** Directory search uses `HubStudentMap`; hub **profile** uses this — single-location preview only */
const HubStudentLeafletMap = dynamic(() => import("./HubStudentLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full max-w-[260px] items-center justify-center rounded-md border border-slate-200 bg-slate-50">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--sp-blue)] border-t-transparent" />
    </div>
  ),
});

function hubToFeatures(hub) {
  if (!hub) return [];
  const lat = Number(hub.latitude);
  const lng = Number(hub.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
  return [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [lng, lat] },
      properties: {
        id: hub.id,
        name: hub.hub_name,
        city: hub.city,
        stateCode: hub.master_state?.name || hub.state_code,
        countryCode: hub.master_country?.name || hub.country_code,
        hubClass: hub.hub_class_label,
        score: hub.score,
        address: hub.address_line1,
      },
    },
  ];
}

export function HubProfileLocationMap({ hub }) {
  const features = useMemo(() => hubToFeatures(hub), [hub]);

  if (!features.length) {
    return (
      <p className="py-3 text-center text-[11px] text-slate-500">No coordinates on file — map unavailable.</p>
    );
  }

  return (
    <div className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-md border border-slate-200 bg-slate-100">
      <div className="absolute inset-0">
        <HubStudentLeafletMap
          features={features}
          selectedHubId={hub.id}
          onSelectHub={() => {}}
        />
      </div>
    </div>
  );
}
