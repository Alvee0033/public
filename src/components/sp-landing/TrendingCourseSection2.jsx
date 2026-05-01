import { instance } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import CourseCard from "../shared/CourseCard";
import Button from "../shared/buttons/Button";
import CategoryBlockSkeleton from "../shared/categoryBlockSkeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TrendingCourseSection2() {
  const [activeTab, setActiveTab] = useState(null);
  const [hasAnyCourses, setHasAnyCourses] = useState(false);
  const [categoriesWithTrending, setCategoriesWithTrending] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await instance.get(
          "/course-categories?limit=1000"
        );
        const publishedCategories =
          categoriesResponse.data?.data?.filter(
            (category) => category.published_on_public_site
          ) || [];

        const coursesResponse = await instance.get(
          "/courses?limit=1000&filter=" +
            JSON.stringify({ is_trending_course: true })
        );
        const trendingCourses = coursesResponse.data?.data || [];

        const trendingCategoryIds = new Set(
          trendingCourses.map((course) => course.course_category?.id)
        );

        const filteredCategories = publishedCategories.filter((category) =>
          trendingCategoryIds.has(category.id)
        );

        setCategoriesWithTrending(filteredCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const updateHasCourses = (hasCourses) => {
    setHasAnyCourses(hasCourses);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            {/* <span className="text-3xl not-italic pb-4">🔥</span> */}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-4">
              Trending Plans
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular plans that students are loving right now
          </p>
        </div>

        {categoriesWithTrending.length > 0 ? (
          <div className="mb-12">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 px-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === null
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                All
              </button>

              {categoriesWithTrending.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === category.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <CourseGrid activeTab={activeTab} onDataLoaded={updateHasCourses} />
          </div>
        ) : (
          <div className="flex justify-center">
            <CategoryBlockSkeleton count={5} />
          </div>
        )}

        {hasAnyCourses && (
          <div className="text-center mt-12">
            <Link href="/learninghub/trending-course">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

const CourseGrid = ({ activeTab, onDataLoaded }) => {
  const getCourses = async () => {
    try {
      let url = "/courses?limit=1000&filter=";
      const filter = {
        is_trending_course: true,
      };

      if (activeTab) {
        filter["course_category.id"] = activeTab;
      }

      url += JSON.stringify(filter);

      const res = await instance.get(url);

      if (!res?.data?.data || !Array.isArray(res?.data?.data)) {
        return [];
      }
      return res.data.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  const {
    data: courses = [],
    isLoading,
    error,
  } = useSWR(["courses", activeTab], getCourses, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 60000,
  });

  const courseList = Array.isArray(courses) ? courses : [];

  useEffect(() => {
    if (!isLoading && !error) {
      onDataLoaded(courseList.length > 0);
    }
  }, [courseList, isLoading, error, onDataLoaded]);

  const handleExplore = (courseId) => {
    window.location.href = `/learninghub/course-details/${courseId}`;
  };

  const swiperRef = useRef(null);

  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <CategoryBlockSkeleton key={index} />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full flex justify-center items-center min-h-[300px] text-red-500">
        <h3 className="text-lg font-medium">
          Failed to load courses. Please try again later.
        </h3>
      </div>
    );
  }

  if (courseList.length < 1) {
    return (
      <div className="col-span-full flex justify-center items-center min-h-[300px] text-gray-500">
        <h3 className="text-lg font-medium">
          No Courses Found in this category
        </h3>
      </div>
    );
  }

  // Grid display instead of slider
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courseList.slice(0, 8).map((course) => (
        <Card
          key={course.id}
          className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
        >
          <div className="relative h-48 overflow-hidden bg-gray-100">
            {course.image ? (
              <Image
                src={course.image}
                alt={course.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={false}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
              Trending
            </Badge>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                {course.name}
              </h3>
              <p className="text-white/90 text-sm line-clamp-1">
                {course.course_category?.name || "Course"}
              </p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm ml-1">
                  {course.avg_rating || "4.9"}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Popular
              </Badge>
            </div>

            <button
              onClick={() => handleExplore(course.id)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              View Course
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
