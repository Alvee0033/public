"use client";

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Award,
  Briefcase,
  TrendingUp,
  Sparkles,
  Clock,
  GraduationCap,
  BookOpen,
  Target,
  ArrowRight,
  Shield,
  Rocket,
  Bot,
} from "lucide-react"
import Image from "next/image"
import axios from "@/lib/axios"
import useSWR from "swr"
import { useRouter } from "next/navigation";

const scholarshipJourney = [
  {
    step: "1",
    title: "Select Career Goal",
    description: "Choose your desired career path. Our AI recommends the perfect bootcamp bundle for your goals.",
    icon: Target,
  },
  {
    step: "2",
    title: "Get ScholarPASS PLUS",
    description: "Subscribe to ScholarPASS PLUS. Counselors & AI create your personalized learning bundle.",
    icon: Rocket,
  },
  {
    step: "3",
    title: "Facilitate Scholarships",
    description: "We match you with up to 75% scholarship funding to make your education affordable.",
    icon: Award,
  },
  {
    step: "4",
    title: "Learn & Practice",
    description: "Attend university courses, live classes, and practice labs with expert assistance.",
    icon: BookOpen,
  },
  {
    step: "5",
    title: "Job Placement",
    description: "Get dedicated job placement assistance to launch your new career successfully.",
    icon: Briefcase,
  },
]

export default function CareerBootcampsPage() {
  const getCourses = async () => {
    try {
      const res = await axios.get(
        `/courses?limit=1000&filter=${JSON.stringify({
          regular_course_or_bootcamp_course: true,
        })}`
      );

      if (!res?.data?.data || !Array.isArray(res?.data?.data)) {
        return [];
      }

      return res.data.data;
    } catch (error) {
      console.error("Error fetching bootcamp courses:", error);
      return [];
    }
  };
  const router = useRouter();
  

  const {
    data: courses = [],
    isLoading,
    error,
  } = useSWR("career-bootcamp-courses", getCourses, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const transformedCourses = courses.map(course => {
    const cleanDescription = (desc) => {
      if (!desc) return "Description not available";
      const withoutHtml = desc.replace(/<[^>]*>/g, '');
      return withoutHtml.length > 100 ? withoutHtml.substring(0, 100) + '...' : withoutHtml;
    };

    return {
      id: course.id,
      title: course.name || course.title || "Course Title",
      duration: course.duration || "Duration not specified",
      university: course.university || course.institution || "University not specified",
      description: cleanDescription(course.description),
      skills: course.skills || [],
      basePrice: course.price || course.base_price || 0,
      scholarshipPrice: course.discounted_price || course.scholarship_price || Math.round((course.price || course.base_price || 0) * 0.25),
      placement: course.placement_rate || "N/A",
      salary: course.average_salary || "Salary not specified",
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/diverse-students-collaborating-on-digital-devices-.jpg"
            alt="Students learning"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-blue-600/90 to-cyan-600/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-8 bg-white/20 backdrop-blur-sm text-white border-0 px-8 py-3 text-lg font-semibold">
              <Sparkles className="h-5 w-5 mr-2 inline" />
              University-Certified Career Bootcamps
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-balance">Career BootCamp Bundles</h1>
            <p className="text-2xl md:text-3xl mb-12 text-white/95 text-pretty max-w-5xl mx-auto leading-relaxed">
              The <span className="font-bold">1+1 Dual-Certificate Model</span>: University-certified academic
              excellence combined with ScholarPASS Applied Lab hands-on training. 2 Weeks Onsite | 6 Weeks | 12 Weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="text-xl px-12 py-8 bg-white text-purple-600 hover:bg-gray-100 shadow-2xl"
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="h-6 w-6 mr-3" />
                Explore Programs
              </Button>
            </div>

            {/* Stats in Hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">15,000+</div>
                <div className="text-xl text-white/90">Graduates Placed</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">94%</div>
                <div className="text-xl text-white/90">Placement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">75%</div>
                <div className="text-xl text-white/90">Scholarship Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">$98k</div>
                <div className="text-xl text-white/90">Avg Starting Salary</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Partners */}
      <section className="py-12 bg-white dark:bg-gray-950 border-b">
        <div className="container mx-auto px-4">
          <p className="text-center text-xl text-muted-foreground mb-8 font-semibold">Trusted University Partners</p>
          {/* Add university logos here when available */}
        </div>
      </section>

      {/* Key Benefits Section */}
      <section id="benefits" className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mb-20 text-center mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">The ScholarPASS 1+1 Dual-Certificate Model</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              We integrate world-class university learning with hands-on, industry-verified training. Every graduate
              earns both an academic credential and a technical job-ready certification.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {[
              {
                title: "Dual-Credential Pathway",
                description:
                  "Earn a University Certificate from top institutions (MITx, HarvardX, Stanford) plus a ScholarPASS Applied Lab Certificate with live project documentation.",
                icon: Award,
              },
              {
                title: "Live Instructor Sessions",
                description:
                  "Weekly interactive workshops with 2–3 ScholarPASS-certified mentors per cohort to guide your learning journey.",
                icon: Users,
              },
              {
                title: "STEM Labs & Practice",
                description:
                  "Access real hardware and software environments in our AI & Robotics Labs to apply theoretical learning to real-world projects.",
                icon: Bot,
              },
              {
                title: "Employer-Verified Skills",
                description:
                  "Complete real-world capstones under the supervision of corporate mentors, ensuring you are technically job-ready.",
                icon: Briefcase,
              },
              {
                title: "Digital Transcript",
                description:
                  "Every achievement and skill is recorded on the blockchain-verified ScholarPASS Wallet for easy sharing with employers.",
                icon: Shield,
              },
              {
                title: "AI Learning Buddy",
                description:
                  "Personalized digital mentor that tracks your performance and supports adaptive learning throughout the program.",
                icon: Sparkles,
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-950 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all border flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mb-20 text-center mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">Top 12 Highly Demanded Career Bootcamp Bundles</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              Comprehensive bundles with <span className="font-bold text-foreground">dual certification</span> and{" "}
              <span className="font-bold text-foreground">75% scholarship coverage</span>
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {transformedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <Badge className="mb-3 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-0 w-fit text-sm px-3 py-1">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {course.university}
                  </Badge>

                  <h3 className="text-xl font-bold mb-2 text-balance leading-tight">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{course.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{course.duration}</span>
                  </div>

                  <div className="pt-4 border-t mb-4">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-sm text-muted-foreground">Regular Fee:</span>
                       <span className="text-lg text-muted-foreground line-through">
                         ${course.basePrice.toLocaleString()}
                       </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-base font-bold">ScholarPASS+:</span>
                       <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                         ${course.scholarshipPrice.toLocaleString()}
                       </span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg px-3 py-2 text-center">
                       <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                         ✓ 75% Scholarship Applied
                       </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-muted-foreground flex items-center gap-1.5">
                         <TrendingUp className="h-4 w-4 text-green-600" />
                         Placement Rate
                       </span>
                       <span className="font-bold text-green-600">{course.placement}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-muted-foreground flex items-center gap-1.5">
                         <Briefcase className="h-4 w-4 text-blue-600" />
                         Avg Salary
                       </span>
                       <span className="font-bold text-blue-600">{course.salary}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full text-sm py-5 bg-purple-600 hover:bg-purple-700 shadow-lg mt-auto"
                    onClick={() => {
                      router.push(`/learninghub/course-details/${course.id}`);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarship Journey Section */}
      <section
        id="journey"
        className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/10 dark:via-blue-950/10 dark:to-cyan-950/10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">Your Career Goal Journey</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              From goal selection to career placement in 5 simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 max-w-7xl mx-auto">
            {scholarshipJourney.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="relative">
                  <div className="text-center p-6 bg-white dark:bg-gray-950 rounded-xl border-2 hover:shadow-2xl transition-all h-full flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-xl shrink-0">
                      {item.step}
                    </div>
                    <Icon className="h-10 w-10 text-purple-600 mb-4 shrink-0" />
                    <h3 className="text-xl font-bold mb-3 leading-tight">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  {idx < scholarshipJourney.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-purple-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl text-white"
              onClick={() => router.push("/all-courses")}
            >
              <Target className="h-6 w-6 mr-3" />
              Start Your Application Today
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join 15,000+ professionals who&apos;ve launched successful tech careers through ScholarPASS
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="text-xl px-12 py-8 bg-white text-purple-600 hover:bg-gray-100 shadow-2xl"
              onClick={() => router.push("/all-courses")}
            >
              <Sparkles className="h-6 w-6 mr-3" />
              Explore All Programs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-12 py-8 border-3 border-white text-white hover:bg-white/10 bg-transparent"
              onClick={() => window.open('https://scholarpass.com/guide', '_blank')}
            >
              <Shield className="h-6 w-6 mr-3" />
              Download Program Guide
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
