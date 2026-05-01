"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Rocket, CheckCircle, GraduationCap, Star } from "lucide-react";

const BULLETS = [
  "No credit card required to explore",
  "$120 SP Wallet credit on Plus sign-up",
  "10,000+ active scholarships matched by AI",
];

const TRUST_ICONS = [
  { icon: GraduationCap, label: "1.2M+ Students" },
  { icon: Star,          label: "4.9 / 5 Rating" },
  { icon: Rocket,        label: "25K+ Placements" },
];

export default function FinalCTASection() {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden" style={{ background: "#fff", contentVisibility: 'auto' }}>
      {/* Background gradient wash */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #EBF5FA 0%, #F3EEF8 50%, #FEF0E9 100%)",
            opacity: 0.55,
          }}
        />
        {/* Top border accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-b-full"
          style={{ background: "linear-gradient(90deg, var(--sp-blue) 0%, var(--sp-purple) 50%, var(--sp-orange) 100%)" }}
        />
      </div>

      <div className="container relative z-10">
        <div
          className="max-w-3xl mx-auto text-center"
          style={{ animation: "fadeIn 0.65s ease-out both" }}
        >
          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-white mb-6"
            style={{ background: "var(--sp-purple)" }}
          >
            <Sparkles className="w-3 h-3 fill-white" />
            Start Free Today
          </span>

          {/* Headline */}
          <h2 className="font-display text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.1] mb-4"
            style={{ color: "var(--sp-ink)" }}>
            Ready to{" "}
            <span className="gradient-sp-text">Own Your Future?</span>
          </h2>

          {/* Sub */}
          <p className="text-[15px] leading-relaxed max-w-xl mx-auto mb-8" style={{ color: "var(--sp-muted)" }}>
            Connect with $1.2B+ in fundings, elite K-12 tutors, and high-impact bootcamps. Your journey starts here — no strings attached.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Link
              href="/get-started"
              className="btn-orange h-11 px-8 text-[14px] font-bold flex items-center gap-2 group shadow-[0_4px_20px_rgba(236,94,35,.25)]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/scholarpass-plus"
              className="btn-outline h-11 px-8 text-[14px] font-bold flex items-center gap-2"
              style={{ borderColor: "var(--sp-purple)", color: "var(--sp-purple)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-purple-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Sparkles className="w-4 h-4" />
              Plus Access — $120/yr
            </Link>
          </div>

          {/* Bullet points */}
          <ul className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "var(--sp-muted)" }}>
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--sp-blue)" }} />
                {b}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t pt-8" style={{ borderColor: "var(--sp-border)" }}>
            <p className="eyebrow mb-4">Trusted by students worldwide</p>
            <div className="flex justify-center gap-8">
              {TRUST_ICONS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--sp-blue-deep)" }}>
                  <Icon className="w-4 h-4" style={{ color: "var(--sp-blue)" }} />
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
