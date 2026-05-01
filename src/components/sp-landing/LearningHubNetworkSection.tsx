"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe as GlobeIcon, MapPin, Star, Clock, Building2, ChevronRight, Search, Navigation, CheckCircle2 } from "lucide-react";
import axios from "@/lib/axios";

interface Hub {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: string;
  features: string[];
  hours: string;
  rating: string;
  description?: string;
}

export default function LearningHubNetworkSection() {
  const [zones, setZones] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredZones, setFilteredZones] = useState<Hub[]>([]);

  useEffect(() => {
    async function fetchZones() {
      try {
            const response = await axios.get("/learning-hub", {
               params: { limit: 12, page: 1 },
            });

            const rawData = response?.data?.data;
            const hubs = Array.isArray(rawData)
               ? rawData
               : Array.isArray(rawData?.items)
                  ? rawData.items
                  : [];

            const transformedZones = hubs.slice(0, 6).map((hub: any, index: number) => {
               const city = hub.city || hub.master_city?.name;
               const state = hub.state_code || hub.master_state?.name;
               const country = hub.country_code || hub.master_country?.name;
               const address = [hub.address_line1, city, state, country].filter(Boolean).join(", ");

               return {
                  id: String(hub.id ?? `hub-${index + 1}`),
                  name: hub.hub_name || hub.name || "Learning Hub",
                  address: address || "Global",
                  distance: "Nearby",
                  type: hub.hub_class_label || (hub.featured ? "Featured" : "Learning Hub"),
                  features:
                     Array.isArray(hub.services_offered) && hub.services_offered.length
                        ? hub.services_offered.slice(0, 2)
                        : ["Tutoring", "STEM Lab"],
                  hours: "09:00 - 21:00",
                  rating: Number(hub.avg_rating || 4.8).toFixed(1),
               };
            });

            setZones(transformedZones);
         } catch {
            setZones([]);
      } finally {
        setLoading(false);
      }
    }
    fetchZones();
  }, []);

  useEffect(() => {
    if (!loading && zones.length > 0) {
      const filtered = zones.filter((zone) => {
        const searchTerm = searchLocation.toLowerCase();
        return (
          zone.name.toLowerCase().includes(searchTerm) ||
          zone.address.toLowerCase().includes(searchTerm)
        );
      });
      setFilteredZones(filtered);
    } else {
      setFilteredZones(zones);
    }
  }, [zones, searchLocation, loading]);

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="container relative z-10 px-4 mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge className="bg-slate-900 text-white border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] w-fit mx-auto flex items-center gap-2">
            <GlobeIcon className="w-3.5 h-3.5" />
            Global Network
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight">
            5,000+ Physical <br />
            <span className="text-blue-600">Learning Centers.</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            In-person tutoring, high-tech STEM labs, and collaborative study spaces in your neighborhood.
          </p>
        </div>

        {/* Search & Filter Area */}
        <div className="max-w-5xl mx-auto mb-20">
           <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-slate-100 relative">
              <div className="absolute top-0 left-12 w-24 h-1 bg-blue-600 rounded-full" />
              
              <div className="grid lg:grid-cols-3 gap-8 items-end">
                 <div className="lg:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Find a Hub</label>
                    <div className="relative group">
                       <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <Input 
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          placeholder="Enter your city or neighborhood..." 
                          className="h-14 pl-16 pr-6 rounded-2xl bg-slate-50 border-slate-100 font-bold text-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Facility</label>
                    <Select defaultValue="all">
                       <SelectTrigger className="h-14 px-6 rounded-2xl bg-slate-50 border-slate-100 font-bold text-slate-900 focus:ring-blue-600">
                          <SelectValue placeholder="All types" />
                       </SelectTrigger>
                       <SelectContent className="rounded-2xl">
                          <SelectItem value="all">All Facilities</SelectItem>
                          <SelectItem value="full">Full Center</SelectItem>
                          <SelectItem value="stem">STEM Lab</SelectItem>
                          <SelectItem value="tutoring">Tutoring</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <Button className="h-14 px-10 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Nearby Hubs
                 </Button>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Displaying results for {searchLocation || "All Global Locations"}
                 </div>
              </div>
           </div>
        </div>

        {/* Results Grid */}
        <div className="max-w-5xl mx-auto space-y-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100" />
            ))
          ) : filteredZones.length === 0 ? (
            <div className="text-center py-20 space-y-4">
                <GlobeIcon className="w-16 h-16 text-slate-200 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">No Hubs Found</h3>
                <p className="text-slate-400 font-bold text-sm">Try searching for a different city or region.</p>
            </div>
          ) : (
            filteredZones.map((hub, i) => (
              <div
                key={hub.id}
                className="group bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-8"
                style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Building2 className="w-10 h-10" />
                </div>

                <div className="flex-grow space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                          <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight">{hub.name}</h4>
                          <div className="flex items-center justify-center md:justify-start gap-1 text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{hub.address}</span>
                          </div>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-black text-slate-900">{hub.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400 uppercase tracking-widest">{hub.type}</Badge>
                      {hub.features.map(f => (
                        <div key={f} className="flex items-center gap-1.5 opacity-60">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{f}</span>
                        </div>
                      ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 text-slate-950 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                      Directions
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                      Details
                    </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
           <Button variant="link" className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] hover:no-underline" asChild>
              <Link href="/learninghubs">Explore All Locations →</Link>
           </Button>
        </div>

      </div>
    </section>
  );
}
