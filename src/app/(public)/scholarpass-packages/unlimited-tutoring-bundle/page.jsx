import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  BookOpen,
  Users,
  GraduationCap,
  Laptop,
  CheckCircle2,
} from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-purple-600 text-white hover:bg-purple-700">
              TutorsPlan All-in-One Package
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
              <span className="text-purple-700">ScholarPASS</span>
              <br />
              <span className="text-purple-600">k12 Bundle</span>
            </h1>

            <p className="text-base md:text-lg font-semibold text-purple-700">
              ALL STUDENTS ARE ACCEPTED REGARDLESS OF ETHNIC OR FINANCIAL
              BACKGROUND
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                1 Child or 20+ Child
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                4 Coding BootCamp FREE
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                100+ Live Tutoring sessions
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                Double Scholarship Snapshots
              </Badge>
            </div>

            <div className="space-y-3 bg-white/80 backdrop-blur p-6 rounded-lg border border-purple-200">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Regular Bundle Course Fee
                </span>
                <span className="text-xl font-bold">$2,400</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-medium">
                  ScholarPASS 2X Scholarships
                </span>
                <span className="text-xl font-bold text-purple-600">
                  $1,800
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-green-600 font-semibold">
                  Student Pays Only:
                </span>
                <span className="text-3xl font-bold text-green-600">$600</span>
              </div>
            </div>

            <Link href="/learninghub/course-details/1">
              <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
                Enroll Now $600 in Easy Payments
              </Button>
            </Link>
          </div>

          <div className="relative flex justify-center">
            <img
              src="/images/tutorsplan-online-tutoring.png"
              alt="Student learning with tutor"
              className="w-full max-w-md md:max-w-xl rounded-lg shadow-2xl"
            />
            {/* Badge: attached to image - bottom-right on all sizes */}
            <div className="absolute bottom-0 right-3">
              <Badge className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-1 text-sm md:px-4 md:py-2">
                Summer Coding & Robotics Course - FREE
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-purple-600">
              ScholarPASS K12 Bundle Included
            </h2>
            <p className="text-muted-foreground">
              Comprehensive educational support designed for K-12 students.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-purple-600 mb-2">160</div>
              <div className="text-sm text-muted-foreground">
                Total Tutoring Sessions
              </div>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-purple-600 mb-2">4+1</div>
              <div className="text-sm text-muted-foreground">
                Major Content Covered
              </div>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-purple-600 mb-2">67%</div>
              <div className="text-sm text-muted-foreground">
                Scholarship Savings
              </div>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Students Accepted
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section (styled to match provided screenshot) */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          {/* Big included container */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-6">
                <span className="inline-block bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  INCLUDED IN YOUR BUNDLE
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-purple-600 mt-4">
                  4 Courses of any grades + 1 Coding BootCamp FREE
                </h2>
                <p className="text-muted-foreground mt-2">
                  Comprehensive educational support designed for K-12 students.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                {/* Core Academic Courses */}
                <Card className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <h3 className="text-2xl font-bold text-purple-600">
                      Core Academic Courses
                    </h3>
                  </div>

                  <p className="text-muted-foreground">
                    Choose any 4 grade-appropriate courses from our
                    comprehensive curriculum
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-purple-100 text-purple-700"
                    >
                      Mathematics
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-purple-100 text-purple-700"
                    >
                      Science
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-purple-100 text-purple-700"
                    >
                      English
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-purple-100 text-purple-700"
                    >
                      Social Studies
                    </Badge>
                  </div>
                </Card>

                {/* Coding BootCamp with ribbon */}
                <Card className="p-8 space-y-6 border-2 border-orange-300 relative overflow-hidden bg-white">
                  {/* FREE ribbon - triangular corner style */}
                  <div className="absolute top-0 right-0">
                    <div className="w-0 h-0 border-l-[70px] border-l-transparent border-t-[70px] border-t-orange-500"></div>
                    <span className="absolute top-2 right-2 text-white text-xs font-bold transform rotate-45 origin-center">
                      FREE
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Laptop className="h-8 w-8 text-orange-500" />
                    <h3 className="text-2xl font-bold text-orange-500">
                      Coding BootCamp
                    </h3>
                  </div>

                  <p className="text-muted-foreground">
                    Intensive hands-on coding experience with industry experts
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-orange-100 text-orange-700"
                    >
                      Web Development
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-orange-100 text-orange-700"
                    >
                      App Development
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-orange-100 text-orange-700"
                    >
                      Game Design
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="justify-center py-2 bg-orange-100 text-orange-700"
                    >
                      Robotics & AI
                    </Badge>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-md text-center">
                    <p className="text-sm text-orange-700 font-medium">
                      First 100 students per school get priority access
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Session Types - match screenshot durations and style */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow ">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2 text-purple-700">
                  Group Sessions
                </h4>
                <p className="text-sm text-muted-foreground">
                  60 sessions of 45 minutes each
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2 text-purple-700">1:1 Tutoring</h4>
                <p className="text-sm text-muted-foreground">
                  40 sessions of 20 minutes each
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <GraduationCap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2 text-purple-700">
                  Instant Tutors
                </h4>
                <p className="text-sm text-muted-foreground">
                  60 sessions of 15 minutes each
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-purple-600">
              Affordable Education Through Scholarships
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our double scholarship program makes quality education accessible
              to all K-12 students.
            </p>
            <Badge className="bg-purple-100 text-purple-700">
              Plus ScholarPASS Yearly Fee: $120
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Regular Fee */}
            <Card className="p-8 space-y-6">
              <div className="bg-gray-800 text-white py-3 px-4 -mx-8 -mt-8 mb-6 text-center font-bold rounded-t-lg">
                Regular Fee
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$2,400</div>
                <div className="text-sm text-muted-foreground">
                  Full program value
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span>
                    Includes all 160 tutoring sessions and 4+1 major courses
                  </span>
                </div>
              </div>
            </Card>

            {/* Double Scholarship */}
            <Card className="p-8 space-y-6 border-2 border-purple-500 relative">
              <div className="bg-purple-600 text-white py-3 px-4 -mx-8 -mt-8 mb-6 text-center font-bold rounded-t-lg">
                Double Scholarship
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  $1,800
                </div>
                <div className="text-sm text-muted-foreground">
                  Total scholarship value
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>TutorsPlan K12 Scholarship</span>
                  <span className="font-bold">$900</span>
                </div>
                <div className="flex justify-between">
                  <span>Fintech 150 Gift Scholarship</span>
                  <span className="font-bold">$900</span>
                </div>
              </div>
            </Card>

            {/* Student Pays Only */}
            <Card className="p-8 space-y-6 border-2 border-green-500 relative">
              <div className="bg-green-600 text-white py-3 px-4 -mx-8 -mt-8 mb-6 text-center font-bold rounded-t-lg">
                Student Pays Only
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  $600
                </div>
                <div className="text-sm text-green-700 font-medium">
                  75% savings with scholarships
                </div>
              </div>
              <div className="text-center">
                <Link href="/learninghub/course-details/1">
                  <Button className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                    SIGN UP NOW
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-purple-600 mb-4">
              Why Choose ScholarPASS?
            </h2>
            <p className="text-muted-foreground">
              See how our program compares to traditional tutoring options
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="py-4 px-6 text-left font-bold">Features</th>
                  <th className="py-4 px-6 text-center font-bold">
                    ScholarPASS K12 Bundle
                  </th>
                  <th className="py-4 px-6 text-center font-bold">
                    Traditional Tutoring
                  </th>
                  <th className="py-4 px-6 text-center font-bold">
                    Online Courses
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-purple-50">
                  <td className="py-4 px-6 font-medium">Total Sessions</td>
                  <td className="py-4 px-6 text-center font-bold text-purple-600">
                    160 Sessions
                  </td>
                  <td className="py-4 px-6 text-center">Pay Per Session</td>
                  <td className="py-4 px-6 text-center">Limited Support</td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="py-4 px-6 font-medium">
                    Personalized Learning
                  </td>
                  <td className="py-4 px-6 text-center text-purple-600 font-bold">
                    ✓ Fully Customized
                  </td>
                  <td className="py-4 px-6 text-center">Varies by Tutor</td>
                  <td className="py-4 px-6 text-center">Generic Content</td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="py-4 px-6 font-medium">Scholarship Support</td>
                  <td className="py-4 px-6 text-center text-purple-600 font-bold">
                    ✓ Double Scholarships
                  </td>
                  <td className="py-4 px-6 text-center">✗ None</td>
                  <td className="py-4 px-6 text-center">✗ None</td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="py-4 px-6 font-medium">Coding BootCamp</td>
                  <td className="py-4 px-6 text-center text-purple-600 font-bold">
                    ✓ Included FREE
                  </td>
                  <td className="py-4 px-6 text-center">✗ Extra Cost</td>
                  <td className="py-4 px-6 text-center">Limited</td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="py-4 px-6 font-medium">Cost</td>
                  <td className="py-4 px-6 text-center font-bold text-green-600">
                    $600 (After Scholarships)
                  </td>
                  <td className="py-4 px-6 text-center">$2,000-$5,000+</td>
                  <td className="py-4 px-6 text-center">$500-$1,500</td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="py-4 px-6 font-medium">Student Acceptance</td>
                  <td className="py-4 px-6 text-center text-purple-600 font-bold">
                    ✓ 100% Accepted
                  </td>
                  <td className="py-4 px-6 text-center">Selective</td>
                  <td className="py-4 px-6 text-center">Open Enrollment</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link href="/learninghub/course-details/1">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-lg">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-purple-600">
              Your ScholarPASS Journey
            </h2>
            <p className="text-muted-foreground">
              Simple steps to start your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                Sign Up
              </h3>
              <p className="text-sm text-muted-foreground">
                Purchase ScholarPASS k12 bunde in minutes and pay just $600 to
                start
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                Assessments
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete assessments to identify strengths and areas for
                improvement
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                Training Plan
              </h3>
              <p className="text-sm text-muted-foreground">
                Receive a customized learning plan tailored to your needs
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-lg mb-3 text-green-700">
                Start Learning
              </h3>
              <p className="text-sm text-muted-foreground">
                Begin your 160 tutoring sessions with expert teachers
              </p>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-4">
            <p className="text-lg font-semibold text-purple-700">
              Easy Payment Plan: $600 in easy payments
            </p>
            <p className="text-sm text-muted-foreground">
              All students accepted regardless of background • 75% scholarship
              savings
            </p>
            <Link href="/learninghub/course-details/1">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-lg">
                Start Your Journey Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
