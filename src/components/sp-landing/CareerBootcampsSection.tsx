"use client";

import React from "react";
import { Code, Shield, ArrowRight, BrainCircuit, Layers, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BOOTCAMPS = [
  {
    title: "Full Stack Web Dev",
    tag: "Software Engineering",
    icon: Code,
    image: "/images/web-development-coding.png",
  },
  {
    title: "AI & Data Science",
    tag: "Advanced Analytics",
    icon: BrainCircuit,
    image: "/images/data-science-analytics.jpg",
  },
  {
    title: "Cybersecurity Pro",
    tag: "Network Security",
    icon: Shield,
    image: "/images/cybersecurity-network-security.jpg",
  },
  {
    title: "AWS Cloud Architecture",
    tag: "Infrastructure",
    icon: Layers,
    image: "/images/aws-cloud-computing.jpg",
  },
];

const CARD_PERKS = [
  "Industry Certifications",
  "Mentored Projects",
  "Career Placement Support",
];

export default function CareerBootcampsSection() {
  return (
    <section
      className="section-py relative overflow-hidden"
      style={{ background: "var(--sp-off)" }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--sp-gray200) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="container relative">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-8">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white mb-4"
              style={{ background: "linear-gradient(90deg, var(--sp-blue), var(--sp-purple))" }}
            >
              Career Accelerators
            </span>
            <h2 className="section-title">
              Future-Proof{" "}
              <span className="gradient-sp-text">Your Career.</span>
            </h2>
            <p className="section-sub mt-3">
              Job-guaranteed training programs designed by industry leads at Google, Meta, and AWS. Get hired in 6 months or your money back.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--sp-ink)" }}>98%</div>
              <div className="stat-label">Placement Rate</div>
            </div>
            <div className="w-px h-10 bg-[var(--sp-border)]" aria-hidden="true" />
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--sp-ink)" }}>$85K</div>
              <div className="stat-label">Avg Starting Salary</div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BOOTCAMPS.map((camp, i) => (
            <article
              key={camp.title}
              className="group flex flex-col bg-white rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ borderColor: "var(--sp-border)", animationDelay: `${i * 60}ms` }}
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <Image
                  src={camp.image}
                  alt={camp.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(248,250,252,.9) 0%, transparent 50%)" }}
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border"
                    style={{ borderColor: "var(--sp-border)", color: "var(--sp-blue)" }}
                    aria-hidden="true"
                  >
                    <camp.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--sp-light)" }}
                >
                  {camp.tag}
                </span>
                <h3 className="text-[15px] font-bold mb-3" style={{ color: "var(--sp-ink)" }}>
                  {camp.title}
                </h3>

                <ul className="space-y-1.5 mb-4" aria-label="Program benefits">
                  {CARD_PERKS.map((perk) => (
                    <li key={perk} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--sp-blue)" }} aria-hidden="true" />
                      <span className="text-[12px] font-medium" style={{ color: "var(--sp-muted)" }}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/career-bootcamps"
                  className="mt-auto inline-flex items-center gap-1.5 text-[12.5px] font-bold transition-colors group/link"
                  style={{ color: "var(--sp-blue)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sp-navy)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sp-blue)"; }}
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA banner */}
        <div
          className="mt-14 p-8 lg:p-12 rounded-2xl border flex flex-col items-center text-center gap-6"
          style={{
            background: "linear-gradient(135deg, var(--sp-blue-light) 0%, var(--sp-purple-light) 100%)",
            borderColor: "rgba(40,132,171,.15)",
          }}
        >
          <div>
            <h4 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--sp-ink)" }}>
              Not sure which path to take?
            </h4>
            <p className="text-[14px] font-medium max-w-md mx-auto" style={{ color: "var(--sp-muted)" }}>
              Take our AI Career Quiz and find your perfect future in under 2 minutes.
            </p>
          </div>
          <Link
            href="/career-bootcamps"
            className="inline-flex items-center gap-2 px-8 h-12 rounded-lg text-[14px] font-bold text-white transition-all"
            style={{ background: "var(--sp-navy)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-blue)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-navy)"; }}
          >
            Start AI Match
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
