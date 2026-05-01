"use client";

import React from "react";
import { Video, MessageSquare, CheckCircle, Users, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SUBJECTS = [
  { name: "Mathematics",  image: "/images/advanced-mathematics.png",    label: "∑" },
  { name: "Sciences",     image: "/images/physics-lab-experiments.png", label: "⚗" },
  { name: "Languages",    image: "/images/spanish-teacher-portrait.jpg",label: "Aa" },
  { name: "Coding",       image: "/images/python-programming-for-kids.png", label: "</>" },
];

const TOOLS = [
  { icon: CheckCircle,   label: "Screen Sharing" },
  { icon: MessageSquare, label: "24/7 Chat Support" },
  { icon: Users,         label: "Group Study Rooms" },
];

export default function K12TutoringSection() {
  return (
    <section className="section-py bg-white relative overflow-hidden">
      <div className="container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white mb-4"
            style={{ background: "var(--sp-navy)" }}
          >
            Live Tutoring
          </span>
          <h2 className="section-title">
            Certified Experts for{" "}
            <span style={{ color: "var(--sp-blue)" }}>Every Student.</span>
          </h2>
          <p className="section-sub mx-auto mt-3">
            One-on-one sessions, small group workshops, and AI-powered homework assistance available around the clock.
          </p>
        </div>

        {/* Subject cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {SUBJECTS.map((subject) => (
            <article
              key={subject.name}
              className="group rounded-xl border overflow-hidden bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ borderColor: "var(--sp-border)" }}
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <Image
                  src={subject.image}
                  alt={`${subject.name} tutoring`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[var(--sp-ink)]/20 group-hover:bg-[var(--sp-ink)]/30 transition-colors" aria-hidden="true" />
                <div
                  className="absolute top-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-black bg-white shadow-md"
                  style={{ color: "var(--sp-blue)" }}
                  aria-hidden="true"
                >
                  {subject.label}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--sp-ink)" }}>{subject.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span className="text-[12px] font-semibold" style={{ color: "var(--sp-muted)" }}>4.9 · 2,000+ sessions</span>
                </div>
                <Link
                  href="/courses"
                  className="inline-flex items-center text-[12px] font-bold transition-colors"
                  style={{ color: "var(--sp-blue)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sp-navy)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sp-blue)"; }}
                >
                  View Tutors
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Feature banner */}
        <div
          className="rounded-2xl p-8 lg:p-10 border"
          style={{
            background: "var(--sp-blue-light)",
            borderColor: "rgba(40,132,171,.15)",
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: "var(--sp-navy)" }}
                aria-hidden="true"
              >
                <Video className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-[1.125rem] font-bold" style={{ color: "var(--sp-ink)" }}>
                  Interactive Virtual Classroom
                </h4>
                <p className="text-[13px] font-medium mt-0.5" style={{ color: "var(--sp-muted)" }}>
                  HD video, digital whiteboard, and session recordings — all in one place.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5" role="list" aria-label="Classroom features">
              {TOOLS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white"
                  style={{ borderColor: "var(--sp-border)" }}
                  role="listitem"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "var(--sp-blue)" }} aria-hidden="true" />
                  <span className="text-[12px] font-semibold" style={{ color: "var(--sp-ink)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
