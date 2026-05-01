import CourseCard from "@/components/shared/CourseCard";
import { instance } from "@/lib/axios";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import useSWR from "swr";
import CourseBlockSkeleton from "../shared/courseBlockSkeleton";
import SectionTitle from "../shared/section-title";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function AllCourses() {
    const router = useRouter();
    const swiperRef = useRef(null);

    const getCourses = async () => {
        try {
            const res = await instance.get("/courses");
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
    } = useSWR("courses", getCourses, {
        revalidateOnFocus: false,
    });

    const handleExplore = (courseId) => {
        router.push(`/learninghub/course-details/${courseId}`);
    };

    const breakpoints = {
        320: {
            slidesPerView: 1,
            spaceBetween: 16
        },
        640: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 24
        },
        1280: {
            slidesPerView: 4,
            spaceBetween: 24
        }
    };

    return (
        <div className="bg-gradient-to-br container p-4 rounded-lg mt-10 relative">
            <SectionTitle
                title="Tutorsplan Courses"
                path="/learninghub/course-list"
            />

            {isLoading ? (
                <CourseBlockSkeleton count={3} />
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-red-500">
                        Failed to load courses. Please try again later.
                    </p>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                    <BookOpen className="h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">
                        No courses found
                    </h3>
                </div>
            ) : (
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
                        modules={[Autoplay]}
                        spaceBetween={24}
                        slidesPerView={4}
                        breakpoints={breakpoints}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: true,
                        }}
                        grabCursor={true}
                        className="px-6 cursor-grab select-none"
                    >
                        {courses.map((course) => (
                            <SwiperSlide key={course.id}>
                                <div className="h-full pb-2">
                                    <CourseCard
                                        course={course}
                                        onExplore={handleExplore}
                                        className="cursor-grab active:cursor-grabbing select-none"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
}