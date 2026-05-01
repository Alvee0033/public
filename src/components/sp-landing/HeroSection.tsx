"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, GraduationCap, Rocket, Users, Award, BookOpen, Brain, TrendingUp, ShieldCheck } from "lucide-react";

const STATS = [
  { val: "$1.2B+",  label: "In Fundings",    icon: Award },
  { val: "500K+",   label: "Learners",        icon: Users },
  { val: "25K+",    label: "Placements",      icon: Rocket },
  { val: "10,000+", label: "Live Programs",   icon: GraduationCap },
];

const FEATURES = [
  { icon: Brain,       label: "AI Tutor Match" },
  { icon: Award,       label: "Verified Paths" },
  { icon: BookOpen,    label: "Career Bootcamps" },
  { icon: TrendingUp,  label: "Progress Tracking" },
];

const TRUST_LOGOS = ["Harvard Extension", "MIT OpenCourseWare", "Khan Academy", "Coursera", "College Board", "NACAC"];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--sp-off)", minHeight: "calc(100vh - 96px)" }}
    >
      {/* Subtle top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, var(--sp-blue) 0%, var(--sp-purple) 50%, var(--sp-orange) 100%)" }}
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col" style={{ minHeight: "calc(100vh - 96px)" }}>
        
        {/* Main grid */}
        <div className="flex-1 grid lg:grid-cols-2 gap-10 xl:gap-20 items-center py-12 lg:py-0">

          {/* ── Left: Content ── */}
          <div className="flex flex-col justify-center">

            {/* Label */}
            <div className="flex items-center gap-2 mb-5 anim-fade-up anim-d0">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white"
                style={{ background: "var(--sp-navy)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                Platform Now Live
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-bold leading-[1.1] tracking-tight mb-4 anim-fade-up anim-d1"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "var(--sp-ink)" }}
            >
              Unlock Your <br />
              <span style={{ color: "var(--sp-blue)" }}>Academic Future.</span>
            </h1>

            {/* Subtext */}
            <p
              className="leading-relaxed mb-6 anim-fade-up anim-d2"
              style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.0625rem)", color: "var(--sp-muted)", maxWidth: "460px" }}
            >
              ScholarPASS connects K-12 students to AI tutoring, physical learning hubs, and job-ready bootcamps — all in one platform.
            </p>

            {/* Feature chips */}
            <ul className="flex flex-wrap gap-2 mb-7 anim-fade-up anim-d3" aria-label="Platform features">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border text-[12px] font-medium"
                  style={{ borderColor: "var(--sp-border)", color: "var(--sp-muted)" }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--sp-blue)" }} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10 anim-fade-up anim-d4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-lg font-bold text-[14px] text-white transition-all group"
                style={{ background: "var(--sp-orange)", boxShadow: "0 2px 8px rgba(236,94,35,.25)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#d04e18"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-orange)"; }}
              >
                Explore Courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                href="/learninghubs"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-[14px] font-semibold border transition-all"
                style={{ borderColor: "var(--sp-border)", color: "var(--sp-ink)", background: "white" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--sp-blue)"; e.currentTarget.style.color = "var(--sp-blue)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sp-border)"; e.currentTarget.style.color = "var(--sp-ink)"; }}
              >
                Find Learning Hubs
              </Link>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-up anim-d5">
              {STATS.map(({ val, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-start px-4 py-3 rounded-xl bg-white border"
                  style={{ borderColor: "var(--sp-border)" }}
                >
                  <Icon className="w-4 h-4 mb-2 flex-shrink-0" style={{ color: "var(--sp-blue)" }} aria-hidden="true" />
                  <span className="text-[1.25rem] font-extrabold leading-none tracking-tight" style={{ color: "var(--sp-ink)" }}>{val}</span>
                  <span className="text-[10px] font-semibold mt-1 uppercase tracking-widest" style={{ color: "var(--sp-light)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="relative flex items-center justify-center anim-scale-in">
            {/* Image container */}
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 8px 40px rgba(10,67,102,.12), 0 2px 8px rgba(0,0,0,.06)",
                aspectRatio: "4/3",
                border: "1px solid var(--sp-border)",
              }}
            >
              <Image
                src="/images/diverse-students-collaborating-on-digital-devices-.jpg"
                alt="Students collaborating on digital learning"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* AI chip — floating */}
            <div
              className="absolute -top-4 -right-4 hidden md:flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg anim-float"
              style={{ background: "var(--sp-navy)", border: "1px solid rgba(255,255,255,.12)" }}
              aria-hidden="true"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--sp-blue)" }}>
                <Bot className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wide text-white">AI Agent</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-white/60 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Plus chip — floating */}
            <div
              className="absolute -bottom-4 -left-4 hidden md:flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg"
              style={{
                background: "var(--sp-purple)",
                border: "1px solid rgba(255,255,255,.12)",
                animation: "floatY 5s ease-in-out 1s infinite",
              }}
              aria-hidden="true"
            >
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white uppercase tracking-wide">SP Plus Credit</div>
                <div className="text-[13px] font-extrabold text-amber-300">$120 Wallet</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust bar ───────────────────────────────────────────── */}
        <div
          className="border-t py-4 flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar"
          style={{ borderColor: "var(--sp-border)" }}
          aria-label="Trusted by"
        >
          <span className="eyebrow flex-shrink-0">Trusted by</span>
          {TRUST_LOGOS.map((name) => (
            <span
              key={name}
              className="text-[12px] font-semibold flex-shrink-0 transition-opacity opacity-40 hover:opacity-70 cursor-default select-none"
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
