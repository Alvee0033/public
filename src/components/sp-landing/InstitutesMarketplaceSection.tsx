"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Globe as GlobeIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "@/lib/axios";

interface Institute {
  id: string;
  institute_id?: string;
  name: string;
  institute_name?: string;
  master_institute_type?: { name: string };
  courses_offering?: number;
}

export default function InstitutesMarketplaceSection() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstitutes() {
      try {
        const res = await axios.get("/learning-hub", {
          params: { limit: 8, page: 1 },
        });

        const rawData = res?.data?.data;
        const hubs = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.items)
            ? rawData.items
            : [];

        const items = hubs.slice(0, 4).map((hub: any) => ({
          id: String(hub.id || ""),
          name: hub.hub_name || hub.name || "Learning Hub",
          master_institute_type: {
            name: hub.hub_class_label || "Learning Hub",
          },
          courses_offering: Array.isArray(hub.services_offered)
            ? hub.services_offered.length
            : 0,
        }));

        setInstitutes(items.filter((inst: Institute) => inst.id));
      } catch (err) {
        console.error("Error fetching learning hubs:", err);
        setInstitutes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInstitutes();
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container relative z-10 px-4 mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="default" className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
              <Building2 className="w-3.5 h-3.5" />
              Institutes Network
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight">
              Top Tier <br />
              <span className="text-blue-600">Educational Partners.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Connect with schools, colleges, and training centers across the globe. Streamlined admissions and scholarship tracking.
            </p>
          </div>
          
          <button type="button" className="h-14 px-8 rounded-2xl border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm group">
            Browse All Institutes
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-slate-50 rounded-3xl animate-pulse border border-slate-100" />
             ))
          ) : (
            institutes.map((inst, i) => (
              <div
                key={inst.id}
                className="group bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center space-y-6"
                style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
              >
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Building2 className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{inst.name}</h3>
                   <div className="flex items-center justify-center gap-2">
                     <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400 uppercase tracking-widest">
                        {inst.master_institute_type?.name || "Premium Partner"}
                     </Badge>
                   </div>
                </div>

                <div className="w-full pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-black text-slate-950 tabular-nums">{inst.courses_offering || 12}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Courses</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-950 tabular-nums">48</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Scholars</div>
                  </div>
                </div>

                <Link href={`/institutes/${inst.id}`} className="w-full h-12 rounded-xl text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-50 inline-flex items-center justify-center">
                  View Profile
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Global Stats Bar */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 lg:gap-24 opacity-60">
           {[
             { label: "Global Schools", val: "500+", icon: <GlobeIcon className="w-5 h-5" /> },
             { label: "Verified Partners", val: "100%", icon: <ShieldCheck className="w-5 h-5" /> },
             { label: "Student Placements", val: "150K+", icon: <Users className="w-5 h-5" /> }
           ].map((stat, i) => (
             <div key={i} className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 border border-slate-100">{stat.icon}</div>
                <div>
                   <div className="text-xl font-black text-slate-950">{stat.val}</div>
                   <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
