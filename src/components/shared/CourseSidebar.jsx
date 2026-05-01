import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "@/lib/axios";
import { checkCourseEnrollment } from "@/lib/enrollment";
import { useAppSelector } from "@/redux/hooks";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import CustomImage from "../core/CustomImage";
import InfoCard from "../core/InfoCard";
import Button from "./buttons/Button";

export default function CourseSidebar({ course }) {
  const { push } = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const role = (typeof user?.roles?.[0] === 'string' ? user.roles[0] : user?.roles?.[0]?.name)?.toLowerCase() || "";
  const shouldCheckEnrollment = isLoggedIn && course?.id;

  const { data: enrollmentData, isLoading: isCheckingEnrollment } = useSWR(
    shouldCheckEnrollment ? `enrollment-${course.id}` : null,
    () => checkCourseEnrollment(course.id),
    {
      onError: (error) => {
        console.error("Error checking enrollment:", error);
      },
    }
  );

  const isEnrolled =
    shouldCheckEnrollment && enrollmentData?.authError
      ? false
      : !!enrollmentData?.enrolled;

  // Fetch tutor details for course_multiple_tutors
  const getTutorDetails = async (tutorId) => {
    try {
      const res = await axios.get(`/tutors/${tutorId}`);
      return res?.data?.data || null;
    } catch (error) {
      console.error("Error fetching tutor details:", error);
      return null;
    }
  };

  const { data: tutorsData, isLoading: tutorsLoading } = useSWR(
    course?.course_multiple_tutors?.length > 0
      ? `course-tutors-${course.id}`
      : null,
    async () => {
      if (!course?.course_multiple_tutors?.length) return [];

      const tutorPromises = course.course_multiple_tutors.map(
        async (tutorMapping) => {
          const tutorDetails = await getTutorDetails(tutorMapping.tutor_id);
          return {
            ...tutorMapping,
            tutor: tutorDetails,
          };
        }
      );

      const tutors = await Promise.all(tutorPromises);
      return tutors.filter((tutor) => tutor.tutor); // Filter out failed requests
    }
  );

  // Check if course is free
  const isFreeCourse =
    (!course?.regular_price || course?.regular_price === 0) &&
    (!course?.discounted_price || course?.discounted_price === 0) &&
    (!course?.price || course?.price === 0);

  // Get the display price
  const getDisplayPrice = () => {
    if (isFreeCourse) return "Free";
    return `$${
      course?.discounted_price || course?.regular_price || course?.price || 0
    }`;
  };

  // Get the original price for strikethrough
  const getOriginalPrice = () => {
    if (isFreeCourse) return null;
    if (course?.discounted_price && course?.regular_price) {
      return course.regular_price;
    }
    return null;
  };

  function handleBuyNow() {
    if (!isLoggedIn) {
      push(`/login?redirect=/learninghub/course-details/${course?.id}`);
    } else if (isFreeCourse) {
      // For free courses, enroll directly
      push(`/lms/student-dashboard/my-courses`);
    } else {
      push(`/direct-checkout/${course?.id}`);
    }
  }

  const redirectToRoleDashboard = async () => {
    try {
      const response = await axios.post("/auth/me");
      const primaryRole = response.data?.data?.primary_role.name.toLowerCase();
      switch (primaryRole) {
        case "student":
          push("/lms/student-dashboard/my-courses");
          break;
        case "tutor":
          push("/lms/tutor-dashboard/course");
          break;
        case "guardian":
          push("/lms/guardian-dashboard/courses/all");
          break;
        default:
          push("/lms/student-dashboard/my-courses");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const isBuyNowDisabled = false;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full gap-4">
            {/* Left: Prices */}
            <div>
              <div className="flex items-end gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {course?.discounted_price
                    ? `$${Number(course.discounted_price).toFixed(2)}`
                    : `$${Number(
                        course?.regular_price || course?.price || 0
                      ).toFixed(2)}`}
                </span>
                {course?.discounted_price && course?.regular_price && (
                  <span className="text-gray-400 line-through text-base sm:text-lg mb-0.5">
                    ${Number(course.regular_price).toFixed(2)}
                  </span>
                )}
              </div>
              {/* You save */}
              {course?.discounted_amount && (
                <div className="text-green-600 text-sm mt-1">
                  You save ${Number(course.discounted_amount).toFixed(2)}
                </div>
              )}
              {/* Timer message */}
              {course?.discounted_percentage && (
                <div className="flex items-center gap-2 mt-3">
                  <svg
                    className="text-red-500 w-5 h-5"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M11 6v5l3 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-red-500 font-medium text-sm">
                    2 days left at this price!
                  </span>
                </div>
              )}
            </div>
            {/* Right: Discount badge */}
            {course?.discounted_percentage && (
              <div className="shrink-0">
                <span className="inline-block bg-blue-100 text-blue-600 font-semibold text-sm sm:text-base px-3 sm:px-4 py-1.5 rounded-md">
                  {Number(course.discounted_percentage)}% Scholarship
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {isCheckingEnrollment ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Checking enrollment...</span>
            </div>
          ) : isEnrolled ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="text-green-600 mr-2" />
                <span className="font-semibold text-green-800">
                  Already Enrolled
                </span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                You have access to this course
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 border-none rounded-md flex items-center justify-center"
                size="lg"
                onClick={redirectToRoleDashboard}
              >
                Go to Course Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full py-3 rounded-lg font-semibold text-[14px] leading-[100%] tracking-[-1%] capitalize text-white mt-4 mb-2 border-none text-center flex items-center justify-center"
              size="lg"
              onClick={handleBuyNow}
              disabled={isBuyNowDisabled}
              title={
                !isLoggedIn
                  ? "Login to enroll in the course"
                  : isFreeCourse
                  ? "Click to enroll in free course"
                  : "Click to enroll in course"
              }
            >
              {isFreeCourse ? "Enroll for Free" : "Buy Now"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
          {!isLoggedIn && <InfoCard>Login to enroll in the course</InfoCard>}
        </div>

        <div className="text-sm text-gray-600 text-center mb-6">
          <span className="flex items-center justify-center gap-2">
            <i className="icofont-ui-rotation"></i>
            45-Days Money-Back Guarantee
          </span>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="font-semibold">
            Course Instructor{tutorsData?.length > 1 ? "s" : ""}
          </h3>

          {tutorsLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Loading instructors...</span>
            </div>
          ) : tutorsData?.length > 0 ? (
            <div className="space-y-4">
              {tutorsData.map((tutorMapping, index) => {
                const tutor = tutorMapping.tutor;
                if (!tutor) return null;

                return (
                  <div
                    key={tutorMapping.id}
                    className="flex items-center gap-4"
                  >
                    {tutor.profile_picture && (
                      <CustomImage
                        src={tutor.profile_picture}
                        alt={tutor.name}
                        width={60}
                        height={60}
                        className="rounded aspect-auto"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {tutor.name || "Instructor"}
                        </p>
                        {tutorMapping.primary_tutor && (
                          <Badge className="bg-blue-100 text-blue-600 text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {tutor.address || tutor.email || "Instructor"}
                      </p>
                      {tutorMapping.number_of_hours > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {tutorMapping.number_of_hours} hours assigned
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No instructors assigned</p>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="font-semibold mb-4">Course Features</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Duration", value: course?.course_duration || "-" },
              { label: "Modules", value: course?.course_modules?.length || 0 },
              {
                label: "Video Lessons",
                value:
                  course?.course_lessons?.filter(
                    (lesson) => lesson.master_video_library_id
                  ).length || 0,
              },
              {
                label: "Live Sessions",
                value:
                  course?.course_lessons?.filter(
                    (lesson) => lesson.master_video_library_id === null
                  ).length || 0,
              },
              {
                label: "Quizzes",
                value: course?.course_lesson_quizs?.length || 0,
              },
              {
                label: "Enrolled Students",
                value: course?.enrolled_students || 0,
              },
              { label: "Credits", value: course?.credits || 0 },
            ].map(({ label, value }) => (
              <li
                key={label}
                className="flex items-center justify-between py-1 border-b border-gray-100"
              >
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-900">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      {/* 
            {course?.course_category_id && (
                <RelatedCourses
                    currentCourseId={course.id}
                    categoryId={course.course_category_id}
                />
            )} */}
    </div>
  );
}
