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
            <div className="mb-8">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000 }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={breakpoints}
                onSwiper={(s) => (swiperRef.current = s)}
              >
                {courses.length > 0 ? (
                  courses.slice(0, 12).map((course) => (
                    <SwiperSlide key={course.id}>
                      <Card className="p-4">
                        <CardContent className="flex gap-4 items-center">
                          <div className="w-24 h-16 relative">
                            {course.feature_image ? (
                              <Image src={course.feature_image} alt={course.title} fill className="object-cover rounded" />
                            ) : (
                              <div className="bg-gray-200 w-full h-full rounded" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.short_description || course.description || ''}</p>
                            <div className="mt-2">
                              <Button size="sm" onClick={() => handleExplore(course.id)}>Explore</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="text-center p-8">No trending courses available.</div>
                )}
              </Swiper>
            </div>
          </>
        )}

        {activeHubTab === "schools" && (
          <div className="grid md:grid-cols-3 gap-6">
            {stores.length > 0 ? (
              stores.slice(0, 6).map((store) => (
                <Card key={store.id} className="p-4">
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${store.gradientFrom} flex items-center justify-center text-white`}>
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{store.title}</h4>
                        <p className="text-sm text-gray-600">{store.description}</p>
                        <div className="mt-2">
                          <Button size="sm" onClick={() => router.push(`/store/${store.id}`)}>View Store</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-8">No local schools or stores found.</div>
            )}
          </div>
        )}

        {/* End of section - close container */}
      </div>
    </section>
  );
}

// exported via declaration above