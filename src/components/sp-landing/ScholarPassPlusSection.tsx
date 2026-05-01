"use client";

import Link from "next/link";
import { Bot, Zap, Award, Target, CheckCircle2, ArrowRight, ShieldCheck, CreditCard, Rocket } from "lucide-react";
import Image from "next/image";
import React from "react";

const FEATURES = [
  { icon: Bot,        title: "AI Matching",   desc: "Hyper-targeted fund matching." },
  { icon: Zap,        title: "Auto Apply",    desc: "Instant application filing." },
  { icon: CreditCard, title: "Wallet Sync",   desc: "Integrated credit management." },
  { icon: Target,     title: "Live Counsel",  desc: "24/7 scholarship advisory." },
];

const PERKS = [
  "Priority application review",
  "AI essay assistant",
  "Unlimited scholarship matches",
  "$120 SP Wallet credit included",
];

export default function ScholarPassPlusSection() {
  return (
    <section
      className="py-16 lg:py-20 relative overflow-hidden"
      style={{ background: "var(--sp-blue-light)" }}
    >
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .sp-float-icon {
          animation: floatUpDown 3.5s ease-in-out infinite;
        }
      `}</style>
      
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]"
          style={{ background: "var(--sp-purple)" }} />
        <div className="absolute -left-16 bottom-0 w-[300px] h-[300px] rounded-full opacity-10 blur-[60px]"
          style={{ background: "var(--sp-blue)" }} />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Image side ───────────────────────────────────────── */}
          <div className="relative order-2 lg:order-1 transition-opacity duration-700">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(40,132,171,.18)] ring-1 ring-white/80">
              <Image
                src="/images/student-using-laptop-with-scholarship-dashboard--m.jpg"
                alt="ScholarPASS Plus Dashboard"
                width={1200}
                height={900}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto aspect-[4/3] object-cover hover:scale-[1.03] transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A4366]/20 to-transparent" />

              {/* Pricing badge */}
              <div className="absolute top-5 left-5">
                <div className="glass rounded-xl px-4 py-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5" style={{ color: "var(--sp-blue)" }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--sp-ink)" }}>
                      Plus Access
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black tracking-tighter" style={{ color: "var(--sp-ink)" }}>$120</span>
                    <span className="text-[12px] font-medium" style={{ color: "var(--sp-light)" }}>/yr</span>
                  </div>
                </div>
              </div>

              {/* Wallet active badge */}
              <div
                className="absolute bottom-5 right-5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-lg sp-float-icon"
                style={{ background: "var(--sp-blue-deep)" }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--sp-blue)" }}>
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">$120 Credit</div>
                  <div className="text-[9px] font-medium text-white/50 uppercase tracking-wide">Wallet Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Content side ─────────────────────────────────────── */}
          <div className="space-y-7 order-1 lg:order-2 transition-opacity duration-700">
            {/* Label */}
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-white mb-3"
                style={{ background: "var(--sp-purple)" }}
              >
                Premium Plan
              </span>
              <h2 className="section-title">
                Unlock More with{" "}
                <span style={{ color: "var(--sp-blue)" }}>ScholarPASS Plus.</span>
              </h2>
              <p className="text-[14px] leading-relaxed max-w-md mt-2" style={{ color: "var(--sp-muted)" }}>
                Advanced AI scholarship matching, auto-apply tools, and dedicated admissions counseling for serious applicants.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURES.map((item, i) => {
                const Icon = item.icon;
                return (
                <div
                  key={i}
                  className="group flex items-start gap-3 p-4 rounded-xl bg-white border transition-all duration-250 hover:shadow-md cursor-default"
                  style={{ borderColor: "var(--sp-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--sp-blue)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--sp-border)")}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-250"
                    style={{ background: "var(--sp-blue-light)", color: "var(--sp-blue)" }}
                    onMouseEnter={(e) => { (e.currentTarget.parentElement as HTMLElement).style.borderColor = "var(--sp-blue)"; }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold" style={{ color: "var(--sp-ink)" }}>{item.title}</h4>
                    <p className="text-[11px] font-medium leading-snug mt-0.5" style={{ color: "var(--sp-light)" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Perks list */}
            <ul className="space-y-2">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: "var(--sp-muted)" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--sp-blue)" }} />
                  {p}
                </li>
              ))}
            </ul>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/scholarpass-plus"
                className="btn-primary flex items-center gap-2 group"
              >
                Upgrade Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--sp-light)" }}>
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                Trusted by 1.2M+ Students
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
