"use client";

import React from "react";
import { 
  BookOpen, 
  Video, 
  MessageSquare, 
  Star, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SUBJECTS = [
  { name: "Mathematics", icon: "∑", color: "bg-blue-100 text-blue-600", image: "/images/advanced-mathematics.png" },
  { name: "Science", icon: "⚛", color: "bg-green-100 text-green-600", image: "/images/physics-lab-experiments.png" },
  { name: "Languages", icon: "Aa", color: "bg-purple-100 text-purple-600", image: "/images/spanish-teacher-portrait.jpg" },
  { name: "Coding", icon: "</>", color: "bg-orange-100 text-orange-600", image: "/images/python-programming-for-kids.png" }
];

export default function K12TutoringSection() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] pointer-events-none" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <Badge className="bg-slate-900 text-white border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
            Live Tutoring
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight">
            Certified Experts for <br />
            <span className="text-blue-600">Every Student.</span>
          </h2>
          <p className="text-lg text-slate-600 font-semibold">
            One-on-one sessions, small group workshops, and 24/7 AI homework assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {SUBJECTS.map((subject, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ animation: `fadeIn 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={subject.image} 
                  alt={subject.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />
                <div className={`absolute top-4 left-4 ${subject.color} w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg`}>
                  {subject.icon}
                </div>
              </div>
              
              <div className="p-6 space-y-4 text-center">
                <h3 className="text-xl font-black text-slate-950">{subject.name}</h3>
                <div className="flex items-center justify-center gap-1.5 text-slate-400">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-slate-500">4.9/5 (2k+ sessions)</span>
                </div>
                <Button variant="ghost" className="w-full rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-50">
                  View Tutors
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Bar — light theme */}
        <div
          className="mt-16 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden border shadow-xl"
          style={{
            background: "linear-gradient(135deg, #EBF5FA 0%, #F8FAFC 45%, #F3EEF8 100%)",
            borderColor: "#E8EDF2",
            boxShadow: "0 20px 50px rgba(40,132,171,.1), 0 4px 16px rgba(0,0,0,.04)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[90px] pointer-events-none opacity-60 -translate-y-1/3 translate-x-1/4"
            style={{ background: "rgba(40,132,171,.18)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-[70px] pointer-events-none opacity-40 translate-y-1/3 -translate-x-1/4"
            style={{ background: "rgba(134,101,170,.15)" }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--sp-blue) 0%, var(--sp-blue-deep) 100%)" }}
              >
                <Video className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-black leading-tight" style={{ color: "var(--sp-ink)" }}>
                  Interactive Virtual Classroom
                </h4>
                <p className="font-semibold text-sm mt-1" style={{ color: "var(--sp-muted)" }}>
                  HD video, digital whiteboard & recording — all in one place.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: <CheckCircle className="w-4 h-4" style={{ color: "var(--sp-blue)" }} />, text: "Screen Sharing" },
                { icon: <MessageSquare className="w-4 h-4" style={{ color: "var(--sp-purple)" }} />, text: "24/7 Chat" },
                { icon: <Users className="w-4 h-4" style={{ color: "var(--sp-orange)" }} />, text: "Group Study" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white/90 backdrop-blur-sm shadow-sm"
                  style={{ borderColor: "rgba(232,237,242,.95)" }}
                >
                  {f.icon}
                  <span
                    className="font-bold text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--sp-ink)" }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
