import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
const RecommendedPackage = () => {
  return (
    <div>
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recommended ScholarPASS Packages
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect package for your educational journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ScholarPASS Passport Subscription */}
            <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-4">
                <div className="w-fit mb-3 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-sm">
                  Subscription
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  ScholarPASS Passport Subscription
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Complete pathway to scholarships and success
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow px-6">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Personalized Pathway: Set academic or career goals and get
                      a tailored plan (self-learning, live online, or hands-on
                      labs)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Scholarship Matching Engine: Instantly discover 100s of
                      local and global scholarships aligned to your verified
                      profile
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Verified Student Portfolio: A trusted, shareable profile
                      for schools, sponsors, and committees
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Assessment-Driven Readiness: Quick tests, game-based
                      checks, and live interviews to reveal strengths and
                      eligibility
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      2 Mentors & 5 Personalized AI Agents: Unlock real
                      scholarships and resources that reduce tuition and
                      accelerate success
                    </span>
                  </li>
                </ul>
                <div className="text-center mb-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">
                    Regular: $150
                  </div>
                  <div className="text-sm text-slate-500 mb-2">
                    Scholarship: $30
                  </div>
                  <div className="text-3xl font-bold text-[#008fb0]">
                    You Pay: $120
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    yearly
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-0">
                <Link
                  href="scholarpass-packages/scholarpass-passport"
                  className="w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-[#008fb0] to-[#007a95] hover:from-[#007a95] hover:to-[#006680] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Unlimited Tutoring Bundle */}
            <Card className="flex flex-col h-full border-2 border-[#008fb0]/30 relative shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[#008fb0]/5 to-teal-50 transform hover:scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-[#008fb0] to-teal-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  MOST POPULAR
                </div>
              </div>
              <CardHeader className="pb-4 pt-8">
                <div className="w-fit mb-3 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-sm">
                  K-12 Bundle
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Unlimited Tutoring Bundle for K-12
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Complete K-12 support with unlimited tutoring
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow px-6">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Unlimited Sessions: 1:1 and small-group tutoring for
                      homework, concepts, and test prep—whenever you need it
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      All Subjects Covered: Math, ELA, Science, Coding, and more
                      with vetted expert tutors
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      AI-Powered Mastery Tracking: Adaptive recommendations tied
                      to standards; see gaps shrink and grades rise
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Hands-On Learning Access: STEM & Robotics lab time for
                      real projects that make learning stick
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Results & Accountability: Family progress reports, goal
                      milestones, and flexible scheduling
                    </span>
                  </li>
                </ul>
                <div className="text-center mb-6 bg-gradient-to-r from-[#008fb0]/10 to-teal-100 rounded-lg p-4 border border-[#008fb0]/20">
                  <div className="text-sm text-slate-500 mb-1">
                    Regular: $2,400
                  </div>
                  <div className="text-sm text-slate-500 mb-2">
                    Scholarships: $1,800
                  </div>
                  <div className="text-3xl font-bold text-[#008fb0]">
                    You Pay: $600
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-0">
                <Link
                  href="scholarpass-packages/unlimited-tutoring-bundle"
                  className="w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-[#008fb0] to-[#007a95] hover:from-[#007a95] hover:to-[#006680] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Career Bootcamps */}
            <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="pb-4">
                <div className="w-fit mb-3 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-sm">
                  Career Track
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Career Bootcamps with Scholarships
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Industry-aligned training with job placement
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow px-6">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Industry-Aligned Tracks: AI/ML, Cybersecurity, Cloud,
                      Data—built with employer input
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Portfolio-Ready Projects: Lab work and capstones that
                      prove skills to hiring managers
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Mentorship From Pros: Guidance from working practitioners
                      and alumni
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Career Services & Placement: Resume/LinkedIn polish, mock
                      interviews, employer days, and referrals
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#008fb0] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      Lower Cost, Flexible Pay: Scholarships reduce tuition;
                      installment options available
                    </span>
                  </li>
                </ul>
                <div className="text-center mb-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-slate-500 mb-1">
                    Average Fee: $7,500
                  </div>
                  <div className="text-sm text-slate-500 mb-2">
                    Scholarships: $4,000
                  </div>
                  <div className="text-3xl font-bold text-[#008fb0]">
                    You Pay: $3,500
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    with installments
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-0">
                <Link
                  href="scholarpass-packages/career-bootcamps"
                  className="w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-[#008fb0] to-[#007a95] hover:from-[#007a95] hover:to-[#006680] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    Start Career Track
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecommendedPackage;
