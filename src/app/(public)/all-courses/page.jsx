"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import {
    GraduationCap,
    Clock,
    BookOpen,
    Star,
    Search,
    SlidersHorizontal,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import PrimeCourse from "@/components/landing/PrimeCourse";

const PAGE_SIZE = 12;

const CourseListPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryId = searchParams.get("category");
    const searchQuery = searchParams.get("search") || "";
    const currentPage = Number(searchParams.get("page") || 1);

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    // Inputs state
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
    const [sortBy, setSortBy] = useState("popular"); // new local sort

    // Fetch categories
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

    // Fetch courses with filters
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                let filterObj = {};
                if (categoryId) filterObj.course_category = categoryId;
                if (searchQuery) filterObj.name = { $regex: searchQuery, $options: "i" };

                const filter = Object.keys(filterObj).length ? JSON.stringify(filterObj) : undefined;
                const skip = (currentPage - 1) * PAGE_SIZE;

                const response = await axios.get(`/courses`, {
                    params: {
                        filter,
                        skip,
                        limit: PAGE_SIZE,
                    },
                });

                setCourses(response.data.data || []);
                if (response.data.meta && response.data.meta.total) {
                    setTotalCourses(response.data.meta.total);
                    setTotalPages(Math.ceil(response.data.meta.total / PAGE_SIZE));
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [categoryId, searchQuery, currentPage]);

    // Derived sorted courses since backend doesn't seem to support arbitrary sorting
    const visibleCourses = useMemo(() => {
        const arr = [...courses];
        if (sortBy === "rating") {
            arr.sort((a, b) => (Number(b.rating_score) || 0) - (Number(a.rating_score) || 0));
        } else if (sortBy === "price-low") {
            arr.sort((a, b) => (Number(a.discounted_price ?? a.regular_price ?? 0)) - (Number(b.discounted_price ?? b.regular_price ?? 0)));
        } else if (sortBy === "price-high") {
            arr.sort((a, b) => (Number(b.discounted_price ?? b.regular_price ?? 0)) - (Number(a.discounted_price ?? a.regular_price ?? 0)));
        }
        return arr;
    }, [courses, sortBy]);

    // Handle search triggers
    const triggerSearch = () => {
        const params = new URLSearchParams();
        if (searchInput) params.set("search", searchInput);
        if (selectedCategory) params.set("category", selectedCategory);
        params.set("page", "1");
        router.push(`/all-courses?${params.toString()}`);
    };

    const clearAllFilters = () => {
        setSearchInput("");
        setSelectedCategory("");
        setSortBy("popular");
        router.push("/all-courses");
    };
    
    const displayCategoryName = useMemo(() => {
        if (!categoryId) return null;
        return categories.find(c => String(c.id) === String(categoryId))?.name;
    }, [categoryId, categories]);

    const appliedFiltersCount = [searchQuery, categoryId].filter(Boolean).length;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 pb-20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                className="absolute inset-0"
                style={{
                    background:
                    "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(40,132,171,.05) 0%, transparent 60%)," +
                    "radial-gradient(ellipse 50% 50% at 0% 100%, rgba(134,101,170,.05) 0%, transparent 60%)",
                }}
                />
            </div>

            <PrimeCourse />

            <div className="container relative z-10 mx-auto px-4 lg:px-8 mt-10 flex w-full flex-col gap-4">
                
                {/* Header Segment */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                   <div className="flex items-center gap-4">
                      <div className="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-[#E8EDF2] shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-[var(--sp-purple)]">
                         <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-display font-black leading-tight text-[var(--sp-ink)]">
                           Course <span className="text-[var(--sp-purple)]">Catalog</span>
                        </h1>
                        <p className="mt-1 text-sm font-medium text-[var(--sp-muted)] max-w-3xl">
                           {displayCategoryName ? `Exploring ${displayCategoryName}` : "Discover thousands of premium courses curated by ScholarPASS."}
                        </p>
                      </div>
                   </div>
                   
                   <div className="flex flex-col items-end justify-end space-y-1">
                      <div className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] px-2 py-1 rounded bg-[#F1F5F9]">
                         {loading ? "Searching catalog..." : `${totalCourses} Live Courses`}
                      </div>
                   </div>
                </div>

                {/* Ultra-Compact Search & Filters Toolbar */}
                <div className="flex flex-col lg:flex-row items-center gap-2 rounded-[2rem] lg:rounded-full border border-[#E8EDF2] bg-white p-2 shadow-sm">
                  <div className="grid w-full lg:w-auto flex-1 gap-2 grid-cols-1 md:grid-cols-3">
                    
                    {/* Search Field */}
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                        placeholder="Search for courses..."
                        className="h-12 w-full rounded-full border border-slate-100 bg-slate-50 pl-11 pr-5 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-[var(--sp-purple)]/30 focus:border-[var(--sp-purple)] focus:bg-white focus:ring-2 focus:ring-[var(--sp-purple)]/10"
                      />
                    </div>
                    
                    {/* Category Dropdown */}
                    <div className="relative">
                       <select
                         value={selectedCategory}
                         onChange={(e) => {
                             setSelectedCategory(e.target.value);
                             // If we want instantly apply on select dropdown (UX standard):
                             const params = new URLSearchParams();
                             if (searchInput) params.set("search", searchInput);
                             if (e.target.value) params.set("category", e.target.value);
                             params.set("page", "1");
                             router.push(`/all-courses?${params.toString()}`);
                         }}
                         className="h-12 w-full appearance-none rounded-full border border-slate-100 bg-slate-50 pl-5 pr-10 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-[var(--sp-purple)]/30 focus:border-[var(--sp-purple)] focus:bg-white focus:ring-2 focus:ring-[var(--sp-purple)]/10"
                       >
                         <option value="">All Categories</option>
                         {!categoriesLoading && categories.map((c) => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                         ))}
                       </select>
                       <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                          <SlidersHorizontal className="h-4 w-4 text-[var(--sp-muted)]" />
                       </div>
                    </div>

                    {/* Sort Dropdown  */}
                    <div className="relative">
                       <select
                         value={sortBy}
                         onChange={(e) => setSortBy(e.target.value)}
                         className="h-12 w-full appearance-none rounded-full border border-slate-100 bg-slate-50 pl-5 pr-10 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-[var(--sp-purple)]/30 focus:border-[var(--sp-purple)] focus:bg-white focus:ring-2 focus:ring-[var(--sp-purple)]/10"
                       >
                         <option value="popular">Most Popular</option>
                         <option value="rating">Highest Rated</option>
                         <option value="price-low">Price: Low to High</option>
                         <option value="price-high">Price: High to Low</option>
                       </select>
                       <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                          <SlidersHorizontal className="h-4 w-4 text-[var(--sp-muted)]" />
                       </div>
                    </div>

                  </div>
                  
                  <div className="flex w-full lg:w-auto items-center justify-between gap-2 shrink-0 lg:pl-1 mt-2 lg:mt-0">
                     <Button 
                        onClick={triggerSearch}
                        className="h-12 flex-1 rounded-full bg-[var(--sp-purple)] px-6 text-sm font-bold tracking-wide text-white hover:bg-[var(--sp-purple-deep)] shadow-sm lg:w-auto"
                     >
                        Search
                     </Button>
                     {appliedFiltersCount > 0 && (
                        <Button
                          onClick={clearAllFilters}
                          className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-full h-12 px-5 text-xs font-bold uppercase tracking-widest shadow-none"
                        >
                          Clear
                        </Button>
                     )}
                  </div>
                </div>

                {/* Popular Categories Overflow Pill-bar */}
                {!categoriesLoading && categories.length > 0 && !categoryId && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide pt-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 shrink-0 mr-1">Trending:</span>
                        {categories.slice(0, 8).map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    const params = new URLSearchParams(searchParams);
                                    params.set("category", String(cat.id));
                                    params.set("page", "1");
                                    router.push(`/all-courses?${params.toString()}`);
                                }}
                                className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-[var(--sp-purple)] hover:text-[var(--sp-purple)]"
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Results Grid Engine */}
                <div className="mt-8 pb-12">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-[360px] animate-pulse rounded-[2rem] bg-slate-200/50" />
                            ))}
                        </div>
                    ) : visibleCourses.length ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {visibleCourses.map((course, index) => {
                                const price = Number(course.discounted_price ?? course.regular_price ?? 0);
                                const originalPrice = Number(course.regular_price ?? price);
                                const isFree = price === 0;

                                return (
                                    <div 
                                        key={course.id} 
                                        onClick={() => router.push(`/learninghub/course-details/${course.id}`)}
                                        className="group relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-[#E8EDF2] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(134,101,170,0.12)] cursor-pointer shadow-sm"
                                        style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                                    >
                                        {/* Beautiful Hero Cover */}
                                        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-100">
                                            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,23,42,0.6)_100%)] z-10" />
                                            {course.image ? (
                                                <Image
                                                    src={course.image}
                                                    alt={course.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-[var(--sp-purple-light)] to-slate-200" />
                                            )}
                                            
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                                              <Badge className="border-0 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--sp-purple)] shadow-sm">
                                                {course.course_category?.name || "Education"}
                                              </Badge>
                                            </div>

                                            {isFree && (
                                                <div className="absolute top-4 right-4 z-20">
                                                    <Badge className="border-0 bg-emerald-500 shadow-md text-[10px] font-black uppercase tracking-widest text-white">
                                                        Zero Fee
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        {/* Overlapping Institute Logo Node */}
                                        {course.institute?.logo && (
                                            <div className="absolute top-36 right-4 z-30">
                                                <div className="h-14 w-14 overflow-hidden rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-100/50">
                                                    <div className="relative h-full w-full rounded-lg text-slate-100 flex items-center justify-center bg-white overflow-hidden">
                                                        <Image
                                                            src={course.institute.logo}
                                                            alt={course.institute.name || "Institute"}
                                                            fill
                                                            className="object-contain p-0.5"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-1 flex-col px-5 pt-4 pb-5 z-20 bg-white">
                                            <div className="flex justify-between items-start mb-2 gap-2 pr-14">
                                                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-amber-500">
                                                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                                                    {course.rating_score ? Number(course.rating_score).toFixed(1) : "New"}
                                                </div>
                                            </div>
                                            
                                            <h3 className="line-clamp-2 text-lg font-black tracking-tight leading-snug text-[var(--sp-ink)] group-hover:text-[var(--sp-purple)] transition-colors mb-2">
                                                {course.name}
                                            </h3>
                                            
                                            <p className="line-clamp-2 text-xs font-medium leading-relaxed text-[var(--sp-muted)] mb-4">
                                                {course.short_description?.replace(/<[^>]*>?/gm, "") || "Premium course curriculum provided by partner institute."}
                                            </p>

                                            <div className="mt-auto space-y-4 pt-4 border-t border-slate-100">
                                                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                                    {course.course_duration && (
                                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                            {course.course_duration}
                                                        </div>
                                                    )}
                                                    {course.number_of_modules && (
                                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                                            {course.number_of_modules} Mods
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-end justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-0.5">Price</span>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-xl font-black text-[var(--sp-ink)]">
                                                                {isFree ? "Free" : `$${price.toFixed(2)}`}
                                                            </span>
                                                            {!isFree && originalPrice > price && (
                                                                <span className="text-xs font-bold text-slate-400 line-through">
                                                                    ${originalPrice.toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (

                    <div className="flex h-64 flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white shadow-sm">
                        <GraduationCap className="mb-4 h-12 w-12 text-slate-300" />
                        <h3 className="text-lg font-black text-[var(--sp-ink)]">No Courses Found</h3>
                        <p className="mt-2 text-sm font-medium text-[var(--sp-muted)] max-w-sm text-center">
                            We couldn't find any courses matching your filters. Try clearing applied filters or searching different keywords.
                        </p>
                        <Button
                            onClick={clearAllFilters}
                            className="mt-6 rounded-full bg-[var(--sp-purple)] hover:bg-[var(--sp-purple-deep)] font-bold text-white shadow-md shadow-purple-500/20"
                        >
                            Reset Catalog
                        </Button>
                    </div>

                    )}

                    {/* Elite Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination>
                                <PaginationContent className="bg-white rounded-full border border-slate-200 p-1 shadow-sm">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => {
                                                const p = Math.max(1, currentPage - 1);
                                                const params = new URLSearchParams(searchParams);
                                                params.set("page", p);
                                                router.push(`/all-courses?${params.toString()}`);
                                            }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer rounded-full hover:bg-slate-100"}
                                        />
                                    </PaginationItem>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(currentPage - p) < 3 || p === 1 || p === totalPages).map((p, idx, arr) => {
                                        const isGap = idx > 0 && p - arr[idx - 1] > 1;
                                        return (
                                            <React.Fragment key={p}>
                                                {isGap && <PaginationItem><span className="px-3 text-slate-400 font-black tracking-widest">...</span></PaginationItem>}
                                                <PaginationItem>
                                                    <PaginationLink
                                                        onClick={() => {
                                                            const params = new URLSearchParams(searchParams);
                                                            params.set("page", p);
                                                            router.push(`/all-courses?${params.toString()}`);
                                                        }}
                                                        isActive={currentPage === p}
                                                        className={`cursor-pointer rounded-full w-10 h-10 font-bold ${currentPage === p ? 'bg-[var(--sp-purple)] text-white hover:bg-[var(--sp-purple-deep)] hover:text-white' : 'hover:bg-slate-100 border-0 text-slate-600'}`}
                                                    >
                                                        {p}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </React.Fragment>
                                        );
                                    })}
                                    
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => {
                                                const p = Math.min(totalPages, currentPage + 1);
                                                const params = new URLSearchParams(searchParams);
                                                params.set("page", p);
                                                router.push(`/all-courses?${params.toString()}`);
                                            }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer rounded-full hover:bg-slate-100"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Workflow Process Component replacing old text block */}
            <section className="bg-white py-20 mt-10 border-t border-slate-100 rounded-t-[3rem] relative z-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-sky-100 text-sky-800 hover:bg-sky-100 border-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                            Built For Scale
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-display font-black leading-tight text-[var(--sp-ink)] tracking-tight">
                            Start Learning Instantly
                        </h2>
                        <p className="text-[var(--sp-muted)] mt-4 max-w-2xl mx-auto font-medium">
                            Join a global network of premier institutions backing your journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto relative px-4">
                        <div className="absolute top-1/2 left-10 right-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent hidden md:block -z-10" />
                        
                        {[
                            { step: "01", title: "Find a Course", desc: "Browse from thousands of highest quality programs." },
                            { step: "02", title: "Verify Account", desc: "Unlock 100% scholarship coverage instantly." },
                            { step: "03", title: "Global Tutors", desc: "Link with industry experts and premier agencies." },
                            { step: "04", title: "Earn Assets", desc: "Gain certifications tracked on-chain securely." }
                        ].map((item, i) => (
                            <div key={i} className="text-center group bg-white">
                                <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 mx-auto flex items-center justify-center shadow-sm group-hover:-translate-y-2 group-hover:border-[var(--sp-purple)] group-hover:shadow-[0_8px_30px_rgba(134,101,170,0.15)] transition-all duration-300">
                                    <span className="text-xl font-black text-slate-800 group-hover:text-[var(--sp-purple)] transition-colors">{item.step}</span>
                                </div>
                                <h3 className="mt-6 text-lg font-black text-[var(--sp-ink)]">{item.title}</h3>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500 max-w-[14rem] mx-auto">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseListPage;
