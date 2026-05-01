"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Star, Building2, CheckCircle2, Search, ArrowRight } from "lucide-react";
import axios from "@/lib/axios";

interface Hub {
  id: string;
  name: string;
  address: string;
  type: string;
  features: string[];
  rating: string;
}

export default function LearningHubNetworkSection() {
  const [zones, setZones]               = useState<Hub[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredZones, setFilteredZones] = useState<Hub[]>([]);

  useEffect(() => {
    async function fetchZones() {
      try {
        const response = await axios.get("/learning-hub", { params: { limit: 12, page: 1 } });
        const rawData = response?.data?.data;
        const hubs = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.items) ? rawData.items : [];

        const transformed = hubs.slice(0, 6).map((hub: any, index: number) => {
          const city    = hub.city || hub.master_city?.name;
          const state   = hub.state_code || hub.master_state?.name;
          const country = hub.country_code || hub.master_country?.name;
          const address = [hub.address_line1, city, state, country].filter(Boolean).join(", ");

          return {
            id: String(hub.id ?? `hub-${index + 1}`),
            name: hub.hub_name || hub.name || "Learning Hub",
            address: address || "Global",
            type: hub.hub_class_label || (hub.featured ? "Featured" : "Learning Hub"),
            features: Array.isArray(hub.services_offered) && hub.services_offered.length
              ? hub.services_offered.slice(0, 2)
              : ["Tutoring", "STEM Lab"],
            rating: Number(hub.avg_rating || 4.8).toFixed(1),
          };
        });

        setZones(transformed);
      } catch {
        setZones([]);
      } finally {
        setLoading(false);
      }
    }
    fetchZones();
  }, []);

  useEffect(() => {
    if (!searchLocation.trim()) {
      setFilteredZones(zones);
      return;
    }
    const term = searchLocation.toLowerCase();
    setFilteredZones(zones.filter((z) =>
      z.name.toLowerCase().includes(term) || z.address.toLowerCase().includes(term)
    ));
  }, [zones, searchLocation]);

  return (
    <section
      className="section-py relative overflow-hidden"
      style={{ background: "var(--sp-off)" }}
    >
      <div className="container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white mb-4"
            style={{ background: "var(--sp-navy)" }}
          >
            Global Network
          </span>
          <h2 className="section-title">
            5,000+ Physical{" "}
            <span style={{ color: "var(--sp-blue)" }}>Learning Centers.</span>
          </h2>
          <p className="section-sub mx-auto mt-3">
            In-person tutoring, high-tech STEM labs, and collaborative study spaces in your neighborhood.
          </p>
        </div>

        {/* Search card */}
        <div
          className="max-w-2xl mx-auto mb-12 rounded-xl border bg-white p-6"
          style={{ borderColor: "var(--sp-border)", boxShadow: "0 2px 12px rgba(15,23,42,.06)" }}
        >
          <label htmlFor="hub-search" className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--sp-light)" }}>
            Find a Hub Near You
          </label>
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                id="hub-search"
                type="search"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter your city or neighborhood..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border bg-[var(--sp-off)] text-[13.5px] text-slate-900 placeholder:text-slate-400 transition focus:border-[var(--sp-blue)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--sp-blue)]/15"
                style={{ borderColor: "var(--sp-border)" }}
              />
            </div>
            <button
              type="button"
              className="h-11 px-5 rounded-lg text-[13px] font-bold text-white flex items-center gap-2 transition-all flex-shrink-0"
              style={{ background: "var(--sp-navy)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-blue)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-navy)"; }}
              aria-label="Search nearby hubs"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto space-y-4" role="list" aria-label="Learning hubs">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl border animate-pulse" style={{ borderColor: "var(--sp-border)" }} role="listitem" aria-label="Loading" />
            ))
          ) : filteredZones.length === 0 ? (
            <div className="text-center py-16" role="listitem">
              <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--sp-gray200)" }} aria-hidden="true" />
              <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--sp-ink)" }}>No Hubs Found</h3>
              <p className="text-[13px]" style={{ color: "var(--sp-muted)" }}>Try a different city or region.</p>
            </div>
          ) : (
            filteredZones.map((hub, i) => (
              <div
                key={hub.id}
                className="group flex flex-col md:flex-row items-start md:items-center gap-5 p-5 bg-white rounded-xl border transition-all duration-200 hover:shadow-md"
                style={{ borderColor: "var(--sp-border)", animationDelay: `${i * 60}ms` }}
                role="listitem"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors group-hover:border-[var(--sp-blue)] group-hover:text-[var(--sp-blue)]"
                  style={{ background: "var(--sp-off)", borderColor: "var(--sp-border)", color: "var(--sp-muted)" }}
                  aria-hidden="true"
                >
                  <Building2 className="w-5.5 h-5.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-[14.5px] font-bold truncate" style={{ color: "var(--sp-ink)" }}>{hub.name}</h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                      <span className="text-[12.5px] font-bold" style={{ color: "var(--sp-ink)" }}>{hub.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "var(--sp-light)" }} aria-hidden="true" />
                    <span className="text-[11.5px] font-medium truncate" style={{ color: "var(--sp-muted)" }}>{hub.address}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className="inline-block text-[10.5px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                      style={{ borderColor: "var(--sp-border)", color: "var(--sp-muted)" }}
                    >
                      {hub.type}
                    </span>
                    {hub.features.map((f) => (
                      <span key={f} className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--sp-muted)" }}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    className="h-9 px-4 rounded-lg text-[12px] font-semibold border transition-all"
                    style={{ borderColor: "var(--sp-border)", color: "var(--sp-muted)", background: "white" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--sp-blue)"; e.currentTarget.style.color = "var(--sp-blue)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sp-border)"; e.currentTarget.style.color = "var(--sp-muted)"; }}
                  >
                    Directions
                  </button>
                  <Link
                    href={`/learninghubs`}
                    className="h-9 px-4 rounded-lg text-[12px] font-bold text-white transition-all flex items-center"
                    style={{ background: "var(--sp-navy)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-blue)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-navy)"; }}
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/learninghubs"
            className="inline-flex items-center gap-2 text-[13px] font-bold transition-colors"
            style={{ color: "var(--sp-blue)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sp-navy)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sp-blue)"; }}
          >
            Explore All Locations
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
