"use client";

import React from "react";
import { CheckCircle2, Shield, Heart, Fingerprint, Lock, Building2, Eye } from "lucide-react";

const MANIFESTO_BADGES = [
  { icon: CheckCircle2, label: "Transparent",  bg: "bg-emerald-50 text-emerald-700" },
  { icon: Shield,       label: "Verified",     bg: "bg-blue-50   text-blue-700" },
  { icon: Heart,        label: "Empathetic",   bg: "bg-rose-50   text-rose-700" },
];

const TRUST_ITEMS = [
  { icon: Fingerprint, title: "Identity Protected",  desc: "Military-grade encryption for all student records." },
  { icon: Lock,        title: "Secure Payouts",       desc: "Audited bridge for SP-Wallet and financial transfers." },
  { icon: Building2,   title: "Verified Hubs",        desc: "Every partner undergoes a 12-point quality audit." },
];

export default function TransparencySection() {
  return (
    <section
      className="section-py bg-white relative overflow-hidden"
      style={{ contentVisibility: "auto" }}
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white mb-4"
              style={{ background: "var(--sp-navy)" }}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              Transparency Report
            </span>
            <h2 className="section-title">
              Built on{" "}
              <span style={{ color: "var(--sp-blue)" }}>Absolute Trust.</span>
            </h2>
            <p className="section-sub mx-auto mt-3">
              We are committed to radical transparency. Real metrics, verified partners, and an unwavering student-first philosophy.
            </p>
          </div>

          {/* Main card */}
          <div
            className="bg-[var(--sp-off)] rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--sp-border)" }}
          >
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "var(--sp-border)" }}>

              {/* Left: Manifesto */}
              <div className="p-8 lg:p-10">
                <h3 className="text-[16px] font-bold mb-3" style={{ color: "var(--sp-ink)" }}>Our Core Manifesto</h3>
                <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: "var(--sp-muted)" }}>
                  ScholarPASS is a growing ecosystem connecting the next generation with validated opportunities. We believe every dollar should be traceable and every tutor should be verified.
                </p>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Core values">
                  {MANIFESTO_BADGES.map(({ icon: Icon, label, bg }) => (
                    <span
                      key={label}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${bg}`}
                      role="listitem"
                    >
                      <Icon className="w-3 h-3" aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Trust items */}
              <div className="p-8 lg:p-10">
                <h3 className="text-[16px] font-bold mb-4" style={{ color: "var(--sp-ink)" }}>Security Standards</h3>
                <div className="space-y-4" role="list" aria-label="Security features">
                  {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white border transition-all hover:shadow-sm"
                      style={{ borderColor: "var(--sp-border)" }}
                      role="listitem"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
                        style={{ background: "var(--sp-off)", borderColor: "var(--sp-border)", color: "var(--sp-blue)" }}
                        aria-hidden="true"
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-[13.5px] font-bold mb-0.5" style={{ color: "var(--sp-ink)" }}>{title}</h4>
                        <p className="text-[12px] font-medium" style={{ color: "var(--sp-muted)" }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
