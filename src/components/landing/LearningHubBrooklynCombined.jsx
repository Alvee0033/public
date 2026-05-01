import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { instance } from "@/lib/axios";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  MapPin,
  School,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Button from "../shared/buttons/Button";
import { containerVariants, itemVariants } from "./course_data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function LearningHubBrooklynCombined() {
  const [activeHubTab, setActiveHubTab] = useState("courses");
  const [zoneName, setZoneName] = useState("Brooklyn, NY");
  const router = useRouter();
  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const zone = localStorage.getItem("zone");
      if (zone) {
        try {
          const parsed = JSON.parse(zone);
          if (parsed.name) setZoneName(parsed.name);
        } catch {
          // fallback to default
        }
      }
    }
  }, []);

  const {
    data: courses = [],
    error: coursesError,
    isLoading: coursesLoading,
  } = useSWR(["brooklyn-courses", activeHubTab], async () => {
    try {
      const response = await instance.get(
        `/courses?limit=1000&filter=${JSON.stringify({
          is_trending_course: true,
          course_category: activeHubTab === "courses" ? null : activeHubTab,
        })}`
      );
      const apiCourses = response.data.data;
      return apiCourses || [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  });

  const { data: stores = [], error: storesError } = useSWR(
    "/stores",
    async (url) => {
      try {
        const response = await instance.get(url);
        const apiStores = response.data.data;
        return (
          apiStores?.map((store) => ({
            id: store.id,
            title: store.name,
            description: store.description,
            icon: <ShoppingCart className="h-20 w-20 text-white" />,
            location: store.location,
            features: store.features || [],
            gradientFrom: "from-blue-400 to-indigo-300",
            buttonGradient:
              "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
            iconColor: "text-blue-600",
            flagship: store.is_flagship,
            new: store.is_new,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching stores:", error);
        return [];
      }
    }
  );

  const handleViewAllStores = () => router.push("/store");
  const handleViewAllTopSchools = () => router.push("/allTopSchools");
  const handleExplore = (courseId) =>
    router.push(`/learninghub/course-details/${courseId}`);

  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
    1280: { slidesPerView: 4, spaceBetween: 24 },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 text-sm font-medium">
              Local Hub
            </Badge>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {zoneName}
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-4">
              LearningHub - {zoneName}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your complete educational ecosystem in Brooklyn - courses, supplies,
            and top institutions
          </p>
        </motion.div>

        {/* Enhanced Trending Courses Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2 inline-flex">
            <button
              onClick={() => setActiveHubTab("courses")}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeHubTab === "courses"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              Trending Courses
            </button>
            <button
              onClick={() => setActiveHubTab("schools")}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeHubTab === "schools"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <School className="h-5 w-5" />
              Schools
            </button>
          </div>
        </div>

        {/* Courses Tab Content */}
        {activeHubTab === "courses" && (
          <>
            {coursesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading courses...</p>
              </div>
            ) : coursesError ? (
              <div className="text-center text-red-500 py-4">
                Failed to load courses. Please try again later.
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center text-gray-500 py-6 sm:py-8">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
                <p className="text-lg sm:text-xl font-semibold">
                  No trending courses found
                </p>
                <p className="text-sm sm:text-base text-gray-400">
                  Check back later for new courses in Brooklyn
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {courses.slice(0, 4).map((course) => (
                  <Card
                    key={course.id}
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-0 shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {course.image ? (
                        <Image
                          src={course.image}
                          alt={course.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-2">
                          Popular in Brooklyn
                        </Badge>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {course.name}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {course.course_category?.name || "Course"}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          60 x 1:1 Tutoring Sessions
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          60 x Group Sessions
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          Unlimited Self-Learning Lessons
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          {course.course_modules?.length || 0} Modules
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          Instant Tutoring Available
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-lg font-bold text-gray-800">
                          Fee: $
                          {course.regular_price
                            ? course.regular_price -
                              (course.discounted_amount || 0)
                            : 600}
                        </span>
                      </div>

                      <button
                        onClick={() => handleExplore(course.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
                      >
                        Explore Course
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* View All Courses Button */}
            <div className="text-center">
              <Link href="/learninghub/zone-courses">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  View All Brooklyn Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Schools Tab Content */}
        {activeHubTab === "schools" && (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-16"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="justify-center items-center col-span-1 sm:col-span-2">
                <div className="text-center py-8 sm:py-12">
                  <School className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-1 sm:mb-2">
                    No schools found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500">
                    We couldn't find any schools to display.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="text-center">
              <Button
                onClick={handleViewAllTopSchools}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Top Schools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
