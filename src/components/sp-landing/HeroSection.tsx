"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Building2,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

const TRUST_POINTS = [
  "Backed by 1,200+ institute partners",
  "Verified scholarship matches",
  "Live human tutors in 40+ subjects",
];

const STATS = [
  { value: "120K+", label: "Active Learners" },
  { value: "$48M",  label: "Scholarships Awarded" },
  { value: "1.2K",  label: "Partner Institutes" },
  { value: "98%",   label: "Tutor Satisfaction" },
];

const PATHS = [
  {
    icon: GraduationCap,
    label: "I'm a Learner",
    desc: "Find scholarships, tutoring, and bootcamps tailored to you.",
    href: "/get-started",
    accent: "blue",
  },
  {
    icon: Building2,
    label: "I'm an Institute",
    desc: "List programs and reach motivated students worldwide.",
    href: "/partnership-program",
    accent: "purple",
  },
  {
    icon: HeartHandshake,
    label: "I'm a Sponsor",
    desc: "Fund education and track measurable real-world impact.",
    href: "/scholarpass-sponsors",
    accent: "orange",
  },
];

const accentMap: Record<string, string> = {
  blue: "bg-[var(--sp-blue-light)] text-[var(--sp-navy)]",
  purple: "bg-[var(--sp-purple-light)] text-[var(--sp-purple)]",
  orange: "bg-[var(--sp-orange-light)] text-[var(--sp-orange)]",
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="absolute inset-0 bg-dotgrid opacity-50" />

      <div
        aria-hidden="true"
        className="absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(40,132,171,.18), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(134,101,170,.14), transparent 70%)",
        }}
      />

      <div className="container relative pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
        <div className="anim-fade-up anim-d0">
          <span className="sp-label sp-label-blue">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            One platform. Every path forward.
          </span>
        </div>

        <h1 className="h-display mt-5 max-w-4xl text-balance anim-fade-up anim-d1">
          Education built around{" "}
          <span className="font-display italic font-normal text-[var(--sp-orange)]">
            your future
          </span>
          ,
          <br className="hidden md:block" />
          not the other way around.
        </h1>

        <p className="lede mt-6 max-w-2xl text-pretty anim-fade-up anim-d2">
          ScholarPASS unites scholarships, expert tutoring, accredited bootcamps,
          and a global learning hub network — so every learner gets matched,
          mentored, and funded on a single coherent path.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3 anim-fade-up anim-d3">
          <Link href="/get-started" className="btn-primary btn-lg">
            Start free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/scholarpass-plus" className="btn-outline btn-lg">
            Explore Plus
          </Link>
        </div>

        <ul
          className="mt-7 flex flex-wrap gap-x-6 gap-y-2 anim-fade-up anim-d4"
          aria-label="Trust signals"
        >
          {TRUST_POINTS.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-[13.5px] text-[var(--sp-muted)]"
            >
              <CheckCircle2
                className="w-4 h-4 text-[var(--sp-blue)] flex-shrink-0"
                aria-hidden="true"
                strokeWidth={2.25}
              />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-14 lg:mt-16 grid gap-4 sm:grid-cols-3 anim-fade-up anim-d5">
          {PATHS.map(({ icon: Icon, label, desc, href, accent }) => (
            <Link
              key={label}
              href={href}
              className="sp-card group p-6 sm:p-7 flex flex-col"
            >
              <span
                className={`inline-flex items-center justify-center h-11 w-11 rounded-[10px] ${accentMap[accent]}`}
                aria-hidden="true"
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-tight text-[var(--sp-ink)]">
                {label}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--sp-muted)]">
                {desc}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sp-navy)] group-hover:text-[var(--sp-blue)] transition-colors">
                Continue
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 pt-10 border-t border-[var(--sp-border)] anim-fade-up anim-d6">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="stat-num">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
