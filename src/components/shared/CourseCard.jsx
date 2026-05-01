"use client";

import { courseNotFound } from "@/assets/images";
import {
  BookOpen,
  Clock,
  GraduationCap,
  MessageSquare,
  Play,
} from "lucide-react";
import Image from "next/image";
import Button from "./buttons/Button";

const CourseCard = ({ course, onExplore }) => {
  // Extract course data with proper fallbacks
  const title = course?.name || "Name Not Found";
  const grade = course?.course_category?.name || "Grade Not Found";
  const level = course?.master_course_level_id ? "Advanced" : "Beginner";
  const imageUrl = course?.image || courseNotFound; // Use default image if none provided

  // Format price data with proper fallbacks
  const fee = course?.regular_price || 0;
  const scholarpass = course?.discounted_amount || 0;
  const youPay = course?.discounted_price || 0;
  const hasScholarship = course?.has_scholarship === true;

  // Handle explore button click
  const handleExplore = () => {
    if (onExplore) {
      onExplore(course?.id);
    } else {
      // Default to linking to course details page
      window.location.href = `/learninghub/course-details/${course?.id}`;
    }
  };

  return (
    <div
      className=" bg-white border rounded-lg border-[#E9EAF0]"
    // style={{ gap: "14px", paddingBottom: "14px" }}
    >
      {/* Course Image */}
      <div className="relative w-full h-[189px]">
        <Image
          src={imageUrl}
          alt={title || "Course image"}
          fill
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = courseNotFound;
          }}
        />
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col " style={{ gap: "14px" }}>
        {/* Title and Level */}
        <div className="flex justify-between items-start min-h-[50px]">
          <div>
            <h3 className="font-bold text-[20px] leading-[22px] tracking-[0%] text-[#1D2026] line-clamp-2">
              {title}
            </h3>
            <p className="font-medium text-[12px] leading-[22px] tracking-[-1%] text-[#8C94A3]">
              {grade || "\u00A0"}
            </p>
          </div>
          {/* <span className="w-[67px] h-[20px] px-[12px] py-[6px] bg-blue-600 text-white rounded-[43px] font-medium text-[10px] leading-[22px] tracking-[-1%] flex items-center justify-center shrink-0">
            {level}
          </span> */}
        </div>

        {/* Features */}
        <div className="space-y-4 min-h-[180px]">
          {
            // course?.number_of_live_tutors_lessons && 
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600 shrink-0" size={20} />
              <span className="text-[#8C94A3] font-medium text-[12px] leading-[22px] tracking-[-1%]">
                {course?.number_of_live_tutors_lessons || 60} × 1:1 Tutoring
                Sessions
              </span>
            </div>
          }
          <div className="flex items-center gap-3">
            <GraduationCap className="text-blue-600 shrink-0" size={20} />
            <span className="text-[#8C94A3] font-medium text-[12px] leading-[22px] tracking-[-1%]">
              60 × Group Tutoring Sessions
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Play className="text-blue-600 shrink-0" size={20} />
            <span className="text-[#8C94A3] font-medium text-[12px] leading-[22px] tracking-[-1%]">
              Unlimited Self-Learning Lessons
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600 shrink-0" size={20} />
            <span className="text-[#8C94A3] font-medium text-[12px] leading-[22px] tracking-[-1%]">
              {course?.number_of_labs || 40} × STEM & Robotics Lab Sessions
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="text-blue-600 shrink-0" size={20} />
            <span className="text-[#8C94A3] font-medium text-[12px] leading-[22px] tracking-[-1%]">
              Instant Tutoring Available
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-100 pt-4 mt-auto min-h-[100px]">
          <p className="text-[#4E5566] font-bold text-[14px] leading-[20px] tracking-[-1%] mb-1">
            Fee: ${fee.toLocaleString()}
          </p>

          {/* Always maintain space for scholarship info */}
          <div className="">
            {hasScholarship && (
              <p className="text-[#4E5566] font-bold text-[14px] leading-[20px] tracking-[-1%]">
                ScholarPASS: ${scholarpass.toLocaleString()}{" "}
                <span className="font-normal">
                  (You pay ${youPay.toLocaleString()})
                </span>
              </p>
            )}
          </div>

          {/* Button */}
          <Button
            onClick={handleExplore}
            isFullWidth={true}
            className="w-full py-3 rounded-lg font-semibold text-[14px] leading-[100%] tracking-[-1%] capitalize text-white mt-4 mb-2 border-none text-center"
            style={{}}
          >
            Explore Course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
