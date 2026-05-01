"use client";

import Link from "next/link";
import { Bot, Zap, Award, Target, CheckCircle2, ArrowRight, ShieldCheck, CreditCard, Rocket } from "lucide-react";
import Image from "next/image";
import React from "react";

const FEATURES = [
  { icon: Bot,        title: "AI Matching",    desc: "Hyper-targeted scholarship fund matching." },
  { icon: Zap,        title: "Auto Apply",     desc: "Instant application filing and tracking." },
  { icon: CreditCard, title: "Wallet Sync",    desc: "Integrated credit and payment management." },
  { icon: Target,     title: "Live Counsel",   desc: "24/7 dedicated scholarship advisory." },
];

const PERKS = [
  "Priority application review",
  "AI essay writing assistant",
  "Unlimited scholarship matches",
  "$120 SP Wallet credit on sign-up",
];

export default function ScholarPassPlusSection() {
  return (
    <section
      className="section-py relative overflow-hidden"
      style={{ background: "var(--sp-blue-light)" }}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Image side ── */}
          <div className="relative order-2 lg:order-1">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                boxShadow: "0 8px 32px rgba(10,67,102,.12), 0 2px 6px rgba(0,0,0,.06)",
                border: "1px solid rgba(255,255,255,.8)",
              }}
            >
              <Image
                src="/images/student-using-laptop-with-scholarship-dashboard--m.jpg"
                alt="ScholarPASS Plus Dashboard on student laptop"
                width={1200}
                height={900}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto aspect-[4/3] object-cover"
              />

              {/* Pricing badge */}
              <div className="absolute top-4 left-4">
                <div className="glass rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Rocket className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--sp-blue)" }} aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--sp-navy)" }}>Plus Access</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--sp-ink)" }}>$120</span>
                    <span className="text-[12px] font-medium" style={{ color: "var(--sp-light)" }}>/yr</span>
                  </div>
                </div>
              </div>

              {/* Active badge */}
              <div
                className="absolute bottom-4 right-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl anim-float"
                style={{ background: "var(--sp-navy)" }}
                aria-hidden="true"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--sp-blue)" }}>
                  <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">$120 Credit</div>
                  <div className="text-[9px] font-medium text-white/50 uppercase tracking-wide">Wallet Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Content side ── */}
          <div className="space-y-7 order-1 lg:order-2">
            {/* Label + heading */}
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white mb-3"
                style={{ background: "var(--sp-purple)" }}
              >
                Premium Plan
              </span>
              <h2 className="section-title mt-1">
                Unlock More with{" "}
                <span style={{ color: "var(--sp-blue)" }}>ScholarPASS Plus.</span>
              </h2>
              <p className="section-sub mt-2">
                Advanced AI scholarship matching, auto-apply tools, and dedicated admissions counseling for serious applicants.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white border transition-all duration-200 hover:shadow-sm"
                    style={{ borderColor: "var(--sp-border)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--sp-blue-light)", color: "var(--sp-blue)" }}
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold" style={{ color: "var(--sp-ink)" }}>{item.title}</h4>
                      <p className="text-[12px] font-medium leading-snug mt-0.5" style={{ color: "var(--sp-light)" }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Perks */}
            <ul className="space-y-2" aria-label="Plan benefits">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: "var(--sp-muted)" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--sp-blue)" }} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
              <Link
                href="/scholarpass-plus"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-[14px] font-bold text-white transition-all group"
                style={{ background: "var(--sp-navy)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-blue)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-navy)"; }}
              >
                Upgrade Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "var(--sp-muted)" }}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                Trusted by 1.2M+ students
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
