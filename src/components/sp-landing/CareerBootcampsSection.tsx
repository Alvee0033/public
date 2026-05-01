"use client";

import React from "react";
import {
  Code,
  Shield,
  ArrowRight,
  BrainCircuit,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BOOTCAMPS = [
  {
    title: "Full Stack Web Dev",
    tag: "Software Engineering",
    icon: Code,
    accent: "var(--sp-blue)",
    image: "/images/web-development-coding.png",
  },
  {
    title: "AI & Data Science",
    tag: "Advanced Analytics",
    icon: BrainCircuit,
    accent: "var(--sp-purple)",
    image: "/images/data-science-analytics.jpg",
  },
  {
    title: "Cybersecurity Pro",
    tag: "Network Security",
    icon: Shield,
    accent: "var(--sp-orange)",
    image: "/images/cybersecurity-network-security.jpg",
  },
  {
    title: "AWS Cloud Arch",
    tag: "Infrastructure",
    icon: Layers,
    accent: "var(--sp-blue)",
    image: "/images/aws-cloud-computing.jpg",
  },
];

export default function CareerBootcampsSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-50">
      {/* Light ambient wash — no dark texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 90% 0%, rgba(40,132,171,.08) 0%, transparent 55%)," +
              "radial-gradient(ellipse 60% 45% at 0% 100%, rgba(134,101,170,.08) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(40,132,171,.12) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-10">
          <div className="text-left space-y-4 max-w-2xl">
            <Badge
              variant="default"
              className="border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, var(--sp-blue), var(--sp-purple))" }}
            >
              Career Accelerators
            </Badge>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight"
              style={{ color: "var(--sp-ink)" }}
            >
              Future-Proof <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r"
                style={{
                  backgroundImage: "linear-gradient(90deg, var(--sp-blue), var(--sp-purple))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                Your Career path.
              </span>
            </h2>
            <p className="text-lg font-medium leading-relaxed" style={{ color: "var(--sp-muted)" }}>
              Job-guaranteed training programs designed by industry leads at Google, Meta, and AWS. Get hired in 6 months.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right">
              <div className="text-4xl font-black tracking-tighter" style={{ color: "var(--sp-ink)" }}>
                98%
              </div>
              <div
                className="text-[10px] font-bold uppercase tracking-widest mt-1"
                style={{ color: "var(--sp-light)" }}
              >
                Placement Rate
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200 hidden sm:block" />
            <div className="text-center sm:text-right">
              <div className="text-4xl font-black tracking-tighter" style={{ color: "var(--sp-ink)" }}>
                $85K
              </div>
              <div
                className="text-[10px] font-bold uppercase tracking-widest mt-1"
                style={{ color: "var(--sp-light)" }}
              >
                Avg Starting Salary
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BOOTCAMPS.map((camp, i) => (
            <div
              key={i}
              className="group relative flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ animation: `fadeIn 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={camp.image}
                  alt={camp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(248,250,252,.95) 0%, transparent 45%)",
                  }}
                />
                <div className="absolute bottom-4 left-6">
                  <div
                    className="p-3 rounded-xl border backdrop-blur-sm"
                    style={{
                      background: "rgba(255,255,255,.92)",
                      borderColor: "#E8EDF2",
                      color: camp.accent,
                    }}
                  >
                    <camp.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <Badge
                  variant="outline"
                  className="text-[9px] font-black uppercase tracking-widest border-slate-200"
                  style={{ color: "var(--sp-muted)" }}
                >
                  {camp.tag}
                </Badge>
                <h3
                  className="text-xl font-black uppercase tracking-tight transition-colors group-hover:opacity-90"
                  style={{ color: "var(--sp-ink)" }}
                >
                  {camp.title}
                </h3>

                <ul className="space-y-3 pt-2">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs font-bold" style={{ color: "var(--sp-muted)" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: camp.accent }} />
                      Certifications Included
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="pt-4 flex items-center gap-2 font-extrabold text-[10px] uppercase tracking-widest transition-colors group/btn"
                  style={{ color: "var(--sp-blue)" }}
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — light card */}
        <div
          className="mt-20 p-8 lg:p-12 rounded-[2.5rem] border flex flex-col items-center text-center space-y-8"
          style={{
            background: "linear-gradient(135deg, #EBF5FA 0%, #F3EEF8 50%, #FEF0E9 100%)",
            borderColor: "#E8EDF2",
            boxShadow: "0 20px 50px rgba(40,132,171,.12)",
          }}
        >
          <div className="space-y-3">
            <h4 className="text-3xl font-black tracking-tight" style={{ color: "var(--sp-ink)" }}>
              Not sure which path to take?
            </h4>
            <p className="font-bold max-w-xl" style={{ color: "var(--sp-muted)" }}>
              Take our AI Career Quiz and find your perfect future in under 2 minutes.
            </p>
          </div>
          <button
            type="button"
            className="h-14 px-12 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-lg border-0 text-white"
            style={{
              background: "linear-gradient(135deg, var(--sp-blue) 0%, var(--sp-purple) 100%)",
              boxShadow: "0 8px 28px rgba(40,132,171,.35)",
            }}
          >
            Start AI Match
          </button>
        </div>
      </div>
    </section>
  );
}
