"use client";
import CourseCard from "@/components/shared/CourseCard";
import { instance } from "@/lib/axios";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import useSWR from "swr";
import CourseBlockSkeleton from "../shared/courseBlockSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import Button from "../shared/buttons/Button";

const BootCamp = () => {
  const router = useRouter();
  const swiperRef = useRef(null);

  const getCourses = async () => {
    try {
      const res = await instance.get(
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

  const {
    data: courses = [],
    isLoading,
    error,
  } = useSWR("bootcamp-courses", getCourses, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const handleExplore = (courseId) => {
    router.push(`/learninghub/course-details/${courseId}`);
  };

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
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primaryColor to-secondaryColor bg-clip-text text-transparent">
              Bootcamp Courses
            </h2>
            <Link
              href="/learninghub/bootcamp-courses"
              className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 bg-primaryColor text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <CourseBlockSkeleton key={index} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || courses.length === 0) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Bootcamp Courses
          </h2>
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">
              No bootcamp courses found
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="flex justify-between items-center gap-4 sm:gap-6 my-6 sm:my-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primaryColor to-secondaryColor bg-clip-text text-transparent">
            Bootcamp Courses
          </h2>

          <Button
            className="group border-none bg-primaryColor text-white rounded-lg py-2 px-3 sm:px-4 text-sm sm:text-base flex items-center gap-1 transition-all duration-300 shadow-sm hover:shadow-md"
            asChild
            variant="brand2"
          >
            <Link
              href="/learninghub/bootcamp-courses"
              className="flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>

        <div className="relative group">
          {/* Custom Navigation Arrows */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-300 transition-colors -translate-x-4"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-300 transition-colors translate-x-4"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={4}
            breakpoints={breakpoints}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            grabCursor={true}
            className="px-6 cursor-grab select-none"
          >
            {courses.map((course) => (
              <SwiperSlide key={course.id}>
                <div className="h-full pb-2">
                  <CourseCard
                    course={{
                      ...course,
                      master_course_level_id: "bootcamp",
                    }}
                    onExplore={handleExplore}
                    className="cursor-grab active:cursor-grabbing select-none"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default BootCamp;
