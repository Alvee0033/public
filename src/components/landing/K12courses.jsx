import React, { useEffect, useState } from "react";
import { instance } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import CourseBlockSkeleton from "@/components/shared/courseBlockSkeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const K12courses = ({ courses: initialCourses } = {}) => {
  const [courses, setCourses] = useState(initialCourses || []);
  const [loading, setLoading] = useState(!initialCourses);
  const [error, setError] = useState(null);

  useEffect(() => {
    const normalizeCourses = (raw) => {
      if (!raw) return [];
      let arr = raw;
      if (!Array.isArray(arr)) {
        if (Array.isArray(arr.data)) arr = arr.data;
        else arr = [];
      }

      const prepared = arr.map((item, idx) => {
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
          raw: item,
          displayOrder: idx + 1,
        };
      });
    };

    if (initialCourses && initialCourses.length) {
      setCourses(normalizeCourses(initialCourses));
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await instance.get(`/courses`);
        const data = res.data;
        const mapped = normalizeCourses(data);

        if (mounted) setCourses(mapped);
      } catch (err) {
        console.error("Failed to fetch K12 courses", err?.response?.data || err.message || err);
        if (mounted) {
          setError(err?.response?.data?.message || err.message || "Failed to load courses");
          setCourses([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, [initialCourses]);

  const COURSE_LIMIT = 6;

  return (
    <div>
      {/* K12 Courses Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">K12 Courses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive K-12 educational programs for all subjects
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseBlockSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, COURSE_LIMIT).map((c) => (
                <Card className="flex flex-col h-full" key={c.id}>
                  <div className="relative">
                    {c.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt={c.title} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    {c.badges && c.badges.length > 0 && (
                      <>
                        {c.badges.map((b, i) => (
                          <Badge
                            key={i}
                            className={`absolute top-2 ${i === 0 ? "left-2" : "right-2"} ${b.variant === "primary" ? "bg-[#008fb0] text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                            {b.text}
                          </Badge>
                        ))}
                      </>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className={c.id === "bundle" ? "text-xl" : undefined}>
                      {c.displayOrder ? `${c.displayOrder}. ` : ""}{c.title}
                    </CardTitle>
                    {c.subtitle && <CardDescription>{c.subtitle}</CardDescription>}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="flex-grow">
                      {c.features ? (
                        <ul className="space-y-2 mb-4">
                          {c.features.map((f, idx) => (
                            <li className="flex items-center gap-2" key={idx}>
                              <CheckCircle className="h-4 w-4 text-[#008fb0]" />
                              <span className="text-sm">{f}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        c.subtitle && <p className="text-sm text-muted-foreground mb-4">{c.subtitle}</p>
                      )}

                      {c.price && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">REGULAR</span>
                            <span className="text-muted-foreground">SCHOLARSHIP</span>
                            <span className="text-[#008fb0] font-semibold">YOU PAY</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-lg font-bold">{c.price.regular}</span>
                            <span className="text-lg font-bold text-secondary">{c.price.scholarship}</span>
                            <span className="text-lg font-bold text-[#008fb0]">{c.price.youPay}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {c.routeId ? (
                      <Link href={`/learninghub/course-details/${c.routeId}`} className="w-full mt-auto inline-block">
                        <span className="w-full inline-block bg-[#008fb0] hover:bg-[#007a95] text-white text-center px-4 py-2 rounded-sm">Learn More</span>
                      </Link>
                    ) : (
                      <span title="Course id unavailable" className="w-full mt-auto inline-block bg-gray-300 text-gray-700 text-center px-4 py-2">Learn More</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/all-courses">
                View More K12 Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default K12courses;
