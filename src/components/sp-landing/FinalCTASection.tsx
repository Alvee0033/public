"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, GraduationCap, Star, Rocket } from "lucide-react";

const BULLETS = [
  "No credit card required to explore",
  "$120 SP Wallet credit on Plus sign-up",
  "10,000+ active scholarships matched by AI",
];

const TRUST_STATS = [
  { icon: GraduationCap, label: "1.2M+ Students" },
  { icon: Star,          label: "4.9 / 5 Rating" },
  { icon: Rocket,        label: "25K+ Placements" },
];

export default function FinalCTASection() {
  return (
    <section
      className="section-py relative overflow-hidden"
      style={{ background: "var(--sp-navy)", contentVisibility: "auto" }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,.8) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center">

          {/* Label */}
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 text-white border border-white/20"
            style={{ background: "rgba(255,255,255,.1)" }}
          >
            Start Free Today
          </span>

          {/* Headline */}
          <h2
            className="font-bold leading-[1.1] tracking-tight mb-4 text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            Ready to Own{" "}
            <span style={{ color: "#FCD34D" }}>Your Future?</span>
          </h2>

          {/* Sub */}
          <p className="text-[15px] leading-relaxed max-w-xl mx-auto mb-8 text-white/75">
            Connect with $1.2B+ in fundings, elite K-12 tutors, and high-impact bootcamps. Your journey starts here — no strings attached.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-lg text-[14px] font-bold text-white transition-all group"
              style={{ background: "var(--sp-orange)", boxShadow: "0 2px 12px rgba(236,94,35,.4)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#d04e18"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-orange)"; }}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/scholarpass-plus"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-lg text-[14px] font-bold text-white border border-white/25 transition-all"
              style={{ background: "rgba(255,255,255,.1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; }}
            >
              Plus Access — $120/yr
            </Link>
          </div>

          {/* Bullet checklist */}
          <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-10" aria-label="Benefits">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-[12.5px] font-medium text-white/65">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-white/15 pt-8" aria-label="Trust indicators">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Trusted by students worldwide</p>
            <div className="flex justify-center gap-6 sm:gap-10">
              {TRUST_STATS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-white/70">
                  <Icon className="w-4 h-4 flex-shrink-0 text-white/50" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
