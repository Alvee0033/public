"use client";

import { courseNotFound } from "@/assets/images";
import CustomImage from "@/components/core/CustomImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, FileCheck, GraduationCap, Heart, PlayCircle, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CourseCard({ course }) {
    const router = useRouter();
    const colorScheme = {
        gradient: "from-indigo-600 to-blue-500",
        accent: "text-indigo-600",
        hover: [
            "hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50/50", // indigo
            "hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50/50", // blue
            "hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50/50", // emerald
            "hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50/50", // amber
        ],
    };

    const hoverClass = colorScheme.hover[course.id % colorScheme.hover.length];

    return (
        <Card
            className={`p-6 bg-white relative group overflow-hidden flex flex-col h-full transition-all duration-500 ease-in-out
        ${hoverClass} hover:shadow-lg hover:shadow-gray-100/50`}
        >
            <div className="absolute right-4 top-4 z-10">
                <button className="text-rose-500 hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 hover:fill-rose-500 transition-colors" />
                </button>
            </div>
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden group/image">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/image:translate-x-full transition-transform duration-1000 ease-in-out z-10"></div>
                <CustomImage
                    src={course.image}
                    alt={course?.name}
                    fill
                    className="object-cover group-hover/image:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 border-0 group-hover/image:border-2 border-white/40 transition-all duration-500 ease-out rounded-lg"></div>
                {course?.has_scholarship && (
                    <div
                        className={`absolute bottom-2 left-2 bg-gradient-to-r ${colorScheme.gradient} text-white px-2 py-1 rounded-full text-xs`}
                    >
                        Scholarship Available
                    </div>
                )}
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {course?.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 capitalize">
                {course?.short_description?.replace(/(<([^>]+)>)/gi, '')}
            </p>

            <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className={`w-4 h-4 ${colorScheme.accent}`} />
                    <span>{course?.course_duration} Duration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className={`w-4 h-4 ${colorScheme.accent}`} />
                    <span>{course?.tutoring_session} Tutoring Sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PlayCircle className={`w-4 h-4 ${colorScheme.accent}`} />
                    <span>{course?.number_of_video_lessons} Video Lessons</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className={`w-4 h-4 ${colorScheme.accent}`} />
                    <span>{course?.number_of_book_lessons} Book Lessons</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileCheck className={`w-4 h-4 ${colorScheme.accent}`} />
                    <span>{course?.number_of_modules} Modules</span>
                </div>
            </div>

            <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 ring ring-black/10">
                            <AvatarImage
                                src={course?.manager_employee?.profile_picture_id}
                                alt="Instructor"
                            />
                            <AvatarFallback>{course?.manager_employee?.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">
                            {course?.manager_employee?.name || "Instructor"}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-gray-500 text-sm line-through">
                            ${course?.regular_price || 0}
                        </span>
                        <span className="font-bold text-lg ml-2">
                            ${course?.discounted_price || 0}
                        </span>
                    </div>
                </div>

                <Button
                    variant="brand2"
                    className={`w-full bg-gradient-to-r ${colorScheme.gradient} text-white relative overflow-hidden group/btn
                hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300
                before:absolute before:inset-0 before:bg-[length:200%_100%] before:bg-gradient-to-r
                before:from-transparent before:via-white/10 before:to-transparent
                before:animate-[shimmer_2s_infinite] before:opacity-0 hover:before:opacity-100`}
                    asChild
                >
                    <Link href={`/learninghub/course-details/${course?.id}`}>
                        <span className="relative flex items-center justify-center gap-2">
                            <span className="font-semibold group-hover/btn:translate-x-1 transition-transform">
                                Explore Course
                            </span>
                            <svg
                                className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </span>
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
