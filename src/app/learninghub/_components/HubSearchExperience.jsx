"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";
import {
  Building2,
  CheckCircle2,
  LayoutGrid,
  ListFilter,
  LocateFixed,
  Map as MapIcon,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HubStudentCard } from "./HubStudentCard";
import { LocationSuggestInput } from "./LocationSuggestInput";
import { serializeSearchParams } from "./paramsSerializer";
import { cn } from "@/lib/utils";
import { useHubDirectoryGeo } from "@/contexts/HubDirectoryGeoContext";
import dynamic from "next/dynamic";

const HubStudentMap = dynamic(
  () => import("./HubStudentMap").then((mod) => mod.HubStudentMap),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--sp-blue)] border-t-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Map Engine...</span>
        </div>
      </div>
    )
  }
);

const EMPTY = { items: [], total: 0, page: 1, limit: 24 };
const HUB_CLASSES = ["all", "Starter", "Bronze", "Silver", "Gold", "Class 150"];
const SERVICE_OPTIONS = [
  { id: "Tutoring", label: "Tutoring" },
  { id: "STEM Lab", label: "STEM lab" },
  { id: "Bootcamp", label: "Bootcamp" },
  { id: "Device Rental", label: "Device rental" },
];

const VIEW_OPTIONS = [
  { id: "split", label: "Split", icon: LayoutGrid },
  { id: "list", label: "List", icon: ListFilter },
  { id: "map", label: "Map", icon: MapIcon },
];

function isHubOpen(hub) {
  if (typeof hub?.open_now === "boolean") return hub.open_now;
  return Boolean(hub?.phone_number);
}

export function HubSearchExperience() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hubClass, setHubClass] = useState("all");
  const [services, setServices] = useState([]);
  const [radiusKm, setRadiusKm] = useState([50]);
  const { userPos, geoStatus, requestGeo, clearGeo } = useHubDirectoryGeo();
  const [openNow, setOpenNow] = useState(false);
  const [view, setView] = useState("split");
  const [hubResult, setHubResult] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapError, setMapError] = useState("");
  const [selectedHubId, setSelectedHubId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilteredItems, setLocalFilteredItems] = useState([]);
  const [isLocalFiltering, setIsLocalFiltering] = useState(false);
  const [instituteQuery, setInstituteQuery] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [mapData, setMapData] = useState({ type: "FeatureCollection", features: [] });
  const [hasLoadedMap, setHasLoadedMap] = useState(false);
  const shouldLoadMap = view === "map" || view === "split";

  // Optimistic local filtering for instant feedback
  useEffect(() => {
    if (!hubResult.items?.length) {
      setLocalFilteredItems([]);
      return;
    }

    setIsLocalFiltering(true);
    const timeout = setTimeout(() => {
      const filtered = hubResult.items.filter((item) => {
        // Local Hub Class filter
        if (hubClass !== "all" && item.hub_class_label !== hubClass) return false;
        
        // Local search filter (basic) - Use debouncedQuery to prevent jank
        if (debouncedQuery.trim()) {
          const s = debouncedQuery.toLowerCase();
          const match = 
            item.hub_name?.toLowerCase().includes(s) || 
            item.city?.toLowerCase().includes(s) ||
            item.hub_class_label?.toLowerCase().includes(s);
          if (!match) return false;
        }

        // Local Open Now filter
        if (openNow && !isHubOpen(item)) return false;

        return true;
      });
      setLocalFilteredItems(filtered);
      setIsLocalFiltering(false);
    }, 10);

    return () => clearTimeout(timeout);
  }, [hubResult.items, hubClass, debouncedQuery, openNow]);

  const filteredMapData = useMemo(() => {
    if (!mapData.features?.length) return mapData;
    const filtered = mapData.features.filter((f) => {
      const p = f.properties || {};
      if (hubClass !== "all" && p.hub_class_label !== hubClass) return false;
      if (debouncedQuery.trim()) {
        const s = debouncedQuery.toLowerCase();
        if (!(p.hub_name?.toLowerCase().includes(s) || p.city?.toLowerCase().includes(s))) return false;
      }
      if (openNow && !isHubOpen(p)) return false;
      return true;
    });
    return { ...mapData, features: filtered };
  }, [mapData, hubClass, debouncedQuery, openNow]);

  const displayItems = (isLocalFiltering || (loading && !hubResult.items?.length))
    ? localFilteredItems 
    : (hubResult.items || []);

  const fetchHubs = useCallback(async (forcedQuery, signal) => {
    setLoading(true);
    setError("");
    try {
      const activeQuery = typeof forcedQuery === "string" ? forcedQuery : debouncedQuery;
      const params = {
        q: activeQuery.trim() || undefined,
        hub_class: hubClass !== "all" ? hubClass : undefined,
        page: 1,
        limit: 24,
        services_offered: services.length ? services : undefined,
        institute_id: instituteId || undefined,
        lat: userPos?.lat,
        lng: userPos?.lng,
        radius_km: userPos ? radiusKm[0] : undefined,
      };
      const res = await axios.get("/learning-hub", {
        params,
        signal,
        paramsSerializer: serializeSearchParams,
      });
      setHubResult(res?.data?.data ?? res?.data ?? EMPTY);
    } catch (e) {
      if (axios.isCancel(e)) return;
      setError(e?.response?.data?.message || "We could not load hubs right now. Try again shortly.");
      setHubResult(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, hubClass, services, instituteId, userPos, radiusKm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    fetchHubs(undefined, controller.signal);
    return () => controller.abort();
  }, [fetchHubs]);

  useEffect(() => {
    let mounted = true;
    if (instituteQuery.trim().length < 2) {
      setInstituteOptions([]);
      return () => {
        mounted = false;
      };
    }

    const loadInstitutes = async () => {
      try {
        const res = await axios.get("/institute-directory/public/institutes", {
          params: {
            search: instituteQuery.trim(),
            limit: 8,
          },
        });
        if (!mounted) return;
        const payload = res?.data?.data ?? res?.data ?? {};
        setInstituteOptions(Array.isArray(payload.items) ? payload.items : []);
      } catch {
        if (mounted) setInstituteOptions([]);
      }
    };

    const timer = window.setTimeout(loadInstitutes, 180);
    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, [instituteQuery]);

  useEffect(() => {
    if (!shouldLoadMap || hasLoadedMap) {
      return;
    }

    let mounted = true;
    let timeoutId;
    let idleId;

    const loadMap = async () => {
      setMapLoading(true);
      setMapError("");
      try {
        const res = await axios.get("/learning-hub/map", { skipErrorLog: true });
        if (!mounted) return;
        setMapData(res?.data?.data || { type: "FeatureCollection", features: [] });
        setHasLoadedMap(true);
      } catch {
        if (!mounted) return;
        setMapError("Map data is unavailable.");
        setMapData({ type: "FeatureCollection", features: [] });
      } finally {
        if (mounted) setMapLoading(false);
      }
    };

    const scheduleLoad = () => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(loadMap, { timeout: 1200 });
        return;
      }
      timeoutId = window.setTimeout(loadMap, 180);
    };

    scheduleLoad();

    return () => {
      mounted = false;
      if (typeof window !== "undefined" && idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hasLoadedMap, shouldLoadMap]);


  const activeFilterCount = [
    query.trim(),
    hubClass !== "all" ? hubClass : "",
    services.length ? "services" : "",
    instituteId,
    userPos ? "near" : "",
    openNow ? "open" : "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setQuery("");
    setHubClass("all");
    setServices([]);
    setInstituteId("");
    setInstituteQuery("");
    setOpenNow(false);
    clearGeo();
    setShowFilters(false);
  };

  const resultLabel = loading
    ? "Updating directory"
    : `${displayItems.length.toLocaleString()} ${displayItems.length === 1 ? "hub" : "hubs"} available`;
  const filterSummary = [
    query.trim() ? query.trim() : "",
    hubClass !== "all" ? hubClass : "",
    instituteQuery.trim() && instituteId ? instituteQuery.trim() : "",
    services.length ? services.join(", ") : "",
    userPos ? `within ${radiusKm[0]}km` : "",
    openNow ? "open now" : "",
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 selection:bg-sky-100 selection:text-[var(--sp-blue)]">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-[radial-gradient(circle,rgba(40,132,171,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[20%] -right-[5%] h-[35%] w-[35%] rounded-full bg-[radial-gradient(circle,rgba(134,101,170,0.04)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[45%] w-[45%] rounded-full bg-[radial-gradient(circle,rgba(236,94,35,0.03)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <header className="relative pt-16 pb-12">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-100/50 bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sp-blue)] shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
              </span>
              Verified Learning Network
            </div>
            <h1 className="mt-6 font-display text-4xl font-normal tracking-tight text-[var(--sp-ink)] sm:text-5xl md:text-6xl">
              Find your <span className="italic text-[var(--sp-blue)]">perfect</span> learning hub
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-500/90">
              Explore our global network of approved hubs, STEM labs, and career centers. Your journey to excellence starts here.
            </p>
          </div>
        </div>
      </header>

      <section className="sticky top-0 z-40 transition-all duration-300">
        <div className="container py-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-2 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            {/* Animated focus border */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(40,132,171,0.05),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="grid gap-2 lg:grid-cols-[minmax(280px,1.4fr)_180px_minmax(220px,1fr)_auto]">
              <div className="relative">
                <Navigation className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <LocationSuggestInput
                  value={query}
                  onChange={setQuery}
                  onPickSuggestion={(s) => {
                    setQuery(s.label);
                    setDebouncedQuery(s.label);
                  }}
                  placeholder="City, state, or hub name..."
                  hideIcon
                  inputClassName="!h-14 !rounded-xl !border-0 !bg-slate-50/50 !pl-11 !pr-28 !text-base !font-medium !shadow-none transition focus:!bg-white focus:!ring-2 focus:!ring-sky-100"
                />
                <button
                  type="button"
                  onClick={requestGeo}
                  className={cn(
                    "absolute right-2 top-1/2 z-20 inline-flex h-10 -translate-y-1/2 items-center gap-1.5 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                    userPos
                      ? "bg-[var(--sp-blue)] text-white shadow-md shadow-sky-200"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100",
                  )}
                >
                  <LocateFixed className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Near me</span>
                </button>
              </div>

              <div className="relative">
                <select
                  value={hubClass}
                  onChange={(e) => setHubClass(e.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border-0 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-100"
                >
                  {HUB_CLASSES.map((value) => (
                    <option key={value} value={value}>
                      {value === "all" ? "Any Class" : value}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <Building2 className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={instituteQuery}
                  onChange={(e) => {
                    setInstituteQuery(e.target.value);
                    if (!e.target.value.trim()) setInstituteId("");
                  }}
                  placeholder="Partner institute..."
                  className="h-14 w-full rounded-xl border-0 bg-slate-50/50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
                {instituteOptions.length > 0 ? (
                  <div className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-auto rounded-xl border border-slate-100 bg-white p-1 shadow-2xl">
                    {instituteOptions.map((item) => (
                      <button
                        key={item.institute_id}
                        type="button"
                        className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                        onClick={() => {
                          setInstituteId(item.institute_id);
                          setInstituteQuery(item.canonical_name);
                          setInstituteOptions([]);
                        }}
                      >
                        <span className="line-clamp-1 text-sm font-bold text-slate-800">{item.canonical_name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {item.country_code} · Tier {item.tier}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                  variant="ghost"
                  className={cn(
                    "h-14 rounded-xl px-4 transition-all hover:bg-slate-100",
                    activeFilterCount && "bg-sky-50 text-[var(--sp-blue)] hover:bg-sky-100",
                  )}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  {activeFilterCount ? (
                    <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--sp-blue)] px-1 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>
                <Button
                  type="button"
                  onClick={() => fetchHubs(query)}
                  className="h-14 rounded-xl bg-[var(--sp-blue)] px-8 text-sm font-bold text-white shadow-lg shadow-sky-200 transition-all hover:bg-[var(--sp-blue-deep)] hover:shadow-xl active:scale-95"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Hubs
                </Button>
              </div>
            </div>
          </div>

          {showFilters ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Search Radius
                    </Label>
                    <span className="text-sm font-bold text-[var(--sp-blue)]">{radiusKm[0]}km</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={radiusKm[0]}
                    onChange={(e) => setRadiusKm([Number(e.target.value)])}
                    disabled={!userPos}
                    className={cn("h-1.5 w-full accent-[var(--sp-blue)] transition-opacity", !userPos && "opacity-30")}
                  />
                  {!userPos && (
                    <p className="text-[11px] font-medium text-slate-400">Enable "Near me" to filter by distance.</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Services & Amenities
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map((service) => (
                      <label
                        key={service.id}
                        className={cn(
                          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[11px] font-bold transition-all",
                          services.includes(service.id)
                            ? "border-[var(--sp-blue)] bg-sky-50 text-[var(--sp-blue)]"
                            : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100",
                        )}
                      >
                        <Checkbox
                          className="hidden"
                          checked={services.includes(service.id)}
                          onCheckedChange={() =>
                            setServices((prev) =>
                              prev.includes(service.id)
                                ? prev.filter((v) => v !== service.id)
                                : [...prev, service.id],
                            )
                          }
                        />
                        {service.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Hub Availability
                  </Label>
                  <button
                    onClick={() => setOpenNow(!openNow)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                      openNow 
                        ? "border-emerald-100 bg-emerald-50/50" 
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    )}
                  >
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
                      openNow ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"
                    )}>
                      {openNow && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800">Open Now</span>
                      <span className="text-[11px] font-medium text-slate-500">Only show active learning hubs</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <main className="container relative py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--sp-ink)]">
              {loading ? "Discovering hubs..." : resultLabel}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
              {filterSummary.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    {filterSummary.map((f, i) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                        {f}
                      </span>
                    ))}
                  </div>
                  <button onClick={resetFilters} className="text-[var(--sp-blue)] hover:underline">Clear all</button>
                </>
              ) : (
                "Showing all verified locations in the directory"
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100/50 p-1 backdrop-blur-sm">
            {VIEW_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setView(option.id)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-bold transition-all",
                    view === option.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
            <X className="h-5 w-5" />
            {error}
          </div>
        )}

        <div
          className={cn(
            "grid gap-8",
            view === "split" && "xl:grid-cols-[450px_minmax(0,1fr)]",
            view !== "split" && "grid-cols-1",
          )}
        >
          {(view === "map" || view === "split") && (
            <aside className={cn(
              "overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 shadow-2xl transition-all",
              view === "split" ? "xl:sticky xl:top-32 xl:h-[calc(100vh-160px)]" : "h-[600px]"
            )}>
              <HubStudentMap
                variant="expanded"
                data={filteredMapData}
                loading={mapLoading}
                error={mapError}
                searchQuery={query}
                selectedHubId={selectedHubId}
                onSelectHub={setSelectedHubId}
              />
            </aside>
          )}

          {(view === "list" || view === "split") && (
            <section className="space-y-8">
              {loading && !displayItems.length ? (
                <div className={cn(
                  "grid gap-6",
                  view === "split" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                )}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm transition-all">
                      <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-slate-100" />
                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
                          <div className="h-4 w-12 animate-pulse rounded-full bg-slate-100" />
                        </div>
                        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-100" />
                        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-50" />
                        <div className="pt-2 flex gap-2">
                           <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-50" />
                           <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-50" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayItems.length ? (
                <div className={cn(
                  "grid gap-6 stagger",
                  view === "split" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                )}>
                  {displayItems.map((hub) => (
                    <HubStudentCard
                      key={hub.id}
                      hub={hub}
                      highlight={selectedHubId === hub.id}
                      onSelect={(id) => setSelectedHubId(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl shadow-slate-200/50">
                    <Search className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-slate-900">No hubs found matching your search</h3>
                  <p className="mt-3 max-w-sm text-base font-medium text-slate-500">
                    Try adjusting your filters, expanding your search radius, or searching for a different location.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-8 h-12 rounded-xl bg-slate-900 px-8 text-sm font-bold text-white transition-all hover:bg-slate-800"
                  >
                    Reset all filters
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>

  );
}
