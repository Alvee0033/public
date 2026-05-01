"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Users,
} from "lucide-react";
import { instance } from "@/lib/axios";
import useSWR from "swr";

export default function K12LearningBundlesSection() {
  const getBundleCourses = async () => {
    try {
      const res = await instance.get("/courses", {
        params: {
          limit: 100,
          filter: JSON.stringify({
            single_or_bundle_course: false,
            published_on_public_site: true,
          }),
        },
        skipErrorLog: true,
      });
      return res?.data?.data || [];
    } catch {
      return [];
    }
  };

  const { data: courses = [], isLoading } = useSWR("k12-bundle-courses", getBundleCourses, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const stripHtml = (html: string) => (html || "").replace(/<[^>]*>/g, "");
  const displayedCourses = courses.slice(0, 3);

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="container relative z-10 px-4 mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <Badge className="bg-blue-100 text-blue-700 border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] w-fit mx-auto flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            Learning Bundles
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight">
            Complete Mastery <br />
            <span className="text-blue-600">Bundled for Growth.</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
             Full subject coverage with certified tutors, AI support, and 75% ScholarPASS+ scholarship.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl animate-pulse bg-white border border-slate-100" />
            ))
          ) : (
            displayedCourses.map((course: any, i: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                 <div className="p-8 pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex gap-2">
                          <Badge className="bg-green-50 text-green-700 border-0 text-[8px] font-black px-2 py-1 uppercase tracking-tighter">Scholars✓</Badge>
                          {course.is_trending_course && <Badge className="bg-orange-50 text-orange-700 border-0 text-[8px] font-black px-2 py-1 uppercase tracking-tighter">Hot🔥</Badge>}
                       </div>
                       <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">{course.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 line-clamp-2 uppercase tracking-widest">{stripHtml(course.short_description || course.description)}</p>
                 </div>

                 <div className="px-8 py-6 flex-grow flex flex-col space-y-6">
                    <div className="flex items-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.course_duration || "Self-Paced"}</div>
                       <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.enrolled_students || 0} Learners</div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-3">
                       <div className="flex justify-between items-center opacity-40">
                          <span className="text-[10px] font-black uppercase tracking-widest">Standard</span>
                          <span className="text-sm font-black line-through">${course.regular_price || 0}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">ScholarPASS+</span>
                          <span className="text-3xl font-black text-blue-600 tracking-tighter">${course.discounted_price || course.regular_price || 0}</span>
                       </div>
                    </div>

                    <div className="pt-4">
                        <Button className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg group/btn" asChild>
                          <Link href="/k12-tutoring">
                            Enroll in Bundle
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                    </div>
                 </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="text-center">
           <p className="text-slate-400 font-bold text-sm">Want a custom bundle? <Link href="/contact" className="text-blue-600 hover:underline">Contact Advisory</Link></p>
        </div>

      </div>
    </section>
  );
}
