"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Filter,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PublicMarketplaceCard,
  PublicMarketplaceHero,
  PublicMarketplaceSection,
} from "@/components/public-marketplace/PublicMarketplaceShell";

const emptyStateCover =
  "bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.24),_transparent_35%),linear-gradient(135deg,_#0f172a_0%,_#1e293b_45%,_#334155_100%)]";

export default function CourseListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = 9;

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        const res = await axios.get("/course-categories", {
          params: { limit: 100 },
        });
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);

        const filterObj = {};
        if (categoryId) filterObj.course_category = categoryId;
        if (searchQuery) filterObj.name = { $regex: searchQuery, $options: "i" };

        const skip = (currentPage - 1) * pageSize;
        const response = await axios.get("/courses", {
          params: {
            filter: Object.keys(filterObj).length ? JSON.stringify(filterObj) : undefined,
            skip,
            limit: pageSize,
          },
        });

        const items = response.data.data || [];
        setCourses(items);
        if (response.data.meta?.total != null) {
          setTotalCourses(response.data.meta.total);
          setTotalPages(Math.max(1, Math.ceil(response.data.meta.total / pageSize)));
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [categoryId, searchQuery, currentPage]);

  const selectedCategory = categories.find(
    (cat) => String(cat.id) === String(categoryId),
  );

  const visibleCourses = [...courses].sort((a, b) => {
    if (sortBy === "rating") {
      return (Number(b.rating_score) || 0) - (Number(a.rating_score) || 0);
    }
    if (sortBy === "price-low") {
      return (Number(a.discounted_price ?? a.regular_price ?? 0) || 0) -
        (Number(b.discounted_price ?? b.regular_price ?? 0) || 0);
    }
    if (sortBy === "price-high") {
      return (Number(b.discounted_price ?? b.regular_price ?? 0) || 0) -
        (Number(a.discounted_price ?? a.regular_price ?? 0) || 0);
    }
    return String(b.created_at || "").localeCompare(String(a.created_at || ""));
  });

  const stats = [
    {
      value: `${totalCourses.toLocaleString()}`,
      label: "Live courses",
      detail: "Current course catalog on the public marketplace.",
    },
    {
      value: `${categories.length.toLocaleString()}`,
      label: "Course categories",
      detail: "Browse by subject, program type, or learning track.",
    },
    {
      value: `${courses.filter((course) => Number(course.discounted_price ?? course.regular_price ?? 0) === 0).length}`,
      label: "Free options",
      detail: "Courses with no price attached.",
    },
    {
      value: `${courses.reduce((sum, course) => sum + (Number(course.enrolled_students) || 0), 0).toLocaleString()}`,
      label: "Tracked learners",
      detail: "Visible demand from the current course list.",
    },
  ];

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.push(`/learninghub/course-list?${params.toString()}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    params.set("page", "1");
    router.push(`/learninghub/course-list?${params.toString()}`);
  };

  const handleCategory = (id) => {
    const params = new URLSearchParams(searchParams);
    if (String(id) === String(categoryId)) params.delete("category");
    else params.set("category", String(id));
    params.set("page", "1");
    router.push(`/learninghub/course-list?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicMarketplaceHero
        eyebrow="Course marketplace"
        title="Browse courses with a cleaner public marketplace experience."
        description="The course catalog is now framed like a real public entry point: search, filter, compare, and jump into the course detail page."
        stats={stats}
        primaryAction={{ label: "Explore scholarships", href: "/scholarships" }}
        secondaryAction={{ label: "View learning hubs", href: "/learninghubs" }}
        note="This page intentionally links into the main course detail route used by the public web."
      />

      <PublicMarketplaceSection
        eyebrow="Search and filters"
        title="Find the right course faster"
        description="Use the live filters, then open a course detail page for the full syllabus, instructor, and institute context."
      >
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search courses by name or topic..."
              className="h-12 rounded-2xl border-slate-200 pl-10"
            />
          </form>

          <Select
            value={categoryId || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                const params = new URLSearchParams(searchParams);
                params.delete("category");
                params.set("page", "1");
                router.push(`/learninghub/course-list?${params.toString()}`);
                return;
              }
              handleCategory(value);
            }}
          >
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most recent</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="price-low">Price: low to high</SelectItem>
              <SelectItem value="price-high">Price: high to low</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="h-12 rounded-2xl border-slate-200 bg-white text-slate-700"
            onClick={() => {
              setSearchInput("");
              router.push("/learninghub/course-list");
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categoriesLoading ? (
            <Badge className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
              Loading categories...
            </Badge>
          ) : categories.length ? (
            categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategory(category.id)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  String(categoryId) === String(category.id)
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {category.name}
              </button>
            ))
          ) : (
            <Badge className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
              No categories loaded
            </Badge>
          )}
        </div>
      </PublicMarketplaceSection>

      <PublicMarketplaceSection
        eyebrow="Course results"
        title={selectedCategory ? `${selectedCategory.name} courses` : "All courses"}
        description={
          selectedCategory?.description ||
          `Showing ${visibleCourses.length} course${visibleCourses.length === 1 ? "" : "s"} in the current view.`
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-full border-slate-200 bg-white text-slate-700"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-slate-200 bg-white text-slate-700"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : visibleCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course) => {
              const price = Number(course.discounted_price ?? course.regular_price ?? 0);
              const originalPrice = Number(course.regular_price ?? price);
              const isFree = price === 0;
              return (
                <PublicMarketplaceCard key={course.id} className="h-full">
                  <div className={`relative h-52 ${emptyStateCover}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.75))]" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge className="rounded-full bg-white/15 text-white backdrop-blur">
                        {course.course_category?.name || "Course"}
                      </Badge>
                      {isFree ? (
                        <Badge className="rounded-full bg-emerald-500/90 text-white">
                          Free
                        </Badge>
                      ) : null}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                        {course.institute?.name || course.institute_name || "ScholarPASS Institute"}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-white">
                        {course.name}
                      </h3>
                    </div>
                  </div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">
                        <BookOpen className="mr-2 h-3.5 w-3.5" />
                        {course.course_duration || "Self paced"}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {Number(course.rating_score || 0).toFixed(1)}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg text-slate-950">
                      {course.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                      {course.short_description || course.description || "Course details available on the detail page."}
                    </p>
                    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Price</p>
                        <p className="text-sm font-semibold text-slate-950">
                          {isFree ? "Free" : `$${price.toFixed(2)}`}
                        </p>
                        {!isFree && originalPrice > price ? (
                          <p className="text-xs text-slate-500 line-through">
                            ${originalPrice.toFixed(2)}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Learners</p>
                        <p className="text-sm font-semibold text-slate-950">
                          {(Number(course.enrolled_students) || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 rounded-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    >
                      <Link href={`/learninghub/course-details/${course.id}`}>
                        View details
                      </Link>
                    </Button>
                    <Button
                      className="flex-1 rounded-full bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => router.push(`/direct-checkout/${course.id}`)}
                    >
                      Enroll
                    </Button>
                  </CardFooter>
                </PublicMarketplaceCard>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Sparkles className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950">No courses found</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Try a different search term or reset the filters to see the full catalog.
            </p>
          </div>
        )}
      </PublicMarketplaceSection>

      <section className="container mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current page</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{currentPage}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total pages</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{totalPages}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Navigation</p>
              <div className="mt-2 flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white text-slate-700"
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

