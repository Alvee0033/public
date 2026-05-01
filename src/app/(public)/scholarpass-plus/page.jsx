"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Brain,
  Target,
  BookOpen,
  Wallet,
} from "lucide-react";

export default function ScholarPASSPlusPage() {
  const isSignedUp = false; // This would come from authentication

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 text-center text-sm font-bold">
        🎉 First-Time Signup: Get $120 Credit in Your SP Wallet + Subscriber
        Discounts on All Courses!
      </div>

      {/* Hero Section - Enhanced Design */}
      {!isSignedUp && (
        <section className="relative py-10 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
              {/* LEFT CONTENT */}
              <div className="space-y-4 ">
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ScholarPASS
                  </span>{" "}
                  <span className="text-slate-900">PLUS</span>
                </h1>
                <p className="text-xl text-slate-700 font-semibold">
                  Personalized Learning & Upskilling with Scholarships
                </p>
                <p className="text-base text-slate-600">
                  Scholarship AI Agents + Live Mentors = Guaranteed Success
                </p>

                {/* KEY BENEFITS ICONS */}
                <div className="flex items-center gap-4 flex-wrap pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      Auto-Apply 24/7
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      Live Mentors
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      Unlimited Access
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-blue-600">
                        $120
                      </span>
                      <span className="text-base text-slate-600">/year</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Just{" "}
                      <span className="font-bold text-slate-900">
                        $10/month
                      </span>{" "}
                      • Annual Plan Only
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold px-8 py-6 shadow-xl"
                    asChild
                  >
                    <Link href="/get-started">Start Your Success Journey</Link>
                  </Button>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200">
                  <img
                    src="/images/parents-and-kids-collaborating-on-scholarship-appl.jpg"
                    alt="Parents and kids applying for scholarships"
                    className="w-full h-auto"
                  />
                  {/* FLOATING SUCCESS BADGE */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-lg shadow-lg px-3 py-2">
                    <div className="text-xs font-bold">$1,600+ Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4 Key Services Detail Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Service 1: Scholarship AI Agent + Wallet */}
              <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                        Scholarship Agent with AI
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Scholarship AI Agent + Wallet Credit
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Our AI agent works 24/7 to discover and automatically apply
                    to 1000+ scholarship opportunities globally.
                  </p>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-bold text-slate-900 mb-4">
                      What You Get:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          <strong>Instant $120 SP Wallet Credit</strong> upon
                          first-time enrollment (equals your annual fee!)
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          <strong>Exclusive Subscriber Pricing</strong> - Buy
                          all courses at discounted rates
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          Auto-discover and apply to 1000+ global scholarship
                          databases
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          Use scholarship wallet credits for K12 tutoring,
                          bootcamps, or any course
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          Average student wins $8,500+ in scholarships per year
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Service 2: K12 Tutoring */}

              {/* Service 3: Global College Admission */}
              <Card className="border-2 border-green-100 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">
                        Higher Education Support
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Global College Admission with Scholarships
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Expert guidance from Harvard/MIT admissions counselors
                    combined with AI-powered scholarship discovery.
                  </p>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-bold text-slate-900 mb-4">
                      Expert Guidance For:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          College application strategy from admission experts
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          AI agent finds college-specific scholarships
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          Career planning with Fortune 500 counselors
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          Portfolio building and application support
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Service 4: Career Boot Camps */}
            </div>
          </div>
        </div>
      </section>

      {/* Why Section - 5 Features */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Feature 1: Scholarship Coverage */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Special Course Fee for ScholarPASS Plus members
                    </h3>
                    <p className="text-lg text-slate-600">
                      Our AI automatically finds and applies for scholarships
                      across online courses, local and international schools,
                      colleges, and even sports programs — saving time while
                      maximizing opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: Blended Learning */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Personalized Blended Learning Methodology
                    </h3>
                    <p className="text-lg text-slate-600 mb-6">
                      Everyone's learning process is unique. For each course
                      enrollment, students complete online diagnostics,
                      interactive games, and live teacher assessments to
                      determine their ideal learning format.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-bold text-slate-900 mb-4">
                        Learning Modes Include:
                      </h4>
                      <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-purple-600 flex-shrink-0">
                            1.
                          </span>
                          <span className="text-slate-700">
                            <strong>AI-Developed Self-Learning Lessons</strong>{" "}
                            (built from best-in-class learning datasets)
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-purple-600 flex-shrink-0">
                            2.
                          </span>
                          <span className="text-slate-700">
                            <strong>Online Live 1:1 or Group Classes</strong>
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-purple-600 flex-shrink-0">
                            3.
                          </span>
                          <span className="text-slate-700">
                            <strong>
                              Local Labs Practice and Classroom Training
                            </strong>
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3: Learning Process */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Best Learning Process Flow
                    </h3>
                    <p className="text-lg text-slate-600 mb-6">
                      Our proven methodology ensures deep understanding and
                      long-term retention through active learning and continuous
                      feedback.
                    </p>
                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-300">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          1
                        </div>
                        <h5 className="font-bold text-slate-900 mb-2">
                          Assessment First
                        </h5>
                        <ul className="text-xs text-slate-600 space-y-1">
                          <li>Diagnostic Exam</li>
                          <li>Online Games</li>
                          <li>Expert Interviews</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          →
                        </div>
                        <h5 className="font-bold text-slate-900 mb-1">
                          Learn First
                        </h5>
                        <p className="text-sm text-slate-600">
                          From classroom or self-learning lessons
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          →
                        </div>
                        <h5 className="font-bold text-slate-900 mb-1">
                          Teach & Revise
                        </h5>
                        <p className="text-sm text-slate-600">
                          To another student or with AI Tutor
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          →
                        </div>
                        <h5 className="font-bold text-slate-900 mb-1">
                          Identify Gaps
                        </h5>
                        <p className="text-sm text-slate-600">
                          & Learn the Gaps
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          ✓
                        </div>
                        <h5 className="font-bold text-slate-900 mb-1">
                          Sign Off
                        </h5>
                        <p className="text-sm text-slate-600">
                          Complete mastery achieved
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4: Bundle Courses */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Bundle Courses from Renowned Universities and Educators
                      with Local STEM Labs
                    </h3>
                    <p className="text-lg text-slate-600 mb-6">
                      ScholarPASS offers bundle courses that combine world-class
                      education with hands-on local experiences.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-bold text-slate-900 mb-4">
                        Includes:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">
                            Renowned universities such as MIT, Harvard,
                            Stanford, IIT, and more
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">
                            Local Labs and Instructors
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">
                            Project-Based Learning
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5: Mobile App */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Mobile App - Personalized Learning Plan, Gamification,
                      Progress Tracking
                    </h3>
                    <p className="text-lg text-slate-600">
                      Set both short- and long-term learning goals, track
                      progress through games and exams, receive personalized
                      course recommendations, earn scholarships, and visualize
                      your journey to success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Buy Now Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <Card className="border-4 border-blue-200 shadow-2xl overflow-hidden">
              {/* GREEN TOP BAR */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 text-center">
                <span className="font-bold text-sm">
                  Complete Academic Success Package
                </span>
              </div>

              <CardContent className="p-10 bg-white">
                {/* TITLE */}
                <h2 className="text-3xl font-black text-center text-slate-900 mb-6">
                  ScholarPASS PLUS
                </h2>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      $120
                    </span>
                    <span className="text-lg text-slate-600">/year</span>
                  </div>
                  <div className="text-slate-600 mb-2">
                    Annual Subscription Only
                  </div>
                </div>

                <p className="text-center text-slate-600 mb-8">
                  Just $10/month for unlimited everything
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border-2 border-green-200">
                    <Wallet className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-900 font-bold block mb-1">
                        $120 SP Wallet Credit (First-Time Members)
                      </span>
                      <span className="text-xs text-slate-600">
                        Use for any course, tutoring, or bootcamp enrollment
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                    <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-900 font-bold block mb-1">
                        Exclusive Subscriber Pricing on All Courses
                      </span>
                      <span className="text-xs text-slate-600">
                        Get 20-40% off regular course prices as a ScholarPASS
                        Plus member
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      Scholarship AI Agent - Auto-applies 24/7 to 1000+
                      opportunities
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Brain className="text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      Multiple Academic Course Training AI Agents
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      Multiple Live Mentors across all subjects
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      Personalized Course Development just for you
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      Unlimited Access to Local Labs & Live Classes
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      Verified student portfolio and credentials
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      Access to 1000+ global scholarship database
                    </span>
                  </div>
                </div>

                {/* CTA BUTTON */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold text-lg py-7 shadow-xl hover:scale-105 transition-all"
                  asChild
                >
                  <Link href="/get-started">
                    Get Complete Access Now - $120/Year
                  </Link>
                </Button>

                {/* TRUST TEXT */}
                <div className="text-center text-slate-500 text-xs mt-6">
                  <span>Cancel anytime • Annual billing only</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
