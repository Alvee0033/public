"use client";

import React from "react";
import {
  Users,
  TrendingUp,
  Globe as GlobeIcon,
  Rocket,
  ArrowRight,
  Building2,
  PieChart,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function EdupreneurSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-50">
      <style>{`
        @keyframes floatLeftRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
      `}</style>
      {/* Light ambient background — no external dark texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 100% 20%, rgba(40,132,171,.1) 0%, transparent 55%)," +
              "radial-gradient(ellipse 55% 50% at 0% 90%, rgba(134,101,170,.1) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[min(800px,90vw)] h-[min(800px,90vw)] rounded-full blur-[120px] translate-y-1/2 translate-x-1/3 opacity-80"
          style={{ background: "rgba(40,132,171,.12)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(40,132,171,.1) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* Visual Side */}
          <div className="lg:w-1/2 relative w-full">
            <div
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border bg-white"
              style={{ borderColor: "#E8EDF2", boxShadow: "0 24px 60px rgba(40,132,171,.15)", animation: "fadeIn 0.8s ease-out both" }}
            >
              <Image
                src="/images/female-tutor-portrait.jpg"
                alt="Edupreneur Opportunity"
                width={960}
                height={1200}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto aspect-[4/5] object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(248,250,252,.85) 0%, transparent 50%)",
                }}
              />

              <div
                className="absolute bottom-6 left-6 right-6 p-6 sm:p-8 rounded-[2rem] border backdrop-blur-xl"
                style={{
                  background: "rgba(255,255,255,.94)",
                  borderColor: "#E8EDF2",
                  boxShadow: "0 12px 40px rgba(0,0,0,.06)",
                }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--sp-blue), var(--sp-blue-deep))" }}
                  >
                    <Rocket className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight" style={{ color: "var(--sp-ink)" }}>
                      Agent Network
                    </h4>
                    <p className="font-bold text-xs uppercase tracking-widest mt-0.5" style={{ color: "var(--sp-blue)" }}>
                      Global Partner Program
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-3xl font-black tabular-nums" style={{ color: "var(--sp-ink)" }}>20%+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest leading-tight" style={{ color: "var(--sp-light)" }}>
                      Monthly <br />Commission
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black tabular-nums" style={{ color: "var(--sp-ink)" }}>1.2M</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest leading-tight" style={{ color: "var(--sp-light)" }}>
                      Student <br />Network
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -top-8 -right-4 bg-white p-5 rounded-2xl border shadow-xl hidden xl:block"
              style={{ borderColor: "#E8EDF2", animation: "floatLeftRight 5s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-sm" style={{ color: "var(--sp-ink)" }}>$45K Earned</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest leading-none" style={{ color: "var(--sp-muted)" }}>
                    Top Partner · UK
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 space-y-10" style={{ animation: "fadeIn 0.8s ease-out 0.2s both" }}>
            <div className="space-y-4">
              <Badge
                variant="default"
                className="border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-white"
                style={{ background: "linear-gradient(135deg, var(--sp-blue), var(--sp-purple))" }}
              >
                Partner Program
              </Badge>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[0.95]"
                style={{ color: "var(--sp-ink)" }}
              >
                Become an <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(90deg, var(--sp-blue), var(--sp-purple))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  Edupreneur.
                </span>
              </h2>
              <p className="text-lg font-medium leading-relaxed max-w-xl" style={{ color: "var(--sp-muted)" }}>
                Join our elite network of agents and institutes. Scale your education business with ScholarPASS AI infrastructure and global reach.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Building2 className="w-5 h-5" />, title: "Full Infrastructure", desc: "Turnkey CRM, payments, and AI matching tools." },
                { icon: <PieChart className="w-5 h-5" />, title: "Revenue Sharing", desc: "Highest payouts in the global education industry." },
                { icon: <GlobeIcon className="w-5 h-5" />, title: "Global Access", desc: "Represent thousands of universities worldwide." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 rounded-3xl border bg-white transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: "#E8EDF2" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      background: "var(--sp-blue-light)",
                      borderColor: "rgba(40,132,171,.2)",
                      color: "var(--sp-blue)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="font-black text-lg uppercase tracking-tight mb-1" style={{ color: "var(--sp-ink)" }}>
                      {item.title}
                    </h5>
                    <p className="font-bold text-xs leading-snug" style={{ color: "var(--sp-muted)" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="h-14 px-12 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-lg border-0 text-white group"
                style={{
                  background: "linear-gradient(135deg, var(--sp-orange), #c04a18)",
                  boxShadow: "0 8px 28px rgba(236,94,35,.35)",
                }}
              >
                Apply as Partner
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
