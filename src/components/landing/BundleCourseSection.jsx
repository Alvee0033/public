import CourseCard from "@/components/shared/CourseCard";
import { instance } from "@/lib/axios";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import useSWR from "swr";
import CourseBlockSkeleton from "../shared/courseBlockSkeleton";
import SectionTitle from "../shared/section-title";

export default function BundleCourseSection() {
    const router = useRouter();
    const swiperRef = useRef(null);

    const getCourses = async () => {
        try {
            const res = await instance.get(`/courses?limit=1000&filter=${JSON.stringify({
                single_or_bundle_course: true,
            })}`);
            return res?.data?.data || [];
        } catch (error) {
            console.error("Error fetching bundle courses:", error);
            return [];
        }
    };


    const {
        data: courses = [],
        isLoading,
        error,
    } = useSWR("bundle-courses", getCourses, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });

    const handleExplore = (courseId) => {
        router.push(`/learninghub/course-details/${courseId}`);
    };

    // Responsive breakpoints configuration
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
        <div className="bg-gradient-to-br container p-4 rounded-lg mt-10">
            <SectionTitle
                title="Bundle Courses"
                path="/learninghub/bundle-course"
            />

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(4).fill(0).map((_, index) => (
                        <CourseBlockSkeleton key={index} />
                    ))}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-red-500">
                        Failed to load bundle courses. Please try again later.
                    </p>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                    <BookOpen className="h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">
                        No bundle courses available
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
                        onAutoplayStop={() => {
                            if (swiperRef.current) {
                                swiperRef.current.autoplay.start();
                            }
                        }}
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

                    {/* View All Button */}
                    <div className="flex justify-center mt-10">
                        <Button className="text-white px-8 py-3 rounded-xl border-none bg-primaryColor">
                            <Link href="/learninghub/bundle-course">View All Bundle Courses</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Button component (if not already imported)
const Button = ({ children, className = "", ...props }) => {
    return (
        <button
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Link component (if not already imported)
const Link = ({ href, children, ...props }) => {
    return (
        <a href={href} className="text-white no-underline" {...props}>
            {children}
        </a>
    );
};