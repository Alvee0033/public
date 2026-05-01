"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, TrendingUp, Shield, ArrowRight, PieChart, Users } from "lucide-react";

export default function LaunchPadSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Content Side */}
          <div className="space-y-10">
            <div className="space-y-4">
              <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50 border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
                <Heart className="w-3.5 h-3.5 fill-orange-600" />
                LaunchPad Philanthropy
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-slate-950 leading-[0.9]">
                Fund Impact. <br />
                <span className="text-orange-600">Change Lives.</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Create scholarships with 97% pass-through efficiency. Directly support learners and track real-time impact through our transparent protocol.
              </p>
            </div>

            <div className="space-y-6">
               {[
                 { icon: <Target className="text-orange-600" />, title: "Targeted Campaigns", desc: "Support specific demographics or regions." },
                 { icon: <Shield className="text-green-600" />, title: "97% Efficiency", desc: "Minimal overhead, maximal student funding." },
                 { icon: <PieChart className="text-blue-600" />, title: "SP1000 Network", desc: "Join 1000 donors shaping the future." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                       {item.icon}
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-slate-950 hover:bg-orange-600 text-white font-black text-lg transition-all shadow-xl group" asChild>
                <Link href="/launchpad">
                  Explore LaunchPad
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Dashboard Card */}
          <div
            className="p-8 lg:p-12 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-2xl relative"
            style={{ animation: "fadeIn 0.8s ease-out both" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="space-y-8 relative z-10">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Impact Tracker</h4>
                  <Badge variant="outline" className="text-[8px] font-black border-slate-200 uppercase tracking-widest">Real-time Data</Badge>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Funded</div>
                        <div className="text-4xl font-black text-slate-950 tabular-nums font-mono">$127,500</div>
                     </div>
                     <TrendingUp className="w-8 h-8 text-green-500 mb-1" />
                  </div>
                 <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500" 
                        style={{ animation: "expandWidth 1.5s ease-out both", width: "75%" }}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200/60">
                  <div className="space-y-1">
                     <div className="text-2xl font-black text-slate-950">43</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Students Supported</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-2xl font-black text-slate-950">89%</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Completion Rate</div>
                  </div>
               </div>

               <div className="pt-4 space-y-3">
                  <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Top Support areas</div>
                  {[
                    { label: "STEM Programs", val: "$54K", color: "bg-blue-600" },
                    { label: "Career Bootcamps", val: "$38K", color: "bg-indigo-600" },
                    { label: "K-12 Tutoring", val: "$35.5K", color: "bg-purple-600" }
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <span className="text-xs font-bold text-slate-500 group-hover:text-slate-950 transition-colors uppercase tracking-tight">{cat.label}</span>
                       <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-slate-100">{cat.val}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
