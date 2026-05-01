import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Brain,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Menu,
} from "lucide-react";
import Link from "next/link";

export default function ScholarPassLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ScholarPASS
                </span>{" "}
                <span className="text-slate-900 dark:text-white">PLUS</span>
              </h1>
              <p className="text-2xl text-slate-700 dark:text-slate-300 font-semibold">
                Personalized Learning & Upskilling with Scholarships
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Scholarship AI Agents + Live Mentors = Guaranteed Success
              </p>

              {/* Pricing Card */}
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg max-w-sm bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-5xl font-black text-blue-600">
                        $120
                      </span>
                      <span className="text-lg text-slate-600 dark:text-slate-400 ml-2">
                        /year
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Just{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      $10/month
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    Limited Time Offer
                  </div>
                </CardContent>
              </Card>

              {/* Key Benefits Header */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Key Benefits of ScholarPASS
                </h3>

                {/* Key Benefits Icons */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Auto-Apply 24/7
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Live Mentors
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Unlimited Access
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/payment">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold text-lg px-12 py-7 shadow-xl hover:scale-105 transition-all"
                >
                  Start Your ScholarPASS Journey Now 🚀
                </Button>
              </Link>

              {/* Pricing Card */}
            </div>

            {/* Right Image/Visual */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img
                  src="/images/minority-family-scholarships.jpg"
                  alt="African American mother and son applying for scholarships together"
                  className="w-full h-auto"
                />
                {/* Floating UI Elements */}
                <div className="absolute top-6 right-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl p-4 border-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        AI Active
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Applying to scholarships...
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-40 left-6 bg-blue-600 text-white rounded-2xl shadow-xl p-5 border-2 border-blue-400">
                  <div className="text-sm font-semibold mb-1">
                    Scholarships Found
                  </div>
                  <div className="text-4xl font-black">$50K+</div>
                </div>
                <div className="absolute bottom-6 right-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl p-4 border-2 border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Success Rate
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-black text-green-600">
                      94%
                    </div>
                    <div className="text-xs text-slate-500">This month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

      {/* 4 Key Services Detail Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
                Complete ScholarPASS Services
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need for academic success and scholarship funding
                in one powerful platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Service 1: Scholarship AI Agent + Wallet */}
              <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                        Scholarship Agent with AI
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Scholarship AI Agent + Wallet
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Our AI agent works 24/7 to discover and automatically apply
                    to 1000+ scholarship opportunities globally.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                      What You Get:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          Instant $120 scholarship points upon enrollment
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          Auto-discover and apply to 1000+ global databases
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          Use scholarship wallet for K12 tutoring or boot camps
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          Average student wins $8,500+ in scholarships
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Service 2: K12 Tutoring */}

              {/* Service 3: Global College Admission */}
              <Card className="border-2 border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">
                        Higher Education Support
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Global College Admission with Scholarship AI Agent
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Expert guidance from Harvard/MIT admissions counselors
                    combined with AI-powered scholarship discovery.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                      Expert Guidance For:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          College application strategy from admission experts
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          AI agent finds college-specific scholarships
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          Career planning with Fortune 500 counselors
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
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

      <div className="h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent"></div>

      {/* Why Section - 5 Features */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Why Choose ScholarPASS?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Experience the most comprehensive and personalized learning
              platform designed for your success
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {/* Feature 1: Scholarship Coverage */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Maximum Course Fees Covered with Scholarships
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
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
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Personalized Blended Learning Methodology
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                      Everyone's learning process is unique. For each course
                      enrollment, students complete online diagnostics,
                      interactive games, and live teacher assessments to
                      determine their ideal learning format.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                        Learning Modes Include:
                      </h4>
                      <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                            1.
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            <strong>AI-Developed Self-Learning Lessons</strong>{" "}
                            (built from best-in-class learning datasets)
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                            2.
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            <strong>Online Live 1:1 or Group Classes</strong>
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                            3.
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
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
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Best Learning Process Flow
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                      Our proven methodology ensures deep understanding and
                      long-term retention through active learning and continuous
                      feedback.
                    </p>
                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border-2 border-blue-300 dark:border-blue-700">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          1
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-white mb-2">
                          Assessment First
                        </h5>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                          <li>Diagnostic Exam</li>
                          <li>Online Games</li>
                          <li>Expert Interviews</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          →
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                          Learn First
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          From classroom or self-learning lessons
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          →
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                          Teach & Revise
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          To another student or with AI Tutor
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          →
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                          Identify Gaps
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          & Learn the Gaps
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          ✓
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                          Sign Off
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
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
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Bundle Courses from Renowned Universities and Educators
                      with Local STEM Labs
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                      ScholarPASS offers bundle courses that combine world-class
                      education with hands-on local experiences.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                        Includes:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300">
                            Renowned universities such as MIT, Harvard,
                            Stanford, IIT, and more
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300">
                            Local Labs and Instructors
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300">
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
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                    Complete Academic Success Package
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white mb-6">
                  ScholarPASS PLUS
                </h2>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      $120
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mb-2">
                    per year
                  </div>
                </div>

                <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
                  Just $10/month for unlimited everything
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Scholarship AI Agent - Auto-applies 24/7
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Multiple Academic Course Training AI Agents
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Multiple Live Mentors across all subjects
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Personalized Course Development just for you
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Unlimited Access to Local Labs & Live Classes
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Verified student portfolio and credentials
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Access to 1000+ global scholarship database
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/payment">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold text-lg py-7 shadow-xl hover:scale-105 transition-all"
                  >
                    Get Complete Access Now 🚀
                  </Button>
                </Link>

                {/* Trust Text - Removed 30-day guarantee as requested */}
                <div className="text-center text-slate-500 dark:text-slate-400 text-xs mt-6">
                  <span>Cancel anytime</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
    </div>
  );
}
