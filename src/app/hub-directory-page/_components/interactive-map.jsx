"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

export function InteractiveMap({ data, loading, error, searchQuery = "" }) {
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);

  const features = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const source = data?.features || [];
    if (!query) {
      return source;
    }

    return source.filter((feature) => {
      const props = feature?.properties || {};
      return [props.name, props.city, props.stateCode, props.countryCode]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [data, searchQuery]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || mapLoaded || !data) {
      return;
    }

    let localMap;

    const loadMap = async () => {
      const L = (await import("leaflet")).default;
      localMap = L.map("hub-map-container").setView([20, 0], 2);
      setMapInstance(localMap);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(localMap);

      setMapLoaded(true);
    };

    loadMap();

    return () => {
      if (localMap) {
        localMap.remove();
      }
    };
  }, [data, isClient, mapLoaded]);

  useEffect(() => {
    if (!mapInstance || !mapLoaded) {
      return;
    }

    let cancelled = false;

    const renderMarkers = async () => {
      const L = (await import("leaflet")).default;

      markers.forEach((entry) => entry.remove());

      if (cancelled) {
        return;
      }

      const nextMarkers = features.map((feature) => {
        const [longitude, latitude] = feature.geometry.coordinates;
        const props = feature.properties || {};
        const featured = props.featured;

        const customIcon = L.divIcon({
          html: `
            <div style="
              background:${featured ? "#7c3aed" : "#2563eb"};
              width:32px;
              height:32px;
              border-radius:999px;
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-size:12px;
              font-weight:700;
              border:3px solid white;
              box-shadow:0 8px 20px rgba(15, 23, 42, 0.2);
            ">${props.score ?? 0}</div>
          `,
          className: "hub-map-pin",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
          mapInstance,
        );

        marker.bindPopup(`
          <div style="min-width:240px;padding:8px 4px;">
            <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">${props.city || ""} ${props.countryCode || ""}</div>
            <div style="font-weight:700;color:#111827;margin-bottom:6px;">${props.name}</div>
            <div style="font-size:13px;color:#4b5563;margin-bottom:8px;">${props.address || ""}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:12px;">
              <span style="background:#dbeafe;color:#1d4ed8;padding:4px 8px;border-radius:999px;">${props.hubClass}</span>
              <span style="background:#ecfdf5;color:#047857;padding:4px 8px;border-radius:999px;">Rating ${props.avgRating ?? 0}</span>
            </div>
          </div>
        `);

        return marker;
      });

      setMarkers(nextMarkers);

      if (features.length > 0) {
        const bounds = L.latLngBounds(
          features.map((feature) => [
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]),
        );
        mapInstance.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    renderMarkers();

    return () => {
      cancelled = true;
    };
  }, [features, mapInstance, mapLoaded]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 md:h-[500px]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-gray-600">Loading the global hub map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 md:h-[500px]">
        <div className="text-center">
          <div className="mb-4 text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 md:h-[500px]">
        <div className="text-gray-600">Initializing map...</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <div id="hub-map-container" className="h-96 w-full md:h-[500px]" />

      <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <h4 className="mb-2 text-sm font-semibold text-gray-800">HubOS Map</h4>
        <div className="space-y-2 text-xs text-gray-700">
          <div>{features.length} active hubs on the current map</div>
          <div>Pin label = Hub Class score</div>
          <div>Click a pin to inspect a hub</div>
        </div>
      </div>

      {features.length > 0 ? (
        <div className="absolute bottom-4 right-4 z-[1000] rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm">
          <Link
            href={`/hub-directory-page/${features[0].properties.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Open a hub profile
          </Link>
        </div>
      ) : null}
    </div>
  );
}
