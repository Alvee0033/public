import parseHtml from "@/lib/parseHtml";
import { Clock, GraduationCap, Star, Users } from "lucide-react";

export default function OverlayContent({ course }) {
  return (
    <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
      <div className="max-w-3xl">
        {/* Course Category Badge */}
        <div className="mb-4">
          <span className="bg-primary/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {course?.course_category?.name}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {course?.name}
        </h1>
        <p className="text-xl text-white/90 mb-6">
          {parseHtml(course?.short_description)}
        </p>

        {/* Course Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-white/80">
          {/* Duration - only show if exists */}
          {course?.course_duration && (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {course.course_duration}
            </span>
          )}

          {/* Students - only show if greater than 0 */}
          {course?.enrolled_students > 0 && (
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {course.enrolled_students} students
            </span>
          )}

          {/* Credits - only show if greater than 0 */}
          {course?.credits > 0 && (
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {course.credits} credits
            </span>
          )}

          {/* Rating - only show if exists */}
          {course?.rating_score && (
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {course.rating_score}/5
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
