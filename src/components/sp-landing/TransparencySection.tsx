"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Heart, Fingerprint, Lock, Eye, Building2 } from "lucide-react";

export default function TransparencySection() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
           <div className="text-center space-y-4 mb-12">
             <Badge className="bg-slate-950 text-white border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] w-fit mx-auto flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                Transparency Report
             </Badge>
             <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight">
                Built on <br />
                <span className="text-blue-600">Absolute Trust.</span>
             </h2>
             <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                We&apos;re committed to radical transparency. Real metrics, verified partners, and an unwavering student-first philosophy.
             </p>
           </div>

           <div 
             className="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-slate-100 shadow-xl relative overflow-hidden"
             style={{ animation: "fadeIn 0.5s ease-out both" }}
           >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Our Core Manifesto</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">
                       ScholarPASS is a growing ecosystem connecting the next generation with validated opportunities. We believe every dollar should be traceable and every tutor should be verified.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                       {[
                         { icon: <CheckCircle2 className="w-3 h-3" />, label: "Transparent", color: "bg-green-100 text-green-700" },
                         { icon: <Shield className="w-3 h-3" />, label: "Verified", color: "bg-blue-100 text-blue-700" },
                         { icon: <Heart className="w-3 h-3" />, label: "Empathetic", color: "bg-red-100 text-red-700" }
                       ].map((b, i) => (
                         <Badge key={i} className={`${b.color} border-0 px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-widest flex items-center gap-1.5`}>
                           {b.icon}
                           {b.label}
                         </Badge>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    {[
                      { icon: Fingerprint, title: "Identity Protected", desc: "Military-grade encryption for all records." },
                      { icon: Lock, title: "Secure Payouts", desc: "Audited bridge for SP-Wallet." },
                      { icon: Building2, title: "Verified Hubs", desc: "Every partner undergoes a 12-point audit." }
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group">
                         <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Icon className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{item.desc}</p>
                         </div>
                      </div>
                    );
                    })}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
