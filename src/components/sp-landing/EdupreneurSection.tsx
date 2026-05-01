"use client";

import React from "react";
import { TrendingUp, Globe, Rocket, ArrowRight, Building2, PieChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HIGHLIGHTS = [
  {
    icon: Building2,
    title: "Full Infrastructure",
    desc: "Turnkey CRM, payments, and AI matching tools included.",
  },
  {
    icon: PieChart,
    title: "Revenue Sharing",
    desc: "Highest commission payouts in the global education industry.",
  },
  {
    icon: Globe,
    title: "Global Access",
    desc: "Represent thousands of universities and programs worldwide.",
  },
];

export default function EdupreneurSection() {
  return (
    <section className="section-py bg-white relative overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── Visual side ── */}
          <div className="lg:w-1/2 relative w-full flex-shrink-0">
            <div
              className="relative rounded-xl overflow-hidden border"
              style={{
                borderColor: "var(--sp-border)",
                boxShadow: "0 8px 32px rgba(10,67,102,.10), 0 2px 6px rgba(0,0,0,.05)",
              }}
            >
              <Image
                src="/images/female-tutor-portrait.jpg"
                alt="Edupreneur partner opportunity"
                width={960}
                height={1200}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto aspect-[4/5] object-cover"
              />

              {/* Overlay stats card */}
              <div
                className="absolute bottom-5 left-5 right-5 p-5 rounded-xl border glass"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: "var(--sp-navy)" }}
                    aria-hidden="true"
                  >
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold" style={{ color: "var(--sp-ink)" }}>Agent Network</h4>
                    <p className="text-[11px] font-semibold" style={{ color: "var(--sp-blue)" }}>Global Partner Program</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="stat-num">20%+</div>
                    <div className="stat-label">Monthly Commission</div>
                  </div>
                  <div>
                    <div className="stat-num">1.2M</div>
                    <div className="stat-label">Student Network</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating earn chip */}
            <div
              className="absolute -top-4 -right-4 hidden xl:flex items-center gap-3 p-4 bg-white rounded-xl border shadow-lg"
              style={{ borderColor: "var(--sp-border)" }}
              aria-hidden="true"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--sp-blue-light)", color: "var(--sp-blue)" }}>
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: "var(--sp-ink)" }}>$45K Earned</div>
                <div className="text-[11px] font-medium" style={{ color: "var(--sp-muted)" }}>Top Partner · UK</div>
              </div>
            </div>
          </div>

          {/* ── Content side ── */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white mb-4"
                style={{ background: "linear-gradient(90deg, var(--sp-blue), var(--sp-purple))" }}
              >
                Partner Program
              </span>
              <h2 className="section-title">
                Become an{" "}
                <span className="gradient-sp-text">Edupreneur.</span>
              </h2>
              <p className="section-sub mt-3">
                Join our elite network of agents and institutes. Scale your education business with ScholarPASS AI infrastructure and global reach.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 p-4 rounded-xl bg-[var(--sp-off)] border transition-all duration-200 hover:bg-white hover:shadow-sm"
                  style={{ borderColor: "var(--sp-border)" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{ background: "var(--sp-blue-light)", borderColor: "rgba(40,132,171,.15)", color: "var(--sp-blue)" }}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold mb-0.5" style={{ color: "var(--sp-ink)" }}>{title}</h5>
                    <p className="text-[13px] font-medium" style={{ color: "var(--sp-muted)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/partnership-program"
              className="inline-flex items-center gap-2 px-7 h-12 rounded-lg text-[14px] font-bold text-white transition-all group"
              style={{ background: "var(--sp-orange)", boxShadow: "0 2px 8px rgba(236,94,35,.2)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#d04e18"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-orange)"; }}
            >
              Apply as Partner
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
