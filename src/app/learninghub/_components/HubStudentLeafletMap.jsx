"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const HUB_CLASS_KEYS = {
  starter: "Starter",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  class150: "Class 150",
};

function normalizeHubClass(value) {
  const raw = String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (raw === "class150") return HUB_CLASS_KEYS.class150;
  if (raw === "bronze") return HUB_CLASS_KEYS.bronze;
  if (raw === "silver") return HUB_CLASS_KEYS.silver;
  if (raw === "gold") return HUB_CLASS_KEYS.gold;
  if (raw === "standard") return HUB_CLASS_KEYS.starter;
  if (raw === "starter") return HUB_CLASS_KEYS.starter;
  return HUB_CLASS_KEYS.starter;
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string") {
      if (value.trim()) return value.trim();
      continue;
    }
    if (value != null) return value;
  }
  return "";
}

function readHubDetails(feature) {
  const props = feature?.properties || {};
  const id = props.id ?? props.hub_id ?? props.learning_hub_id ?? null;
  const hubClass = normalizeHubClass(
    props.hubClass ?? props.hub_class_label ?? props.class_label,
  );
  const name = firstNonEmpty(
    props.name,
    props.hub_name,
    props.title,
    props.hub_title,
    id != null ? `Hub #${id}` : "Learning Hub",
  );
  const city = firstNonEmpty(props.city, props.hub_city, "");
  const countryCode = firstNonEmpty(props.countryCode, props.country_code, "");
  const score = props.score ?? props.hub_score ?? props.ranking_score ?? null;
  const courseCount = Number(
    props.courseCount ?? props.course_count ?? props.total_courses ?? 0,
  );
  const studentCount = Number(
    props.studentCount ?? props.student_count ?? props.active_students ?? 0,
  );
  const instituteName = firstNonEmpty(
    props.instituteName,
    props.institute_name,
    props.partner_institute,
    "",
  );
  return {
    id,
    hubClass,
    name,
    city,
    countryCode,
    score,
    courseCount: Number.isFinite(courseCount) ? courseCount : 0,
    studentCount: Number.isFinite(studentCount) ? studentCount : 0,
    instituteName,
  };
}

function safeInvalidateMapSize(map) {
  if (!map || typeof map.invalidateSize !== "function") return;
  if (!map._container || !map._loaded) return;
  try {
    map.invalidateSize({ animate: false });
  } catch {
    // Ignore transient Leaflet timing issues during mount/unmount.
  }
}

function MapBoot() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // Only two invalidates: immediate and after a short delay for container stabilization
    const t1 = setTimeout(() => {
      safeInvalidateMapSize(map);
    }, 100);
    const t2 = setTimeout(() => {
      safeInvalidateMapSize(map);
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);

  return null;
}

function FitBounds({ features, selectedHubId }) {
  const map = useMap();

  useEffect(() => {
    if (!features.length) {
      map.setView([20, 0], 2);
      return;
    }

    const selectedFeature = features.find(
      (feature) => feature?.properties?.id === selectedHubId,
    );

    if (selectedFeature) {
      const [lng, lat] = selectedFeature.geometry.coordinates;
      map.flyTo([lat, lng], 14, { duration: 0.6 });
      return;
    }

    if (features.length === 1) {
      const [lng, lat] = features[0].geometry.coordinates;
      map.setView([lat, lng], 14);
      return;
    }

    const bounds = L.latLngBounds(
      features.map((feature) => [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ]),
    );
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 });
  }, [map, features, selectedHubId]);

  return null;
}

function SafeMarker({ id, position, icon, isSelected, onSelectHub, feature }) {
  const map = useMap();
  const details = readHubDetails(feature);
  
  // Skip rendering if map is not fully initialized or destroyed
  if (!map || !map.getPane) return null;

  return (
    <Marker
      key={id}
      position={position}
      icon={icon}
      eventHandlers={{
        click: (event) => {
          onSelectHub?.(id);
          event?.target?.openPopup?.();
        },
      }}
      opacity={isSelected ? 1 : 0.95}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Tooltip
        permanent
        direction="top"
        offset={[0, -38]}
        opacity={1}
        className={`hub-map-title hub-map-title-${String(
          details.hubClass || "starter",
        )
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <div className="hub-name-indicator">
          <span className="hub-name-text">{details.name}</span>
          <span className="hub-class-chip">{details.hubClass}</span>
        </div>
      </Tooltip>
      <Popup className="hub-map-popup">
        <div className="w-[220px] overflow-hidden rounded-2xl bg-white p-0">
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 ring-1 ring-inset ring-blue-700/10">
                {details.hubClass}
              </span>
              {details.score !== null && details.score !== undefined && (
                <span className="text-[10px] font-bold text-slate-400">
                  {details.score}/150
                </span>
              )}
            </div>

            <h3 className="mb-1 text-base font-bold leading-tight text-slate-900">
              {details.name}
            </h3>

            {(details.city || details.countryCode) && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <svg
                  className="h-3 w-3 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {[details.city, details.countryCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            {details.instituteName ? (
              <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-slate-500">
                {details.instituteName}
              </p>
            ) : null}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Courses
                </p>
                <p className="text-sm font-bold text-slate-800">{details.courseCount}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Students
                </p>
                <p className="text-sm font-bold text-slate-800">{details.studentCount}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 bg-slate-50/50 p-3">
            <Link
              href={`/learninghub/${id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-900 hover:text-white hover:ring-slate-900"
            >
              View Hub Profile
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function HubStudentLeafletMap({
  features,
  selectedHubId,
  onSelectHub,
}) {
  const iconTheme = useMemo(
    () => ({
      Starter: { className: "hub-class-starter", label: "ST" },
      Bronze: { className: "hub-class-bronze", label: "B" },
      Silver: { className: "hub-class-silver", label: "S" },
      Gold: { className: "hub-class-gold", label: "G" },
      "Class 150": { className: "hub-class-150", label: "150" },
    }),
    [],
  );

  // Pre-create icons to avoid overhead during render
  const iconsCache = useMemo(() => {
    const cache = {};
    Object.keys(iconTheme).forEach(hubClass => {
      const theme = iconTheme[hubClass];
      // Normal icon
      cache[`${hubClass}-normal`] = L.divIcon({
        className: `custom-hub-marker ${theme.className}`,
        html: `
          <div class="marker-container">
            <div class="marker-circle shadow-xl"></div>
            <div class="marker-class-badge">${theme.label}</div>
            <div class="marker-inner-dot"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
      // Selected icon
      cache[`${hubClass}-selected`] = L.divIcon({
        className: `custom-hub-marker ${theme.className} custom-hub-marker-selected`,
        html: `
          <div class="marker-container">
            <div class="marker-circle shadow-xl"></div>
            <div class="marker-class-badge">${theme.label}</div>
            <div class="marker-inner-dot"></div>
            <div class="marker-pulse"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    });
    return cache;
  }, [iconTheme]);

  const markers = useMemo(() => {
    return features.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      const details = readHubDetails(feature);
      const id = details.id;
      if (id == null) return null;
      const isSelected = selectedHubId != null && selectedHubId === id;
      const hubClass = details.hubClass;
      const iconKey = `${hubClass}-${isSelected ? "selected" : "normal"}`;
      const icon = iconsCache[iconKey] || iconsCache["Starter-normal"];

      return (
        <SafeMarker
          key={id}
          id={id}
          position={[lat, lng]}
          icon={icon}
          isSelected={isSelected}
          onSelectHub={onSelectHub}
          feature={feature}
        />
      );
    });
  }, [features, selectedHubId, iconsCache, onSelectHub]);

  const hasFeatures = features.length > 0;
  const defaultCenter = useMemo(() => {
    return hasFeatures
      ? [features[0].geometry.coordinates[1], features[0].geometry.coordinates[0]]
      : [20, 0];
  }, [hasFeatures, features]);

  const zoom = hasFeatures ? 5 : 2;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      className="hub-os-student-map h-full w-full"
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
      whenReady={(event) => {
        if (!event?.target) return;
        // Reduced stabilization timeout
        window.setTimeout(() => {
          safeInvalidateMapSize(event.target);
        }, 100);
      }}
    >
      <MapBoot />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds features={features} selectedHubId={selectedHubId} />
      {markers}
      <style jsx global>{`
        .hub-os-student-map.leaflet-container {
          height: 100%;
          width: 100%;
          background: #e5e7eb;
        }
        .hub-os-student-map .leaflet-pane,
        .hub-os-student-map .leaflet-tile,
        .hub-os-student-map .leaflet-marker-icon,
        .hub-os-student-map .leaflet-marker-shadow {
          max-width: none !important;
          max-height: none !important;
        }
        .hub-os-student-map .leaflet-tile {
          width: 256px !important;
          height: 256px !important;
        }
        .hub-os-student-map.leaflet-container img {
          max-width: none !important;
          max-height: none !important;
          width: auto !important;
          height: auto !important;
        }
        .custom-hub-marker {
          background: none !important;
          border: none !important;
        }
        .marker-container {
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid #fff;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 2;
        }
        .marker-class-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          min-width: 16px;
          height: 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #0f172a;
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.14);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.18);
          z-index: 4;
          pointer-events: none;
        }
        .marker-inner-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
          z-index: 3;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .custom-hub-marker-selected .marker-circle {
          width: 22px;
          height: 22px;
          background: #0f172a !important;
          transform: scale(1.2);
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
        }
        .custom-hub-marker-selected .marker-inner-dot {
          opacity: 1;
        }
        .marker-pulse {
          position: absolute;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.15);
          z-index: 1;
          animation: marker-pulse-anim 2s infinite;
        }
        @keyframes marker-pulse-anim {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .hub-class-starter .marker-circle { background: #3b82f6; }
        .hub-class-bronze .marker-circle { background: #b45309; }
        .hub-class-silver .marker-circle { background: #64748b; }
        .hub-class-gold .marker-circle { background: #ca8a04; }
        .hub-class-150 .marker-circle { background: #7c3aed; }
        .hub-class-bronze .marker-class-badge { color: #78350f; background: #fcd9b6; border-color: #d97706; }
        .hub-class-silver .marker-class-badge { color: #334155; background: #e2e8f0; border-color: #94a3b8; }
        .hub-class-gold .marker-class-badge { color: #713f12; background: #fde68a; border-color: #ca8a04; }
        .hub-class-starter .marker-class-badge { color: #1e3a8a; background: #dbeafe; border-color: #3b82f6; }
        .hub-class-150 .marker-class-badge { color: #4c1d95; background: #ede9fe; border-color: #7c3aed; }

        .custom-hub-marker:hover .marker-circle {
          transform: scale(1.3);
          box-shadow: 0 0 0 6px rgba(0,0,0,0.05);
        }

        .hub-map-title {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }
        .hub-map-title:before { display: none !important; }
        .hub-map-title .leaflet-tooltip-content {
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-blur: 8px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          color: #0f172a;
          padding: 4px 8px;
          transform: translateY(-8px);
        }
        .hub-name-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          max-width: 220px;
        }
        .hub-name-text {
          display: inline-block;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 800;
          color: #0f172a;
        }
        .hub-class-chip {
          border-radius: 999px;
          padding: 2px 6px;
          font-size: 9px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
          background: #f1f5f9;
          color: #334155;
        }
        .hub-map-title-bronze .hub-class-chip {
          background: #fcd9b6;
          color: #78350f;
          border-color: #d97706;
        }
        .hub-map-title-silver .hub-class-chip {
          background: #e2e8f0;
          color: #334155;
          border-color: #94a3b8;
        }
        .hub-map-title-gold .hub-class-chip {
          background: #fde68a;
          color: #713f12;
          border-color: #ca8a04;
        }
        .hub-map-title-starter .hub-class-chip {
          background: #dbeafe;
          color: #1e3a8a;
          border-color: #3b82f6;
        }
        .hub-map-title-class-150 .hub-class-chip {
          background: #ede9fe;
          color: #4c1d95;
          border-color: #7c3aed;
        }

        .hub-map-popup .leaflet-popup-content-wrapper {
          border-radius: 20px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: none;
        }
        .hub-map-popup .leaflet-popup-content {
          margin: 0;
          width: 220px !important;
        }
        .hub-map-popup .leaflet-popup-tip-container { display: none; }
      `}</style>
    </MapContainer>
  );
}
