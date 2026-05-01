"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { instance } from "@/lib/axios";
import { CheckCircle, ArrowRight, BookOpen, GraduationCap, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface Course {
  id: string;
  routeId: string | null;
  title: string;
  subtitle: string;
  image: string | null;
  price?: {
    regular: string;
    scholarship: string;
    youPay: string;
  };
  displayOrder: number;
}

export default function K12courses({ courses: initialCourses }: { courses?: any[] } = {}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(!initialCourses);

  useEffect(() => {
    const normalizeCourses = (raw: any) => {
      if (!raw) return [];
      let arr = raw;
      if (!Array.isArray(arr)) {
        if (Array.isArray(arr.data)) arr = arr.data;
        else arr = [];
      }

      const prepared = arr.map((item: any, idx: number) => {
        const numeric = item.id != null && !Number.isNaN(Number(item.id)) ? Number(item.id) : item.course_id != null && !Number.isNaN(Number(item.course_id)) ? Number(item.course_id) : null;
        return { item, numeric, originalIndex: idx };
      });

      const hasNumeric = prepared.some((p) => p.numeric != null);
      if (hasNumeric) prepared.sort((a, b) => (a.numeric ?? Infinity) - (b.numeric ?? Infinity));

      return prepared.map((p, idx) => {
        const item = p.item;
        const numericId = p.numeric != null ? String(p.numeric) : item.course_id != null ? String(item.course_id) : item.id != null ? String(item.id) : null;
        return {
          id: item.id ?? item.course_id ?? item.slug ?? null,
          routeId: numericId,
          title: item.name || item.title || item.slug || "Untitled Course",
          subtitle: item.short_description ? item.short_description.replace(/<[^>]+>/g, "") : item.description && item.description.replace(/<[^>]+>/g, ""),
          image: item.image || item.course_medias?.[0]?.url || null,
          price: item.regular_price != null ? { regular: `$${item.regular_price}`, scholarship: item.discounted_price ? `$${item.discounted_price}` : item.discounted_amount ? `$${item.discounted_amount}` : "-", youPay: item.discounted_amount ? `$${item.discounted_amount}` : item.discounted_price ? `$${item.discounted_price}` : `$${item.regular_price}` } : undefined,
          displayOrder: idx + 1,
        };
      });
    };

    if (initialCourses && initialCourses.length) {
      setCourses(normalizeCourses(initialCourses));
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await instance.get(`/courses`);
        setCourses(normalizeCourses(res.data));
      } catch (err) {
        console.error("Failed to fetch K12 courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [initialCourses]);

  const COURSE_LIMIT = 3;

  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-purple-50 text-purple-600 hover:bg-purple-50 border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
              <BookOpen className="w-3.5 h-3.5" />
              Curriculum Core
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight">
              K-12 Courses <br />
              <span className="text-purple-600">Built for Success.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Master core subjects with structured learning paths, interactive assignments, and certified teacher guidance.
            </p>
          </div>
          
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm group" asChild>
            <Link href="/all-courses">
              View All Courses
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[450px] bg-slate-50 rounded-3xl animate-pulse border border-slate-100" />
             ))
          ) : (
            courses.slice(0, COURSE_LIMIT).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <GraduationCap className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-0 font-black text-[10px] px-3 py-1 uppercase">{c.displayOrder}. Chapter Ready</Badge>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-950 line-clamp-2 uppercase tracking-tight">{c.title}</h3>
                    <p className="text-xs font-bold text-slate-400 line-clamp-2 leading-relaxed">{c.subtitle}</p>
                  </div>

                  {c.price && (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 -mx-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Regular</div>
                          <div className="text-sm font-black text-slate-400 line-through">{c.price.regular}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Scholarship</div>
                          <div className="text-sm font-black text-orange-600">{c.price.scholarship}</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[8px] font-black text-blue-600 uppercase tracking-widest">You Pay</div>
                          <div className="text-lg font-black text-blue-600 leading-none">{c.price.youPay}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 mt-auto">
                    {c.routeId ? (
                      <Button className="w-full h-12 rounded-xl bg-slate-950 hover:bg-purple-600 text-white font-black text-xs uppercase tracking-[0.2em] transition-all group/btn" asChild>
                        <Link href={`/learninghub/course-details/${c.routeId}`}>
                          Course Details
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full h-12 rounded-xl bg-slate-200 text-slate-400 cursor-not-allowed font-black text-xs uppercase tracking-widest">
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
