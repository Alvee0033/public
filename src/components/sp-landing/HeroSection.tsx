"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Bot, GraduationCap, Rocket, Users,
  Star, Award, TrendingUp,
  BookOpen, Brain
} from "lucide-react";

const STATS = [
  { val: "$1.2B+",  label: "In Fundings",   icon: Award,      color: "var(--sp-orange)" },
  { val: "500K+",   label: "Learners",       icon: Users,      color: "var(--sp-blue)" },
  { val: "25K+",    label: "Placements",     icon: Rocket,     color: "var(--sp-purple)" },
  { val: "10,000+", label: "Live Programs",  icon: GraduationCap, color: "var(--sp-orange)" },
];

const FEATURES = [
  { icon: Brain,       label: "AI Tutor Match" },
  { icon: Award,       label: "Verified Learning Paths" },
  { icon: BookOpen,    label: "Career Bootcamps" },
  { icon: TrendingUp,  label: "Progress Tracking" },
];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden hero-fade-in"
      style={{
        background: "linear-gradient(150deg, #e8f4fb 0%, #ede8f7 45%, #fdf0e8 100%)",
        minHeight: "calc(100vh - 92px)",
      }}
    >
      <style>{`
        @keyframes fadeUpAnim {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scaleUpAnim {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .hero-fade-up-0 { animation: fadeUpAnim 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0s forwards; opacity: 0; }
        .hero-fade-up-1 { animation: fadeUpAnim 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards; opacity: 0; }
        .hero-fade-up-2 { animation: fadeUpAnim 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.14s forwards; opacity: 0; }
        .hero-fade-up-3 { animation: fadeUpAnim 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.20s forwards; opacity: 0; }
        .hero-fade-up-4 { animation: fadeUpAnim 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.26s forwards; opacity: 0; }
        .hero-fade-up-5 { animation: fadeUpAnim 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.32s forwards; opacity: 0; }
        .hero-scale-img { animation: scaleUpAnim 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0s forwards; opacity: 0; }
        .hero-float-1 { animation: floatAnim 4s ease-in-out infinite; }
        .hero-float-2 { animation: floatAnim 5s ease-in-out infinite 1s; }
      `}</style>
      
      {/* ── Decorative orbs ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-25 blur-[110px]"
          style={{ background: "var(--sp-blue)" }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[90px]"
          style={{ background: "var(--sp-purple)" }}
        />
        <div
          className="absolute -bottom-20 right-1/3 w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
          style={{ background: "var(--sp-orange)" }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8 flex flex-col"
        style={{ minHeight: "calc(100vh - 92px)" }}
      >
        <div className="flex-1 grid lg:grid-cols-[1fr_1fr] gap-8 xl:gap-16 items-center py-10 lg:py-0 max-w-[1400px] mx-auto w-full">

          {/* ═══════════════════════════════ LEFT COLUMN ═══════════════════════════════ */}
          <div className="flex flex-col justify-center">

            <div className="flex items-center gap-1 mb-5 hero-fade-up-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[11px] font-semibold ml-1" style={{ color: "var(--sp-muted)" }}>4.9</span>
            </div>

            {/* Headline */}
            <h1
              className="font-display leading-[1.06] mb-4 hero-fade-up-1"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                color: "var(--sp-ink)",
              }}
            >
              Unlock Your <br />
              <span
                className="inline-block mt-1"
                style={{
                  color: "var(--sp-blue-deep)",
                  letterSpacing: "-0.01em",
                  textShadow: "0 1px 0 rgba(255,255,255,.45)",
                }}
              >
                Academic Future.
              </span>
            </h1>

            {/* Sub */}
            <p
              className="leading-relaxed mb-6 hero-fade-up-2"
              style={{
                fontSize: "clamp(14px, 1.8vw, 16px)",
                color: "var(--sp-muted)",
                maxWidth: "480px",
              }}
            >
              ScholarPASS connects K-12 students to AI tutoring, learning hubs, and job-ready bootcamps in one platform built for unstoppable growth.
            </p>

            {/* Feature chips */}
            <ul className="flex flex-wrap gap-2 mb-7 hero-fade-up-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border text-[12px] font-medium shadow-sm backdrop-blur-sm"
                  style={{ borderColor: "rgba(40,132,171,.2)", color: "var(--sp-muted)" }}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" style={{ color: "var(--sp-blue)" }} />
                  {label}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10 hero-fade-up-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-full font-bold text-[14px] text-white shadow-lg transition-all group"
                style={{
                  background: "var(--sp-orange)",
                  boxShadow: "0 4px 20px rgba(236,94,35,.35)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(236,94,35,.45)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(236,94,35,.35)"; }}
              >
                Explore Courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/learning-hub"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-full text-[14px] font-semibold border-2 transition-all"
                style={{ borderColor: "var(--sp-blue)", color: "var(--sp-blue)", background: "rgba(255,255,255,.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-blue-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.6)"; }}
              >
                Explore Hub
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-fade-up-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STATS.map(({ val, label, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-start px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border shadow-sm"
                    style={{ borderColor: "rgba(255,255,255,.9)" }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}18` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div className="text-[1.2rem] font-black leading-none tracking-tight" style={{ color: "var(--sp-ink)" }}>{val}</div>
                    <div className="text-[10px] font-semibold mt-1 uppercase tracking-widest" style={{ color: "var(--sp-light)" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════ RIGHT COLUMN ═══════════════════════════════ */}
          <div className="relative flex items-center justify-center hero-scale-img">
            {/* Decorative ring behind image */}
            <div
              className="absolute inset-[-20px] rounded-3xl opacity-20"
              style={{
                background: "linear-gradient(135deg, var(--sp-blue) 0%, var(--sp-purple) 100%)",
                filter: "blur(30px)",
              }}
            />

            {/* Main image */}
            <div
              className="relative w-full rounded-3xl overflow-hidden ring-1 ring-white"
              style={{
                boxShadow: "0 24px 64px rgba(40,132,171,.2), 0 8px 24px rgba(0,0,0,.08)",
                aspectRatio: "4/3",
              }}
            >
              <Image
                src="/images/diverse-students-collaborating-on-digital-devices-.jpg"
                alt="Students collaborating"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-[1.04] transition-transform duration-700"
              />
            </div>

            {/* Floating AI chip */}
            <div
              className="absolute -top-5 -right-5 hidden md:flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl hero-float-1"
              style={{
                background: "linear-gradient(135deg, var(--sp-blue-deep) 0%, #0d3a58 100%)",
                border: "1px solid rgba(255,255,255,.12)",
              }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--sp-blue)" }}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-widest uppercase text-white">AI Agent</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/50 font-medium">Ready</span>
                </div>
              </div>
            </div>

            {/* Floating wallet chip */}
            <div
              className="absolute -bottom-4 -left-5 hidden md:flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl hero-float-2"
              style={{
                background: "linear-gradient(135deg, var(--sp-purple) 0%, #6b4d90 100%)",
                border: "1px solid rgba(255,255,255,.12)",
              }}
            >
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white uppercase tracking-wide">SP Plus Credit</div>
                <div className="text-[13px] font-black text-amber-300">$120 Wallet</div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Marquee trust strip ─────────────────────────────────── */}
        <div
          className="border-t py-4 flex items-center gap-8 overflow-hidden"
          style={{ borderColor: "rgba(40,132,171,.15)" }}
        >
          <span className="eyebrow flex-shrink-0">Trusted by</span>
          {["Harvard Extension", "MIT OpenCourseWare", "Khan Academy", "Coursera", "College Board", "NACAC"].map((name) => (
            <span
              key={name}
              className="text-[12px] font-semibold flex-shrink-0 opacity-50 hover:opacity-80 transition-opacity cursor-default"
              style={{ color: "var(--sp-ink)" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
