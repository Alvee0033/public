"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "@/lib/axios";
import {
  BadgeCheck,
  Calendar,
  Filter,
  GraduationCap,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PublicMarketplaceCard,
  PublicMarketplaceHero,
  PublicMarketplaceSection,
} from "@/components/public-marketplace/PublicMarketplaceShell";

const getScholarships = async () => {
  try {
    const res = await axios.get("/scholarships");
    return Array.isArray(res?.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return [];
  }
};

function formatDeadline(value) {
  if (!value) return "No deadline listed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No deadline listed";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ScholarshipsPage() {
  const router = useRouter();
  const { data: apiScholarships = [] } = useSWR("scholarships", getScholarships, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const [search, setSearch] = useState("");
  const [fundingFilter, setFundingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  const scholarships = apiScholarships.map((scholarship, index) => {
    const amount = Number(scholarship.amount || 0);
    const typeLabel = scholarship.for_tuition_fee_or_cash_scholarship
      ? "Tuition/Cash"
      : "Scholarship";
    return {
      id: scholarship.id || index,
      title: scholarship.name || "Scholarship Opportunity",
      sponsor: scholarship.company?.name || "ScholarPASS Network",
      amount: amount > 0 ? `$${amount.toLocaleString()}` : "Funding available",
      deadline: formatDeadline(scholarship.application_deadline),
      eligibility:
        scholarship.eligibility_criteria || "Open to eligible students in the ScholarPASS network.",
      applicants: scholarship.scholarship_student_applications?.length || 0,
      typeLabel,
      renewable: Boolean(scholarship.renewable_scholarship),
      tuitionOrCash: Boolean(scholarship.for_tuition_fee_or_cash_scholarship),
      rawDeadline: scholarship.application_deadline,
      rawAmount: amount,
    };
  });

  const visibleScholarships = scholarships
    .filter((item) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return [item.title, item.sponsor, item.eligibility, item.typeLabel]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    })
    .filter((item) => {
      if (fundingFilter === "all") return true;
      if (fundingFilter === "tuition") return item.tuitionOrCash;
      if (fundingFilter === "renewable") return item.renewable;
      if (fundingFilter === "cash") return !item.tuitionOrCash;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.rawDeadline || "2999-12-31") - new Date(b.rawDeadline || "2999-12-31");
      }
      if (sortBy === "amount") {
        return (b.rawAmount || 0) - (a.rawAmount || 0);
      }
      if (sortBy === "applications") {
        return (a.applicants || 0) - (b.applicants || 0);
      }
      return a.title.localeCompare(b.title);
    });

  const stats = [
    {
      value: `${scholarships.length.toLocaleString()}`,
      label: "Active scholarships",
      detail: "Pulled from the current backend scholarship catalog.",
    },
    {
      value: `${scholarships.filter((item) => item.renewable).length}`,
      label: "Renewable awards",
      detail: "Awards that can support multiple terms or cycles.",
    },
    {
      value: `${scholarships.filter((item) => item.tuitionOrCash).length}`,
      label: "Tuition / cash eligible",
      detail: "Funding that can flow directly into tuition or cash support.",
    },
    {
      value: `${scholarships.reduce((sum, item) => sum + (item.applicants || 0), 0).toLocaleString()}`,
      label: "Tracked applications",
      detail: "Based on scholarship application records in the system.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicMarketplaceHero
        eyebrow="EduMarket"
        title="Find scholarships that fit the course, cost, and student profile."
        description="A cleaner public scholarship marketplace with better matching, clear deadlines, and a direct path into the application flow."
        stats={stats}
        primaryAction={{ label: "Apply now", href: "/scholarship-application" }}
        secondaryAction={{ label: "View matching profile", href: "/lms/student-dashboard/scholarship-matching-profile" }}
        note="This page is designed as a public entry point for the scholarship marketplace in Feature 4."
      />

      <section className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by scholarship name, sponsor, or eligibility..."
              className="h-12 rounded-2xl border-slate-200 pl-10"
            />
          </div>

          <Select value={fundingFilter} onValueChange={setFundingFilter}>
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
              <SelectValue placeholder="Funding type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All funding types</SelectItem>
              <SelectItem value="tuition">Tuition / cash eligible</SelectItem>
              <SelectItem value="renewable">Renewable only</SelectItem>
              <SelectItem value="cash">Cash focused</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="amount">Highest amount</SelectItem>
              <SelectItem value="applications">Fewest applications</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="h-12 rounded-2xl border-slate-200 bg-white text-slate-700"
            onClick={() => {
              setSearch("");
              setFundingFilter("all");
              setSortBy("deadline");
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pb-4">
        <div className="flex flex-wrap gap-3">
          <Badge className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100">
            <TrendingUp className="mr-2 h-4 w-4" />
            AI matching ready
          </Badge>
          <Badge className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 hover:bg-emerald-100">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verified funding source
          </Badge>
          <Badge className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200">
            <Landmark className="mr-2 h-4 w-4" />
            Scholarship catalog
          </Badge>
        </div>
      </section>

      <PublicMarketplaceSection
        eyebrow="Marketplace results"
        title="Curated scholarships"
        description={`Showing ${visibleScholarships.length} result${visibleScholarships.length === 1 ? "" : "s"} from the live catalog.`}
        actions={
          <Button
            className="rounded-full bg-blue-600 px-5 text-white hover:bg-blue-700"
            onClick={() => router.push("/scholarship-application")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Start application
          </Button>
        }
      >
        {visibleScholarships.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleScholarships.map((scholarship) => (
              <PublicMarketplaceCard key={scholarship.id} className="h-full">
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-fit rounded-full bg-slate-100 text-slate-700">
                        {scholarship.typeLabel}
                      </Badge>
                      <CardTitle className="text-xl leading-7 text-slate-950">
                        {scholarship.title}
                      </CardTitle>
                    </div>
                    <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/70">
                        Funding
                      </div>
                      <div className="text-lg font-semibold">{scholarship.amount}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-full border-slate-200 text-slate-600">
                      <BadgeCheck className="mr-2 h-3.5 w-3.5" />
                      {scholarship.sponsor}
                    </Badge>
                    {scholarship.renewable ? (
                      <Badge className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        Renewable
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Deadline</p>
                      <p className="text-sm font-medium text-slate-900">{scholarship.deadline}</p>
                    </div>
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>

                  <p className="line-clamp-4 text-sm leading-6 text-slate-600">
                    {scholarship.eligibility}
                  </p>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Applications tracked
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {scholarship.applicants.toLocaleString()}
                      </p>
                    </div>
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    onClick={() => router.push(`/scholarships/${scholarship.id}`)}
                  >
                    View details
                  </Button>
                  <Button
                    className="flex-1 rounded-full bg-slate-950 text-white hover:bg-slate-800"
                    onClick={() => router.push("/scholarship-application")}
                  >
                    Apply
                  </Button>
                </CardFooter>
              </PublicMarketplaceCard>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950">No scholarships match these filters</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Clear the filters or try a broader search term to see more opportunities.
            </p>
            <Button
              className="mt-6 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                setSearch("");
                setFundingFilter("all");
                setSortBy("deadline");
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </PublicMarketplaceSection>

      <section className="container mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
                <Zap className="h-4 w-4" />
                ScholarPASS Plus
              </div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Use matching data to reduce the search, then move into one clean application flow.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-white/70">
                This public page is now structured like a real marketplace entry point, with filters, clear cards, and a direct path into the scholarship application screen.
              </p>
            </div>
            <Button
              className="h-12 rounded-full bg-white px-6 text-slate-950 hover:bg-slate-100"
              onClick={() => router.push("/scholarship-application")}
            >
              Apply to a scholarship
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

