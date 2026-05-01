"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Search, X, MapPin, Loader2,
  LocateFixed, CheckCircle2, Navigation,
} from "lucide-react";

// ─── Fix Leaflet default icons broken by webpack ─────────────────────────────
let iconsPatched = false;
function patchLeafletIcons() {
  if (iconsPatched) return;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
  iconsPatched = true;
}

// ─── Inner map helpers ────────────────────────────────────────────────────────

/** Forces Leaflet to recalculate its container size after React renders it */
function MapSizeWatcher() {
  const map = useMap();
  useEffect(() => {
    // Two-pass: immediate + after paint — fixes partial tile rendering
    map.invalidateSize();
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

/** Flies the viewport to given coords */
function MapFlyController({ flyTo }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) map.flyTo([flyTo.lat, flyTo.lng], 15, { animate: true, duration: 1.0 });
  }, [flyTo, map]);
  return null;
}

/** Click listener */
function ClickHandler({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

// ─── Nominatim helpers ────────────────────────────────────────────────────────

async function nominatimReverse(lat, lng) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

export function parseNominatimAddress(data) {
  if (!data?.address) return {};
  const a = data.address;
  return {
    road:         [a.house_number, a.road || a.pedestrian || a.footway || a.path].filter(Boolean).join(" "),
    line2:        a.suburb || a.neighbourhood || a.quarter || a.residential || "",
    city:         a.city || a.town || a.village || a.hamlet || a.municipality || a.county || "",
    state:        a.state || a.region || a.state_district || "",
    country:      a.country || "",
    country_code: (a.country_code || "").toUpperCase(),
    postcode:     a.postcode || "",
    displayName:  data.display_name || "",
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MapPinPicker({ latitude, longitude, onChange }) {
  const [ready, setReady] = useState(false);

  // Search
  const [query, setQuery]                   = useState("");
  const [suggestions, setSuggestions]       = useState([]);
  const [searching, setSearching]           = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Map state
  const [geocoding, setGeocoding] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [flyTo, setFlyTo]           = useState(null);

  // Staged (unconfirmed) pin — user must hit "Confirm" to commit
  const [staged, setStaged] = useState(null); // { lat, lng, address }

  const debounceRef = useRef(null);
  const wrapperRef  = useRef(null);

  // Patch icons once on client
  useEffect(() => {
    patchLeafletIcons();
    setReady(true);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const h = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleQueryChange = useCallback((val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&limit=6`,
          { headers: { "Accept-Language": "en" } }
        );
        const d = await r.json();
        setSuggestions(d);
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
      finally { setSearching(false); }
    }, 420);
  }, []);

  const handleSuggestionSelect = useCallback((s) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    setQuery(s.display_name.split(",").slice(0, 3).join(", "));
    setShowSuggestions(false);
    setSuggestions([]);
    setFlyTo({ lat, lng });
    const address = parseNominatimAddress(s);
    setStaged({ lat, lng, address });
  }, []);

  // ── Map click / drag ──────────────────────────────────────────────────────
  const handleMapClick = useCallback(async (lat, lng) => {
    setGeocoding(true);
    const data  = await nominatimReverse(lat, lng);
    const address = parseNominatimAddress(data);
    setGeocoding(false);
    setStaged({ lat, lng, address });
  }, []);

  const handleDragEnd = useCallback(async (e) => {
    const ll = e.target.getLatLng();
    setGeocoding(true);
    const data  = await nominatimReverse(ll.lat, ll.lng);
    const address = parseNominatimAddress(data);
    setGeocoding(false);
    setStaged({ lat: ll.lat, lng: ll.lng, address });
  }, []);

  // ── GPS ───────────────────────────────────────────────────────────────────
  const handleGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setFlyTo({ lat, lng });
        setGeocoding(true);
        const data  = await nominatimReverse(lat, lng);
        const address = parseNominatimAddress(data);
        setGeocoding(false);
        setGpsLoading(false);
        setStaged({ lat, lng, address });
        if (address?.displayName) setQuery(address.displayName.split(",").slice(0, 3).join(", "));
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // ── Confirm ───────────────────────────────────────────────────────────────
  const handleConfirm = useCallback(() => {
    if (!staged) return;
    onChange({ latitude: staged.lat, longitude: staged.lng, address: staged.address });
    setStaged(null); // clear the staged state after confirming
  }, [staged, onChange]);

  // Current confirmed pin (from parent form)
  const hasConfirmed =
    latitude !== "" && longitude !== "" &&
    !isNaN(Number(latitude)) && !isNaN(Number(longitude));

  // Use staged position for the marker while unconfirmed, else confirmed
  const markerPos = staged
    ? [staged.lat, staged.lng]
    : hasConfirmed
    ? [Number(latitude), Number(longitude)]
    : null;

  const mapCenter = markerPos ?? [20, 0];
  const mapZoom   = markerPos ? 14 : 2;

  if (!ready) {
    // Skeleton — same height as the map so the layout doesn't jump
    return (
      <div className="w-full space-y-2">
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-[340px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-gray-300 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">

      {/* ── Search + GPS row ── */}
      <div ref={wrapperRef} className="relative flex gap-2">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search city, area, or street…"
            className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800 min-w-0"
            autoComplete="off"
          />
          {searching && <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />}
          {query && !searching && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); setShowSuggestions(false); }}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* GPS button */}
        <button
          type="button"
          onClick={handleGPS}
          disabled={gpsLoading}
          title="Use my current location"
          className="shrink-0 w-11 h-11 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {gpsLoading
            ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            : <LocateFixed className="w-4 h-4 text-blue-500" />
          }
        </button>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-10 z-[9999] mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto">
            {suggestions.map((s) => (
              <li key={s.place_id}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSuggestionSelect(s); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-start gap-2.5 border-b border-gray-50 last:border-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-gray-700 leading-snug line-clamp-2">{s.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Map container ── */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        {/* Geocoding overlay */}
        {(geocoding || gpsLoading) && (
          <div className="absolute inset-0 z-[9998] bg-black/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm text-gray-700 font-medium">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              {gpsLoading ? "Getting your location…" : "Looking up address…"}
            </div>
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: 340, width: "100%" }}
          scrollWheelZoom
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <MapSizeWatcher />
          <MapFlyController flyTo={flyTo} />
          <ClickHandler onPick={handleMapClick} />
          {markerPos && (
            <Marker
              position={markerPos}
              draggable
              eventHandlers={{ dragend: handleDragEnd }}
            />
          )}
        </MapContainer>

        {/* Hint overlay when no pin placed yet */}
        {!markerPos && !geocoding && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 shadow text-xs text-gray-500 flex items-center gap-1.5 whitespace-nowrap">
              <Navigation className="w-3 h-3 text-blue-400" />
              Click anywhere on the map to drop a pin
            </div>
          </div>
        )}
      </div>

      {/* ── Staged location card + Confirm button ── */}
      {staged && (
        <div className="border border-blue-200 bg-blue-50 rounded-xl p-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-800 mb-0.5">Pin placed</p>
              <p className="text-xs text-blue-600 leading-snug line-clamp-2">
                {staged.address?.displayName || `${staged.lat.toFixed(5)}, ${staged.lng.toFixed(5)}`}
              </p>
              <p className="text-xs text-blue-400 mt-0.5">
                {staged.lat.toFixed(6)}, {staged.lng.toFixed(6)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            className="shrink-0 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirm
          </button>
        </div>
      )}

      {/* ── Confirmed location badge ── */}
      {!staged && hasConfirmed && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
          <span className="font-semibold">Location confirmed</span>
          <span className="text-emerald-500 ml-1">
            {Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}
          </span>
          <button
            type="button"
            onClick={() => onChange({ latitude: "", longitude: "", address: null })}
            className="ml-auto text-emerald-400 hover:text-red-500 transition-colors"
            title="Clear pin"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
