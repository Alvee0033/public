"use client";

import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowRight,
  FileText,
  GraduationCap,
  Loader2,
  Sparkles,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import {
  PublicMarketplaceHero,
  PublicMarketplaceSection,
} from "@/components/public-marketplace/PublicMarketplaceShell";

export default function ScholarshipApplicationPage() {
  const router = useRouter();
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [applicationText, setApplicationText] = useState("");
  const [applicationDate] = useState(new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scholarshipSummary, setScholarshipSummary] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      setStudentId(user?.student_id ?? null);
    } catch (err) {
      console.error("Failed to read user from localStorage", err);
      setStudentId(null);
    }
  }, []);

  const loadOptions = async (inputValue = "") => {
    try {
      const res = await axios.get("/scholarships", {
        params: { limit: 1000 },
      });
      const items = res?.data?.data ?? [];
      const filtered = items
        .filter(Boolean)
        .map((s) => ({
          value: s.id,
          label: s.name,
          meta: s,
        }));

      if (!inputValue) return filtered;
      const q = inputValue.toLowerCase();
      return filtered.filter((o) =>
        (o.label || "").toLowerCase().includes(q),
      );
    } catch (err) {
      console.error("Failed to load scholarships", err);
      return [];
    }
  };

  const handleScholarshipChange = async (opt) => {
    setSelectedScholarshipId(opt?.value ?? null);
    setScholarshipSummary(
      opt?.meta
        ? {
            title: opt.meta.name || "Scholarship",
            amount:
              opt.meta.amount != null ? `$${Number(opt.meta.amount).toLocaleString()}` : "Funding available",
            deadline: opt.meta.application_deadline || null,
            renewable: Boolean(opt.meta.renewable_scholarship),
          }
        : null,
    );
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!selectedScholarshipId) {
      setError("Please select a scholarship.");
      return;
    }
    if (!studentId) {
      setError("Student not found. Please login.");
      return;
    }
    if (!applicationText || applicationText.trim() === "") {
      setError("Please write your application.");
      return;
    }

    const payload = {
      student_application_essay: applicationText,
      application_date: applicationDate,
      scholarship: Number(selectedScholarshipId),
      student: Number(studentId),
      tuition_fee_or_cash_scholarship: true,
    };

    try {
      setSubmitting(true);
      await axios.post("/scholarship-student-applications", payload);
      setSuccess("Application submitted successfully.");
      setTimeout(() => router.push("/lms/student-dashboard/my-scholarships"), 900);
    } catch (err) {
      console.error("Failed to submit application", err);
      setError(err?.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const quickSteps = [
    "Pick a scholarship from the live catalog.",
    "Write a short motivation statement.",
    "Submit once and track everything in your dashboard.",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicMarketplaceHero
        eyebrow="Scholarship application"
        title="A faster, cleaner way to submit your scholarship request."
        description="This flow is built for the public web: choose a scholarship, write your statement, and send it into the student dashboard without getting lost in a clunky form."
        stats={[
          { value: "3", label: "Simple steps", detail: "Select, write, submit." },
          { value: "1", label: "Source of truth", detail: "The live scholarship record." },
          { value: "0", label: "Hidden friction", detail: "No extra admin detours." },
          { value: "24/7", label: "Access", detail: "Apply whenever the opportunity is open." },
        ]}
        primaryAction={{ label: "Browse scholarships", href: "/scholarships" }}
        secondaryAction={{ label: "My scholarships", href: "/lms/student-dashboard/my-scholarships" }}
        note="Designed to feel like part of the same EduMarket experience as the scholarship listing page."
      />

      <PublicMarketplaceSection
        eyebrow="Application flow"
        title="Submit an application"
        description="The left side captures the application. The right side keeps the process understandable and lightweight."
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <CardHeader className="space-y-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Badge className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <WandSparkles className="mr-2 h-4 w-4" />
                  Guided submission
                </Badge>
              </div>
              <CardTitle className="text-2xl text-slate-950">
                Scholarship Application
              </CardTitle>
              <CardDescription className="text-slate-600">
                Choose a scholarship, explain your case, and submit it into your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Select a scholarship
                </div>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptions}
                  onChange={handleScholarshipChange}
                  placeholder="Choose a scholarship..."
                  classNamePrefix="scholarship-select"
                />
                {scholarshipSummary ? (
                  <div className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Title</p>
                      <p className="text-sm font-medium text-slate-950">{scholarshipSummary.title}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Amount</p>
                      <p className="text-sm font-medium text-slate-950">{scholarshipSummary.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Renewable</p>
                      <p className="text-sm font-medium text-slate-950">
                        {scholarshipSummary.renewable ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Application essay
                </div>
                <Textarea
                  value={applicationText}
                  onChange={(e) => setApplicationText(e.target.value)}
                  placeholder="Write why you should receive this scholarship, what you plan to study, and how it supports your goals."
                  className="min-h-[240px] rounded-2xl border-slate-200 bg-white p-4 text-slate-800 shadow-inner focus-visible:ring-blue-500"
                />
              </div>

              {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
              {success ? (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              ) : null}
            </CardContent>
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    Submit application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                onClick={() => router.push("/scholarships")}
              >
                Back to scholarships
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <Badge className="w-fit rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  What happens next
                </Badge>
                <CardTitle className="text-xl text-slate-950">Submission flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-slate-600">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
              <CardHeader>
                <Badge className="w-fit rounded-full bg-white/10 text-white hover:bg-white/15">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Student dashboard
                </Badge>
                <CardTitle className="text-xl text-white">Track your scholarship status in one place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-white/75">
                  Once submitted, the application is visible in your `My Scholarships` page with its current status and any scholarship detail already attached to the record.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PublicMarketplaceSection>
    </div>
  );
}

